import { useGameStore } from '../store/gameStore'
import { useAudio } from '../hooks/useAudio'

export default function HUD() {
    const health = useGameStore(state => state.playerHealth)
    const inventory = useGameStore(state => state.inventory)
    const { isMuted, toggleMute } = useAudio()

    const equippedWeapon = inventory.items.find(i => i.id === inventory.equippedWeaponId)
    const weaponName = equippedWeapon ? equippedWeapon.name.toUpperCase() : 'FISTS'

    const equippedShield = inventory.items.find(i => i.id === inventory.equippedShieldId)
    const shieldName = equippedShield ? equippedShield.name.toUpperCase() : 'NONE'

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            color: 'white',
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            textShadow: '2px 2px black',
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            zIndex: 10,
            boxSizing: 'border-box'
        }}>
            <div>
                HEALTH: {health}%
            </div>
            <div style={{ display: 'flex', gap: '40px' }}>
                <div>
                    WEAPON: {weaponName}
                </div>
                <div>
                    SHIELD: {shieldName}
                </div>
            </div>
            {/* Mute toggle button */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '10px 15px',
                    background: 'rgba(0,0,0,0.6)',
                    border: '2px solid #888',
                    color: 'white',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '16px',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: 100
                }}
            >
                {isMuted ? '🔇 MUTED' : '🔊 SOUND'}
            </button>
        </div>
    )
}
