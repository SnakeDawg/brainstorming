#!/usr/bin/env python3
"""Validate every entry in the agents & skills catalog.

Usage:
    python catalog/scripts/validate_catalog.py [catalog_dir]

Checks:
    - marketplace.json parses and points at directories that exist
    - every plugin.json parses and has a name
    - every SKILL.md is valid (delegates to skill-validator)
    - every agent .md has required frontmatter (name, description)
    - every command .md has a description
    - hooks.json files parse as JSON

Exit codes:
    0  catalog is healthy
    1  one or more errors
    2  usage / IO error

Standard library only.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path
from types import ModuleType

REQUIRED_AGENT_KEYS = ("name", "description")
REQUIRED_COMMAND_KEYS = ("description",)


class Reporter:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, where: Path, msg: str) -> None:
        self.errors.append(f"ERROR  {where}: {msg}")

    def warn(self, where: Path, msg: str) -> None:
        self.warnings.append(f"WARN   {where}: {msg}")

    def ok(self) -> bool:
        return not self.errors


def parse_md_frontmatter(path: Path) -> dict[str, str] | None:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    raw = text[3:end].strip()
    fm: dict[str, str] = {}
    for line in raw.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        fm[key.strip()] = value.strip()
    return fm


def validate_marketplace(catalog: Path, report: Reporter) -> list[Path]:
    mp_path = catalog / ".claude-plugin" / "marketplace.json"
    if not mp_path.exists():
        report.error(mp_path, "missing marketplace.json")
        return []
    try:
        data = json.loads(mp_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        report.error(mp_path, f"invalid JSON: {e}")
        return []

    if "plugins" not in data:
        report.error(mp_path, "missing 'plugins' key")
        return []

    plugin_dirs: list[Path] = []
    for name, entry in data["plugins"].items():
        source = entry.get("source")
        if not source:
            report.error(mp_path, f"plugin {name!r} has no 'source'")
            continue
        if source.startswith(("http://", "https://", "git@")):
            continue  # remote, can't check locally
        target = (catalog / source).resolve()
        if not target.exists():
            report.error(mp_path, f"plugin {name!r} source does not exist: {source}")
            continue
        plugin_dirs.append(target)
    return plugin_dirs


def validate_plugin_json(plugin_dir: Path, report: Reporter) -> None:
    pj = plugin_dir / ".claude-plugin" / "plugin.json"
    if not pj.exists():
        report.warn(pj, "no plugin.json (optional but recommended)")
        return
    try:
        data = json.loads(pj.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        report.error(pj, f"invalid JSON: {e}")
        return
    if not data.get("name"):
        report.error(pj, "missing required field 'name'")


def load_skill_validator(catalog: Path) -> ModuleType | None:
    """Import skill-validator's validate_skill.py as a module.

    The module ships inside common-toolkit and can't be on the import path,
    so we load it by file location. Returns None if it isn't present, in
    which case validate_skill() falls back to a minimal in-process check.
    """
    path = (
        catalog
        / "plugins"
        / "common-toolkit"
        / "skills"
        / "skill-validator"
        / "scripts"
        / "validate_skill.py"
    )
    if not path.is_file():
        return None
    spec = importlib.util.spec_from_file_location("validate_skill", path)
    if spec is None or spec.loader is None:
        return None
    module = importlib.util.module_from_spec(spec)
    # Register before exec_module — dataclass type resolution looks the
    # module up in sys.modules during class creation.
    sys.modules["validate_skill"] = module
    spec.loader.exec_module(module)
    return module


def validate_skill(skill_md: Path, validator: ModuleType | None, report: Reporter) -> None:
    if validator is None:
        fm = parse_md_frontmatter(skill_md)
        if fm is None:
            report.error(skill_md, "missing or malformed frontmatter")
            return
        if not fm.get("description"):
            report.error(skill_md, "missing required frontmatter: description")
        return

    for issue in validator.validate(skill_md):
        if issue.level == "error":
            report.error(skill_md, str(issue).strip())
        else:
            report.warn(skill_md, str(issue).strip())


def validate_agent(agent_md: Path, report: Reporter) -> None:
    fm = parse_md_frontmatter(agent_md)
    if fm is None:
        report.error(agent_md, "missing or malformed frontmatter")
        return
    for key in REQUIRED_AGENT_KEYS:
        if not fm.get(key):
            report.error(agent_md, f"missing required frontmatter: {key}")
    desc = fm.get("description", "")
    if desc and len(desc) < 30:
        report.warn(
            agent_md,
            f"description is short ({len(desc)} chars); orchestrator may not pick this agent reliably",
        )


def validate_command(cmd_md: Path, report: Reporter) -> None:
    fm = parse_md_frontmatter(cmd_md)
    if fm is None:
        report.error(cmd_md, "missing or malformed frontmatter")
        return
    for key in REQUIRED_COMMAND_KEYS:
        if not fm.get(key):
            report.error(cmd_md, f"missing required frontmatter: {key}")
    if "allowed-tools" in fm and re.search(r"Bash\(\*\)", fm["allowed-tools"]):
        report.warn(cmd_md, "allowed-tools includes Bash(*) — prefer narrow patterns")


def validate_hooks_json(hooks_json: Path, report: Reporter) -> None:
    try:
        data = json.loads(hooks_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        report.error(hooks_json, f"invalid JSON: {e}")
        return
    if "hooks" not in data:
        report.error(hooks_json, "missing top-level 'hooks' key")


def validate_plugin(plugin_dir: Path, validator: ModuleType | None, report: Reporter) -> None:
    validate_plugin_json(plugin_dir, report)

    for skill_md in plugin_dir.glob("skills/*/SKILL.md"):
        validate_skill(skill_md, validator, report)
    for agent_md in plugin_dir.glob("agents/*.md"):
        validate_agent(agent_md, report)
    for cmd_md in plugin_dir.glob("commands/*.md"):
        validate_command(cmd_md, report)
    for hooks_json in plugin_dir.glob("hooks/hooks.json"):
        validate_hooks_json(hooks_json, report)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate the agents & skills catalog.")
    parser.add_argument(
        "catalog_dir",
        nargs="?",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Path to the catalog root (default: auto-detect from script location)",
    )
    args = parser.parse_args(argv)

    catalog = args.catalog_dir.resolve()
    if not catalog.is_dir():
        print(f"error: {catalog} is not a directory", file=sys.stderr)
        return 2

    report = Reporter()
    validator = load_skill_validator(catalog)
    plugin_dirs = validate_marketplace(catalog, report)
    for plugin_dir in plugin_dirs:
        validate_plugin(plugin_dir, validator, report)

    print(f"Catalog: {catalog}")
    print(f"Plugins checked: {len(plugin_dirs)}")
    for w in report.warnings:
        print(w)
    for e in report.errors:
        print(e)

    if report.ok():
        print(f"\nOK  {len(report.warnings)} warning(s), 0 error(s)")
        return 0
    print(f"\nFAIL  {len(report.warnings)} warning(s), {len(report.errors)} error(s)")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
