import { useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import Layout from "./Layout";
import ViewToggle from "./ViewToggle";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import ImagePreviewModal from "./ImagePreviewModal";
import RightDrawer from "./RightDrawer";
import FilterTrigger from "./FilterTrigger";
import RowActionButton, { RowActionGroup } from "./RowActionButton";
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

/* ---- Motion for the grid/list toggle ----
 * The outgoing view fades and lifts away, then the incoming one fades in while
 * its rows / unit cards ripple in one after another. Kept short so switching
 * views never feels like waiting. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const viewVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: EASE_OUT, when: "beforeChildren" },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

const rowListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } },
};

const propertyListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const propertyVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT, staggerChildren: 0.022, delayChildren: 0.06 },
  },
};

const unitCardVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: EASE_OUT } },
};

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
          <div className="card flex w-full flex-1 flex-col overflow-hidden">
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
                    onOpenFilters={() => setShowFilters(true)}
                    onReset={resetFilters}
                  />
                </div>
              }
              rightSlot={
                <div className="flex items-center gap-3">
                  <DownloadPdfButton />
                  <ViewToggle id="unit-availability" view={view} onChange={setView} />
                </div>
              }
            />
            <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait" initial={false}>
            {view === "list" ? (
              <motion.div
                key="list"
                variants={viewVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]"
              >
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
                      <th className="w-[272px] px-2 py-2 text-center font-semibold col-actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody variants={rowListVariants}>
                    {filteredRows.map((row, index) => (
                      <motion.tr
                        key={index}
                        variants={rowVariants}
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
                          <div className="flex items-center justify-center">
                            <RowActionGroup>
                            <RowActionButton
                              aria-label={`View ${row.buildingUnit} details`}
                              onClick={() =>
                                navigate({
                                  screen: "unit-availability-details",
                                  itemId: row.propertyUnit,
                                })
                              }
                              size="segment"
                            icon={<EyeIcon className="h-[22px] w-[22px]" />}
                              label="View"
                            />
                            <RowActionButton
                              aria-label={`View ${row.buildingUnit} image`}
                              onClick={() => setPreviewRow(row)}
                              size="segment"
                            icon={<ImageIcon className="h-[22px] w-[22px]" />}
                              label="Image"
                            />
                            <RowActionButton
                              aria-label={`Put ${row.buildingUnit} on hold`}
                              size="segment"
                              disabled={row.status !== "Available"}
                            icon={<PauseCircleIcon className="h-[22px] w-[22px]" />}
                              label="Hold"
                            />
                            </RowActionGroup>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={viewVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]"
              >
                <motion.div variants={propertyListVariants} className="flex flex-col gap-8 p-6">
                  {[
                    { code: "AGP", name: "C- Amina", status: "Available" },
                    { code: "TWP", name: "C- Bella", status: "Available" },
                    { code: "ECP", name: "C- Carlos", status: "On Hold" },
                    { code: "STP", name: "C- Diana", status: "Available" },
                    { code: "MCP", name: "C- Emma", status: "Available" },
                  ].map((property) => (
                    <motion.div key={property.code} variants={propertyVariants} className="flex flex-col gap-4">
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
                            <motion.button
                              key={idx}
                              type="button"
                              variants={unitCardVariants}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
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
                            </motion.button>
                          ))}
                        </div>
                      </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
            </MotionConfig>
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

