import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export const GAME_TICK_RATE = 400 // ms

export default function useGameLoop() {
    // We could use useInterval, but useEffect with a cleared interval is standard
    useEffect(() => {
        console.log('useGameLoop mounted')
        const interval = setInterval(() => {
            console.log('useGameLoop tick')
            const state = useGameStore.getState()
            if (state.tickGame) {
                state.tickGame()
            } else {
                console.error('tickGame function missing on state!', state)
            }
        }, GAME_TICK_RATE)

        return () => clearInterval(interval)
    }, [])
}
