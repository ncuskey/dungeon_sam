import GameCanvas from './components/GameCanvas'
import PlayerController from './components/PlayerController'
import ItemRenderer from './components/ItemRenderer'
import StoryObjectRenderer from './components/StoryObjectRenderer'

import HUD from './components/HUD'
import GameOverlay from './components/GameOverlay'
import WeaponOverlay from './components/WeaponOverlay'
import TouchControls from './components/TouchControls'
import Minimap from './components/Minimap'
import StoryOverlay from './components/StoryOverlay'
import { useGameStore } from './store/gameStore'

function App() {
    const isMobile = useGameStore(state => state.isMobile)

    return (
        <>
            <GameCanvas>
                <ItemRenderer />
                <StoryObjectRenderer />
            </GameCanvas>
            <PlayerController />
            <HUD />
            {isMobile && <TouchControls />}
            <Minimap />
            <GameOverlay />
            <StoryOverlay />
            <WeaponOverlay />
        </>
    )
}

export default App
