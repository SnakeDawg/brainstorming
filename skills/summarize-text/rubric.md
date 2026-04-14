---
skill: summarize-text
version: 1
baseline_score: null
epsilon: 0.05
---

# Rubric for summarize-text

Standalone skill rubric. Test data lives in [`tests.md`](./tests.md).
This file defines only weights, acceptance, and advisory critics.

## Test weights

| test id | name                    | weight |
|---------|-------------------------|--------|
| t1      | short multi-point input | 0.30   |
| t2      | single-sentence output  | 0.30   |
| t3      | empty input passthrough | 0.20   |
| t4      | length bound            | 0.20   |

Sum = 1.00. Final score = Σ (weight × per-test result), range [0, 1].

## Acceptance criterion

A candidate is accepted iff **all** hold:

1. `candidate_score ≥ baseline_score + epsilon`
2. no test that passed at baseline now fails
3. no advisory critic marked `blocking: true` raises a flag

## Advisory critics (NOT scored)

- `faithfulness`: "Does the summary accurately reflect the input without
  inventing facts?"
- `coverage`: "Does the summary include the most important point from
  the input?"

Neither is `blocking`. Both are logged to
`memory/runs/<id>/lessons.md` for human review.

## Baseline

`baseline_score: null` because this skill has not yet been bootstrapped
against its tests. Run:

```
improver bootstrap skills/summarize-text
```

to populate the baseline from a first measurement pass. See
[`../../agents/improver/skills/bootstrap/SKILL.md`](../../agents/improver/skills/bootstrap/SKILL.md).
