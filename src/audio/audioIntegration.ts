/**
 * Audio integration with game store.
 * Uses subscription pattern to trigger sounds on game state changes.
 * This file should be imported once in App.tsx to start listening.
 */

import { useGameStore, type GamePhase } from '../store/gameStore'
import { soundManager } from './SoundManager'

interface PreviousState {
    playerPosition: { x: number; y: number }
    playerHealth: number
    enemyCount: number
    phase: GamePhase
    inventoryCount: number
}

let previousState: PreviousState | null = null
let isInitialized = false

/**
 * Initialize audio and start listening to game store.
 * Call this once after user interaction (e.g., clicking "Start Game").
 */
export function initAudioIntegration(): void {
    if (isInitialized) return

    soundManager.init()
    isInitialized = true

    // Get initial state
    const state = useGameStore.getState()
    previousState = {
        playerPosition: { ...state.playerPosition },
        playerHealth: state.playerHealth,
        enemyCount: state.enemies.length,
        phase: state.phase,
        inventoryCount: state.inventory.items.length
    }

    // Subscribe to state changes
    useGameStore.subscribe((state) => {
        if (!previousState) return

        const current = {
            playerPosition: state.playerPosition,
            playerHealth: state.playerHealth,
            enemyCount: state.enemies.length,
            phase: state.phase,
            inventoryCount: state.inventory.items.length
        }

        // --- Footsteps: position changed ---
        if (
            current.playerPosition.x !== previousState.playerPosition.x ||
            current.playerPosition.y !== previousState.playerPosition.y
        ) {
            soundManager.playFootstep()
        }

        // --- Player hurt: health decreased ---
        if (current.playerHealth < previousState.playerHealth) {
            soundManager.playHurt()
        }

        // --- Enemy killed: enemy count decreased ---
        if (current.enemyCount < previousState.enemyCount) {
            soundManager.playEnemySound('death')
        }

        // --- Item pickup: inventory increased ---
        if (current.inventoryCount > previousState.inventoryCount) {
            soundManager.playPickup()
        }

        // --- Phase transitions ---
        if (current.phase !== previousState.phase) {
            if (current.phase === 'PLAYING') {
                soundManager.playBGM()
            } else if (current.phase === 'WON' || current.phase === 'GAME_OVER') {
                soundManager.stopBGM()
            }
        }

        // Update previous state
        previousState = { ...current, playerPosition: { ...current.playerPosition } }
    })

    console.log('[AudioIntegration] Listening to game state changes')
}

/**
 * Hook for triggering attack sounds manually (not state-based).
 * Call this from the attack handler.
 */
export function playAttackSound(hasTarget: boolean, weaponType: 'fist' | 'sword' = 'fist'): void {
    soundManager.playAttack(weaponType)
    if (hasTarget) {
        // Slight delay for impact sound
        setTimeout(() => soundManager.playHit(), 100)
    }
}
