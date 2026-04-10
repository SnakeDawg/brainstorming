# Training 5 — Plugins

A **plugin** is the distribution unit. It bundles skills, subagents, slash
commands, hooks, and (optionally) MCP servers into one directory that users
install with a single command.

The catalog itself is a **plugin marketplace** — a git repo whose
`.claude-plugin/marketplace.json` advertises a list of plugins.

## Directory layout

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # metadata (optional but recommended)
├── README.md                # user-facing description
├── skills/
│   └── <skill-name>/
│       └── SKILL.md
├── agents/
│   └── <agent-name>.md
├── commands/
│   └── <command-name>.md
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       └── ...
├── .mcp.json                # optional: MCP server config
└── bin/                     # optional: executables
```

Anything missing is fine — a plugin can be just skills, or just hooks, or just
agents.

## plugin.json reference

Only `name` is strictly required. Recommended fields:

```json
{
  "name": "common-toolkit",
  "version": "0.1.0",
  "description": "Common skills usable by the main session or any subagent.",
  "author": { "name": "Brainstorming Catalog" },
  "homepage": "https://github.com/snakedawg/brainstorming",
  "repository": "https://github.com/snakedawg/brainstorming",
  "license": "MIT",
  "keywords": ["skills", "common", "validator"],
  "skills": "./skills/",
  "commands": "./commands/",
  "hooks": "./hooks/hooks.json",
  "userConfig": {
    "log_dir": {
      "description": "Directory for tool-use logs.",
      "default": "/tmp/claude-tooluse"
    }
  }
}
```

`userConfig` lets users supply per-install secrets and settings without
editing files. Reference them in scripts as `${PLUGIN_USER_CONFIG_LOG_DIR}`.

## marketplace.json reference

```json
{
  "marketplace": {
    "name": "brainstorming",
    "description": "Agents & Skills Catalog",
    "homepage": "https://github.com/snakedawg/brainstorming"
  },
  "plugins": {
    "common-toolkit": {
      "name": "common-toolkit",
      "description": "Common reusable skills.",
      "version": "0.1.0",
      "source": "./plugins/common-toolkit"
    }
  }
}
```

`source` can be:

- A relative path (`./plugins/common-toolkit`) — for monorepos like this catalog
- A git URL (`https://github.com/user/another.git`) — for external plugins

## Installing

```
/plugin marketplace add snakedawg/brainstorming
/plugin install common-toolkit@brainstorming
```

The `@brainstorming` suffix disambiguates if the same plugin name exists in
multiple marketplaces.

## Updating

```
/plugin update common-toolkit@brainstorming
```

Pulls the latest from git and re-registers.

## Uninstalling

```
/plugin uninstall common-toolkit@brainstorming
```

## Versioning

Use semver in `plugin.json` and bump it on every change. Mention breaking
changes in the plugin's README so users know when an update needs review.

## Security

- Plugins **cannot** define `mcpServers` per agent or set `permissionMode` —
  these are blocked at install time to prevent privilege escalation.
- Hook scripts run with the same permissions as Claude Code itself. Review
  them before installing third-party plugins.
- Use `userConfig` for secrets. Never commit them.

## A real example

See [`../../plugins/common-toolkit/`](../../plugins/common-toolkit/) and
[`../../plugins/review-team/`](../../plugins/review-team/) for the catalog's
two reference plugins.
