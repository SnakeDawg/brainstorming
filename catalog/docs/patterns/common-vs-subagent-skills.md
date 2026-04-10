# Pattern — Common vs. Subagent-Only Skills

The catalog organizes skills into two buckets. Claude Code itself doesn't
enforce the distinction; it's a convention to keep the catalog navigable and
to keep the main session's context window lean.

## Definitions

| Bucket | Audience | Loaded by |
|---|---|---|
| **Common skill** | Main session **and** any subagent | Auto-discovered from `description`, or explicitly preloaded |
| **Subagent-only skill** | One specific subagent (or a small group of related agents) | Preloaded via the agent's `skills:` frontmatter |

## Decision flowchart

```
        Will the main session ever
          want this skill?
                |
       +--------+--------+
       |                 |
      yes                no
       |                 |
   COMMON         Will multiple unrelated
   SKILL           agents want it?
                          |
                  +-------+-------+
                  |               |
                 yes              no
                  |               |
              COMMON        SUBAGENT-ONLY
              SKILL          SKILL
```

## Why subagent-only skills exist

Three reasons to keep a skill out of the main session:

1. **Context cost.** A skill's `SKILL.md` is loaded as soon as it activates.
   If the main session doesn't need it, that's wasted tokens.
2. **Auto-invocation noise.** A skill with a broad `description` will get
   auto-picked even when it shouldn't. Hiding it inside a subagent prevents
   spurious activation.
3. **Cohesion.** A skill that only makes sense in the context of a specific
   subagent's findings JSON belongs in that team plugin, not in the global
   skill pool.

## How to mark a skill as subagent-only (in this catalog)

It's purely directory convention:

- **Common skill** → `plugins/common-toolkit/skills/<name>/SKILL.md`
- **Subagent-only skill** → `plugins/<team>/skills/<name>/SKILL.md`

Then, in the subagent that should use it, add the `skills:` frontmatter:

```yaml
---
name: security-reviewer
description: Security-focused code review specialist.
model: sonnet
tools: Read, Grep, Glob
skills: triage-findings
---
```

When the orchestrator spawns `security-reviewer`, the `triage-findings` skill
is preloaded into that subagent's context only.

If you really want to prevent the main session from auto-invoking a skill,
also set `disable-model-invocation: true` in the SKILL.md frontmatter — that
makes the skill manual-only outside the agents that explicitly preload it.

## Examples in this catalog

| Skill | Bucket | Why |
|---|---|---|
| `md-to-html` | Common | Anyone might want to convert markdown |
| `skill-validator` | Common | Anyone authoring a skill needs it |
| `triage-findings` | Subagent-only | Only makes sense after a review agent has produced a findings JSON |

## When in doubt

Default to **common**. It's easy to demote a skill to subagent-only later if
you find it activating in the wrong contexts. The reverse — promoting a
team-specific skill to common — is harder because you have to generalize the
instructions.
