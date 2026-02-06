# Debug Session: Minimap Zoom Issue (v0.4.1)

## Symptom
1. **Viewport mismatch**: The minimap is "zoomed in too far", potentially preventing the user from seeing their progress or the full context.
2. **Perception**: Because it's too zoomed in, it "seems like it isn't working" (possibly just showing a solid block of floor/wall).

**When:** During gameplay in v0.4.1.
**Expected:** The minimap should show a reasonable portion of the explored dungeon, centered on the player or showing the full map if small enough.
**Actual:** View is too tight.

## Evidence Gathering
- [ ] Check `dungeonGenerator.ts` for MAP_SIZE.
- [ ] Check `Minimap.tsx` for hardcoded `CELL_SIZE` and canvas dimensions.
- [ ] Verify if the map is being cropped by the canvas size.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | The map is larger than 30x30, but `Minimap.tsx` uses a fixed `CELL_SIZE=5` and `canvas=150px`, causing it to only show the top-most 30x30 cells. | 80% | UNTESTED |
| 2 | The user wants a "global" view but the current logic is too zoomed in for their taste. | 40% | UNTESTED |
| 3 | The player is moving out of the 150x150 viewport and into the "black" area because the map doesn't scroll/centered. | 70% | UNTESTED |

## Attempts

### Attempt 1
**Testing:** H1 & H3.
**Action:** 
1. Dynamically calculate `CELL_SIZE` based on actual map dimensions (or center the view on the player).
2. Implement a "follow player" scrolling minimap logic to ensure they never walk off the edge.
**Result:** Pending.
