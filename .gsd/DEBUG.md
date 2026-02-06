# Debug Session: Persistent Lantern Tracking (v0.4.1) - RESOLVED

## Root Cause

**React Three Fiber's Declarative Scene Graph Conflict**

The lantern was defined as JSX (`<pointLight>`) in `CameraRig.tsx`, which meant R3F was managing it in the declarative scene graph. When we tried to manually parent it to the camera using `camera.add(lightRef.current)` in `useFrame`, R3F was fighting our imperative manipulation - either re-adding the light to the scene root on each render or not respecting the parent change.

The console showed "Lantern parented to camera" only **once**, confirming the condition `lightRef.current.parent !== state.camera` became true and stayed true, but the light still didn't follow because R3F's reconciler was overriding our manual scene graph changes.

## Solution

**Imperative Light Creation Outside R3F's Declarative System**

Completely rewrote `CameraRig.tsx` to:
1. Create the `PointLight` imperatively using `new THREE.PointLight()` in a `useEffect` hook
2. Attach it directly to the camera object using `camera.add(lantern)`
3. Return `null` from the component (no JSX) so R3F doesn't try to manage the light
4. Clean up properly in the effect's cleanup function

This approach bypasses R3F's declarative scene graph entirely for the lantern, giving us full control over its lifecycle and parenting.

## Verification

- Deployed to https://dungeonsam.site
- Tested movement of 35+ tiles from spawn
- Environment remains consistently lit
- Console confirms "Lantern created and attached to camera"
- Screenshots show identical lighting at spawn vs. far positions

## Files Changed

- `src/components/CameraRig.tsx`: Complete rewrite to use imperative light creation
- `src/store/gameStore.ts`: Merged movement/reveal logic (separate fix)
- `src/utils/dungeonGenerator.ts`: Fixed potion cap (separate fix)
