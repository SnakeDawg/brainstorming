---
description: Run the review-team (security, perf, test-coverage) in parallel against a PR or file and merge findings.
argument-hint: <pr-number-or-file-path>
allowed-tools: Bash(git diff *) Bash(git show *) Read Grep Glob
---

Run the full review team against the target in `$ARGUMENTS` and produce a
merged report.

## Steps

1. **Resolve the target.**
   - If `$ARGUMENTS` is a number (e.g. `123`), assume it's a PR. Try to
     fetch the diff with `git diff main...HEAD` if you're already on the
     PR branch, or use the GitHub MCP tools if available.
   - If `$ARGUMENTS` is a path, treat it as a file or directory and resolve
     accordingly.
   - If `$ARGUMENTS` is empty, stop and ask the user what to review.

2. **Spawn the three review subagents in parallel.** Issue a single message
   with three `Agent` tool calls — they will run concurrently:

   - `subagent_type: "security-reviewer"` — brief it with the target and
     any relevant background. Ask for findings JSON + a one-paragraph
     summary.
   - `subagent_type: "perf-reviewer"` — same target, perf-focused brief.
   - `subagent_type: "test-coverage-analyst"` — same target, ask which
     branches and edge cases lack tests.

   Each agent will return a `triage-findings` JSON block plus a paragraph.

3. **Merge the findings.**
   - Parse each agent's JSON block.
   - Concatenate the `findings` arrays.
   - Sort by severity: `Critical` > `High` > `Medium` > `Low` > `Info`.
   - Within the same severity, group by `agent`.
   - Dedupe: if two agents flag the same `(file, line, category)`, keep the
     highest severity and merge their `evidence` strings.

4. **Format the report for the user.** A markdown summary with:
   - A header line: `# Review of <target>`
   - One section per severity that has findings, listing each as a bullet
     with `**[<agent>] <summary>**` followed by file:line and the proposed fix.
   - At the bottom, a "What each agent said" block with each agent's
     one-paragraph human summary verbatim.
   - If all three agents returned empty findings, say so explicitly and
     congratulate the user — don't pad with filler.

5. **Do not modify any files.** This command is read-only by design.
