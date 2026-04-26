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

The operator's job is one message. Two shapes — pick based on whether you
have an [operation-ghostwriter](#integration-with-operation-ghostwriter)
project with research already done.

**Unrooted (instinct-only):**

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

**Research-grounded (recommended for portfolio / strategic scenarios):**

```
Read prompts/system_prompt.md and follow it.

Scenario: commercial_portfolio_roadmap
Teams: Team A, Team B
Topic: 2026 commercial portfolio roadmap
Project: /path/to/projects/2026-portfolio/
```

Send to Claude in an environment that can read the relevant files (Claude
Code, or a claude.ai Project with the files synced). Claude resolves the
teams, loads the personas, optionally loads the project's research
indexes, runs the kickoff acknowledgment, and waits for round prompts.

To **change topic**, edit the `Topic:` line. To **change teams**, edit
the `Teams:` line — any alias works (`Team A`, `commercial_strategy`, or
`Commercial Strategy Team`). To **change scenario**, edit the `Scenario:`
line and add a new file under `prompts/scenarios/`. To **swap research**,
change the `Project:` line.

For the full procedure (including a no-file-access fallback and a
side-by-side rooted/unrooted compare workflow), see
[`runbook.md`](./runbook.md). Score with
[`evaluation/rubric.md`](./evaluation/rubric.md); target ≥14/18 on a
baseline run.

## Integration with operation-ghostwriter

Hermes is designed as a downstream consumer of the
[operation-ghostwriter](https://github.com/elephant-byte/operation-ghostwriter)
suite — sibling to `boardroom` and `pain-point-analysis`. When you point
Hermes at a project root via `Project:`, it:

- Reads `<project>/market-intelligence/research-index.md` and
  `<project>/competitive-analysis/research-index.md` and pulls in the
  relevant `{topic-slug}.md` documents.
- Requires personas to cite `[mi-N]` and `[ca-N]` references back to those
  documents during rounds 1–4.
- Lands the round 5 synthesis at
  `<project>/hermes/<scenario_id>--<topic-slug>.md` so it sits alongside
  the other Ghostwriter outputs.

**Where Hermes fits in the typical sequence:** market-intelligence +
competitive-analysis → **Hermes** (cross-functional alignment, mid-level)
→ prd-definition → boardroom (exec pressure-test, post-direction) →
execution. See [`runbook.md`](./runbook.md) for the Hermes-vs-boardroom
distinction.

This is "option B" integration — Hermes lives in this repo as a standalone
prompts-only POC but consumes operation-ghostwriter outputs through their
file conventions, so a future port into the suite as a first-class skill
is mechanical.

## Default model

`claude-sonnet-4-6`. Swap to `claude-opus-4-7` for higher-fidelity persona
dialogue on stakeholder runs. See `runbook.md` for details.

## Outputs

Saved synthesis artifacts go in `outputs/<YYYY-MM-DD>-<tag>-run.md`. The
`outputs/` directory is git-ignored by default — keep it that way unless you
want to publish a specific run.
