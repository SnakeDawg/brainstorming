# Hermes Agent POC

A prompts-only POC that simulates a cross-functional team — Sales, PDM,
Marketing, Support, Services — to surface requirements, expose misalignment,
and reveal decision logic. Replaces weeks of interviews with a controlled,
repeatable simulation.

> **Status:** initial artifact set. No code; everything runs by pasting prompts
> into Claude. See [`runbook.md`](./runbook.md) to do a run.

## Repo layout

```
.
├── README.md                  # this file
├── REQUIREMENTS.md            # full POC requirements doc (sections 1-8)
├── runbook.md                 # operator script — how to run one simulation
├── personas/                  # one file per role; the character bibles
│   ├── sales.md
│   ├── pdm.md
│   ├── marketing.md
│   ├── support.md
│   └── services.md
├── teams/
│   └── teams.yaml             # team rosters + scenario config
├── prompts/
│   ├── system_prompt.md       # moderator framing + invocation contract
│   ├── scenarios/
│   │   └── cross_functional_workshop.md   # one file per scenario
│   └── rounds/
│       ├── round1_opening.md
│       ├── round2_cross_examination.md
│       ├── round3_gap_surfacing.md
│       ├── round4_convergence.md
│       └── round5_synthesis.md
└── evaluation/
    └── rubric.md              # 9 criteria, 18-point scoring
```

## Quick start

The operator's job is one message:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

…sent to Claude in an environment that can read these files (Claude Code in
this repo, or a claude.ai Project with the files synced). Claude resolves the
teams, loads the personas, runs the kickoff acknowledgment, and waits for
round prompts.

To **change topic**, edit the `Topic:` line. To **change teams**, edit the
`Teams:` line — any alias works (`Team A`, `commercial_strategy`, or
`Commercial Strategy Team`). To **change scenario**, edit the `Scenario:` line
and add a new file under `prompts/scenarios/`.

For the full procedure (including a no-file-access fallback), see
[`runbook.md`](./runbook.md). Score with
[`evaluation/rubric.md`](./evaluation/rubric.md); target ≥14/18 on a baseline
run.

## Default model

`claude-sonnet-4-6`. Swap to `claude-opus-4-7` for higher-fidelity persona
dialogue on stakeholder runs. See `runbook.md` for details.

## Outputs

Saved synthesis artifacts go in `outputs/<YYYY-MM-DD>-<tag>-run.md`. The
`outputs/` directory is git-ignored by default — keep it that way unless you
want to publish a specific run.
