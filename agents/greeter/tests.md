---
agent: greeter
version: 1
---

# Tests for greeter

User-authored ground truth. Every block below is a deterministic test
case. Scoring does not involve any LLM judgment — see
[`agents/improver/skills/score/SKILL.md`](../improver/skills/score/SKILL.md)
for the supported match types.

~~~test
id: t1
name: basic name
input: "Ada"
match: contains
expected: "Hello, Ada"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: empty input
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
input: "  Grace  "
match: contains
expected: "Hello, Grace"
not_contains: ["Hello,  ", "  Grace"]
samples: 3
pass_rate: 1.0
~~~
