# Development Journal

## 2026-02-01 Session: Phase 3 Execution
**Goal**: Implement Enemy AI, Combat, and HUD.

**Accomplishments**:
- **Enemy System**: Defined `Enemy` interface, state, and billboard rendering in `EnemyRenderer.tsx`.
- **AI Movement**: Created `tickGame` loop in `gameStore.ts` and `moveEnemy` logic in `ai.ts` for A* grid movement towards player.
- **Combat**: Implemented Player Attack (Space/F) and Enemy Attack (Adjacency). Added `playerHealth` and death logic (Enemies disappear, Game Over log).
- **HUD**: Created retro-style HUD to display Health and Weapon.
- **Fixes**: Resolved game loop updates, fixed HUD z-index/overflow issues.

**State**: Phase 3 Complete. Ready for Phase 4 (Visual Polish).

## Session: 2026-02-02 06:48 (Pausing)

### Objective
Finalize Milestone v0.2 (Audio) and Deploy "Dungeon Sam"

### Accomplished
- **Audio System Rebuilt**:
  - Replaced Howler.js with Web Audio API procedural synthesis (pure code, no MP3s)
  - Fixed "static" sound by low-passing sawtooth oscillators
  - Tuned ominous BGM (sub-bass + tritone drones)
- **Rebranding**: Changed project name to "Dungeon Sam"
- **Live Deployment**:
  - Server: 165.227.241.60 (DigitalOcean)
  - Domain: https://dungeonsam.site (SSL verified)
  - Pipeline: `deploy.sh` script (rsync based)
- **UX Polish**:
  - Q key to switch weapons
  - Top-right sound toggle
  - Updated start screen instructions

### Verification
- [x] Audio plays correctly in browser (BGM, SFX)
- [x] Deployment successful (200 OK)
- [x] HTTPS certificate active
- [x] Weapon switching and UI functional

### Paused Because
Milestone v0.2 complete and deployed. Resuming for Milestone v0.3 (Lighting).

### Handoff Notes
- **Server Access**: `ssh -i ssh root@165.227.241.60`
- **Deployment**: Run `./deploy.sh` to update live site
- **Codebase State**: Stable, no known bugs.
- **Next Focus**: Dynamic lighting system is the main goal for v0.3.

---

## Session: 2026-02-18 v0.5 "Goblins & Torches" - MISSION ACCOMPLISHED

### Achievements
- **Variety**: Added the Goblin enemy type, diversifying the dungeon crawler experience from just Imps.
- **Defense**: Implemented a passive Shield system, adding a layer of loot-based progression and tactical survival.
- **Immersion**: Wall torches now feel "anchored" with 3-way perspective rendering. Passable doors add a layer of environmental exploration previously missing.
- **Polish**: Added error sound feedback for full inventory and performed a thorough `console.log` sweep.

### Technical Victories
- **Perspective Selection**: Used 3D dot product logic to dynamically switch billboard textures based on camera angle—a lightweight yet effective retro technique.
- **Procedural Integration**: Successfully integrated doors into the existing BSP dungeon generator with minimal disruption.
- **State Hygiene**: Maintained a clean `zustand` store with optimized updates and clear typed interfaces.

### Next Directions
- Looking towards **v0.6: Keys & Gates**. The infrastructure for doors is now ready for logical locking mechanics.
- Considering **Level 2** with different floor/wall textures using the established `textureGenerator` patterns.

*GSD Methodology applied successfully. Context remained stable across all 5 phases.*
