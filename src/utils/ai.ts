import { Enemy } from '../types/game'

// Manhattan distance
const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export function moveEnemy(
    enemy: Enemy,
    playerPos: { x: number; y: number },
    map: number[][],
    occupiedPositions: Set<string> // "x,y" strings
): { x: number; y: number } {
    const { x, y } = enemy

    // Simple approach: try all 4 directions, pick the one that minimizes distance to player
    // AND is walkable (0)
    // AND is not occupied by another enemy (simplistic collision)

    const candidates = [
        { x: x, y: y - 1 }, // N
        { x: x + 1, y: y }, // E
        { x: x, y: y + 1 }, // S
        { x: x - 1, y: y }, // W
    ]

    // Sort candidates by distance to player
    candidates.sort((a, b) => distance(a.x, a.y, playerPos.x, playerPos.y) - distance(b.x, b.y, playerPos.x, playerPos.y))

    for (const cand of candidates) {
        // 1. Is it the player's position?
        if (cand.x === playerPos.x && cand.y === playerPos.y) {
            // Can't move onto player (that would be an attack, handled separately or just blocked)
            // For movement logic, just block
            continue
        }

        // 2. Is it walkable?
        if (map[cand.y]?.[cand.x] !== 0) continue

        // 3. Is it occupied by another enemy?
        if (occupiedPositions.has(`${cand.x},${cand.y}`)) continue

        // Found best valid move
        return cand
    }

    // No valid moves? Stay put
    return { x, y }
}
