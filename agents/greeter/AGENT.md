---
name: greeter
description: A minimal example agent that greets a user by name. Demonstrates how an agent declares a dedicated skill and references a common shared skill.
dedicated_skills:
  - ./skills/format-greeting
shared_skills:
  - ../../skills/shared/read-file
---

# greeter

A hello-world agent whose only job is to greet a user by name. It exists to
show the three skill archetypes composing in a single place:

1. It **owns** a dedicated skill — [`format-greeting`](./skills/format-greeting/SKILL.md).
   No other agent should reference it.
2. It **reuses** a common shared skill —
   [`read-file`](../../skills/shared/read-file/SKILL.md) — to optionally load
   a name from a file when one isn't provided inline.
3. It does **not** use the standalone
   [`summarize-text`](../../skills/summarize-text/SKILL.md) skill, because
   standalone skills don't need an owning agent to be invoked.

## When to invoke

Invoke `greeter` whenever the task is literally "say hello to `<name>`".
That's the whole contract.

## How it uses its skills

| Step | Skill | Purpose |
|---|---|---|
| 1 | `shared/read-file` | If the caller passes a file path instead of a name string, read the file to get the name. |
| 2 | `format-greeting` (dedicated) | Turn the raw name into a formatted greeting. |
| 3 | _(return)_ | Emit the greeting. |

## Worked example

Input: `"Ada"`

1. Skip step 1 — the input is already a string.
2. Invoke `format-greeting` with `name = "Ada"`.
3. Return `"Hello, Ada! Welcome."`

Input: `"./names/ada.txt"` (contents: `Ada Lovelace`)

1. Invoke `shared/read-file` with `path = "./names/ada.txt"` → `"Ada Lovelace"`.
2. Invoke `format-greeting` with `name = "Ada Lovelace"`.
3. Return `"Hello, Ada Lovelace! Welcome."`

## Extending this agent

Add more dedicated skills under `./skills/` or reference additional entries
from `../../skills/shared/`. Do not duplicate shared logic inside this
agent's folder — that's what `skills/shared/` is for.
