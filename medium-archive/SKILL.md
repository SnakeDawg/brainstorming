---
name: medium-archive
description: Build and query a personal Medium knowledge corpus. Sync standing interests from a topics.yaml config, capture one-off URLs or topics on request, summarize each article on capture, and answer questions across everything you've saved. For personal archival of content you can read via your own Medium subscription.
---

# medium-archive

A skill for building a local, searchable **knowledge corpus** of Medium
articles you care about. You drive it conversationally — there are no flags to
memorize. The skill reads a `topics.yaml` config, talks to a thin helper
(`medium.py`) to fetch and clean articles, summarizes each one, files it as
Markdown, and keeps an index up to date so you can reference and learn from the
corpus later.

Everything lives in this folder — no dependency on the rest of the repo, no
third-party Python packages (standard library only, Python 3.8+).

> **Personal use.** This saves local copies of articles you are entitled to
> read through your own paid Medium subscription. Keep the archive private;
> redistributing Medium's paywalled content would violate their terms.

## When to use this skill

- "Sync my Medium archive" / "pull anything new on my topics."
- "Archive this URL" / "save this Medium article."
- "Save recent articles on `<topic>`."
- "What have I saved about `<X>`?" / "summarize what's new in `<topic>`."
- "Set up / edit my Medium topics."

## The helper (`medium.py`)

The skill orchestrates everything; it invokes `medium.py` for the two
mechanical operations and never asks the user to run it directly. Run it from
inside this folder:

| Operation | Command | Output |
|---|---|---|
| Discover feed candidates | `python3 medium.py discover <feed-spec> [--limit N]` | JSON array of `{title, url, author, published, tags}` to stdout |
| Extract one article | `python3 medium.py extract <url>` | article Markdown to stdout (non-zero exit + stderr note if it can't) |

`<feed-spec>` is one of `tag:<x>`, `pub:<x>`, or `author:@<x>`. Both commands
accept `--cookie` / `--cookie-file`; normally the cookie comes from the
environment or `config.json` (see **Authentication**), so you can omit it.

For slug/hash helpers the skill can call functions directly, e.g.
`python3 -c "import medium; print(medium.slugify('Some Title'))"`.

## Corpus layout (authoritative formats)

```
library/
  <topic>/<slug>.md     # one article: front matter + summary + full body
  catalog.json          # machine index, conceptually keyed by url (dedup)
  INDEX.md              # browsable list, grouped by topic
```

Default library root is `library/` in this folder; honor `MEDIUM_LIBRARY` (env)
or a `library` key in `config.json` if set.

**Article file — `library/<topic>/<slug>.md`:**

```markdown
---
title: <title>
author: <author>
url: <canonical url, tracking params stripped>
published: <YYYY-MM-DD>
topic: <topic>
tags: [<tag>, <tag>]
summary: <one-paragraph TL;DR>
takeaways:
  - <key point>
  - <key point>
archived: <YYYY-MM-DD>
---
# <title>

<full article markdown from `medium.py extract`>
```

- `slug` = `medium.slugify(title)`. On collision with a *different* url, append
  `-<medium.short_hash(url)>` so distinct articles never overwrite each other.
- Quote any front-matter value containing `: # [ ] { } " ,` or newlines.
- `tags` come from the discover JSON; lowercase/de-duplicate them.

**`catalog.json`** — a JSON array; one object per archived article:

```json
{"title": "...", "author": "...", "url": "...", "published": "YYYY-MM-DD",
 "topic": "...", "tags": ["..."], "summary": "...", "path": "<topic>/<slug>.md"}
```

The `url` field is the dedup key: before capturing, skip any candidate whose
url already appears here.

**`INDEX.md`** — articles grouped by topic, newest first:

```markdown
# Medium Archive

## <topic>

- [<title>](<topic>/<slug>.md) — <author>
  <summary>
```

## Workflow: Sync

Pull anything new across your standing interests.

1. Read `topics.yaml` (this folder). If it's missing or empty, run the
   **Wizard** first, then continue.
2. Build a feed-spec for each entry: `topics:` → `tag:<x>`, `authors:` →
   `author:<x>`, `publications:` → `pub:<x>`.
3. For each feed-spec, run
   `python3 medium.py discover <feed-spec> --limit <limit_per_feed>`.
   If a feed errors or returns `[]`, note it and **continue** — never abort the
   whole sync for one bad feed.
4. Load `library/catalog.json` (treat missing as `[]`). Drop any candidate
   whose `url` is already in the catalog (dedup).
5. For each remaining new candidate, in order:
   - Run `python3 medium.py extract <url>`. If it exits non-zero / empty,
     warn ("skipped, no body — likely paywalled without a cookie") and skip.
   - Generate a one-paragraph `summary` and 3–5 `takeaways` from the body
     (prefer the `summarize-text` skill if available; otherwise summarize
     inline).
   - Choose `topic` = the tag that sourced the feed (or, for author/pub feeds,
     the candidate's first tag, else the feed name). Write the article file in
     the corpus format above.
   - Append a `catalog.json` entry.
   - Be polite between extracts (the requests are rate-limited; don't
     parallelize aggressively).
6. Rewrite `catalog.json` and regenerate `INDEX.md`.
7. Report: "Captured N new, skipped M already-archived, F feeds failed."

## Workflow: Capture (ad-hoc)

- **Known URL:** `extract <url>` → summarize → file under the topic the user
  names (default `uncategorized`) → update `catalog.json` + `INDEX.md`. Skip if
  the url is already in the catalog (mention it).
- **Topic phrase, no config involved:** `discover tag:<slugified topic>` →
  show the candidate titles → capture the ones the user confirms (or all, if
  they say "all"), each through the same extract → summarize → file pipeline.

## Workflow: Ask (query + digests)

- **Query:** Search the corpus — grep `catalog.json` and `library/**/*.md` over
  titles, summaries, tags, and body for the user's terms; read the top matches
  in full as needed. Answer the question and cite sources as
  `library/<topic>/<slug>.md`. If nothing matches, say so plainly.
- **Digest:** "what's new in `<topic>`" → gather that topic's recent catalog
  entries and synthesize a short briefing from their summaries/takeaways, with
  citations. Digests are generated on demand; do not maintain digest files.

## Workflow: Wizard (build/edit `topics.yaml`)

Run when `topics.yaml` is missing/empty or the user asks to set up or edit
their topics. Ask **one question at a time**:

1. Which Medium tags/topics to follow? (e.g. `large-language-models`, `rag`)
2. Any specific authors? (handles like `@kentcdodds`)
3. Any publications? (slugs like `better-programming`)
4. How many recent items per feed each sync? (default 15)

Then write `topics.yaml` in the structure shown in `topics.example.yaml`, read
it back to the user to confirm, and offer to run a Sync.

## Authentication

Member-only ("paywalled") articles need your own Medium session cookie; public
posts work without it. The helper resolves the cookie from, in order:
`--cookie` → `MEDIUM_COOKIE` env → a cookie file → `config.json`. Copy the
`Cookie:` request header from your browser while logged in to medium.com (see
[README.md → Authentication](./README.md#authentication)). The cookie is read
at runtime and never written into any saved article.

## Edge cases & etiquette

- **No cookie + member-only** → `extract` returns empty; the article is skipped
  with a warning. Set a cookie for the full body.
- **HTTP 401/403** → almost always an expired/missing cookie; refresh it.
- **Empty / unknown feed** → reported and skipped; sync continues.
- **Slug collisions** → short url-hash suffix keeps distinct articles separate.
- The helper sends a descriptive User-Agent and the requests are rate-limited
  (~1.5s); don't hammer Medium.

## Limitations & maintenance

Medium has no official article API, so discovery rides on RSS (recent posts
only, not deep historical search) and extraction parses page HTML. If Medium
changes its markup, update `_ArticleExtractor` in `medium.py`; the RSS-content
fallback keeps things working in the meantime.
