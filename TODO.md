# TODO — follow-ups from review of commit fcf0644 (Issues 1–9)

Proposed changes only. Check off as resolved.

---

## Bugs (correctness issues)

- [x] **Regression rule is wrong under `partial_credit: true`.**
  `agents/improver/skills/score/SKILL.md` → "Regression detection".
  Current: `baseline.score_t == 1.0 AND candidate.score_t < 1.0`.
  Generalize to: `candidate.score_t < baseline.score_t - tolerance` so
  partial-credit drops (e.g. 0.67 → 0.00) are flagged.

- [x] **Scorer self-test only covers `contains` and `exact`.**
  `agents/improver/skills/score/SKILL.md` → "Scorer self-test (Issue 9)".
  Add one canonical case per match type (8 total). Bugs in `regex`,
  `json_path`, `length_between`, `equals_number`, `not_contains`, `shell`
  currently slip past the gate.

- [x] **Self-test fixture is prose inside SKILL.md.**
  Same file. Move fixture to `agents/improver/skills/score/self_test.md`
  as real `~~~test~~~` blocks parsed by the normal path. Prose requires
  LLM interpretation, reintroducing variability into the scoring gate.

- [x] **Match-types table duplicated in 3 places.**
  `README.md` ("Test locally"), `SELF-IMPROVEMENT.md` ("Match types"),
  `skills/shared/execute/SKILL.md`. Execute is canonical; replace the
  other two copies with a name-only list and a link.

- [x] **Bootstrap and score disagree on weight-sum handling.**
  `agents/improver/skills/bootstrap/SKILL.md` step 4.5 says "warn";
  `agents/improver/skills/score/SKILL.md` pre-flight says "warn outside
  tolerance, error if sum is 0". Align bootstrap to match score.

---

## Improvements (material but not correctness)

- [x] **Worked example is stale relative to Issues 1–9.**
  `memory/runs/2026-04-14-greeter-empty-input/`. Missing: hex suffix in
  run-id, `cost_*` fields in `*.run.md`, `reasoning_chain` in `*.diff.md`,
  `rubric_version` tracking, cost in REPORT.md banner. Either backfill or
  add a "predates Issues 1–9" banner at the top of REPORT.md.

- [x] **`trigger: production_count` in greeter is aspirational.**
  `agents/greeter/rubric.md`. Nothing counts production invocations.
  Either switch to `trigger: manual` or document the external-signal
  requirement in SELF-IMPROVEMENT.md.

- [x] **`saturated_iterations: 6` rationale missing.**
  `agents/improver/AGENT.md` → "Improvement policy". Add one sentence
  explaining why near-saturation does a *wider* search (unintuitive).

- [x] **Add RESEARCH.md for external references.**
  "Agent Party", "Tyler Cox", "SICA", "_fuzzy_find" are referenced across
  multiple skill files without definition. Create one bibliography and
  replace inline references with links.

- [x] **Decouple rubric-version check from HISTORY.md.**
  `agents/improver/skills/score/SKILL.md` pre-flight reads HISTORY.md to
  find last run's rubric version. Store `rubric_version` in each run's
  `baseline.md` instead so HISTORY.md stays strictly output.

- [x] **`rebaseline` under-described in README "Test locally".**
  `README.md`. Current text implies dry-run lint but rebaseline
  overwrites `baseline_score`. Move out of Test section or warn that it
  mutates state.

- [x] **Onboard wizard callout points at vaporware.** *(resolved: skills/onboard/ was built)*
  `README.md` Quickstart. Either delete or mark clearly as "proposed,
  not implemented".

- [x] **Bootstrap should write default `improvement_policy` block.**
  `agents/improver/skills/bootstrap/SKILL.md` step 5. Currently generates
  weights + epsilon + acceptance but not policy; policy appears out of
  nowhere in greeter's rubric.

---

## Nits

- [x] **`shell` match-type 10s timeout is hard-coded.**
  `skills/shared/execute/SKILL.md` §2.8. Allow per-test
  `shell_timeout: <n>` override.

- [x] **`regex` MULTILINE semantics unspecified.**
  `skills/shared/execute/SKILL.md` §2.4. DOTALL is specified; MULTILINE
  (for `^`/`$`) is not. Add one sentence.

- [x] **`contains` with empty `expected` vacuously passes.**
  `skills/shared/execute/SKILL.md` §2.2 and
  `agents/improver/skills/bootstrap/SKILL.md` step 4. Have bootstrap
  warn on empty-expected `contains` tests (likely author bug).

- [x] **`json_path` silent first-match is a bug magnet.**
  `skills/shared/execute/SKILL.md` §2.5. Either error or require
  explicit `[0]` indexing when the path returns multiple results.

- [x] **`execute` archetype mismatch.**
  `skills/README.md`. Registered as a shared skill but never invoked —
  it's a reference spec. Add a sentence distinguishing "callable shared
  skills" from "reference specs", or introduce a new archetype.

- [x] **Run-id hex seed is deterministic.**
  `agents/improver/AGENT.md` → "Run ID format". A script loop at
  identical ISO seconds collides. Use a random nonce or ISO-millisecond
  precision.

- [x] **References duplicated between README.md and SELF-IMPROVEMENT.md.**
  Pick one home, link from the other.

- [x] **`reasoning_chain.rejected_approaches` needs prompt pressure.**
  `agents/improver/skills/propose/SKILL.md`. Without explicit instructions,
  proposers will emit empty lists. Add a rule that propose MUST consider
  ≥2 approaches and record what was rejected.

---

# Round 2 — gaps found in real Windsurf use + new-surface review

The 20 items above are all resolved. The items below were found by:
(a) scanning `agents/summarizer/` and `skills/onboard/` (new surfaces not
in the original review), and (b) the user's real Windsurf invocation
`Run agents/greeter with input "ADA"` returning `hello, Ada! Welcome` —
which doesn't match `tests.md` and exposes that the docs don't tell
users how to actually use the scaffold.

---

## How-to-use docs (highest priority — user-flagged)

- [ ] **No setup instructions per LLM tool.**
  `README.md` "Use" section. Says "Ask your LLM agent (Claude Code,
  Windsurf, etc.)" without explaining how to point each tool at this
  repo (symlink into `.claude/skills/`? open as workspace? root drop?).
  Add a per-tool subsection: Claude Code, Windsurf, Cursor.

- [ ] **No expected-output example.**
  `README.md` "Use" section. Real Windsurf output for `input "ADA"` is
  `hello, Ada! Welcome` — lowercase h, no period, case-normalized name.
  Show the actual transcript so users can sanity-check their setup.

- [ ] **No "first run" walkthrough.**
  `README.md`. There's a Create flow with steps but no Use flow with
  a transcript. Add an end-to-end "try greeter in 30 seconds" section.

- [ ] **Invocation grammar undocumented.**
  `README.md` "Use" section. `Run agents/greeter with input "Ada"` is
  shown but never declared as the canonical phrase. Pin one phrasing
  as the contract (or document equivalents).

- [ ] **summarizer and onboard absent from Use examples.**
  `README.md` "Use" section. Only greeter and `summarize-text` are
  exemplified. Add invocation examples for `summarizer` (the new
  cross-skill agent) and `onboard` (the new wizard).

- [ ] **No troubleshooting section for output drift.**
  `README.md`. When LLM output diverges from `tests.md` (the case the
  user just hit), users have no guidance. Add a "what to do when output
  doesn't match tests" subsection pointing at `improver bootstrap
  --rebaseline`.

- [ ] **"Prompt corpus, not runtime" never stated.**
  `README.md` opening. New users will look for an executable. State
  explicitly that this repo is a corpus of markdown files an LLM agent
  reads — there is no binary to install or daemon to run.

---

## Tests-vs-reality drift

- [ ] **greeter t1/t2/t3 case-strict; LLM produces lowercase.**
  `agents/greeter/tests.md`. Observed Windsurf output `hello, Ada!`
  fails t1 expecting `contains "Hello, Ada"`. Add `normalize: case`
  to all three tests, OR pin format-greeting to a stricter casing
  contract.

- [ ] **No test for input case-normalization.**
  `agents/greeter/tests.md`. User typed `"ADA"` and got `"Ada"` back.
  Add a t4 covering uppercase input → properly-cased name in output.

- [ ] **summarizer t1 regex `^- .+` is fragile.**
  `agents/summarizer/tests.md`. The `^` anchor fails if the LLM adds a
  preamble like "Here's the summary:" before the bullets. Use
  `(?m)^- ` or replace with `match: contains, expected: "- "`.

- [ ] **summarizer doesn't test the 3–5 bullet count rule.**
  `agents/summarizer/tests.md`. `format-summary/SKILL.md` strictly
  requires 3–5 bullets but no test enforces the count. Add a test
  using `match: regex` with a count constraint or `match: shell` with
  `grep -c '^- '`.

- [ ] **`baseline_score: 1.00` in greeter/rubric.md is fictional.**
  `agents/greeter/rubric.md`. Was written by hand assuming post-fix
  output, never measured against real LLM output. Set to `null` and
  add a comment "run `improver bootstrap --rebaseline agents/greeter`
  to populate."

- [ ] **summarizer/HISTORY.md created but never measured.**
  `agents/summarizer/HISTORY.md`. Same fiction as greeter — appears to
  show measured runs that never happened. Either delete (not generated
  yet) or add a "predates first real run" banner.

---

## New-surface gaps (summarizer, onboard)

- [ ] **summarizer "expand single sentence into 3 bullets" encourages padding.**
  `agents/summarizer/skills/format-summary/SKILL.md` Edge cases section.
  "Expand into 3 bullets by restating from different angles" is exactly
  the kind of hallucination an LLM will happily produce. Strike this
  rule or replace with "return as a single bullet".

- [ ] **onboard interactive mode lacks an end-to-end worked example.**
  `skills/onboard/SKILL.md`. Describes the question flow but no sample
  transcript shows what an actual interactive session looks like in a
  Claude Code conversation. Add one full example (questions + LLM
  output + final files written).

- [ ] **onboard `{{ }}` placeholder syntax is undefined.**
  `skills/onboard/SKILL.md` § Templates. Mustache? Handlebars? Plain
  string substitution? Pick one and document it (or link to a one-page
  spec).

- [ ] **onboard "output format" — LLM writes files vs human copy-pastes is ambiguous.**
  `skills/onboard/SKILL.md` § Output format. "The executor writes each
  section's content to the indicated path" — but the executor IS the
  LLM. Clarify: does the LLM use file-write tools, or does it print
  text the human copy-pastes? Different UX.

- [ ] **onboard not mentioned in README "Use" section.**
  `README.md`. Despite being the primary user-facing creation surface,
  onboard isn't shown as an invocable skill in the Use section. Add an
  `Run skills/onboard` example.

