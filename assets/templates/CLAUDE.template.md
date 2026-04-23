# CLAUDE.md

Conventions for AI agents working on {{PROJECT_NAME}}.

## Stack

- **Language**: {{LANGUAGE}}
- **Framework**: {{FRAMEWORK}}
- **Package manager**: {{PACKAGE_MANAGER}}
- **Test runner**: {{TEST_RUNNER}}

## Commands

| Task | Command |
|------|---------|
| Install deps | `{{INSTALL_COMMAND}}` |
| Run dev | `{{RUN_COMMAND}}` |
| Run tests | `{{TEST_COMMAND}}` |
| Build | `{{BUILD_COMMAND}}` |
| Lint | `{{LINT_COMMAND}}` |

## Conventions

- Use conventional commits.
- Prefer editing existing files over creating new ones.
- Never skip hooks (`--no-verify`).
- Run `{{TEST_COMMAND}}` before committing when tests are affected.
- Keep root documentation files under ~200 lines; move deep content to `docs/references/`.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the domain model, layers, and key decisions.

## Delegation

See [SUBAGENTS.md](./SUBAGENTS.md) for sub-agent and hook patterns.

## Roadmap

See [PLANS.md](./PLANS.md) for in-progress, queued, and deferred work.

## References

Deep dives live in [`docs/references/`](./docs/references/). One file per topic.
