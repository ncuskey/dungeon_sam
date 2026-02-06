import { useState, useCallback } from 'react'
import { soundManager } from '../audio/SoundManager'

interface UseAudioReturn {
    // Playback
    playFootstep: () => void
    playAttack: (weapon?: 'fist' | 'sword') => void
    playHit: () => void
    playEnemySound: (type: 'growl' | 'attack' | 'death') => void
    playHurt: () => void
    playPickup: () => void
    playBGM: () => void
    stopBGM: () => void

    // Controls
    isMuted: boolean
    toggleMute: () => void
}

/**
 * React hook for accessing the SoundManager.
 * Initialize audio on first use with user gesture.
 */
export function useAudio(): UseAudioReturn {
    const [isMuted, setIsMuted] = useState(false)
    const [initialized, setInitialized] = useState(false)

    // Initialize audio on first interaction (required by browsers)
    const ensureInitialized = useCallback(() => {
        if (!initialized) {
            soundManager.init()
            setInitialized(true)
        }
    }, [initialized])

    const playFootstep = useCallback(() => {
        ensureInitialized()
        soundManager.playFootstep()
    }, [ensureInitialized])

    const playAttack = useCallback((weapon: 'fist' | 'sword' = 'fist') => {
        ensureInitialized()
        soundManager.playAttack(weapon)
    }, [ensureInitialized])

    const playHit = useCallback(() => {
        ensureInitialized()
        soundManager.playHit()
    }, [ensureInitialized])

    const playEnemySound = useCallback((type: 'growl' | 'attack' | 'death') => {
        ensureInitialized()
        soundManager.playEnemySound(type)
    }, [ensureInitialized])

    const playHurt = useCallback(() => {
        ensureInitialized()
        soundManager.playHurt()
    }, [ensureInitialized])

    const playPickup = useCallback(() => {
        ensureInitialized()
        soundManager.playPickup()
    }, [ensureInitialized])

    const playBGM = useCallback(() => {
        ensureInitialized()
        soundManager.playBGM()
    }, [ensureInitialized])

    const stopBGM = useCallback(() => {
        soundManager.stopBGM()
    }, [])

    const toggleMute = useCallback(() => {
        const newMuted = soundManager.toggleMute()
        setIsMuted(newMuted)
    }, [])

    return {
        playFootstep,
        playAttack,
        playHit,
        playEnemySound,
        playHurt,
        playPickup,
        playBGM,
        stopBGM,
        isMuted,
        toggleMute,
    }
}
