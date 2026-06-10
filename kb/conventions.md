# Knowledge Base Conventions

These rules keep the knowledge base navigable as it grows from 8 folders to
80. They are conventions, not enforcement — follow them and everything stays
clickable in both the GitHub UI and the docs site.

## Folder layout

- One folder per **section** (`strategy/`, `roadmaps/`, `research/`, ...).
- Every folder has a `README.md` that acts as its index. GitHub renders it
  automatically when someone opens the folder; MkDocs uses it as the section
  landing page. **A document that isn't linked from its section README is
  invisible — always add the link.**
- Larger efforts get their own subfolder under `projects/` with their own
  `README.md` dashboard.

## File naming

- Lowercase, hyphen-separated: `checkout-funnel-dropoff.md`.
- Date-prefix documents that are snapshots in time: `2026-06-design-system-options.md`.
- Number decision records sequentially: `0001-`, `0002-`, ...
- Each section has a `_template.md` — copy it to start a new doc. (The leading
  underscore keeps templates sorted to the top and out of the way.)

## Document headers

Every document starts with the same four lines so readers can orient instantly:

```markdown
# Title of the document

- **Status:** draft | active | done | superseded
- **Owner:** @github-username
- **Date:** 2026-06-10
- **Source:** link to the originating issue, if any
```

## Linking

- Use **relative links** between knowledge-base docs:
  `[roadmap](../roadmaps/customer-portal-roadmap.md)`. These work in the
  GitHub UI, in the docs site, and survive repo renames.
- Link to issues and pull requests with their full URL or `#123` shorthand
  (the shorthand only renders on GitHub, so prefer full URLs in docs that the
  website serves).
- Roadmap items link **backward** to the strategy pillar they serve and
  **forward** to the issues that implement them. This three-way chain
  (strategy → roadmap → issue) is what makes the knowledge base answer
  "why are we doing this?" at every level.

## States

Work items (issues) move through three states, tracked with labels:

`status:triage` → `status:in-progress` → `status:done`

Documents use the `Status:` header line instead. When an issue closes, the
automation stamps the generated doc `done`.
