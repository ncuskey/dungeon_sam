---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: The Spark - Dynamic Lighting Engine

## Objective
Implement a dynamic lighting system using point lights to create atmosphere. This involves updating the `LevelRenderer` to support multiple light sources and defining a `Light` interface for torch placement.

## Context
- `src/components/LevelRenderer.tsx`: Needs to render PointLights.
- `src/types/game.ts`: Needs a `Light` interface.
- `src/store/gameStore.ts`: Needs to manage a list of lights.

## Tasks

<task type="auto">
  <name>Define Light Interface</name>
  <files>src/types/game.ts</files>
  <action>
    Export a new interface `Light`:
    - `id`: string
    - `x`: number
    - `y`: number
    - `intensity`: number
    - `color`: string
    - `distance`: number (range)
  </action>
  <verify>grep "interface Light" src/types/game.ts</verify>
  <done>Interface exported and available.</done>
</task>

<task type="auto">
  <name>Add Lights to Game Store</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Add `lights: Light[]` to generic state.
    2. Initialize `lights: []`.
    3. Update `moveBackward`, `moveForward`, etc. (no changes needed for lights yet).
    4. In `generateDungeon`, populate `lights`.
       - For now, place a light at the Player Spawn point (so they aren't in dark).
       - Place random lights in empty floor cells (10% chance) to simulate torches.
       - Use orange/yellow color (`#ffaa00`) and range ~ 10-15.
  </action>
  <verify>grep "lights:" src/store/gameStore.ts</verify>
  <done>Game store holds and generates lights.</done>
</task>

<task type="auto">
  <name>Render Dynamic Lights</name>
  <files>src/components/LevelRenderer.tsx</files>
  <action>
    1. Read `lights` from store.
    2. Map over `lights` and render `<pointLight />` components.
    3. Remove global ambient light or lower it significantly (to 0.1) so point lights matter.
    4. Ensure walls/floor use `meshStandardMaterial` (already done) so they react to light.
  </action>
  <verify>grep "pointLight" src/components/LevelRenderer.tsx</verify>
  <done>Lights appear in 3D scene and illuminate surfaces.</done>
</task>

## Success Criteria
- [ ] `Light` interface defined.
- [ ] Game generates random lights in the dungeon.
- [ ] Scene is dark (low ambient) but illuminated by point lights.
- [ ] Visual confirmation of lighting effects on walls/floor.
