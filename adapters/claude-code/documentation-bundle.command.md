---
description: Generate a single consolidated markdown file containing all project documentation (TOC + source markers + demoted headings). If no canonical docs exist, offers to scaffold them first.
argument-hint: [output-path]
---

Invoke the `documentation` skill in **bundle** operation mode.

Goal: produce one self-contained `.md` file with the complete project documentation, in canonical order, with a table of contents and per-file source markers. Good for sharing, pasting into a chatbot as context, or exporting for offline review.

## Pre-flight — handle the "no docs" case

Before bundling, check whether any canonical doc files exist in the project root or in `docs/`.

- **Zero canonical docs exist** → ask the user:
  > "No canonical docs found in this project. How do you want to proceed?
  > (a) Scaffold the docs first, then bundle them.
  > (b) Bundle whatever markdown is at the root (likely just the README, if any).
  > (c) Cancel."
  Default: (a).

  If (a): run the full scaffold sub-workflow first (detect stack → detect tier → audit → confirm → write). Once the user approves and files are written, proceed to the bundle step below.

  If (b): still assemble a bundle, but only from the files that exist. Add a note at the top: "This project has no canonical documentation yet. Bundle generated from discoverable markdown at the root."

  If (c): stop. No output.

- **Partial canonical docs exist** → bundle what's there, and in the report at the end list which canonical files are missing so the user can run `/documentation-scaffold` later.

- **All canonical docs exist** → standard bundle flow.

## Bundle sub-workflow (path C)

1. Discover doc files in canonical order (skip what doesn't exist):
   1. `README.md`
   2. `CLAUDE.md`
   3. `AGENTS.md` (skip if content duplicates `CLAUDE.md`)
   4. `SUBAGENTS.md`
   5. `ARCHITECTURE.md`
   6. `PLANS.md`
   7. `docs/PRODUCT_SENSE.md`
   8. `docs/DESIGN.md`
   9. `docs/FRONTEND.md`
   10. `docs/RELIABILITY.md`
   11. `docs/SECURITY.md`
   12. `docs/QUALITY_SCORE.md`
   13. `docs/design-docs/index.md` + `docs/design-docs/*.md` (alphabetical, dedupe index)
   14. `docs/product-specs/index.md` + `docs/product-specs/*.md` (alphabetical)
   15. `docs/exec-plans/*.md` (alphabetical)
   16. `docs/references/*.md` (alphabetical)
   17. `docs/generated/*.md` (alphabetical)

2. Ask for output path — default `DOCUMENTATION.md` at project root. If `$ARGUMENTS` contains a path, use it as the output. Otherwise confirm.

3. Assemble the bundle:
   ```
   # {{PROJECT_NAME}} — Full Documentation

   > Bundled on {{ISO_DATE}} from {{FILE_COUNT}} source files.

   ## Table of Contents

   - [Section 1](#section-1)
   - ...

   ---

   ## Source: <relative-path>

   <file contents, headings demoted by one level>

   ---

   ... (continues)
   ```
   Rules:
   - Demote every heading in embedded content by one level (`# X` → `## X`).
   - Preserve relative links as-is.
   - Do NOT modify the source files.

4. Confirm before writing — present target path, files included, files skipped + why. Wait for GO. If target exists, diff and ask before overwriting.

5. Write the bundle with a single Write call.

6. Report — list source files included and the final output path. Remind the user the bundle is a snapshot; re-run after code changes.
