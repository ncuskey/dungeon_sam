# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v0.1 (MVP)

## Must-Haves (from SPEC)
- [ ] Grid-based movement controller
- [ ] Procedural map generation algorithm
- [ ] Doom-style billboard rendering shader/component
- [ ] Basic enemy AI and combat
- [ ] functioning Exit/Win state

## Phases

### Phase 1: The Engine & GRID
**Status**: ✅ Complete
**Objective**: Build the core rendering loop and grid movement system.
**Deliverables**:
- React Three Fiber scene setup
- Grid movement controller (WASD/Arrows) with smooth transitions
- Basic level rendering (walls, floor, ceiling) from a static map array
- "Billboard" sprite component for objects

### Phase 2: The Architect (Procedural Gen)
**Status**: ⬜ Not Started
**Objective**: Implement the dungeon generation system.
**Deliverables**:
- BSP or Random Walk dungeon generation algorithm
- Map to 3D world conversion
- Placement logic for player start and exit
- Minimap visualization (optional but helpful for debug)

### Phase 3: The Threat (Combat & Sprites)
**Status**: ⬜ Not Started
**Objective**: Add enemies and combat mechanics.
**Deliverables**:
- Enemy billboard sprites with simple animations (idle, walk, attack)
- Basic state machine AI (chase player, attack when in range)
- Player combat (attack action, health system)
- HUD (Health, weapon)

### Phase 4: The Game Loop (Polish & Assets)
**Status**: ⬜ Not Started
**Objective**: tie it all together into a playable level.
**Deliverables**:
- Start Screen & Game Over Screen
- Texture generation/application for "90s vibe"
- Sound effects (generated or placeholder)
- Win condition logic
