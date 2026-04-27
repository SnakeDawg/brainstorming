# Hermes POC — Runbook

How to run one Hermes simulation. Pick the path that matches where you're
running Claude. The recommended paths give Claude file access so you don't
paste the prompts at all — the operator's job is one line: name the scenario,
the teams, and the topic.

---

## TL;DR — the invocation

Your first message to Claude is:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

That's it. Claude resolves teams, loads the personas, loads the scenario,
acknowledges, and runs all five rounds automatically. You read the full
transcript when it's done.

**To join as a participant**, add a `Human:` line:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
Human: <your name and role> — <one sentence on your perspective>
```

Hermes pauses at your turn in each round (1–4), prompts you for your
input, incorporates your response, and continues. Round 5 (synthesis) runs
without a human turn.

> **Optional:** an extra `Project: <path>` line wires Hermes to an external
> research project so personas argue from cited evidence. Off by default;
> see "Optional: project integration" at the bottom of this runbook.

---

## Worked example — start to finish

A complete run, no abstractions. The operator wants to know what should be
in the top 5 requirements for a self-serve onboarding feature.

### 1. Invocation

In Claude Code (run `claude` from the repo root), the operator sends:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: adding self-serve onboarding for new customers
```

### 2. What Hermes does — without further input

Hermes reads `prompts/system_prompt.md`, then:

1. Reads `teams/teams.yaml` and resolves `Team A` → `commercial_strategy`
   (Sales, PDM, Marketing) and `Team B` → `customer_reality` (Support,
   Services).
2. Reads each persona file: `personas/sales.md`, `personas/pdm.md`, etc.
3. Reads `prompts/scenarios/cross_functional_workshop.md` and substitutes
   `{{topic}}` with `adding self-serve onboarding for new customers`.
4. Outputs the acknowledgment block — scenario name, topic, the full
   roster, a one-line in-character voice sample for each persona, and
   the round preview. Ends with `--- ready for round 1 ---`.
5. Immediately reads `prompts/rounds/round1_opening.md` and runs round 1.
   Each persona names their top 3 requirements with rationale and one
   missing input. Closes with `--- end of round 1 ---`.
6. Writes the round 1 output to
   `.working/2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round1.md`.
7. Repeats for rounds 2 → 5. Each round is written to a sibling file with
   the same date/time/slug prefix.
8. After round 5, confirms the five file paths it wrote.

The operator does nothing during steps 2–8. Total: one message in, one
long transcript + five files out.

### 3. What appears on disk

```
.working/
├── 2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round1.md
├── 2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round2.md
├── 2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round3.md
├── 2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round4.md
└── 2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round5.md
```

`round5.md` is the structured synthesis — the artifact that gets handed to
leadership. Rounds 1–4 are the supporting transcript so you can audit how
the synthesis was reached (what got conceded, who pushed back on what).

### 4. Promote the synthesis

If this run is worth keeping, copy round 5 into `outputs/` and tag it:

```
cp .working/2026-04-27-1430-adding-self-serve-onboarding-for-new-c-round5.md \
   outputs/2026-04-27-self-serve-onboarding.md
```

`outputs/` is gitignored too. To commit a specific run for the team:

```
git add -f outputs/2026-04-27-self-serve-onboarding.md
git commit -m "Hermes run: self-serve onboarding requirements"
```

### 5. Score it

Open `evaluation/rubric.md`, walk the 9 criteria against the synthesis +
the round 1–4 transcripts, and append the per-criterion score with evidence
to the bottom of the saved synthesis file. Target: **≥ 14 / 18**. Below
that, the run isn't trustworthy as a stakeholder artifact — sharpen
personas or the scenario file and re-run from a fresh chat.

### 6. Re-run with a different topic

Same message, just edit the `Topic:` line:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: replacing the legacy on-prem deployment path with managed SaaS
```

Each run gets its own `.working/<date>-<HHMM>-<slug>-roundN.md` set —
runs of the same topic on the same day don't collide because the HHMM
prefix is captured at the start of each run.

### 7. Variant — join as a participant

Add a `Human:` line and Hermes pauses at your turn in each of rounds 1–4:

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: adding self-serve onboarding for new customers
Human: Jeff (CEO) — focused on revenue impact and enterprise readiness
```

After the five AI personas give their opening in round 1, Hermes outputs:

```
--- your turn: Jeff (CEO) ---
You've heard the team's opening positions. Give your top 3 requirements
for this topic, from your seat. Be specific — dollar figures, named
concerns, hard constraints. One paragraph per requirement.
```

You type your response. Hermes tags it as `**Jeff (CEO):**`, carries it
into the rest of the discussion, and includes your positions in the round 5
synthesis alongside the AI personas. Same `.working/` files, same scoring.

---

## How to run — Claude Code

Claude Code has direct filesystem access, so nothing to paste beyond the
invocation.

1. Open Claude Code in this repo (`cd` into the worktree, run `claude`).
2. Pick the model (see **Model selection** below).
3. Send the invocation. Claude reads all files itself and runs the full
   simulation — acknowledgment through round 5 synthesis — without further
   input from you.
4. Each round is saved to `.working/` as it completes. Copy the round 5
   file to `outputs/` when you want to keep the run permanently.
5. Score against `evaluation/rubric.md`.

---

## Model selection

- **`claude-sonnet-4-6`** — default, fast, strong persona fidelity. The right
  baseline.
- **`claude-opus-4-7`** — higher fidelity, richer concessions in round 4,
  longer round 5 synthesis. Slower and more expensive per turn. Use for
  stakeholder-grade runs.
- **`claude-haiku-4-5-20251001`** — useful for sanity-checking prompt edits.
  Not for scoring runs.

---

## Saving and scoring

During the run, Hermes writes each round's output to `.working/` as it
completes:

```
.working/<YYYY-MM-DD>-<HHMM>-<topic-slug>-round1.md
.working/<YYYY-MM-DD>-<HHMM>-<topic-slug>-round2.md
...
.working/<YYYY-MM-DD>-<HHMM>-<topic-slug>-round5.md
```

These files are gitignored by default — your working scratchpad. Review
any round while the run is still going (they're written incrementally),
or compare two runs side-by-side after the fact.

To promote the synthesis to a permanent record:
```
cp .working/<date>-<slug>-round5.md outputs/<date>-<tag>-run.md
```

Score the saved synthesis against `evaluation/rubric.md`. Capture per-criterion
score + evidence inline at the bottom of the file. Target: **≥ 14 / 18**.

To share or commit a specific round: `git add -f .working/<file>`.

---

## Iterating

- **Sharpen a persona** — tighten the pain points / stock phrases in
  `personas/<key>.md`. Re-run.
- **Vary the topic** — change the `Topic:` line in the invocation. No file
  edits needed.
- **Vary the teams** — change the `Teams:` line. Any alias works. Try one
  team alone, or swap in `feasibility` once those personas are written.
- **Compare models** — same invocation on Sonnet vs. Opus. Score both. The
  delta tells you whether Opus pays for itself.
- **Always re-run from a fresh chat.** Persona consistency is part of the
  rubric, and reused chats hide drift.

---

## Adding a new scenario

1. Create `prompts/scenarios/<scenario_id>.md`. Copy
   `cross_functional_workshop.md` as a starting point. Keep the
   acknowledgment block and the `{{topic}}` placeholder. Edit the setting and
   expected dynamics for the new scenario.
2. (Optional) Add an entry under `scenarios:` in `teams/teams.yaml` if you
   want a default team list and round count for the new scenario.
3. Decide whether the existing round prompts apply. If they don't, add
   scenario-specific rounds under `prompts/rounds/<scenario_id>/` and
   reference them from the new scenario file.
4. Add scenario-specific rubric criteria to `evaluation/rubric.md` if the
   default 9 don't cover what you want to learn.
5. Invoke with `Scenario: <scenario_id>`.

## Adding a new persona

1. Create `personas/<key>.md` from the same template as the existing five.
2. Add the persona to the relevant team(s) in `teams/teams.yaml` (`key` and
   `display_name`).
3. Run a baseline + new-persona run back to back to see what the addition
   changes.

---

## Common failure modes

- **Acknowledgment is wrong or missing.** Claude didn't actually read the
  files. On Path A, re-invoke and explicitly say "read the files first." On
  Path C, the brief paste was incomplete — re-paste.
- **Personas blur together by round 3.** Tighten stock phrases / pain points.
  Try Opus.
- **Round 2 collapses into agreement.** Re-prompt: "Round 2 is too agreeable
  — re-run with the structural conflicts surfaced explicitly."
- **Round 5 is generic.** Usually rounds 1–3 were thin. Restart from a fresh
  chat with sharper persona profiles, not a patch on the synthesis.
- **Claude breaks character.** Re-prompt: "Stay in character. Re-do the last
  turn as `<persona>`." If it keeps happening, the system prompt didn't load —
  start over.

---

## Optional: project integration

The invocation accepts an extra line — `Project: <path>` — that points
Hermes at an external project root containing background research. When
supplied, Hermes reads any research index files at the root, pulls the
relevant documents into context, and personas may cite them inline.

This is **off by default** and not used by the baseline POC. Documented
here so it doesn't get re-invented later. Don't reach for it until the
core simulation pattern is validated.
