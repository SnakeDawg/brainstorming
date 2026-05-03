---
agent: onboard
version: 1
baseline_score: 0.00
epsilon: 0.05
---

# Rubric for onboard

The scoring contract. Every `~~~test~~~` block below is an evaluation rule
that feeds a batch-mode spec to onboard and checks the generated output
contains the expected structural marker.

## Evaluation rules

~~~test
id: t1
name: agent — AGENT.md has correct name field
weight: 0.20
input: |
  mode: batch
  spec:
    kind: agent
    name: my-agent
    description: A test agent for verifying onboard output.
match: contains
expected: "name: my-agent"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: agent — AGENT.md has improvement_agent field
weight: 0.20
input: |
  mode: batch
  spec:
    kind: agent
    name: my-agent
    description: A test agent for verifying onboard output.
match: contains
expected: "improvement_agent:"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: standalone skill — SKILL.md has scope standalone
weight: 0.15
input: |
  mode: batch
  spec:
    kind: standalone-skill
    name: my-skill
    description: A test standalone skill.
match: contains
expected: "scope: standalone"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: shared skill — SKILL.md has scope shared, no rubric field
weight: 0.15
input: |
  mode: batch
  spec:
    kind: shared-skill
    name: my-util
    description: A test shared utility skill.
match: contains
expected: "scope: shared"
samples: 3
pass_rate: 1.0
not_contains: ["rubric: ./rubric.md"]
~~~

~~~test
id: t5
name: dedicated skill — SKILL.md has scope dedicated and owner field
weight: 0.15
input: |
  mode: batch
  spec:
    kind: dedicated-skill
    name: my-formatter
    description: A test dedicated skill.
    owner: my-agent
match: contains
expected: "owner: my-agent"
samples: 3
pass_rate: 1.0
exercises: [onboard]
~~~

~~~test
id: t6
name: agent — generated rubric.md contains an evaluation rule block
weight: 0.15
input: |
  mode: batch
  spec:
    kind: agent
    name: my-agent
    description: A test agent for verifying onboard output.
match: contains
expected: "~~~test"
samples: 3
pass_rate: 1.0
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

- output structure: each generated file is clearly delimited with `### <path>` header
- no overwriting: skill checks for existing files and aborts with a conflict list
