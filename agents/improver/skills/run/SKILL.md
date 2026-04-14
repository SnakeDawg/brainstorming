---
name: run
description: Apply a candidate diff to a scratch copy of the target, exercise the target with every test input from tests.md, and capture raw outputs across multiple samples. Handles LLM output variability via multi-sampling.
scope: dedicated
owner: improver
---

# run

Execute the target under the candidate's proposed change and record
everything the `score` skill will need to compute a verdict.

## Invocation

```
run --run <run-id> --candidate <NNN>
```

## Input

| Source | What it provides |
|---|---|
| `memory/runs/<run-id>/candidates/<NNN>.diff.md` | the candidate to apply |
| `<target>/tests.md` | the list of test cases and their sample counts |
| `<target>` files | the unmodified target source |

## Output

One file:

```
memory/runs/<run-id>/candidates/<NNN>.run.md
```

Schema:

```markdown
---
candidate_id: <NNN>
target: <path>
samples_per_test: <N>
total_invocations: <N × num_tests>
started: <iso8601>
ended: <iso8601>
---

# Run log for candidate <NNN>

## Applied diff

<path(s) modified in the scratch copy>

## Raw outputs

### t1 — <test name>
- input: <value>
- sample 1: <raw output>
- sample 2: <raw output>
- sample 3: <raw output>

### t2 — <test name>
...
```

## Rules

1. **Scratch-only.** The diff is applied to a copy, never to the live
   target. The loop writes to the live target only after `score` emits
   `verdict: accept`.
2. **Deterministic application.** The diff is applied by a plain patch
   operation, not by asking an LLM to "apply this change." This removes
   one LLM variability layer from the pipeline.
3. **Multi-sample.** Every test is invoked `samples` times (from
   `tests.md`, default 3). All outputs are captured — not just the
   first, not an average.
4. **Isolation.** Samples for different tests are captured in independent
   invocations so cross-test interference is impossible.
5. **Pass-through errors.** If the target errors on a sample, the error
   text is recorded verbatim as the output. `score` decides whether that
   counts as a failure.

## Why multi-sample

A target is itself LLM-driven, so the same input can produce different
outputs across runs. Multi-sampling turns this variability into
measurable data:

- `score` can compute a per-test `pass_rate` (e.g. 2/3 samples matched).
- A flaky test surfaces explicitly instead of randomly tipping the
  verdict.
- Baseline drift over time is detectable — see [`report`](../report/SKILL.md)
  for how `HISTORY.md` records it.

## Budget and timeouts

- Default samples per test: 3.
- Tests may override with `samples: N` in their `~~~test~~~` block.
- Hard limit: 50 invocations per candidate. Exceeding the limit writes a
  `verdict: reject (budget exceeded)` and halts the run.

## Failure modes

| Failure | Behavior |
|---|---|
| Diff does not apply cleanly | Write `verdict: reject (diff unappliable)`, emit empty run.md, continue loop |
| Target invocation crashes | Record error text as output; let `score` decide |
| Budget exceeded | Write `verdict: reject (budget)`, halt run |
