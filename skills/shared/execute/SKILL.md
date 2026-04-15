---
name: execute
description: Canonical spec for deterministic test execution — match types, diff application, and test-block parsing. The single source of truth for how the improver's score and run skills interpret tests.md.
scope: shared
consumers: any
---

# execute

The **canonical execution reference** for the brainstorming scaffold.
Every match type, diff application rule, and `~~~test~~~` parsing rule is
defined here. If prose in other files conflicts with this spec, this spec
wins.

This skill is not invoked directly. It is a **reference spec** consumed by:

- [`score`](../../../agents/improver/skills/score/SKILL.md) — to evaluate outputs
- [`run`](../../../agents/improver/skills/run/SKILL.md) — to apply diffs and capture outputs
- [`bootstrap`](../../../agents/improver/skills/bootstrap/SKILL.md) — to validate test syntax

## 1. `~~~test~~~` Block Parsing

### Grammar (EBNF-style)

```
test_block  = "~~~test" NEWLINE fields NEWLINE "~~~"
fields      = field { NEWLINE field }
field       = key ":" SP value
key         = "id" | "name" | "input" | "match" | "expected"
            | "samples" | "pass_rate" | "partial_credit"
            | "normalize" | "tolerance" | "exercises"
value       = quoted_string | number | boolean | list
```

### Required fields

| Field    | Type   | Default | Description |
|----------|--------|---------|-------------|
| `id`     | string | —       | Unique test identifier (e.g. `t1`). Must match rubric weight IDs. |
| `name`   | string | —       | Human-readable label. |
| `input`  | string | —       | The input passed to the target. May be empty string `""`. |
| `match`  | string | —       | One of the 8 match types below. |
| `expected` | string/number/list | — | The expected value (type depends on match). |

### Optional fields

| Field            | Type    | Default | Description |
|------------------|---------|---------|-------------|
| `samples`        | int     | 3       | Number of independent invocations per test. |
| `pass_rate`      | float   | 1.00    | Minimum fraction of samples that must pass. |
| `partial_credit` | boolean | false   | If true, `score_t = sample_rate` instead of binary. |
| `normalize`      | string  | none    | Apply normalization before matching (`whitespace`, `case`, `both`). |
| `tolerance`      | float   | 0       | For `equals_number`: allowed absolute difference. |
| `json_path_expr` | string  | —       | For `json_path`: the JSONPath expression to evaluate against the parsed JSON output. |
| `shell_timeout`  | int     | 10      | For `shell`: seconds before the command is killed and the sample is marked FAIL. |
| `exercises`      | list    | []      | Shared skill names this test exercises (informational). |

## 2. Match Types — All 8, Fully Specified

### 2.1 `exact`

```
PASS iff normalize(output) == normalize(expected)
```

| Edge case | Behavior |
|-----------|----------|
| Empty output, empty expected | PASS |
| Empty output, non-empty expected | FAIL |
| Trailing newline in output | Stripped before comparison (always) |
| Unicode normalization | NFC form applied to both sides |
| `normalize: whitespace` | Collapse all `\s+` runs to single space, strip leading/trailing |
| `normalize: case` | Lowercase both sides |
| `normalize: both` | Apply whitespace then case normalization |

**Pseudocode:**
```
def match_exact(output, expected, normalize_mode):
    o = strip_trailing_newline(output)
    e = strip_trailing_newline(expected)
    o = nfc(o); e = nfc(e)
    if normalize_mode in ("whitespace", "both"):
        o = collapse_whitespace(o); e = collapse_whitespace(e)
    if normalize_mode in ("case", "both"):
        o = lowercase(o); e = lowercase(e)
    return o == e
```

### 2.2 `contains`

```
PASS iff expected is a substring of output
```

| Edge case | Behavior |
|-----------|----------|
| Empty expected | PASS (empty string is substring of everything) |
| Empty output, non-empty expected | FAIL |
| Case sensitivity | Case-sensitive by default. Use `normalize: case` for insensitive. |
| Multiline output | Substring search spans the entire output including newlines |

**Pseudocode:**
```
def match_contains(output, expected, normalize_mode):
    o = apply_normalize(output, normalize_mode)
    e = apply_normalize(expected, normalize_mode)
    return e in o
```

### 2.3 `not_contains`

```
expected is a list of strings.
PASS iff NONE of the listed strings appear in output.
```

| Edge case | Behavior |
|-----------|----------|
| Empty list | PASS (vacuously true) |
| Empty output | PASS (nothing can be found in empty string) |
| One item matches, others don't | FAIL |

**Pseudocode:**
```
def match_not_contains(output, forbidden_list, normalize_mode):
    o = apply_normalize(output, normalize_mode)
    for item in forbidden_list:
        e = apply_normalize(item, normalize_mode)
        if e in o:
            return False
    return True
```

### 2.4 `regex`

```
PASS iff regex pattern matches anywhere in output (search, not fullmatch).
```

| Edge case | Behavior |
|-----------|----------|
| Empty pattern | PASS (matches everything) |
| Empty output | Depends on pattern (e.g. `^$` matches, `.+` does not) |
| Multiline (`re.DOTALL`) | `.` matches newlines by default — the pattern spans the entire output as one string |
| Line anchors (`^`/`$`) | Match start/end of the **entire output**, not per-line. `re.MULTILINE` is **not** applied. Use `\n` in the pattern if per-line matching is needed. |
| Invalid regex | ERROR — halt scoring with diagnostic message |

**Pseudocode:**
```
def match_regex(output, pattern):
    try:
        return re.search(pattern, output, re.DOTALL) is not None
    except re.error as e:
        raise ScoringError(f"Invalid regex in test: {e}")
```

### 2.5 `json_path`

```
Parse output as JSON. Evaluate the JSONPath expression from `json_path_expr`.
PASS iff result == expected.
```

`json_path_expr` is a required field when `match: json_path` (see optional
fields table). `expected` is the expected scalar value after evaluation.

| Edge case | Behavior |
|-----------|----------|
| Output is not valid JSON | FAIL |
| JSONPath returns no match | FAIL |
| JSONPath returns multiple matches | ERROR — halt scoring. Use explicit `[N]` indexing in `json_path_expr` to select a specific result. |
| Expected is a number | Compare after type coercion (int/float) |

**Pseudocode:**
```
def match_json_path(output, path_expr, expected):
    try:
        data = json.parse(output)
    except ParseError:
        return False
    results = jsonpath(data, path_expr)
    if not results:
        return False
    if len(results) > 1:
        raise ScoringError(
            f"json_path returned {len(results)} results. "
            f"Use explicit [N] indexing in json_path_expr."
        )
    return coerce_equal(results[0], expected)
```

### 2.6 `length_between`

```
expected: [min, max]
PASS iff min ≤ len(output) ≤ max
```

| Edge case | Behavior |
|-----------|----------|
| `len(output)` counts characters (not bytes) | Always |
| Trailing newline | Stripped before length measurement |
| `min > max` | ERROR — halt scoring |
| `min == max` | Exact length match |

**Pseudocode:**
```
def match_length_between(output, min_len, max_len):
    length = len(strip_trailing_newline(output))
    return min_len <= length <= max_len
```

### 2.7 `equals_number`

```
Parse output as number. PASS iff |output - expected| ≤ tolerance.
```

| Edge case | Behavior |
|-----------|----------|
| Output is not a number | FAIL |
| Output has surrounding whitespace | Stripped before parsing |
| Output contains units (e.g. "42 kg") | FAIL — must be bare number |
| Integer vs float | Both parsed as float for comparison |
| Default tolerance | 0 (exact numeric match) |

**Pseudocode:**
```
def match_equals_number(output, expected, tolerance=0):
    try:
        val = float(output.strip())
    except ValueError:
        return False
    return abs(val - float(expected)) <= tolerance
```

### 2.8 `shell`

```
expected is a shell command string.
Output is piped as stdin to the command.
PASS iff exit code == 0.
```

| Edge case | Behavior |
|-----------|----------|
| Command not found | FAIL |
| Command times out | FAIL — timeout is `shell_timeout` seconds (default 10) |
| stderr output | Ignored — only exit code matters |
| Empty output piped | Command receives empty stdin |

**Pseudocode:**
```
def match_shell(output, command, shell_timeout=10):
    result = subprocess.run(
        command, shell=True,
        input=output, timeout=shell_timeout,
        capture_output=True
    )
    return result.returncode == 0
```

## 3. Diff Application Spec

### Format

Diffs use **unified diff format** (like `diff -u` output):

```
--- a/path/to/file
+++ b/path/to/file
@@ -start,count +start,count @@
 context line
-removed line
+added line
```

### Application rules

1. **Target**: Always a scratch copy, never the live target.
2. **Tiered match strategy** (from Agent Party [`_fuzzy_find`](../../../RESEARCH.md#_fuzzy_find--tiered-diff-application)):
   - **Tier 1 — Exact**: Context lines must match the scratch file byte-for-byte.
   - **Tier 2 — Whitespace-normalized**: If exact match fails, collapse all whitespace runs to single space and retry. Log `[fuzzy match]` if this tier succeeds.
   - **Tier 3 — Error**: If both tiers fail, the diff is unappliable. Write `verdict: reject (diff unappliable)` and halt.
3. **Never silently skip** a hunk. Every hunk must apply or the entire diff is rejected.
4. **Post-apply validation** (from Agent Party):
   - If the target file is JSON: parse the result. Reject diff if invalid JSON.
   - If the target file is YAML: parse the result. Reject diff if invalid YAML.
   - If the target file is a shell script: run `bash -n` on the result. Reject diff if syntax error.
   - For all other files: no structural validation (only match-type scoring applies).

### Worked example

Given scratch file `SKILL.md`:
```markdown
## Behavior

input: { name: "" }
output: { greeting: "Hello!" }
```

And diff:
```
--- a/SKILL.md
+++ b/SKILL.md
@@ -3,1 +3,1 @@
-output: { greeting: "Hello!" }
+output: { greeting: "Hello, friend!" }
```

Result after application:
```markdown
## Behavior

input: { name: "" }
output: { greeting: "Hello, friend!" }
```

## 4. Normalization Reference

The `apply_normalize` helper used by multiple match types:

```
def apply_normalize(text, mode):
    text = strip_trailing_newline(text)
    text = nfc(text)                        # Unicode NFC normalization
    if mode in ("whitespace", "both"):
        text = re.sub(r'\s+', ' ', text).strip()
    if mode in ("case", "both"):
        text = text.lower()
    return text

def strip_trailing_newline(text):
    return text.rstrip('\n')
```

## 5. Error Handling

All errors during execution are **loud and halting**, never silent:

| Error | Behavior |
|-------|----------|
| Unknown match type in `~~~test~~~` block | ERROR — halt scoring, name the unknown type |
| Malformed `~~~test~~~` block (missing required field) | ERROR — halt scoring, name the missing field |
| Test ID in `tests.md` not found in `rubric.md` weights | ERROR — halt scoring (Issue 4 validation) |
| Diff hunk does not apply (tier 1 + tier 2 failed) | REJECT candidate, log which hunk failed |
| Post-apply structural validation fails | REJECT candidate, log the parse error |
| `shell` match command times out | FAIL the sample, log timeout |
| Invalid regex pattern | ERROR — halt scoring, log regex error |
