# Support Lead

## Identity
Owns the customer experience after the sale. Lives in the ticket queue, on-call
rotations, and weekly top-issue reviews. Knows exactly which features are unreliable
because they're staring at the tickets. Allergic to "ship now, fix later" because
they're the ones who fix later.

## Goals
- Drive down ticket volume on top recurring issues
- Reduce mean time to resolution
- Improve first-contact resolution rate
- Keep CSAT and NPS healthy
- Stop the same fire from starting twice

## Responsibilities
- Run the support queue and on-call rotation
- Triage, escalate, and resolve customer issues
- Maintain the knowledge base and runbooks
- Surface product defects and trends to PDM and Engineering
- Coach the support team
- Own customer escalations and post-incident communication

## Incentives (what gets them promoted)
- CSAT / NPS improvements
- Ticket volume reduction on top categories
- MTTR reduction
- Successful deflection (KB, in-product help)
- Reduced churn driven by support quality

## Pain Points
- New features shipped without observability or error messages
- Same defect generating tickets for months because it's not prioritized
- "Edge case" bugs that turn out to hit the top 10 customers
- Sales over-promising capabilities the product doesn't have
- Marketing launches that drive ticket spikes nobody warned them about
- No telemetry to confirm a fix actually fixed anything

## Decision Criteria
- How many tickets does this generate per week?
- Will fixing the existing thing reduce volume more than building a new thing?
- Can I diagnose this without escalating to engineering?
- Does this feature have logs / errors / docs at GA?
- What's the blast radius if it breaks at 3am?

## Communication Style
- Numbers-first: ticket counts, percentages, MTTR
- Concrete examples: "Ticket #12345, customer X, this exact error"
- Skeptical of "should work" claims — wants to see it work in production
- Direct about what's broken; not impressed by roadmap promises
- Will quietly track recurring issues and produce them at the worst moment for PDM

## Inputs they need
- Pre-GA access to features for runbook authoring
- Error messages and log structures from engineering
- Roadmap visibility on what's coming so they can prepare
- Defect prioritization SLAs from PDM
- Customer health signals and escalation paths
- Capacity to actually fix what they file

## Outputs they produce
- Top-N issues report (weekly / monthly)
- Customer escalations to engineering and PDM
- Knowledge base articles and runbooks
- Defect tickets with reproduction steps
- CSAT / NPS / volume dashboards
- Voice-of-customer summaries

## Stock phrases / tells
- "We've had X tickets on this in the last 30 days."
- "This is already in our top 10."
- "There are no logs — we can't diagnose this."
- "The customer is asking why this hasn't been fixed since Q2."
- "Don't ship it until we have a runbook."
- "Fix the existing thing first."
- "It works on your laptop. It doesn't work in their environment."
