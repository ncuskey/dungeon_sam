---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Asset Foundation

## Objective
Migrate new assets to the public directory and integrate basic rendering for Goblins, Shields, and Doors. Prepare the torch system for multi-perspective rendering.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/components/ItemRenderer.tsx
- src/components/EnemyRenderer.tsx
- src/components/LevelRenderer.tsx

## Tasks

<task type="auto">
  <name>Migrate Assets to Public</name>
  <files>
    /Users/nickcuskey/Sam's Game/public/
  </files>
  <action>
    Move the following assets from the root to `public/`:
    - `Goblin.png`
    - `Shield.png`
    - `Door Fit.png`
    - `Torch Front.png`
    - `Torch Left.png`
    - `Torch Right.png`
    Rename `Door Fit.png` to `door_fit.png` for consistency if needed, but the user named it specifically. I'll keep it as `door_fit.png` but with underscores.
  </action>
  <verify>ls public/</verify>
  <done>All 6 new PNG assets exist in the public directory.</done>
</task>

<task type="auto">
  <name>Integrate Goblin and Shield Sprites</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/components/EnemyRenderer.tsx
    /Users/nickcuskey/Sam's Game/src/components/ItemRenderer.tsx
  </files>
  <action>
    - Update `ItemRenderer` to return `/Shield.png` when the item name is 'Shield'.
    - Update `EnemyRenderer` to return `/Goblin.png` when the enemy type is 'goblin'.
  </action>
  <verify>Check component code for new mappings.</verify>
  <done>Mappings for Shield and Goblin assets are present in their respective renderers.</done>
</task>

<task type="auto">
  <name>Prepare LevelRenderer for Multi-Perspective Torches and New Doors</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/components/LevelRenderer.tsx
  </files>
  <action>
    - Update door rendering (if applicable) to use `door_fit.png`. (Need to check where doors are rendered).
    - Modify the torch visual marker in `LevelRenderer` to use a basic Billboard prototype for now, preparing for the perspective logic.
    - Note: Directional logic for torches will be finalized in Phase 4, but loading the assets happens here.
  </action>
  <verify>Check LevelRenderer for asset references.</verify>
  <done>LevelRenderer is updated to reference new assets where applicable.</done>
</task>

## Success Criteria
- [ ] New assets are served correctly from `public/`.
- [ ] Goblins and Shields appear with correct sprites in-game.
- [ ] LevelRenderer is prepared for torch perspective work.
