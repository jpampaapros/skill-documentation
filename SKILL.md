---
name: documentation
description: >
  Generates and maintains consistent project documentation — README, CLAUDE,
  ARCHITECTURE, PLANS, SUBAGENTS, and docs/references — following a narrative
  markdown convention that agents and humans can onboard from.
  Trigger: when the user wants to document a project, scaffold docs from scratch,
  update existing documentation, or enforce a documentation convention across a
  codebase. Keywords: "document the project", "documentar el proyecto",
  "scaffold docs", "add README", "update ARCHITECTURE".
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- User asks to document a project, scaffold docs, or add a README.
- Project lacks agent-facing context files (CLAUDE.md, AGENTS.md, SUBAGENTS.md).
- Architecture decisions or roadmap are undocumented.
- User wants a consistent documentation convention across multiple projects.
- A new developer or agent is onboarding and the codebase has no narrative.

## Critical Patterns

### Canonical file set

| File | Purpose | Required |
|------|---------|----------|
| `README.md` | Entry point: what the project is, how to run it | Yes |
| `CLAUDE.md` | Agent conventions, stack, dos and donts | Yes |
| `ARCHITECTURE.md` | Domain, layers, data flow, key decisions | Yes |
| `PLANS.md` | Roadmap: now, next, later, done | Yes |
| `SUBAGENTS.md` | Delegation patterns, hooks, sub-agent triggers | Recommended |
| `AGENTS.md` | Codex-facing mirror of CLAUDE.md | Recommended |
| `docs/references/*.md` | Deep dives, one file per topic | As needed |

### Rules

1. **Narrative over hidden rules.** Markdown at the root beats opaque config files. Any agent or developer onboards by reading markdown alone.
2. **One concern per file.** Architecture stays in ARCHITECTURE. Roadmap stays in PLANS. Do not mix.
3. **Short root files, deep references.** Root files under ~200 lines. Anything longer moves to `docs/references/`.
4. **Detect first, then write.** Read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json` before filling templates. Never hardcode stack assumptions.
5. **Update in place.** If a doc exists, diff against the template before suggesting changes. Never overwrite silently.
6. **Commit-friendly.** Every generated file must be diffable, human-readable, and stable across regenerations.

## Workflow

Follow this sequence every time the skill is invoked:

### 1. Detect stack

Read whichever manifests exist:

| File | Stack signal |
|------|--------------|
| `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb` | Node.js + framework (Next, React, Vue, Angular, Express, Nest) |
| `pyproject.toml`, `requirements.txt`, `Pipfile`, `poetry.lock` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `pom.xml`, `build.gradle`, `build.gradle.kts` | Java / Kotlin |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `*.csproj`, `*.sln` | .NET / C# |

Extract: project name, language, framework, entry point, scripts (install, run, test, build, lint), test runner, package manager.

### 2. Audit existing docs

For each canonical file:

- **Missing** → queue for creation from template.
- **Exists** → read it, diff against the template structure, flag sections that are missing or outdated.
- **Out of convention** → propose a migration.

### 3. Apply templates

Templates live in [assets/templates/](assets/templates/). Placeholders use `{{NAME}}` syntax:

- `{{PROJECT_NAME}}`, `{{DESCRIPTION}}`
- `{{LANGUAGE}}`, `{{FRAMEWORK}}`, `{{PACKAGE_MANAGER}}`, `{{TEST_RUNNER}}`
- `{{INSTALL_COMMAND}}`, `{{RUN_COMMAND}}`, `{{TEST_COMMAND}}`, `{{BUILD_COMMAND}}`, `{{LINT_COMMAND}}`
- `{{LICENSE}}`

### 4. Confirm before writing

Present to the user:

- Files to create (list)
- Files to update (with a diff summary)
- Detected stack values

Wait for explicit approval. Do not write without a GO.

### 5. Write atomically

- New files → Write tool, one file at a time.
- Existing files → Edit tool, diff-style only.
- Never batch-overwrite. Never write without confirmation.

## Output Layout

A fully documented project ends up like this:

```
mi-proyecto/
├── README.md
├── CLAUDE.md
├── ARCHITECTURE.md
├── PLANS.md
├── SUBAGENTS.md
├── AGENTS.md                      (optional: Codex mirror)
└── docs/
    └── references/
        ├── api-endpoints.md
        ├── database-schema.md
        └── deployment.md
```

## Commands

```bash
# Install this skill into the current project (run from project root)
node /path/to/documentation/install.mjs

# Install only one target
node /path/to/documentation/install.mjs --target=claude-code
node /path/to/documentation/install.mjs --target=cursor
node /path/to/documentation/install.mjs --target=codex

# Dry run
node /path/to/documentation/install.mjs --dry-run
```

## Resources

- **Templates**: see [assets/templates/](assets/templates/) for the canonical markdown templates.
- **Adapters**: see [adapters/](adapters/) for the Cursor `.mdc` and Codex `AGENTS.md` variants.
- **Installer**: see [install.mjs](install.mjs) for the cross-platform Node installer.
