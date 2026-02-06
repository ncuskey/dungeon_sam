# Audio Assets

This directory contains the game's audio assets.

## Required Files

### Sound Effects (`sfx/`)
Generate these using [jsfxr](https://sfxr.me/) or [sfxr.me](https://sfxr.me/):

| File | Description | jsfxr Preset |
|------|-------------|--------------|
| `footstep_1.mp3` | Stone footstep | Pickup / Blip |
| `footstep_2.mp3` | Stone footstep variant | Pickup / Blip |
| `footstep_3.mp3` | Stone footstep variant | Pickup / Blip |
| `attack_fist.mp3` | Punch whoosh | Shoot / Laser |
| `attack_sword.mp3` | Sword swing | Powerup |
| `attack_hit.mp3` | Impact sound | Explosion |
| `enemy_growl.mp3` | Monster alert | Random |
| `enemy_death.mp3` | Death scream | Random |
| `enemy_attack.mp3` | Enemy attack | Hit / Hurt |
| `player_hurt.mp3` | Player pain grunt | Hit / Hurt |
| `item_pickup.mp3` | Pickup chime | Pickup / Blip |

### Music (`music/`)
Generate an ambient drone using:
- [Ambient Mixer](https://www.ambient-mixer.com/)
- [MyNoise](https://mynoise.net/noiseMachines.php)
- AI tools like Suno or AIVA

| File | Description |
|------|-------------|
| `dungeon_drone.mp3` | 2-3 min looping ambient drone. Low, dissonant, no rhythm. |

## Audio Style Guide (Deathkeep-inspired)

- **Music**: Sparse, oppressive drones. No melody. Unresolved harmony.
- **SFX**: LOUDER than music. Exaggerated reverb on footsteps.
- **Default volumes**: Music 40%, SFX 80%
