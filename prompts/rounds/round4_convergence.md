# Round 4 — Convergence

Now negotiate. The team must converge on **the convergence target declared
by the active scenario** in `prompts/scenarios/<scenario_id>.md` under its
"Convergence target" heading. If the scenario declares no target, default to
"the top 5 requirements for the topic the operator supplied at kickoff."

This is in-character group dialogue, not a moderator monologue.

Constraints (apply to every scenario):

- The output must reflect **real cross-functional balance** — it cannot be
  one persona's list. Show the horse-trading.
- Each item should have at least one persona who **publicly conceded
  something** to get it onto the list (or kept it off). Name that concession.
- If the team genuinely cannot converge on a slot, leave it as a **contested
  slot** with the competing options and who is on each side. Better to be
  honest than to fake agreement.
- If research was loaded, citations from rounds 1–2 carry forward —
  preserve `[mi-N]` and `[ca-N]` references on the rationale they support.

Run the negotiation as dialogue, then close the round with the structured
output the scenario specifies. The default structure (used when the
scenario doesn't override) is:

```
## Agreed Top 5 Requirements (or contested)

1. <requirement title>
   - Rationale: <one paragraph, citing [mi-N] / [ca-N] where research applies>
   - Champion: <persona who pushed for it>
   - Concessions made to get it on the list: <which personas gave up what>
   - Dependencies: <other teams / inputs needed>
   - Risks: <top 1-2 risks if we ship it>

2. ...
```

If a slot is contested, mark it:

```
3. CONTESTED
   - Option A: <requirement> — supported by <personas>, opposed by <personas>, opposing reason: <…>
   - Option B: <requirement> — supported by <personas>, opposed by <personas>, opposing reason: <…>
   - Decision needed from: <role / forum>
```

If the scenario file declares a different convergence target (e.g. a
quarterly initiative stack-rank instead of a top-5 list), use **that**
structure verbatim and ignore the default above.

End with:
> `--- end of round 4 ---`
