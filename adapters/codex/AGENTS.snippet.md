<!-- documentation-skill:start -->
## documentation skill

This project follows the gentleman-programming documentation convention: a fixed
set of narrative markdown files at the root, with deep dives in `docs/references/`.

### Canonical file set

| File | Purpose | Required |
|------|---------|----------|
| `README.md` | Entry point: what the project is, how to run it | Yes |
| `CLAUDE.md` | Agent conventions, stack, dos and donts | Yes |
| `ARCHITECTURE.md` | Domain, layers, data flow, key decisions | Yes |
| `PLANS.md` | Roadmap: now, next, later, done | Yes |
| `SUBAGENTS.md` | Delegation patterns, hooks, sub-agent triggers | Recommended |
| `docs/references/*.md` | Deep dives, one file per topic | As needed |

### Rules

1. **Narrative over hidden rules.** Markdown at the root beats opaque config.
2. **One concern per file.** Architecture, roadmap, and conventions never mix.
3. **Short root files, deep references.** Root files under ~200 lines.
4. **Detect first, then write.** Read manifests before filling any template.
5. **Update in place.** Diff before overwriting. Never silent overwrites.
6. **Commit-friendly.** Every file must be diffable and stable.

### Workflow when documenting

1. **Detect stack** — read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json`. Extract project name, framework, and scripts.
2. **Audit existing docs** — missing → create; exists → diff against template; out of convention → propose migration.
3. **Apply templates** — fill placeholders with detected values.
4. **Confirm** — present the plan (files to create, files to update with diff summary). Wait for explicit GO.
5. **Write atomically** — new files in one shot, existing files with diff-style edits only.

### Placeholders

`{{PROJECT_NAME}}`, `{{DESCRIPTION}}`, `{{LANGUAGE}}`, `{{FRAMEWORK}}`,
`{{PACKAGE_MANAGER}}`, `{{TEST_RUNNER}}`, `{{INSTALL_COMMAND}}`,
`{{RUN_COMMAND}}`, `{{TEST_COMMAND}}`, `{{BUILD_COMMAND}}`,
`{{LINT_COMMAND}}`, `{{LICENSE}}`.
<!-- documentation-skill:end -->
