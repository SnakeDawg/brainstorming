# Hermes POC — Runbook

How to run one Hermes simulation. Pick the path that matches where you're
running Claude. The recommended paths give Claude file access so you don't
paste the prompts at all — the operator's job is one line: name the scenario,
the teams, and the topic.

---

## TL;DR — the invocation

Your first message to Claude is one of two shapes — pick based on whether
you have an operation-ghostwriter project with research already done.

**Unrooted (instinct-only):**

```
Read prompts/system_prompt.md and follow it.

Scenario: cross_functional_workshop
Teams: Team A, Team B
Topic: <your topic in one sentence>
```

**Research-grounded (recommended for portfolio / strategic scenarios):**

```
Read prompts/system_prompt.md and follow it.

Scenario: commercial_portfolio_roadmap
Teams: Team A, Team B
Topic: 2026 commercial portfolio roadmap
Project: /path/to/projects/2026-portfolio/
```

When `Project:` is supplied, Hermes reads the project's
`market-intelligence/research-index.md` and
`competitive-analysis/research-index.md`, loads the relevant `{topic-slug}.md`
documents, and personas cite `[mi-N]` / `[ca-N]` references throughout. The
final synthesis lands at `<project>/hermes/<scenario_id>--<topic-slug>.md`
to sit alongside the other Ghostwriter outputs. Run unrooted only when you
*want* an instinct-only simulation — the round 5 artifact will carry an
explicit "research-unrooted" banner so consumers know.

To **change the topic**, edit the `Topic:` line. To **change the teams**,
edit the `Teams:` line (any alias works: `Team A`, `commercial_strategy`,
or `Commercial Strategy Team`). To **change the scenario**, edit the
`Scenario:` line and add a new file under `prompts/scenarios/` if it
doesn't exist. To **swap projects**, change the `Project:` line — same
scenario, different research basis.

---

## Path A (recommended) — Claude Code in this repo

Claude Code has direct filesystem access; nothing to paste.

1. Open Claude Code in this repo (`cd` into the worktree, run `claude`).
2. Pick the model — default `claude-sonnet-4-6`, swap to `claude-opus-4-7` for
   stakeholder-grade runs.
3. Send the invocation message above. Claude reads the files itself.
4. Read the acknowledgment. Confirm the scenario, topic, teams, and voice
   samples look right. If anything is wrong, fix it and re-invoke — don't
   proceed with broken state.
5. Send each round prompt in turn. The simplest way is to tell Claude:
   > Run round 1 from `prompts/rounds/round1_opening.md`.

   …and so on for rounds 2–5. Wait for `--- end of round N ---` between
   rounds.
6. Save the round 5 synthesis to `outputs/<YYYY-MM-DD>-<tag>-run.md`. Ask
   Claude to write it for you.
7. Score against `evaluation/rubric.md`.

## Path B — claude.ai with a Project

Same one-line invocation, but the files live in a Claude Project instead of a
local repo.

1. Create a Project on claude.ai.
2. Upload (or sync from GitHub) `prompts/`, `personas/`, and `teams/` into the
   Project's knowledge base. The model in the Project can now reference them
   by path.
3. Start a new chat in the Project.
4. Pick the model.
5. Send the invocation message. The flow from here is identical to Path A.

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
4. **Round prompts** — paste each `prompts/rounds/roundN_*.md` in turn,
   waiting for `--- end of round N ---` between them.
5. Save and score the same way as Path A.

This path is the most paste-heavy but works anywhere Claude does. If you find
yourself running it more than a couple of times, switch to Path A or B.

---

## Research-grounded runs (with `Project:`)

When you point Hermes at an operation-ghostwriter project, the simulation
reads real research instead of running on persona instinct. This is the
recommended path for portfolio, strategy, and roadmap scenarios.

**Prerequisites:**

1. The project exists at `projects/<name>/` and follows the
   operation-ghostwriter convention.
2. At least one of the following indexes is present:
   - `<project>/market-intelligence/research-index.md`
   - `<project>/competitive-analysis/research-index.md`
3. The `{topic-slug}.md` documents listed in those indexes exist on disk.

**Operator workflow:**

1. In your operation-ghostwriter setup, run `market-intelligence` and
   `competitive-analysis` on the topic. Let them complete normally —
   citations, sources, indexes, all of it.
2. From the brainstorming repo (or wherever Claude can read the project
   files), invoke Hermes with the `Project:` line pointing at the project
   root. Same scenario / teams / topic syntax as the unrooted form.
3. Read the acknowledgment carefully. Hermes lists which research
   documents it loaded and which key questions it'll lean on. **If the
   research load looks wrong**, stop and re-invoke with a sharper topic
   string — the synthesis is only as good as the research grounding.
4. Run rounds 1–5 normally. Personas should cite `[mi-N]` and `[ca-N]`
   throughout — if they aren't, Hermes is leaking back to instinct mode;
   re-prompt with "you have research loaded, rounds 1–4 must cite it."
5. Round 5 lands at `<project>/hermes/<scenario_id>--<topic-slug>.md`
   automatically. The synthesis preserves citations and ends with a
   bibliography mapping each `[mi-N]` / `[ca-N]` back to its source.
6. Score with `evaluation/rubric.md` as usual. The rubric works for both
   rooted and unrooted runs.

**Updating research between Hermes runs:** if you re-run
`market-intelligence` or `competitive-analysis` and the document slugs
change, re-invoke Hermes — it'll load the updated docs because it reads
the indexes fresh each time.

**Mixing rooted and unrooted runs:** fine. Run unrooted first to surface
where the team's instincts are, run rooted second on the same topic to
see where the research disagrees. The two synthesis artifacts side-by-side
are often more useful than either alone.

---

## Hermes vs. boardroom (when to use which)

Both Hermes and the `boardroom` skill in operation-ghostwriter are
research-grounded multi-persona pressure-test simulations. They overlap
in shape but serve different points in the workflow:

| Dimension | Hermes | boardroom |
|---|---|---|
| **When in the workflow** | Before there's a direction (PRD / strategy) — surfacing inputs to it | After there's a direction — pressure-testing the decision |
| **Cast** | Functional roles: Sales, PDM, Marketing, Support, Services | Leadership archetypes: President, CFO, CTO, etc. |
| **Output** | Surfaced requirements, conflicts, open questions, gaps | Go / no-go judgment, identified blind spots, sharpened angles |
| **Feeds into** | `prd-definition`, `strategy-analyst` | Final go/no-go decision |

A typical full sequence: market-intelligence + competitive-analysis →
**Hermes** → prd-definition → **boardroom** → execution. Hermes' synthesis
can be input to either prd-definition (most common) or directly to
boardroom (as background context for the exec review).

If you find yourself reaching for "boardroom" when what you actually need
is mid-level cross-functional alignment on what to build, that's Hermes.
If you're reaching for "Hermes" but your input is already a finalized
PRD, that's boardroom.

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

- **Project-grounded runs** save the synthesis to
  `<project>/hermes/<scenario_id>--<topic-slug>.md` automatically (the
  scenario instructs Hermes to do this). It sits next to
  `market-intelligence/` and `competitive-analysis/` in the project tree.
- **Unrooted runs** should be saved manually to
  `outputs/<YYYY-MM-DD>-<tag>-run.md` in this repo. The `outputs/` dir is
  gitignored by default — `git add -f` if you want a specific run committed.
- Score every run against `evaluation/rubric.md`. Capture per-criterion
  score + evidence inline at the bottom of the saved synthesis. Target:
  **≥ 14 / 18**.

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
