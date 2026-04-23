---
name: documentation
description: >
  Scaffolds, updates, and bundles consistent project documentation — README,
  CLAUDE, ARCHITECTURE, PLANS, SUBAGENTS, and docs/ — following a narrative
  markdown convention that agents and humans can onboard from.
  Trigger: when the user wants to document a project from scratch, refresh
  existing documentation against the current code, or consolidate all docs
  into a single file for sharing.
  Keywords: "document the project", "documentar el proyecto", "scaffold docs",
  "update docs", "actualizar documentación", "refresh documentation",
  "bundle docs", "generar documentación general", "consolidar docs".
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.1"
---

## When to Use

- User asks to document a project, scaffold docs, or add a README.
- Project lacks agent-facing context files (CLAUDE.md, AGENTS.md, SUBAGENTS.md).
- Architecture decisions or roadmap are undocumented.
- User wants a consistent documentation convention across multiple projects.
- A new developer or agent is onboarding and the codebase has no narrative.
- The code has evolved and existing docs are stale (triggers `update`).
- The user needs to share or paste the full project context as a single file (triggers `bundle`).

## Operations

The skill has three operations, each exposed as a **separate slash command** in
Claude Code and Cursor. This is deliberate — one command per operation so the
user's intent is unambiguous.

| Operation | Slash command | Goal | Writes |
|-----------|---------------|------|--------|
| **scaffold** | `/documentation-scaffold` | Create missing docs from templates for the detected tier. | New files in the canonical set. |
| **update** | `/documentation-update` | Re-audit existing docs against the current code and apply section-level fixes. | Diff-style edits to existing files only. Never creates new files. |
| **bundle** | `/documentation-bundle` | Concatenate all canonical doc files into one self-contained `.md`. If no docs exist, offers to scaffold first. | A single bundled file (default: `DOCUMENTATION.md`). |

In Codex (which does not have literal slash commands), the skill activates by
description match on these trigger phrases:

- **scaffold**: "document the project", "documentar el proyecto", "scaffold docs", "add README", "add CLAUDE.md", "set up docs".
- **update**: "update docs", "refresh documentation", "actualizar documentación", "revisar la documentación", "sync docs with code", "docs are stale".
- **bundle**: "bundle docs", "single doc file", "generate overview", "generar documentación general", "consolidar docs", "export docs as one file".

When no slash command is used AND the intent is ambiguous, ask the user before
running any workflow.

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

Start every invocation with step 0, then branch into the operation's workflow.

### 0. Detect intent (always)

Pick one of `scaffold | update | bundle` using the trigger phrases above.
Announce the detected operation to the user so they can redirect.

### 1. Detect stack (scaffold + update)

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

### 2. Detect tier (scaffold + update)

Apply the heuristics in the "Tiers" section above. Default to `standard` when uncertain.

---

### A. Scaffold workflow

Use when the project has no docs, or the user explicitly asks for new ones.

**A.1. Audit existing docs**

For each file in the selected tier's canonical set:

- **Missing** → queue for creation from template.
- **Exists** → read it, diff against the template structure, flag sections that are missing or outdated.
- **Out of convention** → propose a migration.

Files from HIGHER tiers that already exist should be preserved and audited too — do not delete docs when downgrading tier.

**A.2. Apply templates**

Templates live in [assets/templates/](assets/templates/). Root templates are named `<FILE>.template.md`; nested templates live under `assets/templates/docs/`.

Placeholders use `{{NAME}}` syntax:

- `{{PROJECT_NAME}}`, `{{DESCRIPTION}}`
- `{{LANGUAGE}}`, `{{FRAMEWORK}}`, `{{PACKAGE_MANAGER}}`, `{{TEST_RUNNER}}`
- `{{INSTALL_COMMAND}}`, `{{RUN_COMMAND}}`, `{{TEST_COMMAND}}`, `{{BUILD_COMMAND}}`, `{{LINT_COMMAND}}`
- `{{LICENSE}}`

**A.3. Confirm before writing**

Present to the user:

- **Detected operation** (`scaffold`)
- **Detected tier** (and why)
- **Detected stack values**
- **Files to create** (list, grouped by tier)
- **Files to update** (with a diff summary)

Wait for explicit approval. Do not write without a GO. The user may change the tier at this step — respect it.

**A.4. Write atomically**

- New files → Write tool, one file at a time.
- Existing files → Edit tool, diff-style only.
- Never batch-overwrite. Never write without confirmation.
- Create empty subdirectories (`docs/exec-plans/`, `docs/generated/`) with a `.gitkeep` so git tracks them.

---

### B. Update workflow

Use when docs already exist but the code has drifted. Goal: **bring docs in sync with code**, not create new files.

**B.1. Discover existing docs**

List every file in the canonical set that currently exists. Also include any `docs/**/*.md` that are part of the convention. Ignore random `.md` files outside the convention.

**B.2. Re-read the code for drift signals**

For each existing doc, look for drift:

| Doc | Drift signals |
|-----|--------------|
| `README.md` | Outdated scripts, stale install/run commands, missing features, broken links. |
| `CLAUDE.md` | Framework/language mismatch vs current manifests, missing new conventions. |
| `ARCHITECTURE.md` | New top-level folders in `src/`, removed layers, renamed modules, new domain entities. |
| `PLANS.md` | "Now" items that were shipped (should move to "done"), stale priorities. |
| `SUBAGENTS.md` | New hooks, new sub-agent patterns that aren't documented. |
| `docs/*.md` | Same rules, scoped to the subsystem each file owns. |

**B.3. Propose section-level diff plan**

For each file, list the sections that need changes. Format:

```
ARCHITECTURE.md
  - Layers table: add "src/workers/" (new folder), remove "src/legacy/" (deleted)
  - Key decisions: add ADR for switching from REST to tRPC

PLANS.md
  - Move "Implement auth" from "Now" to "Done" (shipped in v1.2)
  - Add "Mobile app" to "Later"
```

**B.4. Confirm before editing**

Wait for explicit approval. The user may accept all, reject some, or add sections to update.

**B.5. Apply edits**

- Use Edit tool, section by section. Diff-style only.
- Never rewrite a file end-to-end unless explicitly asked — preserve the user's prose.
- Do NOT create new files in update mode. If a higher-tier file is missing and the project now warrants it, suggest running `scaffold` to add it.

**B.6. Report**

Summarize what changed per file. Keep it tight: one line per section touched.

---

### C. Bundle workflow

Use when the user wants ONE self-contained `.md` with the full project documentation.

**C.0. Pre-flight — handle the "no docs" case**

Before discovering files, check whether any canonical doc exists in the project (root-level or under `docs/`).

- **Zero canonical docs exist** → ask the user:
  > "No canonical docs found in this project. How do you want to proceed?
  > (a) Scaffold the docs first, then bundle them.
  > (b) Bundle whatever markdown is at the root (likely just the README, if any).
  > (c) Cancel."
  Default recommendation: **(a)**.

  - If **(a)**: run the full scaffold sub-workflow first (A.1 → A.4: detect stack → detect tier → audit → confirm → write). Once the user approves and files are written, continue with C.1 below.
  - If **(b)**: skip directly to C.1 and include a note at the top of the bundle: "> This project has no canonical documentation yet. Bundle generated from discoverable markdown at the root."
  - If **(c)**: stop. No output.

- **Partial canonical docs exist** → continue with C.1. In the final report (C.6), list which canonical files are missing so the user knows what they can fill in with `/documentation-scaffold`.

- **All canonical docs exist** → continue with C.1 normally.

**C.1. Discover doc files in canonical order**

Collect files in this order, skipping what doesn't exist:

1. `README.md`
2. `CLAUDE.md`
3. `AGENTS.md` (skip if content is a duplicate of `CLAUDE.md`)
4. `SUBAGENTS.md`
5. `ARCHITECTURE.md`
6. `PLANS.md`
7. `docs/PRODUCT_SENSE.md`
8. `docs/DESIGN.md`
9. `docs/FRONTEND.md`
10. `docs/RELIABILITY.md`
11. `docs/SECURITY.md`
12. `docs/QUALITY_SCORE.md`
13. `docs/design-docs/index.md` + `docs/design-docs/*.md` (alphabetical, skip index duplicate)
14. `docs/product-specs/index.md` + `docs/product-specs/*.md` (alphabetical)
15. `docs/exec-plans/*.md` (alphabetical)
16. `docs/references/*.md` (alphabetical)
17. `docs/generated/*.md` (alphabetical)

**C.2. Ask for output path**

Default: `DOCUMENTATION.md` at the project root. Confirm or let the user pick a different path (e.g. `docs/OVERVIEW.md`, or a path outside the repo like `~/Desktop/project-docs.md`).

**C.3. Assemble the bundle**

Structure of the output file:

```markdown
# {{PROJECT_NAME}} — Full Documentation

> Bundled on {{ISO_DATE}} from {{FILE_COUNT}} source files.

## Table of Contents

- [README](#readme)
- [CLAUDE](#claude)
- [...]

---

## README

> Source: `README.md`

<file contents, headings demoted by one level>

---

## CLAUDE

> Source: `CLAUDE.md`

<file contents, headings demoted by one level>

---

... (continues for every file)
```

Rules:
- Demote every heading in the embedded content by ONE level (`# X` → `## X`, `## Y` → `### Y`) so the document has a single H1.
- Preserve relative links as-is. Do not try to rewrite them.
- Do not modify the source files — the bundle is read-only consumption.

**C.4. Confirm before writing**

Present: target path, list of source files included (and any skipped + why), total line count estimate. Wait for GO.

**C.5. Write the bundle**

Single Write call. If the target file already exists, diff and ask before overwriting.

**C.6. Report**

List the source files included and the final output path. Remind the user the bundle is a snapshot — running `bundle` again after code changes will regenerate it.

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
