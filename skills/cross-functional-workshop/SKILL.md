---
name: cross-functional-workshop
description: "Cross-functional team simulation: 5-round workshop that surfaces requirements, exposes misalignment, and produces a structured artifact. Voices Sales / PDM / Marketing / Support / Services as distinct personas in a single agent loop."
version: 0.1.0
metadata:
  hermes:
    tags: [simulation, requirements, multi-persona, workshop, planning]
    related_skills: [hermes-report]
---

# Cross-Functional Workshop

Run a controlled simulation of a cross-functional team negotiating the top
requirements for a topic. Five personas — **Sales, PDM, Marketing, Support,
Services** — take five rounds (opening → cross-examination → gap surfacing →
convergence → synthesis) and produce a structured markdown artifact plus a
deterministic score against `evaluation/rubric.md`.

This is a single Hermes agent that role-plays all rostered personas in
sequence within each turn. Personas are not subagents; they are distinct
voices held in one session.

## Inputs

The user provides (or invokes the skill with):

1. **Scenario** — `cross_functional_workshop` (default) or
   `commercial_portfolio_roadmap`. Files live under
   `${HERMES_SKILL_DIR}/scenarios/`.
2. **Teams** — comma-separated team aliases from
   `${HERMES_SKILL_DIR}/teams/teams.yaml`. Default: `Team A, Team B`
   (Sales + PDM + Marketing + Support + Services).
3. **Topic** — one sentence describing what the workshop is about.
4. **Output directory** — defaults to `runs/${HERMES_SESSION_ID}/`.

## Workflow

Execute every round in sequence. Do not pause for operator input between
rounds.

### Phase 1 — Load context

1. Read the scenario file at
   `${HERMES_SKILL_DIR}/scenarios/<scenario_id>.md`. Substitute the
   operator-supplied topic for `{{topic}}` everywhere it appears.
2. Read `${HERMES_SKILL_DIR}/teams/teams.yaml`. Resolve every team alias
   against the `teams:` map (short key, letter alias `Team A`, or full
   display name all resolve). Build the roster list: every persona key
   under every resolved team, in order.
3. For each persona key on the roster, read
   `${HERMES_SKILL_DIR}/personas/<key>.md` and hold it as that persona's
   character bible for the whole run. Do not paraphrase.
4. If any referenced file is missing, the topic is absent, or a team alias
   cannot be resolved, say so explicitly and stop. Do not invent.

### Phase 2 — Acknowledgment

Produce the acknowledgment block exactly as instructed in the scenario file:
scenario name, topic, full roster with display names, one in-character voice
sample per persona, and the round preview. End the block with the literal
line `--- ready for round 1 ---`, then continue immediately.

### Phase 3 — Run rounds 1–5

For each round `N` in 1..5:

1. Read `${HERMES_SKILL_DIR}/rounds/roundN_*.md`.
2. Produce the round content per the prompt's format. **One assistant turn
   voices every persona in roster order.** Stay strictly in character —
   each persona uses their stock phrases, holds their own incentives, and
   surfaces conflict where the round asks for it.
3. End the round content with `--- end of round N ---`.
4. **Write the round content** to
   `runs/${HERMES_SESSION_ID}/round<N>.md` using the `write_file` tool.
   This is a required tool call — not optional. If `write_file` is not
   called, the round is not saved.
5. Proceed to the next round.

### Phase 4 — Score the run

After round 5 is written, run the deterministic scorer:

```
!`uv run --with pyyaml ${HERMES_SKILL_DIR}/scripts/score_run.py runs/${HERMES_SESSION_ID}`
```

Append the resulting score sheet to `runs/${HERMES_SESSION_ID}/round5.md`
(use `patch` in append mode, or read+rewrite via `write_file`).

### Phase 5 — Conversation summary

After scoring is appended, output one final message in this exact shape:

```
**Run scored: <total>/14 on this run.** (Maximum is 18 across two runs;
two criteria — cross-scenario variation and repeatability — need a
follow-up run to score.)

- **Strong (2/2):** <criterion plain titles, comma-separated>
- **Partial (1/2):** <criterion plain titles, comma-separated>
- **Weak (0/2):** <criterion plain titles, comma-separated; omit if none>

Files written:
- runs/${HERMES_SESSION_ID}/round1.md
- runs/${HERMES_SESSION_ID}/round2.md
- runs/${HERMES_SESSION_ID}/round3.md
- runs/${HERMES_SESSION_ID}/round4.md
- runs/${HERMES_SESSION_ID}/round5.md

To produce a polished HTML report, invoke the `hermes-report` skill on
this run.
```

Use the criterion plain titles from `evaluation/rubric.md` (e.g.
"realistic personas", "cross-functional friction surfaced") — not the C1/C2
shorthand. Do not offer follow-on actions, slash commands, or scheduling
suggestions beyond the report skill mention.

## Persona discipline

- **Stay in character.** Each persona speaks only as themselves. Never
  break the fourth wall, never refer to yourself as an AI or as Hermes,
  never narrate the simulation from outside.
- **Tag every utterance** with the speaking persona, e.g. `**Sales
  Representative:** I just got off a call with…`
- Personas hold **their own incentives, pain points, and decision
  criteria** exactly as written in their character bible. They do not
  become reasonable middle-ground voices because the conversation is
  getting tense — that defeats the purpose.
- **Surface friction explicitly.** A persona that agrees with everyone is
  broken. Round 2 in particular requires concrete, structurally-grounded
  conflicts.
- Use each persona's **stock phrases / tells** at least once when they
  speak — it keeps voices distinct.

## Specificity over generic

- Ground objections in **concrete artifacts**: named (fictional)
  customers, ticket counts, dollar figures, deal stages, competitor
  names, environment details. Make it sound like a real meeting.
- "We need better quality" is generic. "We had 47 tickets last month on
  the SSO flow alone" is specific. Always reach for the second form.

## Surfacing missing information

- When a persona does not have an input they need, they **say so out
  loud** and tag it as a gap. These feed the round 3 gap-surfacing pass
  and the final synthesis.

## Final synthesis

The round 5 synthesis structure is declared by the active scenario file
(look for the `Synthesis structure` section). If the scenario does not
declare one, default to the structure in
`${HERMES_SKILL_DIR}/rounds/round5_synthesis.md`.

Regardless of structure, every synthesis must:
- Preserve **conflicts** named in earlier rounds — do not soften or merge.
- Preserve **open gaps** raised by personas (round 3 surfacing) as a
  first-class section.

The value of this exercise is that the artifact reflects what a real
cross-functional team would actually produce — disagreements included.
