import { useGameStore, CELL_SIZE } from '../store/gameStore'
import Billboard from './Billboard'
import { ARTIFACT_TEXTURES, SEALED_EXIT_TEXTURE, STORY_OBJECT_TEXTURES } from '../utils/constants'

export default function StoryObjectRenderer() {
    const artifacts = useGameStore(state => state.artifacts)
    const interactables = useGameStore(state => state.interactables)
    const exitSeal = useGameStore(state => state.puzzleLocks.exitSeal)

    return (
        <group>
            {artifacts.map((artifact) => (
                <Billboard
                    key={artifact.id}
                    position={[artifact.x * CELL_SIZE, 0.55, artifact.y * CELL_SIZE]}
                    scale={[0.7, 0.7, 0.7]}
                    textureUrl={ARTIFACT_TEXTURES[artifact.name] || artifact.textureUrl}
                    color="#9edcff"
                />
            ))}

            {interactables.map((interactable) => (
                <Billboard
                    key={interactable.id}
                    position={[interactable.x * CELL_SIZE, 0.75, interactable.y * CELL_SIZE]}
                    scale={[0.9, 0.9, 0.9]}
                    textureUrl={STORY_OBJECT_TEXTURES[interactable.name] || interactable.textureUrl}
                    color="#9edcff"
                />
            ))}

            {!exitSeal.unlocked && (
                <Billboard
                    position={[exitSeal.x * CELL_SIZE, 1, exitSeal.y * CELL_SIZE]}
                    scale={[1.3, 1.3, 1.3]}
                    textureUrl={SEALED_EXIT_TEXTURE}
                    color="#7fd7ff"
                />
            )}
        </group>
    )
}
