# Phase 3.1 · Local Product Economics

Implemented locally in the existing Walmart Display Studio. No publication, source push, hosting update, pricing API, cloud storage or Feishu operation was performed. The hosted Phase 3 site is unchanged.

## Running the updated studio

Double-click `Start-Local-Studio.cmd`, keep its window open, and visit http://127.0.0.1:4173/. Alternatively run `npm start`. No installation/build step or external package is needed. Server requires Node 18+; tests require Node 24+ for the existing import hooks.

Open Product Economics under the active SKU and Display Economics below the capacity cards. Both sections are expandable; the 3D preview remains central and has no financial overlay. Currency is USD throughout.

## Fields and calculations

Each SKU has separate First Cost, MSRP, combined Additional Unit Cost, Freight, Duty, Other, and a direct/separate additional-cost mode. Switching modes preserves both sets of entered values and uses only the selected mode, preventing double counting. All fields start unknown; enter zero explicitly when a component costs nothing. Separate landed costs require all three components to be entered, including explicit zeros.

Landed cost = First Cost + selected additional cost. Both IMUs use (MSRP − cost) / MSRP × 100. A shared, persisted First Cost / Estimated Landed Cost selector controls the unit gross profit and display profit/weighted IMU; its selected basis is shown in both panels. Both unit IMUs remain visible.

Display quantities come only from `plan(...).counts` and its actual placed total. A SKU repeated across compartments is aggregated once. Retail, first and landed totals sum quantity × the corresponding unit amount. Weighted IMU uses aggregate retail and selected cost dollars, never an average of SKU percentages. Decimal additions/products avoid binary-cent drift, and amounts are not rounded before multiplying quantities; display/CSV rounding is consistent at two decimals.

MSRP must exceed zero for valid retail/margin calculations. Negative/nonfinite costs are flagged without changing the values or disabling the 3D calculator. Unknown fields remain distinct from explicit zero. Incomplete metrics show labelled known subtotals and missing units/SKUs. Profit/weighted margin are withheld when their required inputs are incomplete. For example, complete First Cost economics can be shown while landed costs remain explicitly incomplete. Negative margins are displayed. An empty display has zero dollar totals and no artificial margin. Numeric overflow is identified and does not produce NaN/Infinity in reports.

These are illustrative margins using MSRP as assumed selling price, not verified Walmart actual IMU, acquisition costs or realized retail. No freight, duty, conversion, tax or selling-price data is invented.

## Storage and privacy

Uses the existing device IndexedDB project autosave and JSON backup/import. Pricing is nested under each SKU's `economics`; the original legacy `cost` and `price` fields are preserved. Old values are initially mapped to First Cost and assumed MSRP, with a visible migration note; users should verify that interpretation. Project-level `economicsBasis` is persisted. Invalid edits do not overwrite the last valid saved project; invalid pricing also blocks JSON backup until corrected.

Pricing-only edits refresh the economics panels and local save; they do not rebuild a Three.js scene. Geometry changes continue through the existing merchandising refresh and recalculate financials. Templates, cameras, uploads and project restoration retain SKU pricing.

The confidential CSV is generated locally only after clicking **Export confidential economics CSV**. It includes project/type/dimensions/date, USD and selected basis, SKU descriptions/quantities, entered unit costs/MSRP, additional/landed cost, both unit IMUs, extensions, profit, weighted IMU and completeness status. Partial reports are labelled; invalid values remain blank in calculations, and an entered zero MSRP remains recorded as zero with an invalid-margin explanation. Text cells are protected against spreadsheet formula injection.

Default buyer HTML now excludes First Cost, landed costs, profit and weighted IMU. It can show user-entered MSRP, clearly labelled as an assumed price. PNG remains exclusively the existing 3D canvas. Project backups and explicitly requested CSVs contain confidential commercial data; share them intentionally. Costs are not sent to external services. Existing optional font requests carry no pricing data.

## Numeric acceptance results

All examples below are synthetic QA values, not costs quoted for the photographed merchandise.

| Test | Inputs / action | Verified result |
| --- | --- | --- |
| A · single SKU | First $2.00, MSRP $4.97, additional $0.35 | Landed $2.35; First IMU 59.76%; Landed IMU 52.72%; unit profit $2.97 first / $2.62 landed |
| B · mixed quantities | A: 10 × (2 / 4.97 / .35), B: 3 × (3 / 10 / 1), C: 7 × (0 / 2 / 0), in First / MSRP / additional order | 20 units; retail $93.70; First $29.00; landed $35.50; landed-basis profit $58.20; weighted IMU 62.11% |
| C · quantity change | B quantity 3 → 2 | 19 units; retail $83.70; First $26.00; landed $31.50; profit $52.20; weighted IMU 62.37% |
| C · dimensions | Half pallet, B width 4 → 8 in | Capacity/quantities and all financial extensions changed through the existing plan; after change: 196 units, retail $865.48, landed $309.40, profit $556.08, IMU 64.25% |
| D · missing / zero MSRP | B MSRP blank, then zero | Blank case: $63.70 known retail subtotal, three units missing MSRP; profit and weighted IMU withheld. Zero explicitly flagged; 3D remains functional |
| Additional modes | B separate freight .50, duty .50, other 0 | Landed $4.00, identical to combined additional $1.00; original combined value retained |
| Negative margin | B First 3, additional 1, MSRP 2 | Landed IMU −100.00%; unit gross profit −$2.00 |
| E · persistence | Download JSON, close owned app tab, reopen same local origin; reimport backup | All three SKUs retained their distinct fields, explicit zeros, separate values, basis, assignments and imagery |
| F · CSV | Download through the actual CSV button; parse saved file independently | Quantities and all numeric extensions/weighted totals matched UI and model; dates, project/type/dimensions, basis and completeness included |
| G · privacy / 3D | Buyer HTML download; PNG exports; camera changes; PNG → WebP replacement | No buyer cost/profit totals; correct merchandise retained; pricing survived image replacement and camera/template transitions |
| Precision | First Cost 2.675 × 3 units | Raw total 8.025 → displayed/exported $8.03; unit inputs not rounded before extension |

## Nine-style browser regression

Same synthetic three-SKU catalog; all slots filled except the explicitly limited single-height tray. Both front/isometric views were operated, counts stayed unchanged, and each style exported a 2048 × 2048 PNG. Retail/first/landed/profit/IMU values were compared to an independent calculation from the saved project's authoritative plan, not inferred from the image.

| Style | Placed units | Retail USD | Landed USD | Landed-basis profit USD | Weighted IMU | Browser / PNG |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Half Pallet Shelf | 252 | 1,425.48 | 533.40 | 892.08 | 62.58% | Pass |
| Half Pallet Waterfall | 36 | 203.64 | 76.20 | 127.44 | 62.58% | Pass |
| Single-Height Tray | 20 | 93.70 | 35.50 | 58.20 | 62.11% | Pass |
| High Back / Stadium | 30 | 169.70 | 63.50 | 106.20 | 62.58% | Pass |
| Full Pallet Shelf | 504 | 2,850.96 | 1,066.80 | 1,784.16 | 62.58% | Pass |
| Stacking Trays | 288 | 1,629.12 | 609.60 | 1,019.52 | 62.58% | Pass |
| Flange Tray | 30 | 169.70 | 63.50 | 106.20 | 62.58% | Pass |
| 36-inch Endcap | 150 | 848.50 | 317.50 | 531.00 | 62.58% | Pass |
| 48-inch Endcap | 225 | 1,272.75 | 476.25 | 796.50 | 62.58% | Pass |

`npm test`: **57 tests pass** (43 prior regressions plus 14 economics tests). Checks include examples A–G, all nine plan integrations, aggregation, precision, invalid/missing/zero data, negative margins, project compatibility, CSV structure/escaping and buyer privacy. Browser log reported no errors. Existing `scene.js`, `phase3-scene.js`, `layout.js`, `plan.js` and `assets.js` are unchanged relative to the Phase 3 baseline.

Evidence is local under `qa/phase31/`: downloaded CSV/buyer HTML/project JSON, persisted-value checks, expected and browser financial results, nine PNGs and browser screenshots. It contains synthetic test pricing only and is excluded from the runnable source package.

## Modified files and limitations

- New `dist/economics.js`: pure unit/display calculations, validation, consistent formatting, confidential CSV.
- New `dist/economics-ui.js`: expandable SKU/summary controls and local download.
- `dist/app.js`: integration, pricing-only refresh, safe project backup.
- `dist/project.js`: compatible nested pricing and basis persistence/validation.
- `dist/exports.js`: buyer-safe defaults and new MSRP source.
- `dist/style.css`: compact styles matching the existing workspace.
- `economics.test.mjs`, `package.json`, README and this report; local Windows launcher.

USD only, no currency conversion. MSRP is an assumption; no realized sales, markdowns, taxes, financing, display-material/fixture costs or verified retailer acquisition costs are modeled. Blank logistics costs stay incomplete until explicitly entered. Numbers ultimately use finite JavaScript numeric range/precision; extreme overflow is withheld and identified. Storage is local to the browser/origin, not encrypted, synchronized or shared; clearing browser data loses it unless backed up. Project/CSV files contain private costs. Existing 3D/material/guide and hardware limits remain as documented for Phase 3. No new display styles, rendering architecture changes or hosting updates.
