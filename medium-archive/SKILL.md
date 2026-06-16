---
name: medium-archive
description: Search Medium by topic, publication, or author and save full articles as Markdown into a local library, for personal archival of content you have a subscription to read.
---

# medium-archive

A self-contained skill for building a local, searchable archive of Medium
articles on topics you care about. Everything it needs lives in this folder —
it has no dependencies on the rest of the repository and no third-party Python
packages (standard library only, Python 3.8+).

Use it to discover articles by **tag**, **publication**, or **author**, pull
their full text, and file them as Markdown (with YAML front matter) under
`library/<topic>/`. A `catalog.json` and human-readable `INDEX.md` are kept up
to date automatically.

> **Personal use.** This saves local copies of articles you are entitled to
> read through your own paid Medium subscription. Keep the archive private;
> redistributing Medium's paywalled content would violate their terms.

## When to use this skill

- "Archive the latest Medium articles tagged `large-language-models`."
- "Save everything from this author / publication on Medium."
- "Add this specific Medium URL to my local library."
- "What have I archived so far?"

## Prerequisites

1. **Python 3.8+** (already present on most systems; check `python3 --version`).
2. **Your Medium session cookie**, needed only for member-only ("paywalled")
   articles. Public posts work without it. See
   [README.md → Authentication](./README.md#authentication) for how to copy it
   from your browser and where to put it (`MEDIUM_COOKIE` env var, a cookie
   file, or `config.json`). The cookie is read at runtime and never written
   into any saved article.

## Commands

Run everything from inside this folder.

| Goal | Command |
|---|---|
| Preview articles for a topic (no download) | `python3 medium_archive.py search --tag machine-learning --limit 10` |
| Archive a topic into the library | `python3 medium_archive.py archive --tag machine-learning --topic ml --full` |
| Archive by publication | `python3 medium_archive.py archive --publication better-programming` |
| Archive by author | `python3 medium_archive.py archive --author @kentcdodds` |
| Save one known URL | `python3 medium_archive.py fetch --url "https://medium.com/..." --topic ml` |
| Show what's archived | `python3 medium_archive.py list` |

Discovery flags `--tag`, `--publication`, and `--author` are mutually
exclusive — pick one per run. `--limit` caps how many recent items are taken
from the feed (default 10). `--full` fetches each article page for complete
text rather than the RSS summary; when a cookie is present, full fetch happens
automatically. Tag-feed archives need `--full` because the tag RSS carries only
a snippet; author and publication feeds already include the full body.

## How it works

1. **Discovery** uses Medium's public RSS feeds:
   `https://medium.com/feed/tag/<tag>`, `.../feed/<publication>`,
   `.../feed/@<author>`. Author and publication feeds embed the full article
   HTML, so RSS alone archives complete text. **Tag feeds return only a short
   snippet** — pass `--full` to fetch each page for the complete body.
2. **Extraction** converts the article HTML to Markdown. For full-page fetches
   it isolates the `<article>` element and drops navigation, scripts, and
   footers. Member-only pages require your cookie; without it the tool falls
   back to whatever the RSS feed provided and warns you.
3. **Storage** writes `library/<topic>/<slug>.md` with front matter (title,
   author, url, published date, tags, archive date), then refreshes
   `library/catalog.json` and `library/INDEX.md`. Re-archiving the same URL
   updates the catalog entry rather than duplicating it.

## Input

| Field | Type | Notes |
|---|---|---|
| `--tag` / `--publication` / `--author` | string | one discovery source per run |
| `--topic` | string | library subfolder name (defaults to the tag/source) |
| `--limit` | int | max recent articles to take (default 10) |
| `--full` | flag | fetch each page for complete text |
| `--cookie` / `--cookie-file` | string | Medium auth; or set `MEDIUM_COOKIE` |
| `--library` | path | archive root (default `./library`, or `MEDIUM_LIBRARY`) |

## Output

Markdown files under `library/<topic>/`, plus `catalog.json` (machine-readable)
and `INDEX.md` (browsable) at the library root. Progress and warnings print to
stderr; `search` and `list` print results to stdout.

## Edge cases

- **No cookie + member-only article** → saves partial RSS text and warns; set a
  cookie for the full body.
- **HTTP 401/403** → almost always an expired or missing cookie; refresh it.
- **Empty feed / unknown tag** → exits non-zero with "no articles found".
- **Title collisions** → a short URL hash is appended so distinct articles never
  overwrite each other.

## Limitations & maintenance

Medium has no official article API, so discovery rides on RSS (recent posts
only, not deep historical search) and extraction parses page HTML. If Medium
changes its markup, update `_ArticleExtractor` in `medium_archive.py`; the
RSS-content fallback keeps the tool working in the meantime. Be a good
citizen: the script sends a descriptive User-Agent and waits ~1.5s between
requests — leave that rate limiting in place.
