---
description: Re-audit existing project documentation against the current state of the code and apply section-level fixes. Does NOT create new files — if a higher-tier file is missing, tells you to run /documentation-scaffold instead.
---

Invoke the `documentation` skill in **update** operation mode.

Goal: bring existing documentation in sync with the current code by applying section-level edits. Preserve the user's prose. Never rewrite a file end-to-end unless explicitly asked.

Follow the skill's update sub-workflow (path B):

1. Detect stack — read manifests or WordPress signals.
2. Detect tier — apply heuristics to know which canonical set to audit against.
3. Discover existing docs — list every file in the canonical set that currently exists. Also include any `docs/**/*.md` that are part of the convention. Ignore random markdown outside the convention.
4. Detect drift — for each existing doc, compare against the current code:
   - `README.md`: stale install/run commands, outdated features, broken links.
   - `CLAUDE.md`: framework/language mismatch vs current manifests, missing new conventions.
   - `ARCHITECTURE.md`: new top-level folders in `src/`, removed layers, renamed modules, new domain entities.
   - `PLANS.md`: "Now" items that were shipped (move to "Done"), stale priorities.
   - `SUBAGENTS.md`: new hooks, undocumented sub-agent patterns.
   - `docs/*.md`: same rules, scoped to the subsystem each file owns.
5. Propose section-level diff plan — one-line-per-section list of changes per file. Keep it tight.
6. Confirm before editing — wait for explicit GO. The user may accept all, reject some, or add sections to update.
7. Apply edits — Edit tool, section by section, diff-style only. Preserve user prose.
8. Report — one line per section touched.

Hard constraints:
- Do NOT create new files in update mode. If a higher-tier file is missing (e.g. `docs/SECURITY.md` for a now-SaaS project), tell the user: "this file is missing — run `/documentation-scaffold` to add it."
- Do NOT run end-to-end rewrites. Section-level edits only.
- Do NOT bundle — that's `/documentation-bundle`.
