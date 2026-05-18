export interface Enemy {
    id: string
    x: number
    y: number
    type: 'imp' | 'goblin' | 'watcher' | 'rubble'
    hp: number
    lastHurtTime?: number
    moveCooldown: number
}

export type ItemType = 'weapon' | 'potion' | 'key' | 'shield'
export type QuestArtifactId = 'echo_sigil'
export type StoryBeatId = 'mara_intro' | 'locked_exit_hint' | 'echo_sigil_discovery' | 'seal_unlock'

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
    equippedShieldId: string | null
}

export interface QuestArtifact {
    id: string
    artifactId: QuestArtifactId
    x: number
    y: number
    name: string
    description: string
    textureUrl: string
}

export interface StoryBeat {
    id: StoryBeatId
    speaker: string
    text: string
    portraitUrl: string
    clue: string
}

export interface Interactable {
    id: string
    x: number
    y: number
    kind: 'story'
    storyBeatId: StoryBeatId
    textureUrl: string
    name: string
    repeatable?: boolean
}

export interface PuzzleLock {
    id: 'exitSeal'
    x: number
    y: number
    requiredArtifactId: QuestArtifactId
    unlocked: boolean
}

export interface PuzzleLocks {
    exitSeal: PuzzleLock
}

export interface Light {
    id: string
    x: number
    y: number
    intensity: number
    color: string
    distance: number
    facing?: 'N' | 'S' | 'E' | 'W'
}
