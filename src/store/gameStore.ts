import { create } from 'zustand'
import { generateDungeon } from '../utils/dungeonGenerator'
import { moveEnemy } from '../utils/ai'
import { playAttackSound } from '../audio/audioIntegration'
import { soundManager } from '../audio/SoundManager'

import { Enemy, Item, Inventory, Light, QuestArtifact, StoryBeat, StoryBeatId, Interactable, PuzzleLocks } from '../types/game'
import { makeId } from '../utils/id'
import { ECHO_SIGIL_ARTIFACT_ID, STORY_BEATS, USE_INTERACT_PROMPT } from '../utils/story'

export const CELL_SIZE = 2 // World units per grid cell

export type Direction = 0 | 1 | 2 | 3 // North, East, South, West
export type GamePhase = 'MENU' | 'PLAYING' | 'WON' | 'GAME_OVER' | 'PAUSED'

interface GameState {
    phase: GamePhase
    level: number
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
    nextLevel: () => void
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
    artifacts: QuestArtifact[] // Quest artifacts on ground
    inventory: Inventory
    questArtifacts: QuestArtifact[]
    pickupItem: () => void
    equipWeapon: (itemId: string) => void
    useItem: (itemId: string) => void

    // Narrative & Puzzles
    interactables: Interactable[]
    storyLog: StoryBeatId[]
    activeStoryBeat: StoryBeat | null
    latestClue: string
    puzzleLocks: PuzzleLocks
    interact: () => void
    dismissStory: () => void
    showStoryBeat: (storyBeatId: StoryBeatId) => void
    unlockExitSeal: () => void

    startGame: () => void
    resetGame: () => void
    togglePause: () => void
    toggleDoor: () => void

    // Platform
    isMobile: boolean
    debugNoEnemies: boolean
}

const {
    map: initialMap,
    startPosition,
    exitPosition,
    initialEnemies,
    initialItems: initialSpawnedItems,
    initialArtifacts,
    initialInteractables,
    puzzleLocks: initialPuzzleLocks
} = generateDungeon()

const enemies: Enemy[] = initialEnemies

const initialLights = generateLights(initialMap, startPosition)

const getStartingInventory = () => {
    return {
        items: [],
        maxSize: 5,
        equippedWeaponId: null as string | null,
        equippedShieldId: null as string | null
    }
}

const initialInventory = getStartingInventory()

const hasQuestArtifact = (artifacts: QuestArtifact[], artifactId: typeof ECHO_SIGIL_ARTIFACT_ID) => {
    return artifacts.some(artifact => artifact.artifactId === artifactId)
}

const getFacingPosition = (position: { x: number, y: number }, direction: Direction) => {
    let tx = position.x
    let ty = position.y

    if (direction === 0) ty -= 1
    else if (direction === 1) tx += 1
    else if (direction === 2) ty += 1
    else tx -= 1

    return { x: tx, y: ty }
}

const isCurrentOrCardinalNeighbor = (a: { x: number, y: number }, b: { x: number, y: number }) => {
    const dx = Math.abs(a.x - b.x)
    const dy = Math.abs(a.y - b.y)
    return dx + dy <= 1
}

const createStoryUpdate = (
    state: Pick<GameState, 'storyLog'>,
    storyBeatId: StoryBeatId
) => {
    const beat = STORY_BEATS[storyBeatId]
    return {
        activeStoryBeat: beat,
        storyLog: state.storyLog.includes(storyBeatId) ? state.storyLog : [...state.storyLog, storyBeatId],
        latestClue: beat.clue
    }
}

export const useGameStore = create<GameState>((set, get) => ({
    phase: 'MENU',
    level: 1,
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
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches),
    debugNoEnemies: false, // Disabled for testing

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

    items: initialSpawnedItems,
    artifacts: initialArtifacts,
    inventory: initialInventory,
    questArtifacts: [],
    interactables: initialInteractables,
    storyLog: [],
    activeStoryBeat: null,
    latestClue: '',
    puzzleLocks: initialPuzzleLocks,

    pickupItem: () => set((state) => {
        if (state.activeStoryBeat) return {}

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

                soundManager.playPickup()
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
                soundManager.playError()
            }
        }
        return {}
    }),

    equipWeapon: (itemId) => set((state) => ({
        inventory: { ...state.inventory, equippedWeaponId: itemId }
    })),

    useItem: (itemId) => set((state) => {
        if (state.activeStoryBeat) return {}

        const itemIndex = state.inventory.items.findIndex(i => i.id === itemId)
        if (itemIndex > -1) {
            const item = state.inventory.items[itemIndex]
            if (item.type === 'potion') {
                const newHealth = Math.min(100, state.playerHealth + (item.effectValue || 25))
                const newInvItems = [...state.inventory.items]
                newInvItems.splice(itemIndex, 1)
                soundManager.playHeal()
                return {
                    playerHealth: newHealth,
                    inventory: { ...state.inventory, items: newInvItems }
                }
            }
        }
        return {}
    }),

    interact: () => {
        const state = get()

        if (state.activeStoryBeat) {
            get().dismissStory()
            return
        }

        const playerPosition = state.playerPosition
        const facingPosition = getFacingPosition(playerPosition, state.playerDirection)

        const itemOnTile = state.items.find(i => i.x === playerPosition.x && i.y === playerPosition.y)
        if (itemOnTile) {
            get().pickupItem()
            return
        }

        const artifactOnTile = state.artifacts.find(i => i.x === playerPosition.x && i.y === playerPosition.y)
        if (artifactOnTile) {
            set((current) => {
                const collectedArtifact = current.artifacts.find(i => i.id === artifactOnTile.id)
                if (!collectedArtifact) return {}

                soundManager.playPickup()
                return {
                    artifacts: current.artifacts.filter(i => i.id !== collectedArtifact.id),
                    questArtifacts: [...current.questArtifacts, { ...collectedArtifact, x: -1, y: -1 }],
                    ...createStoryUpdate(current, 'echo_sigil_discovery')
                }
            })
            return
        }

        const storyObject = state.interactables.find(interactable => {
            if (!isCurrentOrCardinalNeighbor(playerPosition, interactable)) return false
            return interactable.repeatable || !state.storyLog.includes(interactable.storyBeatId)
        })

        if (storyObject) {
            get().showStoryBeat(storyObject.storyBeatId)
            return
        }

        const exitSeal = state.puzzleLocks.exitSeal
        const sealIsReachable =
            !exitSeal.unlocked &&
            (isCurrentOrCardinalNeighbor(playerPosition, exitSeal) || (
                facingPosition.x === exitSeal.x && facingPosition.y === exitSeal.y
            ))

        if (sealIsReachable) {
            if (hasQuestArtifact(state.questArtifacts, ECHO_SIGIL_ARTIFACT_ID)) {
                get().unlockExitSeal()
            } else {
                soundManager.playError()
                get().showStoryBeat('locked_exit_hint')
            }
            return
        }

        const facingCell = state.map[facingPosition.y]?.[facingPosition.x]
        if (facingCell === 2 || facingCell === 3) {
            get().toggleDoor()
            return
        }

        soundManager.playError()
        set({ latestClue: 'Nothing answers.' })
    },

    dismissStory: () => set({ activeStoryBeat: null }),

    showStoryBeat: (storyBeatId) => set((state) => createStoryUpdate(state, storyBeatId)),

    unlockExitSeal: () => set((state) => {
        if (state.activeStoryBeat) return {}
        if (state.puzzleLocks.exitSeal.unlocked) return {}

        if (!hasQuestArtifact(state.questArtifacts, ECHO_SIGIL_ARTIFACT_ID)) {
            soundManager.playError()
            return createStoryUpdate(state, 'locked_exit_hint')
        }

        soundManager.playDoorOpen()

        return {
            puzzleLocks: {
                ...state.puzzleLocks,
                exitSeal: {
                    ...state.puzzleLocks.exitSeal,
                    unlocked: true
                }
            },
            ...createStoryUpdate(state, 'seal_unlock')
        }
    }),

    startGame: () => {
        const state = get()
        state.revealMap(state.playerPosition.x, state.playerPosition.y)
        set((current) => ({
            phase: 'PLAYING',
            ...(current.level === 1 && current.storyLog.length === 0 ? createStoryUpdate(current, 'mara_intro') : {})
        }))
    },

    resetGame: () => {
        const { map, startPosition, exitPosition, initialEnemies, initialItems, initialArtifacts, initialInteractables, puzzleLocks } = generateDungeon()

        set({
            phase: 'PLAYING',
            level: 1,
            map,
            playerPosition: startPosition,
            exitPosition,
            enemies: initialEnemies,
            items: initialItems,
            artifacts: initialArtifacts,
            inventory: getStartingInventory(),
            questArtifacts: [],
            interactables: initialInteractables,
            storyLog: ['mara_intro'],
            activeStoryBeat: STORY_BEATS.mara_intro,
            latestClue: STORY_BEATS.mara_intro.clue,
            puzzleLocks,
            playerHealth: 100,
            playerDirection: 1,
            lights: generateLights(map, startPosition),
            exploredMap: Array(map.length).fill(null).map(() => Array(map[0].length).fill(false))
        })
        get().revealMap(startPosition.x, startPosition.y)
    },

    nextLevel: () => {
        const { map, startPosition, exitPosition, initialEnemies, initialItems, initialArtifacts, initialInteractables, puzzleLocks } = generateDungeon(get().level + 1)
        set((state) => ({
            level: state.level + 1,
            map,
            playerPosition: startPosition,
            exitPosition,
            enemies: initialEnemies,
            items: initialItems,
            artifacts: initialArtifacts,
            interactables: initialInteractables,
            puzzleLocks,
            activeStoryBeat: null,
            latestClue: '',
            lights: generateLights(map, startPosition),
            exploredMap: Array(map.length).fill(null).map(() => Array(map[0].length).fill(false))
        }))
        get().revealMap(startPosition.x, startPosition.y)
    },

    togglePause: () => {
        const { phase } = get()
        if (phase === 'PLAYING') set({ phase: 'PAUSED' })
        else if (phase === 'PAUSED') set({ phase: 'PLAYING' })
    },

    toggleDoor: () => set((state) => {
        if (state.phase !== 'PLAYING' || state.activeStoryBeat) return {}

        const { x, y } = state.playerPosition
        const dir = state.playerDirection
        let tx = x, ty = y

        if (dir === 0) ty -= 1
        else if (dir === 1) tx += 1
        else if (dir === 2) ty += 1
        else tx -= 1

        const cell = state.map[ty]?.[tx]
        if (cell === 2 || cell === 3) {
            const newMap = state.map.map(row => [...row])
            newMap[ty][tx] = cell === 2 ? 3 : 2

            soundManager.playDoorOpen()
            return { map: newMap }
        }
        return {}
    }),

    moveForward: () => set((state) => {
        if (state.phase !== 'PLAYING' || state.activeStoryBeat) return {}

        const { x, y } = state.playerPosition
        const dir = state.playerDirection
        let newX = x, newY = y

        if (dir === 0) newY -= 1
        else if (dir === 1) newX += 1
        else if (dir === 2) newY += 1
        else newX -= 1

        if (newX === state.exitPosition.x && newY === state.exitPosition.y) {
            if (!state.puzzleLocks.exitSeal.unlocked) {
                soundManager.playError()
                if (hasQuestArtifact(state.questArtifacts, ECHO_SIGIL_ARTIFACT_ID)) {
                    return { latestClue: USE_INTERACT_PROMPT }
                }

                return createStoryUpdate(state, 'locked_exit_hint')
            }

            soundManager.playLevelComplete()
            get().nextLevel()
            return {}
        }

        const targetCell = state.map[newY]?.[newX]
        if (targetCell === 0 || targetCell === 3) {
            const enemyInWay = state.enemies.find(e => e.x === newX && e.y === newY && e.hp > 0)
            if (enemyInWay) return {}
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
            let newItems = state.items
            let newInventory = state.inventory
            
            const itemIndex = state.items.findIndex(i => i.x === newX && i.y === newY)
            if (itemIndex > -1) {
                const item = state.items[itemIndex]
                if (state.inventory.items.length < state.inventory.maxSize) {
                    const mappedItems = [...state.items]
                    mappedItems.splice(itemIndex, 1)
                    newItems = mappedItems

                    const newInvItems = [...state.inventory.items, { ...item, x: -1, y: -1 }]
                    
                    let newEquippedWeaponId = state.inventory.equippedWeaponId
                    if (item.type === 'weapon' && !newEquippedWeaponId) {
                        newEquippedWeaponId = item.id
                    }

                    let newEquippedShieldId = state.inventory.equippedShieldId
                    if (item.type === 'shield' && !newEquippedShieldId) {
                        newEquippedShieldId = item.id
                    }

                    soundManager.playPickup()
                    newInventory = {
                        ...state.inventory,
                        items: newInvItems,
                        equippedWeaponId: newEquippedWeaponId,
                        equippedShieldId: newEquippedShieldId
                    }
                }
            }

            return {
                playerPosition: { x: newX, y: newY },
                exploredMap: newExplored,
                items: newItems,
                inventory: newInventory
            }
        }
        return {}
    }),

    moveBackward: () => set((state) => {
        if (state.phase !== 'PLAYING' || state.activeStoryBeat) return {}

        const { x, y } = state.playerPosition
        const dir = state.playerDirection
        let newX = x, newY = y

        if (dir === 0) newY += 1
        else if (dir === 1) newX -= 1
        else if (dir === 2) newY -= 1
        else newX += 1

        if (newX === state.exitPosition.x && newY === state.exitPosition.y) {
            if (!state.puzzleLocks.exitSeal.unlocked) {
                soundManager.playError()
                if (hasQuestArtifact(state.questArtifacts, ECHO_SIGIL_ARTIFACT_ID)) {
                    return { latestClue: USE_INTERACT_PROMPT }
                }

                return createStoryUpdate(state, 'locked_exit_hint')
            }

            soundManager.playLevelComplete()
            get().nextLevel()
            return {}
        }

        const targetCell = state.map[newY]?.[newX]
        if (targetCell === 0 || targetCell === 3) {
            const enemyInWay = state.enemies.find(e => e.x === newX && e.y === newY && e.hp > 0)
            if (enemyInWay) return {}
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
            let newItems = state.items
            let newInventory = state.inventory
            
            const itemIndex = state.items.findIndex(i => i.x === newX && i.y === newY)
            if (itemIndex > -1) {
                const item = state.items[itemIndex]
                if (state.inventory.items.length < state.inventory.maxSize) {
                    const mappedItems = [...state.items]
                    mappedItems.splice(itemIndex, 1)
                    newItems = mappedItems

                    const newInvItems = [...state.inventory.items, { ...item, x: -1, y: -1 }]
                    
                    let newEquippedWeaponId = state.inventory.equippedWeaponId
                    if (item.type === 'weapon' && !newEquippedWeaponId) {
                        newEquippedWeaponId = item.id
                    }

                    let newEquippedShieldId = state.inventory.equippedShieldId
                    if (item.type === 'shield' && !newEquippedShieldId) {
                        newEquippedShieldId = item.id
                    }

                    soundManager.playPickup()
                    newInventory = {
                        ...state.inventory,
                        items: newInvItems,
                        equippedWeaponId: newEquippedWeaponId,
                        equippedShieldId: newEquippedShieldId
                    }
                }
            }

            return {
                playerPosition: { x: newX, y: newY },
                exploredMap: newExplored,
                items: newItems,
                inventory: newInventory
            }
        }
        return {}
    }),

    turnLeft: () => set((state) => (
        state.activeStoryBeat ? {} : { playerDirection: (state.playerDirection + 3) % 4 as Direction }
    )),

    turnRight: () => set((state) => (
        state.activeStoryBeat ? {} : { playerDirection: (state.playerDirection + 1) % 4 as Direction }
    )),

    playerAttack: () => set((state) => {
        if (state.activeStoryBeat) return {}

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
        const weaponType = equippedWeapon ? 'sword' : 'fist'

        playAttackSound(!!enemy, weaponType)

        if (enemy) {
            const damage = equippedWeapon?.effectValue || 25
            const newHp = enemy.hp - damage
            let newItems = state.items

            if (newHp <= 0) {
                let itemType: 'weapon' | 'shield' | 'potion' | null = null
                let itemName = ''
                let itemValue = 0

                if (enemy.type === 'watcher') {
                    if (Math.random() > 0.5) {
                        itemType = 'weapon'
                        itemName = 'Watcher Sword'
                        itemValue = 50
                    } else {
                        itemType = 'shield'
                        itemName = 'Poison Shield'
                        itemValue = 30
                    }
                } else {
                    const dropRoll = Math.random()
                    if (dropRoll < 0.25) {
                        itemType = 'weapon'
                        itemName = 'Goblin Club'
                        itemValue = 15
                    } else if (dropRoll < 0.5) {
                        itemType = 'weapon'
                        itemName = 'Sword of Truth'
                        itemValue = 25
                    } else if (dropRoll < 0.75) {
                        itemType = 'weapon'
                        itemName = 'Bow and Arrow'
                        itemValue = 20
                    } else {
                        itemType = 'shield'
                        itemName = 'Iron Shield'
                        itemValue = 10
                    }
                }

                // Check if unique item already exists in world or inventory
                const itemAlreadyExists = (name: string) => {
                    const inWorld = state.items.some(i => i.name === name)
                    const inInventory = state.inventory.items.some(i => i.name === name)
                    return inWorld || inInventory
                }

                if (itemType && itemAlreadyExists(itemName)) {
                    // Fallback to dropping a potion with a low chance, or nothing
                    if (Math.random() > 0.7) {
                        itemType = 'potion'
                        itemName = 'Health Potion'
                        itemValue = 50
                    } else {
                        itemType = null // Drop nothing
                    }
                }

                if (itemType) {
                    newItems = [...state.items, {
                        id: makeId('item'),
                        x: enemy.x,
                        y: enemy.y,
                        type: itemType,
                        name: itemName,
                        effectValue: itemValue
                    }]
                }
            }

            const newEnemies = state.enemies.map(e => {
                if (e.id === enemy.id) {
                    return { ...e, hp: newHp, lastHurtTime: performance.now() }
                }
                return e
            }).filter(e => e.hp > 0)
            return { enemies: newEnemies, items: newItems, shake: 0.5, lastAttackTime: now }
        } else {
            return { shake: 0.1, lastAttackTime: now }
        }
    }),

    spawnEnemy: (x, y) => set((state) => {
        if (state.activeStoryBeat) return {}

        const r = Math.random()
        let type: 'imp' | 'goblin' | 'watcher' | 'rubble' = 'imp'
        let hp = 100
        let moveCooldown = 2

        if (r > 0.9) {
            type = 'watcher'
            hp = 200
            moveCooldown = 3
        } else if (r > 0.7) {
            type = 'rubble'
            hp = 150
            moveCooldown = 2
        } else if (r > 0.4) {
            type = 'goblin'
            hp = 60
            moveCooldown = 1
        }

        return {
            enemies: [...state.enemies, {
                id: makeId('enemy'),
                x,
                y,
                type,
                hp,
                moveCooldown
            }]
        }
    }),

    tickGame: () => set((state) => {
        if (state.phase !== 'PLAYING') return {}
        if (state.activeStoryBeat) return {}
        if (state.debugNoEnemies) return { enemies: [], shake: Math.max(0, state.shake - 0.1) }

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
                            id: makeId('light'),
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
