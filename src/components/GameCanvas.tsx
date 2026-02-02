import { Canvas } from '@react-three/fiber'
import CameraRig from './CameraRig'
import LevelRenderer from './LevelRenderer'

import EnemyRenderer from './EnemyRenderer'
import useGameLoop from '../hooks/useGameLoop'

interface GameCanvasProps {
    children?: React.ReactNode
}

function GameCanvas({ children }: GameCanvasProps) {
    useGameLoop()

    return (
        <Canvas camera={{ fov: 75 }}>
            <ambientLight intensity={0.2} />
            {/* <directionalLight position={[0, 10, 0]} intensity={0.3} /> Removed for dynamic lighting atmosphere */}

            <LevelRenderer />
            <EnemyRenderer />
            {children}

            {/* Test Billboard in empty space */}
            {/* <Billboard position={[6, 1, 6]} color="green" /> */}

            <CameraRig />
        </Canvas>
    )
}

export default GameCanvas
