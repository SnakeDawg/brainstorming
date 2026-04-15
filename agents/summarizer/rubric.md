---
agent: summarizer
baseline_score: 0.00
epsilon: 0.05
version: 1
---

## Test weights

| t1 | 0.30 |
| t2 | 0.25 |
| t3 | 0.20 |
| t4 | 0.15 |
| t5 | 0.10 |

## Acceptance criterion

Accept iff:
  1. candidate_score ≥ baseline_score + epsilon
  2. zero regressions
  3. no blocking advisory critic raised

## Improvement policy

improvement_policy:
  trigger: manual
  max_iterations: 3
  saturated_iterations: 6
  saturation_threshold: 0.95

## Advisory critics (NOT scored)

- conciseness: each bullet should be ≤ 15 words
- no duplication: bullets should not repeat the same idea in different wording
