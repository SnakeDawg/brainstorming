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
