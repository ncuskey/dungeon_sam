import { useGameStore, CELL_SIZE } from '../store/gameStore'
import Billboard from './Billboard'

export default function EnemyRenderer() {
    const enemies = useGameStore((state) => state.enemies)

    const getEnemyTexture = (type: string) => {
        if (type === 'goblin') return '/goblin.png'
        return '/The_Watcher.png'
    }

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
                    textureUrl={getEnemyTexture(enemy.type)}
                    hp={enemy.hp}
                    lastHurtTime={enemy.lastHurtTime}
                />
            ))}
        </group>
    )
}
