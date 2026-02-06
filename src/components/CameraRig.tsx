import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
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
    const { camera } = useThree()

    // Aggressively attach light to camera once
    useEffect(() => {
        if (lightRef.current) {
            camera.add(lightRef.current)
            console.log("Lantern attached to camera")
        }
        return () => {
            if (lightRef.current) camera.remove(lightRef.current)
        }
    }, [camera])

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

        // Light is now a child of camera, so it follows perfectly
        // We just ensure it's at [0,0,0] relative to camera
        if (lightRef.current) {
            lightRef.current.position.set(0, 0, 0)
        }
    })

    return (
        <pointLight
            ref={lightRef}
            intensity={2.5} // Brighter lantern
            distance={10}   // More range
            color="#ffcc66"
            decay={1.5}
        />
    )
}
