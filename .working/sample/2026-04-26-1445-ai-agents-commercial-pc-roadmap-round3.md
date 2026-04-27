# Round 3 — Gap Surfacing
**Scenario:** cross_functional_workshop
**Topic:** What activities do you feel would benefit from AI Agents to help with building next years commercial pc roadmap?
**Run:** 2026-04-26-1445

---

## 1. Missing Inputs

| Persona | Input they need | Why they can't move without it | Likely owner |
|---|---|---|---|
| Sales Representative | Win/loss data from last 2 quarters mapped to product gaps | Competitive deal-intelligence agent has no ground truth without it | PDM / Sales Operations |
| Sales Representative | Committed roadmap dates shareable with customers | Can't give Corrigan or Hartwell a timeline they'll trust | PDM |
| Product Manager (PDM) | Engineering effort estimates with confidence ranges for top 20 backlog items | Prioritization scorecard agent is noise without cost ground truth | Engineering Lead (not in room) |
| Product Manager (PDM) | Win/loss reasons mapped to named customers and specific gaps | Required to validate "who else needs this" for every roadmap slot | Sales / Sales Operations |
| Marketing Manager | Roadmap dates with launch-grade confidence (not directional) | Can't build campaign plans against items that slip every quarter | PDM |
| Marketing Manager | Customer reference willingness and current CSAT per account | Reference-matching agent has no data source without this | Support Lead / Customer Success |
| Support Lead | Defect prioritization SLA from PDM | Self-service deflection agent can't give accurate roadmap status without committed timelines | PDM |
| Support Lead | Ticket deflection baseline metrics from current system | Can't measure agent-driven improvement without a benchmark | Support (internal tooling gap) |
| Services Lead | API specs and integration contracts for H2 roadmap items | Can't scope implementation plans or train the planning agent without API shape | PDM / Engineering |
| Services Lead | Customer environment questionnaire data pre-close | Configuration drift detection and implementation planning require environment topology upfront | Sales (pre-sales process gap) |

## 2. Unresolved Conflicts

- **Sales vs. PDM — deal-urgency routing into backlog:** Sales wants the gap-alert agent to flag late-stage deal blockers to PDM in near-real-time; PDM will not accept unfiltered deal signals into the backlog. Decision not made: who triages deal-signal escalations and what is the response SLA?
- **Marketing vs. Support — readiness gate for AI-generated content:** Marketing wants positioning drafts in the internal workflow at PRD-final; Support requires a runbook before any external use. Decision not made: what is the minimum readiness gate for AI-assisted marketing content to be externally published?
- **Marketing vs. Support — self-service agent as launch asset:** Marketing wants to co-brand the deflection agent as a differentiated AI support experience; Support refuses until it has proven performance data. Decision not made: at what point does a working Support tool become a Marketing story?
- **PDM vs. Services — data fragmentation prerequisite:** Both agree the backlog and environment data fragmentation problem blocks multiple agents; neither team has the mandate or budget to fix it. Decision not made: who owns the data governance fix and on what timeline?
- **Sales vs. Services — pre-close environment data collection:** Services needs environment topology before contract close to scope implementations; Sales doesn't currently collect it pre-close. Decision not made: is this a Sales process change, a product feature (in-flow environment survey), or a services-led kickoff expansion?
- **Support vs. PDM — escalation triage ownership:** The auto-escalation agent needs a human review pass before landing in PDM's backlog; Support and PDM each implied the other owns that review. Decision not made: who triages AI-generated defect escalation tickets, and with what SLA?

## 3. Unclear Ownership

- **Win/loss analysis production** — currently unclear: Sales says they have anecdotes; PDM needs the data; Sales Operations isn't in the room; no one has committed to producing the structured artifact.
- **AI Agent deployment and operations** — currently unclear: Every persona wants one or more agents; none specified who builds, hosts, monitors, or retrains them. Engineering is not in the room; no infrastructure budget has been named.
- **Roadmap confidence classification (shareable vs. directional)** — currently unclear: PDM controls the roadmap but both Sales and Marketing need "launch-grade" dates; what qualifies a date as customer-shareable is undefined.
- **Customer reference database maintenance** — currently unclear: Marketing needs reference willingness and CSAT per account for the reference-matching agent; Support has CSAT data, Customer Success (not in room) owns reference relationships, Sales holds the account relationship. No one has committed to owning the consolidated view.

## 4. Hidden Assumptions

- **Sales is assuming PDM can provide committed dates within a quarter's window** — not validated; explicitly a PDM pain point (Marketing announces before things ship).
- **Marketing is assuming an AI agent reading a PRD produces usable positioning rather than a first draft requiring significant rework** — no one has tested the output quality.
- **Support is assuming the ticket volume figures (63 tickets, 31% deflection category, 214 expired KB articles) are accepted as sufficient mandate** — PDM pushed back on the false-positive rate in exchange 7; this threshold hasn't been adjudicated.
- **Services is assuming customers will share detailed environment topology as part of the pre-close sales process** — no evidence customers will accept this; it may require a product-level solution (in-product environment discovery) rather than a questionnaire.
- **PDM is assuming engineering effort estimates with confidence ranges already exist** — listed as missing input; not confirmed that Engineering is tracking this.
- **All personas are assuming AI Agents will be built, hosted, and maintained at no incremental cost or headcount** — nobody in the room owns the agent infrastructure budget or the model maintenance cycle.

--- end of round 3 ---
