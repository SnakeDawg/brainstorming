# Knowledge Management on GitHub — POC Guide

This repo contains a working proof-of-concept for running product-management
knowledge work — strategy, roadmaps, research, analysis, decisions — entirely
out of GitHub. It's the same pattern as the "whole app running in GitHub" you
may have seen another team use: it's not a special app, it's four standard
GitHub features composed together.

**Start the tour here → open the [`kb/`](kb/README.md) folder and just click around.**

---

## The big idea: GitHub already renders markdown as a website

When you open any folder in the GitHub web UI, GitHub automatically displays
that folder's `README.md` as a formatted page. Links between markdown files
are clickable. That means a tree of folders with good README index pages *is*
a navigable knowledge base — no tooling, no build step, no app. A team with
75–100 folders of markdown is using exactly this.

Everything else in this POC builds on that.

## The four pieces and what powers them

| What you saw / want | GitHub feature | Where it is in this repo |
|---|---|---|
| Folders of research/analysis docs with navigation | Markdown + README rendering | [`kb/`](kb/README.md) |
| "Mini app": forms you fill in, items that change state | **Issue Forms** + labels + **Projects** boards | [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) |
| State change → documentation updates itself | **GitHub Actions** (built-in automation) | [`.github/workflows/issue-to-doc.yml`](.github/workflows/issue-to-doc.yml) |
| A polished website UI with sidebar + search | **GitHub Pages** + MkDocs | [`mkdocs.yml`](mkdocs.yml), [`.github/workflows/docs-site.yml`](.github/workflows/docs-site.yml) |
| AI that answers/updates docs when mentioned | Actions + Claude | [`kb/ai-on-github.md`](kb/ai-on-github.md), [`.github/workflows/claude.yml`](.github/workflows/claude.yml) |

## The PM workflow, end to end

This is **not a bug tracker or a Jira clone** — it's a strategy workflow for
product managers:

1. **A PM fills in a form.** *Issues → New issue* shows three structured
   forms: **Initiative proposal** (problem, target metric, strategic pillar,
   timeframe), **Feature brief** (user need, page/component, acceptance
   criteria, roadmap item it supports), and **Research task** (question,
   context, findings).
2. **The item moves through states.** Labels track it:
   `status:triage → status:in-progress → status:done`. A GitHub **Projects**
   board shows all items as columns/timeline (setup below).
3. **Closing the issue updates the documentation.** The issue-to-doc
   automation parses the form answers and commits them into the knowledge
   base: initiative proposals become docs in `kb/strategy/`, research
   write-ups land in `kb/research/`, and feature briefs append a row to the
   roadmap in `kb/roadmaps/`. The PM never edits markdown unless they want to.
4. **Everyone reads the result** in the GitHub UI or on the docs website.

## Works even with zero automation

Every piece degrades gracefully if your GitHub Enterprise Server (GHES)
doesn't have Actions or Pages enabled:

| Piece | With Actions/Pages | Without |
|---|---|---|
| Knowledge base | same | same — it's just markdown |
| Issue forms + labels + Projects | same | same — these are core GitHub |
| Issue → doc filing | automatic on close | copy the section `_template.md` by hand |
| Docs website | published to Pages | `pip install mkdocs-material && mkdocs serve` locally |
| @claude AI | works once enabled | not available |

## Checklist: questions for your GitHub admins

Ask these to find out what your GHES instance unlocks:

1. **"Is GitHub Actions enabled, and do we have runners?"**
   GHES typically uses *self-hosted runners* (machines your org operates).
   Yes → the issue-to-doc and docs-site automations work.
   *(If yes: change `runs-on: ubuntu-latest` in the workflows to your
   runner's label, e.g. `runs-on: [self-hosted]`.)*
2. **"Is GitHub Pages enabled, and can it deploy from Actions?"**
   Yes → the docs website publishes automatically.
3. **"What GHES version are we on?"**
   Issue Forms and Projects need a reasonably recent version (3.6+); newer is
   better for the Pages-from-Actions deploy flow.
4. **"Can a runner reach the internet (specifically `api.anthropic.com`)?"**
   Needed only for the AI piece. Also note: `runs-on: ubuntu-latest` and
   marketplace actions like `actions/checkout` must be available on your
   instance (admins usually sync them via GitHub Connect).
5. **"Can we get an Anthropic API key approved?"**
   Needed only for the AI piece; stored as a repo secret, never in code.

## One-time manual setup (things that can't live in files)

These are repo settings, not files, so do them once per repo:

1. **Create the status labels.** *Issues → Labels → New label*:
   `status:triage`, `status:in-progress`, `status:done`.
   (The forms auto-apply `kb`, a type label, and `status:triage`; GitHub
   creates label names on first use by a template, but creating them up front
   gives them colors.)
2. **Create a Projects board.** *Projects → New project → Board*. Add this
   repo's issues, group by the `status:` labels, and try the **Roadmap**
   layout for a timeline view. Boards live in the UI — they can't be
   committed as files, which is why this is manual.
3. **Enable Pages.** *Settings → Pages → Source: GitHub Actions*.
4. **(Optional, for AI)** add the `ANTHROPIC_API_KEY` secret and set the
   repository variable `ENABLE_CLAUDE=true` — details in
   [`kb/ai-on-github.md`](kb/ai-on-github.md).

## How to demo the whole loop (5 minutes)

> The automations trigger from the **default branch**, so merge this POC to
> `main` first.

1. Open *Issues → New issue → Research task*. Fill in a question. Submit.
2. Show the issue: the form answers are structured sections; labels say
   `kb`, `research`, `status:triage`.
3. Move it on the Projects board to *In progress* (swap the status label).
4. Edit the issue's **Findings** section with a result, then **close it**.
5. Watch the *Actions* tab: the "Issue to doc" workflow runs, and ~30 seconds
   later a new document appears in [`kb/research/`](kb/research/) — already
   linked from the section index.
6. If Pages is enabled, open the docs site: the new doc is in the sidebar and
   searchable.

## Where to go after the POC

- Replace the sample content in `kb/` with your real strategy and roadmap
  (the `_template.md` files show the shape).
- Edit the dropdown options in `.github/ISSUE_TEMPLATE/*.yml` to your real
  pillars and roadmap items.
- Port the repo to your GHES instance (push the repo, redo the one-time
  setup above) and run the demo there.
- This repo also contains an experimental markdown agent/skills scaffold
  (`agents/`, `skills/` — see the root [`README.md`](README.md)). It's
  separate from the knowledge base but shows where the AI side can go.
