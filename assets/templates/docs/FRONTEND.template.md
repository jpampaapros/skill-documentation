# Frontend Architecture — {{PROJECT_NAME}}

How the UI layer is organized, rendered, and kept consistent.

## Stack

- **Framework**: {{FRAMEWORK}}
- **Language**: {{LANGUAGE}}
- **Styling**: <!-- tailwind, css modules, styled-components, etc. -->
- **State management**: <!-- signals, redux, zustand, tRPC, react-query, etc. -->
- **Routing**: <!-- file-based, react-router, etc. -->

## Rendering strategy

<!--
SSR, SSG, ISR, CSR — which and why.
If the framework gives you multiple modes, document which one each route uses.
-->

## Folder shape

<!--
Walk through the UI-related folders and what lives in each.
Example:
- src/app/               — routes (App Router)
- src/components/ui/     — atomic, framework-agnostic components
- src/components/       — feature components
- src/hooks/             — cross-cutting React hooks
- src/lib/               — framework-agnostic helpers
-->

## Data fetching

<!--
How components get data. Server components? Loaders? Hooks?
One canonical pattern, please. Avoid mixing three.
-->

## References

- [DESIGN.md](./DESIGN.md) — visual language and components
- [docs/references/](./references/) — deep dives
