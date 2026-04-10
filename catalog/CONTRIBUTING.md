# Contributing to the Agents & Skills Catalog

Thanks for adding to the catalog. The rules below keep entries discoverable,
installable, and trustworthy for everyone else on the team.

## Ground rules

1. **One concept per directory.** A skill, subagent, or command should do one
   thing well. Bundle related items into the same plugin instead of inflating
   one entry.
2. **Frontmatter is non-negotiable.** Every `SKILL.md`, agent, and command file
   must include the required frontmatter (see training docs). The validator
   will fail your PR otherwise.
3. **Common vs. subagent-only is a contract.** If a skill lives in
   `plugins/common-toolkit/skills/`, it must work both in the main session and
   inside any subagent. Subagent-only skills go in their team plugin.
4. **No secrets.** Never commit API keys, tokens, or customer data — even in
   examples. Use `userConfig` in `plugin.json` for anything sensitive.
5. **Scripts must be self-contained.** Any `scripts/` file should run with only
   the Python/Bash standard library, or declare its dependency clearly in the
   skill's `SKILL.md`.

## Adding a new skill

1. Pick a plugin to host it. If it's reusable everywhere, put it in
   `plugins/common-toolkit/skills/<skill-name>/`. Otherwise create or extend a
   team plugin under `plugins/<team>/skills/<skill-name>/`.
2. Create `SKILL.md` with required frontmatter:
   ```yaml
   ---
   name: my-skill
   description: One sentence describing WHEN to use this skill.
   allowed-tools: Read Grep Bash
   ---
   ```
3. Add any reference docs (`reference.md`, `examples.md`) and supporting
   `scripts/`. Keep `SKILL.md` itself short — use progressive disclosure.
4. Run the validator:
   ```bash
   python catalog/scripts/validate_catalog.py
   ```

## Adding a new subagent

1. Drop the file in `plugins/<team>/agents/<agent-name>.md`.
2. Required frontmatter:
   ```yaml
   ---
   name: agent-name
   description: When the orchestrator should delegate to this agent.
   model: sonnet
   tools: Read, Grep, Glob, Bash
   ---
   ```
3. Body of the file is the agent's system prompt. Be specific about scope and
   what the agent should NOT do.

## Adding a new slash command

1. File location: `plugins/<plugin>/commands/<command-name>.md`.
2. Required frontmatter:
   ```yaml
   ---
   description: One-line summary shown in the / menu.
   argument-hint: [optional args]
   allowed-tools: Bash(git *) Read Edit
   ---
   ```
3. Use `$ARGUMENTS`, `$1`, `$2` etc. for argument substitution in the body.

## Adding hooks

Edit `plugins/<plugin>/hooks/hooks.json`. Keep matchers narrow — a hook that
fires on every `Bash` call will quickly become noise. See
`docs/training/03-hooks.md` for the event catalog.

## Publishing a brand-new plugin

1. Create `plugins/<your-plugin>/.claude-plugin/plugin.json` with at minimum a
   `name`, `version`, and `description`.
2. Add an entry to `catalog/.claude-plugin/marketplace.json` pointing at
   `./plugins/<your-plugin>`.
3. Re-run the validator.
4. Document the plugin in its own `plugins/<your-plugin>/README.md`.

## PR checklist

- [ ] `python catalog/scripts/validate_catalog.py` passes
- [ ] New plugin (if any) is registered in `marketplace.json`
- [ ] No secrets, tokens, or customer data
- [ ] Skill / agent / command has a clear, single responsibility
- [ ] Training doc updated if you added a new concept
