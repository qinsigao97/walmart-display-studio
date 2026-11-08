# Phase 3 implementation and validation · November 7, 2026

All nine requested formats are implemented in the existing static JavaScript/Three.js application. The four earlier formats, shaped reference merchandise, uploads, local catalog/projects, pricing, cameras and exports remain available. No React migration, new renderer, external database, Feishu change or Phase 4 display template was introduced. PHASE3-AUDIT.md records the baseline gaps inspected before implementation.

## New geometry

| Format | Physical structure and merchandise contract |
| --- | --- |
| Full Pallet Shelf | 48 × 40; 43 body + 5 pallet + optional 8 header. Wood boards/stringers, reinforced corners, decks/rails, corrugated walls. Two opposing faces by default; four-face option partitions front/back bands and independent middle side zones. Independent SKU compartments; opposing volumes cannot overlap. |
| Stacking Trays | Full 48 × 40 or half 48 × 20 pallet; 43 body, four aligned levels by default. Configurable grid, tray dimensions, 0/90° orientation and access direction. Folded shoulders/rear compression panels, corner posts, lips, tabs/slots and deck contact support the next level. Unsupported/oversized grids are rejected. |
| Flange Tray | 29.5 / 35.5 / 47.5 overall width classes, 14 depth. Folded body, rounded outward flanges, lip, rear support and optional retention tabs. Capacity deducts wings, walls and retention space. Adjustable flange/rear height, compartments, facings and rows. |
| 36-inch Endcap | Separate nominal 36-inch steel fixture and 35.5-inch active/insert width. Physical fixture default 18 D × 77.75 H; active envelope 15 D × 70 H. Pegboard, uprights, base/kickplate, brackets/lips, adjustable shelves/depth. Corrugated mode adds side/rear walls and attachment clips. |
| 48-inch Endcap | Same reusable construction with actual 48-inch fixture / 47.5-inch active width. Genuinely wider mesh and selling area; products retain their own dimensions. Independent shelf and compartment allocations. |

Dimensions are inches. Guide defaults come from the supplied November 16, 2017 Walmart Canada guide, printed pp.17, 20–24, 27–28, 31–33 and 77–78. Fixture dimensions remain separate from corrugated insert limits. The PDF and synced project references were not modified or bundled into the site.

## Shared changes

`phase3-layout.js` supplies structural zones/modules/levels. `plan.js` retains `layout.js` as the per-surface calculator and transforms its placements into world coordinates. `phase3-scene.js` constructs the five structures from those same results and adds a separate procedural store backdrop. `scene.js` retains lighting, caching, instancing, disposal, cameras and PNG capture. Camera/environment changes do not rebuild merchandise.

`phase3-ui.js` extends the original UI with format-specific settings, fixture/insert separation, configurable guide notes, divider percentages, removal clearance and shelf depth. Allocation rows show face/module, across/deep/high counts and totals. `app.js`, `project.js` and `exports.js` add local SKU search, nullable unit costs, known-value totals, compatibility defaults and buyer-sheet information. Old concepts are retained. Original presets keep their quantities when optional new allowances are unset.

Browser review corrected a mobile workspace overflow and immediate-update gaps in the new numeric/shelf controls. Physical-mesh tests caught a folded lip edge protruding into stock space; its depth now stays inside the reserved allowance. Stacking trays received folded side shoulders and rear compression panels after visual review of the first pass.

## Nine-style acceptance table

Each row passed the running-browser checks for empty/one-SKU/three-SKU configurations, custom width, PNG upload followed by WebP replacement, retained SKU association, isometric/front cameras and PNG export. All were visually inspected. Reference counts use one 7.5 W × 3.5 D × 8 H kit, full assigned capacity, default .25 gap and no dividers. Mixed counts use three unequal compartments with divider cuts at 30% / 65%.

| Style | Reference units | Mixed units | Empty / 1 / 3 SKU | Upload / replace | Custom size | Iso / front / 2K PNG |
| --- | ---: | ---: | --- | --- | --- | --- |
| Half Pallet Shelf | 120 | 272 | Pass | Pass | Pass | Pass |
| Half Pallet Waterfall | 24 | 40 | Pass | Pass | Pass | Pass |
| Single-Height Tray | 9 | 29 | Pass | Pass | Pass | Pass |
| High Back / Stadium | 9 | 29 | Pass | Pass | Pass | Pass |
| Full Pallet Shelf | 240 | 544 | Pass | Pass | Pass | Pass |
| Stacking Trays | 160 | 368 | Pass | Pass | Pass | Pass |
| Flange Tray | 9 | 24 | Pass | Pass | Pass | Pass |
| 36-inch Endcap | 60 | 145 | Pass | Pass | Pass | Pass |
| 48-inch Endcap | 90 | 240 | Pass | Pass | Pass | Pass |

The first stack acceptance pass used three levels (120 reference / 276 mixed); final default/captures use four levels (160 / 368) to reduce unused height. Final mixed/empty/view/export checks were repeated for this adjustment. Other fixtures are unchanged. Mixed test products: kit 6 × 3 × 7, cutout 4 × 2.5 × 6, cylinder 3 × 2.5 × 6 (W × D × H). QA photographs are synthetic assets except the supplied kit image.

## Validation and evidence

- **43 automated tests passed, zero failures.** Includes all original tests; all nine calculations and project round-trips; true rotated world bounds; pairwise stock collisions; independent four-face zones; full/half/rotated aligned modules; custom divider positions/pitches/depth/clearance; rows/facings and price/cost totals. Five tests construct actual Three.js structural meshes and verify that allocated merchandise does not intersect walls, decks or supports for relevant variants of every new style.
- Browser exports: all nine isometric and nine front PNGs checked at **2048 × 2048**, with unchanged counts between cameras. Mixed and empty PNGs also exported per style. A **4096 × 4096 RGBA** corrugated-endcap export was checked, including transparent corners. Buyer HTML downloaded with embedded render, SKU quantities and totals.
- Additional browser configurations: four-face pallet; changed shelf count; half-pallet and rotated trays with changed levels; flange/rear-support edits and retention toggle; corrugated 36/48 inserts with headers and shelf adjustments; endcap shelf depth; store/current-environment export. Invalid grid and too-wide merchandise displayed blocking errors; valid configurations restored rendering/export.
- PNG/WebP replacement was exercised on every format and confirmed in the SKU's original-image preview. Shared catalog retained each SKU's asset across templates. All nine allocations restored through JSON import. Reference concept restored after QA.
- Evidence: `qa/phase3/browser-reference-results.json`, `browser-acceptance.json`, per-style browser screenshots, reference front/isometric PNGs, mixed/empty PNGs, overview sheets, alternative configurations, buyer HTML and acceptance projects. QA files are excluded from deployment assets.
- Visual review covered reference/front/isometric, mixed and empty outputs: artwork, contact with shelves, framing, spacing, fixture widths and module support. Neutral blank print surfaces are intentional. Narrow-screen workspace overflow was corrected.

## Known limitations

Buyer-concept models are not certified commercially manufacturable designs. No load ratings, board compression, tipping/stability, joint engineering, shipping cases, die lines or transport testing. The 2017 Canada guide supplies historical defaults; current US and buyer exceptions require separate confirmation. Materials, attachments, weights, retention and shopper removal need physical verification.

The shaped reference kit uses one photograph and editable estimated dimensions; hidden details remain approximate. New photographs do not automatically become true 3D merchandise: cutouts are 2.5D, and box/open-carton/cylinder forms are generic. Irregular products need measured dimensions and suitable real GLB/GLTF models. Artwork is neither invented nor stretched. Store context is an unbranded procedural backdrop, not a photographed/scanned store.

One SKU per compartment/face/module section, with uniform rows. Divide sections for assortments. No mixed packing within one section, automatic nesting, arbitrary staggered tray stacks or Phase 4 standalone fixtures. Not every module edge is shopper-accessible in every grid; verify the chosen access direction. Blank goal-post signs generate no retailer price claims.

Catalog data stays in the browser or downloaded JSON. No cloud database, Feishu integration or live product/pricing search. Totals include entered values only, show missing-value counts and assume no currency. Limits: 24 SKUs, 12 levels, 6 compartments, 1–6 module grid rows/columns, 600 calculated units per surface, 2,400 overall, active W/H up to 120 in and D up to 80 in. Images up to 8 MB/resampled 2048 px; models up to 20 MB, embedded resources only, static pose, no Draco/Meshopt/KTX2. Large/complex scenes can be slower; storage/GPU limits apply. WebGL 2 required. 4K is GPU-dependent; alpha export omits floor shadows. Buyer PDF uses browser printing.
