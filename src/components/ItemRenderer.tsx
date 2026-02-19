import { useGameStore, CELL_SIZE } from '../store/gameStore'
import Billboard from './Billboard'

export default function ItemRenderer() {
    const items = useGameStore((state) => state.items)

    const getItemTexture = (itemType: string, itemName?: string) => {
        if (itemType === 'potion') return '/potion_green.png' // Default to green
        if (itemName?.includes('Sword')) return '/sword_truth.png'
        if (itemName?.includes('Shield')) return '/shield.png'
        return undefined
    }

    return (
        <group>
            {items.map((item) => (
                <Billboard
                    key={item.id}
                    position={[
                        item.x * CELL_SIZE,
                        0.5,
                        item.y * CELL_SIZE
                    ]}
                    scale={[0.6, 0.6, 0.6]}
                    color={!getItemTexture(item.type, item.name) ? (item.type === 'weapon' ? 'cyan' : 'lime') : undefined}
                    textureUrl={getItemTexture(item.type, item.name)}
                />
            ))}
        </group>
    )
}
