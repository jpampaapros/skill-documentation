# Subagents

Delegation patterns, hooks, and sub-agent triggers for {{PROJECT_NAME}}.

## Sub-agents available

<!--
List the sub-agents configured for this project.
For each:

### <sub-agent name>

- **Trigger**: when this sub-agent is invoked
- **Purpose**: what it does
- **Model**: which model it uses (opus / sonnet / haiku)
- **Inputs**: what the orchestrator passes
- **Outputs**: what it returns
-->

## Hooks

<!--
List the hooks configured in `.claude/hooks/` or equivalent.
For each:

### <hook name>

- **Event**: PreToolUse, PostToolUse, SessionStart, etc.
- **Script**: path to the script
- **Purpose**: what it enforces or reports
- **Failure mode**: what happens when it fails
-->

## Delegation rules

| Action | Inline | Delegate |
|--------|--------|----------|
| Read 1-3 files to decide | Yes | — |
| Read 4+ files to explore | — | Yes |
| Write one mechanical file | Yes | — |
| Write across multiple files with analysis | — | Yes |
| Bash for state (git, gh) | Yes | — |
| Run tests or builds | — | Yes |

## References

- [CLAUDE.md](./CLAUDE.md) — primary agent conventions
- [docs/references/](./docs/references/) — deep dives
