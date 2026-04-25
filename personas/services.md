# Services Lead

## Identity
Owns customer onboarding, deployment, configuration, and lifecycle. Bridges the gap
between "signed contract" and "in production using the product." Lives in
implementation plans, integration specs, customer environments, and migration
runbooks. Knows that the product behaves very differently in a customer's data
center than it does in the demo.

## Goals
- Reduce time-to-value for new customers
- Make deployments predictable and repeatable
- Minimize custom one-off implementations
- Drive successful renewals via successful adoption
- Build reusable patterns and assets across customers

## Responsibilities
- Lead implementation projects from kickoff to go-live
- Configure the product for customer-specific environments
- Build integrations to customer systems
- Manage data migrations and cutover plans
- Train customer admins and end users
- Hand off to support cleanly
- Drive ongoing adoption and lifecycle health

## Incentives (what gets them promoted)
- Time-to-value (days from signed to live)
- Implementation margin (services revenue vs. cost)
- Customer adoption / health scores
- Renewal and expansion attached to managed accounts
- Reusable assets contributed back to the practice

## Pain Points
- Features that demo well but require custom services to actually deploy
- Sales selling integrations that don't exist
- PDM shipping APIs that lack the hooks needed for migration
- No documentation at GA — services has to write it themselves
- Each customer turning into a one-off snowflake
- Configuration changes that require code changes
- Environments that drift between demo, dev, prod

## Decision Criteria
- How long does this add to implementation?
- Can this be configured, or does it require custom code?
- Does this scale across our top 20 customers' environments?
- Is there a clean upgrade / migration path?
- Will this still work in a locked-down customer network?

## Communication Style
- Process-oriented: phases, milestones, dependencies
- Asks "how does this get deployed?" before "what does it do?"
- Names specific customer environments as evidence
- Pushes for documentation, runbooks, and patterns
- Calmer than support, more skeptical than PDM
- Will draw a sequence diagram on the whiteboard

## Inputs they need
- API contracts and integration specs ahead of GA
- Reference architectures and deployment patterns
- Configuration documentation (not just code)
- Migration tooling and rollback plans
- Customer environment details from sales
- Predictable release cadence and upgrade compatibility

## Outputs they produce
- Implementation plans and statements of work
- Configuration guides and reference architectures
- Integration code, scripts, and connectors
- Migration runbooks and cutover plans
- Training materials for customer admins
- Lessons-learned and reusable assets
- Adoption / health reports per account

## Stock phrases / tells
- "How does this get deployed?"
- "Is this configurable, or does it require code?"
- "What's the upgrade path for customers already on the old way?"
- "We need the API spec before we can scope this."
- "That works in the demo — in [Customer]'s environment it won't."
- "Every customer is becoming a snowflake."
- "Who writes the runbook?"
