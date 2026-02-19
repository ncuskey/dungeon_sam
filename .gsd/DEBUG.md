# Debug Session: Environment Visuals Fix

## Symptoms

### 1. Door Orientation
- **Symptom**: Doors are perpendicular to the passage (blocking it visually or feeling "wrong").
- **Expected**: Doors should be parallel to the passage walls (fitting "in" the doorway).
- **Actual**: Doors are rotated 90 degrees offset from the intended parallel state.

### 2. Torch Perspective Swap
- **Symptom**: Left and right torch textures are reversed.
- **Expected**: When looking from the left side, the 'left' texture should show (or appropriate perspective).
- **Actual**: User reports they need to be swapped.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Door rotation logic in `LevelRenderer.tsx` is inverted/offset. | 90% | TESTING |
| 2 | Torch `sideDot` logic in `Torch` component has inverted left/right check. | 95% | TESTING |

## Resolution

**Root Cause:** 
1. Door rotation was set to block corridors (perpendicular), but user requested them to be parallel (aligned with walls/open).
2. Torch side-switching logic was inverted relative to the camera vector.

**Fix:** 
- Swapped `isHorizontal ? 0 : Math.PI / 2` to `isHorizontal ? Math.PI / 2 : 0` in `LevelRenderer.tsx`.
- Swapped `textures.left` and `textures.right` assignments in `Torch` component.

**Verified:** 
- Live site validation on https://dungeonsam.site.
- Browser subagent confirmed doors are now edge-on (parallel to passage) and torches show correct perspective.
- Evidence: `walkthrough.md` updated with new recordings.


## Evidence
- `LevelRenderer.tsx`: Door rotation uses `isHorizontal ? 0 : Math.PI / 2`.
- `LevelRenderer.tsx`: Torch `sideDot` logic uses `sideDot > 0` for left.
