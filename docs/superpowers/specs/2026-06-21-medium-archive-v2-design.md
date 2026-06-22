# medium-archive v2 — Medium knowledge corpus

**Date:** 2026-06-21
**Status:** Approved design, pending implementation plan

## Problem

The current `medium-archive` skill is a 671-line Python script
(`medium_archive.py`) driven by CLI subcommands (`search` / `archive` /
`fetch` / `list`) with mutually-exclusive flags (`--tag`, `--publication`,
`--author`, `--full`, `--topic`, `--limit`, ...). To use it you must remember
the right flag incantation. It feels "too heavy / scripted based" and is hard
to use.

The goal is a skill that captures Medium articles into a **personal knowledge
management corpus** you can reference and learn from — driven by a config file
of standing interests plus conversational ad-hoc capture, with a Q&A wizard to
build the config.

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| Source scope | **Medium-only.** Keep RSS discovery + HTML extraction; only the interface/workflow changes. |
| Interaction model | **Both:** a config file + on-demand sync for standing interests, AND conversational capture for one-off URLs/topics. A Q&A wizard seeds the config. |
| Corpus features | Per-article **summaries + key takeaways** at capture; **skill-driven search** (grep over corpus, no separate engine); lightweight **tags** in front matter; **topic digests on-demand** (not maintained files); **cross-link graph deferred (YAGNI)**. |
| Python role | **Thin helper.** Reduce Python to two pure operations; move all orchestration/intelligence into the skill. (Internal call — owned by implementer.) |
| Corpus location | **Inside the skill folder** (`medium-archive/library/`), with `MEDIUM_LIBRARY` / `--library` override retained. |

## Architecture

Two layers:

1. **`medium.py` — thin, pure fetch/parse helper.** No orchestration, no
   catalog logic, no subcommand maze. Exposes exactly two operations that
   print to stdout:
   - `discover <feed-spec>` → JSON array of candidate articles, each
     `{title, url, author, published, tags}`. `feed-spec` is one of
     `tag:<x>`, `pub:<x>`, `author:@<x>`.
   - `extract <url>` → clean article Markdown (cookie-aware for member-only
     posts; falls back to RSS content with a warning when no cookie).

   Reuses the existing, proven RSS parser and HTML→Markdown extractor
   (`_ArticleExtractor`, boilerplate cleaning, slugify, date normalization).
   Standard library only, Python 3.8+, self-contained.

2. **`SKILL.md` — the brain.** Interprets intent, reads `topics.yaml`, decides
   what is new vs already captured, calls the helper, generates summaries,
   writes corpus files, maintains the index, and answers queries. This is what
   removes the "scripted" feel — the user talks; the skill orchestrates.

## Config: `topics.yaml`

Human-editable, created/edited by the wizard. Lives in the skill folder.

```yaml
topics:        [large-language-models, rag, ai-agents]   # Medium tags
authors:       ["@kentcdodds"]
publications:  [better-programming]
limit_per_feed: 15
```

All sections optional. An empty/missing config triggers the wizard.

## Corpus structure

```
medium-archive/library/
  <topic>/<slug>.md       # one article: front matter + summary + full body
  catalog.json            # machine index, url-keyed (dedup + search backbone)
  INDEX.md                # browsable list grouped by topic
```

Article file format (front matter gains `summary`, `takeaways`; tags
normalized):

```markdown
---
title: <title>
author: <author>
url: <canonical url>
published: 2026-06-10
topic: rag
tags: [rag, evaluation, retrieval]
summary: One-paragraph TL;DR.
takeaways:
  - key point 1
  - key point 2
archived: 2026-06-21
---
# <title>

<full article markdown>
```

`catalog.json` keyed by URL is the dedup check (sync never re-captures) and the
search index.

## Workflows (skill-driven)

- **Sync** ("sync my Medium archive"): for each feed derived from
  `topics.yaml` → `discover` → diff against `catalog.json` → for each new item
  `extract` → summarize (via `skills/summarize-text` or inline) → write file →
  update `catalog.json` + `INDEX.md`. Reports "captured N new, skipped M
  existing." A failing/empty feed is reported and skipped, not fatal.

- **Capture** ("archive this URL" / "grab recent articles on `<topic>`"):
  same per-article pipeline for an ad-hoc URL or a topic search; files under
  the chosen/derived topic.

- **Ask** ("what have I saved about RAG eval?"): grep titles / summaries /
  tags / body under `library/`, read top matches, answer with file citations.
  **Topic digests** are an Ask variant ("summarize what's new in `<topic>`")
  generated on demand — no maintained digest files.

- **Wizard** ("set up / edit my Medium topics"): Q&A → writes/updates
  `topics.yaml`.

## Authentication (unchanged)

Member-only articles need the user's own Medium session cookie, resolved (in
order) from `--cookie`, `MEDIUM_COOKIE` env, a cookie file, or `config.json`.
The cookie is read at runtime and never written into saved articles. Public
posts work without it. This is personal archival of content the user is
entitled to read via their paid subscription.

## Error handling & edge cases

- No cookie + member-only → save partial RSS text, warn (current behavior).
- HTTP 401/403 → surface as likely expired/missing cookie.
- Dedup by URL via `catalog.json`; slug collisions get a short URL-hash
  suffix so distinct articles never overwrite.
- Empty / unknown feed → skill reports and continues; sync does not abort.
- Polite ~1.5s inter-request delay and descriptive User-Agent retained.

## Migration

- Existing `library/` remains compatible: same folder + `catalog.json` +
  `INDEX.md` shape; v2 only **adds** `summary`/`takeaways` front-matter fields
  to newly captured articles (old files stay valid).
- `medium_archive.py` is replaced by the thinner `medium.py`.
- `SKILL.md` and `README.md` rewritten around sync/capture/ask/wizard.
- `config.example.json` (cookie/library) retained; `topics.yaml` added.

## Testing

- **Helper:** unit-style checks for RSS parsing and HTML→Markdown against
  saved fixture HTML/XML — no live network in tests.
- **Skill workflows:** manual validation steps (sync, capture, ask, wizard)
  documented in an updated `HOW-TO-TEST.md`.

## Out of scope (YAGNI)

- Non-Medium sources.
- Auto wiki-style cross-links / knowledge graph between articles.
- Maintained (always-up-to-date) topic-digest files.
- A standalone search engine/index beyond grep + `catalog.json`.
