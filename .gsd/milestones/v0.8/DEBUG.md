---
status: investigating
trigger: "rubble.png:1 GET https://dungeonsam.site/rubble.png 404 (Not Found)"
created: 2026-03-25T15:23:00Z
updated: 2026-03-25T15:23:00Z
---

## Current Focus
hypothesis: Case-sensitivity mismatch between code and production filesystem (Ubuntu).
test: Rename assets to lowercase locally and update code references.
expecting: Site loads correctly on Ubuntu.
next_action: Audit all assets for casing and update references.

## Symptoms
expected: `rubble.png` loads and enemy renders.
actual: 404 error for `/rubble.png`, WebGL context lost.
errors: `Could not load /rubble.png: undefined`

## Eliminated
- hypothesis: File missing entirely.
  evidence: `list_dir` shows `Rubble.png` exists in `dist/`.

## Evidence
- checked: `EnemyRenderer.tsx` line 9 specifies `return '/rubble.png'`.
- checked: `dist/` contents show `Rubble.png`.
- implication: Linux production server is case-sensitive, Mac dev environment is not.

## Resolution
root_cause: Filename case-sensitivity mismatch between the local development environment (Mac) and the production server (Ubuntu). The code was requesting files in lowercase (e.g., `/rubble.png`), while the files on disk were mixed-case (e.g., `Rubble.png`).
fix: Normalized all asset filenames in `public/` to lowercase and updated all references in `constants.ts` and `EnemyRenderer.tsx`.
verification: Verified via browser subagent that `https://dungeonsam.site/rubble.png` returns 200 OK and no 404 errors occur during gameplay.
