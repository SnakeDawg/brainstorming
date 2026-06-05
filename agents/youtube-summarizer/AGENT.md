---
name: youtube-summarizer
description: Turn a YouTube URL (including Shorts) into a Markdown summary with an embedded Mermaid topic visualization, using the video's auto-generated transcript — no audio download required.
dedicated_skills:
  - ./skills/fetch-transcript
  - ./skills/summarize-video
  - ./skills/visualize-topics
shared_skills:
  - ../../skills/shared/read-file
improvement_agent: ../../agents/improver
rubric: ./rubric.md
self_improvable: false
---

# youtube-summarizer

Paste a YouTube link, get back a clean Markdown brief plus a **visual topic
map** you can read at a glance. It exists because the thing people actually
share — a URL — is almost never the thing tools can consume. This agent
closes that gap with the cheapest possible path: **the transcript, not the
audio.**

> **Key insight.** YouTube auto-generates a caption track for nearly every
> video, Shorts included. Fetching that text is ~100× cheaper and faster than
> downloading audio and transcribing it. The whole pipeline is: *get
> captions → summarize → draw topic map.* No Whisper, no ffmpeg, no GPU.

## When to invoke

Invoke `youtube-summarizer` when the input is a YouTube link in any of these
shapes (all resolve to the same video):

```
https://www.youtube.com/watch?v=VIDEOID
https://youtu.be/VIDEOID
https://youtube.com/shorts/VIDEOID?si=trackingjunk
https://m.youtube.com/watch?v=VIDEOID&t=42s
```

Also accepts a bare 11-character video ID, or — when no network/captions are
available — a **pasted transcript** or a path to a `.txt`/`.srt`/`.vtt`
transcript file (handled via the shared `read-file` skill).

## How it uses its skills

| Step | Skill | Purpose |
|---|---|---|
| 1 | `fetch-transcript` (dedicated) | Normalize any URL shape → video ID, then fetch the caption track via a tiered strategy (yt-dlp → transcript API → manual paste). Returns plain transcript text + metadata (title, channel, duration). |
| 1a | `shared/read-file` | Only if the caller supplied a transcript **file path** instead of a URL — read it to a string, then skip straight to step 2. |
| 2 | `summarize-video` (dedicated) | Condense the transcript into a structured Markdown brief: TL;DR, key points, notable quotes, and timestamped sections. |
| 3 | `visualize-topics` (dedicated) | Emit a Mermaid `mindmap` of the topic hierarchy **and** a `pie` chart of how the runtime splits across topics. |
| 4 | _(assemble)_ | Stitch metadata header + summary + visualization into one self-contained `.md` document and return it. |

## Output contract

A single Markdown document with this skeleton (renders as-is on GitHub,
Obsidian, Notion, VS Code preview — Mermaid is native, no image files):

```markdown
# 📺 <Video Title>
**Channel:** <name> · **Length:** <mm:ss> · **Source:** <url>

## TL;DR
<2–3 sentence gist>

## Topic map
```​mermaid
mindmap
  root((<core subject>))
    <Topic A>
      <subpoint>
    <Topic B>
      <subpoint>
```​

## Topic breakdown (share of runtime)
```​mermaid
pie showData
  title Where the time goes
  "<Topic A>" : 45
  "<Topic B>" : 30
  "<Topic C>" : 25
```​

## Key points
- ...

## Notable quotes
> "..." — <speaker>, ~<mm:ss>

## Section-by-section
| Time | Topic | Summary |
|---|---|---|
| 0:00 | ... | ... |
```

## Worked example

**Input:**

```
https://youtube.com/shorts/tbVtt2-qUJo?si=QkyQeSJUt9SaHJz9
```

1. `fetch-transcript` strips the `?si=…` tracking param and the `/shorts/`
   path → video ID `tbVtt2-qUJo`; fetches the auto-caption track and the
   title/channel/duration metadata.
2. `summarize-video` turns the caption text into a TL;DR, key points, and a
   section table (Shorts are short, so the section table may be a single row).
3. `visualize-topics` emits a `mindmap` of the one or two topics and a `pie`
   chart of their runtime share.
4. The agent assembles the header + summary + both diagrams into one `.md`
   document and returns it.

## Failure & fallback behavior

This agent **never silently fails**. Each tier degrades explicitly:

- **Captions disabled on the video** → report it, and ask the caller to paste
  the transcript (or a transcript file path), then resume at step 2.
- **Network blocked** (e.g. sandboxed runner) → say so plainly, do not
  fabricate a transcript, and offer the paste path.
- **Non-English captions** → summarize in the caption language by default;
  translate to English only if the caller asks.
- **No video found / invalid ID** → return an error naming the bad input.

> ⚠️ Hard rule: if no transcript is obtained by any tier, the agent returns
> an error and the paste instructions. It must **never** invent a summary
> from the title, thumbnail, or URL alone.

## Extending this agent

- Add a `summarize-video-json` dedicated skill for structured/API output.
- Add a `translate-transcript` step before `summarize-video` for a forced
  target language.
- To support playlists, add a `expand-playlist` skill that fans out to one
  invocation per video and concatenates the briefs.
- Do **not** add audio-download/transcription here unless captions are truly
  unavailable for a class of videos — it breaks the cheap-path invariant.

## Self-improvement participation

- [`rubric.md`](./rubric.md) — weights, acceptance criterion, advisory critics

To run an improvement cycle:

```
improver run agents/youtube-summarizer --objective "<what to improve>"
```
