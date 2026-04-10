# First-Party Anthropic Skills

Anthropic publishes a set of their own Claude Code skills in a separate
marketplace: [`anthropics/skills`](https://github.com/anthropics/skills).
Rather than copy those skills into this catalog (license reasons — see
below), we point you at the official install path. Adding Anthropic's
marketplace alongside ours takes one command and gets you everything they
publish, automatically updated when they publish new versions.

## Install in one command

Inside any Claude Code session:

```
/plugin marketplace add anthropics/skills
```

After that, their plugins show up in `/plugin install` alongside ours.
Common ones:

```
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

## What's in the upstream marketplace

| Skill | What it does | License |
|---|---|---|
| **`pdf`** | Read/extract text and tables from PDFs, merge, split, rotate, watermark, create, fill forms, encrypt/decrypt, extract images, OCR | Anthropic proprietary (source-available) |
| **`docx`** | Create, read, and edit Word documents with formatting, tables, images, tracked changes | Anthropic proprietary |
| **`xlsx`** | Open/edit/create/convert Excel spreadsheets with formulas, formatting | Anthropic proprietary |
| **`pptx`** | Create, read, edit, and combine PowerPoint presentations, work with templates | Anthropic proprietary |
| **`claude-api`** | Build, debug, and optimize Claude API / Anthropic SDK applications; prompt caching, structured outputs | Apache 2.0 |
| **`mcp-builder`** | Author high-quality MCP servers exposing tools to LLMs | Apache 2.0 |
| **`webapp-testing`** | Toolkit for interacting with local web apps via Playwright for frontend verification and UI debugging | Apache 2.0 |
| **`skill-creator`** | Create, modify, and benchmark skills themselves — meta-tooling for skill authorship | Apache 2.0 |
| **`doc-coauthoring`** | Structured workflow for collaboratively authoring documentation (gather context, iterate, reader-test) | Apache 2.0 |
| **`internal-comms`** | Write company internal comms in standardized formats — status updates, newsletters, FAQs, general comms | Apache 2.0 |
| **`brand-guidelines`** | Brand style enforcement | Apache 2.0 |
| **`algorithmic-art`**, **`canvas-design`**, **`frontend-design`**, **`theme-factory`**, **`web-artifacts-builder`**, **`slack-gif-creator`** | Creative / UI / design-generation skills | Apache 2.0 |

For the definitive list and current contents, see
[github.com/anthropics/skills](https://github.com/anthropics/skills).

## Why we point instead of copy

Two of those skills (`pdf`/`docx`/`xlsx`/`pptx`) are published under an
Anthropic proprietary license — you can install and use them via
Anthropic's marketplace, but the LICENSE.txt on each skill prohibits
extracting, copying, or redistributing them as part of another project. The
rest are Apache 2.0, which we could vendor, but pointing at the upstream
source gives you three things copying wouldn't:

1. **Automatic updates** — when Anthropic ships a new version, you get it
   by running `/plugin update ...`, not by waiting for us to re-vendor.
2. **Zero maintenance burden on us** — this catalog stays focused on the
   skills *your organization* authors.
3. **Consistent install story** — one command adds the whole upstream
   catalog, same pattern as adding ours.

## The full install flow for a new developer

A first-time Claude Code user at your org goes from zero to "everything
installed" in four commands:

```
# Our internal catalog (this repo)
/plugin marketplace add snakedawg/brainstorming
/plugin install common-toolkit@brainstorming
/plugin install review-team@brainstorming

# Anthropic's official skills (PDF, Office, dev tools, design)
/plugin marketplace add anthropics/skills
```

That's it. From that point on, `/plugin install` shows both marketplaces
and the developer can pick and choose what they need. You don't have to
install every Anthropic plugin up front — many are installed on demand
when a project actually needs them.

## "Do I install one of Anthropic's skills, or build my own?"

A rough decision tree:

| You need to... | Use |
|---|---|
| Read, write, or manipulate PDFs, Word docs, Excel, or PowerPoint | Anthropic's `pdf` / `docx` / `xlsx` / `pptx` |
| Build or debug Claude API integrations | Anthropic's `claude-api` |
| Write or review MCP servers | Anthropic's `mcp-builder` |
| Test a web frontend with Playwright | Anthropic's `webapp-testing` |
| Create a new skill (with benchmarking support) | Anthropic's `skill-creator` |
| Lint or sanity-check a SKILL.md before committing | **Our** `skill-validator` |
| Code review against our team's conventions | **Our** `review-team` |
| Anything touching your org's proprietary data, internal systems, or business logic | **Build your own** — see [`training/01-subagents.md`](training/01-subagents.md) and [`training/02-skills.md`](training/02-skills.md) |

The rule of thumb: **if the skill could help any Claude Code user in the
world, check if Anthropic already built it. If the skill encodes your
organization's workflows or touches your data, build it here.**

## Troubleshooting

**"Plugin install failed"** — Make sure you've added the marketplace first
(`/plugin marketplace add anthropics/skills`). Marketplaces are separate
from plugins; adding one doesn't install anything until you `/plugin
install` a specific plugin from it.

**"I can see the skill but it's not activating"** — Skills activate when
Claude decides they match the current request. Either describe your task
more explicitly ("use the pdf skill to extract text from notes.pdf") or
check the skill's `description` field — if it doesn't mention your use
case, Claude may not pick it.

**"I'm on an air-gapped network and can't reach github.com"** — Talk to
your IT team about mirroring the marketplace internally. For the
Apache-licensed skills, internal mirrors are explicitly allowed under
Apache 2.0. For the proprietary office skills, contact Anthropic support
or your organization's legal team before setting up an internal mirror —
the proprietary LICENSE.txt doesn't clearly speak to that scenario.

## See also

- [`getting-started.md`](getting-started.md) — full install walkthrough
- [`concepts.md`](concepts.md) — what "skill", "plugin", "marketplace" mean
  if any of this is unfamiliar
- [`training/05-plugins.md`](training/05-plugins.md) — how plugins and
  marketplaces work under the hood
