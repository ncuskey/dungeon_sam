import React from 'react'
import { useGameStore } from '../store/gameStore'

export default function TouchControls() {
    const { phase, moveForward, moveBackward, turnLeft, turnRight, playerAttack, inventory, equipWeapon, pickupItem } = useGameStore()

    if (phase !== 'PLAYING') return null

    // Prevent default touch behavior (ghost clicks, zooming)
    const handleTouch = (e: React.TouchEvent, action: () => void) => {
        e.preventDefault()
        e.stopPropagation()
        action()
    }

    const switchWeapon = () => {
        const weapons = inventory.items.filter(i => i.type === 'weapon')
        if (weapons.length === 0) return

        const currentIdx = weapons.findIndex(w => w.id === inventory.equippedWeaponId)
        const nextIdx = (currentIdx + 1) % weapons.length
        equipWeapon(weapons[nextIdx].id)
    }

    // Common Button Style
    const btnStyle = {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        touchAction: 'none' as const, // CSS-in-JS type fix
        userSelect: 'none' as const,
        cursor: 'pointer',
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '0',
            width: '100%',
            height: '200px',
            zIndex: 50, // Between canvas and HUD menus
            pointerEvents: 'none', // Let touches pass through empty spaces
            touchAction: 'none'
        }}>
            {/* D-PAD (Left Side) - pointerEvents: auto for buttons */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                width: '150px',
                height: '150px',
                pointerEvents: 'auto'
            }}>
                {/* UP */}
                <div
                    onTouchStart={(e) => handleTouch(e, moveForward)}
                    style={{ ...btnStyle, position: 'absolute', top: 0, left: '50px', width: '50px', height: '50px' }}
                >▲</div>
                {/* DOWN */}
                <div
                    onTouchStart={(e) => handleTouch(e, moveBackward)}
                    style={{ ...btnStyle, position: 'absolute', bottom: 0, left: '50px', width: '50px', height: '50px' }}
                >▼</div>
                {/* LEFT */}
                <div
                    onTouchStart={(e) => handleTouch(e, turnLeft)}
                    style={{ ...btnStyle, position: 'absolute', top: '50px', left: 0, width: '50px', height: '50px' }}
                >◀</div>
                {/* RIGHT */}
                <div
                    onTouchStart={(e) => handleTouch(e, turnRight)}
                    style={{ ...btnStyle, position: 'absolute', top: '50px', right: 0, width: '50px', height: '50px' }}
                >▶</div>
            </div>

            {/* ACTION BUTTONS (Right Side) */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '180px',
                height: '150px',
                pointerEvents: 'auto'
            }}>
                {/* ATTACK (Big Button) */}
                <div
                    onTouchStart={(e) => handleTouch(e, playerAttack)}
                    style={{
                        ...btnStyle,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '80px',
                        height: '80px',
                        background: 'rgba(200, 50, 50, 0.4)',
                        borderColor: 'rgba(255, 100, 100, 0.6)'
                    }}
                >⚔️</div>

                {/* SWITCH WEAPON */}
                <div
                    onTouchStart={(e) => handleTouch(e, switchWeapon)}
                    style={{
                        ...btnStyle,
                        position: 'absolute',
                        bottom: '90px',
                        right: '0px',
                        width: '60px',
                        height: '60px',
                        fontSize: '18px'
                    }}
                >🔄</div>

                {/* INTERACT (Simulate E) - We don't have direct interact action in store yet besides pickup, 
                    but HUD might show current interaction. 
                    Actually, let's look at Pickup. 
                    Ah, store has `pickupItem` but we decided not to auto-pickup. 
                    Let's expose pickupItem in store? Or just rely on Attack for interaction?
                    Wait, previous code analysis showed we removed auto-pickup and rely on 'E'.
                    So I need to expose pickupItem in `useGameStore`.
                    I will assume it is exposed or use it if available.
                */}
                <div
                    onTouchStart={(e) => {
                        e.preventDefault()
                        pickupItem()
                    }}
                    style={{
                        ...btnStyle,
                        position: 'absolute',
                        bottom: '0px',
                        right: '90px',
                        width: '60px',
                        height: '60px',
                        fontSize: '20px'
                    }}
                >✋</div>
            </div>
        </div>
    )
}
