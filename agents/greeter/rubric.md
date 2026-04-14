---
agent: greeter
version: 1
baseline_score: 1.00
epsilon: 0.05
---

# Rubric for greeter

Thin scoring contract. This file contains **no test data** — all tests
live in [`tests.md`](./tests.md). This file only defines weights,
acceptance, and any advisory critics.

## Test weights

| test id | name                | weight |
|---------|---------------------|--------|
| t1      | basic name          | 0.40   |
| t2      | empty input         | 0.30   |
| t3      | whitespace trimming | 0.30   |

Sum = 1.00. Final score = Σ (weight × per-test result), range [0, 1].

## Acceptance criterion

A candidate is accepted iff **all** hold:

1. `candidate_score ≥ baseline_score + epsilon`
2. no test that passed at baseline now fails (zero regressions)
3. no advisory critic marked `blocking: true` raises a flag

## Advisory critics (NOT scored)

Logged to `memory/runs/<id>/lessons.md` for human review. These never
affect the numeric score or the accept/reject verdict.

- `friendliness`: "Does the greeting feel warm and welcoming?"
- `brevity`: "Is the output under 120 characters?"

Neither is `blocking`.

## Baseline history

`baseline_score` above is the score of the current live target
(`agents/greeter/skills/format-greeting/SKILL.md`) against `tests.md`.
It is updated automatically by `improver` whenever a candidate is
accepted. See [`HISTORY.md`](./HISTORY.md) for the full progression.
