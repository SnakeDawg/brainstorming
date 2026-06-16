# medium-archive

A self-contained tool + skill for building a **local Markdown library of
Medium articles** on the topics you care about. Standard-library Python only —
no `pip install`, no dependency on anything outside this folder. Copy the
`medium-archive/` directory anywhere and it works.

```
medium-archive/
├── SKILL.md            ← skill definition (what it does, when to use it)
├── README.md           ← this file (setup + usage)
├── medium_archive.py   ← the tool (Python 3.8+, stdlib only)
├── config.example.json ← copy to config.json to set cookie/library
└── library/            ← your archive lands here (catalog.json + INDEX.md)
```

## Quick start

```bash
cd medium-archive

# 1. Preview what's available for a topic (no login needed for public posts)
python3 medium_archive.py search --tag machine-learning --limit 10

# 2. Archive a topic into ./library/ml/
python3 medium_archive.py archive --tag machine-learning --topic ml --full

# 3. See what you've collected
python3 medium_archive.py list
```

Open `library/INDEX.md` to browse everything you've saved, grouped by topic.

## Authentication

Public Medium posts archive with no setup. **Member-only ("paywalled")
articles need your own Medium session cookie** — you are a paying subscriber,
so this just lets the tool fetch the same content your browser already can.

### Get your cookie

1. Log in to <https://medium.com> in your browser.
2. Open dev tools (F12) → **Network** tab → reload the page.
3. Click the first `medium.com` request → **Headers** → find the **`Cookie:`**
   request header → copy its entire value (a long `sid=...; uid=...; ...`
   string).
   - Alternatively, dev tools → **Application/Storage → Cookies → medium.com**
     and assemble `name=value` pairs separated by `; `.

### Give it to the tool (pick one)

**Environment variable (simplest):**
```bash
export MEDIUM_COOKIE='sid=...; uid=...; ...'
python3 medium_archive.py archive --tag llm --full
```

**Cookie file (kept out of git):**
```bash
echo 'sid=...; uid=...; ...' > cookie.txt   # cookie.txt is git-ignored
python3 medium_archive.py archive --tag llm --cookie-file cookie.txt
```

**config.json:**
```bash
cp config.example.json config.json   # then edit; config.json is git-ignored
```

> Your cookie is a credential — treat it like a password. This folder's
> `.gitignore` excludes `config.json`, `cookie.txt`, and `*.local` so secrets
> don't get committed. The cookie is used only for outgoing requests and is
> never written into saved articles or the catalog.

## Commands

| Command | What it does |
|---|---|
| `search` | List recent articles for a tag/publication/author. No download. |
| `archive` | Discover **and** save articles into the library. |
| `fetch` | Save one specific article by URL. |
| `list` | Print the local catalog. |

Discovery sources (mutually exclusive, one per run):

- `--tag machine-learning` → `medium.com/feed/tag/machine-learning`
- `--publication better-programming` → `medium.com/feed/better-programming`
- `--author @kentcdodds` → `medium.com/feed/@kentcdodds`

Useful options: `--limit N` (how many recent items), `--full` (fetch each page
for complete text), `--topic NAME` (library subfolder), `--library PATH`
(archive root, or set `MEDIUM_LIBRARY`).

## What gets saved

Each article becomes `library/<topic>/<slug>.md`:

```markdown
---
title: "Understanding Vector Databases"
author: Jane Dev
url: "https://medium.com/p/understanding-vector-dbs-abc123"
published: 2026-06-10
topic: ml
tags: [machine-learning, databases]
archived: 2026-06-15
---

# Understanding Vector Databases

...article body as Markdown...
```

Plus, at the library root:
- **`catalog.json`** — every article's metadata (machine-readable; dedup key is
  the URL).
- **`INDEX.md`** — the same, grouped by topic, with clickable links.

## How discovery works (and its limits)

Medium has no official public article API. This tool uses Medium's **RSS
feeds**, which expose the **most recent** posts for a tag, publication, or
author — great for ongoing topic tracking, but not a deep historical search. To
backfill specific older pieces, grab their URLs and use `fetch`.

Extraction converts article HTML to Markdown, isolating the `<article>` body
and dropping nav/scripts/footers. If Medium changes its page markup and full
fetches stop finding the body, the tool automatically falls back to the RSS
content, and you can update the `_ArticleExtractor` class in
`medium_archive.py`.

## Being a good citizen

The script identifies itself with a descriptive User-Agent and waits ~1.5s
between requests. Keep this archive personal — it's for reading content you
already pay to access, not for redistribution.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `HTTP error 401/403` | Cookie missing/expired — re-copy it from the browser. |
| Member articles save as a short stub | Add your cookie and use `--full`. |
| `no articles found` | Check the tag/handle spelling; the feed may be empty. |
| `network error` | Check connectivity; the tool retries nothing automatically. |
