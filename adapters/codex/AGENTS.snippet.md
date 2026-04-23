<!-- documentation-skill:start -->
## documentation skill

This project follows the gentleman-programming documentation convention: a tiered
set of narrative markdown files, scaling from minimum (4 files) to producto (15+).

### Tiers

| Tier | When | File count |
|------|------|------------|
| **minimum** | scripts, small libs, WordPress themes | 4 |
| **standard** (default) | web apps, libraries, small products | 6-8 |
| **producto** | SaaS, multi-tenant, apps with users and revenue | 15+ |

Auto-detect (first match wins): **producto** if auth deps or ORM + migrations or multi-tenant signals; **minimum** if WordPress theme, single-file tool, or shell-scripts-only; **standard** otherwise. User can override in natural language or with `--tier=...`.

### Canonical file set

**minimum**: `README.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `PLANS.md`.

**standard**: everything in minimum + `SUBAGENTS.md`, `AGENTS.md` (optional), `docs/references/*.md`.

**producto**: everything in standard + `docs/DESIGN.md`, `docs/FRONTEND.md`, `docs/PRODUCT_SENSE.md`, `docs/QUALITY_SCORE.md`, `docs/RELIABILITY.md`, `docs/SECURITY.md`, `docs/design-docs/index.md`, `docs/product-specs/index.md`, plus `docs/exec-plans/` and `docs/generated/` as needed.

### Rules

1. **Pick the tier first.** Detection is a suggestion — the user decides.
2. **Narrative over hidden rules.** Markdown at the root beats opaque config.
3. **One concern per file.** Architecture, roadmap, and conventions never mix.
4. **Short root files, deep references.** Root files under ~200 lines.
5. **Detect first, then write.** Read manifests before filling any template.
6. **Update in place.** Diff before overwriting. Never silent overwrites.
7. **Commit-friendly.** Every file must be diffable and stable.
8. **Do not fabricate.** For producto-tier sections without real content yet, leave the template hints and mark `<!-- TODO: fill when ready -->`.

### Workflow when documenting

1. **Detect stack** — read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json`, or WordPress signals.
2. **Detect tier** — apply heuristics; default to `standard`.
3. **Audit existing docs** — missing → create; exists → diff against template; out of convention → propose migration. Preserve higher-tier docs that already exist.
4. **Apply templates** — fill placeholders with detected values.
5. **Confirm** — present detected tier, stack, files to create grouped by tier, files to update with diff summary. Wait for explicit GO.
6. **Write atomically** — new files in one shot, existing files with diff-style edits only. Create `.gitkeep` for empty subdirectories.

### Placeholders

`{{PROJECT_NAME}}`, `{{DESCRIPTION}}`, `{{LANGUAGE}}`, `{{FRAMEWORK}}`,
`{{PACKAGE_MANAGER}}`, `{{TEST_RUNNER}}`, `{{INSTALL_COMMAND}}`,
`{{RUN_COMMAND}}`, `{{TEST_COMMAND}}`, `{{BUILD_COMMAND}}`,
`{{LINT_COMMAND}}`, `{{LICENSE}}`.
<!-- documentation-skill:end -->
