# Research: Phase 2 - The Goblin Horde

## Current State
- **Tick Rate**: 400ms (`useGameLoop.ts`)
- **Movement**: All enemies move 1 tile per tick towards the player (`ai.ts`, `gameStore.ts`)
- **Combat**: Enemies deal 5 damage (30% chance) if near the player.
- **Stats**: Baseline "imp" has 100 HP.

## Proposed Goblin Stats
| Metric | Imp (Baseline) | Goblin |
|--------|----------------|--------|
| **HP** | 100 | 60 |
| **Speed** | 1 move / 2 ticks (800ms) | 1 move / 1 tick (400ms) |
| **Damage** | 5 | 8 |

## Implementation Strategy

### 1. State Update
Add `moveCooldown` to the `Enemy` interface. 
- `moveCooldown` will be initialized based on the enemy type's `speed` (ticks between moves).
- In each `tickGame`, decrement `moveCooldown`. Only call `moveEnemy` when `moveCooldown <= 0`.

```typescript
export interface Enemy {
    // ...
    moveCooldown: number
}
```

### 2. Spawning Logic
Update `generateDungeon.ts` to randomly choose between 'imp' and 'goblin'.
- Distribution: 60% Imps, 40% Goblins.

### 3. AI Loop (`tickGame`)
Modify the `map` inside `tickGame` to handle cooldowns.

```typescript
const newEnemies = state.enemies.map(enemy => {
    let newPos = { x: enemy.x, y: enemy.y };
    let newCooldown = enemy.moveCooldown - 1;

    if (newCooldown <= 0) {
        occupiedSet.delete(`${enemy.x},${enemy.y}`);
        newPos = moveEnemy(enemy, state.playerPosition, state.map, occupiedSet);
        occupiedSet.add(`${newPos.x},${newPos.y}`);
        newCooldown = (enemy.type === 'goblin') ? 1 : 2; // Speed setting
    }

    return { ...enemy, ...newPos, moveCooldown: newCooldown };
});
```

## Feedback/Questions
- Should Goblins have a different detection range? (Current AI always pursues)
- Should Goblins move even faster? (e.g. 2 cells per 400ms? Might be jittery).
