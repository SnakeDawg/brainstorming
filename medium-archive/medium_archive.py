#!/usr/bin/env python3
"""medium_archive.py — search Medium and archive articles to a local library.

Self-contained: Python 3.8+ standard library only. No pip installs, no
dependency on anything outside this folder.

Discovery uses Medium's public RSS feeds (by tag, publication, or author).
Full-text extraction fetches the article page; for member-only posts you must
supply your own Medium session cookie (you are a paying subscriber accessing
content you already have rights to read — this tool just saves a local copy).

Run `python3 medium_archive.py --help` for usage.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree as ET

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

HERE = Path(__file__).resolve().parent
DEFAULT_LIBRARY = HERE / "library"
CONFIG_PATH = HERE / "config.json"
USER_AGENT = (
    "Mozilla/5.0 (compatible; medium-archive/1.0; personal archival tool)"
)
REQUEST_TIMEOUT = 30
POLITE_DELAY = 1.5  # seconds between network requests

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


def resolve_library(args, config: dict) -> Path:
    raw = (
        getattr(args, "library", None)
        or os.environ.get("MEDIUM_LIBRARY")
        or config.get("library")
    )
    if raw:
        path = Path(raw)
        if not path.is_absolute():
            path = HERE / path
    else:
        path = DEFAULT_LIBRARY
    path.mkdir(parents=True, exist_ok=True)
    return path


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


def parse_feed(xml_bytes: bytes) -> list[dict]:
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


def discover(*, tag=None, publication=None, author=None, limit=10,
             cookie="") -> list[dict]:
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
        self.parts: list[str] = []
        self._list_stack: list[str] = []
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
# Storage
# --------------------------------------------------------------------------- #

def save_article(article: dict, topic: str, library: Path,
                 body_markdown: str) -> Path:
    topic_dir = library / slugify(topic or "uncategorized")
    topic_dir.mkdir(parents=True, exist_ok=True)
    slug = slugify(article.get("title") or "untitled") or "untitled"
    path = topic_dir / f"{slug}.md"
    # Avoid clobbering distinct articles that slugify the same.
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        if article.get("url") and article["url"] not in existing:
            path = topic_dir / f"{slug}-{short_hash(article['url'])}.md"

    front = {
        "title": article.get("title", ""),
        "author": article.get("author", ""),
        "url": article.get("url", ""),
        "published": article.get("published", ""),
        "topic": topic,
        "tags": article.get("tags", []),
        "archived": _dt.date.today().isoformat(),
    }
    path.write_text(render_markdown(front, body_markdown), encoding="utf-8")
    return path


def render_markdown(front: dict, body: str) -> str:
    lines = ["---"]
    for key, value in front.items():
        if isinstance(value, list):
            rendered = "[" + ", ".join(yaml_scalar(v) for v in value) + "]"
        else:
            rendered = yaml_scalar(value)
        lines.append(f"{key}: {rendered}")
    lines.append("---")
    lines.append("")
    lines.append(f"# {front.get('title', '')}".rstrip())
    lines.append("")
    lines.append(_strip_leading_h1(body))
    lines.append("")
    return "\n".join(lines)


def _strip_leading_h1(body: str) -> str:
    """Drop a leading H1 line; render_markdown emits the canonical title itself,
    and extracted/RSS bodies usually repeat it as their first heading."""
    body = body.strip()
    if body.startswith("# "):
        _, _, rest = body.partition("\n")
        return rest.strip()
    return body


def update_catalog(library: Path, entries: list[dict]) -> None:
    """Maintain catalog.json (machine) and INDEX.md (human) at library root."""
    catalog_path = library / "catalog.json"
    catalog: dict[str, dict] = {}
    if catalog_path.exists():
        try:
            for row in json.loads(catalog_path.read_text(encoding="utf-8")):
                catalog[row["url"]] = row
        except (OSError, json.JSONDecodeError, KeyError):
            catalog = {}
    for entry in entries:
        if entry.get("url"):
            catalog[entry["url"]] = entry
    rows = sorted(catalog.values(),
                  key=lambda r: (r.get("topic", ""), r.get("published", "")),
                  reverse=False)
    catalog_path.write_text(json.dumps(rows, indent=2, ensure_ascii=False),
                            encoding="utf-8")
    _write_index_md(library, rows)


def _write_index_md(library: Path, rows: list[dict]) -> None:
    lines = ["# Medium archive index", "",
             f"_{len(rows)} article(s) archived. "
             f"Updated {_dt.date.today().isoformat()}._", ""]
    by_topic: dict[str, list[dict]] = {}
    for row in rows:
        by_topic.setdefault(row.get("topic") or "uncategorized", []).append(row)
    for topic in sorted(by_topic):
        lines.append(f"## {topic}")
        lines.append("")
        for row in sorted(by_topic[topic], key=lambda r: r.get("title", "")):
            rel = row.get("path", "")
            title = row.get("title", "untitled")
            author = row.get("author", "")
            suffix = f" — {author}" if author else ""
            lines.append(f"- [{title}]({rel}){suffix}")
        lines.append("")
    (library / "INDEX.md").write_text("\n".join(lines), encoding="utf-8")


# --------------------------------------------------------------------------- #
# Utilities
# --------------------------------------------------------------------------- #

def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:80]


def short_hash(text: str) -> str:
    import hashlib
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]


def yaml_scalar(value) -> str:
    s = str(value)
    if s == "":
        return '""'
    if re.search(r'[:\#\[\]\{\}",\n]', s) or s.strip() != s:
        return '"' + s.replace('"', '\\"') + '"'
    return s


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
# Commands
# --------------------------------------------------------------------------- #

def cmd_search(args, config) -> int:
    cookie = resolve_cookie(args, config)
    items = discover(tag=args.tag, publication=args.publication,
                     author=args.author, limit=args.limit, cookie=cookie)
    if not items:
        log("no articles found")
        return 1
    for i, art in enumerate(items, 1):
        print(f"{i:2}. {art['title']}")
        print(f"    {art['author']}  ·  {art['published']}")
        print(f"    {art['url']}")
    return 0


def cmd_archive(args, config) -> int:
    cookie = resolve_cookie(args, config)
    library = resolve_library(args, config)
    topic = args.topic or args.tag or args.publication or args.author or "uncategorized"
    items = discover(tag=args.tag, publication=args.publication,
                     author=args.author, limit=args.limit, cookie=cookie)
    if not items:
        log("no articles found")
        return 1
    if not cookie:
        log("note: no Medium cookie set — member-only posts may save partial "
            "text. See README.md to add your subscriber cookie.")

    catalog_entries = []
    saved = 0
    for art in items:
        body = ""
        if args.full or cookie:
            body = extract_full_article(art["url"], cookie)
            time.sleep(POLITE_DELAY)
        if not body:
            body = html_to_markdown(art.get("content_html", ""))
        if not body:
            log(f"  skipped (no content): {art['title']}")
            continue
        path = save_article(art, topic, library, body)
        rel = path.relative_to(library).as_posix()
        catalog_entries.append({
            "title": art["title"], "author": art["author"],
            "url": art["url"], "published": art["published"],
            "topic": slugify(topic), "tags": art.get("tags", []),
            "path": rel,
        })
        saved += 1
        log(f"  saved: {rel}")

    update_catalog(library, catalog_entries)
    log(f"done: {saved} article(s) into {library}")
    return 0 if saved else 1


def cmd_fetch(args, config) -> int:
    cookie = resolve_cookie(args, config)
    library = resolve_library(args, config)
    topic = args.topic or "uncategorized"
    body = extract_full_article(args.url, cookie)
    if not body:
        log("could not extract article body (paywalled without a valid "
            "cookie, or unsupported page layout)")
        return 1
    title = _guess_title(args.url, body)
    article = {"title": title, "url": args.url.split("?")[0],
               "author": "", "published": "", "tags": []}
    path = save_article(article, topic, library, body)
    rel = path.relative_to(library).as_posix()
    update_catalog(library, [{
        "title": title, "author": "", "url": article["url"],
        "published": "", "topic": slugify(topic), "tags": [], "path": rel,
    }])
    log(f"saved: {rel}")
    return 0


def cmd_list(args, config) -> int:
    library = resolve_library(args, config)
    catalog_path = library / "catalog.json"
    if not catalog_path.exists():
        log("library is empty")
        return 0
    rows = json.loads(catalog_path.read_text(encoding="utf-8"))
    for row in rows:
        print(f"[{row.get('topic','')}] {row.get('title','')}")
        print(f"    {row.get('path','')}")
    print(f"\n{len(rows)} article(s) in {library}")
    return 0


def _guess_title(url: str, body: str) -> str:
    m = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    if m:
        return m.group(1).strip()
    tail = url.rstrip("/").split("/")[-1]
    tail = re.sub(r"-[0-9a-f]{8,}$", "", tail)
    return tail.replace("-", " ").title() or "Untitled"


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="medium_archive",
        description="Search Medium and archive articles to a local library.",
    )
    sub = p.add_subparsers(dest="command", required=True)

    def add_common(sp):
        sp.add_argument("--library", help="library root (default ./library)")
        sp.add_argument("--cookie", help="Medium Cookie header value")
        sp.add_argument("--cookie-file", help="path to a file with the cookie")

    def add_discovery(sp):
        g = sp.add_mutually_exclusive_group(required=True)
        g.add_argument("--tag", help="topic tag, e.g. machine-learning")
        g.add_argument("--publication", help="publication slug, e.g. better-programming")
        g.add_argument("--author", help="author handle, e.g. @username")
        sp.add_argument("--limit", type=int, default=10, help="max articles")

    s = sub.add_parser("search", help="list articles for a topic (no download)")
    add_common(s); add_discovery(s)

    a = sub.add_parser("archive", help="search + download into the library")
    add_common(a); add_discovery(a)
    a.add_argument("--topic", help="folder name to file under (default: the tag)")
    a.add_argument("--full", action="store_true",
                   help="fetch each article page for complete text")

    f = sub.add_parser("fetch", help="archive a single known article URL")
    add_common(f)
    f.add_argument("--url", required=True)
    f.add_argument("--topic", help="folder name to file under")

    l = sub.add_parser("list", help="show the local catalog")
    add_common(l)

    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    config = load_config()
    try:
        return {
            "search": cmd_search,
            "archive": cmd_archive,
            "fetch": cmd_fetch,
            "list": cmd_list,
        }[args.command](args, config)
    except urllib.error.HTTPError as exc:
        log(f"HTTP error {exc.code}: {exc.reason} ({exc.url})")
        if exc.code in (401, 403):
            log("This looks like an auth issue — check your Medium cookie.")
        return 2
    except urllib.error.URLError as exc:
        log(f"network error: {exc.reason}")
        return 2
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
