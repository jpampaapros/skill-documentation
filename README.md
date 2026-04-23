# documentation skill

A cross-platform, project-level skill that documents any codebase using a
narrative markdown convention. One source of truth, three tool envelopes:

- **Claude Code** — `.claude/skills/documentation/SKILL.md` (Anthropic Agent Skills spec)
- **Cursor** — `.cursor/rules/documentation.mdc` (Cursor Rules)
- **Codex** — `AGENTS.md` snippet at the project root

Runs on Linux, macOS, and Windows via a single Node.js installer (no shell scripts).

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

The target project ends up with:

```
my-project/
├── .claude/skills/documentation/         # Claude Code
│   ├── SKILL.md
│   └── assets/templates/*
├── .cursor/rules/documentation.mdc       # Cursor
└── AGENTS.md                             # Codex (created or merged)
```

Then, inside your project:

- **Claude Code** — invoke with `/documentation` or ask the agent to document the project.
- **Cursor** — open any chat in the project; the rule auto-loads based on the description.
- **Codex** — it reads `AGENTS.md` at session start.

The agent reads the templates from `.claude/skills/documentation/assets/templates/`
and uses them to generate each documentation file, filling placeholders with
detected stack values.

## Skill repository layout

```
documentation/
├── SKILL.md                              # Claude Code source of truth
├── adapters/
│   ├── cursor/documentation.mdc          # Cursor adapter
│   └── codex/AGENTS.snippet.md           # Codex adapter
├── assets/
│   └── templates/
│       ├── README.template.md
│       ├── CLAUDE.template.md
│       ├── ARCHITECTURE.template.md
│       ├── PLANS.template.md
│       ├── SUBAGENTS.template.md
│       └── docs/references/.gitkeep
├── install.mjs                           # cross-platform installer
├── install.help.txt                      # installer --help text
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
