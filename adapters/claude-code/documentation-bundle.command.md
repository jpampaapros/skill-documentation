---
description: Generate a single self-contained markdown file with ALL the project's documentation — human-readable section titles (Overview, Architecture, Roadmap, etc.), invisible provenance comments, and rewritten internal links. No external files needed to read it. If no canonical docs exist, offers to scaffold them first.
argument-hint: [output-path]
---

Invoke the `documentation` skill in **bundle** operation mode.

Goal: produce ONE self-contained `.md` file with the complete project documentation, in canonical order. The output must read standalone — no "see file X" pointers, no broken relative links, no file-path section headers.

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

- **Partial canonical docs exist** → bundle what's there, and in the final report list which canonical files are missing so the user can run `/documentation-scaffold` later.

- **All canonical docs exist** → standard bundle flow.

## Bundle sub-workflow

### 1. Discover doc files in canonical order

Skip what doesn't exist:

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

### 2. Ask for output path

Default: `DOCUMENTATION.md` at project root. If `$ARGUMENTS` contains a path, use it as the output. Otherwise confirm.

### 3. Map each source file to a human-readable section title

The bundle must be self-contained, so section titles are human-readable — not file paths.

| Source file | Section title |
|-------------|---------------|
| `README.md` | `## Overview` |
| `CLAUDE.md` | `## Agent Conventions` |
| `AGENTS.md` | `## Codex Agent Conventions` (skip if duplicates CLAUDE) |
| `SUBAGENTS.md` | `## Sub-agent Patterns` |
| `ARCHITECTURE.md` | `## Architecture` |
| `PLANS.md` | `## Roadmap` |
| `docs/PRODUCT_SENSE.md` | `## Product Sense` |
| `docs/DESIGN.md` | `## Design System` |
| `docs/FRONTEND.md` | `## Frontend Architecture` |
| `docs/RELIABILITY.md` | `## Reliability` |
| `docs/SECURITY.md` | `## Security` |
| `docs/QUALITY_SCORE.md` | `## Quality Score` |
| `docs/design-docs/index.md` | `## Design Documents — Index` |
| `docs/design-docs/<name>.md` | `## Design: <first H1, or filename Title Case>` |
| `docs/product-specs/index.md` | `## Product Specs — Index` |
| `docs/product-specs/<name>.md` | `## Spec: <first H1, or filename Title Case>` |
| `docs/exec-plans/<name>.md` | `## Exec Plan: <first H1, or filename Title Case>` |
| `docs/references/<name>.md` | `## Reference: <first H1, or filename Title Case>` |
| `docs/generated/<name>.md` | `## Generated: <first H1, or filename Title Case>` |

Prefer the first H1 inside each source file over its filename. Fall back to filename-in-Title-Case when there is no H1.

### 4. Assemble the bundle

```markdown
# {{PROJECT_NAME}} — Full Documentation

> Complete project documentation consolidated on {{ISO_DATE}}.
> Self-contained — no external files required to read this.

## Table of Contents

1. [Overview](#overview)
2. [Agent Conventions](#agent-conventions)
3. [Architecture](#architecture)
4. [Roadmap](#roadmap)

---

## Overview

<!-- sourced from README.md -->

<file contents, headings demoted by one level, links rewritten per step 5>

---

## Agent Conventions

<!-- sourced from CLAUDE.md -->

<file contents, headings demoted by one level, links rewritten per step 5>

---

... (continues for every file in canonical order)
```

Rules:
- Demote every heading in embedded content by ONE level (`# X` → `## X`, `## Y` → `### Y`).
- Section title is the HUMAN-READABLE one from the mapping table — NOT the filename.
- Provenance goes in an HTML comment under each section header: `<!-- sourced from <relative-path> -->`. Invisible when rendered, traceable in raw markdown.
- Do NOT include `> Source:` blockquotes or any file-path markers in the rendered body.
- Do NOT modify the source files — the bundle is read-only.

### 5. Rewrite relative links so the bundle is standalone

Every relative link inside embedded content must be handled:

- **Links to a canonical doc that IS in the bundle** (e.g. `[Architecture](./ARCHITECTURE.md)`) → rewrite to the in-bundle anchor: `[Architecture](#architecture)`.
- **Links to a canonical doc NOT in the bundle** (the source was skipped) → strip the link, mark plain: `Architecture *(not in this bundle)*`.
- **Links to non-doc files in the repo** (e.g. `[app.tsx](./src/app.tsx)`) → keep the link but add a marker: `[app.tsx](./src/app.tsx) *(external — requires repo access)*`.
- **Absolute external URLs** (e.g. `https://example.com`) → leave untouched.
- **Anchor-only links** (e.g. `[see below](#x)`) → leave untouched.

Anchor names: GitHub-style (lowercase, spaces → hyphens, strip punctuation).

### 6. Confirm before writing

Present: target path, source files included, files skipped + why, total line count estimate. Wait for GO. If target exists, diff and ask before overwriting.

### 7. Write

Single Write call.

### 8. Report

Source files included + final output path. Remind the user the bundle is a snapshot — re-run after code changes.
