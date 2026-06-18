# Round 4 — Convergence

**Hermes:** Alright. We have 11 agent proposals on the table and we need to leave this room with the top 5. I'm not going to let us boil the ocean. Let me put a forcing structure on this: we have one hour. The question is which five agents, if resourced for next year's commercial PC roadmap cycle, produce the most cross-functional impact and the clearest return. Start your engines.

**Sales Representative:** I'll anchor. The traceability agent — customer-to-roadmap — needs to be on the list. I have three accounts ready to reference it in a case study if it ships. That's marketing value, PDM validation, and my expansion number in one tool. I'm not trading it for the pipeline risk scoring agent; if I had to pick one, I pick traceability. I'll drop pipeline risk scoring.

**Product Manager (PDM):** I'll take that concession. Traceability in — pipeline risk out. But I want something from you in return. The backlog prioritization scoring agent is the only tool in this room that makes me better at my job of not being wrong about the roadmap. If I can show a defensible ranked list when you challenge me in a pipeline review, you get fewer "we're considering it" answers, because I have data. I'm putting it on the list. What comes off? I'll trade roadmap narrative generation — that one's a nice-to-have for me. I can live without it.

**Marketing Manager:** Wait. Before we lose roadmap narrative generation entirely — that agent is how I get launch-grade dates in a format I can put in front of analysts. If PDM drops it, I need something else that gives me positioning material. I'll accept losing it from the top 5 if the competitive intelligence / differentiation agent makes the list. That one I cannot give up. It's the only agent in this room that directly enables the launch story, and it overlaps with what Sales needs for battle cards. That's two birds.

**Sales Representative:** Agreed. Competitive intelligence agent stays. That's one I'd have named myself — Lenovo already does this. Their reps get automated competitive briefs. I know because three of my accounts told me.

**Support Lead:** I'm glad you're all trading your nice-to-haves. I'd like to point out that none of you have touched the two agents that directly affect whether customers stay. Ticket triage and intelligent routing: 1,200 tickets a month, 35% misrouted. I am not leaving this room without that on the list. And I need PDM to hear this: if the triage agent doesn't get resourced, the ticket volume from next year's roadmap launches will bury whatever margin Services is trying to protect. This is already in our top 10. Every quarter I say it. Fix the existing thing first.

**Product Manager (PDM):** Ticket triage is on the list. I'm not fighting it — the volume numbers you've been sending me every month made this argument before you did in this room. It's defensible to engineering as a retention tool and to leadership as a CSAT investment. That's four: triage, traceability, backlog prioritization, competitive intelligence. One slot left.

**Services Lead:** The SOW scoping agent. I'll be brief: we lost Redrock Energy. We lose a deal every quarter because we can't turn around a scope document before the prospect goes dark. If the traceability agent helps Sales farm expansion from existing accounts, the SOW scoping agent is what gets us new accounts through the door in the first place. And it has a second-order effect — faster scoping means we have more time to write proper implementation plans, which means Services hands off to Support with better runbooks. Support benefits downstream.

**Support Lead:** I'll accept that logic. But I want Services on record: the SOW agent doesn't ship without integration documentation that lets me write a runbook for it. Who writes the runbook?

**Services Lead:** We do. That's our deliverable. I'll put it in the SOW for the SOW agent.

**Marketing Manager:** I want the KB gap detection agent in the top 5. I argued last round that it has a launch story — "AI-powered proactive support" — and I think it's a differentiator we could put in front of IDC. I'm prepared to trade the demand-gen personalization agent if the KB agent replaces it. Analysts are going to ask about our proactive support story, and right now we don't have one.

**Support Lead:** That's the right trade. I'll take the KB agent over the personalization agent every time. I don't care about the marketing angle but I'll take the prioritization it brings. However — it cannot be scoped to be demoable if demoable means customer-facing in v1. It needs to be internal first. I need that in writing, figuratively speaking.

**Marketing Manager:** Agreed. Internal v1, customer narrative in launch. I can work with that.

**Product Manager (PDM):** Wait — that's six agents. We said five. Let me force the trade: KB gap detection or SOW scoping agent. Services, you argued the SOW agent has second-order value for Support. But I'd argue the KB agent has second-order value for Sales — if customers self-resolve through the KB, that's fewer escalations blocking expansion conversations. Marketing just made the same argument. Can Services live with KB in and SOW out?

**Services Lead:** No. I cannot. We lost two deals this quarter to scope turnaround time. The KB agent is internal operational tooling that improves CSAT. The SOW agent is revenue-gating. I need you to weigh those differently.

**Sales Representative:** I'm with Services on this one. There's revenue at risk if we can't scope faster. I'll make the trade explicit: I'll publicly support the SOW scoping agent over KB gap detection if PDM agrees to backlog prioritization staying in, because that's what gives me confidence that my feature requests are actually being weighed.

**Product Manager (PDM):** We can do that — what comes off the roadmap? We have six agents and five slots. Marketing, you offered to trade personalization for KB. If KB is out, does personalization come back?

**Marketing Manager:** No. If KB is out, I take that slot for the analyst intelligence agent. Analyst coverage shapes the deals Sales walks into. It's more strategic than personalization.

**Support Lead:** I'll accept KB dropping out of the top 5 on one condition: the anomaly detection agent — ticket spike alerting on release events — is named as a dependency of the triage agent, not a separate roadmap item. It's the same system. You can scope it together or not at all. If triage ships without alerting, it's half a tool.

**Product Manager (PDM):** That's a reasonable scope note, not a new slot. Agreed — triage agent scoped to include anomaly detection as a component. That's the right call.

**Marketing Manager:** Then I'll concede the analyst intelligence agent and take demand-gen personalization out. Five agents: triage+anomaly detection, competitive intelligence, backlog prioritization, customer-to-roadmap traceability, SOW scoping. I can build a launch narrative around all five of them.

---

## Agreed Top 5 Requirements

1. **AI Agent: Ticket Triage + Anomaly Detection (Intelligent Support Operations)**
   - Rationale: 1,200 tickets/month with 35% misroute rate; plus reactive-only detection of release-related ticket spikes. An integrated agent handles routing with resolution suggestions and correlates volume spikes to release events for proactive alerting. Combined, this is the highest-volume efficiency gain available and directly improves CSAT and MTTR — the metrics that drive renewal conversations.
   - Champion: Support Lead
   - Concessions made: Support accepted that anomaly detection would not be a standalone roadmap item — scoped as a component of triage, not a separate slot. Marketing dropped the demoability requirement for v1; this ships as internal operational tooling.
   - Dependencies: Structured release event log (Engineering); device telemetry data in production (Engineering); pre-GA access for Support to write runbooks.
   - Risks: Telemetry access may be blocked by data-residency or access control constraints not yet assessed; correlation between release events and ticket spikes is only reliable if the release event log is complete and timely.

2. **AI Agent: Competitive Intelligence + Battle Card Automation**
   - Rationale: Sales reps are citing stale competitive data in enterprise demos against Lenovo, Dell, and HP; Marketing lacks real-time visibility into competitor announcements and analyst positioning. An agent that monitors competitor press, analyst publications, G2/TrustRadius, and product announcement feeds — and pushes updated battle cards into Salesforce — addresses both. Cross-functional benefit (Sales + Marketing) made this the easiest convergence of the session.
   - Champion: Marketing Manager (accepted by Sales Representative without concession)
   - Concessions made: Marketing gave up the standalone analyst intelligence agent as a separate slot; it is incorporated as a feed into this agent. Sales gave up the pipeline risk scoring agent entirely.
   - Dependencies: Competitive monitoring data feeds; Salesforce CRM write integration; analyst report access (Gartner, IDC — requires subscription or API).
   - Risks: Competitor data sources are noisy; without curation the agent produces volume over signal. Gartner data access may require a licensing negotiation outside the product roadmap.

3. **AI Agent: Backlog Prioritization Scoring**
   - Rationale: PDM manages 340-item backlog with a homegrown spreadsheet. An agent ingesting live signals from Jira, Salesforce, product telemetry, and support ticket volume produces a ranked list with confidence ranges — replacing 3 hours of weekly manual work and making prioritization defensible when challenged by Sales or Support.
   - Champion: Product Manager (PDM)
   - Concessions made: PDM gave up the roadmap narrative generation agent (second priority in round 1) to keep this on the list. PDM also committed to using the triage ticket volume as an input signal, acknowledging Support's data as a prioritization lever.
   - Dependencies: Engineering effort estimates (not in room — hard dependency); clean data access to Salesforce pipeline, Jira, and product telemetry; per-account usage data (data-residency question unresolved).
   - Risks: Without engineering estimates, the scoring model is impact-only — cost side is missing. Prioritization output is only as good as the signal quality of each integrated source.

4. **AI Agent: Customer-to-Roadmap Feature Request Traceability**
   - Rationale: Sales has 18 active accounts sending feature requests through informal channels (email, Slack, call notes) that disappear into Jira with no traceability back to the customer. PDM has no clean mechanism to show customers their input influenced the roadmap. An agent that ingests requests, deduplicates, maps to backlog items, and notifies Sales when items ship enables expansion conversations and closes a customer satisfaction loop that currently creates support tickets.
   - Champion: Sales Representative
   - Concessions made: Sales dropped the pipeline risk scoring agent to get this on the list. Sales also accepted PDM's condition that the agent's prioritization signal must be validated against broader ticket volume — not just named-account demand — before roadmap commitment.
   - Dependencies: Structured intake channel for feature requests (currently informal — process change required before the agent is useful); backlog prioritization agent (agent #3 above); Support ticket data to validate demand breadth.
   - Risks: If the feature request intake channel remains informal, the agent ingests noise. Support flagged that expansion signals are unreliable if features ship without observability — agent definition of "shipped" must include runbook readiness, not just GA date.

5. **AI Agent: Implementation Scoping + SOW Generation**
   - Rationale: Services loses 2+ enterprise deals per quarter to scoping turnaround time (3 weeks vs. competitors' 5 days). An agent that conducts structured requirements discovery with the customer's IT lead, maps the environment against reference architectures, and produces a draft SOW handles the first of three weeks. Second-order benefit: better scoped implementations produce better runbook handoffs to Support.
   - Champion: Services Lead
   - Concessions made: Services accepted that the agent addresses only week 1 of 3 in the scoping process; weeks 2–3 (environment validation and internal approvals) require process reform outside the room. Services committed to owning the runbook for the SOW agent itself.
   - Dependencies: Reference architecture library (Services owns); approval process reform with Legal/Finance (outside room); structured customer environment questionnaire (Services deliverable).
   - Risks: Legal and Finance may not trust agent-generated SOW drafts, adding a review step rather than removing one. Approved scope depends on humans outside this team.

--- end of round 4 ---
