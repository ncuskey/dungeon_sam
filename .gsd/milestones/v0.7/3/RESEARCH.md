# Phase 3 Research Findings

## 1. New Monsters (Rubble & Watcher)
### `types/game.ts` & `EnemyRenderer.tsx`
- **Current Logic:** The `Enemy` interface hardcodes type as `'imp' | 'goblin'`. `EnemyRenderer` has a messy fallback mapping `/The_Watcher.png` as the default for any unknown type.
- **Fix:** Expand `Enemy['type']` to include `'watcher' | 'rubble'`. Clean up `getEnemyTexture()` to explicitly map `'rubble'` to `'/rubble.png'`, `'watcher'` to `'/The_Watcher.png'`, and fallback to `'/imp.png'`.

### `gameStore.ts`
- **Current Logic:** `spawnEnemy` only spans `imp` or `goblin`.
- **Fix:** Update `spawnEnemy` to pick from `['imp', 'goblin', 'rubble', 'watcher']`. Assign appropriate HP (`watcher`=200, `rubble`=150) and `moveCooldown`.

## 2. Loot Drops & Poison Shield
### `gameStore.ts` (playerAttack)
- **Current Logic:** Enemies simply get filtered out of the array when they die.
- **Fix:** Inside `playerAttack`, if `newHp <= 0`, push a new item object into `state.items` at `enemy.x`, `enemy.y`. 
  - Watchers drop either `Watcher Sword` (value 50) or `Poison Shield` (value 30).
  - All other monsters drop either `Sword of Truth` (value 25) or `Iron Shield` (value 10).

### `ItemRenderer.tsx`
- **Current Logic:** `getItemTexture` checks `itemName?.includes('Shield')` and returns fixed `'/shield.png'`.
- **Fix:** If `itemName` includes `"Poison"`, return `'/poison_shield.png'` (which has been generated and placed in `public/`). Other shields return `'/shield.png'`.
