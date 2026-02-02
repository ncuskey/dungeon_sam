import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore, CELL_SIZE } from '../store/gameStore'

const EYE_HEIGHT = 1.6 // Meters approx

export default function CameraRig() {
    const playerPosition = useGameStore((state) => state.playerPosition)
    const playerDirection = useGameStore((state) => state.playerDirection)

    // Target values
    const targetPos = new THREE.Vector3()
    const targetQuat = new THREE.Quaternion()
    const dummyObject = useRef(new THREE.Object3D()) // Helper for rotation calc

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
        // 0 = North (-Z), 1 = East (+X), 2 = South (+Z), 3 = West (-X)
        // ThreeJS default camera looks down -Z.
        // 0 (North) -> Rotation Y = 0
        // 1 (East) -> Rotation Y = -PI/2 (Turn Left? No, +X is Right/Left? Wait.)

        // Let's standardise:
        // North (0) -> Looking -Z. Camera default is looking -Z. Rotation Y = 0.
        // East (1) -> Looking +X. Rotation Y = -PI/2 (Left hand rule? No, Y-up, +X is right, -Z is forward)
        // Actually, looking +X requires rating around Y by -90 deg (-PI/2).
        // Let's set rotation based on direction index * -PI/2.

        dummyObject.current.rotation.set(0, playerDirection * -(Math.PI / 2), 0)
        targetQuat.copy(dummyObject.current.quaternion)

        // Smooth lerp
        const speed = 10 * delta
        state.camera.position.lerp(targetPos, speed)
        state.camera.quaternion.slerp(targetQuat, speed)
    })

    return null
}
