# Hermes Agent POC — Cross-Functional Workshop

Two custom skills for [Nous Research's Hermes Agent](https://github.com/NousResearch/hermes-agent)
that simulate a cross-functional team negotiating requirements, then render
the result as a polished HTML report.

- **`cross-functional-workshop`** — runs a 5-round simulation (opening →
  cross-examination → gap surfacing → convergence → synthesis) voicing
  five personas (Sales, PDM, Marketing, Support, Services) and writes a
  structured artifact + deterministic score against a 9-criterion rubric.
- **`hermes-report`** — converts a completed run into a self-contained
  HTML file with score dashboard, requirements cards, conflicts table,
  open questions, and next-steps sections.

## Repo layout

```
.
├── hermes-agent/                 # Nous Research Hermes Agent (vendored via git subtree)
├── skills/
│   ├── cross-functional-workshop/
│   │   ├── SKILL.md              # moderator system prompt + 5-round dispatch
│   │   ├── personas/             # 5 character bibles
│   │   ├── rounds/               # round1..round5 prompts
│   │   ├── scenarios/            # cross_functional_workshop, commercial_portfolio_roadmap
│   │   ├── teams/teams.yaml      # team rosters and aliases
│   │   ├── evaluation/rubric.md  # 9-criterion scoring contract
│   │   └── scripts/score_run.py  # deterministic V1 rubric scorer
│   └── hermes-report/
│       ├── SKILL.md              # report-skill workflow
│       └── scripts/report.py     # markdown → self-contained HTML
├── runs/                         # live run output (gitignored except .gitkeep)
├── archive/                      # prior POC iterations preserved for reference
│   ├── prompts-poc/              # original prompts-only Claude Code POC
│   └── scaffold-poc/             # earlier markdown agent+skills scaffold
└── runbook.md                    # operator instructions
```

## Quick start

1. Install Hermes Agent (one-time):
   ```
   cd hermes-agent
   bash setup-hermes.sh
   ```
2. Configure your LLM provider (Ollama default — see `runbook.md` for
   provider options including local Ollama, LM Studio, and OpenAI-compatible
   proxies for Windsurf or Claude Code).
3. Register the skills:
   ```
   hermes skills install ../skills/cross-functional-workshop
   hermes skills install ../skills/hermes-report
   ```
4. Run a workshop:
   ```
   hermes -q "Run cross-functional-workshop with topic='pricing tier consolidation'"
   ```
5. Generate the report:
   ```
   hermes -q "Run hermes-report on the most recent run"
   ```

See [`runbook.md`](./runbook.md) for the full operator procedure, model
selection, configuration details, and a worked example.

## What got archived and why

The `archive/` directory preserves two prior iterations of this POC that
pointed at the wrong target:

- **`archive/prompts-poc/`** — A prompts-only Claude Code POC that ran
  the same 5-round simulation but as static prompts the operator pasted
  by hand. It used Hermes Agent's name without using the framework. The
  persona character bibles, round prompts, scenario files, rubric, and
  HTML report design were ported into the new skill bundle.
- **`archive/scaffold-poc/`** — A from-scratch markdown agent + skills
  scaffold (greeter, summarizer, improver) that was Hermes-Agent-inspired
  but did not vendor or use the upstream framework. Preserved for
  reference; the improver self-improvement loop is a useful design that
  may be revisited as a separate Hermes skill.

The current rebuild is the first attempt that actually runs *on* Hermes
Agent.

## Scoring

After every run, `score_run.py` automatically appends a deterministic
score table (criteria C1–C7) to `round5.md`. Two criteria — C8
(cross-scenario configurability) and C9 (repeatability) — require a
second run to score, so a single run maxes at 14/18. Target for
"POC works": **≥ 12/14** on a single baseline run.
