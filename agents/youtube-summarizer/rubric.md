---
agent: youtube-summarizer
version: 1
baseline_score: 0.00
epsilon: 0.05
---

# Rubric for youtube-summarizer

The scoring contract. Every `~~~test~~~` block below is an evaluation rule:
input, expected behavior, match type, and weight. See
[`../../skills/shared/execute/SKILL.md`](../../skills/shared/execute/SKILL.md)
for the full match-type reference.

All inputs below use the **manual-paste path** (a transcript is supplied
directly), so the rules are deterministic and require no network or caption
fetch. The shared sample transcript is:

> `[0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once.`

## Evaluation rules

~~~test
id: t1
name: output embeds a Mermaid topic mindmap
weight: 0.25
input: "Summarize this transcript: [0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once."
match: regex
expected: "```mermaid[\\s\\S]*mindmap"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t2
name: output embeds a Mermaid pie chart of topic time-share
weight: 0.20
input: "Summarize this transcript: [0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once."
match: regex
expected: "```mermaid[\\s\\S]*\\bpie\\b"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t3
name: output has a TL;DR section
weight: 0.20
input: "Summarize this transcript: [0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once."
match: contains
expected: "## TL;DR"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t4
name: output has a section-by-section table with the required columns
weight: 0.20
input: "Summarize this transcript: [0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once."
match: contains
expected: "| Time | Topic | Summary |"
samples: 3
pass_rate: 1.0
~~~

~~~test
id: t5
name: output length is within reasonable bounds (not empty, not a wall of text)
weight: 0.15
input: "Summarize this transcript: [0:00] Today I want to show you the one keyboard shortcut that saves me an hour a week. [0:08] It's multi-cursor select — hold cmd and click to place a cursor anywhere. [0:20] Here's the part nobody mentions: you can also do it with find-and-select, which drops a cursor on every match at once."
match: length_between
expected:
  min: 200
  max: 8000
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

- faithfulness: every claim in the brief must be traceable to the transcript;
  nothing inferred from title/URL alone (the cardinal sin for this agent).
- consistency: mindmap top-level topics and pie slices name the same set.
- conciseness: TL;DR ≤ 3 sentences; topic labels ≤ 4 words.
- no-fabrication-on-failure: when no transcript is available, the output is an
  error + paste instructions, never an invented summary.
