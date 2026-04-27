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
│   ├── scenarios/             # one file per scenario
│   │   ├── cross_functional_workshop.md
│   │   └── commercial_portfolio_roadmap.md
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

Run this in Claude Code from the repo root:

```
Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

`Team A, Team B` is all five personas — Sales, PDM, and Marketing on Team A;
Support and Services on Team B. Claude resolves the rosters, loads each
persona file, runs the acknowledgment, then executes all five rounds
automatically. One message in; full transcript + `.working/` files out.

To **join as a participant**, add `Human: <your name and role> — <your angle>`
and Hermes pauses for your input at each round.

To **change topic**, edit the `Topic:` line. To **change teams**, edit
the `Teams:` line — any alias works (`Team A`, `commercial_strategy`, or
`Commercial Strategy Team`). To **change scenario**, edit the `Scenario:`
line and add a new file under `prompts/scenarios/`.

See [`runbook.md`](./runbook.md) for the full procedure and a worked example.
Score with [`evaluation/rubric.md`](./evaluation/rubric.md); target ≥14/18.

## Default model

`claude-sonnet-4-6`. Swap to `claude-opus-4-7` for higher-fidelity persona
dialogue on stakeholder runs. See `runbook.md` for details.

## Outputs

Each round is written to `.working/<YYYY-MM-DD>-<HHMM>-<slug>-roundN.md`
during the run (gitignored). To keep a run permanently, copy the round 5
synthesis to `outputs/<date>-<tag>-run.md` (also gitignored; force-add to
commit).
