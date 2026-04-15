---
agent: onboard
baseline_score: 0.00
epsilon: 0.05
version: 1
---

## Test weights

| t1 | 0.20 |
| t2 | 0.20 |
| t3 | 0.15 |
| t4 | 0.15 |
| t5 | 0.15 |
| t6 | 0.15 |

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

- output structure: each generated file is clearly delimited with `### <path>` header
- no overwriting: skill checks for existing files and aborts with a conflict list
