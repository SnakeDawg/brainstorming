# Integrating Catalog Items Into Your Project

Three ways to use the catalog, depending on how tightly you want to couple your
project to it.

## Option A — Install the plugin (recommended)

Best for: most users, most projects.

```
/plugin marketplace add snakedawg/brainstorming
/plugin install common-toolkit@brainstorming
```

The plugin lives in Claude Code's plugin cache. You get updates by running
`/plugin update common-toolkit@brainstorming`. Nothing is copied into your
project tree.

**Pros:** Single source of truth, automatic updates, no merge conflicts.
**Cons:** Requires every team member to install separately.

## Option B — Vendor specific items into `.claude/`

Best for: when you want a skill or subagent to be checked into your project so
new clones get it for free.

```bash
mkdir -p .claude/skills .claude/agents .claude/commands
cp -r catalog/plugins/common-toolkit/skills/skill-validator .claude/skills/
cp catalog/plugins/review-team/agents/security-reviewer.md .claude/agents/
```

Claude Code automatically discovers anything under `.claude/` in the project
root. Commit those files to git so the whole team picks them up on `git pull`.

**Pros:** Zero install step for teammates, project-pinned versions.
**Cons:** Updates require manual re-copy. Easy to drift from upstream.

## Option C — Reference catalog as a git submodule

Best for: tightly-coupled monorepos that want pinned versions but easy
upgrades.

```bash
git submodule add https://github.com/snakedawg/brainstorming.git vendor/brainstorming
ln -s ../vendor/brainstorming/catalog/plugins/common-toolkit/skills/skill-validator .claude/skills/skill-validator
```

Pinning to a specific commit gives reproducible builds. `git submodule update
--remote` brings in upstream changes when you're ready.

## Wiring a catalog skill to a subagent

You can preload a catalog skill into a subagent definition by adding it to the
agent's frontmatter:

```yaml
---
name: doc-writer
description: Generates HTML release notes from markdown changelogs.
model: sonnet
tools: Read, Write, Bash
skills: md-to-html
---
You write release notes...
```

Now anytime the orchestrator delegates to `doc-writer`, the `md-to-html` skill
is preloaded into that subagent's context.

## Wiring a catalog hook into your project

Hooks live in `.claude/hooks.json`. To re-use a hook from a catalog plugin,
copy its entry:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/log-tool-use.sh" }
        ]
      }
    ]
  }
}
```

Or just install the plugin — its hooks register automatically.

## Picking the right option

| If you... | Use option |
|---|---|
| Want updates with one command | A (plugin install) |
| Need new clones to "just work" | B (vendor into `.claude/`) |
| Need pinned, reproducible builds | C (submodule) |
