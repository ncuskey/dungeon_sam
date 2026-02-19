import { create } from 'zustand'
import { generateDungeon } from '../utils/dungeonGenerator'
import { moveEnemy } from '../utils/ai'
import { playAttackSound } from '../audio/audioIntegration'
import { soundManager } from '../audio/SoundManager'

import { Enemy, Item, Inventory, Light } from '../types/game'
import { v4 as uuidv4 } from 'uuid'

export const CELL_SIZE = 2 // World units per grid cell

type Direction = 0 | 1 | 2 | 3 // North, East, South, West
export type GamePhase = 'MENU' | 'PLAYING' | 'WON' | 'GAME_OVER'

interface GameState {
    phase: GamePhase
    playerPosition: { x: number; y: number }
    playerDirection: Direction
    map: number[][]
    exitPosition: { x: number; y: number }
    enemies: Enemy[]
    lights: Light[]

    moveForward: () => void
    moveBackward: () => void
    turnLeft: () => void
    turnRight: () => void
    spawnEnemy: (x: number, y: number) => void
    tickGame: () => void
    playerHealth: number
    shake: number
    lastAttackTime: number // For cooldown
    exploredMap: boolean[][] // For minimap fog-of-war
    playerAttack: () => void

    // Exploration
    revealMap: (x: number, y: number) => void

    // Inventory
    items: Item[] // Items on ground
    inventory: Inventory
    pickupItem: () => void
    equipWeapon: (itemId: string) => void
    useItem: (itemId: string) => void

    startGame: () => void
    resetGame: () => void
}

const { map: initialMap, startPosition, exitPosition, initialEnemies, initialItems: initialSpawnedItems } = generateDungeon()

const enemies: Enemy[] = initialEnemies

const initialLights = generateLights(initialMap, startPosition)

const initialItemsWithShield = [
    ...initialSpawnedItems,
    {
        id: uuidv4(),
        x: startPosition.x,
        y: startPosition.y,
        type: 'shield' as const,
        name: 'Iron Shield',
        effectValue: 10
    }
]

export const useGameStore = create<GameState>((set, get) => ({
    phase: 'MENU',
    playerPosition: startPosition,
    playerDirection: 1, // Facing East
    map: initialMap,
    exitPosition,
    enemies,
    lights: initialLights,
    playerHealth: 100,
    shake: 0,
    lastAttackTime: 0,
    exploredMap: Array(initialMap.length).fill(null).map(() => Array(initialMap[0].length).fill(false)),

    revealMap: (px, py) => set((state) => {
        const yCoord = Math.floor(py)
        const xCoord = Math.floor(px)

        // console.log(`Reveal request at: ${xCoord}, ${yCoord}`)

        const newExplored = [...state.exploredMap]
        let changed = false

        // Reveal 3x3
        for (let y = yCoord - 1; y <= yCoord + 1; y++) {
            if (!newExplored[y]) continue
            for (let x = xCoord - 1; x <= xCoord + 1; x++) {
                if (newExplored[y][x] === false) {
                    if (newExplored[y] === state.exploredMap[y]) {
                        newExplored[y] = [...state.exploredMap[y]]
                    }
                    newExplored[y][x] = true
                    changed = true
                }
            }
        }

        if (changed) {
            // console.log(`Map updated`)
        }

        return changed ? { exploredMap: newExplored } : {}
    }),

    items: initialItemsWithShield,
    inventory: { items: [], maxSize: 5, equippedWeaponId: null, equippedShieldId: null },

    pickupItem: () => set((state) => {
        const { x, y } = state.playerPosition
        const itemIndex = state.items.findIndex(i => i.x === x && i.y === y)

        if (itemIndex > -1) {
            const item = state.items[itemIndex]
            if (state.inventory.items.length < state.inventory.maxSize) {
                const newItems = [...state.items]
                newItems.splice(itemIndex, 1)

                const newInvItems = [...state.inventory.items, { ...item, x: -1, y: -1 }] // Remove pos

                // Auto equip if it's the first weapon
                let newEquippedWeaponId = state.inventory.equippedWeaponId
                if (item.type === 'weapon' && !newEquippedWeaponId) {
                    newEquippedWeaponId = item.id
                }

                // Auto equip if it's the first shield
                let newEquippedShieldId = state.inventory.equippedShieldId
                if (item.type === 'shield' && !newEquippedShieldId) {
                    newEquippedShieldId = item.id
                }

                console.log("Picked up", item.name)
                return {
                    items: newItems,
                    inventory: {
                        ...state.inventory,
                        items: newInvItems,
                        equippedWeaponId: newEquippedWeaponId,
                        equippedShieldId: newEquippedShieldId
                    }
                }
            } else {
                console.log("Inventory full")
            }
        }
        return {}
    }),

    equipWeapon: (itemId) => set((state) => ({
        inventory: { ...state.inventory, equippedWeaponId: itemId }
    })),

    useItem: (itemId) => set((state) => {
        const itemIndex = state.inventory.items.findIndex(i => i.id === itemId)
        if (itemIndex > -1) {
            const item = state.inventory.items[itemIndex]
            if (item.type === 'potion') {
                const newHealth = Math.min(100, state.playerHealth + (item.effectValue || 25))
                const newInvItems = [...state.inventory.items]
                newInvItems.splice(itemIndex, 1)
                console.log("Used potion, health:", newHealth)
                soundManager.playHeal()
                return {
                    playerHealth: newHealth,
                    inventory: { ...state.inventory, items: newInvItems }
                }
            }
        }
        return {}
    }),

    startGame: () => {
        const state = get()
        state.revealMap(state.playerPosition.x, state.playerPosition.y)
        set({ phase: 'PLAYING' })
    },

    resetGame: () => {
        const { map, startPosition, exitPosition, initialEnemies, initialItems } = generateDungeon()

        set({
            phase: 'PLAYING',
            map,
            playerPosition: startPosition,
            exitPosition,
            enemies: initialEnemies,
            items: initialItems,
            inventory: { items: [], maxSize: 5, equippedWeaponId: null, equippedShieldId: null },
            playerHealth: 100,
            playerDirection: 1,
            lights: generateLights(map, startPosition),
            exploredMap: Array(map.length).fill(null).map(() => Array(map[0].length).fill(false))
        })
        get().revealMap(startPosition.x, startPosition.y)
    },

    moveForward: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}

        const { x, y } = state.playerPosition
        const dir = state.playerDirection
        let newX = x, newY = y

        if (dir === 0) newY -= 1
        else if (dir === 1) newX += 1
        else if (dir === 2) newY += 1
        else newX -= 1

        if (state.map[newY]?.[newX] === 0 || state.map[newY]?.[newX] === 2) {
            // Merged reveal logic with deep copy fix
            const newExplored = [...state.exploredMap]
            for (let ry = newY - 1; ry <= newY + 1; ry++) {
                if (!newExplored[ry]) continue
                for (let rx = newX - 1; rx <= newX + 1; rx++) {
                    if (newExplored[ry][rx] === false) {
                        if (newExplored[ry] === state.exploredMap[ry]) {
                            newExplored[ry] = [...state.exploredMap[ry]]
                        }
                        newExplored[ry][rx] = true
                    }
                }
            }
            return {
                playerPosition: { x: newX, y: newY },
                exploredMap: newExplored
            }
        }
        return {}
    }),

    moveBackward: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}

        const { x, y } = state.playerPosition
        const dir = state.playerDirection
        let newX = x, newY = y

        if (dir === 0) newY += 1
        else if (dir === 1) newX -= 1
        else if (dir === 2) newY -= 1
        else newX += 1

        if (state.map[newY]?.[newX] === 0 || state.map[newY]?.[newX] === 2) {
            // Merged reveal logic with deep copy fix
            const newExplored = [...state.exploredMap]
            for (let ry = newY - 1; ry <= newY + 1; ry++) {
                if (!newExplored[ry]) continue
                for (let rx = newX - 1; rx <= newX + 1; rx++) {
                    if (newExplored[ry][rx] === false) {
                        if (newExplored[ry] === state.exploredMap[ry]) {
                            newExplored[ry] = [...state.exploredMap[ry]]
                        }
                        newExplored[ry][rx] = true
                    }
                }
            }
            return {
                playerPosition: { x: newX, y: newY },
                exploredMap: newExplored
            }
        }
        return {}
    }),

    turnLeft: () => set((state) => ({
        playerDirection: (state.playerDirection + 3) % 4 as Direction
    })),

    turnRight: () => set((state) => ({
        playerDirection: (state.playerDirection + 1) % 4 as Direction
    })),

    playerAttack: () => set((state) => {
        const now = performance.now()
        const diff = now - state.lastAttackTime
        if (diff < 500) { // Reverted to 0.5s
            return {}
        }

        const { x, y } = state.playerPosition
        let targetX = x
        let targetY = y

        switch (state.playerDirection) {
            case 0: targetY -= 1; break
            case 1: targetX += 1; break
            case 2: targetY += 1; break
            case 3: targetX -= 1; break
        }

        const enemy = state.enemies.find(e => e.x === targetX && e.y === targetY)
        const equippedWeapon = state.inventory.items.find(i => i.id === state.inventory.equippedWeaponId)
        const weaponType = (equippedWeapon?.name === 'Sword of Truth') ? 'sword' : 'fist'

        playAttackSound(!!enemy, weaponType)

        if (enemy) {
            const damage = equippedWeapon?.effectValue || 25
            const newEnemies = state.enemies.map(e => {
                if (e.id === enemy.id) {
                    const newHp = e.hp - damage
                    return { ...e, hp: newHp, lastHurtTime: performance.now() }
                }
                return e
            }).filter(e => e.hp > 0)
            return { enemies: newEnemies, shake: 0.5, lastAttackTime: now }
        } else {
            return { shake: 0.1, lastAttackTime: now }
        }
    }),

    spawnEnemy: (x, y) => set((state) => {
        const type = Math.random() > 0.4 ? 'imp' : 'goblin'
        return {
            enemies: [...state.enemies, {
                id: uuidv4(),
                x,
                y,
                type: type as 'imp' | 'goblin',
                hp: type === 'goblin' ? 60 : 100,
                moveCooldown: type === 'goblin' ? 1 : 2
            }]
        }
    }),

    tickGame: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}

        const occupiedSet = new Set<string>()
        state.enemies.forEach(e => occupiedSet.add(`${e.x},${e.y}`))

        const newEnemies = state.enemies.map(enemy => {
            let newPos = { x: enemy.x, y: enemy.y }
            let newCooldown = enemy.moveCooldown - 1

            if (newCooldown <= 0) {
                occupiedSet.delete(`${enemy.x},${enemy.y}`)
                newPos = moveEnemy(enemy, state.playerPosition, state.map, occupiedSet)
                occupiedSet.add(`${newPos.x},${newPos.y}`)
                newCooldown = (enemy.type === 'goblin') ? 1 : 2
            }

            return { ...enemy, ...newPos, moveCooldown: newCooldown }
        })

        let playerHealth = state.playerHealth
        let newShake = Math.max(0, state.shake - 0.1)

        // Check for damage based on NEW positions
        const hittingEnemies = newEnemies.filter(e => {
            const dx = Math.abs(e.x - state.playerPosition.x)
            const dy = Math.abs(e.y - state.playerPosition.y)
            return (dx <= 1 && dy <= 1) && (dx + dy > 0)
        })

        if (hittingEnemies.length > 0) {
            if (playerHealth > 0 && Math.random() < 0.3) {
                let damage = hittingEnemies[0].type === 'goblin' ? 8 : 5

                // 50% damage reduction if shield is equipped
                if (state.inventory.equippedShieldId) {
                    damage = Math.floor(damage / 2)
                }

                playerHealth -= damage
                newShake = 1.0
                soundManager.playHurt()
            }
        }

        if (playerHealth <= 0) {
            return { playerHealth: 0, phase: 'GAME_OVER', shake: 0 }
        }

        return {
            enemies: newEnemies,
            playerHealth,
            shake: newShake
        }
    }),
}))

function generateLights(map: number[][], startPos: { x: number, y: number }): Light[] {
    const lights: Light[] = []

    // NO spawn light - player has camera-attached lantern now

    // 2. Torches anchored to walls
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 0) { // Floor
                // Don't put light exactly at spawn again
                if (x === startPos.x && y === startPos.y) return

                // 8% chance for a torch if next to a wall
                if (Math.random() < 0.08) {
                    // Check neighbors for walls
                    const neighbors = [
                        { dx: 0, dy: -1 }, // North
                        { dx: 1, dy: 0 },  // East
                        { dx: 0, dy: 1 },  // South
                        { dx: -1, dy: 0 }  // West
                    ]

                    const wallNeighbor = neighbors.find(n => map[y + n.dy]?.[x + n.dx] === 1)

                    if (wallNeighbor) {
                        const facing =
                            wallNeighbor.dy === -1 ? 'N' :
                                wallNeighbor.dx === 1 ? 'E' :
                                    wallNeighbor.dy === 1 ? 'S' : 'W' as 'N' | 'S' | 'E' | 'W'

                        // Offset the light 0.4 units towards the wall neighbor
                        lights.push({
                            id: uuidv4(),
                            x: x + (wallNeighbor.dx * 0.4),
                            y: y + (wallNeighbor.dy * 0.4),
                            intensity: 2.0,
                            color: '#ff7700', // Deeper orange
                            distance: 14,
                            facing
                        })
                    }
                }
            }
        })
    })

    return lights
}
