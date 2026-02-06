import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const MINIMAP_SIZE = 150
const CELL_SIZE = 5 // 30x30 map * 5 = 150

export default function Minimap() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { map, exploredMap, playerPosition, playerDirection, exitPosition } = useGameStore()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE)

        // Draw Map
        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                const isExplored = exploredMap[y]?.[x]
                if (!isExplored) return

                ctx.fillStyle = cell === 1 ? '#444' : '#888'
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            })
        })

        // Draw Exit (if explored)
        if (exploredMap[exitPosition.y]?.[exitPosition.x]) {
            ctx.fillStyle = '#ff0000'
            ctx.fillRect(exitPosition.x * CELL_SIZE, exitPosition.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }

        // Draw Player
        ctx.fillStyle = '#00ff00'
        ctx.save()
        ctx.translate(playerPosition.x * CELL_SIZE + CELL_SIZE / 2, playerPosition.y * CELL_SIZE + CELL_SIZE / 2)
        // Rotation: 0=N, 1=E, 2=S, 3=W
        ctx.rotate(playerDirection * (Math.PI / 2) - Math.PI / 2)

        ctx.beginPath()
        ctx.moveTo(0, -3)
        ctx.lineTo(3, 3)
        ctx.lineTo(-3, 3)
        ctx.closePath()
        ctx.fill()
        ctx.restore()

    }, [map, exploredMap, playerPosition, playerDirection, exitPosition])

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: MINIMAP_SIZE,
            height: MINIMAP_SIZE,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            overflow: 'hidden',
            zIndex: 100,
            pointerEvents: 'none'
        }}>
            <canvas
                ref={canvasRef}
                width={MINIMAP_SIZE}
                height={MINIMAP_SIZE}
            />
        </div>
    )
}
