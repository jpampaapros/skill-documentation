---
name: documentation-bundle
description: Generate a single consolidated markdown file containing all project documentation (TOC + source markers + demoted headings). If no canonical docs exist, offers to scaffold them first.
---

# documentation-bundle

Invoke the `documentation` skill in **bundle** operation mode.

Goal: produce one self-contained `.md` file with the complete project documentation, in canonical order, with a table of contents and per-file source markers. Good for sharing, pasting into a chatbot as context, or exporting for offline review.

## Pre-flight — handle the "no docs" case

Before bundling, check whether any canonical doc files exist.

- **Zero canonical docs exist** → ask the user:
  > "No canonical docs found. How do you want to proceed?
  > (a) Scaffold the docs first, then bundle them.
  > (b) Bundle whatever markdown is at the root (likely just the README, if any).
  > (c) Cancel."
  Default: (a).

  If (a): run the full scaffold sub-workflow first (detect stack → detect tier → audit → confirm → write). Once written, proceed to the bundle step.

  If (b): assemble a bundle from the files that exist. Add a note at the top: "This project has no canonical documentation yet. Bundle generated from discoverable markdown at the root."

  If (c): stop.

- **Partial canonical docs exist** → bundle what's there. In the final report, list which canonical files are missing so the user can run `/documentation-scaffold` later.

- **All canonical docs exist** → standard bundle flow.

## Bundle sub-workflow

1. **Discover doc files in canonical order** (skip missing):
   README → CLAUDE → (AGENTS if distinct) → SUBAGENTS → ARCHITECTURE → PLANS → docs/PRODUCT_SENSE → docs/DESIGN → docs/FRONTEND → docs/RELIABILITY → docs/SECURITY → docs/QUALITY_SCORE → docs/design-docs/* → docs/product-specs/* → docs/exec-plans/* → docs/references/* → docs/generated/*.

2. **Ask for output path** — default `DOCUMENTATION.md` at project root. Confirm or let the user pick a different path.

3. **Assemble the bundle**:
   ```
   # {{PROJECT_NAME}} — Full Documentation

   > Bundled on {{ISO_DATE}} from {{FILE_COUNT}} source files.

   ## Table of Contents

   - [...]

   ---

   ## Source: <relative-path>

   <file contents, headings demoted by one level>

   ---

   ... (continues)
   ```
   Rules:
   - Demote every heading in embedded content by one level.
   - Preserve relative links as-is.
   - Do NOT modify source files.

4. **Confirm** — target path, files included, files skipped + why. Wait for GO. If target exists, diff and ask before overwriting.

5. **Write** — single Write call.

6. **Report** — list source files included and final output path. Remind the user the bundle is a snapshot.
