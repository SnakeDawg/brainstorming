---
name: read-file
description: Read a file from disk and return its contents as a string. Common utility usable by any agent.
scope: shared
consumers: any
---

# read-file

A common shared skill. **Any agent may reference this** from its `AGENT.md`
under `shared_skills`. It is the canonical example of the shared archetype.

The live reference is in
[`agents/greeter/AGENT.md`](../../../agents/greeter/AGENT.md):

```yaml
shared_skills:
  - ../../skills/shared/read-file
```

## Input

| Field | Type | Notes |
|---|---|---|
| `path` | string | A relative or absolute filesystem path. |

## Output

| Field | Type | Notes |
|---|---|---|
| `contents` | string | Full text of the file. |

## Behavior

```
input:  { path: "./names/ada.txt" }
output: { contents: "Ada Lovelace" }
```

Edge cases:

- File does not exist → return an error describing the missing path.
- File is binary → return an error; this skill is text-only.

## Why this is shared, not dedicated or standalone

- It is a **utility**, not an end-user operation → not standalone.
- Multiple unrelated agents will plausibly need it → not dedicated to one
  agent.
- Therefore: `scope: shared`, lives under `skills/shared/`.

## How any agent references this

In the agent's `AGENT.md` frontmatter:

```yaml
shared_skills:
  - ../../skills/shared/read-file   # if the agent is under agents/<name>/
```

No registration step. The relative path **is** the reference.
