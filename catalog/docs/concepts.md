# Claude Code Concepts, in Plain English

A glossary for people who haven't used Claude Code before. Every term in
this catalog that might be unfamiliar, explained without jargon, with a
real-world analogy.

> If you already know Claude Code, skip this doc and go straight to
> [`training/`](training/). This page is the "what is all this stuff"
> primer.

## Claude Code

**What it is:** A command-line tool that runs Claude (the AI) inside your
terminal, connected to your actual files and commands. Instead of copying
code into a chat window, you talk to Claude in your project directory and
it can read files, run tests, make edits, and open pull requests.

**Analogy:** It's Claude sitting next to you at your desk with permission
to touch your keyboard, instead of Claude on the other side of a
typewriter exchanging letters.

**You don't need to know:** Python, JavaScript, or anything else. Claude
Code works in any project, any language.

## Skill

**What it is:** A reusable instruction sheet that Claude can pull up when
you ask for a specific kind of help. Each skill is a small folder with a
`SKILL.md` file that says "when the user asks X, follow these steps."

**Analogy:** A recipe card in a kitchen drawer. You don't memorize it;
Claude grabs the right card when the moment calls for it.

**Example:** A `pdf-extract` skill says "when the user asks to read a
PDF, run this script to pull out the text, then answer their question
from the extracted text."

## Subagent

**What it is:** A specialist version of Claude with its own narrow job
description. The main Claude session can hand off a task to a subagent,
which works in its own private conversation and reports back with just
the result.

**Analogy:** Your general contractor calling in the electrician for one
room. The electrician doesn't need to know about the kitchen remodel —
they just do the wiring and leave.

**Why it matters:** Subagents keep the main conversation focused. Instead
of Claude reading 50 log files and cluttering the conversation with them,
a `log-analyst` subagent reads them in its own context and returns only
the summary.

## Hook

**What it is:** An automatic action that runs when something happens —
before or after Claude uses a tool, when a session starts, when a file
changes, etc. Hooks are scripts the **system** runs, not instructions
Claude follows.

**Analogy:** The spell-check that runs automatically when you save a
document. You didn't ask for it; it just happens every time.

**Why hooks instead of "just tell Claude to do it"?** Because the model
can forget. If you want something to happen **every time** — format
every file you edit, log every command, block every dangerous shell
call — a hook makes it happen deterministically. Claude doesn't have to
remember.

## Slash command

**What it is:** A keyboard shortcut for a recurring task. Type `/review-pr
123` in Claude Code and it's the same as pasting a long instruction that
says "please review pull request 123 using the following steps..."

**Analogy:** A macro in a word processor. You recorded the steps once;
now you press one button to run them.

**Example:** `/catalog-new my-skill` (in this repo) creates a new skill
folder with a starter `SKILL.md` already filled in.

## Plugin

**What it is:** A folder that bundles skills, subagents, commands, and
hooks together. You install a plugin with one command and get all its
contents at once.

**Analogy:** An app on your phone. The app might contain multiple
features, but you install it as a single thing.

**Example:** This catalog's `common-toolkit` plugin contains two skills
(`md-to-html`, `skill-validator`), one command (`/catalog-new`), and one
hook (tool-use logging). You install the whole plugin with:

```
/plugin install common-toolkit@brainstorming
```

## Plugin marketplace

**What it is:** A collection of plugins someone has published in one place,
so you can browse and install any of them. Usually just a git repo with a
special `marketplace.json` file.

**Analogy:** The app store your phone uses. This catalog is one such
store.

**How you add one:**

```
/plugin marketplace add snakedawg/brainstorming
```

After that, the plugins in this catalog show up when you run
`/plugin install`.

## Team

**What it is:** Not a built-in Claude Code feature — it's the name this
catalog uses for a **plugin that bundles multiple subagents that work
together**. This catalog's `review-team` plugin is an example: three
reviewer subagents (security, performance, test coverage) plus a slash
command that runs all three at once.

**Analogy:** A surgical team. One plugin, multiple specialists, a
coordinator who decides who does what.

## Orchestrator

**What it is:** The main Claude Code session — the one you're talking to
directly. When it decides to hand off a task to a subagent, **it's the
orchestrator**.

**Analogy:** The general contractor. It doesn't do every job; it decides
which specialist to call in.

## Progressive disclosure

**What it is:** A design pattern for skills. The `SKILL.md` file is loaded
immediately when a skill activates. Other files in the skill folder
(`reference.md`, `examples.md`, scripts) are loaded **only when Claude
actually reads them**.

**Why it matters:** A skill can ship a huge reference manual without
making Claude's memory expensive. The manual stays on disk until the
moment a question requires it.

## Context window

**What it is:** The amount of text Claude can "see" at once — the
conversation, files it's read, tool output, everything. It's finite.

**Why it matters in this catalog:** Every design decision here is about
keeping the context window lean. Subagents keep huge log output out of
the main session. Progressive disclosure keeps skill reference docs off
the main model until needed. Narrow hook matchers keep automation from
injecting noise.

## Frontmatter

**What it is:** A YAML block at the top of a markdown file, between two
`---` lines. It holds metadata like a skill's name, description, and
which tools the skill is allowed to use.

**Example:**

```yaml
---
name: md-to-html
description: Convert a markdown file to standalone HTML. Use when...
allowed-tools: Read Write Bash(python3 *)
---
```

Every SKILL.md, subagent, and slash command in this catalog has
frontmatter. The catalog's `skill-validator` skill lints it.

## When you'd reach for what

A cheat sheet:

| You want... | Use a... |
|---|---|
| Reusable instructions Claude can pick up on its own | **Skill** |
| A specialist with its own private conversation | **Subagent** |
| Something that happens automatically, every time | **Hook** |
| A keyboard shortcut for a workflow you run a lot | **Slash command** |
| To share all of the above with your team | **Plugin** |
| A collection of specialists that work together | **Team** (a plugin bundling subagents) |
