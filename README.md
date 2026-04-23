# documentation skill

A cross-platform, project-level skill that documents any codebase using a
narrative markdown convention. One source of truth, three tool envelopes:

- **Claude Code** — `.claude/skills/documentation/SKILL.md` (Anthropic Agent Skills spec)
- **Cursor** — `.cursor/rules/documentation.mdc` (Cursor Rules)
- **Codex** — `AGENTS.md` snippet at the project root

Runs on Linux, macOS, and Windows via a single Node.js installer (no shell scripts).

## What it generates

| File | Purpose | Required |
|------|---------|----------|
| `README.md` | Entry point: what the project is, how to run it | Yes |
| `CLAUDE.md` | Agent conventions, stack, dos and donts | Yes |
| `ARCHITECTURE.md` | Domain, layers, data flow, key decisions | Yes |
| `PLANS.md` | Roadmap: now, next, later, done | Yes |
| `SUBAGENTS.md` | Delegation patterns, hooks, sub-agent triggers | Recommended |
| `docs/references/*.md` | Deep dives, one file per topic | As needed |

## Requirements

- Node.js >= 16.7.0 (for `fs.cpSync`)

## Install in a project

```bash
# Clone this skill once (anywhere on your machine)
git clone <this-repo> ~/skills/documentation

# Then, from the root of each project you want to document:
cd /path/to/my-project
node ~/skills/documentation/install.mjs
```

### Targets

```bash
node ~/skills/documentation/install.mjs --target=claude-code
node ~/skills/documentation/install.mjs --target=cursor
node ~/skills/documentation/install.mjs --target=codex
node ~/skills/documentation/install.mjs --target=all        # default
node ~/skills/documentation/install.mjs --dry-run
```

### Cross-platform notes

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

To update an installed project with a newer version of the skill:

```bash
cd /path/to/my-project
node ~/skills/documentation/install.mjs      # overwrites the skill files
```

The Codex `AGENTS.md` merge is idempotent — reinstalling detects the
`<!-- documentation-skill:start -->` marker and skips duplication.

## License

Apache-2.0
