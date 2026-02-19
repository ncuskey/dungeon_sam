# Debug Session: Torch Perspective Rule Change

## Symptom
Torches on walls perpendicular to the player's view direction (walls at the end of a corridor) aren't showing the front view, while torches on parallel walls (side walls) sometimes snap to front view when the player is close.

**Expected:** 
- Walls perpendicular to player's view direction = Front View.
- Walls parallel to player's view direction = Side View (Left/Right).

**Actual:** 
- Logic currently uses the vector from camera to torch, which is position-dependent rather than view-direction-dependent.

## Resolution

**Root Cause:** 
Torch perspective logic was based on the position vector (`cameraToTorch`) rather than the view direction. This caused torches to "front" even on side walls when the player was close to their normal.

**Fix:** 
- Switched to using `camera.getWorldDirection()` to determine wall perpendicularity (threshold `0.7`).
- Used `cameraRight` cross product to determine if side-wall torches are left or right of center.
- Aligned logic with the user's rule: "Walls perpendicular to players direction are front view. Walls parallel... are side view... depending on which side of center they're on."

**Verified:** 
- Live site validation on https://dungeonsam.site.
- Browser subagent confirmed correct texture flipping and view-based switching.
- Evidence: `front_torch_verification.png`, `side_wall_torch_verification.png`.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Switching from `cameraToTorch` to `camera.getWorldDirection()` will align the visuals with the player's intuitive view direction. | 95% | UNTESTED |
| 2 | The current `dot > 0.85` check is comparing the wrong vectors for a view-direction-based rule. | 80% | UNTESTED |

## Plan
1. Modify `Torch` component in `LevelRenderer.tsx` to use `camera.getWorldDirection()`.
2. Update the `dot` product logic to compare player view direction with wall normal.
3. Adjust the `sideDot` logic to use the player's view direction as well.
