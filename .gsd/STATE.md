# STATE.md

## Current Position
**Milestone**: v0.5 "Goblins & Torches"
**Phase**: 5 (completed)
**Task**: Polished & Refined
**Status**: COMPLETED ✅

## Last Session Summary
Successfully concluded Milestone v0.5 "Goblins & Torches". Archied phase documentation, generated audit report, and verified all must-haves on the live site. The environment visuals (torches/doors) are now stable and logically sound. 

## Next Steps
1. Plan Milestone v0.6 (e.g., Level 2, Keys/Locks, or Boss Enemy).
2. Deploy final build to production.

## Active Blockers
None

## Recent Decisions
- Lantern tracking: Use manual `position.copy()` instead of `camera.add()` to avoid R3F scene graph conflicts
- State updates: Merge related changes (movement + reveal) into atomic `set()` calls
- Animation state: Use `useRef` for timeout management to prevent stuck states
