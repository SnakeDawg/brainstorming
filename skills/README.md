# Skills

Reusable procedural knowledge, each defined by a `SKILL.md` file with YAML
frontmatter. Two kinds live here:

- **Standalone skills** — invoked directly, not owned by any agent. They
  sit at the top level of this directory (e.g. `summarize-text/`).
- **Shared skills** — utility skills that any agent may pull into its
  `AGENT.md`. They live under [`shared/`](./shared/).

A third kind, **dedicated skills**, does **not** live here. Those are
co-located inside their owning agent's directory under
[`../agents/<agent>/skills/`](../agents/). See the
[agents README](../agents/README.md) for that pattern.

> **Note:** This is a demo layout. It is **not** wired into Claude Code's
> native `.claude/skills/` auto-discovery.

## Layout

```
skills/
  <standalone-skill>/
    SKILL.md
  shared/
    <shared-skill>/
      SKILL.md
```

## Current skills

### Standalone

| Skill | Description |
|---|---|
| [`summarize-text`](./summarize-text/SKILL.md) | Reduce a text blob to a one-sentence summary. |

### Shared

| Skill | Description | Consumers |
|---|---|---|
| [`read-file`](./shared/read-file/SKILL.md) | Read a file and return its contents. | any |

## `SKILL.md` frontmatter schema

```yaml
---
name: <kebab-case>
description: <one sentence describing what the skill does>
scope: dedicated | standalone | shared
owner: <agent-name>      # ONLY when scope == dedicated
consumers: any           # ONLY when scope == shared (informational)
---
```

- `scope: standalone` → lives at `skills/<name>/`, no owner.
- `scope: shared` → lives at `skills/shared/<name>/`, any agent may use it.
- `scope: dedicated` → lives at `agents/<owner>/skills/<name>/` (NOT here).

## Adding a new skill

1. Decide the scope first — dedicated, standalone, or shared.
2. Put the directory in the matching location.
3. Fill in the frontmatter to match the schema above.
4. Add a row to the appropriate table in this README.
