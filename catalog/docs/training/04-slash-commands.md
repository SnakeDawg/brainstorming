# Training 4 — Slash Commands

A **slash command** is a user-invocable shortcut. Typing `/review-pr 123` in
Claude Code is equivalent to pasting the body of `review-pr.md` into the chat,
with `$ARGUMENTS` replaced by `123`.

Slash commands are the cheapest way to standardize team workflows.

## File location

- Project: `.claude/commands/<name>.md`
- User: `~/.claude/commands/<name>.md`
- Plugin: `plugins/<plugin>/commands/<name>.md`

## Minimal example

```markdown
---
description: Scaffold a new skill directory under the catalog.
argument-hint: <skill-name>
allowed-tools: Bash(mkdir *) Write
---

Create a new skill at `catalog/plugins/common-toolkit/skills/$1/`:

1. Create the directory.
2. Write a starter `SKILL.md` with frontmatter (`name: $1`, empty `description`).
3. Create an empty `scripts/` subdirectory.
4. Print the path so the user can open it.
```

When the user runs `/catalog-new my-thing`, the body becomes the next user
prompt with `$1` → `my-thing`.

## Frontmatter reference

| Field | Required | Notes |
|---|---|---|
| `description` | yes | Shown in the `/` autocomplete menu |
| `argument-hint` | no | Hint shown while typing args |
| `allowed-tools` | no | Pre-approves tools so the user isn't prompted |
| `disable-model-invocation` | no | If `true`, Claude can't invoke; user-only |
| `model` | no | Override the session model |

## Argument substitution

| Token | Expands to |
|---|---|
| `$ARGUMENTS` | Everything after the command name |
| `$1`, `$2`, ... | Positional arguments (whitespace-split) |

## Skill vs. command — when to pick which

Both formats look similar. Rule of thumb:

- **Skill** — Claude decides to invoke it based on the user's natural-language
  request. ("Convert this markdown to HTML" → activates `md-to-html` skill.)
- **Command** — User explicitly types `/name`. Best for repeatable workflows
  the user wants on a keystroke.

A skill can also be `user-invocable: true`, blurring the line. The catalog
convention: if it's mostly natural-language triggered, write a skill. If it's
a deliberate workflow shortcut, write a command.

## Pre-approving tools

The `allowed-tools` frontmatter pre-approves tools so the user isn't prompted
mid-command. Use **specific** patterns:

```yaml
allowed-tools: Bash(git status:*) Bash(git diff:*) Read
```

Avoid wildcards like `Bash(*)` — that defeats the security model.

## A real example

See [`../../plugins/review-team/commands/review-pr.md`](../../plugins/review-team/commands/review-pr.md)
for the catalog's `/review-pr` command, which delegates to multiple subagents
in parallel.

## Anti-patterns

- **Don't** make a command for something Claude already does well. `/explain`
  is just "explain this code."
- **Don't** put secrets in the body — slash commands are checked into git.
- **Don't** over-allow tools. `Bash(git *)` is fine. `Bash(*)` is not.
