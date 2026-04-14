---
name: format-greeting
description: Turn a name string into a friendly greeting. Dedicated to the greeter agent.
scope: dedicated
owner: greeter
---

# format-greeting

A dedicated skill owned by the [`greeter`](../../AGENT.md) agent.

Because `scope: dedicated`, this skill lives **inside** its owning agent's
directory (`agents/greeter/skills/`) instead of under the top-level
`skills/` tree. That co-location is the signal that no other agent should
reference it.

## Input

| Field | Type | Notes |
|---|---|---|
| `name` | string | A human name, already resolved to a plain string. |

## Output

A single-line greeting string.

## Behavior

```
input:  "Ada"
output: "Hello, Ada! Welcome."
```

Edge cases:

- Empty string → `"Hello! Welcome."`
- Leading/trailing whitespace in `name` → trimmed before formatting.

## Why this is dedicated, not shared

The `format-greeting` string format is a product decision specific to the
`greeter` agent. If a second agent needs a greeting, it should define its
own formatter (possibly copying this file) rather than sharing, because
sharing would couple two unrelated product decisions to one format.

If the same formatting is genuinely needed across agents, promote it: move
the directory to `skills/shared/format-greeting/` and update this skill's
frontmatter to `scope: shared` (remove `owner`).
