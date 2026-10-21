import { useState } from "react";
import Layout from "./Layout";
import Pagination from "./Pagination";
import Button from "./Button";
import Select from "./Select";
import { DownloadPdfButton, TableCardHeader } from "./StatusBadge";
import FilterTrigger from "./FilterTrigger";
import { ChevronLeftIcon, PlusIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * FloorList — "Property > List > Floor" screen, displays floor inventory across
 * buildings with unit, parking slot, and service area breakdowns.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:206944 ("Property > List > Floor").
 */

interface FloorRow {
  id: string;
  building: string;
  floor: string;
  description: string;
  type: string;
  unitsTotal: number;
  unitsSold: number;
  unitsAvailable: number;
  parkingTotal: number;
  parkingSold: number;
  parkingAvailable: number;
  serviceTotal: number;
  serviceSold: number;
  serviceAvailable: number;
}

// Matches the reference Floor table (Accolade Place).
const ROWS: FloorRow[] = [
  { id: "FL0001", building: "Accolade Place", floor: "ACP-00A-01", description: "1st Floor", type: "Residential Floor", unitsTotal: 20, unitsSold: 19, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0002", building: "Accolade Place", floor: "ACP-00A-02", description: "2nd Floor", type: "Residential Floor", unitsTotal: 22, unitsSold: 22, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0003", building: "Accolade Place", floor: "ACP-00A-03", description: "3rd Floor", type: "Residential Floor", unitsTotal: 22, unitsSold: 21, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0004", building: "Accolade Place", floor: "ACP-00A-04", description: "4th Floor", type: "Residential Floor", unitsTotal: 22, unitsSold: 21, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0005", building: "Accolade Place", floor: "ACP-00A-05", description: "5th Floor", type: "Residential Floor", unitsTotal: 22, unitsSold: 21, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0006", building: "Accolade Place", floor: "ACP-00A-06", description: "6th Floor", type: "Residential Floor", unitsTotal: 22, unitsSold: 21, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0007", building: "Accolade Place", floor: "ACP-00A-B1", description: "Lower Level 1", type: "Parking Floor", unitsTotal: 0, unitsSold: 0, unitsAvailable: 0, parkingTotal: 72, parkingSold: 69, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0008", building: "Accolade Place", floor: "ACP-00A-B2", description: "Lower Level 2", type: "Parking Floor", unitsTotal: 0, unitsSold: 0, unitsAvailable: 0, parkingTotal: 79, parkingSold: 76, parkingAvailable: 0, serviceTotal: 0, serviceSold: 0, serviceAvailable: 0 },
  { id: "FL0009", building: "Accolade Place", floor: "ACP-00A-RD", description: "Roof Deck", type: "Service Area Floor", unitsTotal: 0, unitsSold: 0, unitsAvailable: 0, parkingTotal: 0, parkingSold: 0, parkingAvailable: 0, serviceTotal: 130, serviceSold: 129, serviceAvailable: 0 },
];

const FLOOR_GROUPS = ["Units", "Parking Slot", "Service Area"];

export default function FloorList() {
  const { route, navigate } = useNavigation();
  // Opened from a project's Project Details pill: show that project in the
  // breadcrumb and a back button to it (the sidebar link has no project).
  const project = route.project;
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    building: "",
    floorType: "",
    category: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      building: "",
      floorType: "",
      category: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    if (filters.building && row.building !== filters.building) return false;
    if (filters.floorType && row.type !== filters.floorType) return false;
    if (filters.category && !row.description.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (searchQuery && ![row.building, row.floor, row.description].some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const uniqueBuildings = [...new Set(ROWS.map((r) => r.building))];
  const uniqueTypes = [...new Set(ROWS.map((r) => r.type))];

  return (
    <Layout
      active="properties"
      activeSubItem="Projects"
      breadcrumb={
        project
          ? [
              {
                label: "Property",
                onClick: () => navigate({ screen: "properties" }),
              },
              { label: "List", onClick: () => navigate({ screen: "properties" }) },
              {
                label: project,
                onClick: () => navigate({ screen: "project-details", project }),
              },
              { label: "Floor" },
            ]
          : [
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "Floor" },
      ]
      }
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project && (
                <button
                  type="button"
                  aria-label={"Back to " + project}
                  onClick={() => navigate({ screen: "project-details", project })}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold text-gray-900">
                Floor
              </h1>
              <p className="text-xs text-gray-600">
                {ROWS.length} floors available
              </p>
            </div>
            </div>
            <Button variant="primary" size="sm">
              <PlusIcon className="h-4 w-4" />
              New Floor
            </Button>
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
              rightSlot={<DownloadPdfButton />}
            />
            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              {/* Reference layout: Building Name / Floor / Floor Number, then
                  Units, Parking Slot and Service Area groups (Total / Sold /
                  Available, Available in blue). */}
              <table className="w-full min-w-[1200px] border-collapse" style={{ fontSize: "13px" }}>
                <thead className="table-head">
                  {/* No rule under this row: it would cut through the three
                      cells that span both header rows. Only the group headers
                      get a line under them; the second row draws the bottom one. */}
                  <tr className="bg-gray-50 text-left text-gray-500">
                    <th rowSpan={2} className="py-2 pl-4 pr-3 align-middle">Building Name</th>
                    <th rowSpan={2} className="px-3 py-2 align-middle">Floor</th>
                    <th rowSpan={2} className="px-3 py-2 align-middle">Floor Number</th>
                    {FLOOR_GROUPS.map((group) => (
                      <th key={group} colSpan={3} className="border-b border-l border-gray-200 px-3 py-2 text-center">
                        {group}
                      </th>
                    ))}
                  </tr>
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-gray-500">
                    {FLOOR_GROUPS.map((group) =>
                      ["Total", "Sold", "Available"].map((sub, i) => (
                        <th
                          key={group + sub}
                          className={"px-3 py-2 text-center !font-medium " + (i === 0 ? "border-l border-gray-200" : "")}
                        >
                          {sub}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="py-2.5 pl-4 pr-3 font-medium text-gray-900">{row.building}</td>
                      <td className="px-3 py-2.5">{row.floor}</td>
                      <td className="px-3 py-2.5">{row.description}</td>
                      {[
                        [row.unitsTotal, row.unitsSold, row.unitsAvailable],
                        [row.parkingTotal, row.parkingSold, row.parkingAvailable],
                        [row.serviceTotal, row.serviceSold, row.serviceAvailable],
                      ].map((values, groupIndex) =>
                        values.map((value, i) => (
                          <td
                            key={groupIndex + "-" + i}
                            className={
                              "px-3 py-2.5 text-center " +
                              (i === 0 ? "border-l border-gray-200 " : "") +
                              (i === 2 ? "text-primary-500" : "text-gray-700")
                            }
                          >
                            {value}
                          </td>
                        )),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={filteredRows.length} />
          </div>
        </div>

        <>
          <div
            className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
              showFilters ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setShowFilters(false)}
          />
          <div
            className={`fixed right-0 top-0 z-50 flex h-full w-96 flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
              showFilters ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-md p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-900">
                    Building
                  </label>
                  <Select
                    size="md"
                    value={filters.building}
                    onChange={(value) => setFilters({ ...filters, building: value })}
                    placeholder="Select one"
                    options={[
                      { value: "", label: "Select one" },
                      ...uniqueBuildings.map((b) => ({
                        value: b,
                        label: b,
                      })),
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-900">
                    Floor Type
                  </label>
                  <Select
                    size="md"
                    value={filters.floorType}
                    onChange={(value) => setFilters({ ...filters, floorType: value })}
                    placeholder="Select one"
                    options={[
                      { value: "", label: "Select one" },
                      ...uniqueTypes.map((t) => ({
                        value: t,
                        label: t,
                      })),
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-900">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-brand-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 px-5 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilters({
                      building: "",
                      floorType: "",
                      category: "",
                    });
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <div className="flex-1">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowFilters(false)}
                    className="w-full"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </Layout>
  );
}
