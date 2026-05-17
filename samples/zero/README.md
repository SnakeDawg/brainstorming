# Zero language sample

[Zero](https://github.com/vercel-labs/zero) is an experimental systems
programming language from **Vercel Labs** (publicly released May 2026,
v0.1.x, Apache-2.0). It sits in the same design space as C or Rust —
native executables, explicit memory control, low-level targets — but its
compiler and toolchain were designed from day one to be consumed by **AI
agents**, not just humans.

## Why it exists

Most languages communicate failure through prose error messages and stack
traces that humans read and interpret. Agents do that poorly. Zero's pitch:

- **Everything is explicit** — no hidden allocators, no implicit async, no
  magic globals. Side effects (like writing to stdout) flow through an
  explicit `World` capability passed into `main`.
- **Explicit effects** — fallible functions declare `raises`, callers must
  `check` them, so error paths are visible in the source, not implied.
- **Structured compiler output** — diagnostics are emitted as JSON with
  stable codes and machine-parseable repair hints.
- **Small + fast** — sub-10 KiB native binaries; no LLVM backend.

## The sample

`sample.0` is a short tour covering plain functions, generics, immutable
(`let`) vs. mutable (`let mut`) bindings, the explicit error effect
(`raises` / `raise` / `check`), and stdout via `world.out.write`.

File extension is `.0`. With the `zero` toolchain installed:

```sh
zero check samples/zero/sample.0   # type/syntax check only
zero run   samples/zero/sample.0   # compile + run  ->  zero: math works
zero build --emit exe --target linux-musl-x64 samples/zero/sample.0
```

> Zero is experimental and unstable; syntax here matches the upstream
> language reference at time of writing and may drift.
