You are generating a polished, self-contained HTML report from a completed Hermes simulation run. The `.working/` markdown files are the lineage record; this HTML file is the user-facing artifact.

## Step 1 — Locate the run

If $ARGUMENTS contains a prefix string (e.g. `2026-04-27-1430-some-topic-slug`), use it directly.

Otherwise, list `.working/` and identify the most recent run prefix by sorting on the date+time component. Ignore `.gitkeep`, `sample/`, and any path that does not match the pattern `YYYY-MM-DD-HHMM-*-roundN.md`.

The five source files are:
```
.working/<prefix>-round1.md
.working/<prefix>-round2.md
.working/<prefix>-round3.md
.working/<prefix>-round4.md
.working/<prefix>-round5.md
```

Read all five. If any file is missing, list which ones are absent and stop — do not generate a partial report.

## Step 2 — Extract structured data

From **round5.md** extract:
- **Header block:** Scenario, Topic, Teams, Date
- **§1 Top 5 Requirements** — for each: title, rationale, champion, concessions made, dependencies, risks
- **§2 Inputs Needed** — by role
- **§3 Outputs Produced** — by role
- **§4 Cross-Functional Dependencies** — the full dependency list
- **§5 Conflicts and Misalignments** — each conflict with parties and round 4 disposition
- **§6 Open Questions** — each question with who needs to answer
- **§7 Risks** — from round 4 and structural risks separately
- **§8 Next Steps** — action, owner, timeframe
- **§9 Moderator Notes** — full text
- **Score Sheet** — all 9 criteria with score and evidence
- **Realism Smell Test** — the three answers

From **round2.md** extract the "tensions still on the table" or equivalent conflict summary (used in the Highlights section).

## Step 3 — Compute score summary

From the score sheet, classify each of C1–C7:
- Score 2 → Strong
- Score 1 → Partial
- Score 0 → Weak
C8 and C9 are always "Requires second run".

Total = sum of C1–C7 scores (max 14 on a single run).

## Step 4 — Write the HTML report

Write a single self-contained HTML file to `outputs/<prefix>-report.html`.

**All CSS must be embedded in a `<style>` block in the `<head>`. No external stylesheets, no CDN links, no JavaScript.**

### HTML structure

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Topic] — Hermes Report</title>
  <style>
    /* all styles here */
  </style>
</head>
<body>
  <!-- sections in the order below -->
</body>
</html>
```

### Sections (in order)

**1. Page header**
- Large `<h1>`: the Topic verbatim
- Subtitle line: `Scenario: X · Teams: Y · Date: Z`
- Score badge pill: `[N / 14 this run]` — colored green if N ≥ 12, amber if 8–11, red if < 8

**2. Score Dashboard**
Table with columns: **Criterion** | **Score** | **Rating** | **Evidence (condensed)**
- Row background by rating: green `#d1fae5` for Strong (2/2), amber `#fef3c7` for Partial (1/2), red `#fee2e2` for Weak (0/2), grey `#f3f4f6` for "Requires second run"
- Bold totals row at bottom: **Total | N / 14 | — | C8 & C9 require a second run to score**

**3. Top 5 Requirements**
One card per requirement, in rank order:
- Header bar with rank number badge (circle) + title + champion tag
- Rationale paragraph
- Three-column detail row: **Dependencies** | **Concessions Made** | **Risks**

**4. Conflicts & Misalignments**
Table: **Conflict** | **Parties** | **Round 4 Disposition**
Color-code disposition column: red for Unresolved/Deferred, amber for Partially Resolved, green for Resolved.

**5. Open Questions**
Table: **Question** | **Who Must Answer** | **In Room?**
Flag "not in room" rows with a red indicator.

**6. Risks**
Two subsections with `<h3>` headings: "Raised in Round 4" and "Structural Risks (Moderator)". Use a `<ul>` for each.

**7. Next Steps**
Full §8 table styled with columns: **Action** | **Owner** | **Timeframe**
Highlight "This week" timeframe rows with a subtle amber left-border.

**8. Cross-Functional Dependencies**
Clean table extracted from §4. Columns: **Artifact** | **Produced By** | **Consumed By**

**9. Inputs & Outputs by Role**
Two-column grid layout (Inputs left, Outputs right) for each of the 5 roles. Use `<h4>` role names as row labels.

**10. Moderator Notes**
Full §9 text in a styled callout box (left border accent, light background).

**11. Realism Smell Test**
Three questions and answers in a styled aside.

**12. Run Lineage**
A small footer section listing the five source `.working/` files with the run prefix and generation date. Label it "Source files (lineage)".

### Design spec

```css
/* Core palette */
--color-bg: #f9fafb;
--color-surface: #ffffff;
--color-header-bg: #1e293b;
--color-header-text: #f8fafc;
--color-accent: #3b82f6;
--color-accent-dark: #1d4ed8;
--color-border: #e2e8f0;
--color-text: #1e293b;
--color-muted: #64748b;

/* Score colors */
--color-strong: #d1fae5;
--color-strong-text: #065f46;
--color-partial: #fef3c7;
--color-partial-text: #92400e;
--color-weak: #fee2e2;
--color-weak-text: #991b1b;
--color-na: #f3f4f6;
--color-na-text: #374151;
```

Layout:
- `max-width: 960px`, centered, `padding: 0 1.5rem`
- Body background: `--color-bg`
- Cards/tables: white background, `border-radius: 8px`, `box-shadow: 0 1px 3px rgba(0,0,0,.1)`
- Section headings (`h2`): dark navy with a 3px left border in accent blue
- Requirement rank badges: filled circle, white text, accent blue background
- Champion tags: small pill, grey background
- Tables: full width, `border-collapse: collapse`, alternating row shading every other row `#f8fafc`
- Print media query: remove box-shadows and colored backgrounds from score rows (print in greyscale gracefully)

After writing the file, output one line:
`Report written: outputs/<prefix>-report.html`
