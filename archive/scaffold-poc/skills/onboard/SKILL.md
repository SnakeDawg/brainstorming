---
name: onboard
description: Interactive wizard that scaffolds a new agent or skill with correct frontmatter, a rubric skeleton, and directory layout.
scope: standalone
improvement_agent: ../../agents/improver
rubric: ./rubric.md
---

# onboard

A standalone skill that scaffolds new agents and skills into the correct
directory structure with all required files. Consolidates conventions from
`README.md`, `SELF-IMPROVEMENT.md`, and `skills/README.md` into one place
so both humans and LLM assistants have a single authoritative source.

Outputs the generated file contents as a structured listing — one section
per file, suitable for the executor to write to disk.

**Relationship to bootstrap:** `onboard` generates the skeleton
(frontmatter + empty `~~~test~~~` rule stubs in `rubric.md`).
`improver bootstrap` runs next to validate the filled-in rules, measure
the first baseline, and write `baseline_score` back into `rubric.md`.
They are complementary, not alternatives.

## Two modes

### Interactive mode (default)

The skill asks a short series of questions, then generates files.
Invoke with no arguments or `mode: interactive`.

### Batch mode

Accept a `spec` block and generate everything in one pass. Invoke with
`mode: batch` and a `spec`. Ideal for LLM-assisted scaffolding.

## Input

### Interactive mode

```yaml
mode: interactive
```

### Batch mode

```yaml
mode: batch
spec:
  kind: agent | standalone-skill | shared-skill | dedicated-skill
  name: <kebab-case>
  description: <one sentence>
  # agent only:
  dedicated_skills: [<skill-name>, ...]   # skill names to scaffold alongside
  shared_skills: [<relative-path>, ...]   # paths to existing shared skills
  # dedicated-skill only:
  owner: <agent-name>
  # shared-skill only:
  consumers: any
```

## Interactive session flow

**Step 1 — What are you building?**
> "What are you building?  agent / standalone-skill / shared-skill / dedicated-skill"

**Step 2 — Name and description**
> "Name (kebab-case, e.g. `email-classifier`):"
> "One-sentence description:"

**Step 3 — Archetype-specific questions**

*If `agent`:*
> "Dedicated skill name (leave blank to skip):"
> "Existing shared skills to reference (comma-separated paths, or press Enter to skip):"

*If `dedicated-skill`:*
> "Owning agent name:"

*If `shared-skill`:*
> "Consumers (press Enter for `any`):"

**Step 4 — Preview and confirm**
Show a structured preview of all files to be written, then:
> "Write these files? (yes / no)"

## Output format

Each generated file is output as a fenced section:

```
### agents/<name>/AGENT.md

<file content>

### agents/<name>/rubric.md

<file content>
```

The executor writes each section's content to the indicated path.

## Files generated per kind

### `agent`

```
agents/<name>/
  AGENT.md          ← filled frontmatter + sections with TODO placeholders
  rubric.md         ← frontmatter + 3 empty ~~~test~~~ rule stubs with inline guidance
  skills/<dedicated>/
    SKILL.md        ← if dedicated_skills is non-empty
```

`baseline_score` in `rubric.md` is `null` at scaffold time — run
`improver bootstrap agents/<name>` after filling in the rules to measure
the first baseline.

### `standalone-skill`

```
skills/<name>/
  SKILL.md
  rubric.md          ← 3 empty rule stubs
```

### `shared-skill`

```
skills/shared/<name>/
  SKILL.md
  examples.md       ← 2 worked input/output placeholders
```

No `rubric.md` — shared skills are exercised via their callers' rubrics.

### `dedicated-skill`

```
agents/<owner>/skills/<name>/
  SKILL.md
```

## Templates

Raw templates with `{{ }}` placeholder syntax are in
[`templates/`](./templates/). Substitute placeholders before writing:

| Template | Used for |
|---|---|
| [`agent.md.tmpl`](./templates/agent.md.tmpl) | `AGENT.md` for a new agent |
| [`skill-dedicated.md.tmpl`](./templates/skill-dedicated.md.tmpl) | `SKILL.md` for a dedicated skill |
| [`skill-standalone.md.tmpl`](./templates/skill-standalone.md.tmpl) | `SKILL.md` for a standalone skill |
| [`skill-shared.md.tmpl`](./templates/skill-shared.md.tmpl) | `SKILL.md` for a shared skill |
| [`rubric.md.tmpl`](./templates/rubric.md.tmpl) | `rubric.md` for agents and standalone skills |
| [`examples.md.tmpl`](./templates/examples.md.tmpl) | `examples.md` for shared skills |

## Rules

1. **Never overwrite.** If any target file already exists, abort and list the
   conflicts. The user must resolve before re-running.
2. **Validate name.** `name` must be kebab-case (`[a-z][a-z0-9-]*`). Reject
   names containing uppercase or underscores.
3. **Validate description.** Must be a single sentence (no `.` except at end).
4. **Stub, don't fill.** Leave TODO placeholders for domain-specific content
   (behavior descriptions, rule inputs/outputs). The goal is correct structure,
   not complete content.
5. **Remind about next steps.** After writing files, print:
   - For agents/standalone skills: "Next: fill in `rubric.md` evaluation
     rules, then run `improver bootstrap <path>`"
   - For shared skills: "Next: fill in SKILL.md and examples.md"
   - For dedicated skills: "Next: fill in SKILL.md, then update the owning
     agent's `rubric.md` with rules that exercise this skill"
