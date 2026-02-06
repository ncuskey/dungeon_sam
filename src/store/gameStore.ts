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
    playerAttack: () => void

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

// Convert raw positions to Enemy objects
const enemies: Enemy[] = initialEnemies.map(pos => ({
    id: uuidv4(),
    x: pos.x,
    y: pos.y,
    type: 'imp',
    hp: 100
}))

const initialLights = generateLights(initialMap, startPosition)

export const useGameStore = create<GameState>((set) => ({
    phase: 'MENU',
    playerPosition: startPosition,
    playerDirection: 1, // Facing East
    map: initialMap,
    exitPosition,
    enemies,
    lights: initialLights,
    playerHealth: 100,
    shake: 0,

    items: initialSpawnedItems,
    inventory: { items: [], maxSize: 5, equippedWeaponId: null },

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
                let newEquippedId = state.inventory.equippedWeaponId
                if (item.type === 'weapon' && !newEquippedId) {
                    newEquippedId = item.id
                }

                console.log("Picked up", item.name)
                return {
                    items: newItems,
                    inventory: { ...state.inventory, items: newInvItems, equippedWeaponId: newEquippedId }
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

    startGame: () => set({ phase: 'PLAYING' }),

    resetGame: () => {
        const { map, startPosition, exitPosition, initialEnemies, initialItems } = generateDungeon()
        const newEnemies = initialEnemies.map(pos => ({
            id: uuidv4(),
            x: pos.x,
            y: pos.y,
            type: 'imp' as const,
            hp: 100
        }))

        set({
            phase: 'PLAYING',
            map,
            playerPosition: startPosition,
            exitPosition,
            enemies: newEnemies,
            items: initialItems,
            inventory: { items: [], maxSize: 5, equippedWeaponId: null },
            playerHealth: 100,
            playerDirection: 1,
            lights: generateLights(map, startPosition)
        })
    },

    moveForward: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}

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
            // Check for exit
            if (newX === state.exitPosition.x && newY === state.exitPosition.y) {
                return { playerPosition: { x: newX, y: newY }, phase: 'WON' }
            }

            // Auto-pickup? Or manual? Let's do auto-pickup for MVP v0.2 to save inputs
            const item = state.items.find(i => i.x === newX && i.y === newY)
            if (item) {
                // Schedule pickup (async-ish pattern in zustand actions call other actions)
                // But we are inside set... we can just do logic inline or call state.pickupItem() if we had access to get().
                // We don't have Get access in this set callback easily without refactor.
                // Ideally we separate logic. For now, let's just trigger a side effect or handle it in next tick?
                // Actually, simpler: Item pickup requires a key press usually 'E'.
                // Let's NOT auto-pickup. Plan said "Pickup Logic". Let's bind 'E' in PlayerController.
            }

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

    playerAttack: () => set((state) => {
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
            const damage = equippedWeapon?.effectValue || 25 // Base punch damage

            console.log(`Attacking with ${equippedWeapon?.name || 'Fists'} for ${damage} damage`)

            const newEnemies = state.enemies.map(e => {
                if (e.id === enemy.id) {
                    const newHp = e.hp - damage
                    return { ...e, hp: newHp, lastHurtTime: performance.now() }
                }
                return e
            }).filter(e => e.hp > 0)
            return { enemies: newEnemies, shake: 0.5 }
        } else {
            return { shake: 0.1 } // Small jitter on miss
        }
    }),

    spawnEnemy: (x, y) => set((state) => ({
        enemies: [...state.enemies, {
            id: uuidv4(),
            x,
            y,
            type: 'imp',
            hp: 100
        }]
    })),

    tickGame: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}

        const { playerPosition, map, enemies } = state

        let takingDamage = false
        let newPlayerHealth = state.playerHealth
        let newShake = Math.max(0, state.shake - 0.1) // Decay faster for cleaner feel

        // Build set of occupied positions (other enemies) to prevent stacking
        const occupiedSet = new Set<string>()
        enemies.forEach(e => occupiedSet.add(`${e.x},${e.y}`))

        const newEnemies = enemies.map(enemy => {
            // Check if adjacent to player
            const dist = Math.abs(enemy.x - playerPosition.x) + Math.abs(enemy.y - playerPosition.y)
            if (dist <= 1) {
                takingDamage = true
                return enemy // Don't move if attacking
            }

            // Remove self from occupied set for calculation
            occupiedSet.delete(`${enemy.x},${enemy.y}`)

            const newPos = moveEnemy(enemy, playerPosition, map, occupiedSet)

            // Add new pos to occupied set
            occupiedSet.add(`${newPos.x},${newPos.y}`)

            return { ...enemy, ...newPos }
        })

        if (takingDamage) {
            newPlayerHealth = Math.max(0, newPlayerHealth - 5)
            newShake = 1.0 // Violent shake on dmg
        }

        if (newPlayerHealth <= 0 && state.playerHealth > 0) {
            console.log("GAME OVER")
            return { enemies: newEnemies, playerHealth: 0, phase: 'GAME_OVER', shake: 0 }
        }

        return {
            enemies: newEnemies,
            playerHealth: newPlayerHealth,
            shake: newShake
        }
    })
}))

function generateLights(map: number[][], startPos: { x: number, y: number }): Light[] {
    const lights: Light[] = []

    // 1. Guaranteed light at spawn
    lights.push({
        id: uuidv4(),
        x: startPos.x,
        y: startPos.y,
        intensity: 2.5, // Slightly brighter spawn
        color: '#ffaa00',
        distance: 15
    })

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
                        // Offset the light 0.4 units towards the wall neighbor
                        lights.push({
                            id: uuidv4(),
                            x: x + (wallNeighbor.dx * 0.4),
                            y: y + (wallNeighbor.dy * 0.4),
                            intensity: 2.0,
                            color: '#ff7700', // Deeper orange
                            distance: 14
                        })
                    }
                }
            }
        })
    })

    return lights
}
