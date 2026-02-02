import GameCanvas from './components/GameCanvas'
import PlayerController from './components/PlayerController'
import ItemRenderer from './components/ItemRenderer'

import HUD from './components/HUD'
import GameOverlay from './components/GameOverlay'
import WeaponOverlay from './components/WeaponOverlay'
import TouchControls from './components/TouchControls'

function App() {
    return (
        <>
            <GameCanvas>
                <ItemRenderer />
            </GameCanvas>
            <PlayerController />
            <HUD />
            <TouchControls />
            <GameOverlay />
            <WeaponOverlay />
        </>
    )
}

export default App
