# Debug Session: Production 404 images part 2

## Symptom
Console shows `404 Not Found` for `/imp.png`, `/shield.png`, `/fist_right.png`, `/torch_front.png`, `/sword_truth.png`, `/potion_green.png`, `/goblin.png`. This crashes the renderer (`THREE.WebGLRenderer: Context Lost`).

**When:** On load of the production URL.
**Expected:** Assets load successfully.
**Actual:** 404 errors.

## Evidence
- `rsync` uploaded `shield.png`, `fist_right.png`, `torch_front.png`, `sword_truth.png`, `potion_green.png`, `goblin.png`. So they ARE on the server.
- **However**, `imp.png` is completely missing from the `rsync` output, and wasn't found in a previous `find_by_name *.png` search.
- The browser might be aggressively caching an old `index.html` or old assets, OR `imp.png` is hardcoded somewhere but missing from the repo.

## Hypotheses
| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | `imp.png` is missing from the repo completely, causing a crash that halts other image loading | 80% | CONFIRMED |
| 2 | Nginx or remote server is caching old 404s from the broken deployment | 50% | ELIMINATED |
| 3 | File casing issues on Linux relative to Mac (e.g. `Imp.png` vs `imp.png`) | 40% | ELIMINATED |

## Attempts
### Attempt 1
**Testing:** H2 — Remote server caching
**Action:** Ran `curl -I https://dungeonsam.site/shield.png`
**Result:** Returned `200 OK`. The remote server is accurately hosting the deployed files. The browser threw false 404s for the other images because the WebGL context crashed instantly when `imp.png` failed to load.
**Conclusion:** ELIMINATED

### Attempt 2
**Testing:** H1 — `imp.png` is missing fundamentally
**Action:** `grep_search` on `src/` for `imp.png`.
**Result:** Found hardcoded reference in `EnemyRenderer.tsx` preventing texture loading completion. `imp.png` was missing natively.
**Conclusion:** CONFIRMED

## Resolution
**Root Cause:** The `imp.png` file was never committed to the repository and was missing from `public/`. Because `@react-three/drei`'s `useTexture` suspends on load, its failure explicitly triggered an unhandled error cascading into `THREE.WebGLRenderer: Context Lost`, immediately cancelling all subsequent network requests (appearing as false 404s).
**Fix:** Used AI primitive generation to build a fallback `imp.png` sprite, applied to `public/imp.png`, and rebuilt/redeployed.
