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

## Pre-flight validation

Before scoring, `score` runs these checks. Any failure halts with a
diagnostic error:

1. **tests ↔ rubric ID match** (Issue 4): Extract test IDs from
   `tests.md` and weight IDs from `rubric.md`. If the sets differ,
   print a diff of added/removed IDs and halt.
2. **Weight sum** (Issue 4): Verify `Σ weight_t = 1.0` (tolerance
   0.01). Warn if outside tolerance; error if sum is 0.
3. **Rubric version** (Issue 7): Read `version` from `rubric.md`
   frontmatter and compare to the rubric version recorded in the
   most recent run in `HISTORY.md`. If `rubric.md` version > last
   run's version, require a rebaseline (`improver bootstrap
   --rebaseline <target>`) before scoring. Error if stale.
   When reading `HISTORY.md` for trend analysis, only consider runs
   from the SAME rubric version.

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

See [`skills/shared/execute/SKILL.md`](../../../skills/shared/execute/SKILL.md)
for the canonical spec with pseudocode, edge-case tables, and
normalization rules.

### `exercises` field (informational)

Tests MAY include `exercises: [shared-skill-name]` to tag which shared
skills they exercise. This field is **not scored** — it exists for
coverage tracking so humans can verify shared skills are tested through
at least one calling agent. `score` ignores it during evaluation.

## Per-test scoring

For each test `t` with `samples: S` and `pass_rate: P`:

```
passed     = count of samples where (match rule evaluates true)
sample_rate = passed / S
```

### Binary mode (default)

```
score_t = 1.0 if sample_rate ≥ P else 0.0
```

### Partial credit mode

If the test declares `partial_credit: true` in its `~~~test~~~` block:

```
score_t = sample_rate
```

This gives gradient signal for near-misses (e.g. 2/3 samples pass → 0.67
instead of 0.0). Trade-off: partial credit loosens the pass/fail contract —
a target may be accepted with tests that never fully pass. Use binary mode
for hard correctness requirements and partial credit for soft quality tests.

See the [execute spec](../../../skills/shared/execute/SKILL.md) for the
complete `partial_credit` field definition.

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

## Scorer self-test (Issue 9)

The scorer is the oracle. If it has bugs, the whole optimization loop
flies blind (Agent Party: `time_efficiency` returned zero for 20
experiments before the bug was caught).

Before the first real scoring run against a target, `score` MUST process
these canonical self-test cases and verify exact match. If any fail,
halt with an error.

### Self-test fixture

**Input `tests.md`:**

```
~~~test
id: st1
name: self-test contains
input: "world"
match: contains
expected: "hello world"
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st2
name: self-test exact
input: "42"
match: exact
expected: "42"
samples: 2
pass_rate: 0.5
~~~
```

**Input `rubric.md` weights:**

| st1 | 0.60 |
| st2 | 0.40 |

**Input `run.md` (raw outputs):**

```
### st1 — self-test contains
- input: "world"
- sample 1: "hello world, welcome"

### st2 — self-test exact
- input: "42"
- sample 1: "42"
- sample 2: "43"
```

**Expected `scores.md`:**

| id  | samples_passed | pass_rate | score | weighted |
|-----|----------------|-----------|-------|----------|
| st1 | 1/1            | 1.00      | 1.00  | 0.60     |
| st2 | 1/2            | 0.50      | 1.00  | 0.40     |

total: 1.00

**Expected `verdict.md`:**

```
verdict: accept (if baseline_score ≤ 0.95 and epsilon = 0.05)
regressions: 0
```

### Rationale

- `st1`: "hello world, welcome" contains "hello world" → pass.
- `st2`: sample 1 exact-matches "42" (pass), sample 2 is "43" (fail).
  pass_rate = 0.50 ≥ 0.50 → score_t = 1.0 (binary mode).
- candidate_score = 0.60×1.0 + 0.40×1.0 = 1.00.
