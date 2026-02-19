# PLAN.md — Phase 2: The Architect

> **Status**: PROPOSED
> **Goal**: Implement procedural dungeon generation to create infinite, unique levels.

## Context
Phase 1 established the rendering engine and grid movement using a hardcoded 5x5 map. Phase 2 will replace this with a robust procedural generation system capable of creating interesting dungeon layouts with rooms, corridors, a start point, and an exit.

## Strategy
We will use a **Binary Space Partitioning (BSP)** algorithm. This is a classic method for roguelikes that produces well-structured dungeons with distinct rooms connected by corridors. It avoids the "messy cavern" look of cellular automata and ensures all rooms are reachable.

## Deliverables

### 1. Dungeon Generator Module (`src/utils/dungeonGenerator.ts`)
- **Algorithm**:
    1.  Start with a predefined map size (e.g., 30x30).
    2.  Recursively split the space into `Leaf` nodes until a minimum size is reached.
    3.  Create a Room within each Leaf (with some padding/randomness).
    4.  Connect sibling Leaves with corridors (straight or L-shaped).
    5.  Fill the map array: 1 = Wall, 0 = Floor.
- **Output**:
    - `map`: `number[][]`
    - `startPosition`: `{ x, y }` (Center of the first room)
    - `exitPosition`: `{ x, y }` (Center of the last room)

### 2. Game Store Integration (`src/store/gameStore.ts`)
- Replace `INITIAL_MAP` with a call to `generateDungeon()`.
- Update `initialState` to use the returned `startPosition`.
- Add `exitPosition` to the store state (preparation for Phase 4 win condition).

## Verification Plan

### Automated Verification
- **Unit Test for Generator**: Create a simple test script `src/utils/dungeonGenerator.test.ts` (using Vitest if available, or a simple executed script) that asserts:
    - Map dimensions are correct.
    - Start and Exit positions are "floor" tiles (0).
    - Map contains both walls (1) and floors (0).
    - *Pathfinding check (optional but good)*: A path exists between Start and Exit.

### Manual Verification
1.  **Visual Check**: Load the game.
    - Confirm walls and floors render correctly (no holes in the world).
    - Confirm player spawns in an open space, not inside a wall.
2.  **Gameplay Check**:
    - Walk around.
    - Confirm collision works (can't walk through generated walls).
    - Confirm the layout looks "dungeon-like" (rooms and corridors).

## Task Breakdown
1.  [ ] Create `src/utils/dungeonGenerator.ts` skeleton and types.
2.  [ ] Implement BSP splitting logic.
3.  [ ] Implement Room placement and Corridor connection.
4.  [ ] Update `src/store/gameStore.ts` to use the generator.
5.  [ ] Verify with tests and browser.
