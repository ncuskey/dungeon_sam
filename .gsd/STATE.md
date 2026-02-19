# STATE.md

## Current Position
**Milestone**: v0.6 "Interactive Halls & UX"
**Phase**: 3 (completed)
**Status**: Verified ✅

## Last Session Summary
Phase 3 executed successfully. Implemented interactive doors that block movement when closed and can be toggled with Spacebar.

## Next Steps
1. Plan Milestone v0.6 (e.g., Level 2, Keys/Locks, or Boss Enemy).
2. Deploy final build to production.

## Active Blockers
None

## Recent Decisions
- Lantern tracking: Use manual `position.copy()` instead of `camera.add()` to avoid R3F scene graph conflicts
- State updates: Merge related changes (movement + reveal) into atomic `set()` calls
- Animation state: Use `useRef` for timeout management to prevent stuck states
