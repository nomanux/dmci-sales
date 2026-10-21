import { useState } from "react";
import Layout from "./Layout";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import Button from "./Button";
import Select from "./Select";
import { DownloadPdfButton, StatusPill, TableCardHeader } from "./StatusBadge";
import FilterTrigger from "./FilterTrigger";
import RowActionButton from "./RowActionButton";
import { ChevronLeftIcon, EyeIcon, PlusIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * ParkingSlotList — "Property > Parking Slot" screen, reached from the
 * sidebar. Displays available parking slots with status, category, and
 * building unit information.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:206142.
 */

interface ParkingSlotRow {
  code: string;
  buildingUnit: string;
  description: string;
  status: string;
  category: string;
}

const ROWS: ParkingSlotRow[] = [
  { code: "ACP-001", buildingUnit: "M- Accolade 11", description: "Motorcycle Parking", status: "Available", category: "ACP-00A-M-B1011" },
  { code: "ACP-002", buildingUnit: "M- Accolade 12", description: "Motorcycle Parking", status: "On Hold", category: "ACP-00A-M-B1012" },
  { code: "ACP-003", buildingUnit: "M- Accolade 13", description: "Motorcycle Parking", status: "Sold", category: "ACP-00A-M-B1013" },
  { code: "ACP-004", buildingUnit: "M- Accolade 14", description: "Motorcycle Parking", status: "Available", category: "ACP-00A-M-B1014" },
  { code: "ACP-005", buildingUnit: "M- Accolade 15", description: "Motorcycle Parking", status: "Available", category: "ACP-00A-M-B1015" },
  { code: "ACP-006", buildingUnit: "M- Accolade 16", description: "Motorcycle Parking", status: "Reserved", category: "ACP-00A-M-B1016" },
  { code: "ACP-007", buildingUnit: "M- Accolade 17", description: "Motorcycle Parking", status: "Available", category: "ACP-00A-M-B1017" },
  { code: "ACP-008", buildingUnit: "M- Accolade 18", description: "Motorcycle Parking", status: "Available", category: "ACP-00A-M-B1018" },
  { code: "ALR-001", buildingUnit: "M- Accolade 19", description: "Car Parking", status: "Available", category: "ALR-00A-C-B2001" },
  { code: "ALR-002", buildingUnit: "M- Accolade 20", description: "Car Parking", status: "Sold", category: "ALR-00A-C-B2002" },
  { code: "ALR-003", buildingUnit: "M- Accolade 21", description: "Car Parking", status: "Available", category: "ALR-00A-C-B2003" },
  { code: "ALR-004", buildingUnit: "M- Accolade 22", description: "Car Parking", status: "On Hold", category: "ALR-00A-C-B2004" },
  { code: "ALR-005", buildingUnit: "M- Accolade 23", description: "Car Parking", status: "Available", category: "ALR-00A-C-B2005" },
  { code: "ALR-006", buildingUnit: "M- Accolade 24", description: "Car Parking", status: "Available", category: "ALR-00A-C-B2006" },
  { code: "BFS-001", buildingUnit: "M- Accolade 25", description: "Car Parking", status: "Reserved", category: "BFS-00A-C-B3001" },
  { code: "BFS-002", buildingUnit: "M- Accolade 26", description: "Car Parking", status: "Available", category: "BFS-00A-C-B3002" },
  { code: "BFS-003", buildingUnit: "M- Accolade 27", description: "Car Parking", status: "Available", category: "BFS-00A-C-B3003" },
  { code: "CQT-001", buildingUnit: "M- Accolade 28", description: "Premium Parking", status: "Sold", category: "CQT-00A-P-B4001" },
  { code: "CQT-002", buildingUnit: "M- Accolade 29", description: "Premium Parking", status: "Available", category: "CQT-00A-P-B4002" },
  { code: "CQT-003", buildingUnit: "M- Accolade 30", description: "Premium Parking", status: "Available", category: "CQT-00A-P-B4003" },
  { code: "DPX-001", buildingUnit: "M- Accolade 31", description: "Premium Parking", status: "On Hold", category: "DPX-00A-P-B5001" },
  { code: "DPX-002", buildingUnit: "M- Accolade 32", description: "Premium Parking", status: "Available", category: "DPX-00A-P-B5002" },
  { code: "DPX-003", buildingUnit: "M- Accolade 33", description: "Premium Parking", status: "Available", category: "DPX-00A-P-B5003" },
  { code: "ERZ-001", buildingUnit: "M- Accolade 34", description: "Compact Parking", status: "Available", category: "ERZ-00A-C-B6001" },
  { code: "ERZ-002", buildingUnit: "M- Accolade 35", description: "Compact Parking", status: "Reserved", category: "ERZ-00A-C-B6002" },
  { code: "FOS-001", buildingUnit: "M- Accolade 36", description: "Compact Parking", status: "Available", category: "FOS-00A-C-B7001" },
  { code: "FOS-002", buildingUnit: "M- Accolade 37", description: "Compact Parking", status: "Available", category: "FOS-00A-C-B7002" },
  { code: "GHI-001", buildingUnit: "M- Accolade 38", description: "Motorcycle Parking", status: "Sold", category: "GHI-00A-M-B8001" },
  { code: "GHI-002", buildingUnit: "M- Accolade 39", description: "Motorcycle Parking", status: "Available", category: "GHI-00A-M-B8002" },
  { code: "HJK-001", buildingUnit: "M- Accolade 40", description: "Motorcycle Parking", status: "Available", category: "HJK-00A-M-B9001" },
  { code: "HJK-002", buildingUnit: "M- Accolade 41", description: "Motorcycle Parking", status: "On Hold", category: "HJK-00A-M-B9002" },
];

export default function ParkingSlotList() {
  const { route, navigate } = useNavigation();
  // Opened from a project's Project Details pill: show that project in the
  // breadcrumb and a back button to it (the sidebar link has no project).
  const project = route.project;
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    description: "",
    status: "",
    category: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      description: "",
      status: "",
      category: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    if (searchQuery && !row.code.toLowerCase().includes(searchQuery.toLowerCase()) && !row.buildingUnit.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.description && row.description !== filters.description) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (filters.category && !row.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout
      active="properties"
      activeSubItem="Parking Slot"
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
              { label: "Parking Slot" },
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
        { label: "Parking Slot" },
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
                Parking Slot
              </h1>
              <p className="text-xs text-gray-600">
                {filteredRows.length} parking slots available
              </p>
            </div>
            </div>
            <Button variant="primary" size="sm">
              <PlusIcon className="h-4 w-4" />
              New Parking Slot
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
              <table className="w-full min-w-[1040px] border-collapse" style={{ fontSize: "13px" }}>
                <thead className="table-head">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="w-8 px-3 py-1">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-1 font-semibold">Code</th>
                    <th className="px-2 py-1 font-semibold">Building Unit</th>
                    <th className="px-2 py-1 font-semibold">Description</th>
                    <th className="px-2 py-1 font-semibold">Status</th>
                    <th className="px-2 py-1 font-semibold">Category</th>
                    <th className="w-24 px-2 py-1 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-2 font-medium text-gray-900">
                        {row.code}
                      </td>
                      <td className="px-2 py-2">{row.buildingUnit}</td>
                      <td className="px-2 py-2">{row.description}</td>
                      <td className="px-2 py-2">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-2">{row.category}</td>
                      <td className="px-2 py-2 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.code} details`}
                            onClick={() => {
                              // TODO: Implement parking-slot-details screen
                            }}
                            icon={<EyeIcon className="h-6 w-6" />}
                            label="View"
                          />
                        </div>
                      </td>
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
                    Parking Type
                  </label>
                  <Select
                    size="md"
                    value={filters.description}
                    onChange={(value) => setFilters({ ...filters, description: value })}
                    placeholder="Select one"
                    options={[
                      { value: "", label: "Select one" },
                      ...[...new Set(ROWS.map((r) => r.description))].map((d) => ({
                        value: d,
                        label: d,
                      })),
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-900">
                    Status
                  </label>
                  <Select
                    size="md"
                    value={filters.status}
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    placeholder="Select one"
                    options={[
                      { value: "", label: "Select one" },
                      ...[...new Set(ROWS.map((r) => r.status))].map((s) => ({
                        value: s,
                        label: s,
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
                      description: "",
                      status: "",
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
