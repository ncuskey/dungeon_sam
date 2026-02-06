---
phase: 4
plan: 2
---

# Plan 4.2: Arsenal (Combat & Items)

## Objective
Balance combat by increasing sword damage, implementing functional healing, and scattering items throughout the dungeon.

## Tasks

<task type="auto">
  <name>Item Spawning Logic</name>
  <files>src/utils/dungeonGenerator.ts</files>
  <action>
    Modify `generateDungeon` to:
    1. Spawn exactly 1 "Sword of Truth" in a random room (not the start room).
    2. Spawn "Health Potions" with a 20% chance in every floor cell of every room.
    3. Return `initialItems` in the result.
  </action>
</task>

<task type="auto">
  <name>Integrate Generated Items</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Update `resetGame` to use `initialItems` from the generator.
    2. Remove the hardcoded `dummyItems`.
    3. Update the initial state `items` to also use a fresh dungeon generation's items if possible (or just wait for reset, but usually we want them on first load too).
    Actually, I'll update the module-level generation to include items.
  </action>
</task>

<task type="auto">
  <name>Balance Weapon Damage</name>
  <files>src/store/gameStore.ts</files>
  <action>
    1. Ensure the spawned Sword has `effectValue: 50`.
    2. Keep Fists at `25`.
  </action>
</task>

<task type="auto">
  <name>Heal Button (Mobile)</name>
  <files>src/components/TouchControls.tsx</files>
  <action>
    1. Add a new button to the Action cluster (right side).
    2. Icon: 🧪 (Heal).
    3. Action: Find first potion in inventory and call `useItem(potion.id)`.
  </action>
</task>

## Success Criteria
- Sword kills imps faster than fists.
- Potions are found in many rooms.
- Tapping the 🧪 button on mobile heals the player.
