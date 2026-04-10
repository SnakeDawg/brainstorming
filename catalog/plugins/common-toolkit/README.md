# common-toolkit

Skills, commands, and hooks that any Claude Code session — main or subagent —
can pull from. The "everyone wants this" bucket of the catalog.

## What ships

| Item | Type | Purpose |
|---|---|---|
| `md-to-html` | skill | Convert a markdown file to standalone HTML via a bundled Python script |
| `skill-validator` | skill | Lint a `SKILL.md` file: required frontmatter, referenced files exist, descriptions usable |
| `/catalog-new` | command | Scaffold a new skill directory inside the catalog |
| `PostToolUse` log | hook | Append every Write/Edit to a tool-use log |

## Install

```
/plugin marketplace add snakedawg/brainstorming
/plugin install common-toolkit@brainstorming
```

## Use

After installing, ask Claude to use a skill by name or by intent:

> Convert `notes.md` to HTML.

> Validate the SKILL.md at `catalog/plugins/common-toolkit/skills/md-to-html/SKILL.md`.

Or run the slash command:

```
/catalog-new my-shiny-skill
```

## Layout

```
common-toolkit/
├── .claude-plugin/plugin.json
├── README.md
├── skills/
│   ├── md-to-html/
│   │   ├── SKILL.md
│   │   └── scripts/md_to_html.py
│   └── skill-validator/
│       ├── SKILL.md
│       ├── reference.md
│       └── scripts/validate_skill.py
├── commands/
│   └── catalog-new.md
└── hooks/
    ├── hooks.json
    └── scripts/log-tool-use.sh
```
