# Pallet SKU assignment repair · November 8, 2026

Local repair to the Phase 3.1 project. No hosting publication, source push, external pricing operation or Feishu change.

## Cause

The Craft Kit is 10 inches high. The four-tier full pallet permits 9.35 inches after the configured removal clearance; the four-tier stack permits 9.50 inches. A fit error correctly rejected that placement, but the renderer incorrectly hid every other product as well. Assignment rows showed only zero counts, with the explanation far below the preview.

The actual full-pallet project had an additional limit mismatch: five rows and 30 units requested for a 6.6 W × 4.5 D inch product in a 46.8 W × 19.325 D inch face zone. Six across × four deep = 24 fit. The affected full-pallet assignment is on the back face, hidden by the default front-facing camera.

## Repair

- The shared plan identifies rejected slots with specific error messages. Valid slots retain their safe positions/counts; invalid facing/row/quantity settings never leak unsupported units into the preview.
- The existing Three.js builder renders those safe placements during a partial preview. Structural/global catalog errors and the 2,400-unit limit still block unsafe previews. Final PNG/buyer/financial exports remain blocked until the complete layout is valid.
- Immediate per-row feedback shows height/footprint/count limits while retaining selector focus. A visible preview warning explains why a SKU was omitted. Correctly configured merchandise no longer disappears because another slot fails.
- Explicit actions provide equal-spaced tier suggestions, editing the affected SKU, or using automatic facings/rows/quantity for that zone. They do not silently resize merchandise or reduce requested quantities. Tier suggestions preserve every currently assigned SKU and leave saved inactive-tier allocations available when levels are restored.
- **Show in 3D** on an assignment points the isometric camera at its front/back/side face or tray. It changes the camera only. Normal camera controls and format switching reset to the normal front-facing orientation.
- JSON project backups can preserve a structurally valid project with a merchandising fit warning. Schema/pricing checks still apply; final buyer/image/financial exports still require a fully valid layout.

## Actual project verification

The original project was backed up privately under `qa/assignment-fix/user-project-before.json`. The browser repair used the explicit tier/capacity controls:

| Format | Corrected configuration | Craft Kit units | Total placed |
| --- | --- | ---: | ---: |
| Full pallet | Three equal-spaced tiers; back tier 1 uses Auto facings/rows/units | 24 | 174 |
| Stacking trays | Three equal-spaced tiers; existing two tray allocations retained | 9 | 19 |

All four SKU records—including every image, dimension, crop/model and pricing field—were compared before/after and are unchanged. Branding and all other templates are unchanged. No uploaded image was replaced. Original full-pallet upper-tier assignments remain saved if four tiers are restored, although the 10-inch Craft Kit would again need a fit correction at that spacing.

Both formats were tested by changing the assignment SKU-2 → SKU-3 → SKU-2. Counts and merchandise updated correctly: full-pallet back zone 24 units; stacked tray 6 units of SKU-3 versus 9 of SKU-2. The user's Craft Kit assignments were restored afterward. Both completed displays produced valid 2048 × 2048 PNGs; the full pallet was reviewed from the assigned back face. Browser console reported no errors.

## Tests and files

`npm test`: 68 tests, zero failures: all 57 existing tests plus nine plan/suggestion regression tests and two tests calling the actual Three.js scene builder with a partial-invalid plan. Coverage includes retained safe merchandise, invalid row/facing/quantity filtering, explicit separate height/capacity corrections, no disappearing-SKU tier suggestions and structural/global safety gates.

Modified `dist/plan.js`, `dist/scene.js`, `dist/app.js`, `dist/style.css` and the test command. Added `assignment-fix.test.mjs` and `assignment-render.test.mjs`. The existing renderer architecture, upload system, nine display styles, economics formulas and storage schema are retained.

Run the local project using `Start-Local-Studio.cmd`, then open http://127.0.0.1:4173/. The updated ZIP contains source/tests/documentation, not private project backups or user upload data. Existing local SKU/project data is retained in the browser. Partial previews are for diagnosis, not final compliant layouts; a product that exceeds actual clearances must still be resolved explicitly.
