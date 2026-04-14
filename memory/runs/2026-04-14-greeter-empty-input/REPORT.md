# Improver Run Report — greeter

**Verdict: ACCEPT** · baseline 0.40 → **1.00** (+0.60) · 0 regressions · 4m 22s

## TL;DR

Greeter went from 0.40 to 1.00 by adding explicit handling for empty
and whitespace-padded inputs. Candidate 001 was accepted on iteration
1. Iterations 2 and 3 explored advisory-critic improvements but neither
produced a numeric delta, so the final state is candidate 001. The
rubric is now saturated — further improvement requires extending
`tests.md` with new dimensions.

## Snapshot

| field                | value                                                |
|----------------------|------------------------------------------------------|
| target               | `agents/greeter`                                     |
| objective            | handle empty input and trim whitespace               |
| started / ended      | 2026-04-14 14:03 → 14:07 UTC                         |
| duration             | 4m 22s                                               |
| iterations           | 3 (1 accepted, 2 rejected)                           |
| accepted candidate   | [`001`](candidates/001.diff.md)                      |
| samples per test     | 3                                                    |
| total invocations    | 27                                                   |
| tests.md             | [`agents/greeter/tests.md`](../../../agents/greeter/tests.md)   |
| rubric.md            | [`agents/greeter/rubric.md`](../../../agents/greeter/rubric.md) |

## Score progression

```
baseline   0.40  ████░░░░░░
cand 001   1.00  ██████████  ✓ accept    (+0.60)
cand 002   0.00  ░░░░░░░░░░  ✗ reject    (3 regressions; prefix change)
cand 003   1.00  ██████████  ✗ reject    (no delta; advisory-only win)
```

## Per-test results (final vs baseline)

| id  | name                | baseline | final | samples | status    |
|-----|---------------------|----------|-------|---------|-----------|
| t1  | basic name          | 1.00     | 1.00  | 3/3     | steady    |
| t2  | empty input         | 0.00     | 1.00  | 3/3     | **fixed** |
| t3  | whitespace trimming | 0.00     | 1.00  | 3/3     | **fixed** |

Zero regressions. Two of three tests flipped from fail to pass.

## What changed

Accepted diff: [`candidates/001.diff.md`](candidates/001.diff.md)

In one sentence: the Edge Cases section of
`agents/greeter/skills/format-greeting/SKILL.md` was extended to
explicitly document (a) empty-string handling and (b) whitespace
trimming. No behavior was removed; no frontmatter was touched.

## Before / after samples

| input          | before                            | after                     |
|----------------|-----------------------------------|---------------------------|
| `"Ada"`        | `Hello, Ada! Welcome.`            | `Hello, Ada! Welcome.`    |
| `""`           | `Hello, ! Welcome.`               | `Hello! Welcome.`         |
| `"  Grace  "`  | `Hello,   Grace  ! Welcome.`      | `Hello, Grace! Welcome.`  |

## Lessons learned

From [`lessons.md`](lessons.md):

- Empty-string handling was structurally absent; one guard clause plus
  a "trim first" rule was the cheap win. Small targeted edits to the
  Edge Cases section are the preferred shape of a candidate here.
- **Never change the greeting prefix** (`"Hello"`) without first
  extending `tests.md`. Every test asserts that literal substring, so
  prefix changes are guaranteed regressions. (Cost: one rejected
  candidate, iter 2.)
- **Rubric saturation is a real state.** Once baseline hits 1.00 on
  every test, numeric improvement is impossible until new dimensions
  are added to `tests.md`. Iteration 3 spent budget searching a space
  the rubric doesn't measure. (Cost: one rejected candidate, iter 3.)

## Next steps

- **Accept this run's state** — candidate 001 is live; no action
  required from the human.
- **Extend `tests.md`** if enthusiasm / friendliness / length shaping
  actually matters. The advisory critics (`friendliness`, `brevity`)
  in [`rubric.md`](../../../agents/greeter/rubric.md) gave positive
  signals during iter 3 that the numeric scorer could not act on.
  Promoting one of them into a real test (e.g. `length_between: 15-40`
  or `contains: "!"`) would unlock the next round of improvements.
- **Consider adding t4 for non-ASCII names** (e.g. `"Renée"`, `"李雷"`).
  No current test covers Unicode behavior, so the rubric is silent on
  regressions there.

## Evidence

- [`objective.md`](objective.md) · [`baseline.md`](baseline.md) ·
  [`lessons.md`](lessons.md) · [`result.md`](result.md)
- Candidate 001 (accepted):
  [diff](candidates/001.diff.md) ·
  [run](candidates/001.run.md) ·
  [scores](candidates/001.scores.md) ·
  [verdict](candidates/001.verdict.md)
- Candidate 002 (rejected, regression):
  [diff](candidates/002.diff.md) ·
  [run](candidates/002.run.md) ·
  [scores](candidates/002.scores.md) ·
  [verdict](candidates/002.verdict.md)
- Candidate 003 (rejected, no delta):
  [diff](candidates/003.diff.md) ·
  [run](candidates/003.run.md) ·
  [scores](candidates/003.scores.md) ·
  [verdict](candidates/003.verdict.md)

---
*Generated by [`agents/improver/skills/report`](../../../agents/improver/skills/report/SKILL.md).
This report is a pure function of the evidence files above and can be
regenerated at any time with `improver report memory/runs/<id>`.*
