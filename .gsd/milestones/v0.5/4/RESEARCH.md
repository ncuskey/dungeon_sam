# Research: Phase 4 - Environmental Overhaul

## Torches (Directional Logic)

### Problem
Current torches are placed near walls but have no directional data. They use a single `torch_front.png` texture.

### Proposed Solution
1.  **Update `Light` Interface**: Add `facing: 'N' | 'S' | 'E' | 'W'` to `Light` in `game.ts`.
2.  **Update `generateLights`**: Store the wall neighbor direction.
3.  **Update `LevelRenderer`**: 
    - Calculate the angle between the player's camera position and the torch's facing direction.
    - Select texture:
        - `torch_front.png`: If player is looking "at" the torch (facing away from the wall).
        - `torch_left.png`: If player is looking from the left side.
        - `torch_right.png`: If player is looking from the right side.
    - Since we have 3 textures (Front, Left, Right), we can assume a 180-degree coverage or simple angle buckets.

## Doors

### Problem
No doors currently exist in the `map` or rendering loop.

### Proposed Solution
1.  **Map Logic**: 
    - Define `CELL_TYPES.DOOR = 2` (or similar).
    - Update `dungeonGenerator.ts` to place doors at corridor/room transitions.
2.  **Rendering**:
    - Update `LevelRenderer.tsx` to detect `cell === 2`.
    - Render a `mesh` (plane or thin box) with the `door_fit.png` texture.
3.  **Gameplay**: 
    - Add `openDoor` action to `gameStore.ts`.
    - Doors could be automatically opened when the player walks into them, or require a key (already have key type).
    - For v0.5, simple auto-opening or "press to open" is sufficient.

## Assets
-   `torch_front.png`, `torch_left.png`, `torch_right.png` (in `public/`)
-   `door_fit.png` (in `public/`)
