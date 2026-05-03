# Hermes Agent POC — Runbook

How to install Hermes Agent, register the cross-functional-workshop and
hermes-report skills, run a simulation, and generate the HTML report.

---

## 1. Install Hermes Agent (one-time)

The upstream framework is vendored at `hermes-agent/` via git subtree.

```
cd hermes-agent
bash setup-hermes.sh
```

The setup script uses `uv` to install Python dependencies (Python ≥ 3.11
required). On first run, follow the interactive prompts to write
`~/.hermes/config.yaml` and `.env`.

To pull upstream updates later:

```
git subtree pull --prefix=hermes-agent https://github.com/NousResearch/hermes-agent main --squash
```

---

## 2. Configure your LLM provider

Hermes ships pointed at **OpenRouter + Claude Opus 4.6** by default. This
POC is set up to run against a local LLM instead. Pick one path:

### Path A — Ollama (recommended local default)

Ollama is the lightest-weight setup. Pull a tool-capable model:

```
ollama pull llama3.1:8b           # baseline; fast, modest tool-use quality
# or
ollama pull qwen2.5:14b-instruct  # better tool-use, ~10GB
# or
ollama pull llama3.1:70b          # high fidelity, needs ~40GB VRAM
```

Edit `~/.hermes/config.yaml` (created by `setup-hermes.sh`):

```yaml
model:
  default: "llama3.1:8b"
  provider: "ollama"            # alias for "custom"
  base_url: "http://localhost:11434/v1"
```

Or use the interactive wizard: `hermes setup`.

### Path B — LM Studio

Set `provider: "lmstudio"` in the config and point `base_url` at your
local LM Studio server (default `http://localhost:1234/v1`).

### Path C — Windsurf Cascade or Claude Code as a backend

Neither tool exposes an OpenAI-compatible endpoint natively. Run a local
proxy (e.g. [`litellm`](https://github.com/BerriAI/litellm)) that bridges
to your provider, then set:

```yaml
model:
  default: "<your-model-id>"
  provider: "custom"
  base_url: "http://localhost:<proxy-port>/v1"
```

This is V2 territory — confirm your proxy returns OpenAI-shape responses
with tool-call support before wiring it up.

---

## 3. Register the skills

From the repo root:

```
hermes skills install ./skills/cross-functional-workshop
hermes skills install ./skills/hermes-report
```

Verify they're loaded:

```
hermes skills list | grep -E "cross-functional-workshop|hermes-report"
```

Both skills should appear in the output.

---

## 4. Run a workshop

The simplest invocation uses defaults (scenario =
`cross_functional_workshop`, teams = Sales + PDM + Marketing + Support +
Services):

```
hermes -q "Run cross-functional-workshop with topic='adding self-serve onboarding for new customers'"
```

Hermes will:

1. Read the scenario, teams, and persona files from
   `${HERMES_SKILL_DIR}` and produce the acknowledgment block.
2. Run rounds 1–5 in sequence, voicing all 5 personas per round in a
   single agent loop. Each round is written to
   `runs/<session_id>/round<N>.md`.
3. After round 5, automatically invoke
   `scripts/score_run.py` and append the score table to `round5.md`.
4. Print a Strong/Partial/Weak summary to the conversation along with
   the file paths and an invitation to run `hermes-report`.

To pick a different scenario or teams:

```
hermes -q "Run cross-functional-workshop scenario='commercial_portfolio_roadmap' teams='Team A' topic='Q3 launch readiness'"
```

Team aliases (`Team A`, `commercial_strategy`, `Commercial Strategy Team`)
all resolve to the same roster.

---

## 5. Generate the HTML report

```
hermes -q "Run hermes-report"
```

With no argument, it picks the most recent run in `runs/`. To target a
specific run:

```
hermes -q "Run hermes-report on runs/<session_id>"
```

The skill writes `runs/<session_id>/report.html` — a single
self-contained HTML file with embedded CSS and no external dependencies.
Open it in any browser.

---

## 6. Worked example — start to finish

```
$ ollama serve &
$ cd /home/user/brainstorming
$ hermes skills install ./skills/cross-functional-workshop
✓ installed cross-functional-workshop
$ hermes skills install ./skills/hermes-report
✓ installed hermes-report
$ hermes -q "Run cross-functional-workshop topic='pricing tier consolidation'"
[acknowledgment block]
--- ready for round 1 ---
[round 1 content]
--- end of round 1 ---
[write_file: runs/2026-05-03-1442-a3f2/round1.md]
[round 2 ...]
[round 3 ...]
[round 4 ...]
[round 5 ...]
[score_run.py output appended]

**Run scored: 13/14 on this run.** ...

Files written:
- runs/2026-05-03-1442-a3f2/round1.md
- ...
- runs/2026-05-03-1442-a3f2/round5.md

To produce a polished HTML report, invoke the `hermes-report` skill on
this run.

$ hermes -q "Run hermes-report"
Report written: runs/2026-05-03-1442-a3f2/report.html

$ xdg-open runs/2026-05-03-1442-a3f2/report.html
```

---

## 7. Iteration loop

- **Tweak a persona** — edit `skills/cross-functional-workshop/personas/<key>.md`.
  Re-install the skill (`hermes skills install ./skills/cross-functional-workshop`)
  and re-run.
- **Add a scenario** — copy `scenarios/cross_functional_workshop.md` as a
  starting point, edit setting and expected dynamics, drop the new file
  into `scenarios/`. Invoke with `scenario='<new_id>'`.
- **Sharpen the rubric** — `evaluation/rubric.md` is the human-readable
  contract; `scripts/score_run.py` is the heuristic implementation. If
  you change a criterion's weight or threshold, update both.
- **Compare models** — same invocation against different `model.default`
  values; score and diff the results to evaluate model fitness.
- **Fresh chat for repeatability** — every run starts a new
  `${HERMES_SESSION_ID}`. Repeatability (C9) is scored by re-running the
  same invocation in a separate session and diffing.

---

## 8. Files written per run

```
runs/<session_id>/
├── round1.md       # opening positions
├── round2.md       # cross-examination
├── round3.md       # gap surfacing
├── round4.md       # convergence (top 5 requirements)
├── round5.md       # synthesis + appended score sheet
└── report.html     # generated by hermes-report (only if invoked)
```

`runs/` is gitignored. To preserve a specific run for reference, force-add it:

```
git add -f runs/<session_id>/
git commit -m "Hermes run: <topic>"
```

---

## 9. Common failure modes

- **Acknowledgment block is wrong or absent.** The model didn't load the
  skill resources. Check `hermes skills list` confirms registration; try
  `hermes skills install` again.
- **Round files not written.** Hermes generated text but skipped the
  `write_file` tool call. The model may not be reliably tool-using —
  switch to a more capable model (`qwen2.5:14b-instruct` or larger).
- **Personas blur together by round 3.** Local model fidelity ceiling.
  Try a larger model or upgrade to a hosted provider for the run.
- **`score_run.py` reports 0 across the board.** The round files may not
  match the expected speaker-tag pattern (`**Persona Display Name:**`).
  Check `runs/<id>/round1.md` for the format.
- **Report HTML missing sections.** The round 5 synthesis didn't include
  one or more of the 9 expected sections. Re-run; if persistent, check
  that `rounds/round5_synthesis.md` is loaded into the agent's context.

---

## 10. References

- Upstream Hermes Agent: https://github.com/NousResearch/hermes-agent
- Upstream docs: https://hermes-agent.nousresearch.com/docs
- Vendored snapshot: `hermes-agent/` in this repo
- Skill format reference: `hermes-agent/skills/dogfood/SKILL.md` (a good
  example of the YAML frontmatter + workflow shape)
- Sample completed run from the prompts-only POC era:
  `archive/prompts-poc/.working/sample/`
