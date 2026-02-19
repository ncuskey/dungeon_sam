---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Shield & Defense

## Objective
Implement shield equipment logic and passive damage reduction. Update the HUD to reflect the status of the equipped shield.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/3/RESEARCH.md
- src/types/game.ts
- src/store/gameStore.ts
- src/components/HUD.tsx

## Tasks

<task type="auto">
  <name>Extend Inventory and Pickup Logic</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/types/game.ts
    /Users/nickcuskey/Sam's Game/src/store/gameStore.ts
  </files>
  <action>
    - Add `equippedShieldId: string | null` to the `Inventory` interface in `game.ts`.
    - Update `initialState` in `gameStore.ts` to include `equippedShieldId: null`.
    - Modify `pickupItem` in `gameStore.ts` to automatically equip the shield if the item type is 'shield'.
  </action>
  <verify>Check state transitions when picking up a shield.</verify>
  <done>Picking up a shield correctly updates the `equippedShieldId` in state.</done>
</task>

<task type="auto">
  <name>Implement Damage Reduction and HUD</name>
  <files>
    /Users/nickcuskey/Sam's Game/src/store/gameStore.ts
    /Users/nickcuskey/Sam's Game/src/components/HUD.tsx
  </files>
  <action>
    - Update `tickGame` in `gameStore.ts` to check if a shield is equipped and reduce incoming damage by 50%.
    - Update `HUD.tsx` to display the name of the equipped shield next to the weapon.
  </action>
  <verify>Test damage taken with and without an equipped shield.</verify>
  <done>Player takes half damage when a shield is equipped, and the HUD displays the shield's name.</done>
</task>

## Success Criteria
- [ ] Shield can be picked up and is automatically equipped.
- [ ] Damage from enemies is reduced by 50% when shield is equipped.
- [ ] HUD displays "SHIELD: [Name]" when a shield is held.
