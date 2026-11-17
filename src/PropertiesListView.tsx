import { useState } from "react";
import { MotionConfig, motion } from "motion/react";
import Layout from "./Layout";
import ViewToggle, { itemEnter, viewEnter } from "./ViewToggle";
import NoPhotoFigure from "./NoPhotoFigure";
import type { FilterField } from "./FilterBar";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import Select from "./Select";
import Input from "./Input";
import RightDrawer from "./RightDrawer";
import {
  DownloadPdfButton,
  LinkBadge,
  StatusPill,
  TableCardHeader,
} from "./StatusBadge";
import FilterTrigger from "./FilterTrigger";
import { useNavigation, type Screen } from "./NavigationContext";
import {
  projectPhotoUrls,
} from "./assets/figmaAssets";

/**
 * PropertiesListView — "Property > List" screen, with the List/Grid toggle.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv,
 *   List view: node 173418:205101
 *   Grid view: node 173418:205694
 */

// Only these link labels have a matching screen to navigate to.
const LINK_SCREENS: Record<string, Screen> = {
  Tower: "tower",
  Floor: "floor",
  Unit: "unit",
};

interface ProjectRow {
  code: string;
  project: string;
  type: string;
  status: string;
  building: number;
  units: number;
  links: string[];
}

const PROJECTS: ProjectRow[] = [
  {
    code: "ACP",
    project: "Accolade Place",
    type: "Mid-rise",
    status: "Ready for Occupancy",
    building: 1,
    units: 130,
    links: ["Tower", "Floor", "Unit"],
  },
  {
    code: "ALR",
    project: "Spring Lane Homes",
    type: "Subdivision",
    status: "Ongoing Construction",
    building: 5,
    units: 523,
    links: ["House & Lot", "Lot Only"],
  },
  {
    code: "BFS",
    project: "Maple Grove Estates",
    type: "High-rise",
    status: "Under Review",
    building: 10,
    units: 874,
    links: ["Tower", "Floor", "Unit"],
  },
  {
    code: "CQT",
    project: "Riverbend Apartments",
    type: "Apartment Complex",
    status: "Pending Approval",
    building: 15,
    units: 215,
    links: ["House & Lot", "Lot Only"],
  },
  {
    code: "DPX",
    project: "Sunnyvale Villas",
    type: "Single-family Home",
    status: "Approved",
    building: 20,
    units: 689,
    links: ["Tower", "Floor", "Unit"],
  },
  {
    code: "ERZ",
    project: "Cedarwood Condominiums",
    type: "Townhouse",
    status: "Completed",
    building: 25,
    units: 432,
    links: ["House & Lot", "Lot Only"],
  },
  {
    code: "FOS",
    project: "Lakeside Retreat",
    type: "Mixed-use Development",
    status: "On Hold",
    building: 30,
    units: 107,
    links: ["Tower", "Floor", "Unit"],
  },
  {
    code: "GHI",
    project: "Horizon Heights",
    type: "Condominium",
    status: "Cancelled",
    building: 35,
    units: 945,
    links: ["House & Lot", "Lot Only"],
  },
  {
    code: "HJK",
    project: "Oakridge Meadows",
    type: "Mobile Home Park",
    status: "Postponed",
    building: 40,
    units: 308,
    links: ["House & Lot", "Lot Only"],
  },
];

interface GridCard {
  name: string;
  available: [number, number, number];
  sold: [number, number, number];
}

const GRID_CARDS: GridCard[] = [
  // Sample with no photo, to preview the interactive placeholder.
  {
    name: "Sample Project (No Photo)",
    available: [24, 12, 3],
    sold: [310, 188, 42],
  },
  {
    name: "Accolade Place",
    available: [0, 9, 0],
    sold: [125, 144, 129],
  },
  {
    name: "Allegra Garden Place",
    available: [713, 138, 0],
    sold: [1706, 998, 0],
  },
  {
    name: "Alder Residences",
    available: [21, 30, 0],
    sold: [1198, 1126, 0],
  },
  {
    name: "Alea Residences",
    available: [17, 1, 17],
    sold: [538, 248, 538],
  },
  {
    name: "Anissa Heights",
    available: [45, 1, 0],
    sold: [1340, 311, 0],
  },
  {
    name: "Arista Place",
    available: [0, 110, 0],
    sold: [1295, 898, 1295],
  },
  {
    name: "Asteria Residences",
    available: [0, 141, 0],
    sold: [863, 716, 863],
  },
  {
    name: "The Aston Place",
    available: [0, 7, 0],
    sold: [1096, 546, 0],
  },
  {
    name: "The Atherton",
    available: [6, 13, 1],
    sold: [866, 497, 192],
  },
  {
    name: "Alta Vista De Boracay",
    available: [99, 0, 0],
    sold: [204, 0, 0],
  },
];

// Project dropdown is populated from the grid cards' names (deduped, sorted),
// so the filter always lists the same projects shown on the page.
const PROJECT_OPTIONS = Array.from(
  new Set(GRID_CARDS.map((card) => card.name)),
)
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ value: name, label: name }));

const FILTERS: FilterField[] = [
  {
    kind: "select",
    label: "Project",
    placeholder: "Select project",
    options: PROJECT_OPTIONS,
  },
  { kind: "text", label: "Location", placeholder: "Enter location" },
  { kind: "select", label: "Status", placeholder: "Select status" },
  { kind: "select", label: "Type", placeholder: "Select type" },
];

function TableView({
  view,
  onViewChange,
  onFilterClick,
  activeFilterCount,
  onResetFilters,
  filters,
}: {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  filters: Record<string, string>;
}) {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = PROJECTS.filter((row) => {
    // Filters drawer.
    if (filters.Project && row.project !== filters.Project) return false;
    if (filters.Status && row.status !== filters.Status) return false;
    if (filters.Type && row.type !== filters.Type) return false;
    // Free-text search box.
    const query = searchQuery.trim().toLowerCase();
    if (
      query &&
      !row.code.toLowerCase().includes(query) &&
      !row.project.toLowerCase().includes(query) &&
      !row.type.toLowerCase().includes(query) &&
      !row.status.toLowerCase().includes(query)
    )
      return false;
    return true;
  });

  return (
    <div className="card flex h-full w-full flex-col overflow-hidden">
      <TableCardHeader
        leftSlot={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs placeholder-gray-500 focus:border-brand-400 focus:outline-none"
            />
            <FilterTrigger
              activeFilterCount={activeFilterCount}
              onOpenFilters={onFilterClick}
              onReset={onResetFilters}
            />
          </div>
        }
        rightSlot={
          <>
            <DownloadPdfButton />
            <ViewToggle id="projects" view={view} onChange={onViewChange} />
          </>
        }
      />
      <motion.div
        variants={viewEnter}
        initial="hidden"
        animate="show"
        className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]"
      >
        <table className="w-full min-w-[960px] border-collapse text-[13px]">
          <thead className="table-head">
            <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
              <th className="w-10 px-4 py-2">
                <Checkbox size="sm" />
              </th>
              <th className="px-2 py-2 font-semibold">Code</th>
              <th className="px-2 py-2 font-semibold">Project</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">Building</th>
              <th className="px-2 py-2 font-semibold">Units</th>
              <th className="px-2 py-2 font-semibold">Links</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((row, index) => (
              <motion.tr
                key={row.code}
                variants={itemEnter}
                custom={index}
                className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <Checkbox size="sm" />
                </td>
                <td className="px-2 py-2 font-semibold text-gray-900">
                  {row.code}
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        screen: "project-details",
                        project: row.project,
                      })
                    }
                    className="cursor-pointer text-left font-medium text-primary-500 hover:underline"
                  >
                    {row.project}
                  </button>
                </td>
                <td className="px-2 py-2">{row.type}</td>
                <td className="px-2 py-2">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-2 py-2">{row.building}</td>
                <td className="px-2 py-2">{row.units}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1.5">
                    {row.links.map((link) => {
                      const screen = LINK_SCREENS[link];
                      return screen ? (
                        <button
                          key={link}
                          type="button"
                          onClick={() =>
                            navigate({ screen, project: row.project })
                          }
                          className="cursor-pointer"
                        >
                          <LinkBadge label={link} />
                        </button>
                      ) : (
                        <LinkBadge key={link} label={link} />
                      );
                    })}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <Pagination total={89} />
    </div>
  );
}

function GridView({
  view,
  onViewChange,
  onFilterClick,
  activeFilterCount,
  onResetFilters,
  filters,
}: {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  filters: Record<string, string>;
}) {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = GRID_CARDS.filter((card) => {
    // Project filter (from the Filters drawer).
    if (filters.Project && card.name !== filters.Project) return false;
    // Free-text search box.
    const query = searchQuery.trim().toLowerCase();
    if (query && !card.name.toLowerCase().includes(query)) return false;
    return true;
  });

  return (
    <div className="card flex h-full w-full flex-col overflow-hidden">
      <TableCardHeader
        leftSlot={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs placeholder-gray-500 focus:border-brand-400 focus:outline-none"
            />
            <FilterTrigger
              activeFilterCount={activeFilterCount}
              onOpenFilters={onFilterClick}
              onReset={onResetFilters}
            />
          </div>
        }
        rightSlot={<ViewToggle id="projects" view={view} onChange={onViewChange} />}
      />
      <motion.div
        variants={viewEnter}
        initial="hidden"
        animate="show"
        className="grid flex-1 min-h-0 auto-rows-min grid-cols-[repeat(auto-fill,minmax(256px,1fr))] items-start gap-5 overflow-auto p-6 [scrollbar-gutter:stable]"
      >
        {filteredCards.map((card, index) => (
          <motion.div
            key={card.name + index}
            variants={itemEnter}
            custom={index}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate({ screen: "project-details", project: card.name })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate({ screen: "project-details", project: card.name });
              }
            }}
            className="group relative cursor-pointer select-text"
          >
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[box-shadow,border-color] duration-300 ease-out group-hover:border-primary-200 group-hover:shadow-[0_10px_24px_-8px_rgba(16,24,40,0.15)]">
            {/* Photo inset from the card edge, with its own rounded corners. */}
            <div className="shrink-0 px-3 pt-3">
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {projectPhotoUrls[card.name] ? (
                  <img
                    src={projectPhotoUrls[card.name]}
                    alt={card.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <NoPhotoFigure className="h-16 w-auto shrink-0" />
                    <span className="text-xs font-medium text-gray-500">
                      No photo available
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <span className="text-base font-semibold text-primary-500 group-hover:underline">
                {card.name}
              </span>
              <div className="grid grid-cols-[1fr_repeat(3,minmax(40px,auto))] items-center gap-x-3 gap-y-1.5 text-[13px]">
                <span />
                {["CU", "PS", "SA"].map((label) => (
                  <span
                    key={label}
                    className="mb-1.5 justify-self-center rounded-md bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500"
                  >
                    {label}
                  </span>
                ))}

                <span className="font-medium text-gray-500">Available</span>
                {card.available.map((value, i) => (
                  <span key={i} className="text-center text-gray-900">
                    {value}
                  </span>
                ))}

                <span className="font-medium text-gray-500">Sold</span>
                {card.sold.map((value, i) => (
                  <span key={i} className="text-center text-gray-900">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <Pagination total={89} />
    </div>
  );
}

export default function PropertiesListView() {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  // Filter values keyed by field label (Project / Location / Status / Type).
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { navigate } = useNavigation();

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const resetFilters = () => setFilters({});

  return (
    <Layout
      active="properties"
      activeSubItem="Projects"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "List" },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">Projects</h1>
            <p className="text-xs text-gray-600">89 Projects available</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
          <MotionConfig reducedMotion="user">
          {view === "list" ? (
            <TableView
              view={view}
              onViewChange={setView}
              onFilterClick={() => setShowFilterDrawer(true)}
              activeFilterCount={activeFilterCount}
              onResetFilters={resetFilters}
              filters={filters}
            />
          ) : (
            <GridView
              view={view}
              onViewChange={setView}
              onFilterClick={() => setShowFilterDrawer(true)}
              activeFilterCount={activeFilterCount}
              onResetFilters={resetFilters}
              filters={filters}
            />
          )}
          </MotionConfig>
        </div>
      </div>

      <RightDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        title="Filters"
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
          {FILTERS.map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-900">
                {field.label}
              </label>
              {field.kind === "select" && (
                <Select
                  placeholder={field.placeholder}
                  options={
                    field.options ??
                    Array.from({ length: 10 }, (_, i) => ({
                      value: String(i + 1),
                      label: String(i + 1),
                    }))
                  }
                  value={filters[field.label] ?? ""}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, [field.label]: value }))
                  }
                  size="sm"
                />
              )}
              {field.kind === "text" && (
                <Input
                  type="text"
                  placeholder={field.placeholder}
                  value={filters[field.label] ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      [field.label]: e.target.value,
                    }))
                  }
                  size="sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* Sticky buttons at bottom */}
        <div className="shrink-0 border-t border-gray-200 px-5 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowFilterDrawer(false)}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </div>
      </RightDrawer>
    </Layout>
  );
}
