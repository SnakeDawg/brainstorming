---
name: format-summary
description: Condense a text blob into 3–5 bullet points capturing the key information.
scope: dedicated
owner: summarizer
---

# format-summary

A dedicated skill owned by the [`summarizer`](../../AGENT.md) agent.

Because `scope: dedicated`, this skill lives inside its owning agent's
directory and must not be referenced by any other agent. If multiple agents
need bullet-point summarization, promote this to `skills/shared/format-summary/`
and update the frontmatter to `scope: shared`.

## Input

| Field | Type | Notes |
|---|---|---|
| `text` | string | The raw text to summarize. Already resolved to a string (file reading is handled upstream by `read-file`). |

## Output

A bullet list of 3–5 items, one item per line, each starting with `- `.

## Behavior

```
input:  "The quarterly review covered three topics: revenue is up 12% YoY,
         the new product launch is delayed to Q3, and two engineering leads
         will be hired by end of month."

output: "- Revenue up 12% year-over-year
         - New product launch delayed to Q3
         - Two engineering leads to be hired by end of month"
```

Rules:

1. **3–5 bullets.** Never fewer than 3, never more than 5. If the source has
   fewer than 3 distinct points, expand the most important one into two bullets.
2. **One idea per bullet.** Each bullet captures exactly one fact or action.
3. **No filler.** Omit transitional phrases ("Additionally", "Furthermore").
   Start each bullet with the subject noun or verb.
4. **Present tense.** Normalize past-tense events to present tense where
   unambiguous ("was increased" → "increased").

Edge cases:

- Empty string → return `""`.
- Input already a bullet list → return it unchanged (idempotent).
- Single sentence → expand into 3 bullets by restating from different angles,
  or return as a single bullet if expansion would be meaningless.

## Why this is dedicated, not shared

The bullet format and count rules are product decisions specific to the
`summarizer` agent's output contract. A different agent needing summaries
should define its own formatter (or negotiate a promotion to `scope: shared`)
rather than coupling to these rules.
