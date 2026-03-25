# STATE.md

## Current Position
- **Milestone**: v0.8
- **Phase**: Complete (Paused)
- **Status**: Stable at 2026-03-25 16:03

## Last Session Summary
Finalized Milestone v0.8. Integrated unused monster and weapon assets, implemented progressive level scaling, and resolved critical deployment issues (403/404).

## In-Progress Work
- Milestone v0.8 is fully verified and deployed to https://dungeonsam.site.
- Assets normalized to lowercase for Linux compatibility.
- Skull shield (61K) correctly restored and verified.

## Context Dump
### Decisions Made
- **Asset Normalization**: Renamed all assets to lowercase to avoid 404s on case-sensitive Ubuntu servers.
- **Vite Chunking**: Configured code-splitting to handle large Three.js dependencies.
- **Centralized Textures**: Created `constants.ts` to map item types to assets, removing duplication from components.

### Files of Interest
- `src/utils/constants.ts`: Source of truth for item textures.
- `src/components/EnemyRenderer.tsx`: Handles monster sprite selection.
- `vite.config.ts`: Manual chunking configuration.

## Next Steps
1. /new-milestone — Plan Milestone v0.9
2. Audit codebase for any remaining technical debt.
