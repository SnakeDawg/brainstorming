# 0001 — Use GitHub as the knowledge-management system

- **Status:** active
- **Owner:** @SnakeDawg
- **Date:** 2026-06-10
- **Source:** —

## Decision

Run team knowledge management (strategy, roadmaps, research, analysis,
decisions) out of a GitHub repository as plain markdown, with issue forms and
GitHub Actions providing the workflow layer.

## Options considered

1. **Dedicated wiki/KM tool** — good editing UX, but separate from where work
   happens, separate permissions, and content rots unnoticed.
2. **GitHub repository (chosen)** — markdown is reviewable like code, history
   is free, issues/Projects provide workflow, and Pages provides a readable
   site. Everything lives next to the work.
3. **Shared drive documents** — zero structure, no review, poor search.

## Consequences

- Contributors need basic GitHub literacy (editing files, opening issues) —
  mitigated by issue forms and the [POC guide](https://github.com/SnakeDawg/brainstorming/blob/main/POC-GUIDE.md).
- Automation depends on GitHub Actions being enabled on the instance; the
  structure works without it, just with manual filing.
