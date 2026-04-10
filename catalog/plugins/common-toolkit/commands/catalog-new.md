---
description: Scaffold a new skill directory inside the catalog with starter SKILL.md and scripts/.
argument-hint: <skill-name> [common|<team>]
allowed-tools: Bash(mkdir *) Bash(test *) Write
---

Create a new skill scaffold inside the catalog.

**Argument 1 (`$1`)**: skill name (lowercase-with-hyphens). Required.
**Argument 2 (`$2`)**: bucket — `common` (default) for `plugins/common-toolkit/skills/`,
or a team name for `plugins/<team>/skills/`. Optional.

Steps:

1. If `$1` is empty, stop and tell the user the command needs a skill name.

2. Compute the target directory:
   - If `$2` is empty or `common`: `catalog/plugins/common-toolkit/skills/$1/`
   - Otherwise: `catalog/plugins/$2/skills/$1/`

3. If the target directory already exists, stop and tell the user — do not
   overwrite existing skills.

4. Create the directory and a `scripts/` subdirectory:
   ```bash
   mkdir -p <target>/scripts
   ```

5. Write a starter `SKILL.md` at `<target>/SKILL.md` with this content
   (substituting `$1` for the name):

   ```markdown
   ---
   name: $1
   description: TODO — one sentence describing what this skill does and when to use it. Include a "use when" trigger phrase.
   allowed-tools: Read
   ---

   # $1

   TODO: explain when this skill activates and what steps Claude should take.

   ## Steps

   1. ...
   2. ...
   3. ...
   ```

6. Print:
   - The path of the new SKILL.md
   - A reminder to fill in the `description` field before committing
   - A reminder to run the skill-validator skill on the file when ready

Do **not** add the new skill to `marketplace.json` — that's only needed for
brand-new plugins, not new skills inside existing plugins.
