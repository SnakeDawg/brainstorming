---
name: improver
description: Meta-agent that runs a measurable self-improvement loop against any agent or standalone skill. All scoring decisions are deterministic and driven by the target's user-authored test cases.
dedicated_skills:
  - ./skills/bootstrap
  - ./skills/propose
  - ./skills/run
  - ./skills/score
  - ./skills/reflect
  - ./skills/report
shared_skills:
  - ../../skills/shared/read-file
improvement_agent: ../../agents/improver
tests: ./tests.md
rubric: ./rubric.md
self_improvable: false
---

# improver

The self-improvement agent. Every other agent in this scaffold declares
`improvement_agent: ../../agents/improver` in its frontmatter; `improver` is
the engine they point at.

Improver runs a closed-loop improvement cycle against a **target** — an
agent or a standalone skill — guided by that target's **user-authored**
`tests.md` and a thin `rubric.md` that defines weights and acceptance rules.

## Core principle: scoring is deterministic

Improver uses LLMs to *propose* candidate diffs and to *execute* the target
agent under test. Improver does **not** use LLMs to judge whether a
candidate is better. All acceptance decisions are computed from:

- pattern/regex/structural matches against user-provided `expected` values
- numeric score delta vs. baseline
- regression count across previously-passing tests

LLM-as-judge is allowed only as *advisory critics* that are logged to
`lessons.md` and **never** affect the numeric verdict.

## Two modes

### `bootstrap` — set up measurement for a new target

Cooperative workflow. Improver refuses to invent test cases from an LLM; it
waits for the human to provide them. See
[`skills/bootstrap`](./skills/bootstrap/SKILL.md) for the full gate flow.

### `run` — execute the improvement loop

Requires the target to have both `tests.md` and `rubric.md`. Loop:

```
propose → run → score → (keep|discard) → reflect → repeat
```

Each iteration writes to `memory/runs/<run-id>/` under the repo root. At
the end of the run, [`skills/report`](./skills/report/SKILL.md) generates
`REPORT.md`, appends a row to `agents/<target>/HISTORY.md`, and appends a
row to `memory/INDEX.md`.

### Improvement policy

Not every invocation of a target triggers an improvement run. Each
target's `rubric.md` may define an `improvement_policy` section:

```yaml
improvement_policy:
  trigger: manual | production_count | score_drop | new_tests
  min_production_runs: 10
  backoff_multiplier: 2.0
  max_backoff_runs: 100
  max_iterations: 3
  saturated_iterations: 6
  saturation_threshold: 0.95
```

- **Backoff**: After a no-improvement run, `min_production_runs` is
  multiplied by `backoff_multiplier` (capped at `max_backoff_runs`).
  Uses a **sliding window** of the last 15 runs (not just consecutive
  failures) to detect stall state — Agent Party showed non-monotonic
  trajectories where a score-40 run followed a score-30 run.
- **Escalation**: If backoff has been applied 3+ times consecutively
  without improvement, the policy emits a warning in `HISTORY.md`
  suggesting rubric review or test expansion.
- **Cost tracking**: Each run records `cost_tokens_input`,
  `cost_tokens_output`, `cost_time_seconds`, and `cost_estimate_usd`
  in `run.md`. Token split (input vs output) matters: Agent Party
  observed a 65:1 input-to-output ratio.

## Dedicated skills

| Skill | Role |
|---|---|
| [`bootstrap`](./skills/bootstrap/SKILL.md) | Gate: wait for user-authored `tests.md`, generate starter `rubric.md`, measure first baseline |
| [`propose`](./skills/propose/SKILL.md) | Draft a candidate diff against the target |
| [`run`](./skills/run/SKILL.md) | Apply candidate to scratch, exercise target with rubric inputs, capture outputs (multi-sample) |
| [`score`](./skills/score/SKILL.md) | Deterministic: compute numeric score from outputs and `tests.md`, write verdict |
| [`reflect`](./skills/reflect/SKILL.md) | Append verbal lessons (Reflexion-style); run advisory critics; cannot flip verdicts |
| [`report`](./skills/report/SKILL.md) | Generate `REPORT.md` and update `HISTORY.md`/`INDEX.md` from evidence files |

## Shared skills used

- [`shared/read-file`](../../skills/shared/read-file/SKILL.md) — read the
  target, its tests, and its rubric.

## Why `self_improvable: false` in MVP-0

Improver is self-hosting: its `AGENT.md` is a plain markdown file that a
future ADAS-style run could, in principle, improve. That recursion is gated
off in MVP-0 to prevent obvious footguns. To enable it later, flip
`self_improvable: true` and ship a real `tests.md` for improver.

## Input contract

```
improver bootstrap <target-path>
improver bootstrap --rebaseline <target-path>
improver run       <target-path> --objective "<text>" [--max-iterations N]
improver report    <run-directory>
```

Where `<target-path>` is either `agents/<name>/` or `skills/<name>/`.

### Run ID format

```
<YYYY-MM-DD>-<target-name>-<slug>-<4-char-hex>
```

- **Slug**: first 4 words of the objective, kebab-cased, max 40 chars.
- **Hex**: first 4 chars of SHA-256 of `<iso-timestamp>-<target>-<objective>`.
- **Example**: `2026-04-14-greeter-handle-empty-input-a3f2`

This eliminates collisions from the previous `<date>-<target>-<slug>`
format.

## Safety rules

1. Never write to a target that lacks `tests.md` (bootstrap is the only
   exception, and only to create the template).
2. Never auto-apply a candidate whose `score` verdict is `reject`.
3. Never target `agents/improver/` unless `self_improvable: true`.
4. Every mutation to a target file is mirrored by a row in `HISTORY.md` and
   `INDEX.md` — the trail is append-only.
