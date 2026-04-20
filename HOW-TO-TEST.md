# How to test the agents and skills

A human's quick-start for kicking the tires on each agent and skill in
this repo. **Nothing in this file is consumed by any automated process.**
It's a pure README — copy any block below into Claude Code, Windsurf,
Cursor, or whatever LLM agent you're using, and see what happens.

Delete this file if you don't want it — nothing will break.

For the automated scoring contract (the rules the improver evaluates
against), see each target's `rubric.md` instead.

---

## How to invoke anything

Paste into your LLM agent:

```
Run <path-to-agent-or-skill> with input "<your input>"
```

The LLM reads the target's `AGENT.md` or `SKILL.md`, loads the declared
skills, and executes. Output shape follows the `## Behavior` section of
the skill.

---

## agents/greeter — produce a warm greeting given a name

### Basic name

```
Run agents/greeter with input "Ada"
```

Expected: a greeting that includes "Ada".

### Empty input

```
Run agents/greeter with input ""
```

Expected: a greeting that does NOT have "Hello, ," as an awkward
leading comma; the name slot is absent.

### Whitespace-padded name

```
Run agents/greeter with input "  Grace  "
```

Expected: the padding is trimmed before formatting.

### Uppercase input

```
Run agents/greeter with input "ADA"
```

Observed on at least one runtime (Windsurf): the name is normalized to
`Ada` in the output. Try your runtime and compare.

---

## agents/summarizer — bullet-point summary of a text blob or file

### Short multi-point text

```
Run agents/summarizer with input "The quarterly review covered three topics: revenue is up 12% YoY, the new product launch is delayed to Q3, and two engineering leads will be hired by end of month."
```

Expected: 3–5 bullets, each starting with `- `, each one idea.

### Single sentence

```
Run agents/summarizer with input "The project deadline has been moved to next Friday."
```

Expected: at least one bullet; summarizer handles thin input
gracefully.

### Empty input

```
Run agents/summarizer with input ""
```

Expected: empty string back.

### File path input

```
Run agents/summarizer with input "./reports/q2-review.txt"
```

(Create the file first.) Expected: summarizer uses
`skills/shared/read-file` to load the file, then summarizes.

---

## skills/summarize-text — one-sentence summary of a blob (standalone)

```
Run skills/summarize-text with input "The meeting ran 90 minutes. We agreed to ship v2 next Tuesday, revisit pricing in Q3, and hire two more engineers by end of month. Action items were assigned to Maria and Jon."
```

Expected: a single sentence that mentions v2 (the headline item).

```
Run skills/summarize-text with input ""
```

Expected: empty string back.

---

## skills/onboard — scaffold a new agent or skill

### Interactive mode (the default path for humans)

```
Run skills/onboard
```

Onboard asks: what are you building? name? description? Then previews
files and waits for confirmation before writing.

### Batch mode — scaffold a new agent in one shot

```
Run skills/onboard with input:
mode: batch
spec:
  kind: agent
  name: email-classifier
  description: Categorize inbound email into priority buckets.
  dedicated_skills: [format-bucket]
  shared_skills: [../../skills/shared/read-file]
```

Expected: structured output listing every file onboard would write,
each fenced under `### <path>`. Review the preview, then confirm to
write.

### Batch mode — standalone skill

```
Run skills/onboard with input:
mode: batch
spec:
  kind: standalone-skill
  name: translate-fr
  description: Translate English text to French.
```

### Batch mode — shared skill (no rubric)

```
Run skills/onboard with input:
mode: batch
spec:
  kind: shared-skill
  name: fetch-url
  description: Fetch a URL and return its text body.
  consumers: any
```

### Batch mode — dedicated skill under an existing agent

```
Run skills/onboard with input:
mode: batch
spec:
  kind: dedicated-skill
  name: format-bucket
  description: Label an email with a priority bucket.
  owner: email-classifier
```

---

## skills/shared/read-file — utility, used by agents

Not directly invoked on its own. Test it indirectly by asking an agent
that uses it (e.g. greeter or summarizer) with a file-path input.

---

## skills/shared/execute — reference spec, not invokable

This is documentation for how the scorer and runner interpret `rubric.md`.
You don't run it. Read it at `skills/shared/execute/SKILL.md` if you
want the full match-type and diff-application reference.

---

## agents/improver — the self-improvement loop

### Bootstrap a target (measure its first baseline)

```
improver bootstrap agents/greeter
```

Expected: parses greeter's `rubric.md`, validates rule blocks, runs
each input, computes `baseline_score`, writes it back into
`rubric.md`.

### Run an improvement cycle

```
improver run agents/greeter --objective "handle unicode names"
```

Expected: improver proposes candidate diffs, scores them against
`rubric.md`, keeps winners, writes a report under `memory/runs/`.

### Re-measure baseline after editing the rubric

```
improver bootstrap --rebaseline agents/greeter
```

Expected: re-invokes greeter against current rubric rules, overwrites
`baseline_score` in place.

### Regenerate a run's REPORT.md without rerunning the loop

```
improver report memory/runs/<run-id>
```

Expected: rebuilds `REPORT.md` from the evidence files on disk.

---

## If output doesn't match what a `rubric.md` rule expects

This is the common case when you first point a new LLM at an existing
agent. The rule is the automation's ground truth, but your LLM may
produce something different. Two ways to handle it:

1. **Adjust the rule** in the target's `rubric.md` to match the
   observed behavior (and re-run `improver bootstrap --rebaseline`).
2. **Tighten the skill's `## Behavior`** section so future LLMs produce
   the output the rule already expects.

Either is valid depending on which you consider authoritative: your
observed LLM output, or the skill specification.
