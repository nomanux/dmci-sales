import { useState } from "react";
import Layout from "./Layout";
import { type FilterField } from "./FilterBar";
import FilterTrigger from "./FilterTrigger";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import Button from "./Button";
import Select from "./Select";
import { DownloadPdfButton, StatusPill, TableCardHeader } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon, PlusIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * UnitHoldingList — "Property > Unit Holding" screen, reached from the
 * sidebar. Reads like a CRM queue of hold requests rather than a project
 * inventory table (Unit Holding ID, Client, Seller, Expiration).
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:195442.
 */

const FILTERS: FilterField[] = [
  { kind: "select", label: "Project", placeholder: "Select one" },
  { kind: "date-range", label: "Expiry Date" },
  { kind: "text", label: "Client Name", placeholder: "Enter client name" },
  { kind: "text", label: "Seller Name", placeholder: "Enter seller name" },
  { kind: "select", label: "Status", placeholder: "Select one" },
];

interface HoldingRow {
  holdingId: string;
  status: string;
  clientName: string;
  sellerName: string;
  project: string;
  buildingUnit: string;
  expiration: string;
}

const ROWS: HoldingRow[] = [
  { holdingId: "HLD0327451", status: "Active", clientName: "Ja Morant", sellerName: "Motorcycle Parking", project: "AST", buildingUnit: "AST-00A-C-08018", expiration: "3/10/2026 11:11:58 AM" },
  { holdingId: "HLD0327448", status: "On Queue", clientName: "Damian Lillard", sellerName: "Motorcycle Parking", project: "SAT", buildingUnit: "SAT-00D-P-B1207", expiration: "2/20/2026 1:48:04 PM" },
  { holdingId: "HLD0327426", status: "Cancelled", clientName: "Stephen Curry", sellerName: "Motorcycle Parking", project: "BXP", buildingUnit: "LMR-00E-C-02014", expiration: "1/23/2026 1:27:45 PM" },
  { holdingId: "HLD0327412", status: "Expired", clientName: "Kevin Durant", sellerName: "Motorcycle Parking", project: "LMR", buildingUnit: "ALR-00C-C-01007", expiration: "12/15/2025 3:30:12 PM" },
  { holdingId: "HLD0327408", status: "Closed", clientName: "Anthony Edwards", sellerName: "Motorcycle Parking", project: "QNT", buildingUnit: "ARP-00K-C-04005", expiration: "11/05/2025 9:45:22 AM" },
  { holdingId: "HLD0327395", status: "On Queue", clientName: "Jimmy Butler", sellerName: "Motorcycle Parking", project: "ZED", buildingUnit: "AVB-00A-C-01001", expiration: "10/10/2025 4:05:55 PM" },
  { holdingId: "HLD0327382", status: "Cancelled", clientName: "Joel Embiid", sellerName: "Motorcycle Parking", project: "TKR", buildingUnit: "BRX-00F-C-03009", expiration: "9/29/2025 7:20:30 AM" },
  { holdingId: "HLD0327369", status: "Expired", clientName: "Jayson Tatum", sellerName: "Motorcycle Parking", project: "PVX", buildingUnit: "CPT-00B-D-05012", expiration: "8/14/2025 5:15:40 PM" },
  { holdingId: "HLD0327354", status: "Closed", clientName: "Lebron James", sellerName: "Motorcycle Parking", project: "NXY", buildingUnit: "DNL-00A-C-06020", expiration: "7/01/2025 8:00:00 AM" },
  { holdingId: "HLD0327340", status: "Active", clientName: "Luka Doncic", sellerName: "Urban Development", project: "AST", buildingUnit: "AST-00B-D-08019", expiration: "3/15/2026 2:30:00 PM" },
  { holdingId: "HLD0327335", status: "On Queue", clientName: "Giannis Antetokounmpo", sellerName: "Green Space", project: "SAT", buildingUnit: "SAT-00E-P-B1208", expiration: "2/25/2026 3:15:30 PM" },
  { holdingId: "HLD0327328", status: "Active", clientName: "Kawhi Leonard", sellerName: "Retail Partners", project: "BXP", buildingUnit: "LMR-00F-C-02015", expiration: "1/30/2026 10:45:20 AM" },
  { holdingId: "HLD0327315", status: "Cancelled", clientName: "Nikola Jokic", sellerName: "Commercial Spaces", project: "LMR", buildingUnit: "ALR-00D-C-01008", expiration: "12/20/2025 4:20:40 PM" },
  { holdingId: "HLD0327302", status: "Expired", clientName: "Devin Booker", sellerName: "Motorcycle Parking", project: "QNT", buildingUnit: "ARP-00L-C-04006", expiration: "11/10/2025 12:15:55 PM" },
  { holdingId: "HLD0327289", status: "Active", clientName: "Shai Gilgeous-Alexander", sellerName: "Urban Development", project: "ZED", buildingUnit: "AVB-00B-C-01002", expiration: "10/15/2025 5:30:00 PM" },
  { holdingId: "HLD0327276", status: "On Queue", clientName: "Trae Young", sellerName: "Retail Partners", project: "TKR", buildingUnit: "BRX-00G-C-03010", expiration: "9/30/2025 8:45:15 AM" },
  { holdingId: "HLD0327263", status: "Closed", clientName: "Donovan Mitchell", sellerName: "Green Space", project: "PVX", buildingUnit: "CPT-00C-D-05013", expiration: "8/20/2025 6:25:30 PM" },
  { holdingId: "HLD0327250", status: "Active", clientName: "Damian Lillard", sellerName: "Commercial Spaces", project: "NXY", buildingUnit: "DNL-00B-C-06021", expiration: "7/10/2025 9:00:00 AM" },
  { holdingId: "HLD0327237", status: "On Queue", clientName: "Tyson Jalis", sellerName: "Motorcycle Parking", project: "AST", buildingUnit: "AST-00C-D-08020", expiration: "3/20/2026 1:15:45 PM" },
  { holdingId: "HLD0327224", status: "Cancelled", clientName: "Paolo Banchero", sellerName: "Urban Development", project: "SAT", buildingUnit: "SAT-00F-P-B1209", expiration: "2/28/2026 2:45:00 PM" },
  { holdingId: "HLD0327211", status: "Active", clientName: "Victor Wembanyama", sellerName: "Retail Partners", project: "BXP", buildingUnit: "LMR-00G-C-02016", expiration: "2/05/2026 11:30:20 AM" },
  { holdingId: "HLD0327198", status: "Expired", clientName: "Zion Williamson", sellerName: "Green Space", project: "LMR", buildingUnit: "ALR-00E-C-01009", expiration: "12/25/2025 5:00:30 PM" },
  { holdingId: "HLD0327185", status: "On Queue", clientName: "Tyler Herro", sellerName: "Commercial Spaces", project: "QNT", buildingUnit: "ARP-00M-C-04007", expiration: "11/15/2025 1:20:10 PM" },
  { holdingId: "HLD0327172", status: "Active", clientName: "Chris Paul", sellerName: "Motorcycle Parking", project: "ZED", buildingUnit: "AVB-00C-C-01003", expiration: "10/20/2025 6:45:00 PM" },
  { holdingId: "HLD0327159", status: "Closed", clientName: "Khris Middleton", sellerName: "Urban Development", project: "TKR", buildingUnit: "BRX-00H-C-03011", expiration: "10/05/2025 9:30:45 AM" },
  { holdingId: "HLD0327146", status: "On Queue", clientName: "Jimmy Butler", sellerName: "Retail Partners", project: "PVX", buildingUnit: "CPT-00D-D-05014", expiration: "8/25/2025 7:15:20 PM" },
  { holdingId: "HLD0327133", status: "Active", clientName: "Scottie Barnes", sellerName: "Green Space", project: "NXY", buildingUnit: "DNL-00C-C-06022", expiration: "7/15/2025 10:00:00 AM" },
  { holdingId: "HLD0327120", status: "Cancelled", clientName: "Jalen Brunson", sellerName: "Commercial Spaces", project: "AST", buildingUnit: "AST-00D-D-08021", expiration: "3/25/2026 3:45:15 PM" },
  { holdingId: "HLD0327107", status: "Active", clientName: "Darius Garland", sellerName: "Motorcycle Parking", project: "SAT", buildingUnit: "SAT-00G-P-B1210", expiration: "3/05/2026 4:20:40 PM" },
  { holdingId: "HLD0327094", status: "On Queue", clientName: "Anfernee Simons", sellerName: "Urban Development", project: "BXP", buildingUnit: "LMR-00H-C-02017", expiration: "2/10/2026 12:15:30 PM" },
];

export default function UnitHoldingList() {
  const { navigate } = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    project: "",
    expiryDateStart: "",
    expiryDateEnd: "",
    clientName: "",
    sellerName: "",
    status: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      project: "",
      expiryDateStart: "",
      expiryDateEnd: "",
      clientName: "",
      sellerName: "",
      status: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    if (
      query &&
      !row.holdingId.toLowerCase().includes(query) &&
      !row.clientName.toLowerCase().includes(query) &&
      !row.sellerName.toLowerCase().includes(query) &&
      !row.buildingUnit.toLowerCase().includes(query)
    )
      return false;
    if (filters.project && row.project !== filters.project) return false;
    if (filters.clientName && !row.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
    if (filters.sellerName && !row.sellerName.toLowerCase().includes(filters.sellerName.toLowerCase())) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });

  return (
    <Layout
      active="properties"
      activeSubItem="Unit Holding"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "Unit Holding" },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold text-gray-900">
                Unit Holding
              </h1>
              <p className="text-xs text-gray-600">
                30 unit holdings available
              </p>
            </div>
            <Button variant="primary" size="sm">
              <PlusIcon className="h-4 w-4" />
              New Unit Holding
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
                  <tr className="text-left">
                    <th className="w-10 px-4 py-2">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-2 font-semibold">Unit Holding ID</th>
                    <th className="px-2 py-2 font-semibold">Status</th>
                    <th className="px-2 py-2 font-semibold">Client Name</th>
                    <th className="px-2 py-2 font-semibold">
                      Primary Seller Name
                    </th>
                    <th className="px-2 py-2 font-semibold">Project</th>
                    <th className="px-2 py-2 font-semibold">Building Unit</th>
                    <th className="px-2 py-2 font-semibold">Expiration Date</th>
                    <th className="w-24 px-2 py-2 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.holdingId}
                      className="border-b border-gray-100 text-gray-600 transition-colors hover:bg-primary-25/50"
                    >
                      <td className="px-4 py-1">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-1 font-medium text-gray-900">
                        {row.holdingId}
                      </td>
                      <td className="px-2 py-1">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-1">{row.clientName}</td>
                      <td className="px-2 py-1">{row.sellerName}</td>
                      <td className="px-2 py-1">{row.project}</td>
                      <td className="px-2 py-1">{row.buildingUnit}</td>
                      <td className="px-2 py-1">{row.expiration}</td>
                      <td className="px-2 py-1 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.holdingId} details`}
                            onClick={() =>
                              navigate({
                                screen: "unit-holding-details",
                                itemId: row.holdingId,
                              })
                            }
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
                {FILTERS.map((filter, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-900">
                      {filter.label}
                    </label>
                    {filter.kind === "select" && filter.label === "Project" && (
                      <Select
                        size="md"
                        value={filters.project}
                        onChange={(value) => setFilters({ ...filters, project: value })}
                        placeholder={filter.placeholder}
                        options={[
                          { value: "", label: filter.placeholder },
                          ...[...new Set(ROWS.map((r) => r.project))].map((p) => ({
                            value: p,
                            label: p,
                          })),
                        ]}
                      />
                    )}
                    {filter.kind === "select" && filter.label === "Status" && (
                      <Select
                        size="md"
                        value={filters.status}
                        onChange={(value) => setFilters({ ...filters, status: value })}
                        placeholder={filter.placeholder}
                        options={[
                          { value: "", label: filter.placeholder },
                          ...[...new Set(ROWS.map((r) => r.status))].map((s) => ({
                            value: s,
                            label: s,
                          })),
                        ]}
                      />
                    )}
                    {filter.kind === "text" && filter.label === "Client Name" && (
                      <input
                        type="text"
                        placeholder={filter.placeholder}
                        value={filters.clientName}
                        onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-brand-400 focus:outline-none"
                      />
                    )}
                    {filter.kind === "text" && filter.label === "Seller Name" && (
                      <input
                        type="text"
                        placeholder={filter.placeholder}
                        value={filters.sellerName}
                        onChange={(e) => setFilters({ ...filters, sellerName: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-brand-400 focus:outline-none"
                      />
                    )}
                    {filter.kind === "date-range" && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={filters.expiryDateStart}
                          onChange={(e) => setFilters({ ...filters, expiryDateStart: e.target.value })}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={filters.expiryDateEnd}
                          onChange={(e) => setFilters({ ...filters, expiryDateEnd: e.target.value })}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 px-5 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilters({
                      project: "",
                      expiryDateStart: "",
                      expiryDateEnd: "",
                      clientName: "",
                      sellerName: "",
                      status: "",
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
