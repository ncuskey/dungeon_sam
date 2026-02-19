---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Directional Torches

## Objective
Finalize the "directional" logic for wall-mounted torches using the three perspective assets (`torch_front.png`, `torch_left.png`, `torch_right.png`).

## Context
- .gsd/SPEC.md
- .gsd/phases/4/RESEARCH.md
- src/types/game.ts
- src/store/gameStore.ts
- src/components/LevelRenderer.tsx

## Tasks

<task type="auto">
  <name>Update Light Data Model</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/types/game.ts
    /Users/nickcuskey/Sam's Game/src/store/gameStore.ts
  </files>
  <action>
    - Add `facing: 'N' | 'S' | 'E' | 'W'` to `Light` interface in `game.ts`.
    - Update `generateLights` in `gameStore.ts` to store the direction of the wall the torch is attached to (N: dy=-1, S: dy=1, E: dx=1, W: dx=-1).
  </action>
  <verify>Check state for lights with the 'facing' property.</verify>
  <done>Light objects in state contain correct facing data.</done>
</task>

<task type="auto">
  <name>Implement Multi-Perspective Torch Rendering</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/components/LevelRenderer.tsx
  </files>
  <action>
    - Import `useThree` from `@react-three/fiber`.
    - In the torch rendering loop, calculate the angle between the player's camera position and the torch facing direction.
    - Map the angle to the three available textures: `torch_front.png`, `torch_left.png`, `torch_right.png`.
    - Logic hint: If vector from torch to player matches torch facing, use front. If it's offset to the side, use left/right.
  </action>
  <verify>Observe torches while moving past them to see the sprite texture change based on perspective.</verify>
  <done>Torches display the correct perspective texture based on viewing angle.</done>
</task>

## Success Criteria
- [ ] Torches look different from the side vs. the front.
- [ ] All 3 torch texture assets are utilized.
- [ ] Build passes without errors.
