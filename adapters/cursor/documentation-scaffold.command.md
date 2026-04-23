---
name: documentation-scaffold
description: Scaffold project documentation from scratch using the gentleman-programming convention. Detects stack and tier (minimum / standard / producto), creates missing canonical files from templates, preserves existing ones.
---

# documentation-scaffold

Invoke the `documentation` skill in **scaffold** operation mode.

Goal: create missing canonical documentation files from templates for the detected tier. Preserve any existing docs.

## Workflow

1. **Detect stack** — read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json`, or WordPress signals (`style.css` + `functions.php`). Extract project name, framework, package manager, scripts.
2. **Detect tier** — apply heuristics (WordPress theme / single-file tool → minimum; auth deps + ORM + migrations → producto; default → standard). User can override in natural language.
3. **Audit existing docs** — for each file in the selected tier's canonical set: missing → queue for creation; exists → diff against template; out of convention → propose migration. Preserve higher-tier files that already exist.
4. **Apply templates** — fill placeholders (`{{PROJECT_NAME}}`, `{{FRAMEWORK}}`, `{{RUN_COMMAND}}`, etc.). Templates live in `.cursor/rules/documentation.mdc` context or in the installed skill folder.
5. **Confirm before writing** — present detected tier, stack values, files to create, files to update (with diff summary). Wait for explicit GO.
6. **Write atomically** — new files via Write, existing via Edit (diff-style). Never batch-overwrite. Create `.gitkeep` for empty subdirectories.

## Tiers (quick reference)

| Tier | When | Files |
|------|------|-------|
| **minimum** | scripts, small libs, WordPress themes | README, CLAUDE, ARCHITECTURE, PLANS |
| **standard** (default) | web apps, libraries | + SUBAGENTS, AGENTS (opt), docs/references/ |
| **producto** | SaaS, multi-tenant | + docs/{DESIGN, FRONTEND, PRODUCT_SENSE, QUALITY_SCORE, RELIABILITY, SECURITY}, docs/{design-docs, product-specs, exec-plans, generated}/ |

## Hard constraints

- Do NOT run the update or bundle workflows — those are `/documentation-update` and `/documentation-bundle`.
- Do NOT fabricate content for sections without real data — leave hints and mark `<!-- TODO: fill when ready -->`.
