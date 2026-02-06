---
phase: 3
plan: 3
wave: 2
gap_closure: true
---

# Plan 3.3: Touch Start Support (Gap Fix)

## Objective
Enable starting and restarting the game via touch/click, as the current "Press ENTER" requirement blocks mobile play.

## Context
- `src/components/GameOverlay.tsx`: Handles Start/Game Over screens. Currently listens only to `keydown`.

## Tasks

<task type="auto">
  <name>Add Click Handler to Overlay</name>
  <files>src/components/GameOverlay.tsx</files>
  <action>
    1. Extract the start/reset logic into a helper function `handleInteraction`.
    2. Add `onClick={handleInteraction}` to the main container `div`.
       - Because the container covers the full screen (`width: 100%, height: 100%`), tapping anywhere will trigger it.
    3. Update text prompts to say "PRESS ENTER OR TAP TO START" (and RESTART).
  </action>
  <verify>grep "onClick" src/components/GameOverlay.tsx</verify>
  <done>Game starts/restarts on click/tap.</done>
</task>

## Success Criteria
- [ ] Tapping the screen starts the game from MENU.
- [ ] Tapping the screen restarts the game from GAME_OVER or WON.
- [ ] Text updated to reflect touch option.
