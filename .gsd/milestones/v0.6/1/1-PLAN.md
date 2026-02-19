---
phase: 1
plan: 1
wave: 1
---

# Plan 6.1.1: Platform-Adaptive UI & Sound Relocation

## Objective
Enhance the desktop experience by hiding mobile-specific touch controls and relocating the sound toggle to a more standard top-left position.

## Context
- [.gsd/SPEC.md](file:///Users/nickcuskey/Sam's Game/.gsd/SPEC.md)
- [src/components/HUD.tsx](file:///Users/nickcuskey/Sam's Game/src/components/HUD.tsx)
- [src/components/TouchControls.tsx](file:///Users/nickcuskey/Sam's Game/src/components/TouchControls.tsx)
- [src/App.tsx](file:///Users/nickcuskey/Sam's Game/src/App.tsx)

## Tasks

<task type="auto">
  <name>Implement Platform Detection</name>
  <files>
    - src/store/gameStore.ts
  </files>
  <action>
    Add an `isMobile` property to the game state.
    - Initialize it based on a robust check (e.g., `navigator.userAgent` or `window.matchMedia`).
    - This allows other components to adapt their rendering logic.
  </action>
  <verify>Check `gameStore.ts` for the `isMobile` property and its initialization logic.</verify>
  <done>`isMobile` is available in the game store and correctly identifies platform.</done>
</task>

<task type="auto">
  <name>Adaptive UI & Sound Relocation</name>
  <files>
    - src/App.tsx
    - src/components/HUD.tsx
    - src/components/TouchControls.tsx
  </files>
  <action>
    1. Update `App.tsx` or `TouchControls.tsx` to conditionally render based on `isMobile`.
    2. Relocate the sound toggle button in `HUD.tsx` from `right: 20px` to `left: 20px`.
  </action>
  <verify>Visually confirm in the browser that touch controls are hidden on desktop and the sound button is on the top-left.</verify>
  <done>Mobile controls are hidden on desktop, and sound button is in the top-left corner.</done>
</task>

## Success Criteria
- [ ] Mobile touch controls are NOT visible on desktop.
- [ ] Sound toggle button is positioned at the top-left of the screen.
