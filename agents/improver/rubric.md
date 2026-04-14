---
agent: improver
version: 1
baseline_score: null
epsilon: 0.05
mode: deferred
---

# Rubric for improver

> **Status: deferred.** See [`tests.md`](./tests.md) — improver's scoring
> contract is not yet defined because `self_improvable: false` in MVP-0.
> This file exists to satisfy the universal rule that every agent ships
> `rubric.md`.

When self-improvement is enabled:

- `baseline_score` will be populated by bootstrap.
- Test weights will be filled in below.
- Acceptance criterion will match the scaffold default: `candidate_score
  ≥ baseline_score + epsilon` AND zero regressions.

## Test weights

*(none — pending deferred tests)*

## Acceptance criterion

Default — see [the scaffold README](../../README.md) for details.

## Advisory critics

*(none)*
