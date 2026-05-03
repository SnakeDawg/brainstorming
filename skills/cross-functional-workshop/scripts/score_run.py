#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml"]
# ///
"""
Deterministic V1 rubric scorer for cross-functional-workshop runs.

Reads runs/<id>/round{1..5}.md, scores criteria C1-C7 via heuristics, marks
C8/C9 as requires-second-run, and emits a markdown score table to stdout.

Usage:
    uv run --with pyyaml score_run.py runs/<session_id>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable


# Persona display-name patterns to detect speaker tags. Keys map to short
# names used in evidence text.
PERSONAS = {
    "Sales Representative": "sales",
    "Product Manager (PDM)": "pdm",
    "PDM": "pdm",
    "Marketing Manager": "marketing",
    "Support Lead": "support",
    "Services Lead": "services",
}

# Round 5 sections that must appear (per round5_synthesis.md template).
SYNTHESIS_SECTIONS = [
    r"top\s*5\s*requirements",
    r"inputs\s*needed",
    r"outputs\s*produced",
    r"cross-functional\s*dependencies",
    r"conflicts",
    r"open\s*questions",
    r"risks",
    r"next\s*steps",
    r"moderator\s*notes",
]


def read_round(run_dir: Path, n: int) -> str:
    p = run_dir / f"round{n}.md"
    if not p.exists():
        return ""
    return p.read_text(encoding="utf-8", errors="replace")


def speaker_turns(text: str) -> dict[str, int]:
    """Count speaker tags like '**Sales Representative:**' per persona."""
    counts: dict[str, int] = {k: 0 for k in set(PERSONAS.values())}
    for display_name, key in PERSONAS.items():
        pattern = rf"\*\*{re.escape(display_name)}:\*\*"
        counts[key] += len(re.findall(pattern, text))
    return counts


def has_concession(text: str) -> int:
    """Detect explicit concession language across the transcript."""
    patterns = [
        r"\bI(?:'ll| will) (?:trade|drop|give up|concede|live without)\b",
        r"\bI(?:'ll| will) accept\b",
        r"\bconcession[s]? made\b",
        r"\btrade ?off\b.*\bfor\b",
    ]
    return sum(len(re.findall(p, text, re.IGNORECASE)) for p in patterns)


def has_specifics(text: str) -> int:
    """Count concrete specifics: dollar figures, ticket counts, named accounts."""
    patterns = [
        r"\$\d[\d,.]*[KMB]?\b",
        r"\b\d{2,}\s+tickets?\b",
        r"\b\d+\s*(?:enterprise|named|active)\s+(?:account|deal)s?\b",
        r"\b(?:Lenovo|Dell|HP|Microsoft|Salesforce|Gartner|IDC)\b",
    ]
    return sum(len(re.findall(p, text, re.IGNORECASE)) for p in patterns)


def detect_friction(text: str) -> int:
    """Count cross-functional friction markers in round 2."""
    patterns = [
        r"\b(?:vs\.?|versus)\b",
        r"\bdisagree[ds]?\b",
        r"\bpush(?:ed|es)?\s+back\b",
        r"\bobjection[s]?\b",
        r"\bconflict[s]?\b",
        r"\btension[s]?\b",
    ]
    return sum(len(re.findall(p, text, re.IGNORECASE)) for p in patterns)


def detect_missing_inputs(text: str) -> int:
    """Count missing-input statements in round 3."""
    patterns = [
        r"\bmissing input\b",
        r"\bdon'?t have\b",
        r"\bneed[s]?\s+(?:from|input from)\b",
        r"\bnot in (?:the )?room\b",
        r"\bunconfirmed\b",
        r"\bunresolved\b",
    ]
    return sum(len(re.findall(p, text, re.IGNORECASE)) for p in patterns)


def synthesis_section_count(text: str) -> int:
    """Count round-5 synthesis sections present."""
    found = 0
    for pattern in SYNTHESIS_SECTIONS:
        if re.search(rf"^#+\s*\d*\.?\s*{pattern}", text, re.IGNORECASE | re.MULTILINE):
            found += 1
    return found


def has_top_5_with_fields(round4_text: str) -> tuple[int, str]:
    """Return (score, evidence) for C6 — top-5 list with required fields."""
    fields = [r"rationale", r"depend", r"risk"]
    field_hits = sum(
        1 for f in fields if re.search(f, round4_text, re.IGNORECASE)
    )
    enumerated = len(re.findall(r"^\s*\d\.\s", round4_text, re.MULTILINE))
    if enumerated >= 5 and field_hits == 3:
        return 2, f"5+ enumerated items, all 3 required fields ({', '.join(fields)}) present"
    if enumerated >= 5 and field_hits >= 2:
        return 1, f"5+ items but only {field_hits}/3 required fields present"
    if enumerated >= 3:
        return 1, f"{enumerated} items enumerated; below the top-5 target"
    return 0, "no top-5 list detected"


def score_c1_realistic_personas(rounds: list[str]) -> tuple[int, str]:
    """All 5 personas speak in rounds 1, 2, 4 with stock-phrase evidence."""
    full = "\n".join(rounds[:4])
    persona_counts = speaker_turns(full)
    speaking = sum(1 for v in persona_counts.values() if v > 0)
    specifics = has_specifics(full)
    if speaking == 5 and specifics >= 6:
        return 2, f"all 5 personas speak; {specifics} concrete specifics across rounds 1-4"
    if speaking >= 4 and specifics >= 3:
        return 1, f"{speaking}/5 personas speak; {specifics} specifics"
    return 0, f"only {speaking}/5 personas speak"


def score_c2_multi_persona(rounds: list[str]) -> tuple[int, str]:
    """All 5 speak substantively in rounds 1, 2, 4."""
    targets = [rounds[0], rounds[1], rounds[3]]
    speaking_per_round = []
    for t in targets:
        c = speaker_turns(t)
        speaking_per_round.append(sum(1 for v in c.values() if v > 0))
    if all(s == 5 for s in speaking_per_round):
        return 2, f"all 5 personas in rounds 1, 2, 4 (turn counts: {speaking_per_round})"
    if all(s >= 4 for s in speaking_per_round):
        return 1, f"4+ personas in each target round (counts: {speaking_per_round})"
    return 0, f"thin coverage: {speaking_per_round}"


def score_c3_role_consistency(rounds: list[str]) -> tuple[int, str]:
    """Concessions in round 4 trace back to round 1 positions."""
    concession_count = has_concession(rounds[3])
    if concession_count >= 4:
        return 2, f"{concession_count} explicit concession statements in round 4"
    if concession_count >= 2:
        return 1, f"{concession_count} explicit concessions"
    return 0, "no explicit concession language detected in round 4"


def score_c4_friction(rounds: list[str]) -> tuple[int, str]:
    """Round 2 produces concrete tensions tied to round 1 requirements."""
    friction_count = detect_friction(rounds[1])
    if friction_count >= 8:
        return 2, f"{friction_count} friction markers in round 2"
    if friction_count >= 4:
        return 1, f"{friction_count} friction markers (target: 8+)"
    return 0, f"only {friction_count} friction markers — round 2 may be too collegial"


def score_c5_missing_inputs(rounds: list[str]) -> tuple[int, str]:
    """Round 3 surfaces ≥8 missing-input rows."""
    text = rounds[2]
    table_rows = len(re.findall(r"^\|[^|]+\|[^|]+\|", text, re.MULTILINE))
    gap_count = detect_missing_inputs(text)
    if table_rows >= 9 or gap_count >= 12:
        return 2, f"{table_rows} table rows, {gap_count} gap markers"
    if table_rows >= 5 or gap_count >= 6:
        return 1, f"{table_rows} table rows, {gap_count} gap markers (target: 9+ rows)"
    return 0, f"only {table_rows} table rows / {gap_count} gap markers"


def score_c6_convergence(rounds: list[str]) -> tuple[int, str]:
    return has_top_5_with_fields(rounds[3])


def score_c7_structured_output(rounds: list[str]) -> tuple[int, str]:
    """Round 5 has all 9 synthesis sections."""
    found = synthesis_section_count(rounds[4])
    if found >= 9:
        return 2, f"{found}/9 synthesis sections present"
    if found >= 7:
        return 1, f"{found}/9 sections present (1-2 missing)"
    return 0, f"only {found}/9 sections present"


CRITERIA = [
    ("C1", "Realistic personas",            "realistic personas",                score_c1_realistic_personas),
    ("C2", "Multi-persona discussion",      "multi-persona discussion",          score_c2_multi_persona),
    ("C3", "Role consistency",              "role consistency",                  score_c3_role_consistency),
    ("C4", "Cross-functional friction",     "cross-functional friction surfaced", score_c4_friction),
    ("C5", "Missing inputs",                "missing inputs identified",         score_c5_missing_inputs),
    ("C6", "Convergence",                   "convergence on requirements",       score_c6_convergence),
    ("C7", "Structured output",             "structured output",                 score_c7_structured_output),
]


def render_score_sheet(scores: list[tuple[str, str, str, int, str]], total: int) -> str:
    lines = [
        "",
        "---",
        "",
        "## Score Sheet (auto-generated)",
        "",
        "| Criterion | Score (0/1/2) | Evidence |",
        "|-----------|---------------|----------|",
    ]
    for cid, short, _plain, score, evidence in scores:
        lines.append(f"| {cid} {short:<32} | {score} | {evidence} |")
    lines.append(f"| C8 Configurable team / scenario   | 0 — requires second run | Not applicable to baseline single run. |")
    lines.append(f"| C9 Repeatability                  | 0 — requires second run | Not applicable to baseline single run. |")
    lines.append(f"| **Total**                         | **{total} / 14** | C1-C7 scored; C8/C9 require a second run (max 18 across two runs) |")
    lines.append("")
    return "\n".join(lines)


def render_summary(scores: list[tuple[str, str, str, int, str]], total: int) -> str:
    strong = [plain for _cid, _short, plain, s, _e in scores if s == 2]
    partial = [plain for _cid, _short, plain, s, _e in scores if s == 1]
    weak = [plain for _cid, _short, plain, s, _e in scores if s == 0]
    out = [
        "",
        f"**Run scored: {total}/14 on this run.** (Maximum is 18 across two runs;",
        "two criteria — cross-scenario variation and repeatability — need a",
        "follow-up run to score.)",
        "",
        f"- **Strong (2/2):** {', '.join(strong) if strong else '(none)'}",
        f"- **Partial (1/2):** {', '.join(partial) if partial else '(none)'}",
    ]
    if weak:
        out.append(f"- **Weak (0/2):** {', '.join(weak)}")
    out.append("")
    return "\n".join(out)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: score_run.py <run_dir>", file=sys.stderr)
        return 2
    run_dir = Path(argv[1])
    if not run_dir.is_dir():
        print(f"run dir not found: {run_dir}", file=sys.stderr)
        return 2
    rounds = [read_round(run_dir, n) for n in range(1, 6)]
    if not all(rounds):
        missing = [n for n, r in enumerate(rounds, 1) if not r]
        print(f"missing round files: {missing}", file=sys.stderr)
        return 2

    scored: list[tuple[str, str, str, int, str]] = []
    total = 0
    for cid, short, plain, fn in CRITERIA:
        score, evidence = fn(rounds)
        scored.append((cid, short, plain, score, evidence))
        total += score

    sys.stdout.write(render_score_sheet(scored, total))
    sys.stdout.write(render_summary(scored, total))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
