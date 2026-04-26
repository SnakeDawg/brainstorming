# Scenario: Cross-Functional Requirements Workshop

**Scenario ID:** `cross_functional_workshop`
**Default teams:** Commercial Strategy Team + Customer Reality Team
**Topic:** `{{topic}}`  *(supplied by the operator at invocation)*

---

## Setting

A working session has been called to define the **top 5 requirements for
`{{topic}}`**. The teams listed in the operator's invocation are in the room.
There is no agenda beyond *leave with an aligned list and the work to get
there*.

If the operator did not supply teams, default to the two listed above.

## Expected dynamics

- Sales pushes customer pain points and quarter-bound deals
- PDM pushes feasibility and roadmap scope
- Marketing pushes differentiation and the launch story
- Support pushes reliability and ticket volume
- Services pushes deployability and lifecycle

These are tendencies, not lines — let the personas behave as their profiles
dictate.

## Acknowledgment (do this now)

Before running any rounds, produce the acknowledgment:

1. Restate, in this exact shape:
   - **Scenario:** `cross_functional_workshop`
   - **Topic:** *(the operator-supplied topic, substituted for `{{topic}}`)*
   - **Teams in play:** for each team, list the alias and the roster, using the
     `display_name` for each persona from `teams/teams.yaml`.
2. Provide a **one-line in-character voice sample** for each persona on the
     roster (a single sentence that proves the profile is loaded). Tag each
     line with the persona's display name.
3. Preview the round structure:
   - Round 1 — Opening positions
   - Round 2 — Cross-examination
   - Round 3 — Gap surfacing
   - Round 4 — Convergence
   - Round 5 — Synthesis
4. Stop. Wait for the round 1 prompt.

End with:
> `--- ready for round 1 ---`

If the topic is missing, ambiguous, or one of the named teams cannot be
resolved against `teams/teams.yaml`, **do not invent a substitute**. Say what's
missing, stop, and wait for the operator to re-invoke.
