# Hermes Agent POC

This repository runs **Hermes** — a controlled cross-functional team simulation.
It is not a general brainstorming tool and does not use brainstorming skills or
slash commands. Do not route invocations to any skill or built-in behavior.

## How to invoke Hermes

When the user sends a message in this shape, it is a Hermes invocation:

```
Read prompts/system_prompt.md and follow it.

Scenario: <scenario_id>
Teams: <team aliases>
Topic: <topic>
```

**Respond by reading `prompts/system_prompt.md` and following it exactly.**
Do not summarize it, do not suggest alternatives, do not trigger any skill.
The system prompt is the complete instruction set.

## What this repo contains

- `prompts/system_prompt.md` — moderator instructions (read this on invocation)
- `prompts/scenarios/` — one file per scenario
- `prompts/rounds/` — round-by-round execution prompts
- `personas/` — character bibles for each role
- `teams/teams.yaml` — team rosters and aliases
- `evaluation/rubric.md` — scoring criteria
- `.working/` — round files written during a run (gitignored by default)
- `outputs/` — promoted synthesis artifacts (gitignored by default)

## Default invocation (copy-paste ready)

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

`Team A, Team B` = all five personas: Sales, PDM, Marketing (Team A) +
Support, Services (Team B).
