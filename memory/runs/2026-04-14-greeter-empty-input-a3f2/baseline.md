---
run_id: 2026-04-14-greeter-empty-input-a3f2
target: agents/greeter
measured_at: 2026-04-14T14:03:12Z
baseline_score: 0.40
samples_per_test: 3
total_invocations: 9
rubric_version: 1
---

# Baseline for run 2026-04-14-greeter-empty-input-a3f2

Scored the **pre-fix** state of
`agents/greeter/skills/format-greeting/SKILL.md` against
[`tests.md`](../../../agents/greeter/tests.md). At this point the skill
had no explicit empty-string or whitespace handling.

## Per-test breakdown

| id | name                | match    | expected        | samples_passed | pass_rate | score | weighted |
|----|---------------------|----------|-----------------|----------------|-----------|-------|----------|
| t1 | basic name          | contains | "Hello, Ada"    | 3/3            | 1.00      | 1.00  | 0.40     |
| t2 | empty input         | contains | "Hello!"        | 0/3            | 0.00      | 0.00  | 0.00     |
| t3 | whitespace trimming | contains | "Hello, Grace"  | 0/3            | 0.00      | 0.00  | 0.00     |

**Total baseline score: 0.40**

## Per-test sample outputs (pre-fix)

- t1 input `"Ada"`: all 3 samples → `"Hello, Ada! Welcome."` ✓
- t2 input `""`: all 3 samples → `"Hello, ! Welcome."` ✗ (`"Hello!"` absent)
- t3 input `"  Grace  "`: all 3 samples → `"Hello,   Grace  ! Welcome."` ✗
  (contains `"Hello, Grace"` substring? no — there are two spaces
  between `Hello,` and `Grace`)

## Notes

Baseline is stored here rather than in `rubric.md` so the *per-run*
measurement is preserved even after `rubric.md`'s `baseline_score` is
updated on accept. This is the source-of-truth snapshot for this run.
