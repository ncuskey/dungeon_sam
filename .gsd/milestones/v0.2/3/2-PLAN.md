---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: AI Movement Loop

## Objective
Implement the "Tick" system for enemy AI, allowing enemies to move towards the player periodically (Real-time Grid system).

## Context
- .gsd/phases/3/RESEARCH.md (Decision: Real-time Grid)
- src/store/gameStore.ts

## Tasks

<task type="auto">
  <name>Implement Game Loop Hook</name>
  <files>src/hooks/useGameLoop.ts, src/components/GameCanvas.tsx</files>
  <action>
    1. Create `useGameLoop.ts`.
    2. Use `useEffect` with `setInterval` (e.g., 800ms tick).
    3. On tick, call `useGameStore.getState().tickGame()`.
    4. Mount this hook in `GameCanvas` or a new `GameController` component.
  </action>
  <verify>
    Add console log in `tickGame` action. Verify it logs every 800ms.
  </verify>
  <done>Game ticks automatically.</done>
</task>

<task type="auto">
  <name>Implement Enemy AI Logic</name>
  <files>src/store/gameStore.ts, src/utils/ai.ts</files>
  <action>
    1. Add `tickGame` action to `gameStore`.
    2. Create `src/utils/ai.ts` with `moveEnemy(enemy, playerPos, map)` function.
    3. Implement simple "move towards player" logic (Manhattan distance reduction).
       - Determine valid moves (N, E, S, W).
       - Choose move that reduces distance to player AND is walkable (0).
       - Handle collisions (don't move into other enemies or player... wait, moving INTO player should be attack? For now just stop).
    4. Update `enemies` array in store with new positions.
  </action>
  <verify>
    Observe enemies in browser. They should "step" towards the player every 0.8s.
  </verify>
  <done>Enemies pursue the player on the grid.</done>
</task>

## Success Criteria
- [ ] Game Loop calls `tickGame` periodically.
- [ ] `moveEnemy` logic correctly calculates next step.
- [ ] Enemies move towards player position.
