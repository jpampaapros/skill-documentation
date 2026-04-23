---
description: Scaffold project documentation from scratch using the apros convention. Detects stack and tier (minimum / standard / producto), creates missing canonical files from templates, preserves existing ones. Never overwrites without confirmation.
argument-hint: [tier]
---

Invoke the `documentation` skill in **scaffold** operation mode.

Goal: create missing canonical documentation files from templates for the detected tier. Preserve any existing docs — diff against templates and propose updates rather than overwriting.

Follow the skill's scaffold sub-workflow (path A):

1. Detect stack — read manifests (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `composer.json`) or WordPress signals (`style.css` + `functions.php`). Extract project name, framework, package manager, scripts.
2. Detect tier — apply heuristics. If `$ARGUMENTS` contains `minimum`, `standard`, or `producto`, use it as the tier override.
3. Audit existing docs — for each file in the selected tier's canonical set: missing → queue for creation; exists → diff against template; out of convention → propose migration. Preserve higher-tier files that already exist.
4. Apply templates from `.claude/skills/documentation/assets/templates/` — fill placeholders (`{{PROJECT_NAME}}`, `{{FRAMEWORK}}`, `{{RUN_COMMAND}}`, etc.) with detected values.
5. Confirm before writing — present detected tier, stack values, files to create (grouped by tier), files to update (with diff summary). Wait for explicit GO.
6. Write atomically — new files via Write, existing via Edit (diff-style only). Never batch-overwrite. Create `.gitkeep` for empty subdirectories.

Rules (summary):
- Pick the tier first; detection is a suggestion, user decides.
- Narrative over hidden rules.
- One concern per file.
- Short root files (<200 lines); deep content in `docs/references/` or the appropriate `docs/<subdomain>/`.
- Never silent overwrites.
- Do not fabricate — for producto-tier sections without real content, leave hints and mark `<!-- TODO: fill when ready -->`.

Do NOT run the update or bundle workflows — those are separate commands (`/documentation-update`, `/documentation-bundle`).
