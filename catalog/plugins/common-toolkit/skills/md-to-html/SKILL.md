---
name: md-to-html
description: Convert a Markdown file to standalone HTML. Use when the user asks for HTML output, a static page, release notes from a markdown file, or wants to preview markdown in a browser.
allowed-tools: Read Write Bash(python3 *)
argument-hint: <input.md> [output.html]
---

# md-to-html

Converts a Markdown file to a single self-contained HTML document with
inlined CSS. No external assets, no network calls.

## When to use

The user wants HTML output from a Markdown source — release notes, a static
page, an email-able document, a quick browser preview.

## Steps

1. **Confirm the input.** Read the source `.md` file with the Read tool to be
   sure the path exists and the file isn't empty.

2. **Pick an output path.** If the user didn't specify one, use the input
   filename with `.html` extension in the same directory.

3. **Run the converter.** It's a self-contained Python 3 script that uses
   only the standard library:
   ```bash
   python3 ${CLAUDE_SKILL_DIR}/scripts/md_to_html.py <input.md> <output.html>
   ```

4. **Verify and report.** Confirm the file exists and tell the user the
   output path. If `--title "..."` was provided by the user, pass it through
   as a third argument.

## Supported Markdown features

The bundled converter handles the common cases:

- Headings (`#` through `######`)
- Paragraphs and line breaks
- Bold (`**x**`), italic (`*x*`), inline code (`` `x` ``)
- Fenced code blocks (```` ``` ````)
- Unordered lists (`-`, `*`)
- Ordered lists (`1.`)
- Links (`[text](url)`)
- Horizontal rules (`---`)
- Blockquotes (`>`)

It does **not** handle: tables, footnotes, embedded HTML, or images. For
those, ask the user if a real markdown library (e.g. `markdown-it-py`) is
acceptable as a dependency.

## Output styling

The HTML includes a small inline `<style>` block with system fonts, sensible
spacing, and dark-mode support via `prefers-color-scheme`. No external CSS.
