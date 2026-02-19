import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export default function PlayerController() {
    const moveForward = useGameStore((state) => state.moveForward)
    const moveBackward = useGameStore((state) => state.moveBackward)
    const turnLeft = useGameStore((state) => state.turnLeft)
    const turnRight = useGameStore((state) => state.turnRight)

    // Simple cooldown mechanism
    const lastActionTime = useRef(0)
    const COOLDOWN_MS = 250

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now()
            if (now - lastActionTime.current < COOLDOWN_MS) return

            let acted = false

            if (e.code === 'Escape') {
                useGameStore.getState().togglePause()
                return
            }

            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward()
                    acted = true
                    break
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward()
                    acted = true
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    turnLeft()
                    acted = true
                    break
                case 'ArrowRight':
                case 'KeyD':
                    turnRight()
                    acted = true
                    break
                case 'Space':
                case 'KeyF': {
                    // Check for door presence to decide whether to attack or toggle.
                    const state = useGameStore.getState()
                    const { x, y } = state.playerPosition
                    const dir = state.playerDirection
                    let tx = x, ty = y
                    if (dir === 0) ty -= 1
                    else if (dir === 1) tx += 1
                    else if (dir === 2) ty += 1
                    else tx -= 1

                    const cell = state.map[ty]?.[tx]
                    if (cell === 2 || cell === 3) {
                        state.toggleDoor()
                    } else {
                        state.playerAttack()
                    }
                    acted = true
                    break
                }
                case 'KeyE':
                    useGameStore.getState().pickupItem()
                    acted = true
                    break
                case 'KeyQ': {
                    // Cycle through weapons in inventory
                    const state = useGameStore.getState()
                    const weapons = state.inventory.items.filter(i => i.type === 'weapon')
                    if (weapons.length === 0) break

                    const currentIdx = weapons.findIndex(w => w.id === state.inventory.equippedWeaponId)
                    const nextIdx = (currentIdx + 1) % weapons.length
                    state.equipWeapon(weapons[nextIdx].id)
                    acted = true
                    break
                }
                case 'KeyH':
                case 'Digit1': {
                    const state = useGameStore.getState()
                    const potion = state.inventory.items.find(i => i.type === 'potion')
                    if (potion) {
                        state.useItem(potion.id)
                        acted = true
                    }
                    break
                }
            }

            if (acted) lastActionTime.current = now
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [moveForward, moveBackward, turnLeft, turnRight])

    return null
}
