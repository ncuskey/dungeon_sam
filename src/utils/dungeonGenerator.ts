export const MAP_WIDTH = 30
export const MAP_HEIGHT = 30
export const MIN_LEAF_SIZE = 6
export const MAX_LEAF_SIZE = 12

interface Room {
    x: number
    y: number
    w: number
    h: number
}

class Leaf {
    x: number
    y: number
    w: number
    h: number
    leftChild?: Leaf
    rightChild?: Leaf
    room?: Room

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    split(): boolean {
        if (this.leftChild || this.rightChild) return false // Already split

        // Determine direction of split
        // If width > 25% height, split vertically
        // If height > 25% width, split horizontally
        // Otherwise random
        let splitH = Math.random() > 0.5
        if (this.w > this.h && this.w / this.h >= 1.25) splitH = false
        else if (this.h > this.w && this.h / this.w >= 1.25) splitH = true

        const max = (splitH ? this.h : this.w) - MIN_LEAF_SIZE
        if (max <= MIN_LEAF_SIZE) return false // Too small to split

        const split = Math.floor(Math.random() * (max - MIN_LEAF_SIZE + 1)) + MIN_LEAF_SIZE

        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.w, split)
            this.rightChild = new Leaf(this.x, this.y + split, this.w, this.h - split)
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.h)
            this.rightChild = new Leaf(this.x + split, this.y, this.w - split, this.h)
        }

        return true
    }

    createRooms() {
        if (this.leftChild || this.rightChild) {
            if (this.leftChild) this.leftChild.createRooms()
            if (this.rightChild) this.rightChild.createRooms()

            // If this leaf has children, it doesn't have a room itself, 
            // but we can retrieve a room from one of its children to connect later
            if (this.leftChild && this.rightChild) {
                const leftRoom = this.leftChild.getRoom()
                const rightRoom = this.rightChild.getRoom()
                if (leftRoom && rightRoom) {
                    createCorridor(leftRoom, rightRoom)
                }
            }
        } else {
            // This is a leaf node, create a room
            const roomW = Math.floor(Math.random() * (this.w - 3)) + 3 // Min room size 3
            const roomH = Math.floor(Math.random() * (this.h - 3)) + 3
            const roomX = Math.floor(Math.random() * (this.w - roomW)) + this.x
            const roomY = Math.floor(Math.random() * (this.h - roomH)) + this.y

            this.room = { x: roomX, y: roomY, w: roomW, h: roomH }
        }
    }

    getRoom(): Room | undefined {
        if (this.room) return this.room

        let lRoom: Room | undefined
        let rRoom: Room | undefined

        if (this.leftChild) lRoom = this.leftChild.getRoom()
        if (this.rightChild) rRoom = this.rightChild.getRoom()

        if (!lRoom && !rRoom) return undefined
        if (!lRoom) return rRoom
        if (!rRoom) return lRoom

        // Randomly return one to facilitate connections further up (simple heuristic)
        return Math.random() > 0.5 ? lRoom : rRoom
    }
}

// Global map array during generation
let map: number[][] = []

function createCorridor(roomA: Room, roomB: Room) {
    const pointA = {
        x: Math.floor(roomA.x + roomA.w / 2),
        y: Math.floor(roomA.y + roomA.h / 2)
    }
    const pointB = {
        x: Math.floor(roomB.x + roomB.w / 2),
        y: Math.floor(roomB.y + roomB.h / 2)
    }

    // Simple L-shape corridor
    if (Math.random() > 0.5) {
        // Horizontal then Vertical
        for (let x = Math.min(pointA.x, pointB.x); x <= Math.max(pointA.x, pointB.x); x++) {
            map[pointA.y][x] = 0
        }
        for (let y = Math.min(pointA.y, pointB.y); y <= Math.max(pointA.y, pointB.y); y++) {
            map[y][pointB.x] = 0
        }
    } else {
        // Vertical then Horizontal
        for (let y = Math.min(pointA.y, pointB.y); y <= Math.max(pointA.y, pointB.y); y++) {
            map[y][pointA.x] = 0
        }
        for (let x = Math.min(pointA.x, pointB.x); x <= Math.max(pointA.x, pointB.x); x++) {
            map[pointB.y][x] = 0
        }
    }
}

import { v4 as uuidv4 } from 'uuid'

export function generateDungeon() {
    // 1. Initialize empty map (1 = wall)
    map = []
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = []
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = 1
        }
    }

    // 2. Create Root Leaf
    const leaves: Leaf[] = []
    const root = new Leaf(0, 0, MAP_WIDTH, MAP_HEIGHT)
    leaves.push(root)

    let didSplit = true
    while (didSplit) {
        didSplit = false
        for (const leaf of leaves) {
            if (!leaf.leftChild && !leaf.rightChild) { // is leaf
                // Attempt to split
                if (leaf.w > MAX_LEAF_SIZE || leaf.h > MAX_LEAF_SIZE || Math.random() > 0.25) {
                    if (leaf.split()) {
                        leaves.push(leaf.leftChild!)
                        leaves.push(leaf.rightChild!)
                        didSplit = true
                    }
                }
            }
        }
    }

    // 3. Create Rooms & Corridors
    root.createRooms()

    // 4. Fill Map with Rooms
    function paintRooms(leaf: Leaf) {
        if (leaf.room) {
            for (let y = leaf.room.y; y < leaf.room.y + leaf.room.h; y++) {
                for (let x = leaf.room.x; x < leaf.room.x + leaf.room.w; x++) {
                    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
                        map[y][x] = 0
                    }
                }
            }
        }
        if (leaf.leftChild) paintRooms(leaf.leftChild)
        if (leaf.rightChild) paintRooms(leaf.rightChild)
    }

    paintRooms(root)

    // 5. Find Start and Exit
    const allRooms: Room[] = []
    function collectRooms(leaf: Leaf) {
        if (leaf.room) allRooms.push(leaf.room)
        if (leaf.leftChild) collectRooms(leaf.leftChild)
        if (leaf.rightChild) collectRooms(leaf.rightChild)
    }
    collectRooms(root)

    let startPos = { x: 1, y: 1 }
    let exitPos = { x: 1, y: 1 }

    if (allRooms.length > 0) {
        const firstRoom = allRooms[0]
        const lastRoom = allRooms[allRooms.length - 1]

        startPos = {
            x: Math.floor(firstRoom.x + firstRoom.w / 2),
            y: Math.floor(firstRoom.y + firstRoom.h / 2)
        }

        exitPos = {
            x: Math.floor(lastRoom.x + lastRoom.w / 2),
            y: Math.floor(lastRoom.y + lastRoom.h / 2)
        }
    }

    // 6. Spawn Enemies & Items
    const initialEnemies: any[] = [] // [{id, x, y, type, hp, moveCooldown}]
    const initialItems: any[] = []

    const isOccupied = (x: number, y: number) => {
        if (x === startPos.x && y === startPos.y) return true
        if (x === exitPos.x && y === exitPos.y) return true
        return false
    }

    // Place 1 Sword of Truth in a random room (not the first one)
    if (allRooms.length > 1) {
        const swordRoomIdx = Math.floor(Math.random() * (allRooms.length - 1)) + 1
        const swordRoom = allRooms[swordRoomIdx]
        initialItems.push({
            id: uuidv4(),
            x: Math.floor(swordRoom.x + swordRoom.w / 2),
            y: Math.floor(swordRoom.y + swordRoom.h / 2),
            type: 'weapon',
            name: 'Sword of Truth',
            effectValue: 50
        })
    }

    allRooms.forEach(room => {
        // Enemies
        const ex = Math.floor(room.x + room.w / 2)
        const ey = Math.floor(room.y + room.h / 2)
        if (!isOccupied(ex, ey) && Math.random() > 0.5) {
            const type = Math.random() > 0.4 ? 'imp' : 'goblin'
            initialEnemies.push({
                id: uuidv4(),
                x: ex,
                y: ey,
                type,
                hp: type === 'goblin' ? 60 : 100,
                moveCooldown: type === 'goblin' ? 1 : 2
            })
        }

        // Potions - rarer and capped
        let roomPotions = 0
        for (let py = room.y; py < room.y + room.h; py++) {
            if (roomPotions >= 2) break
            for (let px = room.x; px < room.x + room.w; px++) {
                if (roomPotions >= 2) break
                // Don't spawn on start/exit or existing items
                if (!isOccupied(px, py) && !initialItems.some(i => i.x === px && i.y === py)) {
                    if (Math.random() < 0.02) { // 2% chance per cell in room
                        initialItems.push({
                            id: uuidv4(),
                            x: px,
                            y: py,
                            type: 'potion',
                            name: 'Health Potion',
                            effectValue: 50
                        })
                        roomPotions++
                    }
                }
            }
        }
    })

    return {
        map,
        startPosition: startPos,
        exitPosition: exitPos,
        initialEnemies,
        initialItems
    }
}
