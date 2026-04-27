# Round 2 — Cross-Examination
**Scenario:** cross_functional_workshop
**Topic:** What activities do you feel would benefit from AI Agents to help with building next years commercial pc roadmap?
**Run:** 2026-04-26-1445

---

**Exchange 1 — Sales challenges PDM (deal-driven vs. roadmap-driven)**

**Sales Representative:** You're asking for an AI Agent that prioritizes based on segment fit and historical data — but last quarter we lost Hartwell Bank because they needed on-prem AI model inference and your "segment fit" signal said it was a niche ask. There's $2.4M in commercial PC fleet refresh on the table. When your agent says "this doesn't fit the market," what's my move?

**Product Manager (PDM):** Who else needs this besides Hartwell Bank? That's the question the agent needs to answer — and that I need to answer. If you can show me three customers who blocked on the same gap in the last six months, I can prioritize it. Give me the win/loss data you said was missing in round 1, and I'll give you the prioritization rationale. Right now I'm making roadmap calls without that data too.

---

**Exchange 2 — PDM challenges Sales (one-off vs. market)**

**Product Manager (PDM):** Your late-stage deal gap-alert requirement worries me. What stops it from becoming a feature request pipeline that routes every late-stage deal into my backlog? We can do that — what comes off the roadmap?

**Sales Representative:** I'm not asking you to build everything that gets flagged. I'm asking for visibility. Right now I'm flying blind on what's 90 days out versus 18 months out. An agent that just tells me "this gap closes in Q3" lets me decide whether to hold the deal or move on. Why are we making this so complicated?

---

**Exchange 3 — Support challenges Marketing (reliability vs. story)**

**Support Lead:** You want an AI Agent that drafts positioning from the PRD before the feature even ships. We've had 63 tickets opened against features where Marketing announced capabilities the product couldn't deliver in customer environments. The customer is asking why this hasn't been fixed since Q2. Don't ship it until we have a runbook — and that applies to AI-generated positioning too.

**Marketing Manager:** I'm not saying release the message before the product is ready. The draft circulates internally; it compresses the process so we're not writing positioning in the two weeks before launch. What's the story here — AI helps us move faster on the roadmap, or AI is a risk? Because "we can't use AI internally to draft things" is not the narrative I can take to analysts.

---

**Exchange 4 — Services challenges PDM (deployable vs. demoable)**

**Services Lead:** Your scope-creep detection agent sounds good in a roadmap doc. How does this get deployed in practice — does it read from Jira, a spreadsheet, Confluence? Our backlog currently lives in three different tools depending on which team you ask. Is this configurable, or does it require code every time the data source changes?

**Product Manager (PDM):** That's a fair constraint and I should have flagged it. What problem are we actually solving — is it the scope-creep decision, or is it the data fragmentation? If it's the latter, the agent doesn't fix it; data governance does. Let's ship a thin slice: scope-creep alerts against a single agreed backlog source, validate, then expand.

---

**Exchange 5 — Marketing challenges Support (launch hook vs. ticket queue)**

**Marketing Manager:** Your customer self-service agent — can we demo this? Because if it works the way you're describing, it's actually a story: our AI-enhanced support experience is differentiated. Analysts are going to ask about self-service deflection when we brief them on the commercial PC roadmap. This could be the launch moment for the whole AI story.

**Support Lead:** I appreciate that. But I'm not going to let this become a Marketing asset before it's a working system. Thirty-one percent of our ticket volume is "when is this getting fixed." This needs to fix that first. There are no logs on how the current deflection system performs — we can't even benchmark improvement yet. Don't sell it until it works.

---

**Exchange 6 — Sales challenges Services (close-the-deal vs. implementable)**

**Sales Representative:** I just got off a call with Corrigan Enterprises — they want to know if AI-assisted implementation planning will be available before their Q3 commercial PC refresh decision. There's $1.8M on the table. Can you give me a date I can share?

**Services Lead:** That works in the demo — in Corrigan's environment it won't without knowing their network topology and MDM stack. I need their environment profile before I can scope what the planning agent does for them. Every customer is becoming a snowflake because Sales doesn't collect environment data until after the contract is signed. Get me the questionnaire pre-close and I can give you a timeline.

---

**Exchange 7 — PDM challenges Support (data quality and triage)**

**Product Manager (PDM):** Your auto-escalation agent fires when a ticket type exceeds 15 in 7 days. Last quarter we had a spike that looked like a product defect and turned out to be one customer on an unsupported configuration. What's the false positive rate, and who triages the escalation before it lands in my backlog?

**Support Lead:** We've had X tickets on this category in the last 30 days where it was a real product defect, not a config issue — I'll pull the exact number. But you're right on triage: the agent shouldn't dump raw escalations into your backlog. The Support Lead reviews first — I own that gate. But the loop breaks down if I don't have your defect prioritization SLA, which I flagged in round 1 as missing.

---

## Tensions still on the table

- **Deal urgency vs. roadmap scope discipline** — Sales wants AI gap-alert agents routing deal-blocking requirements to PDM in near-real-time; PDM won't accept unfiltered deal signals into the backlog without a triage owner and a prioritization SLA.
- **Launch speed vs. support readiness** — Marketing wants AI-assisted positioning drafts in the launch workflow before features ship; Support won't endorse external claims before runbooks exist.
- **Demo vs. proven performance** — Marketing sees the self-service deflection agent as a launch asset; Support refuses to position it until it demonstrates measurable deflection improvement.
- **Data fragmentation blocks multiple agents** — Services and PDM both surfaced that the backlog, customer environment data, and win/loss signals live in fragmented systems; agents depending on clean, unified data sources may be blocked before they start.
- **Win/loss data ownership gap** — Sales, PDM, and Marketing all need win/loss analysis mapped to specific product gaps; no one in the room owns producing that data.
- **Pre-close environment data collection** — Services cannot scope AI-assisted implementation plans without customer environment topology that Sales isn't collecting before contract close.

--- end of round 2 ---
