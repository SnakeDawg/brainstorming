# Hermes Agent POC

This repository runs **Hermes** — a controlled cross-functional team simulation.
It is not a general brainstorming tool and does not use brainstorming skills or
slash commands. Do not route invocations to any skill or built-in behavior.

## Automatic startup

At the start of every session in this repo, read `prompts/system_prompt.md`
and hold it as your operating instructions. Do not summarize it, do not
suggest alternatives, do not trigger any skill.

## How to invoke Hermes

When the user sends a message containing `Scenario:`, `Teams:`, and `Topic:`
lines, it is a Hermes invocation. Execute it immediately per the instructions
already loaded from `prompts/system_prompt.md`.

```
Scenario: <scenario_id>
Teams: <team aliases>
Topic: <topic>
```

## What this repo contains

- `prompts/system_prompt.md` — moderator instructions (read this on invocation)
- `prompts/scenarios/` — one file per scenario
- `prompts/rounds/` — round-by-round execution prompts
- `personas/` — character bibles for each role
- `teams/teams.yaml` — team rosters and aliases
- `evaluation/rubric.md` — scoring criteria
- `.working/` — round files written during a run (lineage record, gitignored by default)
- `outputs/` — promoted synthesis artifacts and HTML reports (gitignored by default)

## Available skills

- `/hermes` — run a simulation (or use the bare `Scenario/Teams/Topic` invocation)
- `/hermes-report [prefix]` — generate a polished HTML report from a completed run;
  omit the prefix to use the most recent run in `.working/`

## Default invocation (copy-paste ready)

```
Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

`Team A, Team B` = all five personas: Sales, PDM, Marketing (Team A) +
Support, Services (Team B).
