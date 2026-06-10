# Knowledge Base

This folder is the team's knowledge base. Everything is plain markdown —
GitHub renders this page (and every `README.md` below) automatically, so you
can navigate the whole knowledge base just by clicking links in the GitHub web
UI. The same files also power the [docs website](#the-docs-website) if GitHub
Pages is enabled.

> New here? Read [`POC-GUIDE.md`](https://github.com/SnakeDawg/brainstorming/blob/main/POC-GUIDE.md)
> at the repo root first — it explains how the whole system fits together.

## Sections

| Section | What lives here |
|---|---|
| [Strategy](strategy/README.md) | Product vision, objectives, strategic pillars |
| [Roadmaps](roadmaps/README.md) | Now / Next / Later roadmaps that trace back to strategy |
| [Research](research/README.md) | Research questions and findings |
| [Analysis](analysis/README.md) | Data analysis and investigation write-ups |
| [Decisions](decisions/README.md) | Decision records — what was decided and why |
| [Projects](projects/README.md) | Per-project dashboards linking work, docs, and issues |
| [AI on GitHub](ai-on-github.md) | What AI/Claude integration looks like in this setup |
| [Conventions](conventions.md) | Naming, folder, and linking rules |

## How content gets here

There are two paths:

1. **Write it directly.** Edit or add a markdown file (on GitHub: press `.` or
   click the pencil icon — no local tools needed). Follow
   [conventions](conventions.md) and use the `_template.md` in each section.
2. **Fill in a form.** Open a
   [new issue](https://github.com/SnakeDawg/brainstorming/issues/new/choose)
   using one of the structured forms (initiative proposal, feature brief,
   research task). Work the issue through its states; when it's closed with
   the `kb` label, an automation writes the result into the right section
   here automatically.

## The docs website

If GitHub Pages is enabled, this same folder is published as a navigable
website (sidebar, search, no GitHub knowledge needed) via MkDocs — see
`mkdocs.yml` at the repo root. To preview locally:

```
pip install mkdocs-material
mkdocs serve
```
