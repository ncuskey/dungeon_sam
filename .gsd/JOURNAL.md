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
