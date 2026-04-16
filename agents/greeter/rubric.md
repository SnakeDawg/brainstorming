---
agent: greeter
version: 1
baseline_score: 1.00
epsilon: 0.05
---

# Rubric for greeter

The scoring contract. Every `~~~test~~~` block below is an evaluation rule:
input, expected behavior, match type, and weight. The scorer reads this
file as the sole source of truth for accept/reject decisions. See
[`../../skills/shared/execute/SKILL.md`](../../skills/shared/execute/SKILL.md)
for the full match-type reference.

<!-- Scoring mode: all rules below use binary scoring (default).
     To enable gradient signal for near-misses, add `partial_credit: true`
     to a ~~~test~~~ block. This makes score_t = sample_rate instead of
     binary 0/1. -->

## Evaluation rules

~~~test
id: t1
name: basic name
weight: 0.40
input: "Ada"
match: contains
expected: "Hello, Ada"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: empty input
weight: 0.30
input: ""
match: contains
expected: "Hello!"
not_contains: ["Hello,"]
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: whitespace trimming
weight: 0.30
input: "  Grace  "
match: contains
expected: "Hello, Grace"
not_contains: ["Hello,  ", "  Grace"]
samples: 3
pass_rate: 1.0
~~~

Sum of weights = 1.00. Final score = Σ (weight × per-rule result), range [0, 1].

## Acceptance criterion

A candidate is accepted iff **all** hold:

1. `candidate_score ≥ baseline_score + epsilon`
2. no rule that passed at baseline now fails (zero regressions)
3. no advisory critic marked `blocking: true` raises a flag

## Advisory critics (NOT scored)

Logged to `memory/runs/<id>/lessons.md` for human review. These never
affect the numeric score or the accept/reject verdict.

- `friendliness`: "Does the greeting feel warm and welcoming?"
- `brevity`: "Is the output under 120 characters?"

Neither is `blocking`.

## Improvement policy

```yaml
improvement_policy:
  trigger: manual       # run manually; production_count requires external signal (see SELF-IMPROVEMENT.md)
  min_production_runs: 10
  backoff_multiplier: 2.0
  max_backoff_runs: 100
  max_iterations: 3
  saturated_iterations: 6
  saturation_threshold: 0.95
```

## Baseline history

`baseline_score` above is the score of the current live target
(`agents/greeter/skills/format-greeting/SKILL.md`) against the rules in
this file. It is updated automatically by `improver` whenever a candidate
is accepted. See [`HISTORY.md`](./HISTORY.md) for the full progression.

The `version` field in frontmatter is incremented when rubric rules
change (weights, acceptance criterion, rule additions). Incrementing
it triggers a mandatory rebaseline before the next scoring run.
