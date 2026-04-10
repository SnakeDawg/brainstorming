# Training 3 — Hooks

A **hook** is a shell command (or LLM-evaluated prompt) that Claude Code runs
automatically when a specific event happens. Hooks let you enforce policy,
auto-format code, log activity, or block dangerous operations — without
asking the model to remember to do it.

> The model doesn't run hooks. The harness does. That's the whole point: hooks
> make a behavior **deterministic**.

## When to reach for a hook vs. a skill / instruction

| Need | Use |
|---|---|
| "Whenever Claude edits a `.py` file, run `ruff format`" | **Hook** (PostToolUse) |
| "Block any `rm -rf /` Bash command" | **Hook** (PreToolUse) |
| "Always format code I write" | **Hook**, not an instruction |
| "Generate a release note when I ask" | **Skill**, not a hook |

If you find yourself writing "from now on, always..." in CLAUDE.md, that's a
hook. The model will forget. The harness won't.

## File location

- Project: `.claude/hooks.json`
- Plugin: `plugins/<plugin>/hooks/hooks.json`

Both have the same schema.

## Minimal example

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/log-tool-use.sh"
          }
        ]
      }
    ]
  }
}
```

This runs `log-tool-use.sh` after every `Write` or `Edit` tool call. The
matcher is a regex on the tool name.

## Event catalog

The full event list is long; the ones you'll actually use:

| Event | Fires | Common use |
|---|---|---|
| `SessionStart` | Session begins | Print project context, run health checks |
| `SessionEnd` | Session ends | Cleanup, summary |
| `UserPromptSubmit` | User hits enter | Inject context, redact secrets |
| `PreToolUse` | Before any tool runs | Block dangerous calls, gate on policy |
| `PostToolUse` | After a tool succeeds | Format files, run linters, log |
| `PostToolUseFailure` | After a tool fails | Alert, retry logic |
| `Stop` | Claude stops responding | Notify, kick off next step |
| `SubagentStop` | A subagent finishes | Aggregate results |

## Hook handler types

```json
{ "type": "command", "command": "/abs/or/relative/path.sh" }
```
Runs a shell command. The hook receives JSON on stdin describing the event.
Exit code 0 = allow, non-zero = block (for `Pre*` events).

```json
{ "type": "prompt", "prompt": "Is `$ARGUMENTS` a destructive operation? Reply yes or no." }
```
Asks an LLM yes/no. Cheap way to add semantic policy without writing code.

```json
{ "type": "http", "url": "https://hooks.example.com/audit" }
```
POSTs the event JSON to a webhook. Useful for centralized audit logging.

## A real example: format on write

`plugins/common-toolkit/hooks/hooks.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/log-tool-use.sh"
          }
        ]
      }
    ]
  }
}
```

The script (`hooks/scripts/log-tool-use.sh`) reads the JSON event from stdin
and appends a line to a log file. It's intentionally minimal — replace it
with your formatter, linter, or notifier.

## Anti-patterns

- **Don't** run a hook on every `Bash` call without a narrow matcher — you'll
  pay the cost on every `ls` and `git status`.
- **Don't** put long-running work in a `Pre*` hook; it blocks the tool.
- **Don't** swallow errors in your hook script. If it fails, fail loud so the
  user notices.
