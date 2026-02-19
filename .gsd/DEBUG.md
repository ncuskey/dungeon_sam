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

**Root Cause:** Doors were rotating around their center mesh point because no pivot offset was defined.
**Fix:** Introduced a parent `group` at the wall-hinge location and offset the door `mesh` by half its width.
**Verified:** Confirmed on live site. Doors now swing from the wall at a 90-degree angle.
![Hinged Door Verification](/Users/nickcuskey/.gemini/antigravity/brain/6d631f17-d8da-4998-ba8b-bee1e62a76c3/door_open_hinge_verification_1771469304793.png)
**Regression Check:** Collision and interaction logic remain fully functional.

# Debug Session: Door Alignment & Offsets

## Symptom
The open door is offset from the center of the passage and appears aligned with the wall line instead of swinging clearly within the hallway.

**When:** When a door is open and viewed from the passage.
**Expected:** The door should be centered in the passage when closed, and swing to a flush position against the wall when open.
**Actual:** The door is offset parallel to the wall, submerged halfway in some cases, or sticking out incorrectly.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Incorrect local offset axis calculation in `LevelRenderer.tsx` | 95% | UNTESTED |
| 2 | Rotation pivot coordinate mismatch | 5% | UNTESTED |

## Resolution

**Root Cause:** Axis swap in `LevelRenderer.tsx` and rotation mapping error. `isEwPassage=true` was correctly detecting passages but applying translations to the wrong axis (X instead of Z) and vice versa.
**Fix:** Refined the coordinate transformation logic to correctly hinge on the wall face (Z offset for EW passages, X offset for NS passages) and use negative local offsets where rotation matrix requires it for centering.
**Verified:** Empirically verified via browser screenshots showing centered closed doors and flush open doors.
**Regression Check:** Door interaction and collision remain intact.
