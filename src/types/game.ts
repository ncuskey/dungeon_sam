export interface Enemy {
    id: string
    x: number
    y: number
    type: 'imp'
    hp: number
}

export type ItemType = 'weapon' | 'potion' | 'key'

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
