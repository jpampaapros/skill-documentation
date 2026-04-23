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

### Tiers

Not every project needs the same documentation density. Pick a tier before writing:

| Tier | When | File count |
|------|------|------------|
| **minimum** | scripts, small libs, WordPress themes, one-file tools | 4 |
| **standard** (default) | web apps, libraries with tests, small products | 6-8 |
| **producto** | SaaS, multi-tenant, apps with real users and revenue | 15+ |

Auto-detection heuristics (apply in order, first match wins):

1. **producto** if ANY of:
   - Has auth deps (`next-auth`, `passport`, `@clerk/*`, `lucia`, `better-auth`)
   - Has ORM + migrations (`prisma/schema.prisma`, `drizzle.config.*`, `migrations/`, `alembic/`)
   - Has multi-tenant signals (`tenant`, `workspace`, `organization` in schema or routes)
   - Has existing `docs/` with 3+ subdirectories
2. **minimum** if ANY of:
   - WordPress theme (`style.css` with `Theme Name:` header + `functions.php`)
   - Single-file tool (≤5 source files, no framework deps)
   - Shell scripts only (`.sh` files, no `package.json` / `pyproject.toml` / `go.mod`)
3. **standard** otherwise.

The user can override with a flag (`--tier=minimum|standard|producto`) or in natural language ("make it a producto tier"). ALWAYS show the detected tier in step 4 and let the user accept or change it.

### Canonical file set by tier

**minimum** — bare essentials

| File | Purpose |
|------|---------|
| `README.md` | Entry point: what the project is, how to run it |
| `CLAUDE.md` | Agent conventions, stack, dos and donts |
| `ARCHITECTURE.md` | Domain, layers, data flow, key decisions |
| `PLANS.md` | Roadmap: now, next, later, done |

**standard** — minimum + delegation and deep dives

Everything in minimum, plus:

| File | Purpose |
|------|---------|
| `SUBAGENTS.md` | Delegation patterns, hooks, sub-agent triggers |
| `AGENTS.md` | Codex-facing mirror of CLAUDE.md (optional) |
| `docs/references/*.md` | Deep dives, one file per topic (as needed) |

**producto** — standard + product-grade docs

Everything in standard, plus:

| File | Purpose |
|------|---------|
| `docs/DESIGN.md` | Design system, visual language, component conventions |
| `docs/FRONTEND.md` | Frontend architecture, rendering strategy, folder shape |
| `docs/PRODUCT_SENSE.md` | Mental model: users, jobs, core loop, non-goals |
| `docs/QUALITY_SCORE.md` | Self-assessment by domain, graded quarterly |
| `docs/RELIABILITY.md` | Error handling, retries, monitoring, known fragility |
| `docs/SECURITY.md` | Threat model, authn/authz, secrets, data handling |
| `docs/design-docs/index.md` | Index of deeper design documents |
| `docs/design-docs/*.md` | Per-topic design documents (as needed) |
| `docs/product-specs/index.md` | Index of feature-level specifications |
| `docs/product-specs/*.md` | Per-feature specs (as needed) |
| `docs/exec-plans/*.md` | Per-initiative execution plans (as needed) |
| `docs/generated/*.md` | Auto-generated docs (schemas, types) — mark as generated |

### Rules

1. **Pick the tier first.** Detection is a suggestion; the user has the final say. Show the detected tier before writing anything.
2. **Narrative over hidden rules.** Markdown at the root beats opaque config files. Any agent or developer onboards by reading markdown alone.
3. **One concern per file.** Architecture stays in ARCHITECTURE. Roadmap stays in PLANS. Do not mix.
4. **Short root files, deep references.** Root files under ~200 lines. Anything longer moves to `docs/references/` or the appropriate `docs/` subdirectory.
5. **Detect first, then write.** Read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json` before filling templates. Never hardcode stack assumptions.
6. **Update in place.** If a doc exists, diff against the template before suggesting changes. Never overwrite silently.
7. **Commit-friendly.** Every generated file must be diffable, human-readable, and stable across regenerations.
8. **Do not fabricate.** If a producto-tier section has no real content yet (e.g. no security audit done), leave the HTML-comment hints in place and mark the section as `<!-- TODO: fill when ready -->` rather than inventing.

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
| `style.css` (with `Theme Name:` header) + `functions.php` | WordPress theme |

Extract: project name, language, framework, entry point, scripts (install, run, test, build, lint), test runner, package manager.

### 2. Detect tier

Apply the heuristics in the "Tiers" section above. Default to `standard` when uncertain.

### 3. Audit existing docs

For each file in the selected tier's canonical set:

- **Missing** → queue for creation from template.
- **Exists** → read it, diff against the template structure, flag sections that are missing or outdated.
- **Out of convention** → propose a migration.

Files from HIGHER tiers that already exist should be preserved and audited too — do not delete docs when downgrading tier.

### 4. Apply templates

Templates live in [assets/templates/](assets/templates/). Root templates are named `<FILE>.template.md`; nested templates live under `assets/templates/docs/`.

Placeholders use `{{NAME}}` syntax:

- `{{PROJECT_NAME}}`, `{{DESCRIPTION}}`
- `{{LANGUAGE}}`, `{{FRAMEWORK}}`, `{{PACKAGE_MANAGER}}`, `{{TEST_RUNNER}}`
- `{{INSTALL_COMMAND}}`, `{{RUN_COMMAND}}`, `{{TEST_COMMAND}}`, `{{BUILD_COMMAND}}`, `{{LINT_COMMAND}}`
- `{{LICENSE}}`

### 5. Confirm before writing

Present to the user:

- **Detected tier** (and why)
- **Detected stack values**
- **Files to create** (list, grouped by tier)
- **Files to update** (with a diff summary)

Wait for explicit approval. Do not write without a GO. The user may change the tier at this step — respect it.

### 6. Write atomically

- New files → Write tool, one file at a time.
- Existing files → Edit tool, diff-style only.
- Never batch-overwrite. Never write without confirmation.
- Create empty subdirectories (`docs/exec-plans/`, `docs/generated/`) with a `.gitkeep` so git tracks them.

## Output Layout

### minimum tier

```
mi-proyecto/
├── README.md
├── CLAUDE.md
├── ARCHITECTURE.md
└── PLANS.md
```

### standard tier

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

### producto tier

```
mi-proyecto/
├── README.md
├── CLAUDE.md
├── ARCHITECTURE.md
├── PLANS.md
├── SUBAGENTS.md
├── AGENTS.md
└── docs/
    ├── DESIGN.md
    ├── FRONTEND.md
    ├── PRODUCT_SENSE.md
    ├── QUALITY_SCORE.md
    ├── RELIABILITY.md
    ├── SECURITY.md
    ├── design-docs/
    │   ├── index.md
    │   └── <topic>.md              (as needed)
    ├── product-specs/
    │   ├── index.md
    │   └── <feature>.md            (as needed)
    ├── exec-plans/
    │   └── <initiative>.md         (as needed)
    ├── generated/
    │   └── <artifact>.md           (auto-generated, marked as such)
    └── references/
        └── <topic>.md              (as needed)
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
