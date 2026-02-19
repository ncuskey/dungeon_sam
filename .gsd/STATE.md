# STATE.md

## Current Position
**Milestone**: v0.6 "Interactive Halls & UX"
**Phase**: 3 (Interactive Environment)
**Status**: Planning complete - Ready for execution

## Last Session Summary
Phase 2 executed successfully. Implemented the pause system with ESC key support and a UI overlay.

## Next Steps
1. Plan Milestone v0.6 (e.g., Level 2, Keys/Locks, or Boss Enemy).
2. Deploy final build to production.

## Active Blockers
None

## Recent Decisions
- Lantern tracking: Use manual `position.copy()` instead of `camera.add()` to avoid R3F scene graph conflicts
- State updates: Merge related changes (movement + reveal) into atomic `set()` calls
- Animation state: Use `useRef` for timeout management to prevent stuck states
