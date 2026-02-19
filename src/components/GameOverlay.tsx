import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { initAudioIntegration } from '../audio/audioIntegration'

export default function GameOverlay() {
    const phase = useGameStore(state => state.phase)
    const startGame = useGameStore(state => state.startGame)
    const resetGame = useGameStore(state => state.resetGame)

    const handleInteraction = () => {
        if (phase === 'MENU') {
            initAudioIntegration()
            startGame()
        }
        if (phase === 'PAUSED') useGameStore.getState().togglePause()
        if (phase === 'WON' || phase === 'GAME_OVER') resetGame()
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleInteraction()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [phase, startGame, resetGame])

    if (phase === 'PLAYING') return null

    return (
        <div
            onClick={handleInteraction}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'Courier New, monospace',
                zIndex: 1000,
                pointerEvents: 'auto',
                cursor: 'pointer'
            }}
        >
            {phase === 'MENU' && (
                <>
                    <h1 style={{ fontSize: '64px', marginBottom: '20px', textShadow: '4px 4px #880000' }}>DUNGEON SAM</h1>
                    <p style={{ fontSize: '24px', animation: 'blink 1s infinite' }}>PRESS ENTER OR TAP TO START</p>
                    <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.7 }}>
                        <p>WASD / ARROW KEYS to Move</p>
                        <p>SPACE / F to Attack</p>
                        <p>E to Pick Up • Q to Switch Weapon</p>
                    </div>
                </>
            )}

            {phase === 'GAME_OVER' && (
                <>
                    <h1 style={{ fontSize: '80px', color: '#ff0000', marginBottom: '20px' }}>YOU DIED</h1>
                    <p style={{ fontSize: '24px' }}>PRESS ENTER OR TAP TO RESTART</p>
                </>
            )}

            {phase === 'WON' && (
                <>
                    <h1 style={{ fontSize: '64px', color: '#00ff00', marginBottom: '20px' }}>DUNGEON CLEARED</h1>
                    <p style={{ fontSize: '24px' }}>PRESS ENTER OR TAP TO PLAY AGAIN</p>
                </>
            )}

            {phase === 'PAUSED' && (
                <>
                    <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>PAUSED</h1>
                    <p style={{ fontSize: '24px' }}>PRESS ESC OR TAP TO RESUME</p>
                </>
            )}

            <style>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    )
}
