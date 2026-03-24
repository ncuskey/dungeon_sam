# Phase 4 Research Findings

## 1. Level Completion & Progression
### `gameStore.ts` & `HUD.tsx`
- **Current Logic:** `generateDungeon()` produces an `exitPosition` which is tracked in state and rendered on the `Minimap`, but stepping onto it does nothing.
- **Fix:** 
  1. Add `level: number` (initial 1) to `GameState`.
  2. Implement `nextLevel()` action inside `gameStore.ts` which calls `generateDungeon()`, increments `level`, and overwrites `map`, `playerPosition`, `exitPosition`, `enemies`, `items`, `lights`, and `exploredMap` while leaving `inventory` intact!
  3. Inside `moveForward` and `moveBackward`, check if `newX === exitPosition.x && newY === exitPosition.y`. If so, call `soundManager.playLevelComplete()` and `get().nextLevel()`.
  4. Update `HUD.tsx` to read `state.level` and display it (`LEVEL: {level}`).

## 2. Sound Passing
### `SoundManager.ts` & `gameStore.ts`
- **Current Logic:** The `toggleDoor` function has a comment `// Note: If we had a sound management system, we'd trigger a door sound here`. Also, no sound exists for level completion.
- **Fix:** 
  1. Add `playDoorOpen()` and `playLevelComplete()` implementations to `SoundManager.ts` utilizing the Web Audio API context.
  2. Trigger `soundManager.playDoorOpen()` inside `toggleDoor()` when a door changes state.
  3. Trigger `soundManager.playLevelComplete()` when stepping on the `exitPosition`.
