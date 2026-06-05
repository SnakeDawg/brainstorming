---
name: summarize-video
description: Condense a video transcript into a structured Markdown brief — TL;DR, key points, notable quotes, and a timestamped section-by-section table.
scope: dedicated
owner: youtube-summarizer
---

# summarize-video

A dedicated skill owned by the [`youtube-summarizer`](../../AGENT.md) agent.
It turns raw transcript text into the readable part of the brief. The topic
*visualization* is a separate concern handled by `visualize-topics`.

Because `scope: dedicated`, this skill lives inside its owning agent and must
not be referenced by other agents.

## Input

| Field | Type | Notes |
|---|---|---|
| `transcript` | string | Plain transcript text, ideally with light `[mm:ss]` markers. |
| `title` | string | Video title, for the header (optional). |
| `channel` | string | Channel name, for the header (optional). |
| `duration` | string | `mm:ss` / `h:mm:ss`, for the header (optional). |
| `url` | string | Source URL, for the header (optional). |

## Output

A Markdown fragment (no code fence) containing, in order:

1. **Header** — `# 📺 <title>` and a metadata line:
   `**Channel:** … · **Length:** … · **Source:** <url>`
2. **`## TL;DR`** — 2–3 sentences, the single most useful paragraph.
3. **`## Key points`** — 3–7 bullets, one idea each, most important first.
4. **`## Notable quotes`** — 0–3 verbatim lines worth keeping, each as a
   blockquote with an approximate timestamp:
   `> "…" — <speaker if known>, ~<mm:ss>`. Omit the whole section if the
   transcript has nothing quotable (don't pad).
5. **`## Section-by-section`** — a table `| Time | Topic | Summary |` with one
   row per coherent segment. For a 30-second Short this may be a single row;
   for a 40-minute talk, aim for one row per ~3–5 minutes.

## Behavior

```
input.transcript:
  "[0:00] Today I want to show you the one keyboard shortcut that saves me
   an hour a week... [0:08] it's the multi-cursor select. You hold cmd and
   click... [0:20] and here's the part nobody mentions — you can also do it
   with find-and-select..."

output (fragment):
  ## TL;DR
  A 30-second tip on using multi-cursor editing to batch repetitive edits,
  including the lesser-known find-and-select variant.

  ## Key points
  - Multi-cursor lets you edit many spots at once (cmd+click).
  - The find-and-select variant places a cursor on every match.
  - Claimed time saving: ~1 hour/week on repetitive edits.

  ## Notable quotes
  > "here's the part nobody mentions — you can also do it with
  > find-and-select" — ~0:20

  ## Section-by-section
  | Time | Topic | Summary |
  |---|---|---|
  | 0:00 | Multi-cursor basics | cmd+click to place multiple cursors |
  | 0:20 | Find-and-select | cursor on every match for batch edits |
```

## Rules

1. **Faithful, not inflated.** Summarize only what the transcript says. If the
   transcript is thin, the brief is short. Never extrapolate from the title.
2. **Density over volume.** TL;DR ≤ 3 sentences. Key points are claims, not
   sentences with filler ("In this video, the creator explains that…" → cut).
3. **Quotes are verbatim.** Copy exactly, including the speaker's wording.
   Approximate the timestamp from the nearest `[mm:ss]` marker. If there are
   no markers, drop the `~mm:ss` suffix rather than guess.
4. **Section count scales with length.** Don't force a 12-row table onto a
   90-second clip, and don't compress a lecture into 3 rows.
5. **Match the source language** for the prose; only translate if asked.

Edge cases:

- **Empty transcript** → return `""` (the agent will have already routed to
  the paste fallback before reaching here).
- **Single-topic Short** → TL;DR + 3 key points + a 1-row section table is
  fine; omit quotes if none stand out.
- **Transcript with no timestamps** → still produce the section table by
  splitting on topic shifts; leave the `Time` column as `—`.

## Why this is dedicated, not shared

The section schema, the emoji header, and the "faithful, never inflate"
contract are output decisions specific to `youtube-summarizer`. Generic
text summarization already exists as
[`skills/summarize-text`](../../../../skills/summarize-text/SKILL.md) — reach
for that if you only need a one-liner.
