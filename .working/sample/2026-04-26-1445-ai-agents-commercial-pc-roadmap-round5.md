# Cross-Functional Requirements Workshop — Synthesis

**Scenario:** cross_functional_workshop
**Topic:** What activities do you feel would benefit from AI Agents to help with building next years commercial pc roadmap?
**Teams:** Commercial Strategy Team (Sales Representative, Product Manager (PDM), Marketing Manager) + Customer Reality Team (Support Lead, Services Lead)
**Date:** 2026-04-26

---

## 1. Top 5 Requirements

**1. AI-Powered Win/Loss Aggregation and Roadmap Signal Routing**
- **Title:** Win/Loss Aggregation and Roadmap Signal Routing
- **Rationale:** Aggregates CRM notes, customer call outcomes, and deal results into a unified signal that feeds PDM's prioritization scorecard and Sales' deal-gap visibility in parallel. All three commercial team personas (Sales, PDM, Marketing) named win/loss data mapped to product gaps as their single most important missing input. Without it, the roadmap is built on individual anecdote rather than market signal.
- **Champion:** Product Manager (PDM)
- **Concessions made:** Sales conceded this is not a standalone deal-alert tool — it feeds the full prioritization cycle, not just late-stage CRM views. PDM conceded Sales must receive deal-specific output in the CRM workflow, not just a weekly digest that PDM reads alone.
- **Dependencies:** Sales Operations (win/loss data production formalized), Engineering effort estimates for scoring, CRM integration access
- **Risks:** If win/loss data collection isn't formalized first, the agent has no ground truth and degrades to noise immediately. Engineering feasibility unverified — no Engineering voice was in the room.

---

**2. AI Agent for Automated Ticket Trend Detection and Roadmap Escalation**
- **Title:** Automated Ticket Trend Detection and Roadmap Escalation
- **Rationale:** Ingests the ServiceNow queue, identifies issue spikes above threshold (15 tickets / 7 days as baseline), generates a structured defect brief with reproduction pattern, and routes it to PDM's backlog with a mandatory Support Lead triage pass. Closes the current gap where defect patterns accumulate across dozens of tickets before PDM sees them.
- **Champion:** Support Lead
- **Concessions made:** Support conceded the agent must include a human triage review (Support Lead reviews before escalation hits backlog). PDM conceded a 48-hour review SLA on escalation tickets received from the agent.
- **Dependencies:** ServiceNow integration, PDM defect prioritization SLA list, agreed escalation threshold, documented triage RACI
- **Risks:** False positive escalation rate if threshold isn't tuned — a single customer on an unsupported configuration could flood the backlog. Triage ownership needs a documented RACI before go-live.

---

**3. AI-Assisted Competitive Intelligence Feed**
- **Title:** Competitive Intelligence Feed (CRM + Positioning Workflow)
- **Rationale:** Single pipeline scanning competitor announcements, Gartner/IDC analyst reports, and press in the commercial PC segment. Sales pulls deal-relevant signals from CRM; Marketing pulls positioning ammunition into the launch workflow. One agent, two consumption surfaces — avoids parallel builds and keeps data consistent across both teams.
- **Champion:** Marketing Manager (narrative differentiation) / Sales Representative (deal enablement)
- **Concessions made:** Marketing conceded Sales gets CRM-integrated output, not just a marketing dashboard. Sales conceded the feed serves long-horizon positioning strategy, not just immediate deal support.
- **Dependencies:** Competitive data source licensing, CRM integration, Marketing positioning workflow integration
- **Risks:** Analyst content licensing costs (Gartner, IDC) could be prohibitive. Coverage gaps in niche commercial PC verticals (public sector, healthcare) where exposure is highest.

---

**4. AI-Assisted Launch Positioning Drafts from PRDs**
- **Title:** AI-Generated Launch Positioning from PRDs (Internal Gate Required)
- **Rationale:** When a PRD is finalized, the agent generates a first-draft positioning framework — headline, three differentiators, the analyst question it answers — for Marketing to refine. Compresses positioning development timeline and reduces last-minute scramble. Gated on Support runbook readiness before any external publication.
- **Champion:** Marketing Manager
- **Concessions made:** Marketing conceded no external content from the agent until Support confirms a runbook exists for the feature. Support conceded the draft can circulate internally at PRD-final rather than waiting for GA.
- **Dependencies:** Finalized PRDs (PDM), runbook readiness signal from Support, Marketing internal review workflow
- **Risks:** LLM-generated positioning from a technical PRD may require significant human rework — risk of compressing the timeline on paper while adding revision cycles in practice. Quality of output is untested.

---

**5. CONTESTED**
- **Option A: AI-Assisted Deployment Runbook Generator** — supported by Services Lead; weakly opposed by Support Lead (who prefers Option B). Agent reads product update specs and auto-drafts deployment runbooks with pre-checks, rollback steps, and environment-specific flags. Services condition: API specs delivered 90 days before GA. Services would defer the full implementation planning system to Q4 to land this in H2.
- **Option B: Customer Self-Service Roadmap Status / Deflection Agent** — supported by Support Lead; opposed by PDM (data infrastructure prerequisite blocks it). Pre-submission agent checks whether a customer issue maps to a known defect or a planned roadmap item and returns status. Targets the 31% "when is this getting fixed" ticket category. Support condition: data infrastructure investment must be tracked as an explicit dependency before commitment.
- **Option C: Late-Stage Deal Roadmap Gap Alert (CRM-integrated)** — supported by Sales Representative; Sales willing to concede if Slot 1 (win/loss aggregation) is committed and CRM-integrated. PDM notes this is dependent on win/loss data that doesn't yet exist.
- **Decision needed from:** VP Product / CPO, with Engineering input on H2 feasibility and infrastructure cost for each option.

---

## 2. Inputs Needed (by role)

**Sales Representative**
- Win/loss data from the last two quarters mapped to specific product gaps (anecdotes exist; structured artifact does not)
- Committed roadmap dates sharable with customers (not directional)

**Product Manager (PDM)**
- Engineering effort estimates with confidence ranges for the top 20 backlog items
- Win/loss reasons mapped to named customers and specific product gaps (same need as Sales)
- PDM defect prioritization SLA list (to unblock Support's escalation triage loop)

**Marketing Manager**
- Roadmap dates with launch-grade confidence (not "directional")
- Customer reference willingness and current CSAT per account (for reference-matching agent)

**Support Lead**
- Defect prioritization SLA from PDM (to give customers accurate status via self-service agent)
- Ticket deflection baseline metrics from current system (to measure agent-driven improvement)

**Services Lead**
- API specs and integration contracts for H2 roadmap items (90 days before GA)
- Customer environment questionnaire data collected pre-close by Sales

---

## 3. Outputs Produced (by role)

**Sales Representative**
- Booked revenue, signed contracts
- Win/loss reasons with named-account and product-gap attribution (currently informal; needs formalization)
- Feature requests with named-account justification
- Customer environment questionnaire (proposed; not current practice)

**Product Manager (PDM)**
- Roadmap (now / next / later)
- PRDs and feature specs with acceptance criteria
- Prioritization rationale and scorecard
- Defect prioritization SLA list (owed to Support)

**Marketing Manager**
- Positioning and messaging frameworks
- Launch plans and campaign briefs
- Sales enablement: decks, battle cards, one-pagers
- Analyst briefings

**Support Lead**
- Top-N issues report (weekly / monthly)
- Customer escalations to PDM and Engineering
- Knowledge base articles and runbooks
- CSAT / NPS / volume dashboards
- Runbook readiness signal (gate for Marketing's AI-generated positioning)

**Services Lead**
- Implementation plans and statements of work
- Configuration guides and reference architectures
- Deployment runbooks (currently manual; target of runbook generation agent)
- Lessons-learned and reusable assets

---

## 4. Cross-Functional Dependencies

- **Win/loss structured data** — produced by Sales / Sales Operations — consumed by PDM (prioritization scorecard), Marketing (competitive positioning), Sales (CRM deal-gap alerts)
- **PRD (finalized)** — produced by PDM — consumed by Marketing (positioning draft agent), Services (implementation plan agent), Support (runbook authoring)
- **Defect prioritization SLA list** — produced by PDM — consumed by Support (escalation triage, self-service status agent)
- **Runbook readiness signal** — produced by Support Lead — consumed by Marketing (gate for external publication of AI-generated positioning)
- **Customer environment questionnaire (pre-close)** — produced by Sales — consumed by Services (implementation planning, drift detection configuration)
- **API specs (H2 roadmap items, 90 days before GA)** — produced by PDM / Engineering — consumed by Services (implementation plan generation, runbook agent training)
- **CSAT / reference-willingness data** — produced by Support / Customer Success — consumed by Marketing (reference-matching agent)

---

## 5. Conflicts and Misalignments

| Conflict | Personas | Round 4 status |
|---|---|---|
| Deal-urgency routing into roadmap backlog | Sales (wants near-real-time gap alerts) vs. PDM (won't accept unfiltered signals) | Deferred — triage owner and SLA still undefined; Slot 1 partially addresses it |
| Readiness gate for AI-generated marketing content | Marketing (PRD-final) vs. Support (runbook required before external use) | Resolved in principle — draft circulates internally at PRD-final; nothing external before Support signs off |
| Self-service deflection agent as launch asset | Marketing (wants to co-brand it) vs. Support (no performance data yet) | Deferred — Support holds the gate until deflection metrics are available |
| Data fragmentation blocks multiple agents | PDM (scope-creep agent) and Services (planning agent) — no mandate or budget to fix | Unresolved — no owner named in the room |
| Pre-close environment data collection | Services (needs topology pre-close) vs. Sales (doesn't currently collect it) | Unresolved — unclear whether this is a Sales process change, a product feature, or a services expansion |
| Escalation triage ownership | Support (will do first review) vs. PDM (needs a committed SLA) | Partially resolved — Support owns triage gate; PDM agrees to 48-hour SLA; RACI not yet documented |

---

## 6. Open Questions

- **Who owns the production of structured win/loss data?** — Raised by PDM and Sales; Sales Operations is the likely answer but was not in the room; no one committed.
- **Who builds, hosts, and maintains the AI Agents?** — Raised implicitly by all personas; Engineering is not in the room; no infrastructure budget or headcount was named. Raised by Services Lead.
- **What qualifies a roadmap date as "customer-shareable"?** — Raised by Sales and Marketing; PDM owns the roadmap but the threshold for "launch-grade confidence" was never defined. Raised by Marketing Manager.
- **Will customers accept a pre-close environment questionnaire as part of the sales process?** — Raised by Services Lead; Sales did not confirm. May require a product-level solution (in-product environment discovery) rather than a form.
- **What is the false positive rate of the ticket escalation threshold (15 tickets / 7 days)?** — Raised by PDM in Round 2; Support acknowledged the need for data but didn't produce it in session. PDM needs this to commit to the escalation SLA.
- **Does an LLM reading a PRD produce usable positioning, or mostly rework?** — Raised implicitly by the Marketing-Support exchange; no one has prototyped this. The assumption that it "compresses timelines" has not been validated.

---

## 7. Risks

**From Round 4:**
- Win/loss aggregation agent degrades to noise if data collection isn't formalized first (Requirement 1)
- Competitive intelligence licensing costs could be prohibitive for analyst content (Requirement 3)
- AI-generated positioning may require significant rework, adding revision cycles rather than compressing them (Requirement 4)
- Ticket escalation false positive rate not yet measured; threshold needs tuning before go-live (Requirement 2)

**Structural risks across the workshop:**
- **No Engineering voice in the room.** Feasibility of every requirement, infrastructure cost, and H2 delivery timing is unverified. The top 5 list could collapse entirely when Engineering reviews it.
- **No Customer Success voice in the room.** Reference willingness and customer health data (needed for Marketing's reference-matching agent) has no confirmed owner.
- **All agents assume clean, unified data sources that don't currently exist.** Win/loss data is unstructured. Backlog lives in multiple tools. Customer environments are not inventoried pre-close. Data governance is a prerequisite for at least three of the five requirements.
- **Agent operations are unbudgeted.** No persona owns the cost of building, running, or retraining the agents. If this surfaces after the roadmap is committed, it will knock items off.
- **Slot 5 is genuinely contested.** Three competing requirements are viable; picking without Engineering feasibility input is a coin flip.

---

## 8. Next Steps

| Action | Owner | Timeframe |
|---|---|---|
| Formalize win/loss data collection process; assign to Sales Operations | VP Sales / Sales Operations | This sprint |
| Produce defect prioritization SLA list (top 10 open defects) | Product Manager (PDM) | This week |
| Document escalation triage RACI (Support owns first review; PDM 48-hour SLA) | Support Lead + PDM | This week |
| Bring Engineering into the conversation: feasibility review of all 5 requirements, H2 capacity assessment | PDM | Next sprint |
| Define "launch-grade confidence" threshold for customer-shareable roadmap dates | PDM + Sales | Next sprint |
| Prototype AI-generated positioning draft from an existing PRD; evaluate rework rate | Marketing Manager | Next sprint |
| Resolve Slot 5 (contested): present Options A/B/C with Engineering feasibility data to VP Product / CPO | PDM + Engineering | Next sprint |
| Establish data governance owner for backlog tool fragmentation | PDM / Engineering | Next quarter |
| Define pre-close environment questionnaire requirements; decide: Sales process change or product feature | Sales + Services + PDM | Next sprint |
| Identify budget and headcount for agent infrastructure and operations | PDM + Finance (not in room) | Next quarter |

---

## 9. Moderator Notes (out-of-character)

**Where the simulation felt genuinely useful:** The data fragmentation finding is the most useful output of this run. Every persona independently converged on the same blocker — win/loss data, backlog state, environment topology — and none of them currently own it. A real workshop would have glossed over this because each team assumed another team had it. The simulation made the gap structurally visible because each persona was forced to name their missing input in round 1, and the cross-examination surfaced the dependency chain.

The Slot 5 contestation is also valuable: three legitimate requirements (runbook generation, deflection agent, deal-gap alert) are competing for one slot, and the right answer is genuinely unclear without Engineering. Marking it CONTESTED rather than picking a winner preserves the decision for the people who have the data.

**Where the simulation felt thin:** The competitive PC market context is generic. With a real project brief — specific competitors, named commercial verticals, actual product capabilities — the Sales and Marketing personas would have been sharper and the contested slot would have had clearer tradeoffs. The "AI Agents for the roadmap process" topic is meta enough that the dialogue stayed somewhat abstract; a more concrete topic (e.g., "AI Agents for a specific workflow like fleet deployment or lifecycle management") would have produced more specific requirements.

**What would have improved this run:** Engineering Lead is the most critical missing voice — every requirement lands on an unverified feasibility assumption. Customer Success (reference data, health scores) and Sales Operations (win/loss data) were both implied but absent. A follow-on run adding Team C (Feasibility) to pressure-test the top 5 against engineering constraints would meaningfully strengthen the output.

--- end of round 5 — synthesis complete ---
