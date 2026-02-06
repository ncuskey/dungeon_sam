import { useGameStore } from '../store/gameStore'

export default function TouchControls() {
    const { phase, moveForward, moveBackward, turnLeft, turnRight, playerAttack, inventory, equipWeapon, pickupItem, useItem } = useGameStore()

    if (phase !== 'PLAYING') return null

    // Prevent default touch behavior (ghost clicks, zooming) is now handled inline

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
                    onPointerDown={(e) => { e.preventDefault(); moveForward(); }}
                    style={{ ...btnStyle, position: 'absolute', top: 0, left: '50px', width: '50px', height: '50px' }}
                >▲</div>
                {/* DOWN */}
                <div
                    onPointerDown={(e) => { e.preventDefault(); moveBackward(); }}
                    style={{ ...btnStyle, position: 'absolute', bottom: 0, left: '50px', width: '50px', height: '50px' }}
                >▼</div>
                {/* LEFT */}
                <div
                    onPointerDown={(e) => { e.preventDefault(); turnLeft(); }}
                    style={{ ...btnStyle, position: 'absolute', top: '50px', left: 0, width: '50px', height: '50px' }}
                >◀</div>
                {/* RIGHT */}
                <div
                    onPointerDown={(e) => { e.preventDefault(); turnRight(); }}
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
                    onPointerDown={(e) => { e.preventDefault(); playerAttack(); }}
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
                    onPointerDown={(e) => { e.preventDefault(); switchWeapon(); }}
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

                {/* HEAL (Potion) */}
                <div
                    onPointerDown={(e) => {
                        e.preventDefault()
                        const potion = inventory.items.find(i => i.type === 'potion')
                        if (potion) {
                            console.log("Touch: Using potion", potion.id)
                            useItem(potion.id)
                        } else {
                            console.log("Touch: No potion found in inventory")
                        }
                    }}
                    style={{
                        ...btnStyle,
                        position: 'absolute',
                        bottom: '70px',
                        left: '0px',
                        width: '60px',
                        height: '60px',
                        fontSize: '20px',
                        background: 'rgba(50, 200, 50, 0.4)',
                        borderColor: 'rgba(100, 255, 100, 0.6)'
                    }}
                >🧪</div>

                {/* INTERACT (Simulate E) */}
                <div
                    onPointerDown={(e) => {
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
