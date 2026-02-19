---
phase: 2
plan: 1
wave: 1
---

# Plan 6.2.1: Game State Control (Pause System)

## Objective
Implement a pause system that allows players to halt gameplay using the ESC key and provides a clear visual indication via a UI overlay.

## Context
- [.gsd/SPEC.md](file:///Users/nickcuskey/Sam's Game/.gsd/SPEC.md)
- [src/store/gameStore.ts](file:///Users/nickcuskey/Sam's Game/src/store/gameStore.ts)
- [src/components/GameOverlay.tsx](file:///Users/nickcuskey/Sam's Game/src/components/GameOverlay.tsx)
- [src/components/PlayerController.tsx](file:///Users/nickcuskey/Sam's Game/src/components/PlayerController.tsx)

## Tasks

<task type="auto">
  <name>Extend Game State with Pause Logic</name>
  <files>
    - src/store/gameStore.ts
  </files>
  <action>
    1. Update `GamePhase` type to include `'PAUSED'`.
    2. Add `togglePause` function to `GameState` interface and implement it in the store.
    3. `togglePause` should only work if the phase is `'PLAYING'` or `'PAUSED'`.
  </action>
  <verify>Check `gameStore.ts` for the updated `GamePhase` type and the `togglePause` implementation.</verify>
  <done>`togglePause` action is implemented and correctly switches between `PLAYING` and `PAUSED` states.</done>
</task>

<task type="auto">
  <name>Implement Pause UI and ESC Handler</name>
  <files>
    - src/components/GameOverlay.tsx
    - src/components/PlayerController.tsx
  </files>
  <action>
    1. Update `GameOverlay.tsx` to render a "PAUSED" screen when the phase is `'PAUSED'`.
    2. Add an `Escape` key listener to `PlayerController.tsx` (or a centralized input handler) that calls `togglePause()`.
    3. Ensure that clicking the overlay while paused also resumes the game.
  </action>
  <verify>Run the game, press ESC, and confirm the "PAUSED" overlay appears. Press ESC again or click to resume.</verify>
  <done>ESC key toggles the pause state, and the UI correctly displays the pause status.</done>
</task>

## Success Criteria
- [ ] Pressing ESC during gameplay pauses the game (blocking movement and combat).
- [ ] A "PAUSED" overlay is displayed when the game is paused.
- [ ] Pressing ESC again or clicking the overlay resumes the game.
