import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function WeaponOverlay() {
    const equippedWeaponId = useGameStore(state => state.inventory.equippedWeaponId)
    const items = useGameStore(state => state.inventory.items)
    const [isAttacking, setIsAttacking] = useState(false)

    // Subscribe to attack trigger? 
    // Usually we'd want transient state for animation.
    // gameStore doesn't expose an "attack trigger" event easily unless we subscribe or add a timestamp.
    // For MVP, let's bind to the key press or add a 'lastAttackTime' to store?
    // Actually PlayerController calls `playerAttack`. We could use a standard React state here 
    // IF we moved input handling up or exposed an event bus.
    // Simpler: Just listen for Space/F here too solely for visual feedback? 
    // Or add `lastAttackTime` to store. Let's add listener for now to decouple.

    const lastAttackTime = useGameStore(state => state.lastAttackTime)
    const [lastTrigger, setLastTrigger] = useState(0)

    useEffect(() => {
        if (lastAttackTime > 0 && lastAttackTime !== lastTrigger) {
            setLastTrigger(lastAttackTime)
            setIsAttacking(true)
            const timer = setTimeout(() => setIsAttacking(false), 300) // 300ms swing/recovery
            return () => clearTimeout(timer)
        }
    }, [lastAttackTime, lastTrigger])

    const weapon = items.find(i => i.id === equippedWeaponId)
    // const weaponName = weapon ? weapon.name : 'Fists'

    // Simple CSS visual for now
    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
        }}>
            <div style={{
                width: '600px',
                height: '400px',
                marginBottom: '-20px',
                transition: isAttacking ? 'transform 0.1s ease-out' : 'transform 0.4s ease-in-out',
                transform: isAttacking
                    ? 'rotate(-20deg) translateY(40px) scale(1.1)'
                    : 'rotate(0deg)',
                transformOrigin: 'bottom center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
            }}>
                {weapon ? (
                    <img
                        src="/sword_truth.png"
                        alt="Sword"
                        style={{
                            width: '400px',
                            imageRendering: 'pixelated'
                        }}
                    />
                ) : (
                    <div style={{ display: 'flex', gap: '50px' }}>
                        {/* Fists are usually split left/right, but let's just show right for update simplicity or both? */}
                        {/* Doom fists are centered. Let's try to center them. */}
                        <img
                            src="/fist_left.png"
                            alt="Left Fist"
                            style={{
                                width: '300px',
                                imageRendering: 'pixelated',
                                transform: isAttacking ? 'translateY(-20px)' : 'none'
                            }}
                        />
                        <img
                            src="/fist_right.png"
                            alt="Right Fist"
                            style={{
                                width: '300px',
                                imageRendering: 'pixelated',
                                transform: isAttacking ? 'translateY(-50px) translateX(-20px)' : 'none' // Punch with right
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
