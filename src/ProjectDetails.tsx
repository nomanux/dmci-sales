import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Layout, { PageBackHeading } from "./Layout";
import { BuildingIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Badge } from "./StatusBadge";
import { useNavigation, type Screen } from "./NavigationContext";
import PropertyCard, { type PropertyCardData } from "./PropertyCard";
import {
  projectGallerySampleUrls,
  projectPhotoUrls,
} from "./assets/figmaAssets";

/**
 * ProjectDetails — a single project's overview screen, reached from the
 * Property List by clicking a project row/card. The five pills top-right
 * (Tower / Floor / Unit / Parking Slot / Service Area) are the entry points
 * into each resource table for this project.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:205335.
 */

// Main page cards use the shared `.card` surface (tailwind.css).
const MAIN_CARD = "card flex w-full flex-col gap-4 p-5";

const RESOURCE_TABS: { label: string; screen: Screen }[] = [
  { label: "Tower", screen: "tower" },
  { label: "Floor", screen: "floor" },
  { label: "Unit", screen: "unit" },
  { label: "Parking Slot", screen: "parking-slot" },
  { label: "Service Area", screen: "service-area" },
];

// Compact details grid above the Overview table (photo on the right): up to
// three per row, the address taking two columns.
const PROJECT_INFO: {
  label: string;
  value: string;
  kind?: "status" | "wide";
}[] = [
  { label: "Project Code", value: "ACE" },
  { label: "Project Type", value: "Mid-rise" },
  { label: "Project Status", value: "Ready for Occupancy", kind: "status" },
  // Filled in per project from its buildings list, so it always matches the
  // number of cards under "Building Information".
  { label: "No. of Building/s", value: "" },
  { label: "Floor/s per Tower", value: "6" },
  { label: "Total Unit/s", value: "435" },
  {
    label: "Project Address",
    value:
      "P. Tuazon Boulevard Kaunlaran Quezon Paolo 1111-D Metro Manila, Philippines",
    kind: "wide",
  },
];

interface BuildingInfo {
  name: string;
  rfoDate: string;
  totalFloors: number;
  units: number;
  code: string;
}

// A project can have one building or many (ten or more). Sample data for a
// few projects; the rest get a generated list so every count can be shown.
const BUILDINGS: Record<string, BuildingInfo[]> = {
  "Acacia Estates": [
    { name: "Ivory", rfoDate: "07/31/2024", totalFloors: 6, units: 435, code: "ACE-00A" },
  ],
  "Allegra Garden Place": [
    { name: "Amina", rfoDate: "07/31/2024", totalFloors: 62, units: 2715, code: "AGP-00A" },
    { name: "Soraya", rfoDate: "07/31/2025", totalFloors: 61, units: 1989, code: "AGP-00B" },
  ],
};

const SAMPLE_BUILDING_NAMES = [
  "Amina", "Soraya", "Celeste", "Dahlia", "Elara",
  "Freya", "Gemma", "Helena", "Iris", "Juno",
];

function getBuildings(project: string): BuildingInfo[] {
  if (BUILDINGS[project]) return BUILDINGS[project];
  // Stable 1-10 count from the project name, so each project looks different.
  const hash = [...project].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const count = (hash % 10) + 1;
  const prefix = project
    .replace(/^The\s+/i, "")
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return Array.from({ length: count }, (_, i) => ({
    name: SAMPLE_BUILDING_NAMES[i % SAMPLE_BUILDING_NAMES.length],
    rfoDate: `07/31/${2024 + (i % 3)}`,
    totalFloors: 20 + ((hash + i * 7) % 45),
    units: 400 + ((hash * (i + 3)) % 2400),
    code: `${prefix}-00${String.fromCharCode(65 + i)}`,
  }));
}

interface OverviewRow {
  code: string;
  screen: Screen;
  total: number;
  sold: number;
  available: number;
  onHold: number;
}

const OVERVIEW_ROWS: OverviewRow[] = [
  {
    code: "Units",
    screen: "unit",
    total: 1,
    sold: 130,
    available: 130,
    onHold: 130,
  },
  {
    code: "Parking Slot",
    screen: "parking-slot",
    total: 5,
    sold: 523,
    available: 523,
    onHold: 523,
  },
  {
    code: "Service Area",
    screen: "service-area",
    total: 10,
    sold: 874,
    available: 874,
    onHold: 874,
  },
];

const RECENTLY_VIEWED: PropertyCardData[] = [
  {
    name: "Acacia Estates",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Arista Place",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "The Valeron Tower",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Alta Vista De Boracay",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Arista Place",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
];

/**
 * Project photo gallery: one large photo with ‹ › arrows and a "1 / 8"
 * counter. Photo #1 is the project's own (same as its Property List card);
 * #2 onward are shared sample photos, so the client can see a project holds
 * several images. On desktop the photo fills the column height beside the
 * details + Overview; on smaller screens it sits on top at 16:9. The expand
 * button (or a click in the middle of the photo) opens a full-screen preview.
 */
function ProjectGallery({ project }: { project: string }) {
  const own = projectPhotoUrls[project];
  const images = own
    ? [own, ...projectGallerySampleUrls]
    : projectGallerySampleUrls;
  const [index, setIndex] = useState(0);
  const count = images.length;
  const step = (delta: number) =>
    setIndex((i) => (i + delta + count) % count);
  const [expanded, setExpanded] = useState(false);

  // Each side is a full-height click zone (a fifth of the width, at least
  // 56px) with the round arrow centred in it; hover darkens that edge.
  const zone =
    "group/zone absolute inset-y-0 flex w-1/5 min-w-14 cursor-pointer items-center border-0 bg-transparent p-0 from-black/30 to-transparent transition-colors focus-visible:outline-none";
  // Always visible: they're the only way to the other photos.
  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white shadow-sm backdrop-blur-sm transition-colors group-hover/zone:bg-black/60 group-focus-visible/zone:ring-2 group-focus-visible/zone:ring-white";

  return (
    <div className="order-first flex min-w-0 flex-col lg:order-none">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200 lg:aspect-auto lg:min-h-[200px] lg:flex-1">
        {/* The middle of the photo opens the full-screen preview. */}
        <img
          src={images[index]}
          alt={`${project} photo ${index + 1} of ${count}`}
          onClick={() => setExpanded(true)}
          className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
        />
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => step(-1)}
          className={
            zone +
            " left-0 justify-start pl-2 hover:bg-gradient-to-r focus-visible:bg-gradient-to-r"
          }
        >
          <span className={arrow}>
            <ChevronLeftIcon className="h-4 w-4" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => step(1)}
          className={
            zone +
            " right-0 justify-end pr-2 hover:bg-gradient-to-l focus-visible:bg-gradient-to-l"
          }
        >
          <span className={arrow}>
            <ChevronRightIcon className="h-4 w-4" />
          </span>
        </button>
        <button
          type="button"
          aria-label="View photos full screen"
          title="View full screen"
          onClick={() => setExpanded(true)}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/40 bg-black/40 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ExpandIcon className="h-4 w-4" />
        </button>
        {/* Lets clicks through to the right-hand zone underneath. */}
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium tabular-nums text-white">
          {index + 1} / {count}
        </span>
      </div>

      {expanded && (
        <GalleryLightbox
          title={project}
          images={images}
          index={index}
          onStep={step}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

/**
 * Full-screen preview for the project gallery: the whole photo (not cropped)
 * on a dark backdrop, full-height ‹ › zones and ←/→ keys, title + counter on
 * top. Closes on ✕, Esc or a click on the backdrop. Shares the gallery's
 * index, so closing leaves the page on the photo last viewed.
 */
function GalleryLightbox({
  title,
  images,
  index,
  onStep,
  onClose,
}: {
  title: string;
  images: string[];
  index: number;
  onStep: (delta: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onStep(-1);
      else if (event.key === "ArrowRight") onStep(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onStep]);

  const zone =
    "group/zone absolute inset-y-0 flex w-1/5 min-w-16 cursor-pointer items-center border-0 bg-transparent p-0 from-white/10 to-transparent transition-colors focus-visible:outline-none";
  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors group-hover/zone:bg-white/25 group-focus-visible/zone:ring-2 group-focus-visible/zone:ring-white";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4 py-16"
    >
      <img
        src={images[index]}
        alt={`${title} photo ${index + 1} of ${images.length}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
      />

      <button
        type="button"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          onStep(-1);
        }}
        className={
          zone +
          " left-0 justify-start pl-4 hover:bg-gradient-to-r focus-visible:bg-gradient-to-r"
        }
      >
        <span className={arrow}>
          <ChevronLeftIcon className="h-5 w-5" />
        </span>
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          onStep(1);
        }}
        className={
          zone +
          " right-0 justify-end pr-4 hover:bg-gradient-to-l focus-visible:bg-gradient-to-l"
        }
      >
        <span className={arrow}>
          <ChevronRightIcon className="h-5 w-5" />
        </span>
      </button>

      {/* Top bar: project + counter, close. Above the side zones. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 py-3">
        <p className="m-0 flex min-w-0 items-center gap-2 text-sm font-semibold text-white">
          <span className="truncate">{title}</span>
          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium tabular-nums">
            {index + 1} / {images.length}
          </span>
        </p>
        <button
          type="button"
          aria-label="Close full screen"
          onClick={onClose}
          className="pointer-events-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default function ProjectDetails() {
  const { route, navigate } = useNavigation();
  const project = route.project ?? "Acacia Estates";
  const buildings = getBuildings(project);
  const projectInfo = PROJECT_INFO.map((row) =>
    row.label === "No. of Building/s"
      ? { ...row, value: String(buildings.length) }
      : row,
  );

  return (
    <Layout
      active="properties"
      activeSubItem="Projects"
      breadcrumb={[
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "List", onClick: () => navigate({ screen: "properties" }) },
        { label: project },
      ]}
      orgBadge
    >
      <div className="flex w-full flex-col gap-5 px-5 py-3">
        <PageBackHeading
          title="Project Details"
          onBack={() => navigate({ screen: "properties" })}
        />

        <section className={MAIN_CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-primary-500">{project}</h2>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => navigate({ screen: tab.screen, project })}
                  className="cursor-pointer"
                >
                  <Badge
                    label={tab.label}
                    color="brand"
                    size="sm"
                    icon="leading"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Left: details on top, Overview table below. Right: project photo
              gallery, filling the column height on desktop (on top on smaller screens). */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] lg:gap-x-8">
            <div className="flex min-w-0 flex-col gap-4">
              <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 sm:grid-cols-2 xl:grid-cols-3">
                {projectInfo.map((row) => (
                  <div
                    key={row.label}
                    className={
                      "flex min-w-0 flex-col gap-0.5 " +
                      (row.kind === "wide" ? "sm:col-span-2" : "")
                    }
                  >
                    <dt className="text-xs font-medium leading-[18px] text-gray-500">
                      {row.label}
                    </dt>
                    <dd className="m-0 text-sm font-medium leading-5 text-gray-900">
                      {row.kind === "status" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium leading-[18px] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {row.value}
                        </span>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-gray-900">Overview</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200 [&_tbody_tr:last-child_td]:border-b-0">
                  <table className="w-full min-w-[520px] border-collapse text-[13px]">
                    <thead className="table-head">
                      <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                        <th className="px-5 py-2">Code</th>
                        <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                          Total
                        </th>
                        <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                          Sold
                        </th>
                        <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                          Available
                        </th>
                        <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                          On Hold
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {OVERVIEW_ROWS.map((row) => (
                        <tr key={row.code}>
                          <td className="h-11 border-b border-[#e5e7eb] px-5 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                navigate({ screen: row.screen, project })
                              }
                              className="cursor-pointer text-[13px] font-semibold text-[#06318a] hover:underline"
                            >
                              {row.code}
                            </button>
                          </td>
                          <td className="h-11 border-b border-[#e5e7eb] px-5 py-1 text-center text-[13px] text-gray-900">
                            {row.total}
                          </td>
                          <td className="h-11 border-b border-[#e5e7eb] px-5 py-1 text-center text-[13px] text-gray-900">
                            {row.sold}
                          </td>
                          <td className="h-11 border-b border-[#e5e7eb] px-5 py-1 text-center text-[13px] text-gray-900">
                            {row.available}
                          </td>
                          <td className="h-11 border-b border-[#e5e7eb] px-5 py-1 text-center text-[13px] text-gray-900">
                            {row.onHold}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <ProjectGallery key={project} project={project} />
          </div>

          {/* One card per building; the grid wraps, so 1 or 10+ both fit. */}
          <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                Building Information
              </h3>
              <span className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                {buildings.length} {buildings.length === 1 ? "Building" : "Buildings"}
              </span>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {buildings.map((building, index) => (
                <li
                  key={building.code}
                  className="card flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <BuildingIcon className="h-5 w-5" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-xs font-semibold text-gray-900">
                        Building No {index + 1}
                      </span>
                      <span className="truncate text-sm text-gray-600">
                        {building.name}
                      </span>
                    </div>
                  </div>
                  <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[13px]">
                    {[
                      ["RFO Date", building.rfoDate],
                      ["Total Floors", building.totalFloors],
                      ["No. Of Units", building.units],
                      ["Building Code", building.code],
                    ].map(([label, value]) => (
                      <div key={label} className="contents">
                        <dt className="text-gray-500">{label}</dt>
                        <dd className="m-0 truncate font-medium text-gray-900">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={MAIN_CARD}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Recently Viewed
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {RECENTLY_VIEWED.map((card, index) => (
              <PropertyCard
                key={card.name + index}
                card={card}
                onClick={() =>
                  navigate({ screen: "project-details", project: card.name })
                }
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
