# Debug Session: Swap Torch Left/Right Assets

## Symptom
The torches on side walls are showing the wrong side texture (pointing away from center or logically inverted).

**Expected:** Torch on the right side of view should use the asset that points towards the center.
**Actual:** Currently using `textures.right` for `sideDot > 0`.

## Hypotheses

| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Inverting the assignments in the `sideDot` conditional will resolve the visual mismatch. | 100% | UNTESTED |

## Plan
1. Swap `textures.left` and `textures.right` in `LevelRenderer.tsx`.
2. Build and deploy to verify.
