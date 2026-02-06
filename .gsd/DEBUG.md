# Debug Session: audio-no-sound

## Symptom
No audio plays during gameplay.

**When:** After pressing Enter to start game and moving around
**Expected:** Footstep sounds on movement, BGM drone, attack sounds
**Actual:** Complete silence

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Audio files missing in public/audio/ | 90% | ✅ CONFIRMED |
| 2 | SoundManager.init() not being called | 5% | N/A |
| 3 | Browser blocking audio autoplay | 5% | N/A |

## Attempts

### Attempt 1
**Testing:** H1 — Audio files missing
**Action:** Checked public/audio/sfx/ and public/audio/music/ directories
**Result:** Both directories empty - no audio files exist
**Conclusion:** CONFIRMED - root cause identified

## Resolution

**Root Cause:** Audio directories were empty. SoundManager was trying to load non-existent .mp3 files via Howler.js.

**Fix:** Replaced Howler.js file-based audio with pure Web Audio API procedural sound generation:
- BGM: Layered oscillator drones (55Hz, 82Hz, 110Hz) with LFO modulation
- Footsteps: Low sine wave thumps with pitch variation
- Attacks: Frequency sweeps (sword=high, fist=low)
- Hits: Noise burst with exponential decay
- Enemy sounds: Sawtooth/square wave growls and screams
- Pickup: Ascending sine chime

**Files Changed:**
- `src/audio/SoundManager.ts` - Complete rewrite using Web Audio API

**Verified:** TypeScript compiles successfully
**Regression Check:** Pending browser test
