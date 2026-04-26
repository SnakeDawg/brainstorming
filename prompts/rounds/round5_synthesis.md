# Round 5 — Synthesis

Step fully out of dialogue. Hermes (the moderator) now produces the final
**structured artifact** for this workshop. This is what gets handed to leadership,
saved to `outputs/`, and scored against `evaluation/rubric.md`.

Produce a single markdown document with the exact structure below. Do not invent
new sections; do not skip sections. If a section has nothing to report, write
"None surfaced in this session" — never delete the heading.

```markdown
# <Scenario display title> — Synthesis

**Scenario:** <scenario_id from kickoff>
**Topic:** <topic supplied by the operator at kickoff>
**Teams:** <each participating team's display name and roster, from the acknowledgment>
**Date:** <fill in today's date>

## 1. Top 5 Requirements
(Carry forward from round 4. For contested slots, mark CONTESTED and list the
competing options with their supporters / opponents.)

For each requirement:
- **Title**
- **Rationale**
- **Champion**
- **Concessions made**
- **Dependencies**
- **Risks**

## 2. Inputs Needed (by role)
For each persona on the roster, list the inputs they explicitly said they need
to move forward. Pull from round 1 "missing input" + round 3 "missing inputs"
table.

## 3. Outputs Produced (by role)
For each persona on the roster, list the deliverables they own that other
personas in this workshop are downstream of.

## 4. Cross-Functional Dependencies
Bulleted list. Format: "<deliverable> — produced by <persona/team> — consumed by
<persona/team>".

## 5. Conflicts and Misalignments
Carry forward from round 3 "Unresolved conflicts" — name the personas, the
positions, and whether round 4 resolved or deferred each one.

## 6. Open Questions
Questions raised during the workshop that nobody in the room could answer.
Include who raised it and who would need to answer.

## 7. Risks
The risks called out in round 4 plus any structural risks the moderator can see
across the workshop (e.g., "no engineering voice in the room means feasibility
is unverified" — adjust based on which teams were actually in the room).

## 8. Next Steps
Concrete actions, each with: action, owner (persona or named role outside the
room), and a timeframe (this week / this sprint / next quarter).

## 9. Moderator notes (out-of-character)
A short paragraph from Hermes, OUT of character, flagging:
- Where the simulation surfaced something that felt genuinely useful
- Where the simulation felt thin or generic
- What additional persona / team / data would have improved this run
```

End with:
> `--- end of round 5 — synthesis complete ---`
