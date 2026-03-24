# Phase 1: Polish & Fixes - Research Findings

## 1. Doors Configuration
### Hinge vs Handle & Centering (`LevelRenderer.tsx`)
- **Current Rendering:** Doors use a `<boxGeometry args={[CELL_SIZE, CELL_SIZE, 0.1]} />` spanning a 2x2 grid.
- **Hinge vs Handle requirement:** The user wants door images to match hinge side vs handle side correctly depending on which side they view it from. This requires mapping texture coordinates differently on the front and back faces instead of a single `meshStandardMaterial`.
- **Centering issue:** "Some doors are off centered." The `pivotPosition` logic and `offset` shifts the door, but we need to verify the pivot math to ensure doors sit precisely midway through the passage opening rather than flush with the wall. 

## 2. Mobile Door Opening
### `TouchControls.tsx` mapping to `gameStore.ts`
- **Current Logic:** The `✋` (Interact) button only simulates `pickupItem()`.
- **Fix:** Update the interact button to check if the player is facing a door. If yes, call `toggleDoor()`, otherwise call `pickupItem()`. This mimics `Space/F` keyboard behavior from `PlayerController.tsx`.

## 3. Torch Light Adjustment
### `LevelRenderer.tsx` Torches
- **Current Logic:** The `pointLight` is currently located exactly where the Torch billboard sprite is anchored at `CELL_SIZE * 0.7`.
- **Fix:** Offset the `pointLight` slightly upward relative to the billboard group so it visually emanates from the fire portion of the torch texture instead of its base.

## 4. Auto-Pickup & Starting Shield
### `gameStore.ts`
- **Current Shield Spawning:** A shield is placed at `startPosition` via `initialItemsWithShield` as a pickable item.
- **Fix (Start Shield):** Modify `resetGame` to spawn the `Iron Shield` directly inside the player's `inventory.items` list and equip it via `equippedShieldId`.
- **Current Item Pickup:** Explicitly called via `KeyE` or `pickupItem()`.
- **Fix (Auto-pickup):** Update `moveForward` and `moveBackward` in `gameStore.ts` to check if an item shares the same position as the new `playerPosition`. If so, automatically pick it up.
