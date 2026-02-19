---
phase: 3
plan: 1
wave: 1
---

# Plan 6.3.1: Interactive Environment (Interactive Doors)

## Objective
Implement interactive doors that block movement when closed and can be toggled open/closed using the Spacebar.

## Context
- [.gsd/SPEC.md](file:///Users/nickcuskey/Sam's Game/.gsd/SPEC.md)
- [src/store/gameStore.ts](file:///Users/nickcuskey/Sam's Game/src/store/gameStore.ts)
- [src/components/LevelRenderer.tsx](file:///Users/nickcuskey/Sam's Game/src/components/LevelRenderer.tsx)
- [src/components/PlayerController.tsx](file:///Users/nickcuskey/Sam's Game/src/components/PlayerController.tsx)

## Tasks

<task type="auto">
  <name>Implement Door Interaction State & Logic</name>
  <files>
    - src/store/gameStore.ts
  </files>
  <action>
    1. Update `moveForward` and `moveBackward` collision logic: Allow movement through `0` and `3` (Open Door), but block `2` (Closed Door).
    2. Add `toggleDoor` action to `GameState`.
       - Calculate the position in front of the player based on `playerPosition` and `playerDirection`.
       - If `map[y][x]` is `2` (Closed), change to `3` (Open).
       - If `map[y][x]` is `3` (Open), change to `2` (Closed).
       - Trigger a sound effect if possible (re-use existing ones or add a "click").
  </action>
  <verify>Check `gameStore.ts` for updated collision logic and the new `toggleDoor` action.</verify>
  <done>Player is blocked by closed doors, and `toggleDoor` correctly updates the map state.</done>
</task>

<task type="auto">
  <name>Connect Input & Update Visuals</name>
  <files>
    - src/components/PlayerController.tsx
    - src/components/LevelRenderer.tsx
  </files>
  <action>
    1. Update `PlayerController.tsx`: In the `Space` key handler, call `toggleDoor()`. If a door was toggled, do NOT perform an attack.
    2. Update `LevelRenderer.tsx`: Update the `doors` useMemo to include both `cell === 2` and `cell === 3`.
       - For `cell === 3`, render the door mesh in an "open" position (e.g., rotated 90 degrees or offset).
  </action>
  <verify>Run the game, walk up to a door, press Space. Confirm it opens and allows passage. Press Space again to close and verify it blocks movement.</verify>
  <done>Spacebar interacts with doors, and open doors are visually distinct and passable.</done>
</task>

## Success Criteria
- [ ] Closed doors (value 2) block player movement.
- [ ] Pressing Spacebar while facing a door toggles it between open and closed.
- [ ] Open doors (value 3) allow player movement.
- [ ] Open doors are visually rendered in an open state (or not rendered).
