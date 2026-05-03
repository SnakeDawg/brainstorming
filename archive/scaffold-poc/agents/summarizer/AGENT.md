---
name: summarizer
description: Condense a text blob or a text file into a concise bullet-point summary.
dedicated_skills:
  - ./skills/format-summary
shared_skills:
  - ../../skills/shared/read-file
improvement_agent: ../../agents/improver
rubric: ./rubric.md
self_improvable: false
---

# summarizer

A second worked-example agent that demonstrates cross-skill composition:
it **reuses** the same shared skill (`read-file`) that `greeter` uses, and
**owns** a dedicated skill (`format-summary`) for the output step.

This agent exists to show two things `greeter` doesn't:

1. **Shared skill reuse** — the same `skills/shared/read-file` path appears
   in two unrelated agents' `AGENT.md` files, confirming the pattern scales.
2. **Text processing pipeline** — a multi-step skill chain: read → normalize
   → format, each step isolated in its own skill boundary.

## When to invoke

Invoke `summarizer` when the task is "reduce this text to the key points".
Input can be a raw text string or a file path (`.txt`, `.md`).

## How it uses its skills

| Step | Skill | Purpose |
|---|---|---|
| 1 | `shared/read-file` | If the input is a file path, read the file to get the raw text. Skip if input is already a string. |
| 2 | `format-summary` (dedicated) | Condense the text into 3–5 bullet points. |
| 3 | _(return)_ | Emit the bullet list. |

## Worked example

**Text input:**

```
Input: "The quarterly review covered three topics: revenue is up 12% YoY,
        the new product launch is delayed to Q3, and two engineering leads
        will be hired by end of month."
```

1. Skip step 1 — input is already a string.
2. Invoke `format-summary` → produces:
   ```
   - Revenue up 12% year-over-year
   - New product launch delayed to Q3
   - Two engineering leads to be hired by end of month
   ```
3. Return the bullet list.

**File path input:**

```
Input: "./reports/q2-review.txt"
```

1. Invoke `shared/read-file` with `path = "./reports/q2-review.txt"` → raw text.
2. Invoke `format-summary` on the raw text → bullet list.
3. Return the bullet list.

## Extending this agent

- Add a `format-summary-json` dedicated skill if callers need structured output.
- Add `../../skills/shared/execute` to `shared_skills` if any step requires
  match-type validation.
- Do not duplicate `read-file` logic here — the shared skill covers all file
  reading needs.

## Self-improvement participation

- [`rubric.md`](./rubric.md) — weights, acceptance criterion, advisory critics

To run an improvement cycle:

```
improver run agents/summarizer --objective "<what to improve>"
```
