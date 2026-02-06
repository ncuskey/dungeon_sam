# Milestone v0.4: The Lantern & The Blade

## Completed: February 5, 2026

## Overview
This milestone transformed the dungeon crawler from a basic combat game into an atmospheric exploration experience with dynamic lighting, immersive feedback, and quality-of-life improvements.

## Deliverables

### Must-Haves ✅
- ✅ **Dynamic Lighting System**: Wall-anchored torches + player-attached lantern
- ✅ **Combat Arsenal**: Weapon system with fists and sword (different damage values)
- ✅ **Item System**: Procedural potion spawning with healing mechanics
- ✅ **Visual Feedback**: Screen shake and hit flashes for combat impact
- ✅ **Minimap with Fog-of-War**: Auto-revealing exploration map
- ✅ **Mobile Support**: Touch controls for iPad/mobile devices

### Bonus Features ✅
- ✅ Healing hotkeys (H/1)
- ✅ Attack cooldown system (500ms)
- ✅ Enemy AI improvements (diagonal attacks, sticky behavior)
- ✅ Potion spawn balancing (2% rate, 2 per room cap)

## Phases Completed

### Phase 1: Radiance (Lighting)
**Completed**: February 2, 2026  
- Implemented wall-anchored torch placement algorithm
- Added visual torch markers in `LevelRenderer`
- Created player-attached point light in `CameraRig`
- Tuned global ambient lighting for atmosphere

### Phase 2: Arsenal (Combat & Items)
**Completed**: February 2, 2026  
- Adjusted weapon damage (Sword: 30, Fists: 10)
- Implemented potion healing logic (+50 HP)
- Balanced potion spawn frequency

### Phase 3: Impact (Feedback)
**Completed**: February 2, 2026  
- Added hit flash effects (red tint on damage)
- Integrated sound effects for healing and combat
- Implemented screen shake on player damage

### Phase 4: Cartography (Minimap)
**Completed**: February 2, 2026  
- Implemented fog-of-war exploration state
- Created `Minimap` UI component with canvas rendering
- Added real-time reveal logic on movement
- Fixed minimap stretching/zoom issues

### Phase 5: v0.4.1 Maintenance
**Completed**: February 5, 2026  
- **Lantern Tracking**: Fixed via manual position sync in `useFrame`
- **Minimap Reveal**: Merged movement/reveal logic for atomicity
- **Weapon Animation**: Hardened reset logic with `useRef` timeout management
- **Potion Balance**: Reduced spawn rate and implemented room cap
- **Enemy AI**: Fixed diagonal damage detection and "dancing" behavior
- **Attack Cooldown**: Implemented 500ms cooldown system
- **Healing Hotkeys**: Added H/1 keyboard shortcuts

## Metrics

- **Total Commits**: 29
- **Files Changed**: 12,069 (mostly node_modules)
- **Source Files Modified**: ~25 core game files
- **Duration**: ~3 days (Feb 2-5, 2026)
- **Deployment**: https://dungeonsam.site

## Technical Highlights

### Lantern Tracking Solution
After 4 failed attempts with `camera.add()` and imperative light creation, the solution was **manual position synchronization**:

```typescript
useFrame((state, delta) => {
    if (lightRef.current) {
        lightRef.current.position.copy(state.camera.position)
    }
})
```

**Key Insight**: R3F's declarative scene graph fights imperative parenting operations. Manual position copying works where `camera.add()` failed.

### Atomic State Updates
Merged movement and map reveal logic to prevent race conditions:

```typescript
moveForward: () => set((state) => {
    // ... movement logic ...
    const newExplored = [...state.exploredMap]
    // ... reveal logic ...
    return { 
        playerPosition: { x: newX, y: newY },
        exploredMap: newExplored  // Single atomic update
    }
})
```

### Robust Animation State
Used `useRef` for timeout management to prevent stuck animations:

```typescript
useEffect(() => {
    if (lastAttackTime > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsAttacking(true)
        timeoutRef.current = setTimeout(() => {
            setIsAttacking(false)
        }, 300)
    }
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
}, [lastAttackTime])
```

## Lessons Learned

### 1. R3F Scene Graph Ownership
When R3F creates objects from JSX, it maintains ownership. Manual scene graph manipulation can be overridden by the reconciler. **Solution**: Use manual position/rotation copying instead of parenting for tracking behavior.

### 2. State Atomicity Matters
Separate state updates for related changes (movement + reveal) can cause race conditions. **Solution**: Merge related updates into single `set()` calls.

### 3. Deep Copy Vigilance
Shallow copying nested arrays (`[...state.exploredMap]`) doesn't copy inner arrays. **Solution**: Explicitly spread nested structures or use deep copy utilities.

### 4. Backward Movement Testing
Forward-only testing masked the stationary lantern bug. **Solution**: Always test movement in all directions when debugging position tracking.

### 5. Debug Logging Strategy
Random sampling (`if (Math.random() < 0.01)`) prevents console spam while still providing visibility into frame-by-frame updates.

## Known Issues
None - all v0.4.1 maintenance issues resolved.

## Next Steps
- Consider v0.5 milestone for additional features
- Potential areas: procedural level variation, enemy types, boss encounters, progression system

---

**Tag**: `v0.4`  
**Deployed**: https://dungeonsam.site
