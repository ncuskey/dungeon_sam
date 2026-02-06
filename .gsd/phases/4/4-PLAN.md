---
phase: 4
plan: 4
---

# Plan 4.4: Cartography (Minimap & Fog of War)

## Objective
Implement an auto-revealing minimap to help players navigate the procedural dungeon and see their progress.

## Tasks

<task type="auto">
  <name>Exploration State</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Add `exploredMap: boolean[][]` to `GameState`.
    2. Add `revealMap(x: number, y: number)` action that marks a 3x3 grid centered on the player as explored.
    3. Update `moveForward`, `moveBackward`, and `resetGame` to trigger exploration.
  </action>
</task>

<task type="auto">
  <name>Minimap Component</name>
  <files>src/components/Minimap.tsx</files>
  <action>
    1. Create a small Canvas-based component (e.g., 150x150px).
    2. Render explored cells with color coding:
       - Wall: Dark Gray
       - Floor: Light Gray
       - Player: Green Dot
       - Exit: Red Dot (only if explored)
    3. Use `requestAnimationFrame` or a simple state subscription to keep it updated.
  </action>
</task>

<task type="auto">
  <name>UI Integration</name>
  <files>src/App.tsx</files>
  <action>
    Mount the `Minimap` component in the main application overlay (top-right corner).
  </action>
</task>

## Success Criteria
- [ ] Minimap appears in the UI during gameplay.
- [ ] Black "Fog of War" covers unexplored areas.
- [ ] Moving into new areas reveals them on the minimap in real-time.
- [ ] The player's current position and direction are correctly represented.
