import { useGameStore, CELL_SIZE } from '../store/gameStore'
import { useMemo, useState } from 'react'
import { createTextures } from '../utils/textureGenerator'
import * as THREE from 'three'
import Billboard from './Billboard'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

export default function LevelRenderer() {
    const map = useGameStore((state) => state.map)
    const lights = useGameStore((state) => state.lights)
    const { wallTexture, floorTexture, ceilingTexture } = useMemo(() => createTextures(), [])

    // Pre-load torch textures
    const torchFront = useLoader(THREE.TextureLoader, '/torch_front.png')
    const torchLeft = useLoader(THREE.TextureLoader, '/torch_left.png')
    const torchRight = useLoader(THREE.TextureLoader, '/torch_right.png')

    // Set filters for pixel art
    useMemo(() => {
        [torchFront, torchLeft, torchRight].forEach(t => {
            t.magFilter = THREE.NearestFilter
            t.minFilter = THREE.NearestFilter
        })
    }, [torchFront, torchLeft, torchRight])

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

    // Generate door data
    const doorTexture = useLoader(THREE.TextureLoader, '/door_fit.png')
    doorTexture.magFilter = THREE.NearestFilter
    doorTexture.minFilter = THREE.NearestFilter

    const doors = useMemo(() => {
        const doorData: { key: string; position: [number, number, number]; rotation: [number, number, number] }[] = []
        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 2 || cell === 3) {
                    // Check neighbors to orient door
                    const wallN = y > 0 && map[y - 1][x] === 1
                    const wallS = y < map.length - 1 && map[y + 1][x] === 1
                    const isEwPassage = wallN && wallS

                    const isOpen = cell === 3

                    doorData.push({
                        key: `door-${x}-${y}`,
                        position: [x * CELL_SIZE, CELL_SIZE / 2, y * CELL_SIZE],
                        rotation: [0, (isEwPassage ? Math.PI / 2 : 0) + (isOpen ? Math.PI / 2.5 : 0), 0]
                    })
                }
            })
        })
        return doorData
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

            {/* Doors */}
            {doors.map((door) => (
                <mesh key={door.key} position={door.position} rotation={door.rotation}>
                    <boxGeometry args={[CELL_SIZE, CELL_SIZE, 0.1]} />
                    <meshStandardMaterial map={doorTexture} transparent alphaTest={0.5} />
                </mesh>
            ))}

            {/* Dynamic Lights & Torch Visuals */}
            {lights.map(light => (
                <Torch
                    key={light.id}
                    light={light}
                    textures={{ front: torchFront, left: torchLeft, right: torchRight }}
                />
            ))}
        </group>
    )
}

function Torch({ light, textures }: { light: any, textures: { front: THREE.Texture, left: THREE.Texture, right: THREE.Texture } }) {
    const { camera } = useThree()
    const [texture, setTexture] = useState(textures.front)

    useFrame(() => {
        if (!light.facing) return

        // Direction vectors for wall attachment
        const facingVectors: Record<string, THREE.Vector3> = {
            'N': new THREE.Vector3(0, 0, -1),
            'S': new THREE.Vector3(0, 0, 1),
            'E': new THREE.Vector3(1, 0, 0),
            'W': new THREE.Vector3(-1, 0, 0)
        }

        const wallVec = facingVectors[light.facing]
        const torchPos = new THREE.Vector3(light.x * CELL_SIZE, CELL_SIZE * 0.7, light.y * CELL_SIZE)

        // Vector from camera to torch and camera direction
        const cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)

        // Dot product between camera direction and wall-facing
        // If they are aligned (facing same way) or anti-aligned (facing opposite), 
        // the wall is perpendicular to the view direction.
        const dot = Math.abs(cameraDir.dot(wallVec))

        if (dot > 0.7) {
            if (texture !== textures.front) setTexture(textures.front)
        } else {
            // Determine if it's left or right of center
            const cameraRight = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), cameraDir).normalize()
            const cameraToTorch = new THREE.Vector3().copy(torchPos).sub(camera.position).normalize()
            const sideDot = cameraToTorch.dot(cameraRight)

            if (sideDot > 0) {
                // To the right of center -> use left asset to point towards center
                if (texture !== textures.left) setTexture(textures.left)
            } else {
                // To the left of center -> use right asset to point towards center
                if (texture !== textures.right) setTexture(textures.right)
            }
        }
    })

    return (
        <group position={[light.x * CELL_SIZE, CELL_SIZE * 0.7, light.y * CELL_SIZE]}>
            <pointLight
                intensity={light.intensity}
                color={light.color}
                distance={light.distance}
                decay={1.5}
            />
            <Billboard
                position={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                texture={texture}
            />
        </group>
    )
}
