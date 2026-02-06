---
phase: 3
plan: 4
wave: 3
gap_closure: true
---

# Plan 3.4: Fix Lighting Init & Attack Feedback

## Objective
Fix the issue where lights are missing on the first playthrough, and improve attack feedback so users know the button is working.

## Context
- `src/store/gameStore.ts`:
  - `lights` array invalidly initialized to `[]` instead of using `generateLights`.
  - `playerAttack` has no feedback if no enemy is hit.

## Tasks

<task type="auto">
  <name>Initialize Lights Correctly</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Call `generateLights(initialMap, startPosition)` at the module scope (similar to `enemies`).
    2. Use this initial value in `useGameStore` instead of `[]`.
  </action>
  <verify>grep "lights: initialLights" src/store/gameStore.ts</verify>
  <done>Lights exist on first load.</done>
</task>

<task type="auto">
  <name>Add Attack Feedback</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. In `playerAttack`, add `console.log("Player Attacked!")` at the very top.
    2. (Optional) In a future step we'd play a sound, but for now log is enough to verify button works.
  </action>
  <verify>grep "Player Attacked" src/store/gameStore.ts</verify>
  <done>Console confirms button press.</done>
</task>

## Success Criteria
- [ ] Lights visible immediately upon starting the game.
- [ ] Clicking attack button logs to console (verifiable via remote console or assumption).
