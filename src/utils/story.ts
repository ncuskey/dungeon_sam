import type { StoryBeat, StoryBeatId } from '../types/game'

export const ECHO_SIGIL_ARTIFACT_ID = 'echo_sigil'
export const USE_INTERACT_PROMPT = 'The Echo Sigil pulses against the seal. Use Interact to place it.'

export const STORY_BEATS: Record<StoryBeatId, StoryBeat> = {
    mara_intro: {
        id: 'mara_intro',
        speaker: 'Mara',
        text: 'Sam? If you can hear me, follow the echoes. The dungeon has sealed the way out, but a piece of my voice is still trapped here.',
        portraitUrl: '/ally_portrait.png',
        clue: 'Follow Mara\'s echoes and search the dungeon.'
    },
    locked_exit_hint: {
        id: 'locked_exit_hint',
        speaker: 'Mara',
        text: 'The seal will not open to strength. It needs an Echo Sigil. Search the rooms the dungeon tried to hide.',
        portraitUrl: '/ally_portrait.png',
        clue: 'Find the Echo Sigil before returning to the sealed exit.'
    },
    echo_sigil_discovery: {
        id: 'echo_sigil_discovery',
        speaker: 'Mara',
        text: 'That is it-the Echo Sigil. Carry it back to the sealed exit. I can help you wake the door.',
        portraitUrl: '/ally_portrait.png',
        clue: 'Bring the Echo Sigil to the sealed exit.'
    },
    seal_unlock: {
        id: 'seal_unlock',
        speaker: 'Mara',
        text: 'The seal remembers my voice. Go, Sam-the path is open.',
        portraitUrl: '/ally_portrait.png',
        clue: 'Step onto the exit to descend.'
    }
}
