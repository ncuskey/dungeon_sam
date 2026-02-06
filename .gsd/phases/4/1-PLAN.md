---
phase: 4
plan: 1
---

# Plan 4.1: Radiance (Superior Lighting)

## Objective
Fix the "too dark" atmosphere by implementing wall-anchored torches and a player-following glow.

## Tasks

<task type="auto">
  <name>Wall-Anchored Light Generation</name>
  <files>src/store/gameStore.ts</files>
  <action>
    Update `generateLights` to:
    1. Scan floor cells for wall neighbors.
    2. If a neighbor is a wall, calculate an offset (0.4 units) towards that wall.
    3. Update the `Light` object with floating point coordinates.
  </action>
</task>

<task type="auto">
  <name>Torch Visuals</name>
  <files>src/components/LevelRenderer.tsx</files>
  <action>
    Add a small visual marker (e.g., an orange Billboard or a small mesh) at each `Light` position to represent the torch itself.
  </action>
</task>

<task type="auto">
  <name>Player Lantern Glow</name>
  <files>src/components/CameraRig.tsx</files>
  <action>
    Render a `pointLight` at the camera's position to illuminate the player's immediate surroundings.
  </action>
</task>

<task type="auto">
  <name>Tweak Ambient Light</name>
  <files>src/components/GameCanvas.tsx</files>
  <action>
    Bumb `ambientLight` intensity from 0.2 to 0.25 to slightly lift the overall shadows.
  </action>
</task>

## Success Criteria
- Torches are attached to walls.
- Player has a bubble of light.
- Dungeon is no longer "too dark".
