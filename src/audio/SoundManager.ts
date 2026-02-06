/**
 * SoundManager using Web Audio API for procedurally generated sounds.
 * No external audio files required - generates retro-style sounds on the fly.
 * 
 * Deathkeep-inspired audio aesthetic:
 * - SFX louder than music (80% vs 40%)
 * - Heavy reverb on footsteps
 * - Guttural monster sounds
 */

type WeaponType = 'fist' | 'sword'
type EnemySoundType = 'growl' | 'attack' | 'death'

interface VolumeSettings {
    master: number
    music: number
    sfx: number
}

class SoundManager {
    private static instance: SoundManager
    private audioContext: AudioContext | null = null
    private volumes: VolumeSettings = {
        master: 1.0,
        music: 0.4,   // Quieter - Deathkeep style
        sfx: 0.8,     // Louder than music - keeps player on edge
    }

    private isMuted = false
    private bgmOscillators: OscillatorNode[] = []
    private bgmGain: GainNode | null = null

    private constructor() {
        // Singleton - use getInstance()
    }

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager()
        }
        return SoundManager.instance
    }

    /**
     * Initialize Web Audio context. Must be called after user interaction.
     */
    init(): void {
        if (this.audioContext) return

        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        console.log('[SoundManager] Web Audio initialized')
    }

    private getEffectiveVolume(type: 'music' | 'sfx'): number {
        if (this.isMuted) return 0
        return this.volumes.master * this.volumes[type]
    }

    private ensureContext(): AudioContext {
        if (!this.audioContext) {
            this.init()
        }
        return this.audioContext!
    }

    // =========== BGM (Ominous Ambient Music) ===========

    private bgmNodes: AudioNode[] = []
    private bgmIntervals: number[] = []

    playBGM(): void {
        if (this.bgmOscillators.length > 0) return // Already playing

        const ctx = this.ensureContext()

        // Master gain for BGM
        this.bgmGain = ctx.createGain()
        this.bgmGain.gain.value = this.getEffectiveVolume('music') * 0.8
        this.bgmGain.connect(ctx.destination)

        // === Layer 1: Deep sub bass drone ===
        const subBass = ctx.createOscillator()
        subBass.type = 'sine'
        subBass.frequency.value = 35 // Very low rumble
        const subGain = ctx.createGain()
        subGain.gain.value = 0.7
        subBass.connect(subGain)
        subGain.connect(this.bgmGain)
        subBass.start()
        this.bgmOscillators.push(subBass)

        // === Layer 2: Dissonant minor second drone ===
        const drone1 = ctx.createOscillator()
        drone1.type = 'sawtooth'
        drone1.frequency.value = 40 // Lower rumble
        const drone1Filter = ctx.createBiquadFilter()
        drone1Filter.type = 'lowpass'
        drone1Filter.frequency.value = 200
        drone1Filter.Q.value = 2
        const drone1Gain = ctx.createGain()
        drone1Gain.gain.value = 0.35
        drone1.connect(drone1Filter)
        drone1Filter.connect(drone1Gain)
        drone1Gain.connect(this.bgmGain)
        drone1.start()
        this.bgmOscillators.push(drone1)
        this.bgmNodes.push(drone1Filter)

        // Slightly detuned for dissonance (tritone - the devil's interval)
        const drone2 = ctx.createOscillator()
        drone2.type = 'sawtooth'
        drone2.frequency.value = 56.57 // Tritone from 40Hz
        const drone2Filter = ctx.createBiquadFilter()
        drone2Filter.type = 'lowpass'
        drone2Filter.frequency.value = 150 // Cut harsh highs
        const drone2Gain = ctx.createGain()
        drone2Gain.gain.value = 0.25
        drone2.connect(drone2Filter)
        drone2Filter.connect(drone2Gain)
        drone2Gain.connect(this.bgmGain)
        drone2.start()
        this.bgmOscillators.push(drone2)
        this.bgmNodes.push(drone2Filter)


        // === Layer 3: High ethereal pad ===
        const pad = ctx.createOscillator()
        pad.type = 'sine'
        pad.frequency.value = 880 // A5 - higher ethereal
        const padGain = ctx.createGain()
        padGain.gain.value = 0.08
        pad.connect(padGain)
        padGain.connect(this.bgmGain)
        pad.start()
        this.bgmOscillators.push(pad)

        // === Modulation: Slow LFO for movement ===
        const lfo = ctx.createOscillator()
        lfo.type = 'sine'
        lfo.frequency.value = 0.03 // Very slow - 33 second cycle
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = 8
        lfo.connect(lfoGain)
        lfoGain.connect(drone1.detune)
        lfoGain.connect(drone2.detune)
        lfo.start()
        this.bgmNodes.push(lfo)

        // === Filter sweep for evolving tension ===
        const sweepFilter = () => {
            const now = ctx.currentTime
            drone1Filter.frequency.setValueAtTime(100, now)
            drone1Filter.frequency.linearRampToValueAtTime(400, now + 8)
            drone1Filter.frequency.linearRampToValueAtTime(100, now + 16)
        }
        sweepFilter()
        const sweepInterval = window.setInterval(sweepFilter, 16000)
        this.bgmIntervals.push(sweepInterval)

        // === Occasional ominous stinger ===
        const playStinger = () => {
            if (Math.random() > 0.3) return // Only 70% chance

            const stinger = ctx.createOscillator()
            stinger.type = 'triangle'
            stinger.frequency.value = 220 + Math.random() * 110
            const stingerGain = ctx.createGain()
            stingerGain.gain.setValueAtTime(0, ctx.currentTime)
            stingerGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5)
            stingerGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)
            stinger.connect(stingerGain)
            stingerGain.connect(this.bgmGain!)
            stinger.start()
            stinger.stop(ctx.currentTime + 3.5)
        }
        const stingerInterval = window.setInterval(playStinger, 12000)
        this.bgmIntervals.push(stingerInterval)

        console.log('[SoundManager] Ominous BGM started')
    }

    stopBGM(fadeMs = 1000): void {
        if (!this.bgmGain) return

        const ctx = this.ensureContext()
        this.bgmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeMs / 1000)

        // Clear intervals
        this.bgmIntervals.forEach(id => window.clearInterval(id))
        this.bgmIntervals = []

        setTimeout(() => {
            this.bgmOscillators.forEach(osc => {
                try { osc.stop() } catch { }
            })
            this.bgmOscillators = []

            this.bgmNodes.forEach(node => {
                try {
                    if (node instanceof AudioBufferSourceNode) node.stop()
                    if (node instanceof OscillatorNode) node.stop()
                } catch { }
            })
            this.bgmNodes = []

            this.bgmGain = null
        }, fadeMs)

        console.log('[SoundManager] BGM stopping')
    }

    // =========== SFX ===========

    playFootstep(): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        // Create low thump with reverb-like decay
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // Random pitch variation for natural feel
        const baseFreq = 80 + Math.random() * 40
        osc.frequency.value = baseFreq
        osc.type = 'sine'

        gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.3)
    }

    playAttack(weapon: WeaponType = 'fist'): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        if (weapon === 'sword') {
            // Sword swing - higher pitched sweep
            this.playSweep(ctx, 400, 200, 0.15, volume * 0.5, 'sawtooth')
        } else {
            // Fist punch - low thump
            this.playSweep(ctx, 150, 80, 0.1, volume * 0.4, 'sine')
        }
    }

    playHit(): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        // Impact crunch - noise burst
        const bufferSize = ctx.sampleRate * 0.1
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1))
        }

        const source = ctx.createBufferSource()
        const gain = ctx.createGain()
        source.buffer = buffer
        gain.gain.value = volume * 0.6

        source.connect(gain)
        gain.connect(ctx.destination)
        source.start()
    }

    playEnemySound(type: EnemySoundType): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        switch (type) {
            case 'growl':
                // Low rumbling growl
                this.playSweep(ctx, 80, 60, 0.4, volume * 0.5, 'sawtooth')
                break
            case 'attack':
                // Quick aggressive sound
                this.playSweep(ctx, 200, 100, 0.2, volume * 0.5, 'square')
                break
            case 'death':
                // Descending scream
                this.playSweep(ctx, 300, 50, 0.5, volume * 0.6, 'sawtooth')
                break
        }
    }

    playHurt(): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        // Quick pain sound - descending tone
        this.playSweep(ctx, 400, 200, 0.15, volume * 0.4, 'sine')
    }

    playPickup(): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        // Ascending chime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1)

        gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.2)
    }

    playHeal(): void {
        const ctx = this.ensureContext()
        const volume = this.getEffectiveVolume('sfx')

        // Shimmering ascending chord
        const freqs = [523.25, 659.25, 783.99, 1046.50] // C5 E5 G5 C6
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const startTime = ctx.currentTime + (i * 0.05)

            osc.type = 'sine'
            osc.frequency.value = freq

            gain.gain.setValueAtTime(0, startTime)
            gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.1)
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(startTime)
            osc.stop(startTime + 0.6)
        })
    }

    private playSweep(
        ctx: AudioContext,
        startFreq: number,
        endFreq: number,
        duration: number,
        volume: number,
        type: OscillatorType
    ): void {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration)

        gain.gain.setValueAtTime(volume, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + duration)
    }

    // =========== Controls ===========

    setMasterVolume(value: number): void {
        this.volumes.master = Math.max(0, Math.min(1, value))
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.getEffectiveVolume('music') * 0.3
        }
    }

    setMusicVolume(value: number): void {
        this.volumes.music = Math.max(0, Math.min(1, value))
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.getEffectiveVolume('music') * 0.3
        }
    }

    setSFXVolume(value: number): void {
        this.volumes.sfx = Math.max(0, Math.min(1, value))
    }

    toggleMute(): boolean {
        this.isMuted = !this.isMuted
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.isMuted ? 0 : this.getEffectiveVolume('music') * 0.3
        }
        return this.isMuted
    }

    getMuted(): boolean {
        return this.isMuted
    }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance()
