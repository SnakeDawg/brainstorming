# Agents & Skills Catalog

A curated, installable collection of Claude Code building blocks — **subagents,
skills, slash commands, hooks, and plugin "teams"** — published as a single
plugin marketplace.

The goal is to give a team a shared, versioned catalog of reusable Claude Code
behavior, so any developer can run one command and get the same agents, skills,
and automations everyone else uses.

## What's in here

```
catalog/
├── .claude-plugin/
│   └── marketplace.json        # Exposes every plugin below as installable
├── docs/
│   ├── getting-started.md      # Install + first use
│   ├── integrate-and-use.md    # Wiring catalog items into a project
│   ├── training/               # Concept-by-concept walkthroughs
│   │   ├── 01-subagents.md
│   │   ├── 02-skills.md
│   │   ├── 03-hooks.md
│   │   ├── 04-slash-commands.md
│   │   ├── 05-plugins.md
│   │   └── 06-teams.md
│   └── patterns/
│       └── common-vs-subagent-skills.md
├── plugins/
│   ├── common-toolkit/         # Skills + commands + hooks usable anywhere
│   │   ├── skills/
│   │   │   ├── md-to-html/         # COMMON skill — main agent or any subagent
│   │   │   └── skill-validator/    # COMMON skill — lints SKILL.md files
│   │   ├── commands/catalog-new.md
│   │   └── hooks/hooks.json
│   └── review-team/            # A "team" plugin: bundled subagents
│       ├── agents/
│       │   ├── security-reviewer.md
│       │   ├── perf-reviewer.md
│       │   └── test-coverage-analyst.md
│       ├── skills/
│       │   └── triage-findings/    # SUBAGENT-ONLY skill
│       └── commands/review-pr.md
├── scripts/
│   └── validate_catalog.py     # CI-ready validator for every entry
└── CONTRIBUTING.md
```

## Two flavors of skills

The catalog distinguishes two skill audiences. The distinction is convention,
not enforced by Claude Code itself — it's how we keep the catalog navigable.

| Flavor | Lives in | Used by | Examples |
|---|---|---|---|
| **Common** | `plugins/common-toolkit/skills/` | Main session **or** any subagent | `md-to-html`, `skill-validator` |
| **Subagent-only** | `plugins/<team>/skills/` | A specific subagent in that team | `triage-findings` (used by review-team agents) |

See [`docs/patterns/common-vs-subagent-skills.md`](docs/patterns/common-vs-subagent-skills.md)
for when to pick which.

## Quick install

```bash
# 1. Add this repo as a marketplace
/plugin marketplace add snakedawg/brainstorming

# 2. Install a plugin from the catalog
/plugin install common-toolkit@brainstorming
/plugin install review-team@brainstorming
```

After install, the new skills appear under `/skills`, slash commands under `/`,
and subagents become available to the `Agent` tool by name.

## Learning path

1. [`docs/getting-started.md`](docs/getting-started.md) — install the catalog, run one skill.
2. [`docs/training/01-subagents.md`](docs/training/01-subagents.md) — what a subagent is and how to write one.
3. [`docs/training/02-skills.md`](docs/training/02-skills.md) — SKILL.md format and progressive disclosure.
4. [`docs/training/03-hooks.md`](docs/training/03-hooks.md) — automated behavior on tool events.
5. [`docs/training/04-slash-commands.md`](docs/training/04-slash-commands.md) — user-invocable commands.
6. [`docs/training/05-plugins.md`](docs/training/05-plugins.md) — bundling everything.
7. [`docs/training/06-teams.md`](docs/training/06-teams.md) — multi-subagent plugins ("teams").

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version:

1. Branch from `main`.
2. Add a new entry under the right `plugins/<plugin>/...` directory.
3. Run `python catalog/scripts/validate_catalog.py` until it's green.
4. Add the plugin to `.claude-plugin/marketplace.json` if it's new.
5. Open a PR.
