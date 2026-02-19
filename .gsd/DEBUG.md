# Debug Session: Door Orientation Regression

## Symptom
Doors are rotated 90 degrees incorrectly again, likely perpendicular to the passage walls when they should be parallel.

**Expected:** Doors should be parallel to the passage walls.
**Actual:** Doors are likely perpendicular (blocking the corridor path visually).

## Resolution

**Root Cause:** 
The "more robust" neighbor check logic implemented in a previous step inadvertently flipped the rotation assignments for `isEwPassage`, returning the doors to their perpendicular (protruding) state.

**Fix:** 
Reverted the assignments in `LevelRenderer.tsx` to `isEwPassage ? Math.PI / 2 : 0`.
- East-West passage (along X) $\rightarrow$ `Math.PI / 2` (ZY plane) $\rightarrow$ Parallel to X-axis passage.
- North-South passage (along Z) $\rightarrow$ `0` (XY plane) $\rightarrow$ Parallel to Z-axis passage.

**Verified:** 
- Live site validation on https://dungeonsam.site.
- Browser subagent confirmed doors are flush with the walls.
- Evidence: `door_verification_flush.png`.
