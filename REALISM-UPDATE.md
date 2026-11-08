# Reference merchandise update · November 7, 2026

The four existing display templates now share a dedicated, shaped product model for the bubble/water blaster kit in the user's reference photograph. It replaces the reference demo's rectangular merchandise boxes; it does not replace the application or alter its layout calculator.

## Visual changes

- Traced and beveled blaster body/grip, raised purple motor shell, rounded yellow selector and barrel controls, curved linkages and upper lever.
- Three separately modeled visible reservoir forms: the attached chamber and two spare bottles.
- Thin printed backing card, folded base/cheeks, scalloped open front fascia and slim restraint ties. No invented full-front clear blister.
- Full package artwork is rectified from the supplied photograph; the earlier crop omitted the lower branding. Existing lettering and logos are sampled from the image, not regenerated.
- Photographed contents are removed from the backing layer so the raised geometry does not leave a second flat copy behind it. Visible front surfaces use registered photo projection; edge/rear materials use restrained matching colors.
- Lower ambient fill, molded-plastic highlights, paper/wood bump detail and contact shadows make the physical forms easier to read.

## Using it

Choose **View reference merchandise** to load the dedicated sample across all four styles, or select **Reference blaster kit · shaped 3D** for an individual SKU. Existing custom concepts are retained; loading the sample stores the previous concept and exposes **Return to previous concept**. The earlier, explicitly labeled three-SKU QA demo is upgraded automatically with a recoverable backup. New visitors start with the reference merchandise sample. Reference mode uses a calibrated photograph; other image/GLTF representations and uploads remain available.

## Validation

24 tests pass. New tests verify separate physical parts, finite geometry/UVs, uniform scaling within SKU envelopes, a supported baseline, project round-trip, missing-reference handling, and identical counts/placements between box/reference representations for all four styles.

Browser captures were reviewed in front and isometric views. All eight exported files are 2048 × 2048, with no browser application errors during capture. The illustrative reference configuration yields 120 shelf units, 24 waterfall units, 9 single-tray units and 9 high-back units. These counts come from the unmodified grid calculator with the sample's editable 7.5 W × 3.5 D × 8 H inch envelope. Changing the representation alone does not change them.

Previous-concept recovery and protection against overwriting the backup by repeatedly clicking the reference button were exercised in the browser. Screenshot/PNG evidence and a downloadable reference project are in the separate validation package.

## Limits

This is a hand-calibrated reconstruction for this particular photographed kit, not automatic general photo-to-3D conversion. Depth, unseen sides/backs and exact dimensions cannot be recovered accurately from one photograph and remain approximations. Photo shading is baked into portions of the front texture. Sample dimensions are estimates, not measurements or retailer approval. Other SKUs need suitable product-specific geometry or uploaded 3D models to achieve equivalent fidelity. No quantity changes, invented labels, prices or new promotional artwork were used to disguise the rendering.

Modified: dist/reference-pack.js (new), dist/scene.js, dist/app.js, dist/assets.js, dist/project.js, dist/plan.js (missing-reference validation only), dist/index.html/style.css, the bundled reference photograph, server MIME handling, package test command and reference.test.mjs. The original layout.js calculator, four display structures, SKU/pricing workflows and Feishu application were retained.
