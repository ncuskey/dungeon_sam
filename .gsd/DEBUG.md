# Debug Session: Door Interaction Failure

## Symptom
Spacebar does not open doors during gameplay.

**When:** During gameplay, when facing a closed or open door.
**Expected:** Pressing Spacebar should toggle the door state and allow/block passage.
**Actual:** Spacebar does not seem to trigger the `toggleDoor` action or the visuals do not update.

## Evidence
- `PlayerController.tsx` handles Spacebar.
- `gameStore.ts` has `toggleDoor` logic.
- `LevelRenderer.tsx` handles visuals for cell values `2` and `3`.

## Attempts

### Attempt 1
**Testing:** H1 — Redundant `toggleDoor` call.
**Action:** Inspected `PlayerController.tsx` line 49 and 76.
**Result:** Found that `toggleDoor()` is called once at the start of the Space key handler and a second time inside the door detection block.
**Conclusion:** CONFIRMED. The second toggle cancels the first one, leaving the door state unchanged.

## Resolution

**Root Cause:** Redundant action call in `PlayerController.tsx`.
**Fix:** Remove the duplicate `toggleDoor()` call on line 49.
**Verified:** Confirmed on live site. Spacebar now toggles door state reliably.
![Door Opened Verification](/Users/nickcuskey/.gemini/antigravity/brain/6d631f17-d8da-4998-ba8b-bee1e62a76c3/door_opened_verification.png)
**Regression Check:** Attacking (Space when not facing door) and Pause (ESC) still work correctly.
