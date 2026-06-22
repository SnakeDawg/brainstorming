#!/usr/bin/env python3
"""medium.py — thin Medium fetch/extract helper.

Self-contained: Python 3.8+ standard library only. No pip installs, no
dependency on anything outside this folder.

This is deliberately *thin*: it exposes only two operations and prints
machine-friendly output to stdout. All orchestration — reading the topics
config, deciding what is new, summarizing, filing into the corpus, indexing,
and querying — lives in the `medium-archive` skill, not here.

  discover <feed-spec> [--limit N]   -> JSON array of candidate articles
  extract  <url>                     -> article body as Markdown

`<feed-spec>` is one of `tag:<x>`, `pub:<x>`, or `author:@<x>`.

Discovery uses Medium's public RSS feeds. Full-text extraction fetches the
article page; for member-only posts you must supply your own Medium session
cookie (you are a paying subscriber accessing content you already have rights
to read — this tool just saves a local copy). The cookie is read at runtime
and never written into any output.

Run `python3 medium.py --help` for usage.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree as ET

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.json"
USER_AGENT = (
    "Mozilla/5.0 (compatible; medium-archive/2.0; personal archival tool)"
)
REQUEST_TIMEOUT = 30
POLITE_DELAY = 1.5  # seconds between network requests (used by callers)

RSS_NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def log(msg: str) -> None:
    print(msg, file=sys.stderr)


# --------------------------------------------------------------------------- #
# Config / auth
# --------------------------------------------------------------------------- #

def load_config() -> dict:
    """Load optional config.json sitting next to this script."""
    if CONFIG_PATH.exists():
        try:
            return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            log(f"warning: could not read config.json ({exc}); ignoring it")
    return {}


def resolve_cookie(args, config: dict) -> str:
    """Resolve the Medium session cookie from CLI > env > cookie file > config.

    The cookie is the value of the `Cookie:` request header, e.g.
    "sid=...; uid=...". Obtain it from your browser dev tools while logged in
    to medium.com (Application/Storage > Cookies, or copy the Cookie request
    header from the Network tab).
    """
    if getattr(args, "cookie", None):
        return args.cookie.strip()
    env = os.environ.get("MEDIUM_COOKIE")
    if env:
        return env.strip()
    cookie_file = getattr(args, "cookie_file", None) or config.get("cookie_file")
    if cookie_file:
        path = Path(cookie_file)
        if not path.is_absolute():
            path = HERE / path
        if path.exists():
            return path.read_text(encoding="utf-8").strip()
        log(f"warning: cookie file {path} not found")
    if config.get("cookie"):
        return str(config["cookie"]).strip()
    return ""


# --------------------------------------------------------------------------- #
# HTTP
# --------------------------------------------------------------------------- #

def http_get(url: str, cookie: str = "") -> bytes:
    headers = {"User-Agent": USER_AGENT, "Accept": "*/*"}
    if cookie:
        headers["Cookie"] = cookie
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.read()


# --------------------------------------------------------------------------- #
# Discovery via RSS
# --------------------------------------------------------------------------- #

def build_feed_url(*, tag=None, publication=None, author=None) -> str:
    if tag:
        return f"https://medium.com/feed/tag/{slugify(tag)}"
    if publication:
        return f"https://medium.com/feed/{publication.lstrip('/')}"
    if author:
        handle = author if author.startswith("@") else f"@{author}"
        return f"https://medium.com/feed/{handle}"
    raise ValueError("one of tag, publication, or author is required")


def parse_feed(xml_bytes: bytes) -> list:
    """Parse a Medium RSS feed into a list of article dicts."""
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []
    items = []
    for item in channel.findall("item"):
        title = _text(item.find("title"))
        link = _text(item.find("link"))
        # Strip Medium tracking params off the link for stable identity.
        link = link.split("?")[0] if link else link
        creator = _text(item.find("dc:creator", RSS_NS))
        pub_date = _text(item.find("pubDate"))
        categories = [
            _text(c) for c in item.findall("category") if _text(c)
        ]
        # Author/publication feeds carry full <content:encoded>; tag feeds
        # only provide a snippet in <description>. Fall back to the latter so
        # tag-feed items aren't silently empty.
        content = _text(item.find("content:encoded", RSS_NS))
        description = _text(item.find("description"))
        items.append(
            {
                "title": title,
                "url": link,
                "author": creator,
                "published": normalize_date(pub_date),
                "tags": categories,
                "content_html": content or description,
            }
        )
    return items


def discover(*, tag=None, publication=None, author=None, limit=15,
             cookie="") -> list:
    feed_url = build_feed_url(tag=tag, publication=publication, author=author)
    log(f"fetching feed: {feed_url}")
    raw = http_get(feed_url, cookie=cookie)
    items = parse_feed(raw)
    return items[: max(0, limit)] if limit else items


# --------------------------------------------------------------------------- #
# Full-text extraction
# --------------------------------------------------------------------------- #

# Medium wraps its UI chrome — byline avatars, clap/bookmark/share/listen
# buttons, "read more" recirculation — in anchors that all carry one of these
# markers. Author-written in-body links keep their original href, so dropping
# these strips the boilerplate without losing real content links.
_CHROME_LINK_MARKERS = (
    "/m/signin", "/plans?", "/membership",
    "source=post_page", "source=---", "source=rss",
)


def _is_chrome_link(href: str) -> bool:
    h = (href or "").lower()
    return any(marker in h for marker in _CHROME_LINK_MARKERS)


class _ArticleExtractor(HTMLParser):
    """Pull the <article> subtree out of a Medium page and convert to Markdown.

    Falls back gracefully: if no <article> tag is present, captures nothing and
    the caller uses the RSS content instead.
    """

    BLOCK_TAGS = {"p", "div", "section", "figure", "figcaption", "ul", "ol",
                  "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0           # nesting depth inside <article>
        self.in_article = False
        self.parts = []
        self._list_stack = []
        self._skip_depth = 0     # inside script/style/svg
        self._skip_anchor = False  # inside a Medium chrome anchor

    # -- helpers ---------------------------------------------------------- #
    def _emit(self, text: str) -> None:
        if self.in_article and self._skip_depth == 0 and not self._skip_anchor:
            self.parts.append(text)

    # -- parser callbacks ------------------------------------------------- #
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "article":
            self.in_article = True
            self.depth = 0
            return
        if not self.in_article:
            return
        self.depth += 1
        if tag in ("script", "style", "svg", "noscript"):
            self._skip_depth += 1
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._emit("\n\n" + "#" * int(tag[1]) + " ")
        elif tag == "p":
            self._emit("\n\n")
        elif tag in ("b", "strong"):
            self._emit("**")
        elif tag in ("i", "em"):
            self._emit("*")
        elif tag == "blockquote":
            self._emit("\n\n> ")
        elif tag == "pre":
            self._emit("\n\n```\n")
        elif tag == "code" and "pre" not in self._list_stack:
            self._emit("`")
        elif tag == "br":
            self._emit("\n")
        elif tag == "hr":
            self._emit("\n\n---\n")
        elif tag == "li":
            marker = "1. " if self._list_stack[-1:] == ["ol"] else "- "
            self._emit("\n" + marker)
        elif tag in ("ul", "ol"):
            self._list_stack.append(tag)
        elif tag == "a" and attrs.get("href"):
            if _is_chrome_link(attrs["href"]):
                self._skip_anchor = True
            else:
                self._emit("[")
                self._href = attrs["href"]
        elif tag == "img" and attrs.get("src"):
            alt = attrs.get("alt", "image")
            self._emit(f"\n\n![{alt}]({attrs['src']})\n")

    def handle_endtag(self, tag):
        if tag == "article" and self.in_article:
            self.in_article = False
            return
        if not self.in_article:
            return
        self.depth -= 1
        if tag in ("script", "style", "svg", "noscript"):
            self._skip_depth = max(0, self._skip_depth - 1)
            return
        if tag in ("b", "strong"):
            self._emit("**")
        elif tag in ("i", "em"):
            self._emit("*")
        elif tag == "pre":
            self._emit("\n```\n")
        elif tag == "code" and "pre" not in self._list_stack:
            self._emit("`")
        elif tag in ("ul", "ol") and self._list_stack:
            self._list_stack.pop()
        elif tag == "a":
            if self._skip_anchor:
                self._skip_anchor = False
            elif getattr(self, "_href", None):
                self._emit(f"]({self._href})")
                self._href = None

    def handle_data(self, data):
        if self.in_article and self._skip_depth == 0:
            self._emit(data)

    def markdown(self) -> str:
        text = "".join(self.parts)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def html_to_markdown(html_text: str) -> str:
    """Convert a fragment or full page of HTML to Markdown.

    If the input contains an <article> element, only that subtree is used.
    Otherwise the whole fragment (e.g. RSS content:encoded) is converted.
    """
    if "<article" not in html_text.lower():
        html_text = f"<article>{html_text}</article>"
    parser = _ArticleExtractor()
    parser.feed(html_text)
    md = html.unescape(parser.markdown())
    return _clean_medium_boilerplate(md)


# Pure-UI text Medium injects into the article body (image lightbox hint, lazy
# placeholders). Stripped because they aren't content. The lightbox phrase is
# glued between a paragraph and its figure caption, so it becomes a break.
_MEDIUM_BOILERPLATE = (
    "Press enter or click to view image in full size",
)
# Short header/footer chrome paragraphs left over once anchors are dropped.
_LEADING_CHROME = {
    "--", "share", "follow", "listen", "sign in", "sign up", "get started",
    "open in app", "member-only story", "·", "more from",
}


def _clean_medium_boilerplate(md: str) -> str:
    for phrase in _MEDIUM_BOILERPLATE:
        md = md.replace(phrase, "\n\n")
    blocks = md.split("\n\n")
    # A leading H1 (the title) is kept, but header chrome can sit just beneath
    # it; trim from there so "-- / Share" residue doesn't lead the body.
    start = 1 if blocks and blocks[0].lstrip().startswith("# ") else 0
    while len(blocks) > start and blocks[start].strip().lower() in _LEADING_CHROME:
        blocks.pop(start)
    md = "\n\n".join(blocks)
    return re.sub(r"\n{3,}", "\n\n", md).strip()


def extract_full_article(url: str, cookie: str) -> str:
    """Fetch an article page and return its body as Markdown ('' on failure)."""
    try:
        raw = http_get(url, cookie=cookie).decode("utf-8", errors="replace")
    except (urllib.error.URLError, urllib.error.HTTPError) as exc:
        log(f"  could not fetch full text ({exc})")
        return ""
    md = html_to_markdown(raw)
    # Heuristic: a paywalled/partial fetch yields very little body text.
    if len(md) < 200:
        return ""
    return md


# --------------------------------------------------------------------------- #
# Utilities (exposed for the skill to reuse via `python3 -c`)
# --------------------------------------------------------------------------- #

def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:80]


def short_hash(text: str) -> str:
    import hashlib
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]


def normalize_date(raw: str) -> str:
    if not raw:
        return ""
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z"):
        try:
            return _dt.datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return raw


def _text(node) -> str:
    if node is None:
        return ""
    return (node.text or "").strip()


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def _parse_feed_spec(spec: str) -> dict:
    """'tag:rag' / 'pub:better-programming' / 'author:@x' -> discover kwargs."""
    kind, _, value = spec.partition(":")
    if not value:
        raise ValueError(f"feed-spec must be kind:value, got {spec!r}")
    kind = kind.lower()
    if kind == "tag":
        return {"tag": value}
    if kind in ("pub", "publication"):
        return {"publication": value}
    if kind == "author":
        return {"author": value}
    raise ValueError(f"unknown feed kind {kind!r} (use tag/pub/author)")


def cmd_discover(args, config) -> int:
    cookie = resolve_cookie(args, config)
    kwargs = _parse_feed_spec(args.feed)
    items = discover(limit=args.limit, cookie=cookie, **kwargs)
    out = [
        {"title": it["title"], "url": it["url"], "author": it["author"],
         "published": it["published"], "tags": it["tags"]}
        for it in items
    ]
    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0 if out else 1


def cmd_extract(args, config) -> int:
    cookie = resolve_cookie(args, config)
    body = extract_full_article(args.url, cookie)
    if not body:
        log("could not extract article body (paywalled without a valid "
            "cookie, or unsupported page layout)")
        return 1
    print(body)
    return 0


def build_parser():
    p = argparse.ArgumentParser(
        description="Thin Medium fetch/extract helper. The skill orchestrates; "
                    "this just discovers feeds and extracts articles.")
    sub = p.add_subparsers(dest="command", required=True)

    def add_auth(sp):
        sp.add_argument("--cookie", help="Medium session cookie")
        sp.add_argument("--cookie-file", help="path to a file holding the cookie")

    d = sub.add_parser("discover", help="list feed candidates as JSON")
    add_auth(d)
    d.add_argument("feed", help="feed spec: tag:<x> | pub:<x> | author:@<x>")
    d.add_argument("--limit", type=int, default=15, help="max items (default 15)")

    e = sub.add_parser("extract", help="print one article as Markdown")
    add_auth(e)
    e.add_argument("url", help="Medium article URL")

    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    config = load_config()
    try:
        return {"discover": cmd_discover, "extract": cmd_extract}[args.command](
            args, config)
    except urllib.error.HTTPError as exc:
        log(f"HTTP error {exc.code}: {exc.reason} ({exc.url})")
        if exc.code in (401, 403):
            log("This looks like an auth issue — check your Medium cookie.")
        return 2
    except (ValueError, urllib.error.URLError) as exc:
        log(f"error: {exc}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
