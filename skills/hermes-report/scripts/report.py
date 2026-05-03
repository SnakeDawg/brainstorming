#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["markdown"]
# ///
"""
Hermes report generator — converts a completed cross-functional-workshop run
into a polished, self-contained HTML file.

Usage:
    uv run --with markdown report.py <run_dir>

Reads <run_dir>/round{1..5}.md, parses the score sheet appended to round5.md,
and writes <run_dir>/report.html.
"""

from __future__ import annotations

import html
import re
import sys
from datetime import datetime
from pathlib import Path

import markdown as md_lib


CSS = """
:root {
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-header-bg: #1e293b;
  --color-header-text: #f8fafc;
  --color-accent: #3b82f6;
  --color-accent-dark: #1d4ed8;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-muted: #64748b;
  --color-strong: #d1fae5;
  --color-strong-text: #065f46;
  --color-partial: #fef3c7;
  --color-partial-text: #92400e;
  --color-weak: #fee2e2;
  --color-weak-text: #991b1b;
  --color-na: #f3f4f6;
  --color-na-text: #374151;
}
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}
.container { max-width: 960px; margin: 0 auto; padding: 0 1.5rem 4rem; }
header.page {
  background: var(--color-header-bg);
  color: var(--color-header-text);
  padding: 2.5rem 1.5rem 2rem;
  margin-bottom: 2rem;
}
header.page .inner { max-width: 960px; margin: 0 auto; }
header.page h1 { font-size: 2rem; margin: 0 0 0.5rem; line-height: 1.25; }
header.page .meta { color: #cbd5e1; font-size: 0.95rem; margin-bottom: 1rem; }
.badge {
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
}
.badge-green  { background: var(--color-strong);  color: var(--color-strong-text); }
.badge-amber  { background: var(--color-partial); color: var(--color-partial-text); }
.badge-red    { background: var(--color-weak);    color: var(--color-weak-text); }
section { background: var(--color-surface); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.08); padding: 1.5rem 1.75rem; margin-bottom: 1.5rem; }
section h2 {
  font-size: 1.4rem;
  margin: 0 0 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--color-accent);
  color: var(--color-header-bg);
}
section h3 { font-size: 1.1rem; margin: 1.25rem 0 0.5rem; color: var(--color-header-bg); }
section h4 { font-size: 1rem; margin: 1rem 0 0.4rem; }
table { width: 100%; border-collapse: collapse; margin: 0.5rem 0 1rem; font-size: 0.95rem; }
th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); vertical-align: top; }
th { background: #f8fafc; font-weight: 600; color: var(--color-header-bg); }
tbody tr:nth-child(even) { background: #fafbfc; }
tr.score-strong  { background: var(--color-strong); }
tr.score-partial { background: var(--color-partial); }
tr.score-weak    { background: var(--color-weak); }
tr.score-na      { background: var(--color-na); }
tr.score-strong td, tr.score-partial td, tr.score-weak td, tr.score-na td { font-weight: 500; }
tr.score-total td { background: var(--color-header-bg); color: var(--color-header-text); font-weight: 700; }
ul, ol { padding-left: 1.5rem; }
.callout {
  background: #f1f5f9;
  border-left: 4px solid var(--color-accent);
  padding: 1rem 1.25rem;
  border-radius: 0 6px 6px 0;
  margin: 1rem 0;
}
.callout p:first-child { margin-top: 0; }
.callout p:last-child { margin-bottom: 0; }
footer {
  font-size: 0.85rem;
  color: var(--color-muted);
  border-top: 1px solid var(--color-border);
  padding: 1rem 0;
  margin-top: 2rem;
}
footer code { background: #f3f4f6; padding: 0.1rem 0.4rem; border-radius: 3px; }
@media print {
  body { background: white; }
  section { box-shadow: none; border: 1px solid var(--color-border); page-break-inside: avoid; }
  tr.score-strong, tr.score-partial, tr.score-weak, tr.score-na { background: white !important; }
}
"""


def read_round(run_dir: Path, n: int) -> str:
    p = run_dir / f"round{n}.md"
    if not p.exists():
        raise FileNotFoundError(p)
    return p.read_text(encoding="utf-8", errors="replace")


def split_score_sheet(round5: str) -> tuple[str, str]:
    """Split round5 into (synthesis_body, score_sheet_block)."""
    marker = re.search(r"^##\s+Score\s+Sheet", round5, re.IGNORECASE | re.MULTILINE)
    if not marker:
        return round5, ""
    return round5[: marker.start()].rstrip(), round5[marker.start() :].strip()


def parse_score_table(score_sheet: str) -> tuple[list[dict], int]:
    """Extract (rows, total) from the markdown score-sheet table."""
    rows: list[dict] = []
    total = 0
    for line in score_sheet.splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != 3:
            continue
        crit, score, evidence = cells
        if crit.startswith("Criterion") or set(crit) <= set("- "):
            continue
        if "total" in crit.lower() or "**total**" in crit.lower():
            m = re.search(r"(\d+)\s*/\s*\d+", score)
            if m:
                total = int(m.group(1))
            rows.append({"criterion": _strip_md_bold(crit), "score": score, "evidence": evidence, "css": "score-total"})
            continue
        css = _classify_score(score)
        rows.append({"criterion": crit, "score": score, "evidence": evidence, "css": css})
    return rows, total


def _strip_md_bold(s: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", s)


def _classify_score(score_cell: str) -> str:
    s = score_cell.strip()
    if s == "2":
        return "score-strong"
    if s == "1":
        return "score-partial"
    if s == "0":
        return "score-weak"
    if "second run" in s.lower():
        return "score-na"
    return ""


def extract_header(round5_body: str) -> dict:
    """Pull Scenario / Topic / Teams / Date from the round 5 header block."""
    fields = {"topic": "Workshop", "scenario": "—", "teams": "—", "date": "—"}
    for key in ("scenario", "topic", "teams", "date"):
        m = re.search(rf"\*\*{key}:\*\*\s*(.+)", round5_body, re.IGNORECASE)
        if m:
            fields[key] = m.group(1).strip().strip("`")
    return fields


def render_md(text: str) -> str:
    return md_lib.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])


def score_badge_class(total: int) -> str:
    if total >= 12:
        return "badge-green"
    if total >= 8:
        return "badge-amber"
    return "badge-red"


def render_score_table(rows: list[dict]) -> str:
    out = ['<table><thead><tr><th>Criterion</th><th>Score</th><th>Evidence</th></tr></thead><tbody>']
    for r in rows:
        css = f' class="{r["css"]}"' if r["css"] else ""
        out.append(
            f'<tr{css}><td>{html.escape(r["criterion"])}</td>'
            f'<td>{html.escape(r["score"])}</td>'
            f'<td>{html.escape(r["evidence"])}</td></tr>'
        )
    out.append("</tbody></table>")
    return "\n".join(out)


def render_lineage_footer(run_dir: Path) -> str:
    files = "\n".join(
        f"<li><code>{html.escape(str((run_dir / f'round{n}.md').as_posix()))}</code></li>"
        for n in range(1, 6)
    )
    generated = datetime.now().strftime("%Y-%m-%d %H:%M")
    return (
        '<footer><strong>Source files (lineage):</strong>'
        f'<ul style="margin:0.5rem 0 0;">{files}</ul>'
        f'<p style="margin-top:0.75rem;">Generated by hermes-report on {generated}.</p>'
        '</footer>'
    )


def build_html(run_dir: Path) -> str:
    rounds = {n: read_round(run_dir, n) for n in range(1, 6)}
    body, score_sheet = split_score_sheet(rounds[5])
    score_rows, total = parse_score_table(score_sheet)
    header = extract_header(body)

    title = header["topic"]
    badge_cls = score_badge_class(total)

    page = [
        "<!DOCTYPE html>",
        '<html lang="en"><head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        f"<title>{html.escape(title)} — Hermes Report</title>",
        f"<style>{CSS}</style>",
        "</head><body>",
        '<header class="page"><div class="inner">',
        f'<h1>{html.escape(title)}</h1>',
        f'<div class="meta">Scenario: <strong>{html.escape(header["scenario"])}</strong> '
        f'· Teams: {html.escape(header["teams"])} '
        f'· Date: {html.escape(header["date"])}</div>',
        f'<span class="badge {badge_cls}">{total} / 14 this run</span>',
        "</div></header>",
        '<div class="container">',
    ]

    if score_rows:
        page.append('<section><h2>Score Dashboard</h2>')
        page.append(render_score_table(score_rows))
        page.append('<p style="font-size:0.85rem;color:var(--color-muted);">'
                    'Two criteria — cross-scenario variation and repeatability — require a '
                    'follow-up run to score (max 18 across two runs).</p>')
        page.append('</section>')

    page.append('<section><h2>Synthesis</h2>')
    page.append(render_md(body))
    page.append('</section>')

    page.append(render_lineage_footer(run_dir))
    page.append('</div></body></html>')
    return "\n".join(page)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: report.py <run_dir>", file=sys.stderr)
        return 2
    run_dir = Path(argv[1])
    if not run_dir.is_dir():
        print(f"run dir not found: {run_dir}", file=sys.stderr)
        return 2
    out = run_dir / "report.html"
    out.write_text(build_html(run_dir), encoding="utf-8")
    print(f"Report written: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
