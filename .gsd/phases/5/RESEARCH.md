# Research: Phase 5 - Verification & Launch

## Verification Targets (v0.5)

### 1. Goblins (Phase 2)
- **Check**: Do Goblins spawn in balanced distribution (approx 40% vs Imps 60%)?
- **Check**: Do Goblins move faster than Imps (cooldown 1 vs 2)?
- **Check**: Do Goblins have correct HP (60) and Damage (8)?

### 2. Shields (Phase 3)
- **Check**: Does picking up a shield auto-equip it?
- **Check**: Is damage reduced by 50% when a shield is equipped?
- **Check**: Does the HUD correctly display "SHIELD: [NAME]"?

### 3. Environmental Overhaul (Phase 4)
- **Check**: Do torches change textures (Front/Left/Right) based on player position?
- **Check**: Do doors appear at room/corridor junctions?
- **Check**: Can the player walk through doors?
- **Check**: Are textures crisp (NearestFilter applied)?

### 4. Regression Testing
- **Check**: Does the Player Lantern still track correctly?
- **Check**: Do Potions still heal and use hotkeys?
- **Check**: Does the Minimap still reveal correctly?

## Deployment Prep
- Run `npm run build` locally.
- Confirm total chunk sizes (manage warnings if possible).
- Verify the site on different browsers if necessary (Mobile/Desktop).

## Final Polish Items
- [ ] Update `ROADMAP.md` Must-Haves to reflect completion.
- [ ] Fix any typos in Phase objectives.
- [ ] Ensure all debug logs are removed.
