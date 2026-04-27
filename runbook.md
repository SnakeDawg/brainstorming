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
acknowledges, and then runs all five rounds automatically. You read the full
transcript when it's done.

To **change the topic**, edit the `Topic:` line. To **change the teams**,
edit the `Teams:` line (any alias works: `Team A`, `commercial_strategy`,
or `Commercial Strategy Team`). To **change the scenario**, edit the
`Scenario:` line and add a new file under `prompts/scenarios/` if it
doesn't exist.

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

---

## Path A (recommended) — Claude Code in this repo

Claude Code has direct filesystem access; nothing to paste.

1. Open Claude Code in this repo (`cd` into the worktree, run `claude`).
2. Pick the model — default `claude-sonnet-4-6`, swap to `claude-opus-4-7` for
   stakeholder-grade runs.
3. Send the invocation message above. Claude reads all files itself and runs
   the full simulation — acknowledgment through round 5 synthesis — without
   further input from you.
4. Review the output. The acknowledgment block tells you the scenario, topic,
   teams, and voice samples. If something looks wrong there, the rest of the
   run reflects that error — re-invoke from a fresh chat rather than patching
   mid-run.
5. Each round is automatically saved to `.working/` as it completes — review
   them there. Copy the round 5 file to `outputs/` to make it permanent.
6. Score against `evaluation/rubric.md`.

## Path B — claude.ai with a Project

Same one-line invocation, but the files live in a Claude Project instead of a
local repo.

1. Create a Project on claude.ai.
2. Upload (or sync from GitHub) `prompts/`, `personas/`, and `teams/` into the
   Project's knowledge base. The model in the Project can now reference them
   by path.
3. Start a new chat in the Project.
4. Pick the model.
5. Send the invocation message. Claude runs all five rounds automatically.
   Note: `.working/` file writes only work in Path A (Claude Code). In a
   Project chat, Claude can't write to your local filesystem — copy each
   round's output manually from the chat window as needed.

When you edit any file in the repo, re-sync the Project so the chat sees the
new version.

## Path C (fallback) — plain claude.ai chat, no file access

Use this only if you can't use Path A or B. You'll paste the brief once, then
the round prompts in order.

1. Open a fresh chat. Pick the model.
2. **First message** — paste these files in this order, with the line
   `Below is your moderator brief, persona profiles, and team configuration.
   Read them, then wait for the scenario invocation.` at the top:
   - `prompts/system_prompt.md`
   - all five `personas/*.md` files
   - `teams/teams.yaml`
3. **Second message** — the invocation:
   ```
   Scenario: cross_functional_workshop
   Teams: Team A, Team B
   Topic: <your topic>

   Use the contents of prompts/scenarios/cross_functional_workshop.md as the
   scenario kickoff:

   <paste the contents of prompts/scenarios/cross_functional_workshop.md>
   ```
4. All five rounds run automatically, with each round saved to `.working/`.
   Score the same way as Path A.

This path is the most paste-heavy but works anywhere Claude does. If you find
yourself running it more than a couple of times, switch to Path A or B.

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

These files are gitignored by default — they're your working scratchpad.
Review any round before the run finishes (they're written incrementally),
or use them to compare runs side-by-side after the fact.

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
