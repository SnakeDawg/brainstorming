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

You run everything with `python3 medium_archive.py <command>` from inside this
folder. There are four commands: **`search`** (preview), **`archive`**
(download many), **`fetch`** (download one URL), and **`list`** (show what you
have). Here is the zero-to-archived path:

```bash
cd medium-archive

# 1. PREVIEW — list recent articles for a tag. Nothing is downloaded.
#    Public posts work with no login.
python3 medium_archive.py search --tag machine-learning --limit 10

# 2. ARCHIVE — download those articles into ./library/ml/
#    --topic ml = the subfolder to file them under
#    --full     = fetch each full article page (see "When do I need --full?")
python3 medium_archive.py archive --tag machine-learning --topic ml --full

# 3. REVIEW — print everything you've collected
python3 medium_archive.py list
```

Then open `library/INDEX.md` to browse your archive, grouped by topic.

That's the whole loop. The two things worth understanding before you go further
are **when you need `--full`** (next section) and **when you need a cookie**
(the Authentication section) — both only matter once you reach for full text or
paywalled articles.

## When do I need `--full`?

`--full` makes the tool fetch each article's actual web page for the complete
body, instead of using only what Medium's RSS feed hands over. Whether you need
it depends on *how you're discovering* articles:

| You are archiving by… | Does RSS include full text? | Use `--full`? |
|---|---|---|
| `--tag` | No — only a short snippet | **Yes**, or you'll save stubs |
| `--publication` | Yes — full body is embedded | Optional |
| `--author` | Yes — full body is embedded | Optional |

**Shortcut:** if you set a cookie (see below), full-page fetching happens
**automatically** for every article — you don't need to pass `--full` at all.
So in practice: add `--full` when archiving by `--tag` *without* a cookie, and
otherwise don't worry about it.

`search` never downloads article bodies, so `--full` does nothing there.

## Authentication (only for paywalled articles)

Public Medium posts archive with **no setup at all** — skip this whole section
unless you want member-only ("paywalled") articles.

Member-only articles need **your own Medium session cookie**. You are a paying
subscriber; the cookie just lets the tool fetch the exact same content your
logged-in browser already can. Without it, paywalled articles save as a short
stub.

### Step 1 — Copy your cookie from the browser

The reliable way (Chrome/Edge/Firefox are all similar):

1. Log in to <https://medium.com> in your browser and stay on a Medium page.
2. Press **F12** to open dev tools, click the **Network** tab, then **reload
   the page** so requests appear.
3. In the request list, click the **top entry whose name is `medium.com`**
   (the page document itself — type `medium.com` in the Network filter box if
   the list is long).
4. In the panel that opens, find **Request Headers** (not *Response* Headers)
   and locate the line that starts with **`Cookie:`**.
5. Copy the **entire** value after `Cookie:` — it's one long line that looks
   like `sid=abc...; uid=def...; ...`. Copy all of it, semicolons and all.

> **Advanced alternative** (only if you can't find the Cookie header): open
> dev tools → **Application** (Chrome) or **Storage** (Firefox) → **Cookies →
> https://medium.com**, then hand-build the string by joining each row as
> `name=value` with `; ` between them. This is error-prone; prefer the Network
> method above.

### Step 2 — Give the cookie to the tool (pick ONE)

**Environment variable** (simplest, nothing saved to disk):
```bash
export MEDIUM_COOKIE='sid=...; uid=...; ...'
python3 medium_archive.py archive --tag llm        # --full now automatic
```

**Cookie file** (kept out of git):
```bash
echo 'sid=...; uid=...; ...' > cookie.txt          # cookie.txt is git-ignored
python3 medium_archive.py archive --tag llm --cookie-file cookie.txt
```

**config.json** (persists across runs):
```bash
cp config.example.json config.json                 # then edit; git-ignored
```

The tool looks for the cookie in this order: `--cookie` flag → `MEDIUM_COOKIE`
env var → `--cookie-file`/`config.json` file → `cookie` in `config.json`. The
first one it finds wins.

### Did it work?

Archive a member-only article and check the file size — a real article is many
paragraphs; a stub is a sentence or two. If member-only posts still save short,
your cookie is missing or expired (re-copy it). An `HTTP 401/403` error means
the same thing.

> **Treat your cookie like a password.** This folder's `.gitignore` excludes
> `config.json`, `cookie.txt`, and `*.local`, so secrets aren't committed. The
> cookie is sent only on outgoing requests and is **never** written into saved
> articles or the catalog.

## Commands

| Command | What it does |
|---|---|
| `search` | List recent articles for a tag/publication/author. **No download.** |
| `archive` | Discover **and** save many articles into the library. |
| `fetch` | Save **one** specific article by its URL. |
| `list` | Print the local catalog. |

**Discovery source** — `archive` and `search` each take exactly one of these
(they're mutually exclusive):

- `--tag machine-learning` → recent posts tagged *machine-learning*
- `--publication better-programming` → recent posts from that publication
- `--author @kentcdodds` → recent posts by that author

**Common options:**

| Option | Applies to | Meaning |
|---|---|---|
| `--limit N` | search, archive | How many recent items to take (default 10) |
| `--full` | archive | Fetch each full page — see "When do I need `--full`?" |
| `--topic NAME` | archive, fetch | Library subfolder to file under (default: the tag) |
| `--url URL` | fetch | The specific article to save |
| `--library PATH` | all | Archive root (default `./library`, or set `MEDIUM_LIBRARY`) |
| `--cookie` / `--cookie-file` | all | Your Medium cookie (or set `MEDIUM_COOKIE`) |

To grab a single article you already have the link for:

```bash
python3 medium_archive.py fetch \
  --url "https://medium.com/p/understanding-vector-dbs-abc123" --topic ml
```

## Where everything lands

Articles are organized by **topic**, which is just a subfolder name you choose
with `--topic` (it defaults to the tag/author/publication if you omit it):

```
library/                       ← the archive root (change with --library)
├── catalog.json               ← every article's metadata (machine-readable)
├── INDEX.md                   ← same list, grouped by topic, clickable links
├── ml/                        ← one folder per --topic
│   ├── understanding-vector-databases.md
│   └── ...
└── llm/
    └── ...
```

Each article is a Markdown file with YAML front matter:

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

`catalog.json` and `INDEX.md` at the library root are **rebuilt automatically**
after every archive/fetch. The article **URL** is the dedup key: re-archiving a
URL you already have updates its entry instead of creating a duplicate. (If two
different articles happen to produce the same filename, a short hash is appended
so neither is overwritten.)

## How discovery works (and its limits)

Medium has no official public article API. This tool reads Medium's **RSS
feeds**, which expose the **most recent** posts for a tag, publication, or
author — great for ongoing topic tracking, but **not** a deep historical
search. To backfill specific older pieces, grab their URLs and use `fetch`.

Extraction converts the article HTML to Markdown, isolating the `<article>`
body and dropping nav/scripts/footers. If Medium changes its page markup and
full fetches stop finding the body, the tool automatically falls back to the
RSS content; to restore full fidelity, update the `_ArticleExtractor` class in
`medium_archive.py`.

## Being a good citizen

The script identifies itself with a descriptive User-Agent and waits ~1.5s
between requests. Keep this archive **personal** — it's for reading content you
already pay to access, not for redistribution.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `HTTP error 401/403` | Cookie missing or expired — re-copy it from the browser. |
| Member-only articles save a short stub | Add your cookie (full fetch then runs automatically), or pass `--full` with a cookie set. |
| Tag articles save short / truncated | Add `--full` (tag RSS only carries a snippet). |
| `no articles found` | Check the tag/handle/publication spelling; the feed may be empty. |
| `network error` | Check connectivity; the tool does not retry automatically. |
