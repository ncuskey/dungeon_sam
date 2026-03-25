import { useGameStore, CELL_SIZE } from '../store/gameStore'
import { useMemo, useState, useRef, useEffect } from 'react'
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

    const doorMaterials = useMemo(() => {
        const doorTextureFlipped = doorTexture.clone()
        doorTextureFlipped.wrapS = THREE.RepeatWrapping
        doorTextureFlipped.repeat.x = -1
        
        const front = new THREE.MeshStandardMaterial({ map: doorTexture, transparent: true, alphaTest: 0.5, side: THREE.FrontSide })
        const back = new THREE.MeshStandardMaterial({ map: doorTextureFlipped, transparent: true, alphaTest: 0.5, side: THREE.FrontSide })
        const edge = new THREE.MeshStandardMaterial({ color: 0x333333 })
        
        const leftHinge = [edge, edge, edge, edge, front, back]
        const rightHinge = [edge, edge, edge, edge, back, front]
        
        return { leftHinge, rightHinge }
    }, [doorTexture])

    const doors = useMemo(() => {
        const doorData: {
            key: string;
            pivotPosition: [number, number, number];
            meshPosition: [number, number, number];
            rotation: [number, number, number];
            isLeftHinge: boolean;
        }[] = []
        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 2 || cell === 3) {
                    // Check neighbors to orient door
                    const wallN = y > 0 && map[y - 1][x] === 1
                    const wallS = y < map.length - 1 && map[y + 1][x] === 1
                    const wallW = x > 0 && map[y][x - 1] === 1
                    const wallE = x < row.length - 1 && map[y][x + 1] === 1
                    
                    let isEwPassage = false
                    if ((wallN || wallS) && !wallW && !wallE) {
                        isEwPassage = true
                    } else if ((wallW || wallE) && !wallN && !wallS) {
                        isEwPassage = false
                    } else {
                        // Fallback: which axis has more walls bounding it
                        const sumNS = (wallN ? 1 : 0) + (wallS ? 1 : 0)
                        const sumEW = (wallW ? 1 : 0) + (wallE ? 1 : 0)
                        isEwPassage = sumNS > sumEW
                    }

                    const isOpen = cell === 3

                    // Determine where to put the hinge based on adjacent solid corners
                    let pivotX = x * CELL_SIZE
                    let pivotZ = y * CELL_SIZE
                    let offsetX = 0
                    let offsetZ = 0
                    let baseRotation = 0
                    let swingRotation = 0

                    // Check corners to see where corridor walls continue
                    const nw = map[y - 1]?.[x - 1] === 1
                    const ne = map[y - 1]?.[x + 1] === 1
                    const sw = map[y + 1]?.[x - 1] === 1
                    const se = map[y + 1]?.[x + 1] === 1

                    if (isEwPassage) {
                        // East-West Passage (walls on North/South, open East/West)
                        if (nw) {
                            // Hinge North, Swing West
                            pivotZ -= CELL_SIZE / 2
                            offsetX = -CELL_SIZE / 2
                            baseRotation = Math.PI / 2
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        } else if (ne) {
                            // Hinge North, Swing East
                            pivotZ -= CELL_SIZE / 2
                            offsetX = CELL_SIZE / 2
                            baseRotation = -Math.PI / 2
                            swingRotation = isOpen ? Math.PI / 2 : 0
                        } else if (sw) {
                            // Hinge South, Swing West
                            pivotZ += CELL_SIZE / 2
                            offsetX = -CELL_SIZE / 2
                            baseRotation = -Math.PI / 2
                            swingRotation = isOpen ? Math.PI / 2 : 0
                        } else if (se) {
                            // Hinge South, Swing East
                            pivotZ += CELL_SIZE / 2
                            offsetX = CELL_SIZE / 2
                            baseRotation = Math.PI / 2
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        } else {
                            // Fallback (Hinge North, Swing West)
                            pivotZ -= CELL_SIZE / 2
                            offsetX = -CELL_SIZE / 2
                            baseRotation = Math.PI / 2
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        }
                    } else {
                        // North-South Passage (walls on West/East, open North/South)
                        if (nw) {
                            // Hinge West, Swing North
                            pivotX -= CELL_SIZE / 2
                            offsetX = CELL_SIZE / 2
                            baseRotation = 0
                            swingRotation = isOpen ? Math.PI / 2 : 0
                        } else if (ne) {
                            // Hinge East, Swing North
                            pivotX += CELL_SIZE / 2
                            offsetX = -CELL_SIZE / 2
                            baseRotation = 0
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        } else if (sw) {
                            // Hinge West, Swing South
                            pivotX -= CELL_SIZE / 2
                            offsetX = CELL_SIZE / 2
                            baseRotation = 0
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        } else if (se) {
                            // Hinge East, Swing South
                            pivotX += CELL_SIZE / 2
                            offsetX = -CELL_SIZE / 2
                            baseRotation = 0
                            swingRotation = isOpen ? Math.PI / 2 : 0
                        } else {
                            // Fallback (Hinge West, Swing South)
                            pivotX -= CELL_SIZE / 2
                            offsetX = CELL_SIZE / 2
                            baseRotation = 0
                            swingRotation = isOpen ? -Math.PI / 2 : 0
                        }
                    }

                    doorData.push({
                        key: `door-${x}-${y}`,
                        pivotPosition: [pivotX, CELL_SIZE / 2, pivotZ],
                        meshPosition: [offsetX, 0, offsetZ],
                        rotation: [0, baseRotation + swingRotation, 0],
                        isLeftHinge: offsetX > 0
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
                <Door key={door.key} door={door} materials={doorMaterials} />
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

function Door({ door, materials }: { door: any, materials: any }) {
    const groupRef = useRef<THREE.Group>(null)

    // Set initial rotation instantly on mount to avoid swinging from 0
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = door.rotation[1]
        }
    }, []) // Run once on mount

    useFrame((_, delta) => {
        if (!groupRef.current) return
        const targetY = door.rotation[1]
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, delta * 8)
    })

    return (
        <group ref={groupRef} position={door.pivotPosition}>
            <mesh position={door.meshPosition} material={door.isLeftHinge ? materials.leftHinge : materials.rightHinge}>
                <boxGeometry args={[CELL_SIZE, CELL_SIZE, 0.1]} />
            </mesh>
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
            // Calculate the camera's true "Right" vector
            const cameraRight = new THREE.Vector3().crossVectors(cameraDir, new THREE.Vector3(0, 1, 0)).normalize()
            
            // Project the direction TO the wall onto the camera's Right vector.
            // If the wall is to the visual right, sideDot > 0.
            const sideDot = wallVec.dot(cameraRight)

            if (sideDot > 0) {
                // Wall is visually on the right -> use 'right' texture (bracket on right)
                if (texture !== textures.right) setTexture(textures.right)
            } else {
                // Wall is visually on the left -> use 'left' texture (bracket on left)
                if (texture !== textures.left) setTexture(textures.left)
            }
        }
    })

    return (
        <group position={[light.x * CELL_SIZE, CELL_SIZE * 0.7, light.y * CELL_SIZE]}>
            <pointLight
                position={[0, 0.3, 0]}
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
