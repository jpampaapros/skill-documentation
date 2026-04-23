---
name: documentation-bundle
description: Generate a single self-contained markdown file with ALL the project's documentation — human-readable section titles (Overview, Architecture, Roadmap, etc.), invisible provenance comments, and rewritten internal links. No external files needed to read it. If no canonical docs exist, offers to scaffold them first.
---

# documentation-bundle

Invoke the `documentation` skill in **bundle** operation mode.

Goal: produce ONE self-contained `.md` file with the complete project documentation, in canonical order. The output must read standalone — no "see file X" pointers, no broken relative links, no file-path section headers.

## Pre-flight — handle the "no docs" case

Before bundling, check whether any canonical doc files exist.

- **Zero canonical docs exist** → ask the user:
  > "No canonical docs found. How do you want to proceed?
  > (a) Scaffold the docs first, then bundle them.
  > (b) Bundle whatever markdown is at the root (likely just the README, if any).
  > (c) Cancel."
  Default: (a).

  If (a): run the full scaffold sub-workflow first (detect stack → detect tier → audit → confirm → write). Once written, proceed to bundle.

  If (b): assemble a bundle from the files that exist. Add a note at the top: "This project has no canonical documentation yet. Bundle generated from discoverable markdown at the root."

  If (c): stop.

- **Partial canonical docs exist** → bundle what's there. In the final report list which canonical files are missing.

- **All canonical docs exist** → standard bundle flow.

## Bundle sub-workflow

### 1. Discover doc files in canonical order

Skip missing: `README.md` → `CLAUDE.md` → (`AGENTS.md` if distinct) → `SUBAGENTS.md` → `ARCHITECTURE.md` → `PLANS.md` → `docs/PRODUCT_SENSE.md` → `docs/DESIGN.md` → `docs/FRONTEND.md` → `docs/RELIABILITY.md` → `docs/SECURITY.md` → `docs/QUALITY_SCORE.md` → `docs/design-docs/*` → `docs/product-specs/*` → `docs/exec-plans/*` → `docs/references/*` → `docs/generated/*`.

### 2. Ask for output path

Default `DOCUMENTATION.md` at project root. Let the user pick a different path if they want.

### 3. Map each source file to a human-readable section title

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
- Demote every heading in embedded content by ONE level.
- Section title is the HUMAN-READABLE one from the mapping table — NOT the filename.
- Provenance goes in an HTML comment under each section header: `<!-- sourced from <relative-path> -->`. Invisible when rendered.
- Do NOT include `> Source:` blockquotes or any file-path markers in the body.
- Do NOT modify source files.

### 5. Rewrite relative links so the bundle is standalone

- **Links to a canonical doc that IS in the bundle** → rewrite to in-bundle anchor. Example: `[Architecture](./ARCHITECTURE.md)` → `[Architecture](#architecture)`.
- **Links to a canonical doc NOT in the bundle** → strip the link: `Architecture *(not in this bundle)*`.
- **Links to non-doc files in the repo** → keep link + marker: `[app.tsx](./src/app.tsx) *(external — requires repo access)*`.
- **Absolute URLs** → leave untouched.
- **Anchor-only links** → leave untouched.

Anchor format: GitHub-style (lowercase, spaces → hyphens, strip punctuation).

### 6. Confirm before writing

Present: target path, source files included, files skipped + why, total line count estimate. Wait for GO. If target exists, diff and ask before overwriting.

### 7. Write

Single Write call.

### 8. Report

Source files included + final output path. The bundle is a snapshot — re-run after code changes.
