---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: The Touch - Mobile Controls

## Objective
Implement touch controls to make the game playable on iPad and mobile devices. This includes an on-screen D-Pad/Joystick for movement (Left) and Action Buttons for combat/interaction (Right).

## Context
- `src/components/HUD.tsx`: Will overlay controls here (or a new `TouchControls.tsx`).
- `src/store/gameStore.ts`: Exposes movement actions (`moveForward`, `turnLeft`, etc.).
- `src/App.tsx`: Handles device detection.

## Tasks

<task type="auto">
  <name>Create Touch Controls Component</name>
  <files>src/components/TouchControls.tsx</files>
  <action>
    Create a new component `TouchControls`:
    1. **Layout**: Absolute positioning, `z-index: 50`.
    2. **Left Zone (Movement)**:
       - 4-way D-Pad visual (Up/Down/Left/Right).
       - Buttons:
         - UP -> `moveForward()`
         - DOWN -> `moveBackward()`
         - LEFT -> `turnLeft()`
         - RIGHT -> `turnRight()`
    3. **Right Zone (Actions)**:
       - "Attack" button (Space/F equivalent).
       - "Interact" button (E equivalent).
       - "Switch" button (Q equivalent).
    4. **Styling**: Semi-transparent buttons, large touch targets (60px+).
  </action>
  <verify>test -f src/components/TouchControls.tsx</verify>
  <done>Component created with visual button layout.</done>
</task>

<task type="auto">
  <name>Integrate Controls & Prevention</name>
  <files>src/App.tsx, src/index.css</files>
  <action>
    1. Import and render `<TouchControls />` in `App.tsx` (inside `GameOverlay` or sibling).
       - Only show if `gameStore.phase === 'PLAYING'`.
    2. **Touch Safety**:
       - Add `touch-action: none;` and `user-select: none;` to CSS body/root.
       - This prevents default browser gestures (zoom/scroll).
    3. Update `TouchControls` buttons to bind `onTouchStart` instead of `onClick` for responsiveness.
  </action>
  <verify>grep "TouchControls" src/App.tsx</verify>
  <done>Controls visible in game. Touch actions prevented globally.</done>
</task>

## Success Criteria
- [ ] On-screen D-Pad (Left) and Action Buttons (Right) visible.
- [ ] Touching inputs triggers game actions immediately.
- [ ] No browser zooming/scrolling.
