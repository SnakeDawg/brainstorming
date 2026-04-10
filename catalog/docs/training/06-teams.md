# Training 6 — Teams

There is no first-class "team" object in Claude Code. A **team** in this
catalog is a convention: **a plugin that bundles multiple subagents which
collaborate on a workflow**, plus the skills and slash commands that glue them
together.

The catalog's reference team is `plugins/review-team/`.

## What makes a "team" plugin

A team plugin typically contains:

1. **Multiple subagents** with overlapping but distinct roles. (`security-reviewer`,
   `perf-reviewer`, `test-coverage-analyst`.)
2. **A coordinator slash command** the user runs to kick off the workflow.
   (`/review-pr`.)
3. **Subagent-only skills** the agents share but the main session shouldn't
   load. (`triage-findings`.)
4. **Optional hooks** to enforce policies during the team's work.

## How the coordination actually works

Claude Code does **not** have built-in agent-to-agent messaging. Coordination
happens via the orchestrator (the main Claude session):

1. User runs `/review-pr 123`.
2. The slash command body tells the orchestrator: "Spawn the security,
   perf, and test-coverage subagents in parallel against this PR."
3. The orchestrator calls `Agent` three times in one message, each with a
   different `subagent_type`.
4. Each subagent returns a structured findings report.
5. The orchestrator (or a final synthesizer subagent) merges the reports and
   replies to the user.

That's it. No special framework. The "team" pattern is just **disciplined use
of the existing primitives**.

## Sequence diagram

```
user        orchestrator      security      perf       coverage
  |              |               |            |             |
  | /review-pr 7 |               |            |             |
  |------------->|               |            |             |
  |              | spawn (parallel)            |             |
  |              |-------------->|            |             |
  |              |--------------------------->|             |
  |              |---------------------------------------->|
  |              |               |            |             |
  |              |<--findings----|            |             |
  |              |<---------findings----------|             |
  |              |<--------------findings------------------ |
  |              |  merge        |            |             |
  |<--report-----|               |            |             |
```

## Designing a team plugin

A few rules of thumb that have held up:

- **Subagents should be narrow.** "Reviews security" beats "reviews code".
  Narrow agents are easier to brief and produce higher-signal output.
- **Use parallel spawning** when subagents are independent. The orchestrator
  can call `Agent` multiple times in a single message — they run concurrently.
- **Use sequential spawning** when one agent's output feeds the next (e.g.
  research → plan → implement).
- **Share knowledge via skills, not prompts.** If three agents need the same
  rubric, put it in a subagent-only skill and preload it via the agent's
  `skills:` frontmatter field.

## Multi-session coordination

For workflows where you want literal *separate Claude Code instances* talking
to each other (e.g. one terminal running a long backend task while another
drives the frontend), see Claude Code's "agent teams" feature in the official
docs. That's a different mechanism than what this catalog uses, and it's
overkill for most workflows.

## Worked example

[`../../plugins/review-team/`](../../plugins/review-team/) — three subagents,
one shared skill, one slash command. Reading those four files together is the
fastest way to internalize the pattern.
