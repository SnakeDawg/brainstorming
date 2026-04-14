# brainstorming — agent + skills scaffold with self-improvement

A minimal scaffold that demonstrates three archetypes of the
[Claude Code Agent Skills](https://code.claude.com/docs/en/skills)
pattern *plus* a first-class self-improvement loop, using nothing but
markdown files with YAML frontmatter. The goal is to be the simplest
possible foundation on which measurable, deterministic
self-improvement can run.

## The three skill archetypes

| # | Archetype | Example | Path |
|---|---|---|---|
| 1 | Agent with a **dedicated** skill | `greeter` + `format-greeting` | [`agents/greeter/`](./agents/greeter/AGENT.md) |
| 2 | **Standalone** skill (no owning agent) | `summarize-text` | [`skills/summarize-text/`](./skills/summarize-text/SKILL.md) |
| 3 | **Common shared** skill (any agent) | `read-file` | [`skills/shared/read-file/`](./skills/shared/read-file/SKILL.md) |

Rules in one paragraph:

- **Dedicated** skills live *inside* their owning agent at
  `agents/<agent>/skills/<skill>/` and are referenced by that agent only.
- **Standalone** skills live at `skills/<skill>/`, are invoked directly,
  and ship their own `tests.md` + `rubric.md`.
- **Shared** skills live at `skills/shared/<skill>/` and are pulled in
  by any agent via a relative path in its `AGENT.md` frontmatter.

## The self-improvement agent

A fourth first-class entity: [`agents/improver`](./agents/improver/AGENT.md)
— a meta-agent that runs a measurable improvement loop against any
target. Improver **is itself** an agent with six dedicated skills; it
does not introduce a new archetype. Every other agent references it via
the required `improvement_agent` frontmatter field.

| Skill | Role |
|---|---|
| [`bootstrap`](./agents/improver/skills/bootstrap/SKILL.md) | Gate a new target into the loop; wait for user-authored `tests.md` |
| [`propose`](./agents/improver/skills/propose/SKILL.md) | Draft a candidate diff (the creative step) |
| [`run`](./agents/improver/skills/run/SKILL.md) | Apply candidate to scratch, exercise target, multi-sample outputs |
| [`score`](./agents/improver/skills/score/SKILL.md) | **Deterministic** scoring — the only accept/reject authority |
| [`reflect`](./agents/improver/skills/reflect/SKILL.md) | Reflexion-style verbal memory; advisory critics (never flip verdicts) |
| [`report`](./agents/improver/skills/report/SKILL.md) | User-friendly `REPORT.md` + append `HISTORY.md` and `INDEX.md` |

### Core principle: scoring is deterministic

LLMs are used to *propose* candidate changes and to *execute* the
target under test. LLMs are **never** used to judge whether a
candidate is better. The accept/reject verdict is a pure function of:

- pattern / regex / structural matches against user-authored
  `expected` values in `tests.md`
- numeric score delta vs. baseline
- regression count across previously-passing tests

LLM-as-judge is allowed only as *advisory critics* that are logged to
`lessons.md` and **never** affect the numeric verdict.

## The self-improvement contract

**Every agent MUST ship `tests.md` and `rubric.md`.** **Every
standalone skill MUST ship them too.** Shared and dedicated skills
inherit from their caller / owning agent. Improver refuses to run the
loop against a target that doesn't satisfy this contract.

### `tests.md` — user-authored, deterministic only

Ground truth. Human-written. Every block is a deterministic test case.
No LLM interpretation in the scoring path.

```markdown
---
agent: greeter
version: 1
---

~~~test
id: t1
input: "Ada"
match: contains
expected: "Hello, Ada"
samples: 3
pass_rate: 1.0
~~~
```

Supported match types (all deterministic):

| Match | Rule |
|---|---|
| `exact` | `output == expected` |
| `contains` | `expected` is a substring of `output` |
| `not_contains` | none of the listed strings appear in `output` |
| `regex` | regex pattern matches `output` |
| `json_path` | parse output as JSON, JSONPath equals `expected` |
| `length_between` | `len(output)` ∈ `[min, max]` |
| `equals_number` | numeric equality within `tolerance` |
| `shell` | run a shell command on output; exit 0 = pass |

See [`agents/improver/skills/score/SKILL.md`](./agents/improver/skills/score/SKILL.md)
for the authoritative definition.

### `rubric.md` — thin, no test data

```markdown
---
agent: greeter
baseline_score: 1.00
epsilon: 0.05
---

## Test weights
| t1 | 0.40 |
| t2 | 0.30 |
| t3 | 0.30 |

## Acceptance criterion
Accept iff:
  1. candidate_score ≥ baseline_score + epsilon
  2. zero regressions
  3. no blocking advisory critic raised

## Advisory critics (NOT scored)
- friendliness
- brevity
```

Weights and acceptance rules only. Test data stays in `tests.md`.

## Handling LLM variability in the target

Even though scoring is deterministic, the *target* is still an LLM
driven agent — same input can give different outputs. Three design
elements handle this:

1. **Multi-sample per test.** Every test runs `samples: N` times;
   passes iff `passed / samples ≥ pass_rate`. Default `samples: 3,
   pass_rate: 1.0`. Raise samples and lower pass_rate for flaky
   targets.
2. **Baseline is measured, not assumed.** Improver re-measures the
   baseline at the start of every run, so drift is visible before any
   candidate is considered.
3. **Acceptance requires both delta AND no regressions.** A candidate
   can't win by being lucky on one sample — it has to beat baseline
   AND not drop any previously-passing test across its sample set.

## Where performance is captured

```
memory/
  INDEX.md                                    ← repo-wide run log (one line per run)
  runs/<run-id>/
    objective.md                              ← what this run is trying to improve
    baseline.md                               ← per-test breakdown of the pre-run state
    candidates/
      001.diff.md                             ← proposed change
      001.run.md                              ← raw outputs (all samples)
      001.scores.md                           ← deterministic scoring table
      001.verdict.md                          ← accept | reject + reason
      002.*                                   ← next candidate...
    lessons.md                                ← Reflexion-style verbal memory
    result.md                                 ← final numeric summary
    REPORT.md                                 ← user-friendly narrative (regeneratable)
agents/<target>/HISTORY.md                    ← per-target improvement trail
```

Improvement-over-time for any target is a walk of
`memory/runs/*-<target>*/result.md` sorted by timestamp. The same
information is rendered as an ASCII curve in `agents/<target>/HISTORY.md`.

### Worked example on disk

The branch contains a fully committed example run:

- [`memory/runs/2026-04-14-greeter-empty-input/REPORT.md`](./memory/runs/2026-04-14-greeter-empty-input/REPORT.md)
  — the user-friendly report
- [`memory/runs/2026-04-14-greeter-empty-input/`](./memory/runs/2026-04-14-greeter-empty-input/)
  — the full evidence trail (objective, baseline, 3 candidates, lessons, result)
- [`agents/greeter/HISTORY.md`](./agents/greeter/HISTORY.md) — first row appended
- [`memory/INDEX.md`](./memory/INDEX.md) — first row appended

Candidate 001 was accepted (+0.60), 002 rejected (regression), 003
rejected (no delta). Read `REPORT.md` start to finish to see what a
user-friendly improver report looks like.

## Do not hand-edit

These files are auto-generated by `improver/skills/report` and
rewritten on every run:

- `memory/runs/<id>/REPORT.md`
- `agents/<name>/HISTORY.md`
- `memory/INDEX.md`

The `baseline_score` frontmatter field in every `rubric.md` is also
updated by the loop on accept. Everything else in `rubric.md`
(weights, critics, acceptance rule) is human-editable.

## Self-improvement roadmap (what the scaffold is built to host)

The ultimate goal of this scaffold is to host a growing family of
self-improvement patterns. Each drops into the existing `agents/` or
`skills/` tree with no framework changes.

| Pattern | Drop-in location | What it adds |
|---|---|---|
| **Karpathy AutoResearch** ("The Karpathy Loop") — one markdown prompt driving an edit → run → measure → keep/discard loop | already live as the `improver` agent (this MVP) | The core loop, backed by deterministic scoring and human-authored tests instead of LLM judgment. |
| **Reflexion** — verbal self-critique in episodic memory | already live as [`improver/skills/reflect`](./agents/improver/skills/reflect/SKILL.md) | Cheap retrofit; `lessons.md` is the episodic memory; `propose` reads it each iteration. |
| **Voyager skill library** — lifelong-learning agent with an ever-growing library of executable skills | meta-agent appends new dirs under `skills/` | The append-only `skills/` tree is already the target shape; curriculum layer sits above. |
| **ADAS — Automated Design of Agentic Systems** — a meta-agent programs new agents as code | `improver` edits `AGENT.md` files (gated today by `self_improvable: false`) | `AGENT.md` is plain markdown; enabling ADAS means flipping one flag and writing real improver tests. |
| **AutoAgent** (HKUDS) — zero-code framework with a self-managing file system | the `agents/` + `skills/` + `memory/` tree **is** that file system | Confirms the plain-directory-of-markdown choice. |
| **Reflection pattern** — generator + critic (+ multi-critic) | advisory critics in `rubric.md` (non-blocking today; can be promoted to blocking) | Simplest qualitative-signal channel; already wired into `reflect`. |
| **LATS** — MCTS over reason/act/plan | later phase; would branch `candidates/` into a tree | Builds on the existing candidate storage; no changes to tests/rubric. |

## References

- Karpathy, A. — [`autoresearch`](https://github.com/karpathy/autoresearch)
  (nanochat + one markdown prompt driving an autonomous loop)
- Wang, G. et al. (2023) — [Voyager: An Open-Ended Embodied Agent with
  Large Language Models](https://arxiv.org/abs/2305.16291)
- Shinn, N. et al. (2023) — [Reflexion: Language Agents with Verbal
  Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- Hu, S. et al. (2024) — [Automated Design of Agentic Systems
  (ADAS)](https://arxiv.org/abs/2408.08435)
- HKUDS (2025) — [AutoAgent: A Fully-Automated and Zero-Code Framework
  for LLM Agents](https://arxiv.org/abs/2502.05957)
- Anthropic — [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
  and [`anthropics/skills`](https://github.com/anthropics/skills)
- EvoAgentX — [Awesome-Self-Evolving-Agents](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents) survey

## Non-goals

- No Python/TS runtime, no registry/loader code. Everything is plain
  markdown.
- No `.claude/` wiring or auto-discovery.
- `improver` is self-hosting (`AGENT.md` can be edited) but
  `self_improvable: false` in MVP-0 gates ADAS-style self-targeting.
- No CI-level enforcement of the contract yet — bootstrap is the gate,
  improver enforces it at runtime.
