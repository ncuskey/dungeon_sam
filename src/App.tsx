import GameCanvas from './components/GameCanvas'
import PlayerController from './components/PlayerController'
import ItemRenderer from './components/ItemRenderer'

import HUD from './components/HUD'
import GameOverlay from './components/GameOverlay'
import WeaponOverlay from './components/WeaponOverlay'
import TouchControls from './components/TouchControls'
import Minimap from './components/Minimap'
import { useGameStore } from './store/gameStore'

function App() {
    const isMobile = useGameStore(state => state.isMobile)

    return (
        <>
            <GameCanvas>
                <ItemRenderer />
            </GameCanvas>
            <PlayerController />
            <HUD />
            {isMobile && <TouchControls />}
            <Minimap />
            <GameOverlay />
            <WeaponOverlay />
        </>
    )
}

export default App
