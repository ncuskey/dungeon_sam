import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore, CELL_SIZE } from '../store/gameStore'

const EYE_HEIGHT = 1.6 // Meters approx

export default function CameraRig() {
    const playerPosition = useGameStore((state) => state.playerPosition)
    const playerDirection = useGameStore((state) => state.playerDirection)
    const shake = useGameStore((state) => state.shake)

    const targetPos = useRef(new THREE.Vector3()).current
    const targetQuat = useRef(new THREE.Quaternion()).current
    const dummyObject = useRef(new THREE.Object3D())
    const lightRef = useRef<THREE.PointLight>(null!)

    useFrame((state, delta) => {
        targetPos.set(
            playerPosition.x * CELL_SIZE,
            EYE_HEIGHT,
            playerPosition.y * CELL_SIZE
        )

        dummyObject.current.rotation.set(0, playerDirection * -(Math.PI / 2), 0)
        targetQuat.copy(dummyObject.current.quaternion)

        const speed = 15 * delta
        state.camera.position.lerp(targetPos, speed)
        state.camera.quaternion.slerp(targetQuat, speed)

        if (shake > 0) {
            const intensity = shake * 0.15
            state.camera.position.x += (Math.random() - 0.5) * intensity
            state.camera.position.y += (Math.random() - 0.5) * intensity
            state.camera.position.z += (Math.random() - 0.5) * intensity
        }

        // Manually sync lantern position to camera every frame
        if (lightRef.current) {
            lightRef.current.position.copy(state.camera.position)

            // Log occasionally to verify it's working
            if (Math.random() < 0.01) {
                console.log('Light synced to camera:', lightRef.current.position.toArray())
            }
        }
    })

    return (
        <pointLight
            ref={lightRef}
            intensity={3.0}
            distance={10}
            color="#ffcc66"
            decay={1.5}
        />
    )
}
