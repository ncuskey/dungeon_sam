
# Plan 3.1: The Spark - Dynamic Lighting Engine

## Summary
Executed successfully.
- Defined `Light` interface in `src/types/game.ts`.
- Added `lights` array to `gameStore` with logic to scatter orange torches (10% chance) and place one at spawn.
- Updated `LevelRenderer` to render `pointLight` components.
- Tuned global lighting in `GameCanvas` (Ambient 0.2, Directional removed) to emphasize torches.

## Verification
- Code review: PASS
- Build check: PASS (fixed initial syntax error)
- Visual expectation: Dark dungeon, lit by orange point lights.
