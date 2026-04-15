# Skills

Reusable procedural knowledge, each defined by a `SKILL.md` file with
YAML frontmatter. Two kinds live here:

- **Standalone skills** — invoked directly, not owned by any agent. They
  sit at the top level of this directory (e.g. `summarize-text/`).
  Standalone skills MUST ship their own `tests.md` and `rubric.md`.
- **Shared skills** — utility skills that any agent may pull into its
  `AGENT.md`. They live under [`shared/`](./shared/). Shared skills do
  NOT need a rubric; they are covered by the calling agent's rubric.
  Shared skills MAY ship an optional `examples.md` with worked
  input/output pairs. Calling agents SHOULD tag tests that exercise
  shared skills with `exercises: [shared-skill-name]` in the
  `~~~test~~~` block (informational, not scored — for coverage tracking).

A third kind, **dedicated skills**, does **not** live here. Those are
co-located inside their owning agent's directory under
[`../agents/<agent>/skills/`](../agents/). Dedicated skills inherit
their tests/rubric from the owning agent. See the
[agents README](../agents/README.md) for that pattern.

> **Note:** This is a demo layout. It is **not** wired into Claude Code's
> native `.claude/skills/` auto-discovery.

## Layout

```
skills/
  <standalone-skill>/
    SKILL.md
    tests.md                 # required for standalone skills
    rubric.md                # required for standalone skills
  shared/
    <shared-skill>/
      SKILL.md               # no tests/rubric needed
```

## Current skills

### Standalone

| Skill | Description | Rubric |
|---|---|---|
| [`summarize-text`](./summarize-text/SKILL.md) | Reduce a text blob to a one-sentence summary | [`rubric.md`](./summarize-text/rubric.md) |
| [`onboard`](./onboard/SKILL.md) | Interactive wizard to scaffold new agents/skills with correct frontmatter and test templates | [`rubric.md`](./onboard/rubric.md) |

### Shared

| Skill | Description | Consumers | Examples |
|---|---|---|---|
| [`read-file`](./shared/read-file/SKILL.md) | Read a file and return its contents | any | [`examples.md`](./shared/read-file/examples.md) |
| [`execute`](./shared/execute/SKILL.md) | Canonical spec for match types, diff application, and test parsing | any | (spec is self-documenting) |

## `SKILL.md` frontmatter schema

```yaml
---
name: <kebab-case>
description: <one sentence describing what the skill does>
scope: dedicated | standalone | shared
owner: <agent-name>             # only when scope == dedicated
consumers: any                  # only when scope == shared (informational)
improvement_agent: ../../agents/improver   # standalone only
tests:  ./tests.md                         # standalone only
rubric: ./rubric.md                        # standalone only
---
```

- `scope: standalone` → lives at `skills/<name>/`, ships tests/rubric.
- `scope: shared` → lives at `skills/shared/<name>/`, no tests/rubric.
- `scope: dedicated` → lives at `agents/<owner>/skills/<name>/`
  (NOT here); inherits tests/rubric from owning agent.

## Self-improvement for standalone skills

Standalone skills participate in the same loop as agents. To bootstrap
a new standalone skill:

```
improver bootstrap skills/<new-skill>
```

The rules are identical to agent bootstrap: `tests.md` is
human-authored, `rubric.md` is generated, and the improver refuses to
run the loop until both exist. See
[`../agents/improver/skills/bootstrap/SKILL.md`](../agents/improver/skills/bootstrap/SKILL.md).

## Adding a new skill

1. Decide the scope first — dedicated, standalone, or shared.
2. Put the directory in the matching location.
3. Fill in the frontmatter to match the schema above.
4. If standalone: run `improver bootstrap skills/<new-skill>` and fill
   in `tests.md`.
5. Add a row to the appropriate table in this README.
