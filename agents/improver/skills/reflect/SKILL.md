---
name: reflect
description: Append Reflexion-style verbal lessons after each iteration and run any advisory critics defined in the target's rubric. Advisory critics are logged only and cannot flip a verdict.
scope: dedicated
owner: improver
---

# reflect

The memory layer of the loop. `reflect` is where verbal knowledge
accumulates so future iterations of `propose` can avoid repeating
mistakes, and where any advisory (non-scoring) quality checks are run.

Reflexion (Shinn et al., 2023) is the reference: verbal self-critique
stored in episodic memory, cheap to retrofit, no weight updates.

## Invocation

Called once per iteration, **after** `score` has written the verdict:

```
reflect --run <run-id> --candidate <NNN>
```

## Input

| Source | What it provides |
|---|---|
| `memory/runs/<run-id>/candidates/<NNN>.diff.md` | what was tried |
| `memory/runs/<run-id>/candidates/<NNN>.run.md` | what the target produced |
| `memory/runs/<run-id>/candidates/<NNN>.scores.md` | per-test outcome |
| `memory/runs/<run-id>/candidates/<NNN>.verdict.md` | accept/reject + reason |
| `<target>/rubric.md` | any `advisory critics` prompts defined there |

## Output

Append-only, two destinations:

### 1. `memory/runs/<run-id>/lessons.md`

Each iteration appends one bullet. Format:

```markdown
- **iter <N> (cand <NNN>, <verdict>):** <one-sentence lesson>
  Evidence: [scores](candidates/<NNN>.scores.md), [diff](candidates/<NNN>.diff.md)
```

Lessons should be:
- Actionable ("when the target handles X, also handle Y")
- Grounded in the verdict tag ("rejected for regression on t1 — avoid
  changes to the greeting prefix")
- Single-sentence

### 2. Advisory critic output (optional)

If `rubric.md` defines advisory critics (e.g. "friendliness",
"brevity"), each one is run as an LLM prompt against the candidate's
outputs. Results are appended to `lessons.md` as separate bullets
marked `[advisory]`:

```markdown
- **[advisory] friendliness (iter <N>):** <critic response summary>
```

**Advisory critics NEVER flip a verdict.** They exist to surface
qualitative signal for humans reading the report, not to automate
judgment.

## Hard rules

1. `reflect` is read-only with respect to scoring. It cannot write to
   `scores.md`, `verdict.md`, or `baseline.md`.
2. `reflect` never modifies the live target.
3. `reflect` runs *after* the verdict is already recorded.
4. Every LLM call made by `reflect` is tagged `[advisory]` in its
   output so humans can tell signal apart from decisions.

## Relation to `propose`

`propose` reads `lessons.md` at the start of every iteration. This is
the Reflexion loop: verbal critique in → better next proposal out. Zero
weight updates.
