# Getting Started

Five minutes from "I have Claude Code" to "I'm running a skill from this catalog."

## Prerequisites

- Claude Code installed (`claude` on the command line, or any IDE extension).
- Git access to `snakedawg/brainstorming`.

## 1. Add the marketplace

Inside any Claude Code session:

```
/plugin marketplace add snakedawg/brainstorming
```

Claude Code clones the repo, reads `catalog/.claude-plugin/marketplace.json`,
and lists every plugin it advertises.

## 2. Install a plugin

```
/plugin install common-toolkit@brainstorming
```

This pulls the `common-toolkit` plugin and registers its skills, commands, and
hooks for the current session. Repeat for any other plugin in the catalog:

```
/plugin install review-team@brainstorming
```

## 3. Try a skill

The `common-toolkit` plugin ships a `skill-validator` skill. Ask Claude to use
it on any SKILL.md file:

> Use the skill-validator skill on `catalog/plugins/common-toolkit/skills/md-to-html/SKILL.md`

Claude detects the skill from its `description`, loads the SKILL.md, and runs
the supporting validator script.

## 4. Try a subagent

After installing `review-team`, ask the orchestrator to delegate:

> Have the security-reviewer subagent look at `src/auth/login.ts` and report
> any concerns. Under 200 words.

Claude spawns the `security-reviewer` subagent (defined in
`plugins/review-team/agents/security-reviewer.md`) in a fresh context window
and returns its report to the main session.

## 5. Try a slash command

`common-toolkit` registers `/catalog-new`, which scaffolds a new skill
directory inside the catalog:

```
/catalog-new my-new-skill
```

## 6. Uninstall (when needed)

```
/plugin uninstall common-toolkit@brainstorming
```

## Where to go next

- **Use it**: [`integrate-and-use.md`](integrate-and-use.md) — wiring catalog
  items into a real project's `.claude/` directory.
- **Learn the parts**: [`training/01-subagents.md`](training/01-subagents.md)
  through [`training/06-teams.md`](training/06-teams.md).
- **Contribute**: [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
