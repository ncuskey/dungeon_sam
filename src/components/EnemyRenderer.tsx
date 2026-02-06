import { useGameStore, CELL_SIZE } from '../store/gameStore'
import Billboard from './Billboard'

export default function EnemyRenderer() {
    const enemies = useGameStore((state) => state.enemies)

    return (
        <group>
            {enemies.map((enemy) => (
                <Billboard
                    key={enemy.id}
                    position={[
                        enemy.x * CELL_SIZE,
                        1,
                        enemy.y * CELL_SIZE
                    ]}
                    scale={[1.5, 1.5, 1.5]}
                    textureUrl="/The_Watcher.png"
                    hp={enemy.hp}
                    lastHurtTime={enemy.lastHurtTime}
                />
            ))}
        </group>
    )
}
