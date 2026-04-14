---
skill: summarize-text
version: 1
---

# Tests for summarize-text

User-authored ground truth for the standalone `summarize-text` skill.
Standalone skills must ship their own `tests.md` and `rubric.md` since
they have no owning agent to inherit from.

~~~test
id: t1
name: short multi-point input
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month. Action items were assigned to Maria and Jon."
match: contains
expected: "v2"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: single-sentence output
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month."
match: regex
expected: "^[^.!?]*[.!?]\\s*$"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: empty input passthrough
input: ""
match: exact
expected: ""
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: length bound
input: "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month. Action items were assigned to Maria and Jon."
match: length_between
min: 10
max: 300
samples: 3
pass_rate: 1.0
~~~
