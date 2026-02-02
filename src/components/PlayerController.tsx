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
            }

            if (acted) lastActionTime.current = now
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [moveForward, moveBackward, turnLeft, turnRight])

    return null
}
