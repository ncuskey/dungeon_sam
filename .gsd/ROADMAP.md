# ROADMAP.md

> **Current Milestone**: v0.8
> **Goal**: Integrate all unused weapon and monster assets into the game

## Must-Haves
- [ ] Integrate unused weapons (Bow and Arrow, Watcher Sword, club, poison_shield, sword_truth)
- [ ] Integrate unused monsters (The_Watcher, imp)

## Phases

### Phase 1: Weapon Integration
**Status**: ✅ Complete
**Objective**: Register new weapon sprites, define their stats, and add them to the loot tables.

### Phase 2: Monster Integration
**Status**: ⬜ Not Started
**Objective**: Register new monster sprites, define their stats/AI, and add them to the map generator spawn logic.

### Phase 3: Balancing and Polish
**Status**: ⬜ Not Started
**Objective**: Ensure the new items and enemies spawn at appropriate depths and the game remains balanced.

---

## Completed Milestones

### v0.7 (Mechanics, Monsters & Polish) — ✅
- Added Rubble and Watcher enemies alongside specific loot drop tables
- Door mechanics normalized, torch emissions corrected, and mobile tap zones resolved
- Visual shield/sword independent logic overlay
- Level completion via collision bounding generating sequential floors
- Deployed to https://dungeonsam.site

### v0.6 (Interactive Halls & UX) — ✅
- Pause menu accessible via ESC key
- Relocated sound control (Top-Left)
- Interactive doors (Centered & Hinged)
- Platform-adaptive UI
- "No Enemies" debug mode for testing
- Deployed to https://dungeonsam.site

### v0.5 (Goblins & Torches) — ✅
- New Goblin enemy type with specific AI/stats
- Shield item integrated into combat/inventory
- Multi-perspective wall torches (Front, Left, Right)
- Visual update for doors using new "Door Fit.png" asset
- Deployed to https://dungeonsam.site

### v0.4.1 (Repair & Polish) — ✅
- Fixed Minimap exploration state persistence
- Snappier camera & lantern tracking
- Fixed potion buttons + added H/1 hotkeys
- Implemented attack cooldowns (0.5s)
- Deployed to https://dungeonsam.site

### v0.4 (The Lantern & The Blade) — ✅
- Wall-Anchored Torches & Player Lantern
- Procedural Item Spawning & Balancing
- Screen Shake & Hit Flashes
- Auto-revealing Minimap
- Deployed to https://dungeonsam.site

### v0.3 (Illumination & Touch) — ✅
- Dynamic Lighting (Torches, Point Lights)
- Mobile Touch Controls (D-Pad, Actions)
- Deployed to https://dungeonsam.site

### v0.2 (Immersive Update) — ✅
- Inventory System
- First-person Weapon Visuals
- Audio System (Web Audio API)
- Deployed to https://dungeonsam.site

### v0.1 (Core Engine) — ✅
- Core rendering loop
- Grid movement
- Dungeon generation
- Basic combat
- Deployed to https://dungeonsam.site
