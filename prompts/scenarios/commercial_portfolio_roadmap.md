# Scenario: Commercial Portfolio Roadmap

**Scenario ID:** `commercial_portfolio_roadmap`
**Default teams:** Commercial Strategy Team + Customer Reality Team
**Topic:** `{{topic}}` — the portfolio under review (e.g. "2026 commercial
portfolio roadmap"), supplied by the operator at invocation.

> **Note on Feasibility input:** A real portfolio-roadmap session benefits
> from the Feasibility Team (Engineering, Supply Chain, Procurement) being
> in the room. Those personas are not yet written in `personas/`, so by
> default the run uses Commercial Strategy + Customer Reality only. Round 5
> will explicitly flag the absence of feasibility voice as a structural
> risk on the resulting roadmap.

---

## Setting

A portfolio-level roadmap working session has been called. The teams in
the operator's invocation are present. They must collectively decide
**what gets built when** across the planning horizon — not a feature list,
an **initiative stack-rank by quarter** with rationale, dependencies, and
risks.

This is not a wishlist exercise. The output must respect:

- Capacity reality (the team can't run everything in parallel)
- Dependency ordering (some initiatives unblock others)
- Market timing (some windows close)
- Competitive pressure (some moves can't slip)
- Customer-reality drag (production pain pulls capacity from new bets)

If the operator did not supply a planning horizon in `{{topic}}`, default
to **the next four quarters** and call out the assumption in the
acknowledgment.

## Expected dynamics (scenario-specific)

The persona tensions look different from a requirements workshop:

- **Sales** pushes for the initiatives that unblock named at-risk deals
  *this quarter*, anchored to dollar values from the pipeline.
- **PDM** pushes for platform investments with multi-quarter payoff and
  resists single-deal driven roadmap items.
- **Marketing** pushes for the launchable initiative each quarter — there
  must be a story to tell — and references competitive moves to argue
  urgency.
- **Support** pushes for stabilization slots (a stabilization initiative
  per quarter is a valid roadmap slot) anchored to ticket-volume data.
- **Services** pushes for migration / lifecycle / deployability work that
  unlocks customer expansion, citing implementation pain in named
  fictional customers.

## Convergence target

Round 4 must converge on a **quarterly initiative stack-rank** for the
planning horizon. Use this output structure (override the round 4 default):

```
## Roadmap — {{topic}}

### Q1
1. <initiative title>
   - Rationale: <one paragraph>
   - Champion: <persona>
   - Concessions: <which personas gave up what to land this slot>
   - Dependencies: <upstream initiatives, teams not in the room, external>
   - Risks: <top 1-2>
   - Success measure: <how we know it worked at end of quarter>
2. ...

### Q2
...

### Q3
...

### Q4
...

## Held / Not on the Roadmap
For each initiative that surfaced but did NOT make the cut, list:
- Title
- Who pushed for it
- Why it was held (capacity / sequencing / insufficient evidence / etc.)
- Trigger condition that would put it back on the roadmap

## Contested slots
Same format as round 4 default — Option A vs. Option B with supporters,
opponents, and the decision authority needed to resolve.
```

Each quarter should hold **3–5 initiatives**, not more. If a quarter is
empty, that's a finding (capacity is being absorbed elsewhere) — say so
explicitly rather than padding.

## Synthesis structure

Round 5 produces the synthesis at this structure (override the round 5
default):

```markdown
# Commercial Portfolio Roadmap — {{topic}} — Synthesis

**Scenario:** commercial_portfolio_roadmap
**Topic:** {{topic}}
**Teams:** <participating teams + rosters>
**Planning horizon:** <Q1–Q4 of which year, or operator override>
**Date:** <today>

## 1. Roadmap (by quarter)
Carry forward verbatim from round 4.

## 2. Held / Not on the Roadmap
Carry forward from round 4. Each item with trigger condition.

## 3. Contested Slots
Carry forward from round 4. Name the decision-maker needed.

## 4. Inputs Needed (by role)
What each persona on the roster said they needed to be confident in the
roadmap and didn't have. Pull from rounds 1 and 3.

## 5. Cross-Functional Dependencies
Initiative-by-initiative — what each one needs from teams not in the room
(engineering, supply chain, procurement, finance, legal). This is the
explicit ask the roadmap will fail without.

## 6. Conflicts and Misalignments
Carry forward from round 3 — name the personas, the positions, and how
round 4 resolved or deferred each one.

## 7. Open Questions
Questions raised that nobody in the room could answer. Tag each with
who would need to answer (specific role, even if not in the room).

## 8. Risks
Top risks across the roadmap, including:
- Structural risks the moderator can name (e.g. "no Feasibility voice in
  the room — every Q's capacity assumptions are unvalidated")
- Persona-flagged risks from round 4

## 9. Next Steps
Concrete actions for the next 1–2 weeks, each with: action, owner, and
trigger to revisit the roadmap.

## 10. Moderator notes (out-of-character)
- Where the simulation surfaced something genuinely useful
- Where personas leaned on instinct vs. concrete signals
- What persona / team / data would meaningfully improve a re-run
```

If background research was loaded via the optional `Project:` invocation,
add a final `## 11. Bibliography` section mapping inline citations to
source document paths.

## Acknowledgment (do this now)

Before running any rounds, produce the acknowledgment:

1. Restate, in this exact shape:
   - **Scenario:** `commercial_portfolio_roadmap`
   - **Topic:** *(operator-supplied, substituted for `{{topic}}`)*
   - **Planning horizon:** *(parsed from topic, or the default four quarters)*
   - **Teams in play:** for each team, list the alias and the roster from
     `teams/teams.yaml` using `display_name` for each persona.
2. Provide a **one-line in-character voice sample** for each persona on the
   roster, tagged with their display name.
3. Flag any structural concerns with the team composition for *this*
   scenario (e.g., "no Feasibility voice — capacity assumptions will be
   unvalidated; round 5 will note this risk").
4. Preview the round structure:
   - Round 1 — Opening positions (each persona's top 3 initiatives for
     the horizon)
   - Round 2 — Cross-examination
   - Round 3 — Gap surfacing
   - Round 4 — Convergence (quarterly stack-rank)
   - Round 5 — Synthesis
5. End the acknowledgment with `--- ready for round 1 ---` and immediately
   proceed — do not wait for operator input.

End with:
> `--- ready for round 1 ---`

If the topic is missing, ambiguous, or one of the named teams cannot be
resolved, **do not invent a substitute**. Say what's missing, stop, and
wait for the operator to re-invoke.
