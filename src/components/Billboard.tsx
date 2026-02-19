import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Group, TextureLoader, NearestFilter, DoubleSide, Texture } from 'three'

interface BillboardProps {
    position: [number, number, number]
    color?: string
    scale?: [number, number, number]
    textureUrl?: string
    texture?: Texture | null
    hp?: number // Optional health bar
    lastHurtTime?: number
}

export default function Billboard({ position, color = 'red', scale = [1, 1, 1], textureUrl, texture: overrideTexture, hp, lastHurtTime }: BillboardProps) {
    const groupRef = useRef<Group>(null)
    const texture = overrideTexture || (textureUrl ? useLoader(TextureLoader, textureUrl) : null)

    if (texture) {
        texture.magFilter = NearestFilter
        texture.minFilter = NearestFilter
    }

    useFrame(({ camera }) => {
        if (groupRef.current) {
            groupRef.current.lookAt(camera.position)
        }
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Main sprite */}
            <mesh scale={scale}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={
                        lastHurtTime && (performance.now() - lastHurtTime < 150)
                            ? '#ff0000' // Red flash
                            : (!texture ? color : 'white')
                    }
                    map={texture}
                    transparent
                    side={DoubleSide}
                    alphaTest={0.5}
                />
            </mesh>
            {/* Health bar if hp is provided */}
            {hp !== undefined && (
                <group position={[0, scale[1] * 0.6, 0.01]}>
                    {/* Background */}
                    <mesh>
                        <planeGeometry args={[1, 0.1]} />
                        <meshBasicMaterial color="#333" side={DoubleSide} />
                    </mesh>
                    {/* Fill */}
                    <mesh position={[-(1 - hp / 100) * 0.5, 0, 0.01]}>
                        <planeGeometry args={[hp / 100, 0.08]} />
                        <meshBasicMaterial color={hp > 50 ? '#00ff00' : hp > 25 ? '#ffff00' : '#ff0000'} side={DoubleSide} />
                    </mesh>
                </group>
            )}
        </group>
    )
}
