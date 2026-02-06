---
phase: 4
plan: 3
---

# Plan 4.3: Impact (Combat Juice & Feedback)

## Objective
Make combat feel impactful and responsive through visual screen shake, hit flashes, and synchronized sound effects.

## Tasks

<task type="auto">
  <name>Audio Expansion</name>
  <files>src/audio/SoundManager.ts</files>
  <action>
    Add `playHeal()` method to `SoundManager` generating a shimmering ascending chord.
  </action>
</task>

<task type="auto">
  <name>Combat State updates</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Add `shake` (number) to `GameState`.
    2. Add `lastHurtTime` to `Enemy` interface.
    3. Update `playerAttack`: 
       - Call `playAttackSound(hasTarget, weaponType)`.
       - If hit, set `shake = 0.5` and update enemy's `lastHurtTime`.
    4. Update `tickGame`:
       - Decay `shake` by `delta` or fixed amount.
       - If player takes damage, set `shake = 1.0`.
    5. Update `useItem`: Call `soundManager.playHeal()`.
  </action>
</task>

<task type="auto">
  <name>Screen Shake Implementation</name>
  <files>src/components/CameraRig.tsx</files>
  <action>
    1. Subscribe to `shake` from the store.
    2. During `useFrame`, calculate a random `intensity = shake * 0.1` and apply it to camera X and Y offsets.
  </action>
</task>

<task type="auto">
  <name>Hit Flash Effect</name>
  <files>src/components/Billboard.tsx, src/components/EnemyRenderer.tsx</files>
  <action>
    1. Update `Billboard` to accept `lastHurtTime`.
    2. If `performance.now() - lastHurtTime < 150`, set `meshStandardMaterial` color to `red`.
  </action>
</task>

## Success Criteria
- [ ] Striking an enemy triggers a hit sound and a subtle screen shake.
- [ ] Enemies flash red briefly when damaged.
- [ ] Taking damage triggers a more violent screen shake.
- [ ] Using a potion plays a unique healing sound.
