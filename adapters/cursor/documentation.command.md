---
name: documentation
description: Scaffold, update, or bundle project documentation using the gentleman-programming convention (README, CLAUDE, ARCHITECTURE, PLANS, SUBAGENTS, docs/). Tiered (minimum / standard / producto). Three operations — scaffold (default), update, bundle.
---

# documentation

Invoke the documentation skill to scaffold, update, or bundle project docs.

## Pick an operation

Based on the user's phrasing:

- **scaffold** (default): create missing docs from templates for the detected tier.
- **update**: re-audit existing docs against the current code; apply section-level edits only. Never creates new files.
- **bundle**: concatenate all canonical docs into a single self-contained `.md` (default: `DOCUMENTATION.md`).

Trigger phrases:

| Operation | English | Español |
|-----------|---------|---------|
| scaffold | "document the project", "scaffold docs", "add README" | "documentar el proyecto", "scaffold docs" |
| update | "update docs", "refresh documentation", "sync docs with code" | "actualizar documentación", "revisar docs" |
| bundle | "bundle docs", "single doc file", "generate overview" | "generar documentación general", "consolidar docs" |

If ambiguous, ask.

## Workflow

1. **Detect intent** — announce `scaffold | update | bundle` to the user.
2. **Detect stack** (scaffold + update only) — read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json`, or WordPress signals (`style.css` + `functions.php`).
3. **Detect tier** (scaffold + update only) — `minimum` (WordPress theme, small libs), `standard` (default, web apps), `producto` (SaaS, multi-tenant, auth + migrations).
4. **Run the operation's sub-workflow** — see `.cursor/rules/documentation.mdc` for full sub-workflows, tier definitions, canonical file sets, and rules.
5. **Confirm before writing** — present operation, detected values, files affected. Never write without an explicit GO.
6. **Write atomically** — new files via Write, existing via Edit (diff-style only). Never batch-overwrite.

## Rules (summary)

1. Pick the tier first; detection is a suggestion — user decides.
2. Narrative over hidden rules.
3. One concern per file.
4. Short root files (<200 lines); deep content goes to `docs/references/` or `docs/<subdomain>/`.
5. Detect first, then write — never hardcode stack assumptions.
6. Update in place; never silent overwrites.
7. Commit-friendly; stable across regenerations.
8. Do not fabricate — for producto-tier sections without real content, leave hints and mark `<!-- TODO: fill when ready -->`.

See `.cursor/rules/documentation.mdc` for the full ruleset and tier tables.
