# Self-improvement — full specification

Deep-dive reference for the `agents/improver` meta-agent, its improvement
policy, scoring contract, and research foundations. For a quick overview see
the [README](./README.md).

---

## How it works

`agents/improver` runs a closed-loop improvement cycle against any **target**
— an agent or a standalone skill — guided by that target's user-authored
`tests.md` and a thin `rubric.md`.

### Core principle: scoring is deterministic

LLMs are used to *propose* candidate changes and to *execute* the target under
test. LLMs are **never** used to judge whether a candidate is better. The
accept/reject verdict is a pure function of:

- pattern / regex / structural matches against user-authored `expected` values
- numeric score delta vs. baseline
- regression count across previously-passing tests

LLM-as-judge is allowed only as *advisory critics* — logged to `lessons.md`,
never affecting the numeric verdict.

### The six dedicated skills

| Skill | Role |
|---|---|
| [`bootstrap`](./agents/improver/skills/bootstrap/SKILL.md) | Gate: wait for user-authored `tests.md`, generate `rubric.md`, measure first baseline |
| [`propose`](./agents/improver/skills/propose/SKILL.md) | Draft a candidate diff — the only creative step; includes `reasoning_chain` |
| [`run`](./agents/improver/skills/run/SKILL.md) | Apply diff to scratch copy, exercise target with multi-sample invocations |
| [`score`](./agents/improver/skills/score/SKILL.md) | Deterministic scoring — the only accept/reject authority |
| [`reflect`](./agents/improver/skills/reflect/SKILL.md) | Reflexion-style verbal memory; advisory critics; cannot flip verdicts |
| [`report`](./agents/improver/skills/report/SKILL.md) | Generate `REPORT.md`, append to `HISTORY.md` + `INDEX.md` |

---

## The self-improvement contract

**Every agent MUST ship `tests.md` and `rubric.md`.** Standalone skills too.
Shared and dedicated skills inherit from their caller / owning agent. Improver
refuses to run the loop against a target that doesn't satisfy this contract.

### `tests.md` — user-authored, deterministic only

Ground truth. Human-written. Every block is a deterministic test case. No LLM
interpretation in the scoring path.

```markdown
---
agent: greeter
version: 1
---

~~~test
id: t1
name: basic name
input: "Ada"
match: contains
expected: "Hello, Ada"
samples: 3
pass_rate: 1.0
~~~
```

#### `~~~test~~~` block fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | string | — | Unique test identifier; must match rubric weight IDs |
| `name` | string | — | Human-readable label |
| `input` | string | — | Input passed to the target |
| `match` | string | — | One of the 8 match types below |
| `expected` | string/number/list | — | Expected value (type depends on match) |
| `samples` | int | 3 | Independent invocations per test |
| `pass_rate` | float | 1.00 | Minimum fraction of samples that must pass |
| `partial_credit` | boolean | false | If true, `score_t = sample_rate` instead of binary |
| `normalize` | string | none | `whitespace`, `case`, or `both` |
| `tolerance` | float | 0 | For `equals_number`: allowed absolute difference |
| `exercises` | list | [] | Shared skill names this test exercises (informational) |

#### Match types

Supported: `exact`, `contains`, `not_contains`, `regex`, `json_path`,
`length_between`, `equals_number`, `shell`.

Full pseudocode, edge-case tables, and normalization reference →
[`skills/shared/execute/SKILL.md`](./skills/shared/execute/SKILL.md)

#### Scoring modes

**Binary (default):** `score_t = 1.0 if sample_rate ≥ pass_rate else 0.0`

**Partial credit** (`partial_credit: true`): `score_t = sample_rate`
Gives gradient signal for near-misses (e.g. 2/3 → 0.67 instead of 0.0).
Use for soft quality tests; keep binary for hard correctness requirements.

### `rubric.md` — thin, no test data

```markdown
---
agent: greeter
baseline_score: 1.00
epsilon: 0.05
version: 1
---

## Test weights
| t1 | 0.40 |
| t2 | 0.30 |
| t3 | 0.30 |

## Acceptance criterion
Accept iff:
  1. candidate_score ≥ baseline_score + epsilon
  2. zero regressions
  3. no blocking advisory critic raised

## Improvement policy
improvement_policy:
  trigger: production_count
  min_production_runs: 10
  backoff_multiplier: 2.0
  max_backoff_runs: 100
  max_iterations: 3
  saturated_iterations: 6
  saturation_threshold: 0.95

## Advisory critics (NOT scored)
- friendliness
- brevity
```

`baseline_score` is updated automatically on accept. `version` is incremented
by a human when rubric rules change — this triggers a mandatory rebaseline
before the next scoring run.

---

## Improvement policy

The `improvement_policy` section in `rubric.md` controls when and how often
improvement runs are triggered.

| Field | Description |
|---|---|
| `trigger` | `manual`, `production_count`\*, `score_drop`, or `new_tests` |
| `min_production_runs` | Minimum real invocations before the first improvement attempt |
| `backoff_multiplier` | Multiply wait after a no-improvement run (default 2.0) |
| `max_backoff_runs` | Cap on backoff wait (prevents infinite deferral) |
| `max_iterations` | Candidates per improvement run |
| `saturated_iterations` | Wider search used when `score ≥ saturation_threshold` |
| `saturation_threshold` | Score at which saturation mode kicks in (default 0.95) |

\* `production_count` requires an external signal that increments a counter on
each live invocation. This signal is outside the scope of the scaffold's MVP-0
pure-markdown runtime. Use `trigger: manual` unless you have plumbed that
signal. `greeter` ships with `trigger: manual` for this reason.

**Backoff** uses a sliding window of the last 15 runs (not consecutive failures)
to detect stall state — trajectories are non-monotonic in practice.

**Cost tracking**: each run records `cost_tokens_input`, `cost_tokens_output`,
`cost_time_seconds`, and `cost_estimate_usd`. Token split matters: Agent Party
observed a 65:1 input-to-output ratio.

Informed by Agent Party (162 experiments, 16% keep rate, $0.40–0.55/experiment)
and SICA's utility function (`0.5×score + 0.25×cost + 0.25×time`).

---

## Handling LLM variability in the target

Even though scoring is deterministic, the *target* is still an LLM-driven
agent — same input can produce different outputs. Three design elements handle
this:

1. **Multi-sample per test.** Every test runs `samples: N` times; passes iff
   `passed / samples ≥ pass_rate`. Default `samples: 3, pass_rate: 1.0`.
   Raise samples and lower pass_rate for flaky targets.
2. **Baseline is measured, not assumed.** Improver re-measures the baseline at
   the start of every run, so drift is visible before any candidate is
   considered.
3. **Acceptance requires delta AND no regressions.** A candidate can't win by
   being lucky on one sample — it must beat baseline AND not drop any
   previously-passing test.

---

## Evidence trail (memory layout)

```
memory/
  INDEX.md                                    ← repo-wide run log (one row per run)
  runs/<run-id>/
    objective.md                              ← what this run is trying to improve
    baseline.md                               ← per-test breakdown of the pre-run state
    candidates/
      001.diff.md                             ← proposed change + reasoning_chain
      001.run.md                              ← raw outputs (all samples) + cost fields
      001.scores.md                           ← deterministic scoring table
      001.verdict.md                          ← accept | reject + reason
      002.*                                   ← next candidate…
    lessons.md                                ← Reflexion-style verbal memory
    result.md                                 ← final numeric summary
    REPORT.md                                 ← user-friendly narrative (regeneratable)
agents/<target>/HISTORY.md                    ← per-target improvement trail
```

Run ID format: `<YYYY-MM-DD>-<target-name>-<slug>-<4-char-hex>`
Example: `2026-04-14-greeter-handle-empty-input-a3f2`

### Worked example on disk

A fully committed example run is on the branch:

- [`memory/runs/2026-04-14-greeter-empty-input/REPORT.md`](./memory/runs/2026-04-14-greeter-empty-input/REPORT.md)
  — the user-friendly report
- [`memory/runs/2026-04-14-greeter-empty-input/`](./memory/runs/2026-04-14-greeter-empty-input/)
  — full evidence trail (objective, baseline, 3 candidates, lessons, result)
- [`agents/greeter/HISTORY.md`](./agents/greeter/HISTORY.md) — first row appended
- [`memory/INDEX.md`](./memory/INDEX.md) — first row appended

Candidate 001 was accepted (+0.60), 002 rejected (regression on t1), 003
rejected (no delta). Read `REPORT.md` to see what a completed improver report
looks like.

### Do not hand-edit

These files are auto-generated by `improver/skills/report` and overwritten on
every run:

- `memory/runs/<id>/REPORT.md`
- `agents/<name>/HISTORY.md`
- `memory/INDEX.md`

The `baseline_score` frontmatter field in every `rubric.md` is also updated by
the loop on accept. Everything else in `rubric.md` (weights, critics, policy,
acceptance rule) is human-editable.

---

## Research roadmap

The scaffold is designed to host a growing family of self-improvement patterns.
Each drops into the existing `agents/` or `skills/` tree with no framework
changes.

| Pattern | Status | Drop-in location |
|---|---|---|
| **Karpathy AutoResearch** — edit → run → measure → keep/discard | ✅ live | `agents/improver` |
| **Reflexion** — verbal self-critique in episodic memory | ✅ live | `agents/improver/skills/reflect` |
| **Voyager skill library** — lifelong-learning agent with an ever-growing skill library | 🔲 planned | meta-agent appends dirs under `skills/` |
| **ADAS** — meta-agent programs new agents as code | 🔲 gated | flip `self_improvable: true`, write real improver tests |
| **AutoAgent** — zero-code framework with self-managing file system | 🔲 architectural fit | `agents/` + `skills/` + `memory/` IS that file system |
| **Reflection pattern** — generator + multi-critic | 🔲 partial | advisory critics in `rubric.md`; promote to blocking |
| **LATS** — MCTS over reason/act/plan | 🔲 future | branch `candidates/` into a tree |

---

## References

Full bibliography with implementation notes → [`RESEARCH.md`](./RESEARCH.md)

Quick list:

- Karpathy, A. — [`autoresearch`](https://github.com/karpathy/autoresearch)
- Shinn, N. et al. (2023) — [Reflexion](https://arxiv.org/abs/2303.11366)
- Wang, G. et al. (2023) — [Voyager](https://arxiv.org/abs/2305.16291)
- Hu, S. et al. (2024) — [ADAS](https://arxiv.org/abs/2408.08435)
- HKUDS (2025) — [AutoAgent](https://arxiv.org/abs/2502.05957)
- Anthropic — [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- EvoAgentX — [Awesome-Self-Evolving-Agents](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents)
