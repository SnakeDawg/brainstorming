# Research references

Bibliography for all external sources cited across the scaffold's SKILL.md
and AGENT.md files. When prose mentions a concept by name, link here rather
than repeating full citations inline.

---

## Agent Party / autoresearch

- **Source**: Karpathy, A. — [`autoresearch`](https://github.com/karpathy/autoresearch)
  (nanochat + one markdown prompt driving an autonomous edit→run→measure→keep/discard loop)
- **Contact**: Tyler Cox (operator of the Agent Party run — 162 experiments, 16% keep rate,
  $0.40–0.55 per experiment on local hardware)
- **Key learnings applied to this scaffold**:
  - Deterministic scoring is non-negotiable — any LLM-in-the-loop judge introduces drift
  - Instrument the proposer: capture `reasoning_chain` so failed runs are diagnosable
  - Cost split matters: 65:1 input-to-output token ratio means input cost dominates
  - Trajectories are non-monotonic; use a sliding window (15 runs) for stall detection
  - Scorer bugs are silent catastrophes (`time_efficiency` returned 0 for 20 experiments)

### `_fuzzy_find` — tiered diff application

The tiered diff-application strategy in
[`skills/shared/execute/SKILL.md`](./skills/shared/execute/SKILL.md) §3 is
derived from the `_fuzzy_find` function in `autoresearch.py`:

1. **Tier 1 — Exact**: context lines must match byte-for-byte.
2. **Tier 2 — Whitespace-normalized**: collapse `\s+` runs and retry.
3. **Tier 3 — Error**: reject the diff as unappliable.

JSON/YAML/shell post-apply validation is also from the same source.

---

## SICA

- **Concept**: SICA's utility function weights score, cost, and time:
  `utility = 0.5×score + 0.25×cost + 0.25×time`
- **Applied**: Informs the `improvement_policy` cost-tracking fields
  (`cost_tokens_input`, `cost_tokens_output`, `cost_time_seconds`,
  `cost_estimate_usd`) in `run.md`.

---

## Reflexion

- Shinn, N. et al. (2023) — [Reflexion: Language Agents with Verbal
  Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- **Applied**: `agents/improver/skills/reflect/SKILL.md` — `lessons.md`
  is the episodic verbal memory; `propose` reads it each iteration.
  Advisory critics are logged but never flip the numeric verdict.

---

## Voyager

- Wang, G. et al. (2023) — [Voyager: An Open-Ended Embodied Agent with
  Large Language Models](https://arxiv.org/abs/2305.16291)
- **Applied**: The append-only `skills/` tree (especially `skills/shared/`)
  is architecturally the Voyager skill library. Curriculum-level growth
  sits above the scaffold, not inside it.

---

## ADAS — Automated Design of Agentic Systems

- Hu, S. et al. (2024) — [Automated Design of Agentic Systems
  (ADAS)](https://arxiv.org/abs/2408.08435)
- **Applied**: `self_improvable: false` in `agents/improver/AGENT.md` is
  the gate for ADAS-style recursive self-modification. Flipping to `true`
  and shipping a real `tests.md` for improver enables it.

---

## AutoAgent

- HKUDS (2025) — [AutoAgent: A Fully-Automated and Zero-Code Framework
  for LLM Agents](https://arxiv.org/abs/2502.05957)
- **Applied**: Confirms the plain-directory-of-markdown choice.
  The `agents/` + `skills/` + `memory/` layout IS the self-managing
  file system AutoAgent describes.

---

## Anthropic Agent Skills

- Anthropic — [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
  and [`anthropics/skills`](https://github.com/anthropics/skills)
- **Applied**: The three skill archetypes (dedicated, standalone, shared)
  are derived from the Claude Code Agent Skills pattern.

---

## EvoAgentX survey

- EvoAgentX — [Awesome-Self-Evolving-Agents](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents)
- A living survey of self-evolving agent patterns. The scaffold's research
  roadmap in `SELF-IMPROVEMENT.md` maps to patterns catalogued here.
