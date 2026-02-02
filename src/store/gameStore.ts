import { create } from 'zustand'

export const CELL_SIZE = 2 // World units per grid cell

type Direction = 0 | 1 | 2 | 3 // North, East, South, West

interface GameState {
    playerPosition: { x: number; y: number }
    playerDirection: Direction
    map: number[][]

    moveForward: () => void
    moveBackward: () => void
    turnLeft: () => void
    turnRight: () => void
}

// Simple 5x5 room for MVP
const INITIAL_MAP = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
]

export const useGameStore = create<GameState>((set) => ({
    playerPosition: { x: 2, y: 3 }, // Start near bottom
    playerDirection: 0, // Facing North
    map: INITIAL_MAP,

    moveForward: () => set((state) => {
        const { x, y } = state.playerPosition
        let newX = x
        let newY = y

        switch (state.playerDirection) {
            case 0: newY -= 1; break // North
            case 1: newX += 1; break // East
            case 2: newY += 1; break // South
            case 3: newX -= 1; break // West
        }

        if (state.map[newY]?.[newX] === 0) {
            return { playerPosition: { x: newX, y: newY } }
        }
        return {}
    }),

    moveBackward: () => set((state) => {
        const { x, y } = state.playerPosition
        let newX = x
        let newY = y

        switch (state.playerDirection) {
            case 0: newY += 1; break // Back from North -> South
            case 1: newX -= 1; break
            case 2: newY -= 1; break
            case 3: newX += 1; break
        }

        if (state.map[newY]?.[newX] === 0) {
            return { playerPosition: { x: newX, y: newY } }
        }
        return {}
    }),

    turnLeft: () => set((state) => ({
        playerDirection: (state.playerDirection - 1 + 4) % 4 as Direction
    })),

    turnRight: () => set((state) => ({
        playerDirection: (state.playerDirection + 1) % 4 as Direction
    })),
}))
