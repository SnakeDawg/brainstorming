---
skill: summarize-text
version: 1
baseline_score: null
epsilon: 0.05
---

# Rubric for summarize-text

The scoring contract. Every `~~~test~~~` block below is an evaluation rule.
See [`../shared/execute/SKILL.md`](../shared/execute/SKILL.md) for the
full match-type reference.

## Evaluation rules

~~~test
id: t1
name: short multi-point input
weight: 0.30
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month. Action items were assigned to Maria and Jon."
match: contains
expected: "v2"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: single-sentence output
weight: 0.30
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month."
match: regex
expected: "^[^.!?]*[.!?]\\s*$"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: empty input passthrough
weight: 0.20
input: ""
match: exact
expected: ""
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: length bound
weight: 0.20
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month. Action items were assigned to Maria and Jon."
match: length_between
min: 10
max: 300
samples: 3
pass_rate: 1.0
~~~

Sum of weights = 1.00.

## Acceptance criterion

A candidate is accepted iff **all** hold:

1. `candidate_score ≥ baseline_score + epsilon`
2. no rule that passed at baseline now fails
3. no advisory critic marked `blocking: true` raises a flag

## Advisory critics (NOT scored)

- `faithfulness`: "Does the summary accurately reflect the input without
  inventing facts?"
- `coverage`: "Does the summary include the most important point from
  the input?"

Neither is `blocking`. Both are logged to
`memory/runs/<id>/lessons.md` for human review.

## Baseline

`baseline_score: null` because this skill has not yet been bootstrapped.
Run:

```
improver bootstrap skills/summarize-text
```

to populate the baseline from a first measurement pass.
