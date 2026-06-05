---
name: fetch-transcript
description: Normalize any YouTube URL shape to a video ID and fetch its caption track as plain text, via a tiered strategy that degrades to manual paste.
scope: dedicated
owner: youtube-summarizer
---

# fetch-transcript

A dedicated skill owned by the [`youtube-summarizer`](../../AGENT.md) agent.
It does the one genuinely fiddly part of the pipeline: turning a messy
shared link into clean transcript text, without downloading any audio or
video.

Because `scope: dedicated`, this skill lives inside its owning agent and must
not be referenced by other agents.

## Input

| Field | Type | Notes |
|---|---|---|
| `url` | string | Any YouTube URL shape, a bare 11-char video ID, or (fallback) a raw transcript string. |
| `lang` | string | Optional preferred caption language code (e.g. `en`). Default: auto-detect, prefer manually-authored captions over auto-generated. |

## Output

| Field | Type | Notes |
|---|---|---|
| `video_id` | string | The canonical 11-char ID. |
| `title` | string | Video title (best-effort from metadata). |
| `channel` | string | Channel/uploader name (best-effort). |
| `duration` | string | `mm:ss` or `h:mm:ss` (best-effort). |
| `transcript` | string | Plain transcript text. When timestamps are available, keep light `[mm:ss]` markers at paragraph/segment starts so downstream timestamping works. |
| `source_tier` | string | Which tier produced the transcript (`yt-dlp` / `transcript-api` / `web` / `manual`). |

## Step 1 — Normalize the URL to a video ID

Extract the 11-character ID from any of these, stripping all tracking and
timing params (`?si=`, `&t=`, `&feature=`, `&pp=`, …):

| Input shape | Where the ID is |
|---|---|
| `youtube.com/watch?v=VIDEOID` | the `v` query param |
| `youtu.be/VIDEOID` | first path segment |
| `youtube.com/shorts/VIDEOID` | segment after `/shorts/` |
| `youtube.com/embed/VIDEOID` | segment after `/embed/` |
| `youtube.com/live/VIDEOID` | segment after `/live/` |
| `m.youtube.com/watch?v=VIDEOID` | the `v` query param |
| bare `VIDEOID` | the whole string, if it matches `^[A-Za-z0-9_-]{11}$` |

If the input doesn't match any shape and isn't 11 valid chars, it may be a
**raw pasted transcript** — if it's long free text, treat it as
`transcript` with `source_tier: manual` and skip fetching.

A reference normalizer (the runtime — e.g. Claude Code — may run this, or do
the equivalent inline):

```bash
# Usage: ytid "<url-or-id>"
ytid() {
  printf '%s' "$1" | sed -E '
    s#https?://##; s#www\.##; s#m\.##;
    s#youtu\.be/#youtube.com/watch?v=#;
    s#youtube\.com/shorts/#youtube.com/watch?v=#;
    s#youtube\.com/embed/#youtube.com/watch?v=#;
    s#youtube\.com/live/#youtube.com/watch?v=#;
  ' | sed -E 's#.*[?&]v=([A-Za-z0-9_-]{11}).*#\1#; s#.*/([A-Za-z0-9_-]{11}).*#\1#'
}
```

## Step 2 — Fetch captions (tiered; stop at first success)

Try tiers in order. Log which tier succeeded into `source_tier`. **Never**
proceed to summarization with an empty transcript.

### Tier 1 — `yt-dlp` (preferred; gets metadata + captions in one shot)

```bash
yt-dlp --skip-download --write-auto-subs --write-subs \
       --sub-langs "${LANG:-en.*}" --sub-format vtt \
       --convert-subs srt \
       --print "%(title)s\t%(uploader)s\t%(duration_string)s" \
       -o "%(id)s.%(ext)s" "https://www.youtube.com/watch?v=$VIDEO_ID"
# then read the generated .srt, strip indices/timestamps to plain text
# (keep one [mm:ss] marker per ~30s for the section table downstream)
```

If `yt-dlp` isn't installed and the runtime can install it:
`pip install -U yt-dlp` (or `pipx install yt-dlp`).

### Tier 2 — transcript API (no metadata, captions only)

Python, no audio:

```python
# pip install youtube-transcript-api
from youtube_transcript_api import YouTubeTranscriptApi
segs = YouTubeTranscriptApi.get_transcript(VIDEO_ID)  # [{text,start,duration}]
transcript = "\n".join(f"[{int(s['start'])//60}:{int(s['start'])%60:02d}] {s['text']}"
                       for s in segs)
```

### Tier 3 — direct fetch (WebFetch / curl of the timedtext or watch page)

If the runtime has web access but not the tools above, fetch the watch page
or the `timedtext` caption endpoint and parse the caption JSON/XML. Title and
channel come from the page `<meta>` / `ytInitialPlayerResponse` blob.

### Tier 4 — manual paste (always available)

If every networked tier fails (captions disabled, network blocked, sandbox),
**stop and ask the caller**:

> I couldn't fetch captions for this video (reason: `<network blocked / no
> captions / …>`). Paste the transcript here, or give me a path to a
> `.txt`/`.srt`/`.vtt` file and I'll take it from there.

When a file path is given, the owning agent reads it via
`shared/read-file` and passes the contents back in as `transcript` with
`source_tier: manual`.

## Behavior

```
input:  { url: "https://youtube.com/shorts/tbVtt2-qUJo?si=QkyQeSJUt9SaHJz9" }
step 1: video_id = "tbVtt2-qUJo"   (stripped /shorts/ and ?si=)
step 2: Tier 1 yt-dlp → title/channel/duration + caption .srt → plain text
output: { video_id, title, channel, duration, transcript, source_tier: "yt-dlp" }
```

Edge cases:

- **Captions disabled** → fall through to Tier 4, do not fabricate.
- **Auto vs manual captions** → prefer manually-authored; note in nothing
  fancy, just use them.
- **Non-Latin/RTL caption text** → preserve as UTF-8, do not transliterate.
- **Empty/garbage transcript (< ~20 words)** → treat as failure, fall to Tier 4.
- **Bare ID input** → skip normalization, go straight to Tier 1.

## Why this is dedicated, not shared

URL-shape normalization and the YouTube-specific caption-tier ladder are
particular to this agent's job. A different agent that needs a transcript
should call `youtube-summarizer`, not couple to these YouTube internals.
