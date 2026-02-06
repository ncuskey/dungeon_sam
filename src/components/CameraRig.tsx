import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore, CELL_SIZE } from '../store/gameStore'

const EYE_HEIGHT = 1.6 // Meters approx

export default function CameraRig() {
    const playerPosition = useGameStore((state) => state.playerPosition)
    const playerDirection = useGameStore((state) => state.playerDirection)

    const shake = useGameStore((state) => state.shake)

    // Refs and targets for smooth movement
    const targetPos = useRef(new THREE.Vector3()).current
    const targetQuat = useRef(new THREE.Quaternion()).current
    const dummyObject = useRef(new THREE.Object3D())
    const lightRef = useRef<THREE.PointLight>(null!)

    useFrame((state, delta) => {
        // Calculate target position
        // Map (x, y) corresponds to (x, z) in 3D
        // Center of cell = index * CELL_SIZE
        targetPos.set(
            playerPosition.x * CELL_SIZE,
            EYE_HEIGHT,
            playerPosition.y * CELL_SIZE
        )

        // Calculate target rotation
        dummyObject.current.rotation.set(0, playerDirection * -(Math.PI / 2), 0)
        targetQuat.copy(dummyObject.current.quaternion)

        // Smooth lerp
        const speed = 10 * delta
        state.camera.position.lerp(targetPos, speed)
        state.camera.quaternion.slerp(targetQuat, speed)

        // Apply Screen Shake
        if (shake > 0) {
            const intensity = shake * 0.15 // Adjust feel
            state.camera.position.x += (Math.random() - 0.5) * intensity
            state.camera.position.y += (Math.random() - 0.5) * intensity
            state.camera.position.z += (Math.random() - 0.5) * intensity
        }

        // Sync light position
        if (lightRef.current) {
            lightRef.current.position.copy(state.camera.position)
        }
    })

    return (
        <pointLight
            ref={lightRef}
            intensity={1.2}
            distance={6}
            color="#ffcc66"
            decay={2}
        />
    )
}
