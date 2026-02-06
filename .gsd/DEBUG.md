# Debug Session: Animation Mismatch & AI Dancing (v0.4.1)

## Symptom
1. **Animation Lead**: The weapon animation finishes before the attack sound/store update completes.
2. **AI Osciliation**: Enemies "dance around" instead of aggressively attacking the player.
3. **Pacing Request**: Revert attack cooldown from 700ms to 500ms.

**When:** During gameplay in v0.4.1.
**Expected:**
- Weapon animation should align with the 500ms/700ms cooldown and sound.
- Enemies should move towards the player and stay adjacent to deal damage.
**Actual:**
- Animation is too fast.
- Enemies appear to be oscillating or moving inefficiently.

## Evidence Gathering
- [ ] Check `WeaponOverlay.tsx` animation duration/CSS.
- [ ] Check `ai.ts` and `gameStore.ts` for enemy movement decisions.
- [ ] Verify `moveEnemy` logic for "best" move.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `WeaponOverlay` uses a hardcoded CSS transition time (0.1s) and timeout (200ms) that doesn't match the store. | 100% | ✅ CONFIRMED |
| 2 | `moveEnemy` always tries to move if a candidate has >= distance, even if already adjacent. | 90% | ✅ CONFIRMED |
| 3 | `WeaponOverlay` listens to keydown directly, so the animation plays even when the store blocks the attack. | 100% | ✅ CONFIRMED |

## Attempts

### Attempt 1
**Testing:** H1, H2, H3.
**Action:** 
1. Revert cooldown to 500ms in `gameStore.ts`.
2. Update `WeaponOverlay.tsx` to subscribe to `lastAttackTime` and match 500ms duration.
3. Update `ai.ts` to prevent moving if already adjacent to player.
**Result:** Pending.
