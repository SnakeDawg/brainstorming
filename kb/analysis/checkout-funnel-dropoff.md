# Checkout funnel drop-off

- **Status:** done
- **Owner:** @SnakeDawg
- **Date:** 2026-06-10
- **Source:** —

*(Sample document — replace with real analysis.)*

## What we looked at

Funnel completion across the four checkout steps for May 2026, segmented by
device type.

## What the data shows

| Step | Desktop completion | Mobile completion |
|---|---|---|
| Cart → Address | 92% | 88% |
| Address → Payment | 85% | 61% |
| Payment → Review | 96% | 94% |
| Review → Done | 98% | 97% |

The mobile Address → Payment step loses a third of users — far worse than any
other step on either device.

## Interpretation

The payment form renders below the fold on mobile and the page takes 4.1s
(p75) to become interactive. Users likely perceive the page as broken and
leave. This supports strategy objective **O3** (perceived performance) in the
[2026 Customer Portal Strategy](../strategy/2026-customer-portal-strategy.md).

## Follow-up

- Roadmap item "Billing page p75 load time under 2s" —
  [Customer Portal Roadmap](../roadmaps/customer-portal-roadmap.md)
