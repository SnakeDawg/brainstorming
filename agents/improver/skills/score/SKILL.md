---
name: score
description: Deterministically evaluate a candidate's raw outputs against the target's tests.md and emit a numeric score plus an accept/reject verdict. The only place in the loop where acceptance is decided — and it contains no LLM judgment.
scope: dedicated
owner: improver
---

# score

The deterministic heart of the loop. `score` is a pure function from
`tests.md` + `rubric.md` + raw outputs to a numeric score and a verdict.
**No LLM is involved in scoring or in the accept/reject decision.**

## Invocation

```
score --run <run-id> --candidate <NNN>
```

Also called by `bootstrap` in step 6 to compute the initial baseline.

## Input

| Source | What it provides |
|---|---|
| `memory/runs/<run-id>/candidates/<NNN>.run.md` | raw outputs, one per sample per test |
| `<target>/tests.md` | test cases with match rules |
| `<target>/rubric.md` | weights, epsilon, baseline_score, acceptance criterion |
| `memory/runs/<run-id>/baseline.md` | per-test baseline breakdown for regression detection |

## Output

Two files per candidate:

```
memory/runs/<run-id>/candidates/<NNN>.scores.md
memory/runs/<run-id>/candidates/<NNN>.verdict.md
```

## `scores.md` schema

```markdown
---
run_id: <id>
candidate: <NNN>
target: <path>
baseline_score: <float>
candidate_score: <float>
delta: <+/-float>
regressions: <int>
samples_per_test: <N>
---

| id | input | match | expected | samples_passed | pass_rate | score | weighted | baseline |
|---|---|---|---|---|---|---|---|---|
| t1 | ... | contains | "Hello, Ada" | 3/3 | 1.00 | 1.00 | 0.40 | 1.00 |
| t2 | ... | exact    | "Hello! …"   | 3/3 | 1.00 | 1.00 | 0.30 | 0.00 |
| t3 | ... | contains | "Hello, Grace" | 3/3 | 1.00 | 1.00 | 0.30 | 0.00 |

total: 1.00
```

## `verdict.md` schema

```markdown
---
candidate: <NNN>
verdict: accept | reject
reason: <machine-readable tag>
---

# Verdict for candidate <NNN>: <ACCEPT|REJECT>

<one-sentence explanation referencing the score delta and regression count>
```

## Match types (all deterministic)

| Match type | Rule |
|---|---|
| `exact` | `output == expected` (optional `normalize: whitespace`) |
| `contains` | `expected` is a substring of `output` |
| `not_contains` | none of the listed strings appear in `output` |
| `regex` | regex pattern matches `output` |
| `json_path` | parse `output` as JSON; JSONPath expression equals `expected` |
| `length_between` | `len(output)` ∈ `[min, max]` |
| `equals_number` | parse output as number; `|output − expected| ≤ tolerance` |
| `shell` | run a shell command on output; exit 0 = pass |

No other match types exist. If a behavior cannot be expressed in these,
it stays in the `advisory critics` section of `rubric.md` and is logged
by `reflect` — it does not influence the score.

## Per-test scoring

For each test `t` with `samples: S` and `pass_rate: P`:

```
passed     = count of samples where (match rule evaluates true)
sample_rate = passed / S
score_t    = 1.0 if sample_rate ≥ P else 0.0
```

Then:

```
candidate_score = Σ (weight_t × score_t)
```

`candidate_score ∈ [0, 1]`.

## Regression detection

A regression is a test `t` where:

```
baseline.score_t == 1.0  AND  candidate.score_t < 1.0
```

`regressions` in the frontmatter is the count of such tests.

## Acceptance rule

From `rubric.md`:

```
accept iff
  candidate_score ≥ baseline_score + epsilon   AND
  regressions == 0                             AND
  every advisory-critic "blocking" flag is absent
```

(Advisory critics are blocking only if explicitly marked so in
`rubric.md`; none are blocking by default.)

## Side effects on accept

When `verdict: accept` is emitted, the loop applies the diff to the
**live** target and updates `baseline_score` in `<target>/rubric.md`
frontmatter. This is the only mutation `score` is responsible for
triggering.

## Determinism guarantees

- Given the same inputs, `score` always produces the same `scores.md`
  and `verdict.md`. A score can be recomputed from evidence files at
  any time without rerunning the target.
- No clock, randomness, or LLM call participates in the scoring pipeline.
- If you change the match rules in `tests.md`, re-running `score` on
  historical runs produces updated numbers without re-invoking any LLM.
