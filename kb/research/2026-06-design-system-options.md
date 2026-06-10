# Design system options for the portal front end

- **Status:** done
- **Owner:** @SnakeDawg
- **Date:** 2026-06-10
- **Source:** —

*(Sample document — replace with real research.)*

## Question

Should the portal front end adopt an off-the-shelf design system, or extend
the existing in-house component library?

## Context

The portal roadmap ([Customer Portal Roadmap](../roadmaps/customer-portal-roadmap.md))
includes several new flows in 2026. Component inconsistency is already slowing
front-end work and producing visual drift between pages.

## Findings

- The in-house library covers ~60% of needed components; the gaps are mostly
  in forms and data tables — exactly where the new flows live.
- An off-the-shelf system would replace working code and force a visual
  migration across every existing page.
- A hybrid is viable: keep the in-house library as the source of truth and
  backfill the form/table gaps using a headless component library underneath.

## Recommendation

Hybrid approach. Captured as a decision in
[0001 — sample decision record](../decisions/0001-use-github-for-knowledge-management.md)'s
format; the actual design-system decision should get its own record when made.
