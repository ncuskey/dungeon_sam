# Phase 2 Research Findings

## 1. Left/Right Arm Visual Separation
### `WeaponOverlay.tsx`
- **Current Logic:** The component currently switches between a single large weapon graphic (`sword_truth.png`) or a flex container of two fists (`fist_left.png` and `fist_right.png`).
- **Fix:** Update the component to always render the two-arm flex container. 
  - The left arm's source should depend on `equippedShieldId` from the store (using `shield.png` or similar if equipped, fallback to `fist_left.png`).
  - The right arm's source should depend on `equippedWeaponId` (using the weapon image if equipped, fallback to `fist_right.png`).

## 2. Enemy Collision Constraints
### `gameStore.ts`
- **Current Logic:** The AI already correctly prevents enemies from walking into the player's tile (`ai.ts` line 45). However, the player's `moveForward` and `moveBackward` logic inside `gameStore.ts` only checks if the target map cell is a floor (`0`) or open door (`3`). It doesn't check if the tile is currently occupied by an active enemy.
- **Fix:** Update `moveForward`, `moveBackward` (and technically `turn` but that doesn't change position) to reject movement if an enemy currently occupies `[newX, newY]`.

## 3. Enemy Open-Door Pathing
### `ai.ts`
- **Current Logic:** `moveEnemy()` checks if a candidate tile is walkable via strictly `if (map[cand.y]?.[cand.x] !== 0) continue;`. Open doors are `3`.
- **Fix:** Allow enemies to step on open doors by altering the walkable check to `cell === 0 || cell === 3`.
