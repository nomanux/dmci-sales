import { useState } from "react";
import Layout from "./Layout";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import ImagePreviewModal from "./ImagePreviewModal";
import RightDrawer from "./RightDrawer";
import FilterTrigger from "./FilterTrigger";
import RowActionButton from "./RowActionButton";
import Select from "./Select";
import { DownloadPdfButton, StatusPill, TableCardHeader } from "./StatusBadge";
import { BuildingIcon, EyeIcon, ImageIcon, PauseCircleIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import { unitFloorplanB3Url } from "./assets/figmaAssets";

/**
 * UnitAvailabilityList 窶・"Property > Unit Availability" screen, reached
 * from the sidebar (not scoped to a single project). Its Actions column has
 * three icons: View (opens Details), Image (opens the image preview
 * modal), and Hold.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:197248 (page shell)
 * and node 170838:208896 ("Property List" table with the Actions column).
 */

interface UnitAvailabilityRow {
  project: string;
  ownerName: string;
  unitNumber: string;
  buildingUnit: string;
  description: string;
  status: string;
  category: string;
  unitLocation: string;
  price: number;
  propertyUnit: string;
}

function makeRow(
  project: string,
  ownerName: string,
  unitNumber: string,
  description: string,
  status: string,
  unitLocation: string,
  price: number,
): UnitAvailabilityRow {
  return {
    project,
    ownerName,
    unitNumber,
    buildingUnit: `${ownerName} ${unitNumber}`,
    description,
    status,
    category: "Condo Unit",
    unitLocation,
    price,
    propertyUnit: `${project}-00A-C-${unitNumber}`,
  };
}

const ROWS: UnitAvailabilityRow[] = [
  makeRow("AGP", "C- Amina", "3217", "2-Bedroom C (Inner)", "Available", "Front Unit facing East", 9153000),
  makeRow("AGP", "C- Amina", "3225", "2-Bedroom A (Inner)", "Available", "Front Unit facing East", 8662000),
  makeRow("AGP", "C- Amina", "3315", "2-Bedroom A (Inner)", "Available", "Front Unit facing East", 9423000),
  makeRow("AGP", "C- Amina", "3321", "2-Bedroom B (Inner)", "On Hold", "Front Unit facing East", 9531000),
  makeRow("AGP", "C- Amina", "3322", "2-Bedroom C (Inner)", "Available", "Front Unit facing East", 10011000),
  makeRow("AGP", "C- Amina", "3415", "2-Bedroom A (Inner)", "Available", "Front Unit facing East", 8640000),
  makeRow("AGP", "C- Amina", "3416", "2-Bedroom C (Inner)", "Sold", "Front Unit facing East", 9173000),
  makeRow("AGP", "C- Amina", "3417", "2-Bedroom D (Inner)", "Available", "Front Unit facing East", 9561000),
  makeRow("AGP", "C- Amina", "3422", "2-Bedroom C (Inner)", "Available", "Front Unit facing East", 9173000),

  makeRow("TWP", "C- Bella", "3016", "2-Bedroom A (Inner)", "Available", "Corner Unit facing North", 8720000),
  makeRow("TWP", "C- Bella", "3018", "2-Bedroom B (Inner)", "Sold", "Corner Unit facing North", 9042000),
  makeRow("TWP", "C- Bella", "3025", "2-Bedroom A (Inner)", "Available", "Corner Unit facing North", 8895000),
  makeRow("TWP", "C- Bella", "3026", "2-Bedroom A (Inner)", "Available", "Corner Unit facing North", 8910000),
  makeRow("TWP", "C- Bella", "3027", "2-Bedroom B (Inner)", "Available", "Corner Unit facing North", 9088000),
  makeRow("TWP", "C- Bella", "3028", "2-Bedroom C (Inner)", "Available", "Corner Unit facing North", 9310000),

  makeRow("ECP", "C- Carlos", "3016", "2-Bedroom A (Inner)", "On Hold", "Rear Unit facing South", 8410000),
  makeRow("ECP", "C- Carlos", "3023", "2-Bedroom A (Inner)", "Available", "Rear Unit facing South", 8555000),
  makeRow("ECP", "C- Carlos", "3028", "2-Bedroom B (Inner)", "Available", "Rear Unit facing South", 8790000),

  makeRow("STP", "C- Diana", "3016", "2-Bedroom A (Inner)", "Available", "Front Unit facing West", 8985000),
  makeRow("STP", "C- Diana", "3017", "2-Bedroom C (Inner)", "Available", "Front Unit facing West", 9214000),
  makeRow("STP", "C- Diana", "3018", "2-Bedroom B (Inner)", "Available", "Front Unit facing West", 9120000),
  makeRow("STP", "C- Diana", "3024", "2-Bedroom C (Inner)", "Sold", "Front Unit facing West", 9345000),
  makeRow("STP", "C- Diana", "3025", "2-Bedroom A (Inner)", "Available", "Front Unit facing West", 8877000),

  makeRow("MCP", "C- Emma", "3015", "2-Bedroom A (Inner)", "Available", "Corner Unit facing East", 8730000),
  makeRow("MCP", "C- Emma", "3026", "2-Bedroom A (Inner)", "Available", "Corner Unit facing East", 8965000),
  makeRow("MCP", "C- Emma", "3027", "2-Bedroom B (Inner)", "On Hold", "Corner Unit facing East", 9187000),
  makeRow("MCP", "C- Emma", "3028", "2-Bedroom C (Inner)", "Available", "Corner Unit facing East", 9402000),
  makeRow("MCP", "C- Emma", "3029", "2-Bedroom D (Inner)", "Available", "Corner Unit facing East", 9615000),
];

function formatPrice(value: number): string {
  return `Php ${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

const PROJECT_OPTIONS = [
  "Acacia Estates",
  "Accolade Place",
  "Alder Residences",
  "Alea Residences",
  "Allegra Garden Place",
  "Alta Vista De Boracay",
  "Arista Place",
  "Astalla Residences",
  "Asteria Residences",
  "Avery Garden Residences",
  "Belleza Towers",
  "Bonifacio Heights Condominium",
  "Brio Tower",
  "Cardea Terraces",
  "Cedar Crest",
  "Centro Roces Residences",
  "Clarence Place",
  "Cypress Towers",
  "Dansalan Gardens Condominium",
  "DMCI HEAD OFFICE",
].map((name) => ({ value: name, label: name }));

const BUILDING_OPTIONS = ["Andea", "Manzuria", "Oregon", "Sylvan"].map(
  (name) => ({ value: name, label: name }),
);

const TYPE_OPTIONS = [
  "One Bedroom Unit",
  "Two Bedroom Unit",
  "Three Bedroom Unit",
  "Four Bedroom Unit",
  "Five Bedroom Unit",
  "Covered Parking Slot",
  "Motorcyle Parking",
  "Service Area",
  "House and Lot",
  "Commercial Unit",
  "Loft Unit",
  "Studio Unit",
  "Lot Property Only",
].map((name) => ({ value: name, label: name }));

const CATEGORY_OPTIONS = [
  "Condo Unit",
  "Parking Slot",
  "Service Area",
  "House & Lot",
  "Lot Only",
].map((name) => ({ value: name, label: name }));

const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Sold", label: "Sold" },
  { value: "Reserved", label: "Reserved" },
  { value: "On Hold", label: "On-Hold" },
];

function floorLabel(floorNum: number): string {
  const mod100 = floorNum % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${floorNum}th`;
  switch (floorNum % 10) {
    case 1:
      return `${floorNum}st`;
    case 2:
      return `${floorNum}nd`;
    case 3:
      return `${floorNum}rd`;
    default:
      return `${floorNum}th`;
  }
}

export default function UnitAvailabilityList() {
  const [previewRow, setPreviewRow] = useState<UnitAvailabilityRow | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const { navigate } = useNavigation();

  const resetFilters = () => {
    setSearchQuery("");
    setProjectFilter("");
    setBuildingFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setCategoryFilter("");
  };

  const activeFilterCount = [
    projectFilter,
    buildingFilter,
    typeFilter,
    statusFilter,
    categoryFilter,
  ].filter((val) => val !== "").length;

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      row.project.toLowerCase().includes(query) ||
      row.buildingUnit.toLowerCase().includes(query) ||
      row.description.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query) ||
      row.category.toLowerCase().includes(query) ||
      row.unitLocation.toLowerCase().includes(query) ||
      row.propertyUnit.toLowerCase().includes(query);
    const matchesBuilding =
      buildingFilter.trim() === "" ||
      row.buildingUnit.toLowerCase().includes(buildingFilter.trim().toLowerCase());
    const matchesStatus = statusFilter === "" || row.status === statusFilter;
    const matchesCategory = categoryFilter === "" || row.category === categoryFilter;
    return matchesSearch && matchesBuilding && matchesStatus && matchesCategory;
  });

  return (
    <Layout
      active="properties"
      activeSubItem="Unit Availability"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "Unit Availability" },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              Unit Availability
            </h1>
            <p className="text-xs text-gray-600">
              {filteredRows.length} property units available
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
          <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
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
                    onOpenFilters={() => setShowFilters(true)}
                    onReset={resetFilters}
                  />
                </div>
              }
              rightSlot={
                <div className="flex items-center gap-3">
                  <DownloadPdfButton />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setView("grid")}
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
                      onClick={() => setView("list")}
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
                </div>
              }
            />
            {view === "list" ? (
              <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
                <table className="w-full min-w-[1040px] border-collapse text-[13px]">
                  <thead className="table-head">
                    <tr className="text-left">
                      <th className="w-10 px-4 py-2">
                        <Checkbox size="sm" />
                      </th>
                      <th className="px-2 py-2 font-semibold">Project</th>
                      <th className="px-2 py-2 font-semibold">Building Unit</th>
                      <th className="px-2 py-2 font-semibold">Description</th>
                      <th className="px-2 py-2 font-semibold">Status</th>
                      <th className="px-2 py-2 font-semibold">Category</th>
                      <th className="px-2 py-2 font-semibold">Unit Location</th>
                      <th className="px-2 py-2 text-right font-semibold">Price</th>
                      <th className="px-2 py-2 font-semibold">Property Unit</th>
                      <th className="w-[300px] px-2 py-2 text-center font-semibold col-actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 text-gray-600 transition-colors hover:bg-primary-25/50"
                      >
                        <td className="px-4 py-1">
                          <Checkbox size="sm" />
                        </td>
                        <td className="px-2 py-1 font-medium text-gray-900">
                          {row.project}
                        </td>
                        <td className="px-2 py-1">{row.buildingUnit}</td>
                        <td className="px-2 py-1">{row.description}</td>
                        <td className="px-2 py-1">
                          <StatusPill status={row.status} />
                        </td>
                        <td className="px-2 py-1">{row.category}</td>
                        <td className="px-2 py-1">{row.unitLocation}</td>
                        <td className="px-2 py-1 text-right tabular-nums">{formatPrice(row.price)}</td>
                        <td className="px-2 py-1">{row.propertyUnit}</td>
                        <td className="px-2 py-1 col-actions">
                          <div className="flex items-center justify-center gap-3">
                            <RowActionButton
                              aria-label={`View ${row.buildingUnit} details`}
                              onClick={() =>
                                navigate({
                                  screen: "unit-availability-details",
                                  itemId: row.propertyUnit,
                                })
                              }
                              icon={<EyeIcon className="h-6 w-6" />}
                              label="View"
                            />
                            <RowActionButton
                              aria-label={`View ${row.buildingUnit} image`}
                              onClick={() => setPreviewRow(row)}
                              icon={<ImageIcon className="h-6 w-6" />}
                              label="Image"
                            />
                            <RowActionButton
                              aria-label={`Put ${row.buildingUnit} on hold`}
                              icon={<PauseCircleIcon className="h-6 w-6" />}
                              label="Hold"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
                <div className="flex flex-col gap-8 p-6">
                  {[
                    { code: "AGP", name: "C- Amina", status: "Available" },
                    { code: "TWP", name: "C- Bella", status: "Available" },
                    { code: "ECP", name: "C- Carlos", status: "On Hold" },
                    { code: "STP", name: "C- Diana", status: "Available" },
                    { code: "MCP", name: "C- Emma", status: "Available" },
                  ].map((property) => (
                    <div key={property.code} className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
                        <div className="flex shrink-0 items-center justify-center rounded-lg bg-white p-2">
                          <BuildingIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex flex-1 items-center gap-3 text-sm">
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <span className="text-base font-semibold text-gray-900">
                              {property.code}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            <span className="text-base text-gray-900">
                              {property.name}
                            </span>
                          </div>
                          <div className="h-5 w-px bg-gray-200" />
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className="text-gray-700">Status:</span>
                            <StatusPill status={property.status} />
                          </div>
                          <div className="h-5 w-px bg-gray-200" />
                          <div className="flex items-center gap-1 whitespace-nowrap text-gray-700">
                            <span>Category:</span>
                            <span className="font-semibold">Condo Unit</span>
                          </div>
                        </div>
                      </div>

                      {/* Floor and Units Grid */}
                      <div className="flex flex-col w-full gap-0">
                        {(() => {
                          const propertyUnits = filteredRows.filter(
                            (r) => r.project === property.code,
                          );
                          const floorPrefixes = Array.from(
                            new Set(
                              propertyUnits.map((r) => r.unitNumber.slice(0, 2)),
                            ),
                          ).sort();
                          return floorPrefixes.map((prefix) => ({
                            floor: floorLabel(Number(prefix)),
                            units: propertyUnits.filter((r) =>
                              r.unitNumber.startsWith(prefix),
                            ),
                          }));
                        })().map((floorGroup) => (
                      <div
                        key={floorGroup.floor}
                        className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-3 pt-3 first:pt-0"
                      >
                        {/* Floor Box */}
                        <div className="flex flex-row sm:flex-col items-center justify-center gap-1.5 sm:gap-0 shrink-0 w-full sm:w-36 h-auto py-2 sm:py-0 rounded-lg bg-brand-25 text-brand-400 text-center">
                          <span className="text-base font-semibold leading-5">
                            {floorGroup.floor}
                          </span>
                          <span className="text-xs font-normal leading-4">
                            Floor
                          </span>
                        </div>

                        {/* Units Grid */}
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {floorGroup.units.map((row, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                navigate({
                                  screen: "unit-availability-details",
                                  itemId: row.propertyUnit,
                                })
                              }
                              className="flex flex-col items-center text-center gap-1 p-2.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full min-w-0"
                            >
                              <span className="inline-flex items-center justify-center gap-3 text-base font-semibold leading-5 text-gray-900">
                                {row.unitNumber}
                              </span>
                              <span
                                title={row.description}
                                className="block w-full overflow-hidden text-ellipsis text-xs font-normal leading-4 text-gray-600 whitespace-nowrap"
                              >
                                {row.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Pagination total={85} />
          </div>
        </div>
      </div>

      <RightDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Project</label>
            <Select
              size="sm"
              placeholder="Select one"
              value={projectFilter}
              onChange={setProjectFilter}
              options={PROJECT_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Building
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              value={buildingFilter}
              onChange={setBuildingFilter}
              options={BUILDING_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Type</label>
            <Select
              size="sm"
              placeholder="Select one"
              value={typeFilter}
              onChange={setTypeFilter}
              options={TYPE_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Category
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORY_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Status</label>
            <Select
              size="sm"
              placeholder="Select one"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Show List Price? (PDF Report)
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              options={Array.from({ length: 10 }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
            />
          </div>
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
              onClick={() => setShowFilters(false)}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </div>
      </RightDrawer>

      {previewRow && (
        <ImagePreviewModal
          imageUrl={unitFloorplanB3Url}
          imageAlt={`${previewRow.buildingUnit} unit image`}
          onClose={() => setPreviewRow(null)}
        />
      )}
    </Layout>
  );
}

