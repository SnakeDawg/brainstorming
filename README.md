# brainstorming — agent + skills scaffold

A deliberately minimal scaffold that demonstrates three archetypes of the
[Claude Code Agent Skills](https://code.claude.com/docs/en/skills) pattern
using nothing but markdown files with YAML frontmatter. The goal is to be
the **simplest possible foundation** that a self-improvement layer can be
bolted onto later.

## The three archetypes

| # | Archetype | Example | Path |
|---|---|---|---|
| 1 | Agent with a **dedicated** skill | `greeter` + `format-greeting` | [`agents/greeter/`](./agents/greeter/AGENT.md) |
| 2 | **Standalone** skill (no owning agent) | `summarize-text` | [`skills/summarize-text/`](./skills/summarize-text/SKILL.md) |
| 3 | **Common shared** skill (any agent) | `read-file` | [`skills/shared/read-file/`](./skills/shared/read-file/SKILL.md) |

The rules in one paragraph:

- **Dedicated** skills live *inside* their owning agent at
  `agents/<agent>/skills/<skill>/` and are referenced by that agent only.
- **Standalone** skills live at `skills/<skill>/` and are invoked directly,
  with no agent wrapper.
- **Shared** skills live at `skills/shared/<skill>/` and are pulled in by
  any agent via a relative path in its `AGENT.md` frontmatter.

## Layout

```
agents/
  README.md                          # agent convention
  greeter/
    AGENT.md
    skills/
      format-greeting/
        SKILL.md                     # DEDICATED (owned by greeter)
skills/
  README.md                          # skill convention
  summarize-text/
    SKILL.md                         # STANDALONE
  shared/
    read-file/
      SKILL.md                       # SHARED (any agent)
```

> This is a **demo layout** — it is **not** wired into Claude Code's native
> `.claude/skills/` auto-discovery. It's a plain-text scaffold a human or a
> future meta-agent can read and edit.

## Frontmatter schemas

Every `SKILL.md`:

```yaml
---
name: <kebab-case>
description: <one sentence>
scope: dedicated | standalone | shared
owner: <agent-name>        # only when scope == dedicated
consumers: any             # only when scope == shared (informational)
---
```

Every `AGENT.md`:

```yaml
---
name: <kebab-case>
description: <one sentence>
dedicated_skills: [<relative paths>]
shared_skills:    [<relative paths>]
---
```

Intentionally tiny — a future meta-agent can parse, edit, and append these
files without any framework code.

## Self-improvement roadmap

The ultimate goal of this scaffold is to host a self-improvement layer.
Each pattern below drops in as new files under `agents/` or `skills/`, with
no changes to the existing scaffold.

| Pattern | Drop-in location | What it adds |
|---|---|---|
| **Karpathy AutoResearch** ("The Karpathy Loop") — one markdown prompt driving an edit → run → measure → keep/discard loop | `skills/shared/autoresearch/SKILL.md` | A single-markdown self-improvement loop. The fact that Karpathy's real run used **one markdown prompt** to drive 700 experiments in 2 days is why this scaffold is pure markdown. |
| **Reflexion** — verbal self-critique in episodic memory between attempts | `skills/shared/reflect/SKILL.md` | Cheap retrofit: no weight updates, just a memory buffer referenced by any agent. |
| **Voyager skill library** — lifelong-learning agent with an ever-growing library of executable skills | meta-agent appends new dirs under `skills/` | The append-only `skills/` tree is already the target shape; Voyager's curriculum layer slots above it. |
| **ADAS — Automated Design of Agentic Systems** — a meta-agent programs new agents as code | meta-agent edits `AGENT.md` files | Because `AGENT.md` is plain markdown with YAML, a meta-agent can author new agents by writing new files. |
| **AutoAgent** (HKUDS) — zero-code framework with a self-managing file system | the `agents/` + `skills/` tree **is** that file system | Confirms the plain-directory-of-markdown choice. |
| **Reflection pattern** — single-model, generator+critic, multi-critic | any `AGENT.md` that references a critic skill | Simplest loop; the first self-improvement step to add. |
| **LATS** — MCTS over reason/act/plan | later phase | Advanced; builds on Reflection. |

## References

- Karpathy, A. — [`autoresearch`](https://github.com/karpathy/autoresearch)
  (nanochat + one markdown prompt driving an autonomous training-optimization
  loop) and related commentary on "The Karpathy Loop."
- Wang, G. et al. (2023) — [Voyager: An Open-Ended Embodied Agent with
  Large Language Models](https://arxiv.org/abs/2305.16291)
- Shinn, N. et al. (2023) — [Reflexion: Language Agents with Verbal
  Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- Hu, S. et al. (2024) — [Automated Design of Agentic Systems
  (ADAS)](https://arxiv.org/abs/2408.08435)
- HKUDS (2025) — [AutoAgent: A Fully-Automated and Zero-Code Framework for
  LLM Agents](https://arxiv.org/abs/2502.05957)
- Anthropic — [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
  and [anthropics/skills](https://github.com/anthropics/skills)
- EvoAgentX — [Awesome-Self-Evolving-Agents](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents)
  survey

## Non-goals

- No Python/TS runtime, no registry/loader code.
- No `.claude/` wiring or auto-discovery.
- No self-improvement loop **yet** — this is the foundation; the loop is a
  follow-up.
