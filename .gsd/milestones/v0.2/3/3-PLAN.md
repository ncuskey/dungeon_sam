---
phase: 3
plan: 3
wave: 2
---

# Plan 3.3: Combat System

## Objective
Implement player combat (attacking enemies) and enemy combat (damaging player), along with a basic HUD.

## Context
- src/store/gameStore.ts

## Tasks

<task type="auto">
  <name>Player Attack Action</name>
  <files>src/store/gameStore.ts, src/components/Controls.tsx</files>
  <action>
    1. Add `playerAttack` action to store.
       - Calculate tile in front of player based on `playerDirection`.
       - Check if enemy exists at that tile.
       - If yes, reduce enemy HP.
       - If HP <= 0, remove enemy.
    2. Bind `Spacebar` or `Click` to `playerAttack` in `Controls.tsx` (or new `InputManager`).
    3. Add simple visual feedback (console log or flash screen - keep generic for now).
  </action>
  <verify>
    Move to adjacent enemy, face them, press attack key. Enemy should disappear (die) or log damage.
  </verify>
  <done>Player can kill enemies.</done>
</task>

<task type="auto">
  <name>Enemy Attack Logic</name>
  <files>src/store/gameStore.ts, src/utils/ai.ts</files>
  <action>
    1. Add `playerHealth` to `GameState` (init 100).
    2. Update `tickGame` / `moveEnemy`:
       - If enemy is adjacent to player, DO NOT move.
       - Instead, Attack (reduce player HP).
    3. Add "Game Over" check if `playerHealth` <= 0 (just alert or reset for now).
  </action>
  <verify>
    Stand still next to an enemy. Watch Health drop.
  </verify>
  <done>Enemies damage player when adjacent.</done>
</task>

<task type="auto">
  <name>Basic HUD</name>
  <files>src/components/HUD.tsx, src/App.tsx</files>
  <action>
    1. Create `HUD.tsx` (HTML overlay).
    2. Display `Player Health`.
    3. Display `Weapon` (e.g. "Fisticuffs").
    4. Position at bottom of screen (Doom style).
  </action>
  <verify>
    HUD visible on screen, updates when damaged.
  </verify>
  <done>Health is visible and updates.</done>
</task>

## Success Criteria
- [ ] Player can attack and kill enemies.
- [ ] Enemies attack player when in range.
- [ ] Health is displayed on HUD.
