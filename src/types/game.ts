export interface Enemy {
    id: string
    x: number
    y: number
    type: 'imp' | 'goblin'
    hp: number
    lastHurtTime?: number
    moveCooldown: number
}

export type ItemType = 'weapon' | 'potion' | 'key' | 'shield'

export interface Item {
    id: string
    x: number
    y: number
    type: ItemType
    name: string
    effectValue?: number // Damage for weapons, heal for potions
}

export interface Inventory {
    items: Item[]
    maxSize: number
    equippedWeaponId: string | null
}

export interface Light {
    id: string
    x: number
    y: number
    intensity: number
    color: string
    distance: number
}
