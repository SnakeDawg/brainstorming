# Agents & Skills Catalog

**A shared library of ready-to-install AI capabilities for our engineering
team.** If you've never used Claude Code before, start here. This one page
is designed to tell you everything you need to go from "I don't know what
this is" to "I installed it and it's working" in about ten minutes, without
assuming you've read the official Claude docs.

> **You do not need to be a developer to follow this doc.** If you're a
> PM, designer, analyst, or anyone else who's been handed a terminal and
> told to try Claude Code, this is written for you. Every term that might
> be unfamiliar is either explained inline or linked to
> [`docs/concepts.md`](docs/concepts.md) — the plain-English glossary.

---

## 1. What is this, really?

**Claude Code** is a version of Claude (Anthropic's AI) that runs on your
computer, in your terminal, with permission to read your files, run
commands, and make edits. It's like having Claude sitting next to you
looking at the same screen — not a chat window where you copy and paste
code back and forth.

**This catalog** is a collection of add-ons for Claude Code that our team
maintains. The add-ons come in a few shapes — **skills**, **subagents**,
**slash commands**, **hooks**, and **plugins** that bundle them together
— and they exist so that when a new person at our org installs Claude
Code, they can run two commands and get the same set of tools,
conventions, and automations everyone else uses. Nobody has to rebuild
the wheel.

**What's inside today:**

- **`common-toolkit`** — general-purpose skills anyone can use: a
  Markdown-to-HTML converter, a SKILL.md linter, a `/catalog-new`
  command for scaffolding new skills, and a hook that logs every file
  edit Claude makes.
- **`review-team`** — three specialized code-reviewer AIs (security,
  performance, test coverage) plus a `/review-pr` command that runs all
  three in parallel and merges their findings.
- **Training docs + glossary + best practices** — everything in
  [`docs/`](docs/), written so a non-technical reader can follow along.

And pointed at from this catalog, not hosted inside it:

- **Anthropic's official skills** for PDFs, Word docs, Excel,
  PowerPoint, Claude API development, MCP servers, and more. See
  [`docs/anthropic-skills.md`](docs/anthropic-skills.md) — one extra
  install command and you have them all.

---

## 2. The ten-second vocabulary

If any of these words are unfamiliar, read
[`docs/concepts.md`](docs/concepts.md) first — it has real-world
analogies for each one. The short versions:

| Term | Plain English |
|---|---|
| **Skill** | A reusable instruction sheet Claude can pull up on demand ("when someone asks to convert Markdown to HTML, do these steps"). |
| **Subagent** | A specialist Claude with its own narrow job — runs in its own private conversation, reports back with just the result. |
| **Hook** | An automatic action the system runs on an event (e.g. "every time Claude edits a file, log it"). |
| **Slash command** | A keyboard shortcut for a recurring task — type `/review-pr 123` instead of a long instruction. |
| **Plugin** | A bundle of the above things, installable as one unit. |
| **Marketplace** | A collection of plugins someone has published. This catalog is one. |

---

## 3. Install everything in four commands

Inside any Claude Code session (after you've installed Claude Code itself
— see [claude.com/docs](https://docs.claude.com/en/docs/claude-code/overview)
if you haven't):

```
# Our team's catalog (this repo)
/plugin marketplace add snakedawg/brainstorming
/plugin install common-toolkit@brainstorming
/plugin install review-team@brainstorming

# Anthropic's official first-party skills (PDF, Word, Excel, and more)
/plugin marketplace add anthropics/skills
```

That's it. The first three commands install everything this catalog
ships. The fourth adds Anthropic's marketplace so you can `/plugin
install` their PDF skill, document skills, etc., whenever a project
actually needs them. You don't have to install every Anthropic skill up
front — browse `/plugin install` to see the list and pick what you need.

For a longer walkthrough with troubleshooting, see
[`docs/getting-started.md`](docs/getting-started.md).

---

## 4. Your first five minutes

After installing, try one of each kind of thing:

**Try a skill.** Ask Claude something that matches a skill's purpose:

> Validate the skill at `catalog/plugins/common-toolkit/skills/md-to-html/SKILL.md`.

Claude sees this matches the `skill-validator` skill (description: "use
when the user asks to lint, check, or validate a skill"), loads the
instructions, runs the validator script, and reports back.

**Try a subagent.** Ask the main Claude to hand off to a specialist:

> Have the security-reviewer subagent take a look at `src/auth/login.ts`.
> Keep the report under 200 words.

Claude spawns a fresh `security-reviewer` conversation in its own
context window, does the review, and returns just the findings to you.
All the intermediate noise (file reads, grepping around) stays out of
your main conversation.

**Try a slash command.** Type:

```
/catalog-new my-first-skill
```

The `catalog-new` command scaffolds a new skill directory for you so
you can start authoring.

**Try installing an Anthropic skill.** If you need to work with a PDF:

```
/plugin install document-skills@anthropic-agent-skills
```

Then ask Claude: "Extract the text from `notes.pdf` and summarize the
main points." Claude will use Anthropic's official `pdf` skill for you.

---

## 5. The three ways to use this catalog

This is the key mental model. Every Claude Code task you run at our org
falls into one of three buckets, and the right move depends on which
bucket you're in.

### Path A — Use what's already here

For things our team ships in this catalog (`common-toolkit`,
`review-team`), just install and use. These are the team-vetted tools
for common work.

> **Example:** You need to review a pull request. Don't write a custom
> review prompt — run `/review-pr 123` and let the review-team subagents
> do it with our org's standard rubric.

### Path B — Install from Anthropic's marketplace

For widely-useful capabilities like reading PDFs, editing Word docs,
working with Excel sheets, building MCP servers, or testing web apps
with Playwright — Anthropic already wrote and maintains those. Don't
rebuild them. Install from their marketplace with one command.

> **Example:** You need to extract data from a client's PDF report.
> Don't write a PDF parser — run `/plugin install
> document-skills@anthropic-agent-skills` and ask Claude to extract it.
> See [`docs/anthropic-skills.md`](docs/anthropic-skills.md) for the
> full list.

### Path C — Build your own (for proprietary or internal work)

For anything that touches **your org's internal systems, business
logic, or sensitive data** — build your own skill or subagent in this
catalog. That's what this repo is *really* for: a place to capture the
institutional knowledge that isn't in any public marketplace.

> **Example:** You want an AI that analyzes customer records to flag
> patterns in churn behavior. The records contain PII. You cannot and
> should not send that data to a generic public skill, and no one else
> has written this specific thing. **Build it here.** It becomes a new
> skill or subagent in its own plugin, reviewed by the team, and
> reusable by everyone at the org without re-explaining the business
> logic every time.
>
> Walkthrough: [`docs/training/01-subagents.md`](docs/training/01-subagents.md)
> and [`docs/training/02-skills.md`](docs/training/02-skills.md).

**The rule of thumb:**

- Generic work that any developer anywhere might need? **Path A or B.**
- Work that involves your company's data, internal APIs, proprietary
  knowledge, or business-specific workflows? **Path C.**

---

## 6. What's in the catalog directory

```
catalog/
├── README.md                       # You are here
├── CONTRIBUTING.md                 # How to add your own skills/agents
├── .claude-plugin/
│   └── marketplace.json            # The file that makes this a plugin marketplace
│
├── docs/
│   ├── concepts.md                 # Plain-English glossary (start here if any term is unfamiliar)
│   ├── getting-started.md          # Install + first use
│   ├── integrate-and-use.md        # Three ways to wire catalog items into a project
│   ├── best-practices.md           # Conventions & standards for authoring
│   ├── anthropic-skills.md         # How to install Anthropic's first-party skills
│   ├── training/                   # One doc per primitive
│   │   ├── 01-subagents.md
│   │   ├── 02-skills.md
│   │   ├── 03-hooks.md
│   │   ├── 04-slash-commands.md
│   │   ├── 05-plugins.md
│   │   └── 06-teams.md
│   └── patterns/
│       └── common-vs-subagent-skills.md
│
├── plugins/
│   ├── common-toolkit/             # Skills + command + hook usable everywhere
│   │   ├── skills/
│   │   │   ├── md-to-html/         # Convert Markdown files to HTML
│   │   │   └── skill-validator/    # Lint SKILL.md files
│   │   ├── commands/catalog-new.md # /catalog-new — scaffold a new skill
│   │   └── hooks/hooks.json        # Log every Write/Edit Claude makes
│   │
│   └── review-team/                # A "team" plugin — bundled review subagents
│       ├── agents/
│       │   ├── security-reviewer.md
│       │   ├── perf-reviewer.md
│       │   └── test-coverage-analyst.md
│       ├── skills/
│       │   └── triage-findings/    # A subagent-only skill
│       └── commands/review-pr.md   # /review-pr — run all three reviewers
│
└── scripts/
    └── validate_catalog.py         # Lints every entry — run before committing
```

---

## 7. Learning path (if you want to go deeper)

Each training doc is 5–10 minutes of reading and stands on its own. Read
in order the first time; afterwards jump to whichever is relevant.

1. [`docs/concepts.md`](docs/concepts.md) — the glossary. **Start here if
   any term in this README was unfamiliar.**
2. [`docs/getting-started.md`](docs/getting-started.md) — install the
   catalog, run one skill and one subagent.
3. [`docs/training/01-subagents.md`](docs/training/01-subagents.md) —
   what a subagent is and how to write one.
4. [`docs/training/02-skills.md`](docs/training/02-skills.md) — the
   SKILL.md format and "progressive disclosure" (why SKILL.md files stay
   small).
5. [`docs/training/03-hooks.md`](docs/training/03-hooks.md) — how hooks
   make behavior deterministic (instead of relying on the model to
   remember).
6. [`docs/training/04-slash-commands.md`](docs/training/04-slash-commands.md) —
   slash commands for repeatable workflows.
7. [`docs/training/05-plugins.md`](docs/training/05-plugins.md) — how
   plugins bundle everything.
8. [`docs/training/06-teams.md`](docs/training/06-teams.md) — the
   multi-subagent "team" pattern (like our `review-team`).
9. [`docs/patterns/common-vs-subagent-skills.md`](docs/patterns/common-vs-subagent-skills.md) —
   when a skill should be catalog-wide vs. locked to one subagent.
10. [`docs/best-practices.md`](docs/best-practices.md) — conventions you
    should follow if you author an entry.
11. [`docs/integrate-and-use.md`](docs/integrate-and-use.md) — three
    different ways to wire catalog items into a project.
12. [`docs/anthropic-skills.md`](docs/anthropic-skills.md) — how to
    install Anthropic's first-party marketplace alongside ours.

---

## 8. Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full process. Short
version:

1. **Decide which of the three paths you're on.** If it's Path A/B, you
   don't need to contribute anything — install what's already out
   there. Path C is where contributions go.
2. **Branch from `main`.**
3. **Add your entry.** Use the `/catalog-new <skill-name>` command to
   scaffold the directory if you're adding a skill. Follow
   [`docs/best-practices.md`](docs/best-practices.md) for the
   conventions.
4. **Run the validator.** This is non-optional:
   ```bash
   python catalog/scripts/validate_catalog.py
   ```
   Fix anything it complains about.
5. **If your entry is a brand-new plugin**, register it in
   `.claude-plugin/marketplace.json`.
6. **Open a pull request.** Tag someone on the team for review.

---

## 9. Getting help

- **Something in this README didn't make sense?** That's a bug. Open an
  issue or DM the catalog maintainers — non-technical readers are our
  target audience and confusing language is something we want to fix.
- **Claude Code itself is broken?** Start with Anthropic's official
  docs at [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code/overview).
- **A skill or subagent isn't working as expected?** Run the validator
  against it, then read the training doc for that primitive.
- **You want to build something and aren't sure where to start?** Read
  the training doc for whichever primitive you think you need, look at
  the closest worked example in `plugins/`, and start by copying it.
