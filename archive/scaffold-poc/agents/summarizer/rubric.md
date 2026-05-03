---
agent: summarizer
version: 1
baseline_score: 0.00
epsilon: 0.05
---

# Rubric for summarizer

The scoring contract. Every `~~~test~~~` block below is an evaluation rule:
input, expected behavior, match type, and weight. See
[`../../skills/shared/execute/SKILL.md`](../../skills/shared/execute/SKILL.md)
for the full match-type reference.

## Evaluation rules

~~~test
id: t1
name: basic text — output is a bullet list
weight: 0.30
input: "The quarterly review covered three topics: revenue is up 12% YoY, the new product launch is delayed to Q3, and two engineering leads will be hired by end of month."
match: regex
expected: "^- .+"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: output length is within reasonable bounds
weight: 0.25
input: "The quarterly review covered three topics: revenue is up 12% YoY, the new product launch is delayed to Q3, and two engineering leads will be hired by end of month."
match: length_between
expected:
  min: 30
  max: 600
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: empty input returns empty string
weight: 0.20
input: ""
match: exact
expected: ""
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: single sentence — output contains at least one bullet
weight: 0.15
input: "The project deadline has been moved to next Friday."
match: contains
expected: "- "
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t5
name: multi-line input — output does not repeat the raw input verbatim
weight: 0.10
input: "The team met on Monday. They discussed the roadmap, budget, and staffing. All three items were deferred to the next meeting pending executive review."
match: not_contains
expected: ["The team met on Monday. They discussed the roadmap, budget, and staffing. All three items were deferred"]
samples: 3
pass_rate: 1.0
partial_credit: true
~~~

Sum of weights = 1.00.

## Acceptance criterion

Accept iff:
  1. candidate_score ≥ baseline_score + epsilon
  2. zero regressions
  3. no blocking advisory critic raised

## Improvement policy

```yaml
improvement_policy:
  trigger: manual
  max_iterations: 3
  saturated_iterations: 6
  saturation_threshold: 0.95
```

## Advisory critics (NOT scored)

- conciseness: each bullet should be ≤ 15 words
- no duplication: bullets should not repeat the same idea in different wording
