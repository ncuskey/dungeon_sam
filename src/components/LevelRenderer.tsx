import { useGameStore, CELL_SIZE } from '../store/gameStore'
import { useMemo } from 'react'
import { createTextures } from '../utils/textureGenerator'
import * as THREE from 'three'

export default function LevelRenderer() {
    const map = useGameStore((state) => state.map)
    const lights = useGameStore((state) => state.lights)
    const { wallTexture, floorTexture, ceilingTexture } = useMemo(() => createTextures(), [])

    // Generate wall data only when map changes
    const walls = useMemo(() => {
        const wallData: { key: string; position: [number, number, number] }[] = []

        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    wallData.push({
                        key: `${x}-${y}`,
                        position: [x * CELL_SIZE, CELL_SIZE / 2, y * CELL_SIZE]
                    })
                }
            })
        })
        return wallData
    }, [map])

    // Determine map bounds for floor
    const mapWidth = map[0]?.length || 0
    const mapHeight = map.length || 0
    const floorCenter: [number, number, number] = [
        (mapWidth * CELL_SIZE) / 2 - (CELL_SIZE / 2),
        0,
        (mapHeight * CELL_SIZE) / 2 - (CELL_SIZE / 2)
    ]

    // Update texture repeat for floor/ceiling based on map size
    useMemo(() => {
        floorTexture.repeat.set(mapWidth, mapHeight)
        ceilingTexture.repeat.set(mapWidth, mapHeight)
    }, [floorTexture, ceilingTexture, mapWidth, mapHeight])

    return (
        <group>
            {/* Walls */}
            {walls.map((wall) => (
                <mesh key={wall.key} position={wall.position}>
                    <boxGeometry args={[CELL_SIZE, CELL_SIZE, CELL_SIZE]} />
                    <meshStandardMaterial map={wallTexture} />
                </mesh>
            ))}

            {/* Floor */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={floorCenter}
            >
                <planeGeometry args={[mapWidth * CELL_SIZE, mapHeight * CELL_SIZE]} />
                <meshStandardMaterial map={floorTexture} side={THREE.DoubleSide} />
            </mesh>

            {/* Ceiling */}
            <mesh
                rotation={[Math.PI / 2, 0, 0]}
                position={[floorCenter[0], CELL_SIZE, floorCenter[2]]}
            >
                <planeGeometry args={[mapWidth * CELL_SIZE, mapHeight * CELL_SIZE]} />
                <meshStandardMaterial map={ceilingTexture} side={THREE.DoubleSide} />
            </mesh>

            {/* Dynamic Lights */}
            {lights.map(light => (
                <pointLight
                    key={light.id}
                    position={[light.x * CELL_SIZE, CELL_SIZE * 0.8, light.y * CELL_SIZE]}
                    intensity={light.intensity}
                    color={light.color}
                    distance={light.distance}
                    decay={2}
                />
            ))}
        </group>
    )
}
