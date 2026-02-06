# Research: Phase 3 (Combat & AI)

## Problem
Phase 3 requires adding enemies and combat to a grid-based dungeon crawler. We need to decide on:
1.  **State Management**: How to track enemy positions/stats.
2.  **Game Loop**: Turn-based (move-on-move) vs. Real-time (Grimrock style).
3.  **Rendering**: How to efficiently render many billboards.

## Analysis

### 1. State Management
Existing state is in `gameStore.ts` (Zustand).
-   **Current**: `playerPosition`, `map`, `playerDirection`.
-   **Proposed**: Add `enemies: Enemy[]` array.
    -   `Enemy` struct: `{ id, x, y, type, hp, state (idle/chase/attack) }`.
    -   Actions: `spawnEnemy`, `updateEnemy`, `damageEnemy`.

### 2. Game Loop (Timing)
Top-level constraints: "Doom-style", "Visceral", "Grimrock".
-   **Option A: Turn-based (Roguelike)**. Enemies only move when player moves.
    -   *Pros*: Easy to code, deterministic.
    -   *Cons*: Lacks "action" feel of Doom.
-   **Option B: Real-time Grid (Grimrock)**. Enemies move on a timer (e.g., every 1s).
    -   *Pros*: Creates tension (Doom vibe), allows strafing/kiting.
    -   *Cons*: More complex state management (need a `useInterval` or `useFrame` driver).

**Decision**: **Real-time Grid**.
-   Enemies will act on a "Tick" system (e.g., every 600ms-1000ms).
-   Player can move faster than this tick, allowing tactical dodging (kiting).
-   We will add a `useGameLoop` hook to drive enemy updates in the store.

### 3. Rendering
`Billboard.tsx` exists.
-   **Optimization**: Instead of map-looping inside the Canvas, we will have an `<EnemyRenderer />` component that subscribes to `state.enemies`.
-   **Assets**: We will use simple colored rectangles or placeholders for now, maybe emoji or basic generated textures later. Phase 3 deliverables mention "Enemy billboard sprites". We will use the existing `Billboard` component, perhaps updating it to accept a texture prop.

## Architecture Changes
1.  **Modify `gameStore.ts`**: Add `enemies` slice.
2.  **New `useGameLoop.ts`**: Handles the rhythmic updates for AI.
3.  **New `EnemyRenderer.tsx`**: Renders the enemy list.
4.  **New `CombatSystem`**: Simple distance check. If player presses "Attack" (Spacebar/Click) and enemy is in front (1 tile), deal damage.

## Plan Breakdown
-   **3.1**: Enemy Entity & Rendering (Store + `EnemyRenderer`).
-   **3.2**: AI Movement Loop (The "Tick" + Pathfinding).
-   **3.3**: Combat Interactions (Player Hit, Enemy Attack, HUD).
