import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function GameCanvas() {
    return (
        <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            <OrbitControls />
        </Canvas>
    )
}

export default GameCanvas
