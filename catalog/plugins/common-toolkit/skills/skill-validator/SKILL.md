---
name: skill-validator
description: Validate a Claude Code SKILL.md file. Use when the user asks to lint, check, validate, or sanity-check a skill they've written or are about to commit. Catches missing frontmatter, broken script references, and useless descriptions.
allowed-tools: Read Bash(python3 *)
argument-hint: <path/to/SKILL.md>
---

# skill-validator

Lints a `SKILL.md` file against the rules from `docs/training/02-skills.md`.
The companion to `skill-creator` — use this every time you author or edit a
skill before committing it.

## When to use

- After writing a new skill, before opening a PR.
- When a skill isn't activating as expected and you suspect frontmatter issues.
- As a CI gate over the catalog (`scripts/validate_catalog.py` calls into
  this script under the hood).

## Steps

1. **Read the SKILL.md.** Use the Read tool so you can also show the user any
   lines the validator complains about.

2. **Run the validator script.** Bundled with the skill, standard library only:
   ```bash
   python3 ${CLAUDE_SKILL_DIR}/scripts/validate_skill.py <path/to/SKILL.md>
   ```

3. **Interpret exit codes:**
   - `0` — pass
   - `1` — errors found (output to stderr)
   - `2` — usage error (path missing, file not found)

4. **Report back.** Summarize each error in plain language and propose a fix.
   If the user wants, edit the file to apply the fixes — but always show the
   diff first.

## What the validator checks

The detailed rule list lives in `reference.md`. The high-level categories:

- **Frontmatter parses.** YAML-ish header between `---` markers, valid keys.
- **Required fields present.** `name` and `description` are required for any
  skill that wants Claude to auto-invoke it.
- **Description quality.** A description shorter than 30 characters or
  missing trigger phrases ("use when", "when the user") gets a warning — it
  won't auto-invoke reliably.
- **Referenced files exist.** Any `${CLAUDE_SKILL_DIR}/...` reference in the
  body must resolve to a real file in the skill directory.
- **`allowed-tools` syntax.** Space-separated, no commas.
- **Body non-empty.** A skill with no instructions is just frontmatter.

For the full rule list and examples of each failure mode, read `reference.md`.

## Exit code contract

This skill is designed to be wrappable in a hook or CI step. The script's
exit codes are stable:

| Code | Meaning |
|---|---|
| 0 | Skill is valid |
| 1 | One or more errors |
| 2 | Usage / IO error |
