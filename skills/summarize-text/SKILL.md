---
name: summarize-text
description: Reduce a text blob to a one-sentence summary. Invoked directly, with no owning agent.
scope: standalone
---

# summarize-text

A standalone skill. **No agent owns this.** It is invoked directly by a
caller (a human, another tool, or a future meta-agent) whenever a text blob
needs to be collapsed to a single sentence.

Because it's standalone, it sits at the top of `skills/` rather than under
`skills/shared/`. The distinction is intent:

- **Shared** skills are utilities other agents pull in as dependencies.
- **Standalone** skills are end-user-facing operations — you invoke them for
  their own sake, not as a building block.

## Input

| Field | Type | Notes |
|---|---|---|
| `text` | string | The text to summarize. Any length. |

## Output

A single sentence capturing the main point of the input.

## Behavior

```
input:  "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday,
         revisit pricing in Q3, and hire two more engineers by end of
         month. Action items were assigned to Maria and Jon."
output: "The team agreed to ship v2 next Tuesday, revisit pricing in Q3,
         and hire two more engineers by month-end."
```

Edge cases:

- Empty input → return `""`.
- Input already a single sentence → return it unchanged.

## Invoke directly

Because this is a standalone skill, the invocation pattern is just:

> "Use the `summarize-text` skill to summarize the following text: …"

No agent wrapper is needed.

## Related

If a caller needs a summary as one step in a larger workflow, an agent
should declare `summarize-text` under `shared_skills` in its `AGENT.md`
**and** this file's frontmatter should be promoted to `scope: shared` (move
the directory to `skills/shared/summarize-text/`). Standalone and shared are
mutually exclusive — pick one.
