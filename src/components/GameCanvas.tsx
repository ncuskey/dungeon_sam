import { Canvas } from '@react-three/fiber'
import CameraRig from './CameraRig'
import LevelRenderer from './LevelRenderer'
import Billboard from './Billboard'

function GameCanvas() {
    return (
        <Canvas camera={{ fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <LevelRenderer />

            {/* Test Billboard in empty space */}
            <Billboard position={[6, 1, 6]} color="green" />

            <CameraRig />
        </Canvas>
    )
}

export default GameCanvas
