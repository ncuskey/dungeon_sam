import { Canvas } from '@react-three/fiber'
import CameraRig from './CameraRig'

function GameCanvas() {
    return (
        <Canvas camera={{ fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {/* Reference Cube at 0,0 */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            {/* Reference Cube at 4,6 (Player Start) */}
            <mesh position={[4, 0, 6]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="cyan" />
            </mesh>
            <CameraRig />
            <gridHelper args={[20, 10]} />
        </Canvas>
    )
}

export default GameCanvas
