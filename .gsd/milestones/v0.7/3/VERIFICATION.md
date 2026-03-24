## Phase 3 Verification

### Must-Haves
- [x] Add Rubble monster — VERIFIED (evidence: Subtype introduced to `/src/types` and random selection injected into `spawnEnemy`)
- [x] Add Watcher sword (drops only from Watchers) — VERIFIED (evidence: `playerAttack` generates weapon exclusively during `watcher` destruction events)
- [x] Create and add Poison shield — VERIFIED (evidence: AI asset created, saved to `/public`, and bound to conditional `itemName.includes('Poison')` in `ItemRenderer`)
- [x] Other sword and shield drop from all monsters — VERIFIED (evidence: Imp and Goblin variants spawn basic items through generic drop condition)

### Verdict: PASS
