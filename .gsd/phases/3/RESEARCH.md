# Research: Phase 3 - Shield & Defense

## Current State
- **Damage**: 30% chance per tick if an enemy is adjacent.
- **Player Damage Logic**: `tickGame` handles health subtraction.
- **Inventory**: Supports multiple items but only one `equippedWeaponId`.

## Proposed Shield Mechanics

### 1. Equipped Shield
Update the `Inventory` interface to include `equippedShieldId`.

```typescript
export interface Inventory {
    items: Item[]
    maxSize: number
    equippedWeaponId: string | null
    equippedShieldId: string | null // NEW
}
```

### 2. Blocking Damage
Modify the damage logic in `tickGame`.
- **Condition**: If `equippedShieldId` is not null.
- **Effect**: Reduce incoming damage by 50% (rounded down).
- **Feedback**: Play a "block" sound (need to check if one exists or use a variant) and show a "BLOCKED" indicator (optional for now, let's stick to logic).

```typescript
const isShieldEquipped = state.inventory.equippedShieldId !== null;
let damage = hittingEnemies[0].type === 'goblin' ? 8 : 5;
if (isShieldEquipped) {
    damage = Math.floor(damage / 2);
}
```

### 3. HUD Updates
Display the equipped shield in the HUD.
- Update `HUD.tsx` to find the shield in inventory and display its name.

### 4. Item Pickup & Equipment logic
Update `pickupItem` or add an `equipItem` action in `gameStore.ts` to handle shields specifically (they should go to `equippedShieldId` instead of `equippedWeaponId`).

## Feedback/Questions
- Should shields wear out? (Out of scope for v0.5).
- Should blocking be active (e.g. hold a button)? (Out of scope for v0.5, will keep it passive/automatic if equipped).
