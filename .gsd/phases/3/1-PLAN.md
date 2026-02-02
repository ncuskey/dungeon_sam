---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Enemy Entity & Rendering

## Objective
Establish the data structure for enemies in the global store and implement the rendering layer to display them as billboards in the 3D world.

## Context
- .gsd/SPEC.md
- .gsd/phases/3/RESEARCH.md
- src/store/gameStore.ts
- src/components/GameCanvas.tsx
- src/components/Billboard.tsx

## Tasks

<task type="auto">
  <name>Add Enemy State to Store</name>
  <files>src/store/gameStore.ts, src/types/game.ts</files>
  <action>
    1. Define `Enemy` interface: `{ id: string, x: number, y: number, type: 'imp', hp: number }`.
    2. Add `enemies: Enemy[]` to `GameState`.
    3. Update `generateDungeon` call to spawn initial enemies (simple random placement in empty cells).
    4. Add `spawnEnemy` action to store (for testing).
  </action>
  <verify>
    Create a test script or use console to `useGameStore.getState().enemies` and check it's populated.
  </verify>
  <done>Store contains an array of enemies with valid coordinates.</done>
</task>

<task type="auto">
  <name>Implement EnemyRenderer</name>
  <files>src/components/EnemyRenderer.tsx, src/components/GameCanvas.tsx</files>
  <action>
    1. Create `EnemyRenderer.tsx`.
    2. Subscribe to `useGameStore(state => state.enemies)`.
    3. Map enemies to `<Billboard />` components.
    4. Use a different color (e.g., 'red') for enemies vs other objects.
    5. Add `<EnemyRenderer />` to `GameCanvas`.
  </action>
  <verify>
    Load the game in browser. Verify red billboards appear in the scene at enemy coordinates.
  </verify>
  <done>Red billboards are visible in the 3D view.</done>
</task>

## Success Criteria
- [ ] `gameStore` has an `enemies` array.
- [ ] Enemies function `spawnEnemy` works.
- [ ] `EnemyRenderer` displays a billboard for each enemy.
