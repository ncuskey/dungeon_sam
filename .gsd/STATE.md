# STATE.md

## Current Position
**Milestone**: v0.5 "Goblins & Torches"
**Phase**: 5 (completed)
**Task**: Deployed & Validated
**Status**: Milestone v0.5 Deployed to Production

## Last Session Summary
Successfully completed and deployed Milestone v0.5 "Goblins & Torches". All features (Goblins, Shields, Torches, Doors) verified on the live site at https://dungeonsam.site. Clean production build active.

## Next Steps
1. Plan Milestone v0.6 (e.g., Level 2, Keys/Locks, or Boss Enemy).
2. Deploy final build to production.

## Active Blockers
None

## Recent Decisions
- Lantern tracking: Use manual `position.copy()` instead of `camera.add()` to avoid R3F scene graph conflicts
- State updates: Merge related changes (movement + reveal) into atomic `set()` calls
- Animation state: Use `useRef` for timeout management to prevent stuck states
