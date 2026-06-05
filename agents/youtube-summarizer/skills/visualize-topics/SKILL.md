---
name: visualize-topics
description: Turn a video's topic structure into embedded Mermaid diagrams — a mindmap of the topic hierarchy and a pie chart of how runtime splits across topics.
scope: dedicated
owner: youtube-summarizer
---

# visualize-topics

A dedicated skill owned by the [`youtube-summarizer`](../../AGENT.md) agent.
It produces the "what was this about, at a glance" picture. The output is
**pure Mermaid in fenced code blocks** — it renders natively on GitHub,
Obsidian, Notion, GitLab, and VS Code preview, so the brief stays a single
self-contained `.md` file with no image assets.

Because `scope: dedicated`, this skill lives inside its owning agent and must
not be referenced by other agents.

## Input

| Field | Type | Notes |
|---|---|---|
| `transcript` | string | Plain transcript text (with `[mm:ss]` markers if available — used to estimate per-topic time). |
| `key_points` | string | Optional: the key points already extracted by `summarize-video`, to keep the two views consistent. |

## Output

Two fenced Mermaid blocks, in order:

### 1. Topic mindmap

```
```mermaid
mindmap
  root((<core subject, ≤ 4 words>))
    <Topic A>
      <subpoint>
      <subpoint>
    <Topic B>
      <subpoint>
```​
```

### 2. Topic time-share pie

```
```mermaid
pie showData
  title Where the time goes
  "<Topic A>" : <percent or seconds>
  "<Topic B>" : <percent or seconds>
```​
```

## How to derive the topics

1. **Cluster** the transcript into 2–6 topics (fewer for Shorts). A topic is a
   coherent thread, not every sentence. Reuse `key_points` clusters if given,
   so the mindmap, pie, and key-points section all agree.
2. **Estimate share** for the pie:
   - If `[mm:ss]` markers exist → sum the span covered by each topic and use
     seconds (or round to integer %). The slices should sum to ~100%.
   - If no markers → estimate from the *proportion of transcript text* spent
     on each topic. Approximate is fine; label the title `Where the time goes
     (est.)` in that case.
3. **Name topics in ≤ 4 words.** Long labels break Mermaid layout.

## Behavior

```
input.transcript: a 30s Short, ~75% multi-cursor basics, ~25% find-and-select

output:
  ```mermaid
  mindmap
    root((Multi-cursor editing))
      Basics
        cmd+click to add cursors
      Find-and-select
        cursor on every match
  ```

  ```mermaid
  pie showData
    title Where the time goes
    "Multi-cursor basics" : 75
    "Find-and-select" : 25
  ```
```

## Rules & guardrails (Mermaid will silently break otherwise)

1. **Sanitize labels.** Mermaid node text chokes on raw `()[]{}":;` and `#`.
   Strip or replace them; keep labels to plain words. Wrap the root in
   `root((…))`.
2. **2–6 topics.** One slice is a degenerate pie (still valid; use it for a
   single-topic Short). More than ~6 becomes unreadable — merge the long tail
   into `"Other"`.
3. **Pie values are numbers only** — no `%` sign inside the value, no units.
   `"Setup" : 40` not `"Setup" : 40%`.
4. **Keep the two views consistent** — every mindmap top-level topic should
   appear in the pie and vice versa.
5. **No fabricated precision.** If time is estimated from text proportion, say
   `(est.)` in the pie title rather than implying measured timing.

Edge cases:

- **Single topic** → mindmap with one branch + a one-slice pie at `100`.
- **Empty/too-short transcript** → return `""`; the agent handles the message.
- **Topics with equal weight** → distribute evenly (e.g. three topics → 34/33/33).

## Why this is dedicated, not shared

The choice of Mermaid `mindmap` + `pie`, the label-sanitization rules, and the
consistency-with-key-points contract are presentation decisions specific to
`youtube-summarizer`'s output. Another agent wanting a chart should define its
own visualizer rather than inherit these YouTube-shaped defaults.
