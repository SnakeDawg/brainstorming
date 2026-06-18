# Hermes POC — Evaluation Rubric

Score one full simulation run against this rubric. Each criterion scores **0, 1,
or 2**. Maximum total: **18**. Target for "POC works": **≥ 14 / 18**.

For every criterion, capture the **evidence** — a quote from the transcript or a
section reference in the saved synthesis — alongside the score. Scores without
evidence don't count.

---

## Scoring scale

- **0 — Missing.** The simulation didn't produce this at all, or what it
  produced was wrong.
- **1 — Partial.** Present but thin, generic, or only one persona contributed
  meaningfully.
- **2 — Strong.** Specific, multi-persona, evidence-grounded, surfaced something
  a real meeting would have produced.

---

## Criteria (mapped to REQUIREMENTS.md §6)

### C1 — Realistic personas
**What to check:** Each of the 5 personas has a distinct voice, uses their stock
phrases, and stays in character across all 5 rounds.
- 0: Personas are interchangeable, or one or more drops character.
- 1: Personas are distinguishable but voices blur in later rounds.
- 2: Each persona is recognizable from any single quote, all the way through
  round 4.
- **Evidence:** quote 2–3 lines per persona that prove the voice.

### C2 — Multi-persona discussion (not a monologue)
**What to check:** Round 2 contains real back-and-forth; rounds 1 and 4 give
roughly proportional airtime per persona.
- 0: One persona dominates; others get token lines.
- 1: All 5 speak but some are clearly thinner.
- 2: All 5 speak substantively in rounds 1, 2, and 4 with comparable depth.
- **Evidence:** rough line counts per persona in round 2.

### C3 — Role consistency across rounds
**What to check:** A persona's positions in round 4 are traceable to their
positions in round 1. They evolve via concession, not via amnesia.
- 0: Personas contradict their round 1 positions without explaining why.
- 1: Mostly consistent; one or two unexplained shifts.
- 2: Every shift is a visible concession ("I'll trade X for Y").
- **Evidence:** trace 2 personas across rounds 1 → 4.

### C4 — Cross-functional friction surfaced
**What to check:** Round 2 produces concrete, structurally-grounded conflicts
(Sales vs PDM on scope, Support vs Marketing on launch, Services vs PDM on
deployability, etc.).
- 0: Round 2 is collegial agreement.
- 1: Some friction but generic ("we have different priorities").
- 2: ≥4 concrete conflicts, each tied to a specific round 1 requirement.
- **Evidence:** the "tensions still on the table" list from round 2.

### C5 — Missing inputs identified
**What to check:** Round 3 §1 (Missing inputs table) is populated with ≥8 rows,
covering all 5 personas, with realistic owners.
- 0: Fewer than 4 rows, or missing personas.
- 1: 4–7 rows, or owners are vague.
- 2: ≥8 rows, all personas represented, owners named concretely.
- **Evidence:** the table itself.

### C6 — Convergence on requirements
**What to check:** Round 4 produces a top-5 list (or top-N with explicit
contested slots), with rationale, dependencies, and risks per item.
- 0: No clean list, or list lacks rationale/dependencies/risks.
- 1: List exists but some items are missing required fields.
- 2: All 5 slots populated (or honestly contested) with all required fields.
- **Evidence:** the round 4 final list.

### C7 — Structured output (synthesis artifact)
**What to check:** Round 5 produces all 9 sections from the synthesis template,
none skipped, none renamed.
- 0: Multiple sections missing or merged.
- 1: One section missing or one section is empty without "None surfaced".
- 2: All 9 sections present, each with content or explicit "None surfaced".
- **Evidence:** structural diff against `prompts/rounds/round5_synthesis.md`.

### C8 — Configurable team / scenario
**What to check:** A second run, swapping one persona out (or running with only
the Commercial Strategy Team), produces a recognizably different conversation
without breaking the structure.
- 0: Swap broke the run, or output is identical.
- 1: Output is different but structurally degraded.
- 2: Output is different and structurally intact.
- **Evidence:** brief diff notes between the two runs.
- **NOTE:** This criterion requires a second run. Score it 0 (with a note) if
  you only did the baseline run; do not skip it.

### C9 — Repeatability
**What to check:** A second run of the **identical** baseline scenario in a
fresh chat produces a similar pattern (same conflict shapes, same persona
voices, comparable top-5).
- 0: Second run feels like a different exercise.
- 1: Voices and conflicts mostly hold; output structure varies meaningfully.
- 2: Same shape, same dominant tensions, comparable artifact.
- **Evidence:** brief diff notes between the two runs.
- **NOTE:** Same as C8 — requires a second run.

---

## Realism smell test (qualitative, not scored)

After scoring, answer in 1–2 sentences each:

- **Did this feel like a real meeting?** What specifically made it feel real or
  fake?
- **Was there a moment that surprised you?** A persona objection or a tradeoff
  that you wouldn't have predicted from the profiles alone?
- **What would a real Sales / PDM / Marketing / Support / Services person say
  about their counterpart in this transcript?** Would they recognize the role?

If all three answers are mediocre, the score is probably overstating the run.

---

## Score sheet (copy this into your saved synthesis)

```
| Criterion | Score (0/1/2) | Evidence |
|-----------|---------------|----------|
| C1 Realistic personas              |  | |
| C2 Multi-persona discussion        |  | |
| C3 Role consistency                |  | |
| C4 Cross-functional friction       |  | |
| C5 Missing inputs                  |  | |
| C6 Convergence                     |  | |
| C7 Structured output               |  | |
| C8 Configurable team / scenario    |  | |
| C9 Repeatability                   |  | |
| **Total**                          |  / 18 | |
```

Realism smell test:
- Felt like a real meeting? <answer>
- Surprising moment? <answer>
- Would the real role recognize themselves? <answer>
