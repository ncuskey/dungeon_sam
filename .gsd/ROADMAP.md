# ROADMAP.md

> **Current Milestone**: v0.6 "Keys & Gates"
> **Goal**: Implement progression mechanics with locked doors, keys, and level transitions.

## Must-Haves
- [ ] Key items for inventory
- [ ] Locked doors rendering different variant/color
- [ ] Level transition pads (to Level 2)
- [ ] Multi-level BSP generation support

## Phases

### Phase 1: Planning & Infrastructure
**Status**: ⬜ Not Started
**Objective**: Setup multi-level support in `gameStore` and define door-lock logic.

---

## Completed Milestones

### v0.5 (Goblins & Torches) — ✅
- New Goblin enemy type with specific AI/stats
- Shield item integrated into combat/inventory
- Multi-perspective wall torches (Front, Left, Right)
- Visual update for doors using new "Door Fit.png" asset
- Deployed to https://dungeonsam.site


## Completed Milestones

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

### Phase 1: The Spark (Dynamic Lighting)
**Status**: ✅ Complete
**Objective**: Implement the deferred lighting system from v0.2.
**Deliverables**:
- Point light support in `LevelRenderer`
- Torch placement logic algorithms
- Torch billboard sprite + animation
- Hardware shadow maps (if performant)

### Phase 2: The Touch (Mobile Controls)
**Status**: ✅ Complete
**Objective**: Make the game playable on touch devices (iPad focus).
**Deliverables**:
- `TouchControls` component overlay
- Virtual Joystick logic (translating touch to WASD movement)
- Action Buttons (Attack, Use, Swap)
- Prevent default browser gestures (zoom/scroll)

### Phase 3: The Glow (Polish & optimize)
**Status**: ⬜ Not Started
**Objective**: Ensure performance and polish on mobile.
**Deliverables**:
- Particle effects (torch smoke/embers)
- Performance profiling (limit lights if needed on mobile)
- UI scaling adjustments

---

## Completed Milestones

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
