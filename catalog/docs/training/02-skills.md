# Training 2 — Skills

A **skill** is a chunk of reusable knowledge + tooling that Claude can pull
into context on demand. Think of it as a mini-playbook: "when the user asks X,
follow these steps, and here are scripts to help."

Skills are the most reusable primitive in Claude Code — they work in the main
session, inside any subagent, and can ship as part of a plugin.

## File layout

```
skills/<skill-name>/
├── SKILL.md              # required — frontmatter + core instructions
├── reference.md          # optional — loaded only when Claude reads it
├── examples.md           # optional — same
└── scripts/              # optional — executable helpers
    └── do_thing.py
```

## Minimal SKILL.md

```markdown
---
name: md-to-html
description: Convert a Markdown file to standalone HTML. Use when the user asks for HTML output, a static page, or release notes from a markdown file.
allowed-tools: Read Write Bash
---

When the user asks to convert markdown to HTML:

1. Read the source `.md` file with the Read tool.
2. Run the bundled converter:
   ```
   python ${CLAUDE_SKILL_DIR}/scripts/md_to_html.py <input.md> <output.html>
   ```
3. Confirm the output path back to the user.
```

## Frontmatter reference

| Field | Required | Notes |
|---|---|---|
| `name` | no | Defaults to directory name |
| `description` | yes-ish | Without it, Claude can't auto-invoke the skill |
| `allowed-tools` | no | Space-separated tool allowlist for this skill |
| `disable-model-invocation` | no | If `true`, only the user can invoke (not Claude) |
| `argument-hint` | no | Shown in autocomplete when the skill is user-invoked |
| `model` | no | Override session model while skill is active |
| `effort` | no | `low`/`medium`/`high`/`max` |

## Progressive disclosure — the killer feature

`SKILL.md` itself is loaded as soon as the skill activates. Anything else in
the directory is loaded **only when Claude explicitly reads or runs it**.

That means a skill can ship a 50-page reference manual and a dozen helper
scripts without bloating the context window. Claude pulls in just the file it
needs for the task at hand.

```markdown
For HTML conversion options, see `reference.md`.
For edge cases (tables, code blocks, footnotes), see `examples.md`.
```

When the user asks about footnote handling, Claude opens `examples.md`. Until
then, those tokens cost nothing.

## Variable substitution

Inside SKILL.md (and skill scripts) you can use:

| Variable | Expands to |
|---|---|
| `${CLAUDE_SKILL_DIR}` | Absolute path to this skill's directory |
| `${CLAUDE_SESSION_ID}` | Current Claude Code session ID |
| `$ARGUMENTS` | All user-supplied args (when invoked manually) |
| `$1`, `$2`, ... | Positional arguments |

## Common vs. subagent-only skills

The catalog separates skills into two buckets:

- **Common** (`plugins/common-toolkit/skills/`) — work both in the main
  session and inside any subagent. Examples: `md-to-html`, `skill-validator`.
- **Subagent-only** (`plugins/<team>/skills/`) — designed to be loaded by a
  specific subagent in that team. Example: `triage-findings` is preloaded by
  the review-team agents and assumes a "findings JSON" already exists in
  context.

See [`../patterns/common-vs-subagent-skills.md`](../patterns/common-vs-subagent-skills.md)
for the full pattern.

## How Claude picks a skill

When the user makes a request, Claude scans the `description` of every
available skill and picks the best match. Write descriptions as **trigger
sentences**, not summaries:

- **Bad:** `description: A markdown utility.`
- **Good:** `description: Convert a Markdown file to standalone HTML. Use when the user asks for HTML output, a static page, or release notes from a markdown file.`

## Validating a skill

The catalog ships a `skill-validator` skill that lints any `SKILL.md` file:

```
python catalog/plugins/common-toolkit/skills/skill-validator/scripts/validate_skill.py path/to/SKILL.md
```

It checks frontmatter, required fields, and that referenced scripts/files
actually exist.

## Worked example

- [`../../plugins/common-toolkit/skills/md-to-html/`](../../plugins/common-toolkit/skills/md-to-html/) — common skill with a script
- [`../../plugins/common-toolkit/skills/skill-validator/`](../../plugins/common-toolkit/skills/skill-validator/) — common skill with reference + script
- [`../../plugins/review-team/skills/triage-findings/`](../../plugins/review-team/skills/triage-findings/) — subagent-only skill
