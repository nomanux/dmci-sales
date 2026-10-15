import { useState } from "react";
import Layout from "./Layout";
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
  noImageAvailableUrl,
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

function ViewToggle({
  view,
  onChange,
}: {
  view: "list" | "grid";
  onChange: (view: "list" | "grid") => void;
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        onClick={() => onChange("grid")}
        className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
          view === "grid" ? "bg-[#F0F5FF]" : "hover:bg-[#F9FAFB]"
        }`}
        title="Grid view"
      >
        <img
          alt="Grid view"
          className="w-[15px] h-[15px]"
          src="data:image/svg+xml,%3csvg%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5.33398%200.833496H2.16732C1.70061%200.833496%201.46725%200.833496%201.28899%200.924324C1.13219%201.00422%201.00471%201.1317%200.924812%201.2885C0.833984%201.46676%200.833984%201.70012%200.833984%202.16683V5.3335C0.833984%205.80021%200.833984%206.03356%200.924812%206.21182C1.00471%206.36862%201.13219%206.49611%201.28899%206.576C1.46725%206.66683%201.70061%206.66683%202.16732%206.66683H5.33398C5.80069%206.66683%206.03405%206.66683%206.21231%206.576C6.36911%206.49611%206.4966%206.36862%206.57649%206.21182C6.66732%206.03356%206.66732%205.80021%206.66732%205.3335V2.16683C6.66732%201.70012%206.66732%201.46676%206.57649%201.2885C6.4966%201.1317%206.36911%201.00422%206.21231%200.924324C6.03405%200.833496%205.80069%200.833496%205.33398%200.833496Z'%20stroke='%23052B78'%20stroke-width='1.66667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M14.5007%200.833496H11.334C10.8673%200.833496%2010.6339%200.833496%2010.4557%200.924324C10.2989%201.00422%2010.1714%201.1317%2010.0915%201.2885C10.0007%201.46676%2010.0007%201.70012%2010.0007%202.16683V5.3335C10.0007%205.80021%2010.0007%206.03356%2010.0915%206.21182C10.1714%206.36862%2010.2989%206.49611%2010.4557%206.576C10.6339%206.66683%2010.8673%206.66683%2011.334%206.66683H14.5007C14.9674%206.66683%2015.2007%206.66683%2015.379%206.576C15.5358%206.49611%2015.6633%206.36862%2015.7432%206.21182C15.834%206.03356%2015.834%205.80021%2015.834%205.3335V2.16683C15.834%201.70012%2015.834%201.46676%2015.7432%201.2885C15.6633%201.1317%2015.5358%201.00422%2015.379%200.924324C15.2007%200.833496%2014.9674%200.833496%2014.5007%200.833496Z'%20stroke='%23052B78'%20stroke-width='1.66667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M14.5007%2010.0002H11.334C10.8673%2010.0002%2010.6339%2010.0002%2010.4557%2010.091C10.2989%2010.1709%2010.1714%2010.2984%2010.0915%2010.4552C10.0007%2010.6334%2010.0007%2010.8668%2010.0007%2011.3335V14.5002C10.0007%2014.9669%2010.0007%2015.2002%2010.0915%2015.3785C10.1714%2015.5353%2010.2989%2015.6628%2010.4557%2015.7427C10.6339%2015.8335%2010.8673%2015.8335%2011.334%2015.8335H14.5007C14.9674%2015.8335%2015.2007%2015.8335%2015.379%2015.7427C15.5358%2015.6628%2015.6633%2015.5353%2015.7432%2015.3785C15.834%2015.2002%2015.834%2014.9669%2015.834%2014.5002V11.3335C15.834%2010.8668%2015.834%2010.6334%2015.7432%2010.4552C15.6633%2010.2984%2015.5358%2010.1709%2015.379%2010.091C15.2007%2010.0002%2014.9674%2010.0002%2014.5007%2010.0002Z'%20stroke='%23052B78'%20stroke-width='1.66667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M5.33398%2010.0002H2.16732C1.70061%2010.0002%201.46725%2010.0002%201.28899%2010.091C1.13219%2010.1709%201.00471%2010.2984%200.924812%2010.4552C0.833984%2010.6334%200.833984%2010.8668%200.833984%2011.3335V14.5002C0.833984%2014.9669%200.833984%2015.2002%200.924812%2015.3785C1.00471%2015.5353%201.13219%2015.6628%201.28899%2015.7427C1.46725%2015.8335%201.70061%2015.8335%202.16732%2015.8335H5.33398C5.80069%2015.8335%206.03405%2015.8335%206.21231%2015.7427C6.36911%2015.6628%206.4966%2015.5353%206.57649%2015.3785C6.66732%2015.2002%206.66732%2014.9669%206.66732%2014.5002V11.3335C6.66732%2010.8668%206.66732%2010.6334%206.57649%2010.4552C6.4966%2010.2984%206.36911%2010.1709%206.21231%2010.091C6.03405%2010.0002%205.80069%2010.0002%205.33398%2010.0002Z'%20stroke='%23052B78'%20stroke-width='1.66667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
        />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={view === "list"}
        onClick={() => onChange("list")}
        className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
          view === "list" ? "bg-[#F0F5FF]" : "hover:bg-[#F9FAFB]"
        }`}
        title="List view"
      >
        <img
          alt="List view"
          className="w-[15px] h-[15px]"
          src="data:image/svg+xml,%3csvg%20width='17'%20height='14'%20viewBox='0%200%2017%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.834%206.66683L5.83398%206.66683M15.834%201.66683L5.83398%201.66683M15.834%2011.6668L5.83398%2011.6668M2.50065%206.66683C2.50065%207.12707%202.12755%207.50016%201.66732%207.50016C1.20708%207.50016%200.833984%207.12707%200.833984%206.66683C0.833984%206.20659%201.20708%205.8335%201.66732%205.8335C2.12755%205.8335%202.50065%206.20659%202.50065%206.66683ZM2.50065%201.66683C2.50065%202.12707%202.12755%202.50016%201.66732%202.50016C1.20708%202.50016%200.833984%202.12707%200.833984%201.66683C0.833984%201.20659%201.20708%200.833496%201.66732%200.833496C2.12755%200.833496%202.50065%201.20659%202.50065%201.66683ZM2.50065%2011.6668C2.50065%2012.1271%202.12755%2012.5002%201.66732%2012.5002C1.20708%2012.5002%200.833984%2012.1271%200.833984%2011.6668C0.833984%2011.2066%201.20708%2010.8335%201.66732%2010.8335C2.12755%2010.8335%202.50065%2011.2066%202.50065%2011.6668Z'%20stroke='%2306318A'%20stroke-width='1.66667'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
        />
      </button>
    </div>
  );
}

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
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <TableCardHeader
        leftSlot={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs placeholder-gray-500 focus:border-primary-500 focus:outline-none"
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
            <ViewToggle view={view} onChange={onViewChange} />
          </>
        }
      />
      <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
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
            {filteredProjects.map((row) => (
              <tr
                key={row.code}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <TableCardHeader
        leftSlot={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            />
            <FilterTrigger
              activeFilterCount={activeFilterCount}
              onOpenFilters={onFilterClick}
              onReset={onResetFilters}
            />
          </div>
        }
        rightSlot={<ViewToggle view={view} onChange={onViewChange} />}
      />
      <div className="grid flex-1 min-h-0 auto-rows-min grid-cols-[repeat(auto-fill,minmax(256px,1fr))] items-start gap-5 overflow-auto p-6 [scrollbar-gutter:stable]">
        {filteredCards.map((card, index) => (
          <div
            key={card.name + index}
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
                  <img
                    src={noImageAvailableUrl}
                    alt="No image available"
                    className="max-h-full max-w-full object-contain p-4"
                  />
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
          </div>
        ))}
      </div>
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
