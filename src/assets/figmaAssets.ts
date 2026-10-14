/**
 * Real asset references exported from the Figma file
 * (fileKey: NcMe5sSgPs65q3Ed2rV1Kv, node: 173648:282606 "Ra Form(Web)").
 *
 * NOTE ON PROVENANCE: this sandbox's outbound network proxy blocks
 * www.figma.com (curl / fetch return `403 blocked-by-allowlist`), so the
 * PNG/SVG bytes could not be downloaded and saved to disk here. These
 * constants point directly at the real Figma-exported CDN URLs (not
 * invented placeholders) returned by the Figma MCP `get_design_context` /
 * `download_assets` calls. Figma's asset URLs are valid for about 7 days.
 * To make the app fully offline/permanent, download each URL below and
 * replace the constant with a local `import` from this folder.
 */

import unitFloorplanB3Png from "./unit-floorplan-b3.png";
import dmciLogoSvg from "./dmci-logo.svg";
import acaciaEstatesPhoto from "./property-photos/acacia-estates.jpg";
import gardenPoolPhoto from "./property-photos/garden-pool.jpg";
import resortPoolPhoto from "./property-photos/resort-pool.webp";
import deckPoolPhoto from "./property-photos/deck-pool.webp";
import poolClubhouseNightPhoto from "./property-photos/pool-clubhouse-night.webp";
import aerialNightPhoto from "./property-photos/aerial-night.webp";
import noImageAvailablePng from "./no-image-available.png";
import noImageAvailableGraphicSvg from "./no-image-available-graphic.svg";
import thumbnailPhoto1Png from "./selfie-examples/too-far.jpg";
import thumbnailPhoto2Png from "./selfie-examples/sunglasses-on.jpg";
import thumbnailPhoto3Png from "./selfie-examples/face-turned.jpg";
import thumbnailPhoto4Png from "./selfie-examples/good-example.jpg";
import thumbnailOverexposedPng from "./selfie-examples/overexposed.jpg";
import idCardImagePng from "./dummyid.png";

const FIGMA_ASSET_BASE = "https://www.figma.com/api/mcp/asset";

// Sample unit floor plan (Accolade Place, "MID UNIT (B3)") supplied by the
// user as a reference for the "Property Unit Image" modal opened from the
// Unit / Unit Availability tables' image-icon row action. Bundled locally
// (not a remote Figma URL) so it never expires.
export const unitFloorplanB3Url = unitFloorplanB3Png;

// Header logo (shield symbol + "Sales" tag + "DMCI HOMES" wordmark, combined
// into one image). Supplied directly by the user, bundled locally so it
// never expires — the old three-part Figma CDN export (logoSymbolUrl /
// logoSalesUrl / logoTextUrl) broke after ~7 days once those temporary URLs
// expired.
export const dmciLogoUrl = dmciLogoSvg;

// "No Image Available" placeholder for property cards without a photo.
export const noImageAvailableUrl = noImageAvailablePng;

// Property card photos (Property List grid + Recently Viewed), replacing the
// project logos. Supplied directly by the user, bundled locally. Only the
// Acacia Estates photo shows its project (the entrance sign); the other five
// carry no name, so their project pairing is a best match by look. One photo
// per project, the same everywhere that project appears. There are five
// unnamed photos for seven projects, so two are shared.
export const projectPhotoUrls: Record<string, string> = {
  "Acacia Estates": acaciaEstatesPhoto,
  "Allegra Garden Place": gardenPoolPhoto, // green balconies
  "Alta Vista De Boracay": resortPoolPhoto, // tropical resort clubhouse
  "The Valeron Tower": deckPoolPhoto, // high-rise tower
  "Arista Place": poolClubhouseNightPhoto,
  "Anissa Heights": aerialNightPhoto,
  "The Aston Place": deckPoolPhoto,
  "The Atherton": poolClubhouseNightPhoto,
};

// "No Image Available" graphic (house icon + diagonal line + wordmark, all
// one vector) used on the Unit Availability Details "Property Unit Image"
// panel. Supplied directly by the user as inline SVG — node 173424:198691.
export const noImageAvailableGraphicUrl = noImageAvailableGraphicSvg;

// Take selfie / Upload Photo toggle icons
export const takeSelfieIconUrl = `${FIGMA_ASSET_BASE}/e2453afa-388a-465a-9988-cde9196fda9b`;
export const uploadIconUrl = `${FIGMA_ASSET_BASE}/17acb4da-c3f7-455e-b205-9044ad4491ff`;

// Left column: live selfie preview + capture button icon
export const selfiePreviewPhotoUrl = `${FIGMA_ASSET_BASE}/21e1a6b1-a80d-42b5-a225-4eb0e6d960b7`;
export const captureIconUrl = `${FIGMA_ASSET_BASE}/ab55786c-3812-4630-bf3e-b9291993b802`;

// Right column: uploaded government ID (UMID) photo - now using local image
export const idCardImageUrl = idCardImagePng;

// Thumbnail status badges
export const badgeXIconUrl = `${FIGMA_ASSET_BASE}/0629e1c3-f80d-4a34-a1ae-d335eea527cd`;
export const badgeCheckIconUrl = `${FIGMA_ASSET_BASE}/a661bd34-26e4-4ba5-84a9-74be8a634d43`;

// Previous selfie-attempt thumbnails (1-3 failed/red, 4 accepted/green) - now using local images
export const thumbnailPhoto1Url = thumbnailPhoto1Png;
export const thumbnailPhoto2Url = thumbnailPhoto2Png;
export const thumbnailPhoto3Url = thumbnailPhoto3Png;
export const thumbnailPhoto4Url = thumbnailPhoto4Png;
// "Overexposed" example (washed-out, too bright). All five "Check your photo"
// examples are 1600px JPEGs in ./selfie-examples so the full-size preview stays sharp.
export const thumbnailOverexposedUrl = thumbnailOverexposedPng;

// Client/Company Representative step (node 167635:167887) icons, saved
// locally from the Figma export: co-buyer/PEP section icon, red trash-02
// (remove entry), brand + white "plus" (upload circle / add buttons) and the
// 4px dot between the upload box's file-type and size limits.
export { default as coBuyerIconUrl } from "./co-buyer-icon.svg";
export { default as trashIconUrl } from "./trash-02.svg";
export { default as plusBrandIconUrl } from "./plus-brand.svg";
export { default as plusWhiteIconUrl } from "./plus-white.svg";
export { default as dotSeparatorUrl } from "./dot-separator.svg";

// Identity Verification step (node 167635:167877). The four example-ID
// thumbnails are flattened 1x crops of the frame render (each is ~190 pattern
// layers in Figma, and instance children can't be exported on their own);
// used as captioned good/bad examples under the upload area.
export { default as idExampleTiltedUrl } from "./id-example-tilted.png";
export { default as idExampleHandUrl } from "./id-example-hand.png";
export { default as idExampleBlurryUrl } from "./id-example-blurry.png";
export { default as idExampleGoodUrl } from "./id-example-good.png";

// Data Privacy step (node 167635:167885): clock beside each signer's "Signed on" time.
export { default as clockIconUrl } from "./clock.svg";

// Review & Submit step (node 167635:167900): sub-section arrow, Submit's send
// icon, and the sample ID / selfie / passport photos shown until the review
// is wired to the real uploads from steps 3-4.
export { default as arrowSquareRightIconUrl } from "./arrow-square-right.svg";
export { default as sendIconUrl } from "./send-01.svg";
export { default as reviewSampleIdUrl } from "./review-sample-id.png";
export { default as reviewSampleSelfieUrl } from "./review-sample-selfie.png";
export { default as reviewSamplePassportUrl } from "./review-sample-passport.png";
