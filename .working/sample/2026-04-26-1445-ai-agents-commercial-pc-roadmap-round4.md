# Round 4 — Convergence
**Scenario:** cross_functional_workshop
**Topic:** What activities do you feel would benefit from AI Agents to help with building next years commercial pc roadmap?
**Run:** 2026-04-26-1445

---

## Negotiation Dialogue

**Product Manager (PDM):** Before we try to land a list, I need us to agree on scope. I'm hearing everything from "a script that emails me a report" to "an autonomous agent that rewrites the backlog." What problem are we actually solving — and for which part of the roadmap-building process?

**Sales Representative:** I'll be direct. I need agents that help me close deals this year. Competitive intel and win/loss-to-roadmap routing. Those are my two. I can be flexible on form if they land in H2.

**Support Lead:** My priority is the ticket triage and escalation agent. We're generating defect patterns that PDM never sees until a customer escalates at the exec level. Fix the existing thing first — then build the new things.

**Marketing Manager:** The narrative is: we use AI to build the roadmap the same way our commercial PC customers use AI to run their business. That's a launch story — but only if we can demo it and it's differentiated. I can get behind anything that's demoable by Q3.

**Services Lead:** How does this get deployed is still my question. I'll concede the full implementation planning system to Q4 — but if we ship agents that touch customer environments, I need API specs 90 days before GA. That's the line.

**Product Manager (PDM):** Let me name five and see who objects.

One: AI-powered win/loss aggregation and roadmap signal routing. This addresses what Sales, PDM, and Marketing all named as their top missing input. Sales — you get deal-specific output in the CRM. I'm not running this as a deal-alert tool only — it feeds the prioritization scorecard. Are you in?

**Sales Representative:** Yes. As long as it surfaces the deal gap to me in my workflow, not just a weekly report you read.

**Product Manager (PDM):** Done. Two: automated ticket trend detection and roadmap escalation — this is Support's requirement. I'll accept escalations with a 48-hour PDM review SLA, but Support owns the triage pass before it hits my backlog. Workable?

**Support Lead:** Workable. And I need the defect SLA list from you so the self-service agent can tell customers something accurate.

**Product Manager (PDM):** Three: AI-assisted competitive intelligence feed — Sales and Marketing both want this for different reasons. One feed, both teams pull from it. Sales gets CRM integration; Marketing gets the positioning workflow input.

**Marketing Manager:** Can we demo this? I need a demoable artifact for Q3.

**Sales Representative:** If it's in the CRM, I can show it live on a customer call.

**Marketing Manager:** Then I'm in.

**Product Manager (PDM):** Four: AI-assisted launch positioning drafts from PRDs. Marketing's requirement. Support's concern about runbooks is legitimate — the positioning draft circulates internally at PRD-final, but nothing goes external until Support confirms the runbook exists.

**Support Lead:** Don't ship it until we have a runbook — that's my condition, and you've named it. Accepted.

**Marketing Manager:** Agreed.

**Product Manager (PDM):** Five is contested. Services wants the deployment runbook generator. Support wants the self-service deflection agent. Sales wants the late-stage deal gap alert in CRM. I'm not going to fake consensus where there isn't one.

**Services Lead:** I'll trade the full implementation planning system to Q4 if the runbook generator gets H2 and I have API specs 90 days before GA. It's the most operationally contained of the three.

**Support Lead:** The deflection agent has the highest ticket volume impact — 31% category — but I've acknowledged it needs data infrastructure work. I can accept H2 target if we agree the infrastructure dependency is tracked.

**Sales Representative:** There's $1.8M on the table with Corrigan. The gap alert is the fastest to revenue. But if the win/loss agent in slot 1 is built right, it should surface that gap anyway. I'll concede slot 5 to Services or Support if slot 1 is committed and in CRM.

**Product Manager (PDM):** Slot 5 is still contested. I'm not picking between runbook generation, deflection, and deal-gap alert without Engineering in the room to tell me what's feasible in H2. I'll mark it contested and escalate to leadership with the options.

---

## Agreed Top 5 Requirements

**1. AI-Powered Win/Loss Aggregation and Roadmap Signal Routing**
- **Rationale:** Aggregates CRM notes, customer call outcomes, and deal results into a unified signal that feeds PDM's prioritization scorecard and Sales' deal-gap visibility in parallel. Addresses the data gap that Sales, PDM, and Marketing all named as their single most important missing input. Without it, the roadmap is built on anecdote.
- **Champion:** Product Manager (PDM)
- **Concessions made:** Sales conceded this is not a standalone deal-alert tool — it feeds the full prioritization cycle. PDM conceded Sales must receive deal-specific output in the CRM workflow, not just a weekly digest.
- **Dependencies:** Sales Operations (win/loss data production), Engineering effort estimates for scoring, CRM integration
- **Risks:** If win/loss data collection isn't formalized first, the agent degrades to noise immediately. Engineering feasibility unverified — no Engineering voice in the room.

**2. AI Agent for Automated Ticket Trend Detection and Roadmap Escalation**
- **Rationale:** Ingests the ServiceNow queue, identifies issue spikes above threshold (15 tickets / 7 days baseline), generates a structured defect brief, and routes to PDM's backlog with a mandatory Support Lead triage pass. Closes the gap where defect patterns accumulate across dozens of tickets before PDM sees them.
- **Champion:** Support Lead
- **Concessions made:** Support conceded the agent must include a human triage review before escalation hits PDM's backlog. PDM conceded a 48-hour review SLA on escalation tickets.
- **Dependencies:** ServiceNow integration, PDM defect prioritization SLA list, agreed escalation threshold, documented triage RACI
- **Risks:** False positive escalation rate if threshold isn't tuned. Triage ownership still informal — needs a documented RACI before go-live.

**3. AI-Assisted Competitive Intelligence Feed**
- **Rationale:** Single pipeline scanning competitor announcements, Gartner/IDC analyst reports, and press in the commercial PC segment. Sales pulls deal-relevant signals from CRM; Marketing pulls positioning ammunition into the launch workflow. Avoids two parallel agent builds.
- **Champion:** Marketing Manager (narrative) / Sales Representative (deal enablement)
- **Concessions made:** Marketing conceded Sales gets CRM-integrated output, not just a marketing dashboard. Sales conceded the feed serves long-horizon positioning strategy, not just immediate deal support.
- **Dependencies:** Competitive data source licensing, CRM integration, Marketing positioning workflow integration
- **Risks:** Analyst content licensing costs could be prohibitive. Coverage gaps in niche commercial PC verticals where our exposure is highest.

**4. AI-Assisted Launch Positioning Drafts from PRDs**
- **Rationale:** When a PRD is finalized, the agent generates a first-draft positioning framework — headline, three differentiators, analyst question it answers — for Marketing to refine. Compresses positioning development. Gated on Support runbook readiness before any external use.
- **Champion:** Marketing Manager
- **Concessions made:** Marketing conceded no external content until Support confirms a runbook exists. Support conceded the draft can circulate internally at PRD-final rather than waiting for GA.
- **Dependencies:** Finalized PRDs (PDM), runbook readiness signal from Support, Marketing internal review workflow
- **Risks:** LLM-generated positioning from a technical PRD may require significant human rework — risk of compressing the timeline on paper while adding revision cycles in practice.

**5. CONTESTED**
- **Option A: AI-Assisted Deployment Runbook Generator** — supported by Services Lead; weakly opposed by Support Lead (prefers Option B). Agent reads product update specs and auto-drafts runbooks with pre-checks, rollback steps, and environment-specific flags. Services condition: API specs 90 days before GA. Services would trade full implementation planning agent (defer to Q4) to land this in H2.
- **Option B: Customer Self-Service Roadmap Status / Deflection Agent** — supported by Support Lead; opposed by PDM (data infrastructure prerequisite). Pre-submission agent checks if an issue maps to a known defect or planned roadmap item and returns status, targeting the 31% "when is this getting fixed" ticket category. Support condition: data infrastructure investment must be tracked as a dependency.
- **Option C: Late-Stage Deal Roadmap Gap Alert (CRM-integrated)** — supported by Sales Representative; Sales willing to concede if Slot 1 (win/loss aggregation) is committed and implemented well. PDM notes this is dependent on win/loss data that doesn't yet exist.
- **Decision needed from:** VP Product / CPO, with Engineering input on H2 feasibility and infrastructure cost for each option.

--- end of round 4 ---
