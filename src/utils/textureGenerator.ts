import * as THREE from 'three'

export const createTextures = () => {

    // Helper to create data URI from canvas
    const createDataTexture = (drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext('2d')!
        drawFn(ctx, 64, 64)

        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        return texture
    }

    // 1. Wall Texture (Bricks)
    const wallTexture = createDataTexture((ctx, w, h) => {
        ctx.fillStyle = '#4a4a4a'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#6e6e6e'

        const brickH = 16
        const brickW = 32

        for (let y = 0; y < h; y += brickH) {
            const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2
            for (let x = -brickW; x < w; x += brickW) {
                ctx.fillRect(x + offset + 1, y + 1, brickW - 2, brickH - 2)
            }
        }

        // Add noise
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
    })

    // 2. Floor Texture (Tiles)
    const floorTexture = createDataTexture((ctx, w, h) => {
        ctx.fillStyle = '#222'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#333'

        const tileS = 32
        for (let y = 0; y < h; y += tileS) {
            for (let x = 0; x < w; x += tileS) {
                if ((x / tileS + y / tileS) % 2 === 0) {
                    ctx.fillRect(x, y, tileS, tileS)
                }
            }
        }

        // Grit
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() > 0.9) {
                data[i] = data[i + 1] = data[i + 2] = 50 + Math.random() * 50
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    // 3. Ceiling Texture (Dark with dots)
    const ceilingTexture = createDataTexture((ctx, w, h) => {
        ctx.fillStyle = '#111'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#1a1a1a'
        for (let i = 0; i < 50; i++) {
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
        }
    })

    return { wallTexture, floorTexture, ceilingTexture }
}
