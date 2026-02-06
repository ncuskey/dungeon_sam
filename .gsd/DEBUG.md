# Debug Session: Light Sync & Map Reveal (v0.4.1)

## Symptom
1. **Vanishing Lantern**: The player's light source (bloom) is not following the character as they move.
2. **Infinite Fog**: The minimap remains black and does not reveal explored areas during movement.

**When:** During gameplay in v0.4.1.
**Expected:**
- A point light should stay centered on the player's view/position.
- The minimap should reveal a 3x3 area around the player as they move forward or backward.
**Actual:**
- Light stays at spawn (or doesn't move with camera).
- Map stays hidden.

## Evidence Gathering
- [ ] Check `CameraRig.tsx` light position logic.
- [ ] Check `gameStore.ts` `revealMap` coordinate conversion and state update logic.
- [ ] Verify `moveForward`/`moveBackward` are correctly calling `get().revealMap()`.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `CameraRig` is copying `state.camera.position` which might be at `[0,0,0]` initially or lerping slowly, but the light isn't actualy attached to the camera object in the Three scene. | 60% | UNTESTED |
| 2 | `revealMap` uses `Math.floor(px)` which might be wrong if `px/py` are already grid integers, or if they are scaled. | 40% | UNTESTED |
| 3 | `exploredMap` reference isn't changing correctly because the shallow copy logic for rows is slightly flawed or `set` is returning `{}` too often. | 50% | UNTESTED |
| 4 | `moveForward` uses `get().revealMap(newX, newY)` but the `newX/newY` are grid coords, while the store expects world coords? (No, store seems to use grid). | 20% | UNTESTED |
