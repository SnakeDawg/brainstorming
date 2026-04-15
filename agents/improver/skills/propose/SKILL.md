---
name: propose
description: Draft a candidate diff against the target, informed by the target's tests.md, its current rubric, and the Reflexion lessons from prior iterations.
scope: dedicated
owner: improver
---

# propose

Generate one candidate change to the target. This is the **creative** step
of the loop — the only place where LLM judgment is expected to produce
novelty. Output is still a plain markdown file a human can read.

## Invocation

Called by the improvement loop once per iteration:

```
propose --run <run-id> --target <path> --objective <text> --iteration <N>
```

## Input

| Source | What it provides |
|---|---|
| `<target>/AGENT.md` or `SKILL.md` | current behavior under test |
| `<target>/tests.md` | ground-truth test cases |
| `<target>/rubric.md` | weights, acceptance criterion, current baseline |
| `memory/runs/<run-id>/objective.md` | what this run is trying to improve |
| `memory/runs/<run-id>/baseline.md` | per-test score breakdown of the current state |
| `memory/runs/<run-id>/lessons.md` | Reflexion memory from earlier iterations |
| `memory/runs/<run-id>/candidates/*/verdict.md` | reasons prior candidates were rejected |
| `<target>/HISTORY.md` | last 15 runs for stall detection (sliding window) |

## Output

One file:

```
memory/runs/<run-id>/candidates/<NNN>.diff.md
```

Schema:

```markdown
---
candidate_id: <NNN>
target: <relative path to the file(s) the diff modifies>
proposed_by: improver/skills/propose
iteration: <N>
rationale_summary: <one sentence>
reasoning_chain:
  targeted_tests: [<test IDs this diff targets>]
  incorporated_lessons: [<lessons from prior iterations>]
  rejected_approaches:
    - approach: <what was considered>
      reason: <why rejected>
  confidence: low | medium | high
---

# Candidate <NNN> — <short title>

## Rationale

<1–3 paragraphs explaining what the diff changes and why it should
improve the failing tests without regressing the passing ones.>

## Diff

~~~diff
--- a/<path>
+++ b/<path>
@@ ... @@
<unified diff lines>
~~~
```

The `reasoning_chain` frontmatter captures the proposer's decision
process for post-hoc analysis — which failing tests it targeted, which
lessons it incorporated, which approaches it rejected, and its
confidence level. This addresses Agent Party's gap where proposal
outputs only contained `description` + `changes` with no reasoning
trace (Tyler Cox: "instrument the proposer").

## Rules

1. **Minimal.** Each candidate touches the smallest number of lines that
   could plausibly improve the score. Large refactors are discouraged
   because they make regression attribution harder.
2. **Target-scoped.** A candidate diff may only modify files under the
   target path. Modifications to `agents/improver/**` or to
   `skills/shared/**` are forbidden unless the target itself *is* that
   path.
3. **Reflexion-aware.** Every line of `lessons.md` is read before
   proposing. The rationale must explain how the new candidate differs
   from rejected ones.
4. **No scoring.** Propose does not predict the score. It writes the
   diff; `run` and `score` decide the verdict.
5. **One candidate per call.** The loop decides whether to call propose
   again.
6. **Consider ≥ 2 approaches.** Before writing the diff, the proposer
   MUST generate at least two candidate approaches and record what was
   rejected and why in `reasoning_chain.rejected_approaches`. An empty
   list is not acceptable — it signals the proposer stopped at the first
   idea, which is the most common cause of repeated no-improvement runs.

## Failure modes and how they are handled

| Failure | Behavior |
|---|---|
| Could not read target | Return error; loop halts |
| `tests.md` missing | Return error; loop halts (bootstrap should have caught this) |
| LLM produced a non-parseable diff | Retry once with an explicit format reminder; if still bad, write a verdict "reject (unparseable)" and skip to next iteration |
| LLM proposed an identical diff to a prior candidate | Skip; count as no-op; loop continues |
