import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface BillboardProps {
    position: [number, number, number]
    color?: string
    scale?: [number, number, number]
}

export default function Billboard({ position, color = 'red', scale = [1, 1, 1] }: BillboardProps) {
    const meshRef = useRef<Mesh>(null)

    useFrame(({ camera }) => {
        if (meshRef.current) {
            // Look at camera, but lock Y axis usually? 
            // Doom sprites usually always face camera directly (spherical) or cylindrical.
            // Let's do spherical for simplicity first.
            meshRef.current.lookAt(camera.position)
        }
    })

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color={color} transparent />
        </mesh>
    )
}
