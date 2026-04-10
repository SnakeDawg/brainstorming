# skill-validator — Rule Reference

The exhaustive list of checks `validate_skill.py` runs. Loaded only when
Claude (or a human) needs the gory details.

## Frontmatter rules

### F001 — Missing frontmatter

A SKILL.md must begin with `---`, contain YAML-ish key/value pairs, and end
the block with another `---`.

```markdown
---
name: my-skill
description: ...
---
```

**Failure:** No `---` markers, or only one.

### F002 — Required field: `name`

`name` is required. Conventionally lowercase-with-hyphens, matching the
parent directory name.

### F003 — Required field: `description`

`description` is required for any skill that wants Claude to auto-invoke it.
Without it, the skill is invisible to the model-side picker.

### F004 — Description too short

A description under 30 characters cannot reliably trigger auto-invocation.
Aim for one full sentence that names **what** the skill does and **when** to
use it.

**Bad:** `description: html stuff`
**Good:** `description: Convert a Markdown file to standalone HTML. Use when the user asks for HTML output, a static page, or release notes from a markdown file.`

### F005 — Description missing trigger phrase

A warning (not an error) if the description doesn't contain a phrase like
"use when", "when the user", "when you need". These phrases dramatically
improve auto-invocation accuracy.

### F006 — Unknown frontmatter key

Warns on keys that aren't in the documented set:

```
name, description, allowed-tools, disable-model-invocation, user-invocable,
model, effort, context, agent, paths, shell, argument-hint
```

Typos like `allowed_tools` (underscore instead of hyphen) get caught here.

### F007 — `allowed-tools` syntax

Tools must be **space-separated**, not comma-separated:

**Bad:** `allowed-tools: Read, Grep, Bash`
**Good:** `allowed-tools: Read Grep Bash`

(Note: subagent frontmatter uses commas. Skill frontmatter uses spaces. Yes,
it's confusing.)

## Body rules

### B001 — Body is empty

If the body after the frontmatter is empty or whitespace-only, the skill has
no instructions and won't be useful.

### B002 — Broken `${CLAUDE_SKILL_DIR}` reference

Every `${CLAUDE_SKILL_DIR}/path/to/file` mention in the body must resolve to
a real file in the skill directory. The validator scans for these patterns
and stats each path.

```markdown
Run python ${CLAUDE_SKILL_DIR}/scripts/foo.py    # checked
```

### B003 — Body too short (warning)

A body under 100 characters is probably not enough instruction. Skills that
just say "do the thing" tend to produce inconsistent results.

## Best-practice warnings

These are **warnings**, not errors. They don't fail the validator but they're
worth fixing.

### W001 — `description` mentions "this skill"

Self-referential descriptions ("this skill converts...") are slightly worse
for auto-invocation than active descriptions ("converts...").

### W002 — Body uses second person without context

If the body says "you should..." with no preceding "When the user asks
to...", Claude may apply the skill in the wrong context. Anchor the
instructions to a trigger.

### W003 — `allowed-tools` includes `Bash` without a constraint

`allowed-tools: Bash` allows any shell command. Prefer constrained patterns
like `Bash(git *)` or `Bash(python3 *)` when possible.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | All checks passed (warnings allowed) |
| 1 | At least one error |
| 2 | Usage / IO error |

## Suppressing a rule

There is no in-file suppression mechanism. If a rule is wrong, file an issue
on the catalog repo and we'll either fix the validator or document the
exception.
