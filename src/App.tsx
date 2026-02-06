import GameCanvas from './components/GameCanvas'
import PlayerController from './components/PlayerController'
import ItemRenderer from './components/ItemRenderer'

import HUD from './components/HUD'
import GameOverlay from './components/GameOverlay'
import WeaponOverlay from './components/WeaponOverlay'
import TouchControls from './components/TouchControls'
import Minimap from './components/Minimap'

function App() {
    return (
        <>
            <GameCanvas>
                <ItemRenderer />
            </GameCanvas>
            <PlayerController />
            <HUD />
            <TouchControls />
            <Minimap />
            <GameOverlay />
            <WeaponOverlay />
        </>
    )
}

export default App
