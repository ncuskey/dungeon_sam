# Debug Session: Potions, Lantern & Animation (v0.4.1)

## Symptom
1. **Potion Floor**: Too many potions are spawning, often clustered together.
2. **Anchorless Lantern**: The lantern light stays at the start position and doesn't follow the player.
3. **Stuck Weapon**: The weapon animation stays in the "attack" state and doesn't return to idle.

**When:** During gameplay in v0.4.1.
**Expected:**
- Potions should be rarer and distributed.
- Lantern should be perfectly parented to the player view.
- Weapon should return to idle after ~500ms.

## Evidence Gathering
- [ ] Check `dungeonGenerator.ts` for item spawn density/proximity.
- [ ] Check `CameraRig.tsx` specifically for the `camera.add(light)` logic and potential scene hierarchy issues.
- [ ] Check `WeaponOverlay.tsx` for state cleanup/timeout logic.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `dungeonGenerator` spawns items per cell with too high a probability or lacks a "minimum distance" check. | 90% | UNTESTED |
| 2 | `CameraRig` uses `useEffect` with `camera` as dependency, but maybe `camera` isn't ready or `camera.add` is being overridden by R3F scene management. | 70% | UNTESTED |
| 3 | `WeaponOverlay` might have a race condition or the `setTimeout` is being cleared/invalidated if `lastAttackTime` updates too quickly or the component re-renders. | 80% | UNTESTED |
| 4 | Lantern might be sticking because `CameraRig` is rendered *outside* the `Canvas` context in some cases? No, it's inside in `App.tsx`. | 20% | UNTESTED |
