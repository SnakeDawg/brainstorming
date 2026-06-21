# medium-archive v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `medium-archive` skill from a flag-driven 671-line script into a thin fetch/extract helper plus a skill that drives a config + conversational Medium knowledge corpus.

**Architecture:** A small pure Python helper (`medium.py`) exposes two stdout operations — `discover <feed-spec>` (→ JSON candidates) and `extract <url>` (→ clean Markdown) — reusing the proven RSS parser and HTML→Markdown extractor. All orchestration (config reading, dedup, summaries, filing, indexing, querying) lives in `SKILL.md`, which the user drives conversationally via sync / capture / ask / wizard workflows.

**Tech Stack:** Python 3.8+ standard library only (no pip). Markdown corpus + `catalog.json`. Skill markdown for orchestration.

## Global Constraints

- Python 3.8+, **standard library only** — no third-party packages, no pip installs.
- Self-contained: everything lives under `medium-archive/`; no dependency on the rest of the repo.
- Personal-use framing retained: archives content the user can read via their own paid Medium subscription; cookie is read at runtime, never written into saved files.
- Polite networking retained: descriptive `User-Agent`, ~1.5s delay between network requests.
- Corpus default location: `medium-archive/library/`, overridable via `MEDIUM_LIBRARY` env or `--library`.
- Tests must not hit the live network — use saved fixtures.

---

### Task 1: Thin `medium.py` helper with `discover` and `extract`

Reuse the proven primitives from `medium_archive.py` (`http_get`, `build_feed_url`, `parse_feed`, `_ArticleExtractor`, `html_to_markdown`, `extract_full_article`, `slugify`, `normalize_date`, `_text`, `load_config`, `resolve_cookie`, `log`, constants) but expose ONLY two CLI subcommands that print machine-friendly output. Drop `cmd_search`, `cmd_archive`, `cmd_fetch`, `cmd_list`, `save_article`, `render_markdown`, `update_catalog`, `resolve_library` — that orchestration moves to the skill.

**Files:**
- Create: `medium-archive/medium.py`
- Create: `medium-archive/tests/test_medium.py`
- Create: `medium-archive/tests/fixtures/tag_feed.xml`
- Create: `medium-archive/tests/fixtures/article.html`

**Interfaces:**
- Consumes: nothing (entry point).
- Produces (CLI contract the skill relies on):
  - `python3 medium.py discover <feed-spec> [--limit N] [--cookie ...]` → prints a JSON array of `{title, url, author, published, tags}` to stdout. `<feed-spec>` is `tag:<x>`, `pub:<x>`, or `author:@<x>`.
  - `python3 medium.py extract <url> [--cookie ...]` → prints article Markdown to stdout; exits non-zero with a stderr message if no body could be extracted.
  - Internal functions reused unchanged: `parse_feed(xml_bytes) -> list[dict]`, `html_to_markdown(html_text) -> str`, `extract_full_article(url, cookie) -> str`, `slugify(text) -> str`.

- [ ] **Step 1: Write fixtures**

Create `tests/fixtures/tag_feed.xml` — a minimal but valid Medium-style RSS feed with two `<item>`s (title, link with `?source=rss` tracking param, `dc:creator`, `pubDate`, two `<category>`, and `<content:encoded>`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Stories tagged rag</title>
    <item>
      <title>Eval for RAG</title>
      <link>https://medium.com/p/abc123?source=rss----xyz</link>
      <dc:creator>Jane Doe</dc:creator>
      <pubDate>Tue, 10 Jun 2026 12:00:00 GMT</pubDate>
      <category>rag</category>
      <category>evaluation</category>
      <content:encoded><![CDATA[<article><h1>Eval for RAG</h1><p>Body one.</p></article>]]></content:encoded>
    </item>
    <item>
      <title>Chunking 101</title>
      <link>https://medium.com/p/def456</link>
      <dc:creator>John Roe</dc:creator>
      <pubDate>Wed, 11 Jun 2026 09:30:00 GMT</pubDate>
      <category>rag</category>
      <content:encoded><![CDATA[<article><h1>Chunking 101</h1><p>Body two.</p></article>]]></content:encoded>
    </item>
  </channel>
</rss>
```

Create `tests/fixtures/article.html` — a minimal Medium-style page with an `<article>` plus chrome to strip:

```html
<html><body>
<nav><a href="/m/signin">Sign in</a></nav>
<article>
<h1>Eval for RAG</h1>
<p>First paragraph with a <a href="https://example.com/ref">real link</a>.</p>
<p>Press enter or click to view image in full size</p>
<h2>Methods</h2>
<p>Second paragraph.</p>
</article>
<footer><a href="/membership">Become a member</a></footer>
</body></html>
```

- [ ] **Step 2: Write the failing tests**

Create `tests/test_medium.py`:

```python
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRIPT = HERE.parent / "medium.py"
FIX = HERE / "fixtures"

sys.path.insert(0, str(HERE.parent))
import medium  # noqa: E402


def test_parse_feed_extracts_items_and_strips_tracking():
    items = medium.parse_feed((FIX / "tag_feed.xml").read_bytes())
    assert len(items) == 2
    first = items[0]
    assert first["title"] == "Eval for RAG"
    assert first["url"] == "https://medium.com/p/abc123"  # tracking stripped
    assert first["author"] == "Jane Doe"
    assert first["published"] == "2026-06-10"
    assert first["tags"] == ["rag", "evaluation"]


def test_html_to_markdown_keeps_content_drops_chrome():
    md = medium.html_to_markdown((FIX / "article.html").read_text())
    assert "Eval for RAG" in md
    assert "real link" in md and "https://example.com/ref" in md
    assert "## Methods" in md
    assert "Second paragraph." in md
    # chrome + lightbox boilerplate stripped
    assert "Sign in" not in md
    assert "Become a member" not in md
    assert "view image in full size" not in md


def test_discover_cli_outputs_json(monkeypatch):
    # Avoid network: stub http_get to return the fixture feed.
    feed = (FIX / "tag_feed.xml").read_bytes()
    code = (
        "import sys; sys.argv=['medium.py','discover','tag:rag','--limit','5'];"
        "import medium;"
        "medium.http_get=lambda url, cookie='': open(r'%s','rb').read();"
        "sys.exit(medium.main())" % (FIX / "tag_feed.xml")
    )
    out = subprocess.run([sys.executable, "-c", code],
                         capture_output=True, text=True)
    assert out.returncode == 0, out.stderr
    data = json.loads(out.stdout)
    assert [d["title"] for d in data] == ["Eval for RAG", "Chunking 101"]
    assert all({"title", "url", "author", "published", "tags"} <= d.keys()
               for d in data)
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd medium-archive && python3 -m pytest tests/test_medium.py -v`
Expected: FAIL — `medium` module does not exist yet.

- [ ] **Step 4: Implement `medium.py`**

Build the file by keeping the proven primitives from `medium_archive.py` verbatim and adding a two-command CLI. Concretely, copy these unchanged from `medium_archive.py`: the imports/constants block, `log`, `load_config`, `resolve_cookie`, `http_get`, `build_feed_url`, `parse_feed`, `discover`, the extraction section (`_CHROME_LINK_MARKERS`, `_is_chrome_link`, `_ArticleExtractor`, `html_to_markdown`, `_MEDIUM_BOILERPLATE`, `_LEADING_CHROME`, `_clean_medium_boilerplate`, `extract_full_article`), and the utilities `slugify`, `short_hash`, `yaml_scalar`, `normalize_date`, `_text`. Then add this thin CLI in place of the old command layer:

```python
def _parse_feed_spec(spec: str):
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
    import argparse
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
```

Note: `resolve_cookie` reads `args.cookie` / `MEDIUM_COOKIE` / cookie file / `config.json`; keep its signature `resolve_cookie(args, config)`. Ensure `import json` and `import urllib.error` are present in the copied header.

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd medium-archive && python3 -m pytest tests/test_medium.py -v`
Expected: PASS (3 passed).

- [ ] **Step 6: Smoke-test the CLI help**

Run: `cd medium-archive && python3 medium.py --help && python3 medium.py discover --help`
Expected: usage text listing `discover` and `extract`; no traceback.

- [ ] **Step 7: Remove the obsolete script and commit**

```bash
cd medium-archive
git rm medium_archive.py
git add medium.py tests/
git commit -m "feat(medium-archive): thin discover/extract helper, drop CLI orchestration"
```

---

### Task 2: `topics.yaml` config + example

A human-editable standing-interests file the skill reads during sync and the wizard writes. Parsed by the skill (it reads YAML by eye), so no Python YAML parser is needed.

**Files:**
- Create: `medium-archive/topics.example.yaml`
- Modify: `medium-archive/.gitignore` (ignore the user's real `topics.yaml`)

- [ ] **Step 1: Write the example config**

Create `medium-archive/topics.example.yaml`:

```yaml
# Copy to topics.yaml and edit. topics.yaml is git-ignored.
# Each section is optional. Run the skill's wizard to build this interactively.

# Medium tags to follow (https://medium.com/tag/<name>)
topics:
  - large-language-models
  - retrieval-augmented-generation
  - ai-agents

# Author handles to follow
authors:
  - "@kentcdodds"

# Publication slugs to follow
publications:
  - better-programming

# Max recent items pulled per feed during a sync (default 15)
limit_per_feed: 15
```

- [ ] **Step 2: Ignore the real config**

Add to `medium-archive/.gitignore` (append, keep existing entries):

```
topics.yaml
```

- [ ] **Step 3: Commit**

```bash
cd medium-archive
git add topics.example.yaml .gitignore
git commit -m "feat(medium-archive): add topics.yaml standing-interests config"
```

---

### Task 3: Rewrite `SKILL.md` as the orchestration brain

Replace the flag/command reference with conversational workflows. The skill is the only thing the user interacts with; it invokes `medium.py` and does all decision-making, summarizing, filing, indexing, and querying.

**Files:**
- Modify (full rewrite): `medium-archive/SKILL.md`

**Interfaces:**
- Consumes: `medium.py discover <feed-spec> [--limit N]` (JSON) and `medium.py extract <url>` (Markdown) from Task 1; `topics.yaml` / `topics.example.yaml` from Task 2.
- Produces: corpus files `library/<topic>/<slug>.md`, `library/catalog.json`, `library/INDEX.md` (formats defined below — every workflow must follow them).

- [ ] **Step 1: Write the new SKILL.md**

Frontmatter `name: medium-archive`; description mentioning config-driven sync, conversational capture, and querying a personal Medium knowledge corpus. Body must specify, explicitly and unambiguously:

1. **When to use** — "sync my Medium archive", "archive this URL", "save recent articles on <topic>", "what have I saved about <X>", "set up/edit my Medium topics".

2. **The helper contract** — the two `medium.py` commands and their I/O (copy from Task 1 interface). State that the skill never exposes these to the user directly.

3. **Corpus formats (authoritative):**
   - Article file `library/<topic>/<slug>.md`:
     ```markdown
     ---
     title: <title>
     author: <author>
     url: <canonical url>
     published: <YYYY-MM-DD>
     topic: <topic>
     tags: [<tag>, <tag>]
     summary: <one-paragraph TL;DR>
     takeaways:
       - <point>
       - <point>
     archived: <YYYY-MM-DD>
     ---
     # <title>

     <full article markdown from `extract`>
     ```
   - `library/catalog.json`: a JSON array of `{title, author, url, published, topic, tags, summary, path}`, **keyed conceptually by `url`** (used for dedup).
   - `library/INDEX.md`: articles grouped by topic, each a bullet `- [<title>](<relative path>) — <author>` with the summary as a sub-line.
   - Slug = `slugify(title)`; on collision append `-<short url hash>` (mirror the helper's `slugify`/`short_hash`; the skill can call `python3 -c` against `medium.py` for these if needed).

4. **Workflow: Sync**
   - Read `topics.yaml` (if missing/empty → run Wizard first).
   - For each `topics:` entry build `tag:<x>`, each `authors:` entry `author:<x>`, each `publications:` entry `pub:<x>`.
   - Run `medium.py discover <feed-spec> --limit <limit_per_feed>` for each; if a feed errors or is empty, report and continue (never abort the whole sync).
   - Load `catalog.json`; drop candidates whose `url` already appears (dedup).
   - For each new candidate: `medium.py extract <url>` → if body empty, warn and skip; else generate `summary` + 3–5 `takeaways` (use the `skills/summarize-text` skill if available, else summarize inline) → write the article file → append a catalog entry.
   - Rewrite `catalog.json` and `INDEX.md`. Report "captured N new, skipped M existing, F feeds failed."

5. **Workflow: Capture (ad-hoc)**
   - For a known URL: `extract` → summarize → file under the user-named topic (default `uncategorized`) → update catalog + INDEX.
   - For a topic phrase with no saved config: `discover tag:<slug>` → show candidates → capture the ones the user confirms (or all, if they say so), via the same per-article pipeline.

6. **Workflow: Ask (query + digests)**
   - Search `library/` (grep titles/summaries/tags/body in catalog.json + files), read top matches, answer with citations as `library/<topic>/<slug>.md`.
   - Digest variant: "what's new in <topic>" → gather that topic's recent entries and synthesize a short briefing from their summaries.

7. **Workflow: Wizard**
   - Q&A (one question at a time) for topics/authors/publications/limit → write `topics.yaml` (copying structure from `topics.example.yaml`) → confirm back to the user.

8. **Auth & etiquette** — cookie via `MEDIUM_COOKIE`/cookie file/`config.json`; personal-use note; the helper already rate-limits.

- [ ] **Step 2: Sanity-check the skill references**

Run: `cd medium-archive && grep -nE "medium\.py (discover|extract)" SKILL.md && test -f topics.example.yaml && echo OK`
Expected: matches for both commands and `OK`.

- [ ] **Step 3: Commit**

```bash
cd medium-archive
git add SKILL.md
git commit -m "feat(medium-archive): rewrite SKILL.md around sync/capture/ask/wizard"
```

---

### Task 4: Refresh `README.md` and `HOW-TO-TEST.md`

Bring the human docs in line with v2: config-driven, conversational, two-command helper.

**Files:**
- Modify (rewrite): `medium-archive/README.md`
- Modify: `medium-archive/HOW-TO-TEST.md` (at repo root today — confirm path; the medium-archive HOW-TO lives at repo root `HOW-TO-TEST.md`. If it documents medium-archive, update the medium-archive sections; otherwise add `medium-archive/HOW-TO-TEST.md`.)

- [ ] **Step 1: Rewrite README.md**

Cover: what it is (personal Medium knowledge corpus), the four workflows (sync/capture/ask/wizard), `topics.yaml` setup (point to `topics.example.yaml`), authentication (cookie sources, unchanged), the `medium.py` helper contract (`discover`, `extract`) for the curious, corpus layout (`library/<topic>/`, `catalog.json`, `INDEX.md`), and limitations (RSS = recent posts only; HTML extraction may need maintenance if Medium changes markup — update `_ArticleExtractor` in `medium.py`).

- [ ] **Step 2: Update HOW-TO-TEST**

Add a "medium-archive v2" section with concrete manual steps:
- `cd medium-archive && python3 -m pytest tests/ -v` (helper unit tests).
- `python3 medium.py discover tag:large-language-models --limit 3` → expect a JSON array.
- `python3 medium.py extract <some public medium url>` → expect Markdown.
- Skill-level: ask Claude to "sync my Medium archive" with a small `topics.yaml` and confirm files appear under `library/` with `summary`/`takeaways` front matter; ask "what have I saved about <topic>" and confirm a cited answer.

- [ ] **Step 3: Verify and commit**

Run: `cd medium-archive && python3 -m pytest tests/ -v`
Expected: PASS.

```bash
cd /home/jeff/source/JeffRepos/brainstorming
git add medium-archive/README.md HOW-TO-TEST.md medium-archive/HOW-TO-TEST.md 2>/dev/null; git add -A medium-archive
git commit -m "docs(medium-archive): update README and test guide for v2"
```

---

## Self-Review

**Spec coverage:**
- Medium-only, reuse discovery/extraction → Task 1 (keeps proven primitives). ✓
- Config + sync AND conversational capture → Task 2 (config) + Task 3 (sync/capture workflows). ✓
- Q&A wizard seeds config → Task 3 Wizard workflow + Task 2 example. ✓
- Summaries + takeaways at capture → Task 3 corpus format + Sync/Capture pipelines. ✓
- Skill-driven search + on-demand digests → Task 3 Ask workflow. ✓
- Lightweight tags → carried through `discover` JSON → front matter/catalog. ✓
- Thin Python helper (two ops) → Task 1. ✓
- Corpus inside skill folder, `MEDIUM_LIBRARY` override → Global Constraints + Task 3 formats. ✓
- Auth/dedup/etiquette preserved → Global Constraints + Task 1 (reused funcs) + Task 3. ✓
- Migration (old library compatible, replace script, rewrite docs) → Task 1 (rm script) + Task 3/4 (docs). ✓
- Testing (fixtures, no live net; manual skill steps) → Task 1 tests + Task 4 HOW-TO. ✓
- Out-of-scope items (non-Medium, cross-link graph, maintained digests, search engine) → not implemented. ✓

**Placeholder scan:** No TBD/TODO; all code/commands concrete. The HOW-TO-TEST path is flagged as "confirm at execution" with a defined fallback — acceptable.

**Type consistency:** `discover`/`extract` CLI contract, `parse_feed`/`html_to_markdown`/`slugify`/`short_hash` names, and catalog/front-matter field names are consistent across Tasks 1 and 3.
