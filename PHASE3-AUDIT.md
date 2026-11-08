# Phase 3 baseline audit · November 7, 2026

Inspected before Phase 3 implementation: app.js, plan.js, layout.js, project.js, scene.js, assets.js, exports.js, index.html, the Phase 2/reference tests, and the supplied guide extraction.

## Existing working foundation

The application is buildless JavaScript, not React. Preserve this architecture and its existing UI; introducing React would be an unnecessary rebuild. It has a browser-local IndexedDB catalog/project store, stable SKU IDs, optional retail price, image crop/mask/upload, six representations including the calibrated reference kit, independent template allocations, custom shelf/step settings, instanced merchandise, camera framing, 2K/4K PNG and buyer HTML export. All four earlier presets and their original calculator must remain regression-tested. No external product database or Feishu integration is present.

## Incomplete baseline functionality

- No SKU search, cost field or aggregate cost/retail calculation exists. Add these alongside the existing catalog rather than claiming an existing backend integration.
- The layout engine supports only forward-facing surfaces; it cannot safely allocate opposing pallet faces or independent stacked modules. Extend its surface contract before adding multi-face rendering.
- Dividers use equal widths only; stock-depth controls and merchandise removal clearance are absent. Add explicit, validated controls with defaults that preserve Phase 2 placements.
- No fixture/insert separation, metal endcap components, pegboard, attachment geometry or store-context option exists.
- Guide notes only cover half pallets and simple trays; no configurable guide limits, module overhang/underhang or endcap rules exist.
- Current four-style tests assume unrotated rectangular surfaces. Preserve their coverage explicitly, and add independent rotated-volume and support tests for Phase 3.
- A single reference photograph cannot provide measured dimensions, unseen surfaces, material load capacity or manufacturing certification. Keep these limits visible; do not present the new models as engineering-approved.

## Shared defects to address before extension

Use one surface/placement result for capacity and rendering. Explicitly partition opposing faces, reserve support/divider thickness, reject invalid module grids before constructing geometry, and preserve the original four-style quantities when optional new controls are unset. Provide readable errors and prevent incomplete or unsupported configurations from exporting. Continue to lock configuration during export and preserve uploaded assets across template/camera changes.

## Guide references inspected

2017 Canada guide: printed pp.21 (full pallets), 23 (stacked trays), 31 (rounded flange corners/retention), 32–33 (endcap limits and attachment), 77–78 (fixture anatomy and width classes). Fixture dimensions must remain distinct from 70-inch-high/15-inch-deep corrugated insert limits. Current US/buyer exceptions and physical engineering still require confirmation.
