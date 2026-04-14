---
run_id: 2026-04-14-greeter-empty-input
target: agents/greeter
---

# Reflexion lessons — 2026-04-14-greeter-empty-input

Append-only. Every iteration adds one bullet after `score` writes its
verdict. Advisory critic output is interleaved with the `[advisory]`
tag and does not influence any verdict.

- **iter 1 (cand 001, accept):** Empty-string handling was structurally
  absent; a single guard clause plus an explicit "trim first" rule was
  sufficient to fix t2 and t3 without touching t1. Small, targeted
  edits to the Edge Cases section are the cheap win.
  Evidence: [scores](candidates/001.scores.md), [diff](candidates/001.diff.md)

- **iter 2 (cand 002, reject):** Changing the greeting prefix from
  `"Hello"` to `"Hi"` regressed all three tests because every rubric
  test asserts the literal `"Hello, "` substring. Rule learned:
  **never modify the greeting prefix without first updating tests.md**.
  The tests are the contract, not the current string.
  Evidence: [scores](candidates/002.scores.md), [diff](candidates/002.diff.md)

- **[advisory] friendliness (iter 2):** Advisory critic flagged `"Hi,
  Ada!"` as warmer than `"Hello, Ada!"`. Signal logged but **did not
  affect** the reject verdict; acceptance is numeric.

- **iter 3 (cand 003, reject):** Adding a second exclamation mark
  preserved all tests (no regressions) but produced no score delta, so
  acceptance failed on the `≥ baseline + epsilon` rule. Rule learned:
  **with a saturated rubric (1.00 baseline), no further improvement is
  possible until `tests.md` is extended with a new dimension**.
  Evidence: [scores](candidates/003.scores.md), [diff](candidates/003.diff.md)

- **[advisory] friendliness (iter 3):** Double exclamation scored
  higher on enthusiasm. Advisory only.
- **[advisory] brevity (iter 3):** Output 22 chars, under the 120 char
  advisory cap. No flag.

## Terminal observation

The rubric saturated at iteration 1. Iterations 2–3 were spent
searching a design space the rubric does not measure. Next run should
either (a) accept 001 and stop, or (b) extend `tests.md` with new
dimensions before running more iterations.
