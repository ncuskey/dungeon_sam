# Debug Session: Combat Regressions (v0.4.1)

## Symptom
1. **Enemy Protection?**: Enemies are no longer dealing damage to the player in `tickGame`.
2. **Attack Spam**: Holding the attack key (Space/F) results in rapid-fire attacks, bypassing the 500ms cooldown.

**When:** During gameplay in v0.4.1.
**Expected:**
- Enemies deal 5 damage when adjacent (10% chance per tick).
- Attacks fire at most once every 500ms, even if the button is held.
**Actual:**
- Player health remains static (or doesn't decrease from enemies).
- Attacks fire much faster than 0.5s.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Adjacency check in `tickGame` uses old `state.enemies` before movement, or distance logic is too strict. | 50% | TESTING |
| 2 | Redundant `playAttackSound` in `PlayerController` makes it *sound* faster than 2x even if store is blocking. | 30% | TESTING |
| 3 | `performance.now()` vs `Date.now()` discrepancy or drift? Unlikely but possible. | 10% | UNTESTED |
| 4 | Attack cooldown (500ms) is exactly 2 hits/sec; user might have expected it to be slower (e.g. 750ms). | 10% | UNTESTED |

## Attempts

### Attempt 1
**Testing:** H1 & H2 — Added logs and removed redundant sound call.
**Action:** Added `Nearby enemy detected!` logs and removed `playAttackSound` from `PlayerController`. Increased damage chance to 20% for testing.
**Result:** Pending (Waiting for build/deploy or more analysis).
**Conclusion:** POTENTIAL FIX IMPLEMENTED.

## Evidence Gathering
- [ ] Inspect `tickGame` in `gameStore.ts`.
- [ ] Inspect attack logic in `gameStore.ts` and `PlayerController.tsx`.
- [ ] Check if `performance.now()` is consistent across store and components.
