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

    const { camera } = useThree()
    const lanternRef = useRef<THREE.PointLight | null>(null)

    // Create and attach lantern to camera ONCE
    useEffect(() => {
        const lantern = new THREE.PointLight('#ffcc66', 3.0, 10, 1.5)
        lantern.position.set(0, 0, 0)
        camera.add(lantern)
        lanternRef.current = lantern
        console.log('Lantern created and attached to camera')

        return () => {
            camera.remove(lantern)
            lantern.dispose()
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
    })

    return null // No JSX - light is managed imperatively
}
