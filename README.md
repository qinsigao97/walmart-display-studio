# Walmart Display Studio 2.0

An independent retail display planning prototype developed with AI assistance for a founder-documentary course project. It is not affiliated with or endorsed by Walmart. This repository is a private review copy of the current working build.

## Run locally

1. Install Node.js 18 or newer if it is not already available.
2. Download this repository using **Code → Download ZIP**, then extract it.
3. On Windows, double-click **Start-Local-Studio.cmd** and keep the window open. Alternatively run `npm start` from this folder.
4. Open **http://127.0.0.1:4173/** in the same computer's browser.

No dependency installation or build is needed. Three.js is bundled. This local address cannot be opened remotely unless the instructor runs the project on their own computer. Publishing this repository does not publish a live website.

## What works

- Nine Three.js formats: Half Pallet Shelf, Half Pallet Waterfall, Single-Height Tray, High Back/Stadium Tray, Full Pallet Shelf, Stacking Trays, Flange Tray, 36-inch Endcap and 48-inch Endcap.
- Per-SKU dimensions, photographs, crop/mask controls, uploaded self-contained GLB/GLTF models, and separate allocations by face, shelf, tray or compartment.
- Capacity checks from physical clearances, divider positions, facings, rows and quantities. Valid merchandise remains visible when another assignment fails; final exports require a valid layout.
- Front/isometric/top cameras, face-focused **Show in 3D**, PNG exports and buyer HTML.
- Local Product Economics: First Cost, MSRP, combined or separate additional costs, landed cost, both IMUs, gross profit and dollar-weighted display IMU using actual placed quantities.
- Explicit confidential CSV export and JSON project backups. Default buyer reports and image exports exclude supplier costs and profitability.

## Tests and evidence

Run `npm test` with **Node.js 24 or newer**. The current build has **68 passing automated tests**. Tests cover capacity, product bounds/support, project round-trips, economics/rounding, missing data, buyer-report privacy and the pallet SKU display regression.

Browser testing also exercised all nine formats, SKU/image replacement, camera switching and PNG output. The pallet repair was retested against real uploaded SKUs. Historical results and limitations are documented in:

- [Pallet assignment repair](PALLET-ASSIGNMENT-FIX.md)
- [Product Economics report](PHASE31-REPORT.md)
- [Phase 3 report](PHASE3-REPORT.md)
- [Baseline audit](PHASE3-AUDIT.md)
- [Reference merchandise realism update](REALISM-UPDATE.md)
- [Phase 2 report](PHASE2-REPORT.md)

These reports describe successive local snapshots. Private raw project backups and capture folders referenced by the reports are intentionally excluded. They are not evidence that every documentary deliverable or course checkpoint has been submitted. This repository starts with the current snapshot; earlier GitHub commits have not been invented or backdated.

## Privacy and data

User-entered projects, uploaded catalog images and costs stay in that browser's IndexedDB or explicitly downloaded files. They are not a shared cloud database. Back up important work; clearing browser storage can erase it. Project JSON and economics CSV contain private pricing and should be shared intentionally.

The repository excludes private catalog exports, company pricing files, credentials, hosting configuration and local publication metadata. The one bundled reference-store photograph is part of the existing reference-merchandise demo. Review that image and all branding before changing repository visibility or redistributing assets. A private repository requires the owner to grant instructor access separately.

## Limits

This is a buyer-concept prototype, not structural engineering, manufacturing drawings or retailer compliance approval. Defaults reference a supplied 2017 Walmart Canada guide; the guide itself is not included. Product dimensions and unseen reference-kit surfaces are estimates. Generic photos are not automatic full 3D reconstruction; cutouts are 2.5D.

Economics use USD and MSRP as an assumed selling price, not verified retailer acquisition costs or actual Walmart IMU. Freight/duty are never invented. Blank fields remain unknown. No currency conversion, realized-sales model, multiuser cloud synchronization or production load/stability validation is provided.

WebGL 2/hardware acceleration is required. Model/storage/GPU limits apply; 4K export depends on GPU capability. Third-party Three.js licensing is retained under `dist/vendor/`. No open-source license is granted for project-specific code or supplied reference artwork by this upload.
