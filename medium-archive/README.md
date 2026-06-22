# medium-archive

A self-contained **skill** for building and querying a personal **knowledge
corpus** of Medium articles. You drive it by talking to your agent — no flags
to memorize. It reads a `topics.yaml` config of your standing interests, fetches
and cleans articles through a thin Python helper, summarizes each one, files it
as Markdown, and keeps an index so you can reference and learn from the corpus
later.

Standard-library Python only — no `pip install`, no dependency on anything
outside this folder. Copy `medium-archive/` anywhere and it works.

```
medium-archive/
├── SKILL.md             ← skill definition (the brain: workflows + formats)
├── README.md            ← this file (setup + how it works)
├── medium.py            ← thin helper: discover + extract (Python 3.8+, stdlib)
├── topics.example.yaml  ← copy to topics.yaml to set your standing interests
├── config.example.json  ← copy to config.json to set cookie/library
└── library/             ← your corpus lands here (catalog.json + INDEX.md)
```

## The four things you can ask for

Talk to the skill in plain language; it does the rest.

| You say… | What happens |
|---|---|
| **"Set up my Medium topics"** | A short Q&A wizard writes `topics.yaml` for you. |
| **"Sync my Medium archive"** | Pulls anything new across your topics/authors/publications into the corpus, summarizing each article. |
| **"Archive this URL"** / **"save recent articles on `rag`"** | Ad-hoc capture of one link or a topic. |
| **"What have I saved about `<X>`?"** / **"what's new in `<topic>`?"** | Searches the corpus and answers with citations. |

## Quick start

```
1. Ask: "set up my Medium topics"   → builds topics.yaml
2. (optional) set your cookie        → see Authentication, for paywalled posts
3. Ask: "sync my Medium archive"     → captures new articles
4. Browse library/INDEX.md, or ask:  "what have I saved about RAG eval?"
```

## topics.yaml — your standing interests

Created by the wizard (or copy `topics.example.yaml`). It's git-ignored.

```yaml
topics:        [large-language-models, retrieval-augmented-generation]  # Medium tags
authors:       ["@kentcdodds"]
publications:  [better-programming]
limit_per_feed: 15
```

Every section is optional. Sync turns each entry into a Medium RSS feed.

## What the corpus looks like

Articles are grouped by **topic** (a subfolder), each a Markdown file with
front matter that now includes an AI-generated **summary** and **takeaways**:

```markdown
---
title: Understanding Vector Databases
author: Jane Dev
url: https://medium.com/p/understanding-vector-dbs-abc123
published: 2026-06-10
topic: rag
tags: [vector-databases, retrieval]
summary: A one-paragraph TL;DR of the article.
takeaways:
  - Key point one.
  - Key point two.
archived: 2026-06-15
---
# Understanding Vector Databases

...article body as Markdown...
```

```
library/
├── catalog.json   ← every article's metadata + summary (machine-readable, dedup key = url)
├── INDEX.md       ← same list, grouped by topic, clickable links
└── rag/
    └── understanding-vector-databases.md
```

`catalog.json` / `INDEX.md` are rebuilt as articles are added. The article
**URL** is the dedup key, so sync never re-captures something you already have;
if two different articles produce the same filename, a short hash is appended so
neither is overwritten.

## Under the hood: the `medium.py` helper

You won't normally run this yourself — the skill calls it — but it's just two
operations, easy to inspect or use directly:

```bash
# Discover recent candidates for a feed (prints JSON). feed = tag:/pub:/author:
python3 medium.py discover tag:large-language-models --limit 5

# Extract one article as clean Markdown (prints to stdout)
python3 medium.py extract "https://medium.com/p/abc123"
```

All the intelligence — reading `topics.yaml`, deciding what's new, summarizing,
filing, indexing, answering questions — lives in `SKILL.md`. The helper only
fetches Medium RSS and converts article HTML to Markdown.

## Authentication (only for paywalled articles)

Public Medium posts archive with **no setup at all** — skip this section unless
you want member-only ("paywalled") articles.

Member-only articles need **your own Medium session cookie**. You are a paying
subscriber; the cookie just lets the helper fetch the exact same content your
logged-in browser already can. Without it, paywalled articles are skipped (or
save as a short stub).

### Step 1 — Copy your cookie from the browser

1. Log in to <https://medium.com> and stay on a Medium page.
2. Press **F12** → **Network** tab → **reload** the page so requests appear.
3. Click the **top entry named `medium.com`** (the page document itself).
4. Under **Request Headers** (not *Response*), find the line starting with
   **`Cookie:`**.
5. Copy the **entire** value after `Cookie:` — one long `sid=...; uid=...; ...`
   line, semicolons and all.

### Step 2 — Give the cookie to the helper (pick ONE)

**Environment variable** (simplest, nothing saved to disk):
```bash
export MEDIUM_COOKIE='sid=...; uid=...; ...'
```

**Cookie file** (kept out of git):
```bash
echo 'sid=...; uid=...; ...' > cookie.txt          # cookie.txt is git-ignored
```

**config.json** (persists across runs):
```bash
cp config.example.json config.json                 # then edit; git-ignored
```

The cookie is resolved in this order: `--cookie` → `MEDIUM_COOKIE` env →
cookie file → `cookie` in `config.json`. First found wins. Treat it like a
password: `.gitignore` excludes `config.json`, `cookie.txt`, `topics.yaml`, and
`*.local`. The cookie is sent only on outgoing requests and is **never** written
into saved articles.

> **Did it work?** Ask the skill to archive a member-only article and check the
> file — a real article is many paragraphs; an empty/short result means the
> cookie is missing or expired (re-copy it). `HTTP 401/403` means the same.

## How discovery works (and its limits)

Medium has no official public article API. The helper reads Medium's **RSS
feeds**, which expose the **most recent** posts for a tag, publication, or
author — great for ongoing topic tracking, but **not** a deep historical
search. To backfill older pieces, give the skill their URLs ("archive this
URL"). Extraction isolates the `<article>` body and drops nav/scripts/footers;
if Medium changes its markup, update `_ArticleExtractor` in `medium.py`.

## Being a good citizen

The helper identifies itself with a descriptive User-Agent and the workflow
paces requests (~1.5s). Keep this corpus **personal** — it's for reading content
you already pay to access, not for redistribution.

## Testing

See [HOW-TO-TEST.md](./HOW-TO-TEST.md) for helper unit tests and manual
skill-level checks.
