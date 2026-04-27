# Round 2 — Cross-Examination

---

**Sales Representative → PDM** *(deal-driven vs. roadmap-driven)*

**Sales Representative:** "What problem are we actually solving" — I'll tell you exactly what problem: I have GlobalTech at $780K, they're 45 days from contract signature, and their CIO asked me point-blank last week whether our roadmap planning process uses AI to incorporate customer voice. I told them we're working on it. That was a lie. So the feature-request aggregation agent I named — that's not a nice-to-have, that's a retention and expansion play with three named accounts behind it. Who else needs this besides GlobalTech? I can give you BrightPath Financial and Meridian Manufacturing before I finish my coffee. What does this displace? Whatever's below it on the priority list, that's what.

**Product Manager (PDM):** I hear you, and I don't disagree that customer-to-roadmap traceability is real. But let me push back on the framing. Three named accounts is not a market signal — that's a sales signal. If I prioritize based on who's loudest in your pipeline right now, I'm going to build a feature that serves three enterprise deals and creates a maintenance burden for the next four years. What I need is: how many of the 340 items in the backlog are customer-facing roadmap-traceability asks, and what's the ticket volume behind them? I don't have that breakdown. If Support confirms this shows up in the top 10 issue categories, I can make a case for it. Until then, I can't commit — but I'm not saying no. We can ship a thin slice and validate.

---

**PDM → Sales** *(market-scope vs. deal-scope)*

**Product Manager (PDM):** Your pipeline risk scoring agent — I want to understand who else needs this besides your team. Because if I read what you're describing, it's an agent that watches your Salesforce activity and flags at-risk deals. That's a sales ops tool, not a product roadmap tool. What does this displace from the roadmap? I'm not being difficult; I need to know whether we're building product capabilities or internal sales tooling, because those have completely different engineering owners, timelines, and approval paths.

**Sales Representative:** Why are we making this so complicated? The agent needs to read call transcripts, which live in Gong. It needs to pull deal stage data from Salesforce. It needs to know which product features a customer is using — that's product telemetry you own. You're telling me a tool that ingests product usage data to predict deal outcomes isn't a product problem? Every renewal in our existing base is a product problem if the customer isn't using what they paid for. There's $4.7M on the table if we can show churn risk signals from usage data. And yes, there's $4.7M at risk if we can't.

---

**Support Lead → Marketing** *(reliability vs. launch story)*

**Support Lead:** I want to ask about the demand-gen content personalization agent. You said it would triple campaign velocity. Last quarter Marketing launched the AI PC Copilot campaign and drove a 300% spike in trial signups — and we had no warning. We've had 43 tickets in the last 30 days on that campaign alone, mostly from trial users hitting configuration issues the campaign copy didn't mention. If you triple campaign velocity with an agent and nobody tells us what's going out the door, I'm going to need to triple my support headcount. How does that agent coordinate with the support queue?

**Marketing Manager:** That's a fair hit and I'm not going to dodge it. The Copilot campaign communication breakdown was real — you didn't know it was coming, we didn't loop you in, and the ticket spike was predictable in hindsight. What I'd actually push for is that the content personalization agent has a review step that flags support for volume risk before a campaign goes live. That's a workflow design decision, not a reason to not build the agent. But you're raising something I hadn't thought about — if the agent generates content at scale, the review surface grows. Analysts are going to ask about this too. "Can we demo this?" needs to include the support handshake, not just the marketing output.

---

**Services Lead → PDM** *(deployable vs. demoable)*

**Services Lead:** Your backlog prioritization scoring agent — I want to understand the deployment architecture. You said it pulls live signals from Jira, Salesforce, and your analytics platform. Which analytics platform? Because we have four customer segments running three different analytics stacks, and if this agent needs to be deployed in a customer-facing context — for example, to help a customer's IT team understand how their usage is influencing the roadmap — the integration complexity is not trivial. Is this an internal tool or does it touch customer environments? That question answers whether we can scope it in a sprint or in a quarter.

**Product Manager (PDM):** That's a good constraint I hadn't fully articulated. For the backlog prioritization agent, I was thinking internal-only — it's pulling signals to help me prioritize, not surfacing anything to customers. So the analytics platform in question is our internal product telemetry system, not anything customer-facing. That should simplify the deployment significantly. But your second agent — the configuration guidance one — that's the one I'm worried about from a scope perspective. If we build an agent that walks customers through configuration in their environment, we need to define the configuration surface first, and that's a PDM deliverable I don't have resourced yet. So we need the API spec before either of us can size that one.

---

**Marketing → Support** *(launch story vs. ticket queue)*

**Marketing Manager:** Your KB gap detection agent — what's the customer-facing hook? I'm asking because if we want this on the roadmap, someone needs to write the positioning for it. "We use AI to detect when our documentation is missing" isn't a story I can put in front of Gartner. But "AI-powered proactive support that flags issues before customers call" — that's a story. Is there a way to frame the anomaly detection agent and the KB agent together as a proactive support platform? Because that has a launch moment. I need something I can demo.

**Support Lead:** This is plumbing — what's the customer-facing hook. I know exactly what that phrase means and I want to be direct: I don't care about the launch story right now. We've had 89 tickets in 30 days on one configuration flow. The customer experience is broken and CSAT reflects it. The KB agent's job is to fix that. If Marketing wants to build a narrative around it afterward, that's fine — but I'm not redesigning the tool for demoability. Fix the existing thing first. What I will say is: if Marketing helps me get it prioritized on the roadmap by building a story around it, I'll take the win. Just don't let the story drive the scope.

---

**Sales → Services** *(close-the-deal vs. implementable)*

**Sales Representative:** Three weeks to scope an SOW. I need you to sit with that number for a second. I've lost two deals this quarter — Apex Systems and Redrock Energy — where the prospect was ready to sign and then went dark during the scoping phase. I found out later they went with a competitor who came back with a scope document in five days. I need an answer by Friday or this deal walks — that's not a figure of speech, that's what happened at Redrock. If the SOW generation agent cuts scoping from three weeks to one week, it's worth more to me than any feature on the roadmap. Can we get that to two weeks on the way to one?

**Services Lead:** I understand what Redrock cost and I don't dismiss it. But I want to be accurate about what's driving the three weeks, because an AI agent won't fix all of it. One week is discovery and requirements gathering — that's the part an agent can help with. One week is environment mapping, which requires human review of the customer's network diagrams and security policies — an agent can draft the questionnaire but a human has to validate the answers. And one week is internal approvals, pricing sign-off, and legal review — the agent doesn't touch that at all. I can get us to two weeks with the agent handling week one. Getting to one week means fixing the approval process, not just the scoping. Every customer is becoming a snowflake, and part of that is internal, not just customer complexity.

---

**Support → Sales** *(reliability vs. deal promises)* *(moderator-added exchange)*

**Support Lead:** I want to flag something that came up in your round 1 position — the feature request aggregation agent that tells you when customer requests ship. That sounds good until you consider what happens when I have tickets from the same customers whose requests are on the roadmap, but the feature ships broken. Right now we have Ticket #9847 from BrightPath Financial, and separately BrightPath's feature request for enhanced AD group policy configuration is marked "shipping Q3" in the roadmap tracker. If that feature ships with the same observability gaps as the last three features — no logs, no error codes — I'll spend the next quarter fielding escalations from a customer your agent just told you is a happy expansion target. Don't ship it until we have a runbook.

**Sales Representative:** I hear you, and BrightPath is a real example that landed. But I want to be clear about what I'm asking for: the agent tells me when something ships and lets me book the expansion call. If the feature is broken on GA, that's a product quality issue, not an agent design issue. The answer is not to not build the traceability agent — the answer is to not ship broken features. I agree with your point. I just don't want it to become a reason to deprioritize the one tool that would actually help me farm expansion revenue.

---

## Tensions still on the table

- **Sales deal scope vs. PDM market scope** — Sales wants AI agents that serve named accounts in active pipeline; PDM will not prioritize without evidence the problem extends beyond three customers. No resolution reached on what counts as sufficient market signal.
- **Marketing campaign velocity vs. Support ticket capacity** — Tripling campaign output without coordinated support flagging is a structural risk both parties acknowledged, but no workflow solution was agreed.
- **Internal tooling vs. product-surface questions** — Services raised whether agents are internal or customer-facing, and got a partial answer from PDM (backlog prioritization = internal), but the configuration guidance agent remains unscoped.
- **SOW scoping speed** — Services correctly identified that an agent can cut one of three weeks; the approval process bottleneck (week three) requires a separate fix that nobody in this room owns.
- **KB/anomaly agent demoability vs. operational urgency** — Marketing wants a launch story; Support doesn't care about the story and will resist scope changes that serve marketing over operations. Neither conceded.
- **Feature shipping quality vs. agent-enabled upsell** — Support's point that expansion signals from a traceability agent are premature if features ship broken was acknowledged by Sales but not resolved — the roadmap quality standard needed to make the agent trustworthy is undefined.

--- end of round 2 ---
