# Round 3 — Gap Surfacing

*Hermes moderating.*

## 1. Missing Inputs

| Persona | Input they need | Why they can't move without it | Likely owner |
|---|---|---|---|
| Sales Representative | Q1 win/loss data by competitor and deal size | Can't identify which agent use cases map to real loss reasons vs. gut feel | PDM / Sales Ops |
| Sales Representative | Product telemetry showing feature usage by account | Pipeline risk scoring agent is incoherent without usage signals | PDM / Engineering |
| Product Manager (PDM) | Engineering effort estimates with confidence ranges for top 20 backlog items | Can't make prioritization tradeoffs on agent proposals without the cost side | Engineering (not in room) |
| Product Manager (PDM) | Support ticket volume breakdown showing whether customer-to-roadmap traceability appears in top 10 issue categories | PDM's acceptance threshold for Sales' traceability agent depends on this | Support Lead |
| Marketing Manager | Roadmap items with firm, launch-grade dates | Can't build analyst briefing calendar or launch campaign plan | PDM |
| Marketing Manager | Competitive intelligence on what Gartner / IDC are writing about AI PC roadmap tooling specifically | Agent positioning requires knowing what analysts care about right now | External (Gartner, IDC) / Marketing own |
| Support Lead | Device telemetry data from production environments | Without field logs, triage agent and anomaly detection agent are diagnosing blind | Engineering (not in room) |
| Support Lead | Defect prioritization SLA commitment from PDM for the 89 recurring Secured Core tickets | KB gap detection agent needs PDM to prioritize fixes alongside the articles | PDM |
| Services Lead | API contracts and integration specs for Q3/Q4 roadmap items | Can't estimate implementation scope for the configuration guidance agent | PDM / Engineering (not in room) |
| Services Lead | Approval process reform for SOW sign-off (internal) | Agent handles week 1 of scoping; weeks 2–3 are human and approval bottlenecks | Legal / Finance (not in room) |

---

## 2. Unresolved Conflicts

- **Sales vs. PDM — What counts as sufficient market signal?** Sales says three named accounts behind a feature request is enough to prioritize the customer-to-roadmap traceability agent. PDM refuses to treat it as anything but a sales signal until ticket volume or win/loss data validates wider demand. The decision — which threshold unlocks roadmap commitment — has not been made.
- **Marketing vs. Support — Campaign velocity vs. queue capacity.** Marketing's demand-gen content personalization agent is designed to accelerate launches. Support has demonstrated that prior launches without coordination produced 43-ticket spikes. Both acknowledged the gap; neither defined who owns the "launch risk review" step or whether it's a gate or a notification.
- **Services vs. PDM — Configuration guidance agent is unscoped because the configuration surface is undefined.** PDM acknowledged the API spec needed to scope the configuration agent doesn't exist yet. Services can't build or estimate without it. The agent is effectively blocked until a PDM deliverable that isn't resourced gets done.
- **Support vs. Marketing — Demoability vs. operational urgency for KB/anomaly agents.** Marketing wants to combine the KB gap and anomaly detection agents into a "proactive support platform" narrative that can be demoed. Support will accept marketing help to get it prioritized but refuses to let narrative drive scope. What the agent actually does in v1 — internal operational tool vs. customer-visible feature — has not been agreed.
- **Sales vs. Support — Feature quality as a precondition for the expansion traceability agent.** Support argued that an agent alerting Sales to expansion opportunities is misleading if the shipped feature has no observability. Sales agreed on the principle but did not agree to any quality gate on the agent itself. The question of what "shipped" means to the traceability agent (date, or date plus runbook) is unresolved.
- **Services vs. Sales — SOW scoping timeline.** Services can commit to two weeks with the agent handling week one; one week requires fixing internal approvals, which is outside the room. Sales needs one week to compete with rivals on deal velocity. The gap is real and no one in this room has authority to fix it.

---

## 3. Unclear Ownership

- **Win/loss analysis and the data that feeds it** — currently unclear: Sales thinks it's Sales Ops; PDM thinks win/loss analysis is an input they need from Sales; no one owns the clean dataset the pipeline risk scoring agent would require. All three assume someone else is maintaining the source of truth.
- **The "launch risk review" step before campaigns go live** — currently unclear: Marketing acknowledged needing a review gate that flags Support; Support wants the notification but didn't claim ownership. Neither persona has this on their deliverables list and there's no named process.
- **Runbook and observability requirements for new features before GA** — currently unclear: Support says "don't ship it until we have a runbook" and treats runbook authoring as their responsibility, but they've said they need pre-GA access to write it. PDM hasn't committed to a process. Engineering isn't in the room. The approval chain for feature readiness has no named owner in this conversation.
- **API spec documentation for customer-facing features** — currently unclear: Services needs it, PDM produces it, Engineering generates the underlying contract. The sequence and timing are assumed differently by PDM (it exists "eventually") and Services (it needs to exist before scoping, which is before GA).

---

## 4. Hidden Assumptions

- **Sales is assuming product telemetry is accessible and granular enough** to power a pipeline risk scoring agent by account. PDM and Services have not confirmed this — the telemetry architecture is unknown to Sales, and Engineering (not in the room) may have access controls or data-residency constraints that make per-account usage data unavailable for agent use.
- **Marketing is assuming the roadmap dates it needs will stabilize enough to plan a 6-month launch calendar.** PDM has not made that commitment and has explicitly said dates move. The content personalization agent's ROI case depends on predictable launch timing; if dates slip, the agent produces content for a launch that doesn't happen.
- **PDM is assuming the interview synthesis agent can access structured transcript data.** Customer interview transcripts may live in Gong, Zoom, or a mix of tools with varying API access, transcription quality, and consent/privacy requirements depending on customer jurisdiction. None of that has been checked.
- **Support is assuming the anomaly detection agent can correlate release events with ticket spikes deterministically.** If release events (firmware updates, driver pushes, feature flags) are not logged in a structured system that the agent can query, the correlation is noise. The existence of a reliable release event log is an assumption, not a confirmed input.
- **Services is assuming the SOW generation agent's outputs would be accepted by Legal and Finance without significant revision.** A draft SOW from an AI agent is only valuable if the downstream approval step trusts it enough to accelerate. If Legal requires a human-authored document, the agent draft adds a review step rather than removing one — and net cycle time could increase.
- **All personas are assuming these agents are standalone tools.** The actual implementation may require a shared agent infrastructure (authentication, logging, data access governance, audit trails) that has a fixed cost regardless of which agents ship first. No one has named that shared dependency.

--- end of round 3 ---
