# review-team

A "team" plugin: three focused code-review subagents that produce structured
findings, one subagent-only skill that defines the findings format, and one
slash command that runs them in parallel and merges the output.

## What ships

| Item | Type | Purpose |
|---|---|---|
| `security-reviewer` | subagent | Auth, injection, secrets, unsafe deserialization |
| `perf-reviewer` | subagent | Hot paths, N+1, allocations, big-O regressions |
| `test-coverage-analyst` | subagent | Untested branches, missing edge cases |
| `triage-findings` | skill (subagent-only) | Defines the findings JSON schema all three agents emit |
| `/review-pr` | command | Coordinator: spawns all three agents in parallel against a PR |

## How it works

1. User runs `/review-pr 123`.
2. The command body instructs the orchestrator to spawn all three subagents
   in parallel against PR #123.
3. Each subagent has the `triage-findings` skill preloaded, so they all emit
   findings in the same JSON shape.
4. The orchestrator merges the three findings lists, dedupes, sorts by
   severity, and reports back to the user.

This is deliberately simple — there's no agent-to-agent messaging, no shared
state, just disciplined use of the orchestrator's `Agent` tool.

## Install

```
/plugin marketplace add snakedawg/brainstorming
/plugin install review-team@brainstorming
```

## Use

```
/review-pr 123
```

Or invoke a single agent directly:

> Have the security-reviewer subagent audit `src/auth/login.ts`. Background:
> we're switching from session cookies to JWT this sprint. Report findings
> as a numbered list, severity first.

## Why `triage-findings` is subagent-only

The `triage-findings` skill defines a strict JSON output format. The main
session never needs that format — it would just be context bloat. By keeping
it inside this team plugin and preloading it via each agent's `skills:`
frontmatter, the format is available exactly where it's needed and nowhere
else. See [`../../docs/patterns/common-vs-subagent-skills.md`](../../docs/patterns/common-vs-subagent-skills.md).
