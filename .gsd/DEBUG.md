# Debug Session: Persistent Lantern Tracking (v0.4.1) - RESOLVED

## Symptom
Lantern light remained stationary at the player's spawn position. Moving away from spawn left the player in complete darkness.

**When:** Immediately upon moving from spawn position  
**Expected:** Light should follow the player/camera  
**Actual:** Light stayed at world coordinates of spawn position

## Attempts

### Attempt 1: Manual `camera.add()` in `useFrame`
**Hypothesis:** Light needs to be explicitly parented to camera every frame  
**Action:** Added `if (lightRef.current.parent !== state.camera) { state.camera.add(lightRef.current) }` check in `useFrame`  
**Result:** Console showed "parented" once, but light remained stationary  
**Conclusion:** ELIMINATED - R3F's declarative reconciler was overriding manual parenting

### Attempt 2: Imperative Light Creation in `useEffect`
**Hypothesis:** JSX-defined lights are managed by R3F's scene graph, preventing manual control  
**Action:** Created light with `new THREE.PointLight()` in `useEffect`, attached with `camera.add()`, returned `null` from component  
**Result:** Console showed "Lantern created and attached to camera" but light was invisible/not following  
**Conclusion:** ELIMINATED - Light either not rendering or camera.add() failing silently

### Attempt 3: Remove Static Spawn Light
**Hypothesis:** Static spawn light from `generateLights()` was masking the camera-attached lantern  
**Action:** Removed the guaranteed spawn light from `generateLights()` function  
**Result:** No light visible at all - confirmed camera-attached light wasn't working  
**Conclusion:** ELIMINATED - Revealed that camera attachment was completely failing

### Attempt 4: Manual Position Sync Every Frame
**Hypothesis:** Instead of fighting R3F's scene graph with parenting, manually copy camera position to light  
**Action:** 
```typescript
useFrame((state, delta) => {
    // ... camera movement ...
    if (lightRef.current) {
        lightRef.current.position.copy(state.camera.position)
    }
})

return <pointLight ref={lightRef} ... />
```
**Result:** ✅ **SUCCESS** - Light now follows player perfectly  
**Conclusion:** CONFIRMED - Manual position sync works where parenting failed

## Resolution

**Root Cause:** React Three Fiber's declarative scene graph management conflicts with imperative `camera.add()` operations. The light was either being re-parented to the scene root on each render or the parenting wasn't being respected by the renderer.

**Fix:** 
1. Define the light declaratively as JSX (`<pointLight ref={lightRef} />`)
2. Let R3F manage it in the scene graph normally
3. Manually synchronize its world position to the camera's world position every frame in `useFrame`
4. Removed the static spawn light from `generateLights()` to avoid confusion

**Files Changed:**
- `src/components/CameraRig.tsx`: Added `lightRef.current.position.copy(state.camera.position)` in `useFrame`
- `src/store/gameStore.ts`: Removed static spawn light from `generateLights()` function

**Verified:** 
- Deployed to https://dungeonsam.site
- User confirmed light follows player through entire dungeon
- No stationary light at spawn when moving backward
- Environment remains lit when moving forward

## Key Learnings

1. **R3F Scene Graph Ownership**: When R3F creates objects from JSX, it maintains ownership. Manual scene graph manipulation (like `add()`/`remove()`) can be overridden by the reconciler.

2. **Position vs. Parenting**: For objects that need to track another object's position, manual position copying in `useFrame` is more reliable than parenting when working with R3F-managed objects.

3. **Debug Methodology**: The backward movement test was crucial - it immediately revealed the light was stationary rather than following, which forward-only testing masked.
