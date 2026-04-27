# Cross-Functional Requirements Workshop — Synthesis

**Scenario:** cross_functional_workshop
**Topic:** What activities do you feel would benefit from AI Agents to help with building next years commercial PC roadmap?
**Teams:** Commercial Strategy Team (Sales Representative, Product Manager (PDM), Marketing Manager) + Customer Reality Team (Support Lead, Services Lead)
**Date:** 2026-04-26

---

## 1. Top 5 Requirements

**1. AI Agent: Ticket Triage + Anomaly Detection (Intelligent Support Operations)**
- **Title:** Ticket Triage + Anomaly Detection
- **Rationale:** 1,200 support tickets per month with 35% misroute rate; team is reactive to firmware-related ticket spikes that arrive 2+ hours after the damage is done. An integrated agent handles intake routing with suggested resolution steps and correlates ticket volume spikes to release events for proactive on-call alerting. This is the single highest-volume operational efficiency gain available and directly improves CSAT and MTTR — the metrics tied to renewal conversations.
- **Champion:** Support Lead
- **Concessions made:** Support accepted anomaly detection as a component of triage (not a standalone roadmap slot) and conceded Marketing's demoability request — v1 ships as internal operational tooling, with customer-narrative positioning deferred to launch.
- **Dependencies:** Structured release event log from Engineering; device telemetry data accessible from production environments; pre-GA feature access for Support runbook authoring.
- **Risks:** Telemetry access may be blocked by data-residency or access control constraints not yet assessed by Engineering. Anomaly correlation is only reliable if the release event log is complete — partial log coverage produces false negatives.

**2. AI Agent: Competitive Intelligence + Battle Card Automation**
- **Title:** Competitive Intelligence + Battle Card Automation
- **Rationale:** Sales reps are walking into enterprise demos against Lenovo, Dell, and HP with battle cards that are 8+ months stale. Marketing has no real-time signal on competitor announcements or analyst positioning shifts. An agent that monitors competitor press releases, product announcements, G2/TrustRadius reviews, and analyst publications — and pushes updated battle cards to Salesforce on a weekly cadence — addresses both gaps simultaneously. This was the only agent with zero cross-functional opposition in round 4.
- **Champion:** Marketing Manager (co-championed by Sales Representative)
- **Concessions made:** Marketing absorbed the standalone analyst intelligence agent into this one, giving up a dedicated slot. Sales gave up the pipeline risk scoring agent entirely to make room for this and the traceability agent.
- **Dependencies:** Competitive monitoring data feed subscriptions; Salesforce CRM write-access integration; analyst report API or subscription access (Gartner, IDC).
- **Risks:** Competitor data feeds are noisy — without curation logic the agent produces volume over signal. Gartner/IDC programmatic access may require a licensing agreement outside the product engineering budget.

**3. AI Agent: Backlog Prioritization Scoring**
- **Title:** Backlog Prioritization Scoring
- **Rationale:** PDM manages a 340-item backlog using a homegrown spreadsheet that manually blends support volume, pipeline influence, usage data, and engineering estimates. An agent ingesting live signals from Jira, Salesforce, product telemetry, and the support ticket system produces a ranked list with confidence ranges — replacing 3 hours of weekly toil and making prioritization defensible against cross-functional challenges.
- **Champion:** Product Manager (PDM)
- **Concessions made:** PDM gave up the roadmap narrative generation agent (round 1 priority 3) to keep this on the list, and committed to incorporating Support ticket volume as a mandatory input signal.
- **Dependencies:** Engineering effort estimates with confidence ranges (hard dependency — Engineering not in room); clean API access to Salesforce, Jira, and product telemetry; per-account usage data (data-residency question unresolved).
- **Risks:** Without the Engineering effort estimates, the scoring model reflects impact-only prioritization — the cost side is missing and the output will be systematically biased toward high-impact, high-effort items. Signal quality across integrated sources is unvalidated.

**4. AI Agent: Customer-to-Roadmap Feature Request Traceability**
- **Title:** Customer-to-Roadmap Feature Request Traceability
- **Rationale:** Sales has 18 active enterprise accounts submitting feature requests through informal channels (email, Slack, call notes) that enter Jira with no customer-facing traceability. PDM cannot systematically show customers their input shaped the roadmap. An agent that ingests multi-channel requests, deduplicates across accounts, maps to backlog items, and notifies Sales when items reach GA enables expansion conversations and closes a customer satisfaction loop currently generating escalation tickets.
- **Champion:** Sales Representative
- **Concessions made:** Sales dropped the pipeline risk scoring agent. Sales accepted PDM's condition that market-breadth validation (via Support ticket volume) must support a request before roadmap commitment — named-account demand alone is insufficient for prioritization.
- **Dependencies:** Structured feature request intake channel (currently informal — a process change is required before the agent has reliable input); backlog prioritization agent (#3 above); Support ticket data for demand validation.
- **Risks:** If the intake channel remains informal, the agent ingests unstructured noise and deduplication fails. Support flagged that "shipped" in the agent's notification logic must mean "GA plus runbook ready" — not just GA date — otherwise Sales expansion signals are unreliable.

**5. AI Agent: Implementation Scoping + SOW Generation**
- **Title:** Implementation Scoping + SOW Generation
- **Rationale:** Services loses 2+ enterprise deals per quarter to scoping turnaround time: 3 weeks internally vs. competitors who return scope documents in 5 days. An agent that conducts structured requirements discovery with the customer IT lead, maps the environment against reference architectures, and produces a draft SOW handles the first week of three. Second-order benefit: better-scoped implementations produce better runbook handoffs to Support, reducing post-GA ticket volume from new deployments.
- **Champion:** Services Lead
- **Concessions made:** Services accepted that the agent addresses only week 1 of 3; weeks 2–3 (environment validation, Legal/Finance approval) require process reform outside this room. Services committed to owning the runbook for the SOW agent itself.
- **Dependencies:** Reference architecture library (Services deliverable); approval process reform with Legal/Finance (not in room); structured customer environment questionnaire template (Services deliverable).
- **Risks:** Legal and Finance may not accept agent-generated SOW drafts without requiring full human redraft, adding a review step rather than removing one. Net cycle time could remain unchanged or increase if approval culture doesn't shift.

---

## 2. Inputs Needed (by role)

**Sales Representative**
- Q1 win/loss data broken down by competitor and deal size (needed to identify which agent use cases map to real loss patterns vs. anecdote)
- Product telemetry showing feature usage by named account (prerequisite for pipeline risk scoring agent and traceability agent reliability)

**Product Manager (PDM)**
- Engineering effort estimates with confidence ranges for top 20 backlog items (hard dependency for backlog prioritization agent's cost-side scoring)
- Support ticket volume breakdown showing whether customer-to-roadmap traceability appears in the top 10 issue categories (PDM's market-signal threshold for the traceability agent)
- Clear strategic direction from leadership on whether internal agent tooling is in-scope for next year's commercial PC roadmap budget

**Marketing Manager**
- Roadmap items with firm, launch-grade dates (required to build analyst briefing calendar and launch campaign plan around the five agent capabilities)
- Competitive intelligence on Gartner/IDC's current coverage of AI PC roadmap tooling specifically (needed to position agents against analyst criteria)

**Support Lead**
- Device telemetry data accessible from production environments (triage agent and anomaly detection component are diagnosing blind without field logs)
- Defect prioritization SLA commitment from PDM for the 89 recurring Secured Core configuration tickets (KB gap detection work runs in parallel — fixing the defect is a dependency of the KB article being accurate)

**Services Lead**
- API contracts and integration specs for Q3/Q4 roadmap items (required to estimate implementation scope for the configuration guidance agent and any customer-facing agent surface)
- Approval process reform with Legal/Finance for SOW sign-off (agent handles week 1; weeks 2–3 are human bottlenecks outside this team's authority)

---

## 3. Outputs Produced (by role)

**Sales Representative**
- Pipeline and forecast updates (consumed by PDM for prioritization scoring, by Marketing for campaign timing)
- Customer feedback and feature requests with named-account justification (primary input to traceability agent)
- Lost-deal reasons with competitor attribution (feeds competitive intelligence agent and win/loss analysis)

**Product Manager (PDM)**
- Roadmap with committed dates (consumed by Marketing for launch planning, Services for implementation scoping)
- PRDs and feature specs with acceptance criteria (consumed by Engineering, Services, Support for runbook authoring)
- Backlog prioritization rationale (consumed by all cross-functional stakeholders)
- API contracts for customer-facing features (consumed by Services for implementation scoping, Support for integration troubleshooting)

**Marketing Manager**
- Positioning and messaging frameworks (consumed by Sales for demo narratives, battle cards)
- Launch plans and campaign briefs (consumed by Support for volume forecasting, Services for deployment readiness)
- Analyst briefings and press materials (consumed externally; shapes competitive environment Sales operates in)

**Support Lead**
- Top-N issues report weekly/monthly (primary input to PDM's backlog prioritization agent)
- Ticket volume and CSAT dashboards (consumed by PDM for prioritization, Services for renewal health)
- Knowledge base articles and runbooks (consumed by customers, support agents, and Services for implementation handoff)
- Release-correlated ticket spike reports (fed into anomaly detection component)

**Services Lead**
- Implementation plans and SOWs (consumed by customers, Sales for deal progression, Legal/Finance for approval)
- Reference architectures and configuration guides (consumed by customers, Support for troubleshooting)
- Environment readiness assessments (consumed by PDM for upgrade planning, Support for pre-launch preparation)
- Runbook for the SOW generation agent (committed in round 4)

---

## 4. Cross-Functional Dependencies

- **Support ticket volume by category** — produced by Support Lead — consumed by PDM (backlog prioritization agent input signal)
- **Roadmap items with committed dates** — produced by PDM — consumed by Marketing (launch calendar, analyst briefings), Services (implementation scoping)
- **API contracts and integration specs** — produced by PDM + Engineering — consumed by Services (SOW scoping and implementation), Support (troubleshooting runbooks)
- **Win/loss data with competitor attribution** — produced by Sales Representative + Sales Ops — consumed by PDM (prioritization validation), Marketing (competitive positioning)
- **Feature usage telemetry by account** — produced by Engineering + PDM — consumed by Sales (traceability agent, upsell signals), PDM (backlog scoring)
- **Customer feature requests** — produced by Sales Representative — consumed by PDM (traceability agent input, prioritization)
- **Launch campaign plans** — produced by Marketing Manager — consumed by Support (volume forecasting, staffing decisions)
- **Reference architectures** — produced by Services Lead — consumed by SOW generation agent, customer IT admins, Support (configuration troubleshooting)
- **Implementation SOWs** — produced by Services Lead (via SOW agent) — consumed by Sales (deal progression), Legal/Finance (approval), customers

---

## 5. Conflicts and Misalignments

- **Sales vs. PDM — Market-signal threshold for prioritization.** Sales treats three named accounts as sufficient evidence to prioritize the customer-to-roadmap traceability agent. PDM requires broader market validation (ticket volume, win/loss data). *Round 4 disposition: Partially resolved — Sales accepted PDM's ticket-volume validation condition. The specific threshold (what count of tickets triggers commitment) was not defined.*

- **Marketing vs. Support — Campaign velocity vs. queue capacity.** Marketing's content personalization agent would triple campaign output; prior launches without Support notification produced 43-ticket spikes. Both acknowledged the gap; neither owns the "launch risk review" process. *Round 4 disposition: Demand-gen personalization agent dropped from top 5; the underlying coordination problem (Marketing launches without Support notification) was not resolved and will recur with the competitive intelligence agent's battle card pushes.*

- **Services vs. PDM — Configuration guidance agent blocked by undefined API surface.** PDM acknowledged the API spec needed to scope the customer configuration guidance agent doesn't exist. *Round 4 disposition: Configuration guidance agent did not make the top 5; deferred. The API spec ownership gap remains open.*

- **Support vs. Marketing — Demoability vs. operational urgency for KB/anomaly agents.** Marketing wanted a "proactive support platform" narrative; Support refused to let demoability drive v1 scope. *Round 4 disposition: KB gap detection agent dropped from top 5. Anomaly detection merged into triage agent as an internal component. This conflict was operationally resolved but the underlying tension will resurface on the next release.*

- **Sales vs. Support — Feature quality gate for expansion signals.** Support argued that a traceability agent notifying Sales of "shipped" features is misleading if features ship without observability. *Round 4 disposition: Deferred. "Shipped" definition (GA date vs. GA-plus-runbook) was flagged in the traceability agent risk section but no formal gate was agreed.*

- **Services vs. Sales — SOW scoping timeline.** Services can deliver two-week scoping with the agent; Sales needs one week to match competitors. *Round 4 disposition: Deferred. The third week (Legal/Finance approval) is outside the room's authority; no resolution reached.*

---

## 6. Open Questions

- **Who owns the win/loss dataset?** Sales assumes Sales Ops; PDM assumes Sales produces it; no one confirmed a maintained, structured source. Raised by PDM in round 1. Needs answer from: Sales Ops or Revenue Operations leader (not in room).

- **What is the shared agent infrastructure cost?** All five agents were discussed as standalone tools. No one named the common infrastructure (auth, logging, data governance, audit trails) that likely has a fixed cost regardless of which agents ship first. Raised implicitly by Services and Support. Needs answer from: Engineering (not in room).

- **Is per-account product telemetry accessible for agent use?** Sales assumed it; PDM and Services did not confirm. Data-residency constraints, access controls, and customer consent terms may restrict this. Raised by Hermes in round 3. Needs answer from: Engineering / Legal (not in room).

- **What is the approval process for agent-generated SOW drafts?** Services assumed Legal/Finance would trust the output enough to accelerate; this may not be true. Raised by Hermes in round 3. Needs answer from: Legal, Finance, VP of Services (not in room).

- **What does "shipped" mean for the traceability agent?** GA date only, or GA date plus runbook ready? Support raised this directly in round 2. Needs answer from: PDM + Support Lead (in room — but unresolved).

- **Can Marketing launch campaigns without a Support notification gate?** The competitive intelligence agent will push battle card updates to Sales at scale — does that require the same launch risk gate? Raised by Support in round 2. Needs answer from: Marketing Manager + Support Lead.

---

## 7. Risks

**From round 4:**
- Telemetry access for triage + anomaly agent may be blocked by Engineering data-residency policies.
- Competitive intelligence agent produces noise without curation logic; Gartner/IDC API access requires separate licensing negotiation.
- Backlog prioritization agent is impact-only without Engineering effort estimates — cost-side bias is baked in at launch.
- Traceability agent expansion signals are unreliable if features ship without observability; "shipped" definition unresolved.
- SOW agent addresses week 1 of 3; weeks 2–3 remain bottlenecked in Legal/Finance approval chains outside this team.

**Structural risks (moderator observation):**
- **No Engineering voice in the room.** Every agent in the top 5 has a hard dependency on Engineering (telemetry, release event logs, effort estimates, API contracts). None of those dependencies were confirmed by Engineering. The top 5 list is hypothesis-driven until Engineering validates it.
- **No Legal/Finance voice in the room.** Two agents (SOW generation, competitive intelligence) have licensing or approval dependencies that require Legal or Finance buy-in. Both were assumed solvable without those stakeholders being present.
- **Shared infrastructure cost is invisible.** Five independently scoped agents may share a common data-access, authentication, and governance layer. If that layer is uncosted, the sum of individual agent estimates will be materially lower than total build cost.
- **Process debt blocks agent utility.** The traceability agent requires a structured feature request intake channel (currently informal). The triage agent requires a complete release event log (currently unconfirmed). Both agents are scoped as if these prerequisites exist.

---

## 8. Next Steps

| Action | Owner | Timeframe |
|---|---|---|
| Produce Q1 win/loss dataset broken down by competitor and deal size | Sales Ops (Sales Representative to request) | This sprint |
| Confirm whether per-account product telemetry is accessible for agent use; identify data-residency constraints | Engineering (PDM to request) | This sprint |
| Pull Support ticket volume breakdown — specifically whether customer-to-roadmap traceability appears in top 10 categories | Support Lead | This week |
| Obtain engineering effort estimates with confidence ranges for top 20 backlog items | PDM (Engineering dependency) | This sprint |
| Define "shipped" for the traceability agent: GA date only, or GA plus runbook? | PDM + Support Lead | This sprint |
| Map the shared agent infrastructure (auth, logging, data governance) and produce a cost estimate | Engineering (PDM to commission) | Next sprint |
| Design the feature request intake channel that gives the traceability agent structured input | PDM + Sales Representative | Next sprint |
| Audit whether a complete release event log exists for anomaly detection; identify gaps | Engineering + Support Lead | This sprint |
| Confirm Gartner/IDC programmatic data access availability and cost | Marketing Manager | This week |
| Brief Legal and Finance on SOW agent concept; get early read on draft-acceptance criteria | Services Lead | This sprint |
| Initiate approval process reform discussion with Legal/Finance for SOW turnaround | Services Lead + VP Services | Next quarter |
| Establish "launch risk review" notification process from Marketing to Support before any campaign goes live | Marketing Manager + Support Lead | This sprint |

---

## 9. Moderator Notes (out-of-character)

The simulation surfaced several genuinely useful tensions that would appear in a real cross-functional session. The conflict between Sales' deal-urgency framing (three named accounts = sufficient signal) and PDM's market-validation requirement is a real structural friction in commercial PC roadmap processes — and the simulation correctly left it unresolved rather than manufacturing false consensus. The Support Lead's insistence that "shipped" must mean "GA plus runbook" before Sales uses it as an expansion signal was the most practically important point raised, and is not typically captured in roadmap planning workshops. The Services Lead's breakdown of the three-week SOW scoping process into three distinct segments (discovery / environment validation / approvals), each with different automation potential, was the most analytically useful contribution.

Where the simulation felt thin: Marketing's persona was the weakest in round 4, conceding multiple positions without strong pushback. A real Marketing Manager would likely have fought harder for the demand-gen personalization agent — it has a direct budget and headcount justification — and the concession to drop it felt too easy. The simulation would have benefited significantly from an Engineering voice; every agent proposal hit an Engineering dependency that remained unvalidated, and a Feasibility Team persona (Team C) would have forced those conversations in-room rather than deferring them to follow-up. The absence of a Legal/Finance voice similarly allowed the SOW agent to make the top 5 without its most significant risk (approval culture) being seriously interrogated.

--- end of round 5 — synthesis complete ---

---

## Score Sheet

| Criterion | Score (0/1/2) | Evidence |
|-----------|---------------|----------|
| C1 Realistic personas | 2 | Sales: "Why are we making this so complicated? There's $4.7M on the table if we can show churn risk signals." PDM: "We can do that — what comes off the roadmap?" Support: "We've had 89 tickets in the last 30 days on the Secured Core configuration flow alone. Fix the existing thing first." Services: "Every customer is becoming a snowflake." Marketing: "The narrative is that HP and Dell are already saying 'AI-powered roadmap intelligence' in their keynotes." All 5 personas used stock phrases and stayed in character through round 4. |
| C2 Multi-persona discussion | 2 | Round 2: 7 exchanges; all 5 personas spoke as challenger or recipient. Round 1: each persona got a full 3-requirement turn. Round 4: all 5 negotiated with substantive trade offers. Sales and PDM had the most exchanges; Support and Services had 2 each — comparable depth given their roles. |
| C3 Role consistency | 2 | Sales R1→R4: dropped pipeline risk scoring explicitly ("I'll drop pipeline risk scoring"), kept traceability and competitive intel — both were R1 priorities 1 and implied. PDM R1→R4: "I'll trade roadmap narrative generation — I can live without it" — explicit concession of R1 priority 3, kept backlog prioritization (R1 priority 2). Every shift named. |
| C4 Cross-functional friction | 2 | Round 2 produced 6 concrete tensions all tied to R1 requirements: (1) Sales deal scope vs. PDM market-signal threshold for traceability agent; (2) Marketing campaign velocity vs. Support queue capacity; (3) Services/PDM internal vs. customer-facing scope; (4) SOW scoping timeline dispute; (5) KB/anomaly demoability vs. operational urgency; (6) feature quality gate for expansion signals. |
| C5 Missing inputs | 2 | Round 3 §1 table: 10 rows covering all 5 personas. Owners named concretely: Sales Ops, Engineering (not in room), PDM, Support Lead, Legal/Finance (not in room). No vague "someone should own this." |
| C6 Convergence | 2 | Round 4 top-5 list: all 5 slots populated with title, rationale, champion, concessions made, dependencies, and risks. No contested slots required — negotiation reached full agreement via explicit horse-trading. |
| C7 Structured output | 2 | Round 5 contains all 9 sections per the template: §1 Top 5 Requirements, §2 Inputs Needed, §3 Outputs Produced, §4 Cross-Functional Dependencies, §5 Conflicts and Misalignments, §6 Open Questions, §7 Risks, §8 Next Steps, §9 Moderator Notes. None skipped or renamed. |
| C8 Configurable team / scenario | 0 — requires second run | Not applicable to baseline single run. |
| C9 Repeatability | 0 — requires second run | Not applicable to baseline single run. |
| **Total** | **14 / 18** | C1–C7 scored; C8/C9 require a second run. |

---

## Realism Smell Test

- **Felt like a real meeting?** Largely yes — the specificity of numbers (89 tickets on one flow, $4.7M in pipeline, 1,200 tickets/month, Redrock Energy as a named lost deal) and character-specific objections (Support refusing to let demoability drive v1 scope, PDM's "who else needs this?" gatekeeping reflex, Services decomposing the three-week SOW process into distinct automatable and non-automatable segments) made it feel grounded. What felt slightly fake: Marketing conceded the personalization agent too cleanly in round 4 without a fight.
- **Surprising moment?** Support's argument that "shipped" must mean "GA plus runbook ready" before the traceability agent notifies Sales of an expansion opportunity — this is a non-obvious agent design requirement that wouldn't surface in a standard feature spec discussion. It reframes the agent's trigger condition entirely.
- **Would the real roles recognize themselves?** Sales would recognize the revenue-urgency framing and frustration with scoping delays immediately. PDM would recognize the "what does this displace?" pattern as instinct. Support would absolutely claim the ticket-count specificity and "fix the existing thing first" position as authentic. Services and Marketing would likely find their portrayals credible if slightly compressed.

