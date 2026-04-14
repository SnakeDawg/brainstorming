# Agents

Each subdirectory here is one agent. An agent is defined by an `AGENT.md`
file with YAML frontmatter that declares which skills it uses.

> **Note:** This is a demo layout. It is **not** wired into Claude Code's
> native `.claude/skills/` auto-discovery — it's a plain-text scaffold a
> human or a future meta-agent can read and edit.

## Layout

```
agents/
  <agent-name>/
    AGENT.md                 # agent definition
    skills/                  # (optional) dedicated skills owned by this agent
      <skill-name>/
        SKILL.md
```

## Current agents

| Agent | Description | Dedicated skill |
|---|---|---|
| [`greeter`](./greeter/AGENT.md) | Minimal hello-world agent | [`format-greeting`](./greeter/skills/format-greeting/SKILL.md) |

## `AGENT.md` frontmatter schema

```yaml
---
name: <kebab-case>
description: <one sentence describing the agent>
dedicated_skills:
  - <relative path to a SKILL.md directory>
shared_skills:
  - <relative path to a SKILL.md directory under ../../skills/shared/>
---
```

- `dedicated_skills` are co-located under this agent's own `skills/` folder
  and should not be referenced by other agents.
- `shared_skills` point at entries under [`../skills/shared/`](../skills/shared/)
  and may be pulled in by any agent.

## Adding a new agent

1. Create `agents/<new-agent>/AGENT.md` with the frontmatter above.
2. If the agent has a dedicated skill, add it under
   `agents/<new-agent>/skills/<skill-name>/SKILL.md`.
3. Reference any needed shared skills by relative path.
4. Add a row to the "Current agents" table above.
