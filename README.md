# documentation skill

A cross-platform, project-level skill that documents any codebase using a
narrative markdown convention. One source of truth, three tool envelopes:

- **Claude Code** — `.claude/skills/documentation/SKILL.md` (Anthropic Agent Skills spec)
- **Cursor** — `.cursor/rules/documentation.mdc` (Cursor Rules)
- **Codex** — `AGENTS.md` snippet at the project root

Runs on Linux, macOS, and Windows via a single Node.js installer (no shell scripts).

## Operations

The skill has three operations.

| Operation | What it does |
|-----------|--------------|
| **scaffold** | Creates missing docs from templates for the detected tier. |
| **update** | Re-audits existing docs against current code, applies section-level fixes. Does NOT create new files — if a higher-tier file is missing, tells you to run scaffold. |
| **bundle** | Consolidates all canonical doc files into one self-contained `DOCUMENTATION.md`. Human-readable section titles (Overview, Architecture, Roadmap — not file paths), invisible provenance comments, and internal links rewritten to in-bundle anchors. If no docs exist, offers to scaffold them first. |

See the next section for the exact syntax to invoke each operation in each tool.

### Example bundle output

Running `/documentation-bundle` on a minimum-tier WordPress theme (4 canonical
docs: README, CLAUDE, ARCHITECTURE, PLANS) produces a single `DOCUMENTATION.md`
like this:

````markdown
# mi-tema-wordpress — Full Documentation

> Complete project documentation consolidated on 2026-04-23.
> Self-contained — no external files required to read this.

## Table of Contents

1. [Overview](#overview)
2. [Agent Conventions](#agent-conventions)
3. [Architecture](#architecture)
4. [Roadmap](#roadmap)

---

## Overview

<!-- sourced from README.md -->

mi-tema-wordpress es un tema WordPress personalizado para…

### Stack
- **Language**: PHP
- **Framework**: WordPress 6.x

See [Architecture](#architecture) for the domain model and
[Roadmap](#roadmap) for current priorities.

---

## Agent Conventions

<!-- sourced from CLAUDE.md -->

### Stack
- **Language**: PHP
…

### Commands
…

---

## Architecture

<!-- sourced from ARCHITECTURE.md -->

### Domain
…

### Key Decisions
…

---

## Roadmap

<!-- sourced from PLANS.md -->

### Now
- [ ] Implement custom post types for events

### Next
- [ ] Add sidebar widget area

### Done
- [x] Scaffold theme structure
````

Key properties of the bundle:

- **Human-readable section titles** — `## Overview`, `## Agent Conventions`, `## Architecture`, `## Roadmap`. No `## Source: README.md` noise pointing at other files.
- **Invisible provenance** — `<!-- sourced from <path> -->` HTML comments under each heading let you trace what came from where in the raw markdown, but disappear in the rendered view.
- **Rewritten internal links** — `[ARCHITECTURE.md](./ARCHITECTURE.md)` becomes `[Architecture](#architecture)`, linking to the in-bundle anchor. No broken pointers.
- **Flagged external links** — `[app.tsx](./src/app.tsx)` becomes `[app.tsx](./src/app.tsx) *(external — requires repo access)*` so the reader knows that link needs the original repo.
- **Demoted headings** — every heading in embedded content drops one level, so the bundle has a single H1 at the top.
- **Read-only** — the bundle is generated; source files are never modified.

The output is portable: paste it into a chatbot, share it as a PDF, drop it in Notion, or archive it. Everything is inside.

## Invoking the skill per tool

Each tool has its own invocation model. This is the authoritative reference —
if a syntax isn't listed here for a given tool, it does NOT work there.

### Claude Code

Claude Code supports **literal slash commands** AND natural language. The three
commands appear in the autocomplete as soon as you type `/doc`.

| Operation | Slash command | Natural language equivalent |
|-----------|---------------|----------------------------|
| Scaffold | `/documentation-scaffold` | "documentá este proyecto" |
| Update | `/documentation-update` | "actualizá la documentación" |
| Bundle | `/documentation-bundle` | "generar documentación general" |

**Tier selection** — two ways:

1. **Natural language override** (recommended, portable):
   ```
   /documentation-scaffold
   > usá tier minimum porque es un tema WordPress
   ```

2. **Positional argument** via `$ARGUMENTS` (Claude-Code-only shortcut):
   ```
   /documentation-scaffold minimum
   /documentation-scaffold producto
   ```

**Bundle with custom output path**:
```
/documentation-bundle docs/OVERVIEW.md
```

### Cursor

Cursor supports **literal slash commands** with `name` + `description`
frontmatter. The three commands appear in the chat autocomplete after typing
`/doc`. There is NO formal argument system — only the command name.

| Operation | Slash command | Natural language equivalent |
|-----------|---------------|----------------------------|
| Scaffold | `/documentation-scaffold` | "documentá este proyecto" |
| Update | `/documentation-update` | "actualizá la documentación" |
| Bundle | `/documentation-bundle` | "generar documentación general" |

**Tier selection** — use natural language after the command. Writing
`/documentation-scaffold minimum` appends the text to the prompt as context,
which usually works, but it's not a formal argument binding:

```
/documentation-scaffold
> usá tier minimum
```

### Codex

**Codex does NOT support user-defined slash commands.** The documented slash
commands (`/model`, `/clear`, `/init`, `/review`, `/status`, etc.) are all
**built-in** by OpenAI; users cannot register their own.

Trigger every operation in **natural language**. The Codex skill is installed
at `~/.codex/skills/documentation/` and activates by matching your phrasing
against its description (packed with English + Spanish keywords).

| Operation | Example phrases |
|-----------|-----------------|
| Scaffold | "documentá este proyecto", "document this project", "scaffold docs" |
| Update | "actualizá la documentación", "refresh docs", "update documentation" |
| Bundle | "generar documentación general", "consolidar docs", "bundle all docs into one file" |

**Tier selection** — include the tier word in the sentence:

```
"documentá este proyecto como minimum"
"scaffold docs en tier producto"
"actualizá la documentación (ya es un SaaS, standard no alcanza)"
```

### Cross-tool summary

| Tool | Slash commands? | Arguments after slash? | Tier via text? |
|------|-----------------|-----------------------|----------------|
| **Claude Code** | ✅ yes | ✅ `$ARGUMENTS` (formal) | ✅ also works |
| **Cursor** | ✅ yes | ⚠️ trailing text only (no binding) | ✅ recommended |
| **Codex** | ❌ no (built-in only) | — | ✅ only way |

**Rule of thumb**: say the tier in a sentence. Works in all three tools, always.

## What it generates

The skill adapts to the project via three tiers. The agent detects the tier from
the codebase (WordPress theme → minimum, SaaS with auth + multi-tenant → producto,
default → standard) and the user confirms or overrides before anything is written.

### minimum — 4 files

For scripts, small libraries, WordPress themes, one-file tools.

- `README.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `PLANS.md`

### standard (default) — 6-8 files

For web apps, libraries with tests, small products.

- Everything in minimum, plus:
- `SUBAGENTS.md`, `AGENTS.md` (optional Codex mirror), `docs/references/*.md` (as needed)

### producto — 15+ files

For SaaS, multi-tenant apps, products with real users and revenue.

- Everything in standard, plus:
- `docs/DESIGN.md`, `docs/FRONTEND.md`, `docs/PRODUCT_SENSE.md`
- `docs/QUALITY_SCORE.md`, `docs/RELIABILITY.md`, `docs/SECURITY.md`
- `docs/design-docs/index.md` (+ per-topic docs as needed)
- `docs/product-specs/index.md` (+ per-feature specs as needed)
- `docs/exec-plans/` (per-initiative plans)
- `docs/generated/` (auto-generated artifacts, marked as such)

## Requirements

- Node.js >= 16.7.0 (for `fs.cpSync`)

## Install in a project

Pick the path that fits your use case:

| Path | Installs | When to use |
|------|----------|-------------|
| A. `skills` CLI | Claude Code only | Fastest. You only use Claude Code. |
| B. `npx github:` | Claude Code + Cursor + Codex | You want all three envelopes without cloning. |
| C. `git clone` + installer | Claude Code + Cursor + Codex | Reuse across many projects, easy `git pull` updates. |

### A. Claude Code only — `skills` CLI (one-liner, sparse fetch)

Uses the [Vercel `skills` CLI](https://github.com/vercel-labs/skills). Pulls only the
skill folder via the GitHub Blob API (no full clone) and symlinks it into the
Claude Code skills directory.

```bash
# Global — available in every project on this machine
npx -y skills add jpampaapros/skill-documentation -g -y

# Or project-level — only for the current project
cd /path/to/my-project
npx -y skills add jpampaapros/skill-documentation -y
```

Copy instead of symlink: add `--copy`.

> Limitation: `skills add` only installs the Claude Code envelope. For Cursor and
> Codex, use path B or C.

### B. All three envelopes — `npx` from GitHub (no clone)

Runs this repo's installer directly from GitHub. No local clone needed.

```bash
cd /path/to/my-project
npx -y github:jpampaapros/skill-documentation
```

Flags:

```bash
npx -y github:jpampaapros/skill-documentation --target=claude-code
npx -y github:jpampaapros/skill-documentation --target=cursor
npx -y github:jpampaapros/skill-documentation --target=codex
npx -y github:jpampaapros/skill-documentation --target=all        # default
npx -y github:jpampaapros/skill-documentation --dry-run
```

### C. All three envelopes — `git clone` + installer (reusable)

Clone once, reuse everywhere. Best when you'll document many projects and want
local control over the skill version.

```bash
# One time, anywhere on your machine
git clone https://github.com/jpampaapros/skill-documentation.git ~/skills/documentation

# Then, from the root of each project you want to document
cd /path/to/my-project
node ~/skills/documentation/install.mjs
```

Same `--target` and `--dry-run` flags as path B.

### Cross-platform notes (path C)

| OS | Shell | Command |
|----|-------|---------|
| Linux | bash, zsh | `node ~/skills/documentation/install.mjs` |
| macOS | zsh | `node ~/skills/documentation/install.mjs` |
| Windows | PowerShell | `node $HOME\skills\documentation\install.mjs` |
| Windows | cmd | `node %USERPROFILE%\skills\documentation\install.mjs` |
| Windows | Git Bash | `node ~/skills/documentation/install.mjs` |

The installer uses Node's `path.join` and `os.homedir()` under the hood, so paths
resolve correctly on every platform.

## After installing

The installer writes files to TWO places: the target project (for Claude Code,
Cursor rule + command, and the Codex AGENTS.md snippet) and the user's home
(for the Codex skill, which is user-level).

```
# Inside the target project
my-project/
├── .claude/
│   ├── skills/documentation/              # Claude Code skill (auto-matches)
│   │   ├── SKILL.md
│   │   └── assets/templates/*
│   └── commands/                          # Claude Code slash commands (explicit)
│       ├── documentation-scaffold.md
│       ├── documentation-update.md
│       └── documentation-bundle.md
├── .cursor/
│   ├── rules/documentation.mdc            # Cursor rule (auto-loads on match)
│   └── commands/                          # Cursor slash commands (explicit)
│       ├── documentation-scaffold.md
│       ├── documentation-update.md
│       └── documentation-bundle.md
└── AGENTS.md                              # Codex project-level context (created or merged)

# Outside the project — user-level, installed once per user
~/.codex/skills/documentation/             # Codex skill (description-matched)
├── SKILL.md
└── assets/templates/*
```

Once installed, see [**Invoking the skill per tool**](#invoking-the-skill-per-tool)
above for the exact syntax to trigger each operation in Claude Code, Cursor,
and Codex.

### Codex install notes

The Codex skill installs to `$CODEX_HOME/skills/documentation/` (default:
`~/.codex/skills/`). It is **user-level**, not per-project — installing once
makes it available in every project you open with Codex. Override the
destination by setting `CODEX_HOME` before running the installer.

The agent reads the templates from `.claude/skills/documentation/assets/templates/`
(or from the user-level Codex skill dir) and uses them to generate each
documentation file, filling placeholders with detected stack values.

## Skill repository layout

```
documentation/
├── SKILL.md                                  # Claude Code + Codex skill source of truth
├── adapters/
│   ├── claude-code/                          # Claude Code slash commands
│   │   ├── documentation-scaffold.command.md
│   │   ├── documentation-update.command.md
│   │   └── documentation-bundle.command.md
│   ├── cursor/
│   │   ├── documentation.mdc                 # Cursor rule (auto-loads on match)
│   │   ├── documentation-scaffold.command.md # Cursor slash commands
│   │   ├── documentation-update.command.md
│   │   └── documentation-bundle.command.md
│   └── codex/
│       └── AGENTS.snippet.md                 # Codex project-level context snippet
├── assets/
│   └── templates/
│       ├── README.template.md
│       ├── CLAUDE.template.md
│       ├── ARCHITECTURE.template.md
│       ├── PLANS.template.md
│       ├── SUBAGENTS.template.md
│       └── docs/
│           ├── DESIGN.template.md            # producto tier
│           ├── FRONTEND.template.md
│           ├── PRODUCT_SENSE.template.md
│           ├── QUALITY_SCORE.template.md
│           ├── RELIABILITY.template.md
│           ├── SECURITY.template.md
│           ├── design-docs/index.template.md
│           ├── product-specs/index.template.md
│           ├── exec-plans/.gitkeep
│           ├── generated/.gitkeep
│           └── references/.gitkeep
├── install.mjs                               # cross-platform installer
├── install.help.txt                          # installer --help text
├── package.json
└── README.md
```

## Updating the skill

Depends on which install path you used:

```bash
# Path A — skills CLI (Claude Code only)
npx -y skills add jpampaapros/skill-documentation -g -y --copy     # re-pull

# Path B — npx from GitHub (no local clone)
cd /path/to/my-project
npx -y github:jpampaapros/skill-documentation                      # re-run installer

# Path C — local clone
cd ~/skills/documentation && git pull
cd /path/to/my-project && node ~/skills/documentation/install.mjs  # overwrites
```

The Codex `AGENTS.md` merge is idempotent — reinstalling detects the
`<!-- documentation-skill:start -->` marker and skips duplication.

## Commit the installed files

After installing, commit the generated files in your project so the skill
travels with the repo:

```bash
cd /path/to/my-project
git add .claude/ .cursor/ AGENTS.md
git commit -m "chore: install documentation skill"
```

## License

Apache-2.0
