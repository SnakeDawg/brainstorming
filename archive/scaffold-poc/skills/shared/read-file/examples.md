# read-file — worked examples

Worked input/output pairs for the `read-file` shared skill. These are
**not scored** — they exist so calling agents can verify their tests
exercise shared skill behavior, and so humans can confirm the skill
contract at a glance.

## Example 1: Normal file read

**Input:**
```json
{ "path": "./names/ada.txt" }
```

**Output:**
```json
{ "contents": "Ada Lovelace" }
```

## Example 2: File not found

**Input:**
```json
{ "path": "./does-not-exist.txt" }
```

**Output:**
```json
{ "error": "File not found: ./does-not-exist.txt" }
```

## Example 3: Binary file rejection

**Input:**
```json
{ "path": "./images/logo.png" }
```

**Output:**
```json
{ "error": "Binary file not supported: ./images/logo.png (read-file is text-only)" }
```
