#!/usr/bin/env python3
"""Validate a Claude Code SKILL.md file.

Usage:
    validate_skill.py <path/to/SKILL.md>

Exit codes:
    0  valid (warnings allowed)
    1  one or more errors
    2  usage / IO error

Standard library only. The full rule list lives in the sibling reference.md.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

KNOWN_KEYS = frozenset(
    {
        "name",
        "description",
        "allowed-tools",
        "disable-model-invocation",
        "user-invocable",
        "model",
        "effort",
        "context",
        "agent",
        "paths",
        "shell",
        "argument-hint",
    }
)

TRIGGER_PHRASES = ("use when", "when the user", "when you need", "when asked")

# Compiled once, reused on every validate() call.
_SKILL_DIR_REF = re.compile(r"\$\{CLAUDE_SKILL_DIR\}/([^\s`)\"']+)")


Level = Literal["error", "warning"]


@dataclass(frozen=True)
class Issue:
    level: Level
    code: str
    message: str

    def __str__(self) -> str:
        return f"  [{self.level.upper()} {self.code}] {self.message}"


def parse_frontmatter(text: str) -> tuple[dict[str, str] | None, str, list[Issue]]:
    issues: list[Issue] = []

    if not text.startswith("---"):
        issues.append(Issue("error", "F001", "Missing opening '---' frontmatter marker"))
        return None, text, issues

    end = text.find("\n---", 3)
    if end == -1:
        issues.append(Issue("error", "F001", "Missing closing '---' frontmatter marker"))
        return None, text, issues

    raw = text[3:end].strip()
    body = text[end + 4 :].lstrip("\n")

    fm: dict[str, str] = {}
    for line in raw.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            issues.append(Issue("error", "F001", f"Frontmatter line not key:value: {line!r}"))
            continue
        key, _, value = line.partition(":")
        fm[key.strip()] = value.strip()

    return fm, body, issues


def check_frontmatter(fm: dict[str, str]) -> list[Issue]:
    issues: list[Issue] = []

    if not fm.get("name"):
        issues.append(Issue("error", "F002", "Missing required field: name"))

    desc = fm.get("description", "")
    if not desc:
        issues.append(Issue("error", "F003", "Missing required field: description"))
    else:
        if len(desc) < 30:
            issues.append(
                Issue("error", "F004", f"Description too short ({len(desc)} chars; need >=30)")
            )
        if not any(p in desc.lower() for p in TRIGGER_PHRASES):
            issues.append(
                Issue(
                    "warning",
                    "F005",
                    "Description has no trigger phrase ('use when', 'when the user', ...)",
                )
            )
        if "this skill" in desc.lower():
            issues.append(
                Issue("warning", "W001", "Description self-references ('this skill ...')")
            )

    for key in fm:
        if key not in KNOWN_KEYS:
            issues.append(Issue("warning", "F006", f"Unknown frontmatter key: {key}"))

    if "allowed-tools" in fm:
        if "," in fm["allowed-tools"]:
            issues.append(
                Issue(
                    "error",
                    "F007",
                    "allowed-tools must be space-separated, not comma-separated",
                )
            )
        if "Bash" in fm["allowed-tools"].split():
            issues.append(
                Issue(
                    "warning",
                    "W003",
                    "allowed-tools includes bare 'Bash' (no constraint); prefer Bash(cmd *) patterns",
                )
            )

    return issues


def check_body(body: str, skill_dir: Path) -> list[Issue]:
    issues: list[Issue] = []
    stripped = body.strip()

    if not stripped:
        issues.append(Issue("error", "B001", "Body is empty"))
        return issues

    if len(stripped) < 100:
        issues.append(
            Issue(
                "warning",
                "B003",
                f"Body is very short ({len(stripped)} chars); skills usually need more instruction",
            )
        )

    for match in _SKILL_DIR_REF.finditer(body):
        rel = match.group(1).rstrip(".,;:")
        if not (skill_dir / rel).exists():
            issues.append(Issue("error", "B002", f"Referenced file does not exist: {rel}"))

    return issues


def validate(path: Path) -> list[Issue]:
    text = path.read_text(encoding="utf-8")
    fm, body, issues = parse_frontmatter(text)
    if fm is None:
        return issues
    issues.extend(check_frontmatter(fm))
    issues.extend(check_body(body, path.parent))
    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate a Claude Code SKILL.md file.")
    parser.add_argument("path", type=Path, help="Path to a SKILL.md file")
    args = parser.parse_args(argv)

    if not args.path.is_file():
        print(f"error: {args.path} not found", file=sys.stderr)
        return 2

    issues = validate(args.path)
    errors = [i for i in issues if i.level == "error"]
    warnings = [i for i in issues if i.level == "warning"]

    if not issues:
        print(f"OK  {args.path}")
        return 0

    print(f"{args.path}")
    for i in issues:
        print(i)
    print(f"  -> {len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
