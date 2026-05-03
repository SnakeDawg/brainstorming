---
name: hermes-report
description: "Generate a polished, self-contained HTML report from a completed cross-functional-workshop run. Reads the round files + appended score sheet and writes a single HTML file with score dashboard, requirements cards, conflicts, gaps, and next-steps sections."
version: 0.1.0
metadata:
  hermes:
    tags: [report, html, visualization, simulation]
    related_skills: [cross-functional-workshop]
---

# Hermes Report

Generate a polished HTML artifact from a completed cross-functional-workshop
run. The round markdown files are the lineage record; this HTML file is the
shareable user-facing artifact.

## Inputs

The user provides one of:

1. **A run directory path** — e.g. `runs/<session_id>/`. Used directly.
2. **No argument** — the skill lists `runs/`, identifies the most recent
   directory containing `round1.md` through `round5.md`, and uses it.

## Workflow

1. Resolve the run directory per the inputs above. If no run directory
   contains all five round files, list which files are missing and stop.
2. Invoke the report generator:
   ```
   !`uv run --with markdown ${HERMES_SKILL_DIR}/scripts/report.py <run_dir>`
   ```
3. The generator writes `<run_dir>/report.html` and prints
   `Report written: <run_dir>/report.html` to stdout.
4. Echo that line back to the user as the only response — no commentary,
   no follow-on suggestions.

## What the report contains

- **Header** — topic title, scenario / teams / date metadata, score badge
  (green ≥ 12, amber 8–11, red < 8 on a /14 scale)
- **Score dashboard** — per-criterion table, color-coded by Strong (green)
  / Partial (amber) / Weak (red) / Requires-second-run (grey)
- **Top 5 requirements** — one card per requirement: rationale,
  champion, dependencies, concessions made, risks
- **Conflicts & misalignments** — table with color-coded disposition column
- **Open questions** — table with "in room?" indicator
- **Risks** — round-4 risks and structural moderator risks separately
- **Next steps** — action / owner / timeframe table
- **Cross-functional dependencies** — artifact / produced by / consumed by
- **Inputs & outputs by role** — two-column grid per persona
- **Moderator notes** — styled callout box
- **Realism smell test** — the three smell-test answers
- **Run lineage footer** — list of source `round{1..5}.md` files

The HTML is fully self-contained: all CSS in a `<style>` block, no
JavaScript, no external assets.
