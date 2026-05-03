---
name: bootstrap
description: Gate a new target into the improvement loop by waiting for a user-authored rubric.md and measuring its first baseline. Never invents evaluation rules from an LLM.
scope: dedicated
owner: improver
---

# bootstrap

**The gate.** No target enters the improvement loop without passing
through bootstrap first. Bootstrap's job is to ensure a target has a
valid user-authored `rubric.md` with evaluation rules before any
`propose`/`run`/`score` activity is allowed.

## Invocation

```
improver bootstrap <target-path>
improver bootstrap --rebaseline <target-path>
```

`<target-path>` points at an agent directory (`agents/<name>/`) or a
standalone skill directory (`skills/<name>/`).

**`--rebaseline`**: Re-measures baseline against the existing
`rubric.md` without touching its rule content. Triggered manually or
automatically when `rubric.md` `version` field changes or rule IDs
change. On rebaseline, writes a marker annotation in `HISTORY.md`:
`[rebaseline vN → vM]`.

## Input

| Source | What it provides |
|---|---|
| `<target>/AGENT.md` or `<target>/SKILL.md` | target metadata (name, description) |
| `<target>/rubric.md` | (optional, checked) user-authored evaluation rules |

## Output

| File | Written when |
|---|---|
| `<target>/rubric.md` | only if missing — an **empty template**, not a draft |
| updated `baseline_score` in `<target>/rubric.md` frontmatter | after first baseline measurement |

## Flow

```
  1. Read <target>/AGENT.md (or SKILL.md for a standalone skill).
     If missing → error, exit.

  2. Check for <target>/rubric.md.
       exists?      → step 4
       missing?     → step 3

  3. GATE — do not draft rules with an LLM.
     Write a TEMPLATE rubric.md containing:
       - frontmatter stub (name, version, baseline_score: null, epsilon: 0.05)
       - three empty ~~~test~~~ fenced blocks with every field commented
         (id, name, weight, input, match, expected, samples, pass_rate)
       - an acceptance-criterion section (scaffold default)
       - an improvement-policy block (scaffold defaults)
       - a link to the full match-type reference in execute/SKILL.md
       - a worked example in a markdown comment block
     Print:
       "rubric.md template created at <path>.
        Please fill in 3+ evaluation rules and re-run `improver bootstrap`."
     EXIT. Do nothing else.

  4. Parse rubric.md. Validate every ~~~test~~~ block against the
     schema defined in score/SKILL.md (see also
     [execute spec](../../../skills/shared/execute/SKILL.md)).
     Any parse error → print a diff-style error pointing at the bad
     block and exit.
     After parsing, WARN (non-fatal) for each `contains` rule where
     `expected` is an empty string "". Empty expected vacuously passes
     and is almost always an author mistake.

  4.5 VALIDATE weight sum:
      - Sum the `weight` field across every ~~~test~~~ block.
      - If |sum − 1.0| > 0.01: ERROR — print the actual sum and exit.
        (Matches score pre-flight rule so problems are caught before
        any run, not during.)

  5. Invoke the target with each rule's input (samples = value from
     the rule, default 3). Route through the `score` skill to compute
     the first baseline as a pure function of outputs + rubric.md.

  6. Write baseline_score into <target>/rubric.md frontmatter.

  7. Print a summary:
       "bootstrap complete.
        target:         <target>
        rules:          <N>
        baseline_score: <X>
        ready:          improver run <target> --objective <...>"
```

## The empty template written in step 3

The `rubric.md` template is intentionally non-suggestive. Every field is
present but blank, so the human has to write the evaluation rules
themselves. The template links to the
[execute spec](../../../skills/shared/execute/SKILL.md) for the match-type
reference.

## What bootstrap NEVER does

- Never calls an LLM to generate rule inputs or expected outputs.
- Never modifies `rubric.md` rule content after it is first written
  (the human owns it). `baseline_score` is the only frontmatter field
  bootstrap writes back.
- Never runs the improvement loop — that's `propose`/`run`/`score`.
- Never runs against a target whose `AGENT.md` is missing the required
  `improvement_agent` or `rubric` frontmatter fields.

## Opt-in draft mode (future, not MVP-0)

A future `--draft` flag may let improver *propose* rubric rules for
the human to edit and confirm. Even then, the human must accept every
block before it is written. Disabled in MVP-0 to keep the
ground-truth provenance clean.
