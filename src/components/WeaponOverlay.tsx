import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export default function WeaponOverlay() {
    const equippedWeaponId = useGameStore(state => state.inventory.equippedWeaponId)
    const items = useGameStore(state => state.inventory.items)
    const [isAttacking, setIsAttacking] = useState(false)

    const lastAttackTime = useGameStore(state => state.lastAttackTime)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (lastAttackTime > 0) {
            // Cancel any pending reset
            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            setIsAttacking(true)

            // Set reset timer
            timeoutRef.current = setTimeout(() => {
                setIsAttacking(false)
                timeoutRef.current = null
            }, 300) // Reset quickly to match 500ms cadence
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [lastAttackTime])

    const weapon = items.find(i => i.id === equippedWeaponId)

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
                        <img
                            src="/fist_left.png"
                            alt="Left Fist"
                            style={{
                                width: '300px',
                                imageRendering: 'pixelated',
                                transition: 'transform 0.1s',
                                transform: isAttacking ? 'translateY(-20px)' : 'none'
                            }}
                        />
                        <img
                            src="/fist_right.png"
                            alt="Right Fist"
                            style={{
                                width: '300px',
                                imageRendering: 'pixelated',
                                transition: 'transform 0.1s',
                                transform: isAttacking ? 'translateY(-50px) translateX(-20px)' : 'none'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
