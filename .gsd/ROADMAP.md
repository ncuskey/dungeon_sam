# ROADMAP.md

> **Current Milestone**: v0.4 (The Lantern & The Blade)
> **Goal**: Enhance atmospheric lighting, balance combat/items, and add exploration clarity.

## Must-Haves
- [ ] **Wall-Anchored Torches**: Torches placed on walls with better intensity/color.
- [ ] **Player Glow**: A subtle light source that follows the player.
- [ ] **Combat Balancing**: Sword damage > Fists, functional healing potions.
- [ ] **Item Distribution**: More frequent potion spawns.
- [ ] **Combat Feedback**: Visual hit effects (shakes/flashes/particles).
- [ ] **Exploration Minimap**: A map that reveals as the player visits cells.

## Phases

### Phase 1: Radiance (Lighting & Atmosphere)
**Status**: ⬜ Not Started
**Objective**: Fix the "too dark" issue. Implement wall-anchored torches and a mobile player light.

### Phase 2: Arsenal (Combat & Items)
**Status**: ⬜ Not Started
**Objective**: Scale damage values and implement potion healing logic + procedural spawning.

### Phase 3: Impact (Feedback & Juice)
**Status**: ⬜ Not Started
**Objective**: Add visual and auditory feedback for combat (screen shake, damage numbers, or flashes).

### Phase 4: Cartography (Minimap)
**Status**: ⬜ Not Started
**Objective**: Build a minimap UI that starts dark and reveals visited grid cells.

## Completed Milestones

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
