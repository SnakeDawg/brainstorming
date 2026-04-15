---
name: bootstrap
description: Gate a new target into the improvement loop by waiting for user-authored tests.md and generating a starter rubric.md. Never invents test cases from an LLM.
scope: dedicated
owner: improver
---

# bootstrap

**The gate.** No target enters the improvement loop without passing
through bootstrap first. Bootstrap's job is to ensure a target has a
valid user-authored `tests.md` and a matching `rubric.md` before any
`propose`/`run`/`score` activity is allowed.

## Invocation

```
improver bootstrap <target-path>
improver bootstrap --rebaseline <target-path>
```

`<target-path>` points at an agent directory (`agents/<name>/`) or a
standalone skill directory (`skills/<name>/`).

**`--rebaseline`**: Re-measures baseline against existing `tests.md` +
`rubric.md` without touching test content. Triggered manually or
automatically when `rubric.md` `version` field changes or test IDs change.
On rebaseline, writes a marker annotation in `HISTORY.md`:
`[rebaseline vN → vM]`.

## Input

| Source | What it provides |
|---|---|
| `<target>/AGENT.md` or `<target>/SKILL.md` | target metadata (name, description) |
| `<target>/tests.md` | (optional, checked) user-authored test cases |

## Output

| File | Written when |
|---|---|
| `<target>/tests.md` | only if missing — an **empty template**, not a draft |
| `<target>/rubric.md` | only after `tests.md` parses cleanly |
| updated `baseline_score` in `<target>/rubric.md` frontmatter | after first baseline measurement |

## Flow

```
  1. Read <target>/AGENT.md (or SKILL.md for a standalone skill).
     If missing → error, exit.

  2. Check for <target>/tests.md.
       exists?      → step 4
       missing?     → step 3

  3. GATE — do not draft tests with an LLM.
     Write a TEMPLATE tests.md containing:
       - frontmatter stub (agent, version)
       - the full list of supported match types (from score/SKILL.md)
       - three empty ~~~test~~~ fenced blocks with every field commented
       - a worked example in a markdown comment block
     Print:
       "tests.md template created at <path>.
        Please fill in 3+ test cases and re-run `improver bootstrap`."
     EXIT. Do nothing else.

  4. Parse tests.md. Validate every ~~~test~~~ block against the schema
     defined in score/SKILL.md (see also
     [execute spec](../../../skills/shared/execute/SKILL.md)).
     Any parse error → print a diff-style error pointing at the bad
     block and exit.

  4.5 VALIDATE tests ↔ rubric (if rubric.md already exists):
      - Extract test IDs from tests.md.
      - Extract weight IDs from rubric.md.
      - If sets differ: print a diff showing added/removed IDs and exit.
      - Verify weights sum to 1.0 (within tolerance 0.01). Warn if not.
      This prevents silent breakage when tests.md and rubric.md diverge.

  5. Generate <target>/rubric.md with:
       - agent: <target-name>
       - version: 1
       - baseline_score: null           (populated in step 6)
       - epsilon: 0.05
       - test weights: equal across all test ids
       - acceptance criterion: the scaffold default
       - advisory critics: none
     If rubric.md already exists, leave it alone and print a notice.

  6. Invoke the target with each rubric input (samples = value from
     tests.md, default 3). Route through the `score` skill to compute
     the first baseline as a pure function of outputs + tests.md.

  7. Write baseline_score into <target>/rubric.md frontmatter.

  8. Print a summary:
       "bootstrap complete.
        target:         <target>
        tests:          <N>
        baseline_score: <X>
        ready:          improver run <target> --objective <...>"
```

## The empty template written in step 3

The `tests.md` template is intentionally non-suggestive. Every field is
present but blank, so the human has to write the ground truth themselves.
The template also links back to this SKILL.md and to
[`score/SKILL.md`](../score/SKILL.md) for the match-type reference.

## What bootstrap NEVER does

- Never calls an LLM to generate test inputs or expected outputs.
- Never modifies `tests.md` after it is first written (the human owns it).
- Never runs the improvement loop — that's `propose`/`run`/`score`.
- Never runs against a target whose `AGENT.md` is missing the required
  `improvement_agent`, `tests`, or `rubric` frontmatter fields.

## Opt-in draft mode (future, not MVP-0)

A future `--draft` flag may let improver *propose* a `tests.md` for the
human to edit and confirm. Even then, the human must accept every block
before it is written. Disabled in MVP-0 to keep the ground-truth
provenance clean.
