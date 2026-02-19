# STATE.md

## Current Position
**Milestone**: v0.6 (COMPLETED)
**Phase**: N/A
**Status**: Archived ✅

## Last Session Summary
Finalized Milestone v0.6 "Interactive Halls & UX". Completed interactive doors (centered/hinged), pause system, and platform-adaptive UI. Audited and verified on live site.

## Next Steps
1. Initialize Milestone v0.7 (Planning).

## Active Blockers
None

## Recent Decisions
- Lantern tracking: Use manual `position.copy()` instead of `camera.add()` to avoid R3F scene graph conflicts
- State updates: Merge related changes (movement + reveal) into atomic `set()` calls
- Animation state: Use `useRef` for timeout management to prevent stuck states
