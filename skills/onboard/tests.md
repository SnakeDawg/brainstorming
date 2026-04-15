---
agent: onboard
version: 1
---

# Tests for onboard

User-authored ground truth for the `onboard` skill. All tests use batch mode
for deterministic input. Each test feeds a spec and checks that the generated
output contains the expected structural markers.

~~~test
id: t1
name: agent — AGENT.md has correct name field
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
name: shared skill — SKILL.md has scope shared, no tests field
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
not_contains: ["tests: ./tests.md"]
~~~

~~~test
id: t5
name: dedicated skill — SKILL.md has scope dedicated and owner field
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
name: agent — generated tests.md contains a test block
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
