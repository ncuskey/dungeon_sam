# Debug Session: Production 404 Images

## Symptom
The deployed game throws 404 errors for all image assets (`/imp.png`, `/shield.png`, etc.) causing the WebGL Context to crash.

**When:** On load of the production URL (dungeonsam.site).
**Expected:** Images should load and render via `Billboard` components.
**Actual:** The server returns 404. `rsync --delete` deleted them from the remote server.

## Evidence
- `rsync --delete ./dist/ ...` output showed `deleting torch_right.png`, `deleting sword_truth.png`, etc.
- This suggests the images were not present inside `./dist/` after the Vite build process.

## Hypotheses
| # | Hypothesis | Likelihood | Status |
|---|------------|------------|--------|
| 1 | Images are incorrectly placed in the project root instead of `public/` directory | 95% | ELIMINATED |
| 2 | Images were deleted locally from `public/` before build | 99% | CONFIRMED |

## Attempts
### Attempt 1
**Testing:** H2 — Images deleted locally
**Action:** Ran `git status`
**Result:** Found `deleted: public/The_Watcher.png`, etc., indicating the files were missing from the local working tree but still tracked in git.
**Conclusion:** CONFIRMED

## Resolution
**Root Cause:** The `public/` directory assets were deleted from the local workspace. Because they were missing locally, `npm run build` did not copy them to `dist/`, and eventually `rsync --delete` deleted the remaining copies on the production server.
**Fix:** Ran `git checkout public/` to restore them from HEAD, followed by a rebuilt production bundle and another explicit `./deploy.sh`.
**Verified:** Will load production URL manually.
