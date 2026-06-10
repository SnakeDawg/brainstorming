"""Turn a closed issue-form issue into a knowledge-base document.

Reads the issue from environment variables (set by the issue-to-doc workflow),
parses the issue-form body (GitHub renders each form field as a
"### Field Label" markdown section), and writes the result into kb/:

  label "initiative" -> new doc in kb/strategy/  + row in its README table
  label "research"   -> new doc in kb/research/  + row in its README table
  label "feature"    -> row appended to the roadmap table in kb/roadmaps/

Run locally to test:
  ISSUE_TITLE="[Research] Example" ISSUE_BODY=$'### Question\n\nWhy?' \
  ISSUE_NUMBER=1 ISSUE_URL=http://example ISSUE_USER=someone \
  ISSUE_LABELS=kb,research python .github/scripts/issue_to_doc.py
"""

import datetime
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
ROADMAP = REPO_ROOT / "kb" / "roadmaps" / "customer-portal-roadmap.md"
ROADMAP_MARKER = "<!-- roadmap:append"

TITLE_PREFIXES = ("[Initiative]", "[Feature]", "[Research]")


def parse_form_body(body: str) -> dict[str, str]:
    """Split an issue-form body into {field label: value}."""
    sections: dict[str, str] = {}
    current = None
    lines: list[str] = []
    for line in body.splitlines():
        m = re.match(r"^### (.+)$", line)
        if m:
            if current is not None:
                sections[current] = "\n".join(lines).strip()
            current = m.group(1).strip()
            lines = []
        elif current is not None:
            lines.append(line)
    if current is not None:
        sections[current] = "\n".join(lines).strip()
    # GitHub renders empty optional fields as "_No response_"
    return {k: ("" if v == "_No response_" else v) for k, v in sections.items()}


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "untitled"


def clean_title(raw: str) -> str:
    title = raw.strip()
    for prefix in TITLE_PREFIXES:
        if title.startswith(prefix):
            title = title[len(prefix):].strip()
    return title or raw.strip()


def render_doc(title: str, sections: dict[str, str], user: str, url: str,
               date: str) -> str:
    parts = [
        f"# {title}",
        "",
        "- **Status:** done",
        f"- **Owner:** @{user}",
        f"- **Date:** {date}",
        f"- **Source:** {url}",
    ]
    for label, value in sections.items():
        if value:
            parts += ["", f"## {label}", "", value]
    return "\n".join(parts) + "\n"


def add_readme_row(readme: Path, row: str) -> None:
    """Append a row to the first markdown table in a section README."""
    text = readme.read_text()
    lines = text.splitlines()
    last_row = None
    in_table = False
    for i, line in enumerate(lines):
        if re.match(r"^\|[\s:-]+\|", line):  # the |---|---| separator
            in_table = True
        elif in_table and line.startswith("|"):
            last_row = i
        elif in_table and not line.startswith("|"):
            break
    if last_row is None:
        print(f"warning: no table found in {readme}, skipping index update")
        return
    lines.insert(last_row + 1, row)
    readme.write_text("\n".join(lines) + "\n")


def append_roadmap_row(item: str, issue_url: str, issue_number: str,
                       pillar: str) -> None:
    """Insert a row at the bottom of the table that sits above the marker."""
    lines = ROADMAP.read_text().splitlines()
    try:
        marker_idx = next(i for i, l in enumerate(lines) if ROADMAP_MARKER in l)
    except StopIteration:
        sys.exit(f"error: marker {ROADMAP_MARKER!r} not found in {ROADMAP}")
    row = f"| {item} | {pillar or '—'} | [#{issue_number}]({issue_url}) | done |"
    insert_at = marker_idx
    for i in range(marker_idx - 1, -1, -1):
        if lines[i].startswith("|"):
            insert_at = i + 1
            break
    lines.insert(insert_at, row)
    ROADMAP.write_text("\n".join(lines) + "\n")


def main() -> None:
    title = clean_title(os.environ["ISSUE_TITLE"])
    body = os.environ.get("ISSUE_BODY", "")
    number = os.environ["ISSUE_NUMBER"]
    url = os.environ["ISSUE_URL"]
    user = os.environ.get("ISSUE_USER", "unknown")
    labels = {l.strip() for l in os.environ.get("ISSUE_LABELS", "").split(",")}
    date = datetime.date.today().isoformat()

    if "kb" not in labels:
        print("issue is not labeled 'kb', nothing to do")
        return

    sections = parse_form_body(body)

    if "feature" in labels:
        supports = sections.get("Roadmap item this supports", "")
        item = title if not supports else f"{title} (supports: {supports})"
        append_roadmap_row(item, url, number, pillar="—")
        print(f"appended roadmap row for #{number}: {title}")
        return

    if "initiative" in labels:
        section_dir = REPO_ROOT / "kb" / "strategy"
    elif "research" in labels:
        section_dir = REPO_ROOT / "kb" / "research"
    else:
        print("kb issue without a type label (initiative/feature/research); skipping")
        return

    filename = f"{date}-{slugify(title)}.md"
    target = section_dir / filename
    target.write_text(render_doc(title, sections, user, url, date))
    add_readme_row(section_dir / "README.md",
                   f"| [{title}]({filename}) | done | @{user} |")
    print(f"wrote {target.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
