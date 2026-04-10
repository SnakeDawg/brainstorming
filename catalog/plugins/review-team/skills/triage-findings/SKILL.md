---
name: triage-findings
description: Defines the structured JSON format the review-team subagents use when reporting findings. Use when you are a review-team subagent (security-reviewer, perf-reviewer, test-coverage-analyst) and need to emit your final report. Not intended for the main session.
disable-model-invocation: false
allowed-tools: Read
---

# triage-findings (subagent-only)

This skill is preloaded by the three review-team subagents via their
`skills:` frontmatter. It exists to make every review agent emit findings in
the **same JSON shape** so the orchestrator can merge them mechanically.

> **Don't auto-invoke this from the main session.** It's documented here so
> the orchestrator can read the format if it needs to, but the actual
> emission happens inside the subagents.

## The findings schema

Every review subagent ends its turn with a fenced JSON block:

````
```json
{
  "agent": "security-reviewer",
  "target": "src/auth/login.ts",
  "findings": [
    {
      "severity": "High",
      "category": "auth-bypass",
      "file": "src/auth/login.ts",
      "line": 47,
      "summary": "Token signature is verified but not checked for expiry.",
      "evidence": "jwt.verify() is called without { ignoreExpiration: false } and the decoded payload's exp field is never compared to Date.now().",
      "fix": "Pass { ignoreExpiration: false } to jwt.verify(), or compare decoded.exp * 1000 to Date.now() before trusting the token."
    }
  ]
}
```
````

## Field reference

| Field | Required | Type | Notes |
|---|---|---|---|
| `agent` | yes | string | Your agent name (e.g. `"security-reviewer"`) |
| `target` | yes | string | The file or PR identifier you reviewed |
| `findings` | yes | array | May be empty (`[]`) if you found nothing |
| `findings[].severity` | yes | enum | `Critical` / `High` / `Medium` / `Low` / `Info` |
| `findings[].category` | yes | string | Short kebab-case category (e.g. `n-plus-one`) |
| `findings[].file` | yes | string | File path |
| `findings[].line` | yes | number | 1-based line number of the issue |
| `findings[].summary` | yes | string | One sentence, plain English |
| `findings[].evidence` | yes | string | Why you believe this is an issue — quote code or describe data flow |
| `findings[].fix` | yes | string | A concrete proposed change, not "improve this" |

## Severity meaning

| Severity | When to use |
|---|---|
| `Critical` | Exploitable in production right now; or catastrophic perf collapse |
| `High` | Reachable bug with clear impact; needs to be fixed before merge |
| `Medium` | Likely problem but mitigations exist; fix soon |
| `Low` | Worth fixing but not blocking |
| `Info` | Observation or out-of-scope note for the human reviewer |

## Empty findings

If you find nothing, still emit the envelope:

```json
{
  "agent": "perf-reviewer",
  "target": "src/auth/login.ts",
  "findings": []
}
```

This lets the orchestrator distinguish "agent ran and found nothing" from
"agent failed silently".

## Don't

- Don't emit prose outside the JSON block **before** the JSON. The
  orchestrator parses by finding the first ```json fence.
- Don't include line ranges (`47-52`) — pick the most relevant single line.
- Don't include severity scores or CVSS — keep it human-readable.
