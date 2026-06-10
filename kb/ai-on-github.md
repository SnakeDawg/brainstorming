# AI on GitHub — what's possible

- **Status:** active
- **Owner:** @SnakeDawg
- **Date:** 2026-06-10

This page explains what "running AI" inside GitHub actually means, what it
takes to enable it on an on-prem GitHub Enterprise Server (GHES), and how the
markdown "skills" idea fits in. Nothing on this page is enabled by default in
this repo — there is a ready-to-enable workflow at
`.github/workflows/claude.yml`, inert until you add an API key.

## The mental model

There is no AI "inside" GitHub. What teams actually run is:

```
someone mentions @claude on an issue or PR
        │
        ▼
GitHub Actions starts a workflow (a temporary machine called a runner)
        │
        ▼
the runner checks out the repo and calls the Anthropic API (Claude)
        │
        ▼
Claude reads the issue + the repo, then comments back,
updates markdown docs, or opens a pull request
```

So "AI in GitHub" = **GitHub Actions + the official `anthropics/claude-code-action`
+ an Anthropic API key stored as a repo secret**.

## What it can do in this knowledge base

Once enabled, anyone can write things like this in an issue comment:

- *"@claude summarize the findings in this research issue and draft the
  write-up for `kb/research/` as a PR"*
- *"@claude does this initiative proposal conflict with anything in
  `kb/strategy/`?"*
- *"@claude update the roadmap table to mark this item done"*

Claude responds on the issue, and for changes it opens a pull request — so a
human still reviews everything before it lands in the knowledge base.

## What your GHES instance needs

Ask your GitHub admins (full checklist in
[`POC-GUIDE.md`](https://github.com/SnakeDawg/brainstorming/blob/main/POC-GUIDE.md)):

1. **GitHub Actions enabled**, with a runner available (GHES usually uses
   self-hosted runners — machines your org operates).
2. **Outbound network access from that runner to `api.anthropic.com`**. This
   is the most common blocker on-prem; it's a firewall/proxy question.
3. **An Anthropic API key**, stored as the repository secret
   `ANTHROPIC_API_KEY` (Settings → Secrets and variables → Actions).

Enable it by uncommenting the marked lines in `.github/workflows/claude.yml`
once the secret exists.

## How this relates to "skills"

A *skill* is just a markdown file of instructions that an AI agent loads when
relevant — no runtime code. This repo already contains a full scaffold of that
pattern (see [`agents/`](https://github.com/SnakeDawg/brainstorming/tree/main/agents)
and [`skills/`](https://github.com/SnakeDawg/brainstorming/tree/main/skills) at the
repo root, documented in the root `README.md`). Claude Code uses the same
idea: drop instruction files in the repo (e.g. a `CLAUDE.md`, or skill files)
and the AI follows them when it runs here. That means the team's conventions —
like the ones in [conventions.md](conventions.md) — can be made
machine-followable, not just human-readable.

## Cost and safety notes

- Each @claude mention costs API tokens plus Actions runner minutes. Fine for
  a POC; set budgets before wide rollout.
- The workflow's permissions block controls what Claude can touch (this
  repo's contents, issues, and PRs — nothing outside the repo).
- Claude never merges anything itself; humans review the PRs it opens.
