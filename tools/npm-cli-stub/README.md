# `npm` CLI stub

`@semantic-release/npm` declares the whole `npm` CLI as a runtime dependency. That package ships its
own dependencies inside its tarball (`bundleDependencies`), and those bundled copies are currently
flagged by `npm audit`:

- `brace-expansion@5.0.7` (high) — GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895
- `ip-address@10.2.0` (high) — GHSA-mwp4-54f8-5fhr, GHSA-4xrf-jv44-h6hh, GHSA-22jq-vg5j-6vgg
- `tar@7.5.19` (moderate) — GHSA-r292-9mhp-454m
- `undici@6.27.0` (moderate) — GHSA-8xcm-r25x-g524, GHSA-m8rv-5g2x-5cg5, GHSA-v3r7-h72x-cjcm

They cannot be patched in place from this repository:

- `overrides` are ignored for packages marked `inBundle`, so pinning fixed versions has no effect —
  the lockfile keeps the bundled versions verbatim.
- No published `npm` release carries fixed bundles. `10.9.9`, `11.19.0` and `12.0.2` (all released
  2026-07-29) were checked by unpacking their tarballs, and older lines carry more advisories, not
  fewer.

## What this stub does

`@semantic-release/npm` never imports the `npm` package — every call site spawns the CLI with
`execa("npm", …, { preferLocal: true })`. The vendored copy exists only to guarantee a binary at
`node_modules/.bin/npm`.

This folder is a dependency-free package named `npm` that provides no binary. It is linked in from
the root manifest:

```json
"devDependencies": {
  "npm": "file:tools/npm-cli-stub"
}
```

`@semantic-release/npm` deduplicates its own `npm` requirement onto this link, so the vulnerable
tarball never enters the tree. With no `node_modules/.bin/npm` present, `execa` falls through to the
`npm` already on `PATH` — the one `actions/setup-node` installs in CI, which is patched
independently of this repository.

`semantic-release` and its plugins stay ordinary, version-locked `devDependencies`; only the
redundant vendored CLI is removed.

## Removing this stub

Delete this folder and the `npm` entry from the root `devDependencies` once `npm` publishes a release
whose bundled `brace-expansion`, `ip-address`, `tar` and `undici` are all clean, then run
`npm install`.
