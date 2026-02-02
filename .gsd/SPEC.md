# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A browser-based, procedurally generated dungeon crawler inspired by Deathkeep (1995) and Doom. The game combines the tactical, grid-based movement of classic dungeon crawlers with the visceral, billboard-sprite aesthetic of mid-90s FPS games. Players explore infinite, generated dungeons, fighting monsters and finding loot in a retro 3D environment.

## Goals
1.  **Authentic Retro Aesthetic**: Implement a "Doom-style" rendering engine using Three.js/React Three Fiber with billboard sprites for enemies/items and low-fi textures for the environment.
2.  **Procedural Dungeon Generation**: Create a robust system to generate playable, grid-based dungeon layouts with rooms, corridors, doors, and key/lock puzzles.
3.  **Grid-Based Gameplay**: Implement precise grid-based movement and combat mechanics, ensuring tight, responsive controls.
4.  **Playable MVP**: Deliver a complete "single level" loop where the player starts, explores, fights enemies, and finds the exit.

## Non-Goals (Out of Scope)
-   **Multiplayer**: Strictly single-player experience.
-   **Complex Physics**: No realistic physics engine; movement is deterministic and grid-snapped.
-   **High-Fidelity Graphics**: Intentionally avoiding modern lighting, shadows, or high-poly models.
-   **Persistent Save System**: Not required for MVP (roguelike "permadeath" session style).

## Users
-   Fans of retro dungeon crawlers (Eye of the Beholder, Grimrock) and 90s FPS games.
-   Web gamers looking for a quick, immersive session.

## Constraints
-   **Platform**: Web browser (desktop focused).
-   **Tech**: React, Three.js, React Three Fiber.
-   **Assets**: All assets (textures, sprites) must be generated or free-to-use/placeholder for now.

## Success Criteria
-   [ ] Player can move effectively on a grid (forward, backward, strafe, turn).
-   [ ] Dungeon maps are generated distinctively on each reload.
-   [ ] Enemies exist as billboard sprites and can be defeated.
-   [ ] Player can complete a level by reaching an exit.
