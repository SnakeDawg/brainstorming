# Best Practices & Standards

Conventions the catalog follows, so you know what "good" looks like when you
add your own skills, subagents, commands, and hooks. These aren't arbitrary —
each rule exists because ignoring it has bitten someone in a real session.

> **Audience:** people who are authoring catalog entries (or deciding whether
> someone else's PR should be merged). If you're just *using* the catalog,
> you don't need this doc — see [`getting-started.md`](getting-started.md).

## The two-sentence rule

Every skill, subagent, and slash command should fit in two sentences:

1. **What it does.** One sentence. Active voice.
2. **When to use it.** One sentence. With a concrete trigger phrase.

If you can't fit it in two sentences, the entry is doing too much — split it.

## Descriptions are trigger phrases, not marketing copy

Claude picks which skill or subagent to use by matching the user's request
against the `description` field. Treat the description like a search query
the orchestrator will type.

| Don't | Do |
|---|---|
| `description: A really helpful PDF tool` | `description: Extract text from a PDF file. Use when the user asks to read, search, or summarize a PDF.` |
| `description: Security things` | `description: Security-focused code review specialist. Use when looking for auth bypass, injection, secrets, or unsafe deserialization.` |

Include one of these phrases in every description: **"use when"**, **"when
the user"**, **"when you need"**, or **"when asked to"**. The `skill-validator`
warns if none are present.

## One entry, one job

A catalog entry should do **one thing**. If you find yourself writing "this
skill handles PDFs, Word docs, and Excel files", you have three skills, not
one.

Symptoms that an entry is doing too much:
- The description needs "and" more than once.
- The `allowed-tools` list is longer than four items.
- The body has multiple unrelated "When the user asks X" sections.

Fix by splitting. Shared helper scripts can live in a sibling directory or
a parent plugin.

## Tool allowlists: narrow beats wide

Every skill and command should declare the **minimum** tools it needs in
`allowed-tools`. This is both a security boundary and a documentation aid
(readers see at a glance what the entry touches).

| Pattern | When |
|---|---|
| `Read` | Skill only reads files |
| `Read Grep Glob` | Skill reads + searches |
| `Read Write Edit` | Skill modifies files |
| `Bash(git *)` | Skill only needs git |
| `Bash(python3 *)` | Skill runs a bundled Python script |
| `Bash(*)` | **Avoid.** Defeats the security model. |
| `Bash` | **Avoid.** Same problem — allows anything. |

The validator warns on bare `Bash` and `Bash(*)`.

## Subagent system prompts: specific > clever

A subagent's body is its system prompt. It starts with **zero memory** of
the parent conversation, so every instruction has to be self-contained.

Good subagent system prompts share a pattern:

1. **Role.** One sentence. "You are a senior application security engineer."
2. **Scope.** What the agent is allowed to touch. What it is **not** allowed
   to touch.
3. **Priorities.** A numbered list of what to look for, in priority order.
4. **Output format.** Exactly what to return, with an example.
5. **Hard rules.** Things the agent must never do. ("Never modify files.")

Read `plugins/review-team/agents/security-reviewer.md` for a worked example.

## Progressive disclosure for skills

A `SKILL.md` is loaded into the context window as soon as the skill
activates. Anything else in the skill directory is loaded **only when Claude
reads it**. Use this:

- Put the decision-making instructions in `SKILL.md` itself. Keep it under
  ~150 lines.
- Put exhaustive rules, examples, and edge cases in `reference.md` or
  `examples.md`. Reference them from `SKILL.md` by name so Claude knows
  they exist.
- Put executable helpers in `scripts/`. Claude runs them; they never load
  into context.

A skill that ships a 50-page reference manual and a dozen helper scripts
can still be cheap to activate if progressive disclosure is done right.

## Self-contained scripts

Every script in a catalog skill should run with **stdlib only** where
possible (Python standard library, plain bash). When a third-party
dependency is unavoidable:

1. Declare it in the skill's `SKILL.md` frontmatter or body, loudly.
2. Pin a version. `pypdf>=4.0,<5` — not `pypdf`.
3. Prefer popular, well-maintained packages. `pypdf`, `python-docx`,
   `openpyxl`, `python-pptx` are all fine.
4. Never require the script to pull its own dependencies at runtime. Let
   the user install them, or document the install step clearly.

The two Python skills shipped in `common-toolkit` (`md-to-html`,
`skill-validator`) are stdlib-only by design.

## Hooks: narrow matchers, fast scripts

A hook runs on every matching event. Two rules:

1. **Narrow the matcher.** A `PostToolUse` hook with matcher `".*"` fires on
   every tool call and is an easy way to make every session sluggish.
   `Write|Edit` is fine. `Bash` without a regex is usually too broad.
2. **Keep the hook script fast.** No subprocess forks in tight loops, no
   network calls, no heavy binaries. The catalog's `log-tool-use.sh` is a
   reference example: pure bash, zero forks per invocation.

## No secrets, ever

No API keys, tokens, database passwords, or customer data — not in
`SKILL.md` bodies, not in commit messages, not in example JSON, not in
screenshots. If a skill needs a secret at runtime, use `userConfig` in
`plugin.json` so users supply it at install time.

## Commit messages

Follow the repo's existing style (short imperative title, optional
multi-line body). When adding a catalog entry, the title should name the
entry type and the name:

- `Add md-to-html common skill`
- `Add review-team plugin with three code review subagents`
- `Fix skill-validator false positive on allowed-tools with Bash(python3 *)`

Avoid "update stuff" or "wip". The catalog is a reference for first-time
readers — commit history is part of the documentation.

## PR checklist

Before opening a PR that touches the catalog:

- [ ] `python catalog/scripts/validate_catalog.py` passes
- [ ] New entries have a trigger-phrase description
- [ ] `allowed-tools` is as narrow as possible
- [ ] No secrets, no customer data
- [ ] `marketplace.json` updated if a new plugin was added
- [ ] README or training doc updated if a new concept was introduced
- [ ] Commit message follows the style above
