# Training 1 — Subagents

A **subagent** is a Claude instance the main session can delegate work to.
It runs in its own context window with its own system prompt, its own tool
allowlist, and (optionally) its own model. The orchestrator only sees the
subagent's final report — not the noisy intermediate tool calls.

## Why use a subagent

Use a subagent when you want to:

- **Protect the main context** from large tool outputs (file dumps, search
  results, build logs).
- **Specialize behavior** with a focused system prompt (e.g. a security
  reviewer that's been told exactly what to look for).
- **Parallelize independent work** by spawning multiple subagents at once.
- **Restrict tool access** so the subagent can read but not write, etc.

## File format

Subagents are markdown files with YAML frontmatter, in either:

- `.claude/agents/<name>.md` — project-scoped (checked into the repo)
- `~/.claude/agents/<name>.md` — user-scoped (your machine only)
- `plugins/<plugin>/agents/<name>.md` — distributed via a plugin

```markdown
---
name: security-reviewer
description: Security-focused code review specialist. Use when looking for auth bypass, injection, secrets, or unsafe deserialization.
model: sonnet
tools: Read, Grep, Glob, Bash
---

You are a senior application security engineer. When given a file or diff:

1. Look for: auth bypass, SQLi/XSS/SSRF, hardcoded secrets, unsafe
   deserialization, missing input validation, broken access control.
2. For each finding, report:
   - Severity (Critical / High / Medium / Low / Info)
   - File and line number
   - Why it's a problem
   - Concrete fix
3. If you find nothing, say so explicitly. Do not invent issues.
```

## Frontmatter reference

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Used by the orchestrator to invoke this agent |
| `description` | yes | When to delegate. Be specific — this is what the orchestrator pattern-matches against |
| `model` | no | `sonnet`, `opus`, `haiku` — default is the parent's model |
| `tools` | no | Comma-separated allowlist. Omit to inherit all tools |
| `disallowedTools` | no | Comma-separated denylist |
| `skills` | no | Comma-separated skills to preload |
| `effort` | no | `low`, `medium`, `high`, `max` |
| `maxTurns` | no | Hard cap on tool calls |
| `isolation` | no | Set to `worktree` to give the agent its own git worktree |

## How the orchestrator chooses

When you (or the main agent) call the `Agent` tool, you pass `subagent_type`.
Claude picks the agent whose `description` best matches the task — so write
descriptions like trigger phrases, not marketing copy:

**Bad:**

```yaml
description: A really helpful agent for many code-review tasks
```

**Good:**

```yaml
description: Security-focused code review specialist. Use when looking for auth bypass, injection, secrets, or unsafe deserialization.
```

## Briefing the subagent (the prompt matters)

A subagent starts with **zero** memory of the parent conversation. When you
delegate, the prompt must be self-contained:

> Have the security-reviewer agent audit `src/auth/login.ts`. Background:
> we're switching from session cookies to JWT this sprint, and I want a fresh
> set of eyes on the new flow. Report findings as a numbered list, severity
> first. Under 200 words.

A terse "review this file" produces shallow output. A briefed prompt produces
real value.

## Worked example

See [`../../plugins/review-team/agents/security-reviewer.md`](../../plugins/review-team/agents/security-reviewer.md)
for the full agent file used by the catalog's `review-team` plugin.

## Anti-patterns

- **Don't** give a subagent every tool by default — narrow its allowlist.
- **Don't** delegate trivial work; the spawn overhead isn't worth it.
- **Don't** write a subagent that "does everything" — that's just the main
  agent. Subagents earn their keep by being focused.
