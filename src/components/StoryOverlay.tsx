import { useGameStore } from '../store/gameStore'

export default function StoryOverlay() {
    const storyBeat = useGameStore(state => state.activeStoryBeat)
    const interact = useGameStore(state => state.interact)

    if (!storyBeat) return null

    return (
        <div
            onPointerDown={(event) => {
                event.preventDefault()
                interact()
            }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 950,
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '0 24px 90px',
                boxSizing: 'border-box',
                background: 'linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.08) 55%, rgba(0,0,0,0))',
                color: 'white',
                fontFamily: 'Courier New, monospace',
                textShadow: '2px 2px black'
            }}
        >
            <div style={{
                width: 'min(820px, 100%)',
                minHeight: '150px',
                display: 'grid',
                gridTemplateColumns: '112px 1fr',
                gap: '18px',
                alignItems: 'center',
                background: 'rgba(7, 13, 18, 0.88)',
                border: '2px solid rgba(158,220,255,0.5)',
                boxShadow: '0 0 24px rgba(71, 170, 220, 0.25)',
                padding: '18px',
                boxSizing: 'border-box'
            }}>
                <img
                    src={storyBeat.portraitUrl}
                    alt={storyBeat.speaker}
                    style={{
                        width: '112px',
                        height: '112px',
                        objectFit: 'contain',
                        imageRendering: 'pixelated',
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.18)'
                    }}
                />
                <div>
                    <div style={{
                        color: '#9edcff',
                        fontSize: '22px',
                        marginBottom: '10px',
                        textTransform: 'uppercase'
                    }}>
                        {storyBeat.speaker}
                    </div>
                    <div style={{
                        fontSize: '22px',
                        lineHeight: 1.35
                    }}>
                        {storyBeat.text}
                    </div>
                </div>
            </div>
        </div>
    )
}
