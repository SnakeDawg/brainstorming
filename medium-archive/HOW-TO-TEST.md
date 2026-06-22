# How to test medium-archive

Two layers: fast offline unit tests for the helper, and manual skill-level
checks for the conversational workflows. Run everything from inside
`medium-archive/`.

## 1. Helper unit tests (offline, no network)

```bash
python3 -m pytest tests/ -v
```

Expected: all tests pass. They cover RSS parsing (tracking-param stripping,
tags, dates), HTML→Markdown extraction (keeps content, drops chrome and the
lightbox boilerplate), the `extract` path, and the `discover` CLI's JSON output
— all against saved fixtures in `tests/fixtures/`, so no live requests are made.

## 2. Helper CLI smoke tests (live network)

```bash
# Discover should print a JSON array of candidates.
python3 medium.py discover tag:large-language-models --limit 3

# Extract a known PUBLIC article should print Markdown.
python3 medium.py extract "https://medium.com/<some-public-article-url>"
```

Expected: `discover` prints a JSON array of `{title, url, author, published,
tags}`; `extract` prints multi-paragraph Markdown. For a member-only article,
`extract` prints a "could not extract" note and exits non-zero unless a valid
cookie is configured (see README → Authentication).

## 3. Skill-level workflows (manual, in your agent)

Copy these into Claude Code (or your agent) with the skill available:

- **Wizard:** "set up my Medium topics" → answer the prompts → confirm a
  `topics.yaml` was written with your tags/authors/publications.

- **Sync:** with a small `topics.yaml` (one or two tags), "sync my Medium
  archive" → confirm new files appear under `library/<topic>/`, each with
  `summary:` and `takeaways:` in its front matter, and that `library/INDEX.md`
  and `library/catalog.json` updated. Run it again → it should report the items
  as already-archived (dedup), not re-capture them.

- **Capture:** "archive this URL: <public medium url>" → confirm one new file
  filed under the topic you named (or `uncategorized`).

- **Ask:** "what have I saved about <a topic you archived>?" → confirm a cited
  answer pointing at `library/<topic>/<slug>.md`. Try "what's new in <topic>"
  for an on-demand digest.

Nothing here is consumed by an automated process — it's a human checklist.
