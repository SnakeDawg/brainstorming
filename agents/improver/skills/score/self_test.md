# Score self-test fixture

One `~~~test~~~` block per match type (8 pass cases + 2 fail-guard cases).

`score` reads this file using the same `~~~test~~~` parser it uses for any
`rubric.md`. For each block, `score` acts as the evaluator: it runs the
declared `match` rule with `input` as the simulated target output and
`expected` (plus any type-specific field) as the expected value, then
verifies the result matches the declared `meta: pass` or `meta: fail`
annotation. If any self-test produces the wrong result, scoring halts.

No LLM is invoked during self-test. The fixture is fully deterministic.

---

## Pass cases — one per match type

~~~test
id: st1-exact
name: exact — identical strings pass
input: "42"
match: exact
expected: "42"
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st2-contains
name: contains — expected is substring of output
input: "hello world, welcome"
match: contains
expected: "hello world"
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st3-not-contains
name: not_contains — none of the forbidden strings appear
input: "hello world"
match: not_contains
expected: ["goodbye", "farewell"]
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st4-regex
name: regex — pattern matches output (DOTALL mode)
input: "Score: 42"
match: regex
expected: "Score: \\d+"
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st5-json-path
name: json_path — JSONPath expression result equals expected value
input: "{\"name\": \"Ada\"}"
match: json_path
json_path_expr: "$.name"
expected: "Ada"
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st6-length-between
name: length_between — character count within bounds
input: "hello"
match: length_between
expected:
  min: 3
  max: 10
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st7-equals-number
name: equals_number — value within tolerance
input: "3.14"
match: equals_number
expected: 3.14
tolerance: 0.01
meta: pass
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st8-shell
name: shell — command exits 0 when output satisfies the check
input: "hello"
match: shell
expected: "grep hello"
meta: pass
samples: 1
pass_rate: 1.0
~~~

---

## Fail-guard cases — catch always-pass bugs

These cases verify the scorer rejects mismatches. If the scorer returns
`pass` for these, it has an always-pass bug.

~~~test
id: st9-exact-fail-guard
name: exact — different strings must NOT match
input: "43"
match: exact
expected: "42"
meta: fail
samples: 1
pass_rate: 1.0
~~~

~~~test
id: st10-contains-fail-guard
name: contains — absent substring must NOT match
input: "goodbye"
match: contains
expected: "hello"
meta: fail
samples: 1
pass_rate: 1.0
~~~
