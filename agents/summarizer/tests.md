---
agent: summarizer
version: 1
---

# Tests for summarizer

User-authored ground truth. Every block is a deterministic test case.
See [`skills/shared/execute/SKILL.md`](../../skills/shared/execute/SKILL.md)
for the full match-type reference.

~~~test
id: t1
name: basic text — output is a bullet list
input: "The quarterly review covered three topics: revenue is up 12% YoY, the new product launch is delayed to Q3, and two engineering leads will be hired by end of month."
match: regex
expected: "^- .+"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: output length is within reasonable bounds
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
input: ""
match: exact
expected: ""
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: single sentence — output contains at least one bullet
input: "The project deadline has been moved to next Friday."
match: contains
expected: "- "
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t5
name: multi-line input — output does not repeat the raw input verbatim
input: "The team met on Monday. They discussed the roadmap, budget, and staffing. All three items were deferred to the next meeting pending executive review."
match: not_contains
expected: ["The team met on Monday. They discussed the roadmap, budget, and staffing. All three items were deferred"]
samples: 3
pass_rate: 1.0
partial_credit: true
~~~
