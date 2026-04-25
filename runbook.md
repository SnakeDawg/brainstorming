# Hermes POC — Runbook

This is the operator script for running one full Hermes simulation. The POC is
prompts-only: there is no script to execute. You drive Claude turn by turn from
this runbook.

---

## Prerequisites

- Access to Claude (claude.ai, Claude Console, or Claude Code) with a fresh chat.
- This repo cloned locally so you can copy/paste from the files.
- ~30–60 minutes of focused time. The simulation is not background-able — each
  round depends on the previous output.

## Model selection

- **Default:** `claude-sonnet-4-6` — fast, strong persona fidelity, the right
  baseline for the POC.
- **Higher fidelity:** `claude-opus-4-7` — use when you want richer character
  dialogue, more nuanced concessions, and longer round 4/5 outputs. Slower and
  more expensive per turn. Recommend swapping to Opus for the runs you intend to
  show stakeholders.
- **Faster iteration:** `claude-haiku-4-5-20251001` — useful for sanity-checking
  prompt changes, not for the scoring run.

If you are using Claude Code or Claude Console, set the model at the top of the
chat. If you are using claude.ai, pick the model in the model selector before you
paste anything.

---

## Run procedure

### Step 0 — Open a fresh chat

Start a brand-new conversation. Persona drift is much worse if you reuse a chat
that already contains other context.

### Step 1 — Load the system prompt + personas

Paste the contents of these files, in this order, into your **first message**:

1. `prompts/system_prompt.md`
2. `personas/sales.md`
3. `personas/pdm.md`
4. `personas/marketing.md`
5. `personas/support.md`
6. `personas/services.md`
7. `teams/teams.yaml`

Add a one-line preface above them: `Below is your moderator brief, persona
profiles, and team configuration. Read them, do not respond yet — wait for the
scenario kickoff.`

Send. Claude will typically acknowledge briefly. That's fine.

### Step 2 — Kick off the scenario

Paste the contents of `prompts/simulation_prompt.md`. Send.

Expected response: the **acknowledgment** from the system prompt — scenario name,
team rosters, one-line voice samples per persona, then `--- ready for round 1 ---`.

**If the acknowledgment is missing or wrong:** stop. Something didn't load.
Re-paste the missing files and re-send the kickoff. Don't proceed to round 1
with broken state.

### Step 3 — Run rounds 1 through 5

For each round, paste the corresponding file from `prompts/rounds/` and wait for
Claude to finish (look for the `--- end of round N ---` marker).

| Round | File                                        |
|-------|---------------------------------------------|
| 1     | `prompts/rounds/round1_opening.md`          |
| 2     | `prompts/rounds/round2_cross_examination.md`|
| 3     | `prompts/rounds/round3_gap_surfacing.md`    |
| 4     | `prompts/rounds/round4_convergence.md`      |
| 5     | `prompts/rounds/round5_synthesis.md`        |

Do not paste round N+1 until round N has completed and you've read it.

### Step 4 — Save the synthesis

Copy the full round 5 output into a new file:
`outputs/<YYYY-MM-DD>-<short-tag>-run.md` (e.g. `outputs/2026-04-25-baseline-run.md`).

Create the `outputs/` directory if it doesn't exist. It is not under version
control by default — see the .gitignore.

### Step 5 — Score the run

Open `evaluation/rubric.md` and score the run. Capture the per-criterion score
and the evidence (a quote or section reference) inline next to your saved
synthesis.

Target: **≥14/18** for the POC to be considered "working" on this run.

### Step 6 — Iterate

Common knobs to turn between runs:

- **Sharpen a persona's profile** — if Sales sounded too reasonable, tighten the
  pain points and stock phrases in `personas/sales.md`.
- **Vary the scenario prompt** — change the platform topic or constrain the
  conversation (budget cut, deadline pressure, a specific named competitor).
- **Swap teams** — run `commercial_strategy` alone, or pull in the `feasibility`
  team once those personas are written.
- **Change models** — re-run the same prompts on Opus to see if the scoring
  delta justifies the cost.

Re-run from Step 0 in a **fresh chat** every time. Persona consistency is part of
the rubric — reusing chats hides drift.

---

## Adding a new persona

1. Create `personas/<key>.md` using the same template as the existing five.
2. Add the persona to the relevant team(s) in `teams/teams.yaml` with a `key` and
   `display_name`.
3. Update `prompts/simulation_prompt.md` if the new persona joins the primary
   scenario (add them to the "Teams in play" section and to the voice-sample
   step).
4. Run a baseline + new-persona run back to back to see what the addition
   changes.

## Adding a new scenario

1. Add an entry under `scenarios:` in `teams/teams.yaml`.
2. Create a new kickoff prompt (copy `prompts/simulation_prompt.md` as a
   starting point and edit the setting / task).
3. Decide whether the existing round prompts apply or whether you need
   scenario-specific round files.
4. Add scenario-specific evaluation criteria to `evaluation/rubric.md` if the
   default rubric doesn't cover what you want to learn.

---

## Common failure modes (and what to do)

- **Personas blur into each other.** Tighten stock phrases. Consider running on
  Opus.
- **Round 2 collapses into agreement.** The cross-examination prompt asks for
  6+ exchanges and explicit "tensions still on the table" — if Claude skipped
  it, re-prompt: "Round 2 is too agreeable — re-run with the structural
  conflicts surfaced explicitly."
- **Round 5 is generic.** Usually means rounds 1–3 were thin. Don't try to fix
  round 5; restart from round 1 with sharper persona profiles.
- **Claude breaks the fourth wall.** Re-prompt with: "Stay in character. Re-do
  the last turn as <persona>." If it happens repeatedly, the system prompt
  didn't load — go back to Step 1.
