#!/usr/bin/env python3
"""Convert a Markdown file to a self-contained HTML document.

Usage:
    md_to_html.py <input.md> <output.html> [title]

Standard library only. Handles a useful subset of Markdown — see the parent
SKILL.md for what's covered and what isn't.
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path
from typing import Literal

STYLE = """
:root { color-scheme: light dark; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  max-width: 760px;
  margin: 2.5rem auto;
  padding: 0 1.25rem;
  line-height: 1.6;
  color: #1a1a1a;
  background: #ffffff;
}
@media (prefers-color-scheme: dark) {
  body { color: #e6e6e6; background: #161616; }
  a { color: #80b3ff; }
  code, pre { background: #2a2a2a; }
  blockquote { border-color: #444; color: #aaa; }
  hr { border-color: #333; }
}
h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin-top: 2rem; }
h1 { font-size: 2rem; border-bottom: 1px solid currentColor; padding-bottom: .3rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.2rem; }
p { margin: 1rem 0; }
a { color: #0366d6; }
code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .9em;
       background: #f4f4f4; padding: .15rem .3rem; border-radius: 3px; }
pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid #ddd; margin: 1rem 0; padding: .25rem 1rem;
             color: #555; }
hr { border: none; border-top: 1px solid #ddd; margin: 2rem 0; }
ul, ol { padding-left: 1.5rem; }
li { margin: .25rem 0; }
"""

# Inline patterns — compiled once, reused per render_inline() call.
_INLINE_CODE = re.compile(r"`([^`]+)`")
_LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_BOLD = re.compile(r"\*\*([^*]+)\*\*")
_ITALIC = re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)")
_PLACEHOLDER = re.compile(r"\x00(\d+)\x00")

# Block patterns.
_HR = re.compile(r"^\s*---+\s*$")
_HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
_UL_ITEM = re.compile(r"^[-*]\s+(.*)$")
_OL_ITEM = re.compile(r"^\d+\.\s+(.*)$")

# Single source of truth for "this line starts a new block, so don't fold it
# into the current paragraph". Mirrors the rules dispatched in convert().
_BLOCK_START = re.compile(r"^(#{1,6}\s|>|[-*]\s|\d+\.\s|```|\s*---+\s*$)")

ListKind = Literal["ul", "ol"]
_LIST_RULES: tuple[tuple[ListKind, re.Pattern[str]], ...] = (
    ("ul", _UL_ITEM),
    ("ol", _OL_ITEM),
)


def render_inline(text: str) -> str:
    """Render inline markdown (bold/italic/code/links) on already-escaped text."""
    placeholders: list[str] = []

    def stash_code(m: re.Match[str]) -> str:
        placeholders.append(f"<code>{m.group(1)}</code>")
        return f"\x00{len(placeholders) - 1}\x00"

    text = _INLINE_CODE.sub(stash_code, text)
    text = _LINK.sub(r'<a href="\2">\1</a>', text)
    text = _BOLD.sub(r"<strong>\1</strong>", text)
    text = _ITALIC.sub(r"<em>\1</em>", text)
    return _PLACEHOLDER.sub(lambda m: placeholders[int(m.group(1))], text)


def convert(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    in_list: ListKind | None = None

    def close_list() -> None:
        nonlocal in_list
        if in_list:
            out.append(f"</{in_list}>")
            in_list = None

    while i < len(lines):
        line = lines[i]

        # Fenced code block
        if line.startswith("```"):
            close_list()
            i += 1
            buf: list[str] = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(html.escape(lines[i]))
                i += 1
            i += 1  # skip closing fence
            out.append(f"<pre><code>{chr(10).join(buf)}</code></pre>")
            continue

        if _HR.match(line):
            close_list()
            out.append("<hr/>")
            i += 1
            continue

        h = _HEADING.match(line)
        if h:
            close_list()
            level = len(h.group(1))
            out.append(f"<h{level}>{render_inline(html.escape(h.group(2)))}</h{level}>")
            i += 1
            continue

        if line.startswith(">"):
            close_list()
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip("> ").rstrip())
                i += 1
            out.append(
                f"<blockquote><p>{render_inline(html.escape(' '.join(buf)))}</p></blockquote>"
            )
            continue

        # Unified list handling: same shape for ul and ol.
        list_matched = False
        for kind, pattern in _LIST_RULES:
            m = pattern.match(line)
            if not m:
                continue
            if in_list != kind:
                close_list()
                out.append(f"<{kind}>")
                in_list = kind
            out.append(f"  <li>{render_inline(html.escape(m.group(1)))}</li>")
            i += 1
            list_matched = True
            break
        if list_matched:
            continue

        if not line.strip():
            close_list()
            i += 1
            continue

        # Paragraph: gather adjacent non-blank, non-block-start lines.
        close_list()
        buf = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not _BLOCK_START.match(lines[i]):
            buf.append(lines[i])
            i += 1
        out.append(f"<p>{render_inline(html.escape(' '.join(s.strip() for s in buf)))}</p>")

    close_list()
    # NOTE: chr(10) above is intentional — it's inside an f-string expression
    # where backslashes are forbidden on Python <3.12. Don't replace.
    return "\n".join(out)


def wrap(body: str, title: str) -> str:
    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '  <meta charset="utf-8"/>\n'
        '  <meta name="viewport" content="width=device-width,initial-scale=1"/>\n'
        f"  <title>{html.escape(title)}</title>\n"
        f"  <style>{STYLE}</style>\n"
        "</head>\n"
        "<body>\n"
        f"{body}\n"
        "</body>\n"
        "</html>\n"
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Convert a Markdown file to standalone HTML.")
    parser.add_argument("input", type=Path, help="Source .md file")
    parser.add_argument("output", type=Path, help="Destination .html file")
    parser.add_argument(
        "title",
        nargs="?",
        default=None,
        help="HTML <title> (defaults to the input file's stem)",
    )
    args = parser.parse_args(argv)

    if not args.input.is_file():
        print(f"error: {args.input} not found", file=sys.stderr)
        return 1

    title = args.title or args.input.stem
    args.output.write_text(wrap(convert(args.input.read_text(encoding="utf-8")), title), encoding="utf-8")
    print(f"wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
