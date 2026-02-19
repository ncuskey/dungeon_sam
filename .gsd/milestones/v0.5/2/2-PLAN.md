---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: The Goblin Horde

## Objective
Implement speed and health variations for enemies and introduce the Goblin enemy type into the dungeon generation. Goblins will move faster (every tick) than Imps (every 2 ticks) but have less health.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/2/RESEARCH.md
- src/types/game.ts
- src/store/gameStore.ts
- src/utils/dungeonGenerator.ts

## Tasks

<task type="auto">
  <name>Update Enemy Type and AI Loop</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/types/game.ts
    /Users/nickcuskey/Sam's Game/src/store/gameStore.ts
  </files>
  <action>
    - Add `moveCooldown` to `Enemy` interface in `game.ts`.
    - Update `tickGame` in `gameStore.ts` to decrement `moveCooldown` and only move if it reaches 0.
    - Set `moveCooldown` to 1 for Goblins and 2 for Imps after moving.
    - Update damage logic to vary by enemy type (Imp: 5, Goblin: 8).
  </action>
  <verify>Check tickGame logic for cooldown handling.</verify>
  <done>Enemies move at different rates based on their type.</done>
</task>

<task type="auto">
  <name>Update Dungeon Generation for Goblins</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/utils/dungeonGenerator.ts
    /Users/nickcuskey/Sam's Game/src/store/gameStore.ts
  </files>
  <action>
    - Update `generateDungeon.ts` to randomly assign `type: 'goblin'` (40%) or `type: 'imp'` (60%).
    - Update `gameStore.ts` initial state and `resetGame` to correctly initialize `moveCooldown` for spawned enemies.
    - Set Goblin HP to 60 and Imp HP to 100.
  </action>
  <verify>Spawn enemies and check their 'type' and 'hp' properties in the debugger or console.</verify>
  <done>Goblins and Imps both spawn in the dungeon with correct initial stats.</done>
</task>

## Success Criteria
- [ ] Goblins move every game tick (400ms).
- [ ] Imps move every second game tick (800ms).
- [ ] Goblins have 60 HP and Imps have 100 HP.
- [ ] Both enemy types are present in the dungeon.
