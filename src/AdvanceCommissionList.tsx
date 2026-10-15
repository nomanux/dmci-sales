import { useState } from "react";
import Layout from "./Layout";
import { type FilterField } from "./FilterBar";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import Select from "./Select";
import { DownloadPdfButton, RecordTabs, TableCardHeader } from "./StatusBadge";
import FilterTrigger from "./FilterTrigger";
import RowActionButton from "./RowActionButton";
import { EyeIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * AdvanceCommissionList — "Commission > Advance Commission" screen.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171752:279411.
 */

const FILTERS: FilterField[] = [
  { kind: "text", label: "Client Name", placeholder: "Enter client name" },
  { kind: "text", label: "Seller Name", placeholder: "Enter seller name" },
  { kind: "text", label: "Property Unit", placeholder: "Enter property unit" },
  { kind: "select", label: "No. of Days", placeholder: "Select one" },
  { kind: "select", label: "Accounts", placeholder: "Select one" },
  { kind: "date-range", label: "Reservation Date" },
  { kind: "select", label: "Commission Type", placeholder: "Select one" },
];

interface AdvanceRow {
  reservationId: string;
  clientName: string;
  buildingUnit: string;
  reservationDate: string;
  completionDate: string;
  days: number;
}

const ROWS: AdvanceRow[] = [
  {
    reservationId: "HLD0327451",
    clientName: "Ja Morant",
    buildingUnit: "AST-00A-C-08018",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 11,
  },
  {
    reservationId: "HLD0327448",
    clientName: "Damian Lillard",
    buildingUnit: "SAT-00D-P-B1207",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327426",
    clientName: "Stephen Curry",
    buildingUnit: "LMR-00E-C-02014",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 6,
  },
  {
    reservationId: "HLD0327412",
    clientName: "Kevin Durant",
    buildingUnit: "ALR-00C-C-01007",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 11,
  },
  {
    reservationId: "HLD0327408",
    clientName: "Anthony Edwards",
    buildingUnit: "ARP-00K-C-04005",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327395",
    clientName: "Jimmy Butler",
    buildingUnit: "AVB-00A-C-01001",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 6,
  },
  {
    reservationId: "HLD0327382",
    clientName: "Joel Embiid",
    buildingUnit: "BRX-00F-C-03009",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327369",
    clientName: "Jayson Tatum",
    buildingUnit: "CPT-00B-D-05012",
    reservationDate: "Jul 20, 2026 9:03 PM",
    completionDate: "Jul 20, 2026 9:03 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327354",
    clientName: "Lebron James",
    buildingUnit: "DNL-00A-C-06020",
    reservationDate: "Jul 19, 2026 8:00 AM",
    completionDate: "Jul 19, 2026 8:00 AM",
    days: 8,
  },
  {
    reservationId: "HLD0327340",
    clientName: "Luka Doncic",
    buildingUnit: "AST-00B-D-08019",
    reservationDate: "Jul 18, 2026 2:30 PM",
    completionDate: "Jul 18, 2026 2:30 PM",
    days: 7,
  },
  {
    reservationId: "HLD0327335",
    clientName: "Giannis Antetokounmpo",
    buildingUnit: "SAT-00E-P-B1208",
    reservationDate: "Jul 17, 2026 3:15 PM",
    completionDate: "Jul 17, 2026 3:15 PM",
    days: 9,
  },
  {
    reservationId: "HLD0327328",
    clientName: "Kawhi Leonard",
    buildingUnit: "LMR-00F-C-02015",
    reservationDate: "Jul 16, 2026 10:45 AM",
    completionDate: "Jul 16, 2026 10:45 AM",
    days: 6,
  },
  {
    reservationId: "HLD0327315",
    clientName: "Nikola Jokic",
    buildingUnit: "ALR-00D-C-01008",
    reservationDate: "Jul 15, 2026 4:20 PM",
    completionDate: "Jul 15, 2026 4:20 PM",
    days: 4,
  },
  {
    reservationId: "HLD0327302",
    clientName: "Devin Booker",
    buildingUnit: "ARP-00L-C-04006",
    reservationDate: "Jul 14, 2026 12:15 PM",
    completionDate: "Jul 14, 2026 12:15 PM",
    days: 10,
  },
  {
    reservationId: "HLD0327289",
    clientName: "Shai Gilgeous-Alexander",
    buildingUnit: "AVB-00B-C-01002",
    reservationDate: "Jul 13, 2026 5:30 PM",
    completionDate: "Jul 13, 2026 5:30 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327276",
    clientName: "Trae Young",
    buildingUnit: "BRX-00G-C-03010",
    reservationDate: "Jul 12, 2026 8:45 AM",
    completionDate: "Jul 12, 2026 8:45 AM",
    days: 7,
  },
  {
    reservationId: "HLD0327263",
    clientName: "Donovan Mitchell",
    buildingUnit: "CPT-00C-D-05013",
    reservationDate: "Jul 11, 2026 6:25 PM",
    completionDate: "Jul 11, 2026 6:25 PM",
    days: 6,
  },
  {
    reservationId: "HLD0327250",
    clientName: "Damian Lillard",
    buildingUnit: "DNL-00B-C-06021",
    reservationDate: "Jul 10, 2026 9:00 AM",
    completionDate: "Jul 10, 2026 9:00 AM",
    days: 8,
  },
  {
    reservationId: "HLD0327237",
    clientName: "Tyson Jalis",
    buildingUnit: "AST-00C-D-08020",
    reservationDate: "Jul 09, 2026 1:15 PM",
    completionDate: "Jul 09, 2026 1:15 PM",
    days: 5,
  },
  {
    reservationId: "HLD0327224",
    clientName: "Paolo Banchero",
    buildingUnit: "SAT-00F-P-B1209",
    reservationDate: "Jul 08, 2026 2:45 PM",
    completionDate: "Jul 08, 2026 2:45 PM",
    days: 9,
  },
  {
    reservationId: "HLD0327211",
    clientName: "Victor Wembanyama",
    buildingUnit: "LMR-00G-C-02016",
    reservationDate: "Jul 07, 2026 11:30 AM",
    completionDate: "Jul 07, 2026 11:30 AM",
    days: 4,
  },
  {
    reservationId: "HLD0327198",
    clientName: "Zion Williamson",
    buildingUnit: "ALR-00E-C-01009",
    reservationDate: "Jul 06, 2026 5:00 PM",
    completionDate: "Jul 06, 2026 5:00 PM",
    days: 7,
  },
  {
    reservationId: "HLD0327185",
    clientName: "Tyler Herro",
    buildingUnit: "ARP-00M-C-04007",
    reservationDate: "Jul 05, 2026 1:20 PM",
    completionDate: "Jul 05, 2026 1:20 PM",
    days: 6,
  },
  {
    reservationId: "HLD0327172",
    clientName: "Chris Paul",
    buildingUnit: "AVB-00C-C-01003",
    reservationDate: "Jul 04, 2026 6:45 PM",
    completionDate: "Jul 04, 2026 6:45 PM",
    days: 8,
  },
  {
    reservationId: "HLD0327159",
    clientName: "Khris Middleton",
    buildingUnit: "BRX-00H-C-03011",
    reservationDate: "Jul 03, 2026 9:30 AM",
    completionDate: "Jul 03, 2026 9:30 AM",
    days: 5,
  },
  {
    reservationId: "HLD0327146",
    clientName: "Jimmy Butler",
    buildingUnit: "CPT-00D-D-05014",
    reservationDate: "Jul 02, 2026 7:15 PM",
    completionDate: "Jul 02, 2026 7:15 PM",
    days: 9,
  },
  {
    reservationId: "HLD0327133",
    clientName: "Scottie Barnes",
    buildingUnit: "DNL-00C-C-06022",
    reservationDate: "Jul 01, 2026 10:00 AM",
    completionDate: "Jul 01, 2026 10:00 AM",
    days: 6,
  },
  {
    reservationId: "HLD0327120",
    clientName: "Jalen Brunson",
    buildingUnit: "AST-00D-D-08021",
    reservationDate: "Jun 30, 2026 3:45 PM",
    completionDate: "Jun 30, 2026 3:45 PM",
    days: 7,
  },
  {
    reservationId: "HLD0327107",
    clientName: "Darius Garland",
    buildingUnit: "SAT-00G-P-B1210",
    reservationDate: "Jun 29, 2026 4:20 PM",
    completionDate: "Jun 29, 2026 4:20 PM",
    days: 8,
  },
  {
    reservationId: "HLD0327094",
    clientName: "Anfernee Simons",
    buildingUnit: "LMR-00H-C-02017",
    reservationDate: "Jun 28, 2026 12:15 PM",
    completionDate: "Jun 28, 2026 12:15 PM",
    days: 5,
  },
];

export default function AdvanceCommissionList() {
  const { navigate } = useNavigation();
  const [tab, setTab] = useState("My commission");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    clientName: "",
    sellerName: "",
    propertyUnit: "",
    noOfDays: "",
    accounts: "",
    reservationDateStart: "",
    reservationDateEnd: "",
    commissionType: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      clientName: "",
      sellerName: "",
      propertyUnit: "",
      noOfDays: "",
      accounts: "",
      reservationDateStart: "",
      reservationDateEnd: "",
      commissionType: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    if (
      query &&
      !row.reservationId.toLowerCase().includes(query) &&
      !row.clientName.toLowerCase().includes(query) &&
      !row.buildingUnit.toLowerCase().includes(query)
    )
      return false;
    if (
      filters.clientName &&
      !row.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
    )
      return false;
    if (
      filters.propertyUnit &&
      !row.buildingUnit
        .toLowerCase()
        .includes(filters.propertyUnit.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Layout
      active="commissions"
      activeSubItem="Advance Commission"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        { label: "Commission" },
        { label: "Advance Commission" },
      ]}
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              Advance Commission
            </h1>
            <p className="text-xs text-gray-600">
              {filteredRows.length} records available
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
              rightSlot={<DownloadPdfButton />}
            />

            <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pt-2">
              <RecordTabs
                tabs={["My commission", "Teams Commission"]}
                active={tab}
                onChange={setTab}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              <table
                className="w-full min-w-[1040px] border-collapse"
                style={{ fontSize: "13px" }}
              >
                <thead className="table-head">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="w-8 px-3 py-1">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-1 font-semibold">Reservation ID</th>
                    <th className="px-2 py-1 font-semibold">Client Name</th>
                    <th className="px-2 py-1 font-semibold">Building Unit</th>
                    <th className="px-2 py-1 font-semibold">
                      Reservation Date
                    </th>
                    <th className="px-2 py-1 font-semibold">Completion Date</th>
                    <th className="px-2 py-1 font-semibold">No. of Days</th>
                    <th className="w-24 px-2 py-1 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.reservationId}
                      className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-2 font-medium text-gray-900">
                        {row.reservationId}
                      </td>
                      <td className="px-2 py-2">{row.clientName}</td>
                      <td className="px-2 py-2">{row.buildingUnit}</td>
                      <td className="px-2 py-2">{row.reservationDate}</td>
                      <td className="px-2 py-2">{row.completionDate}</td>
                      <td className="px-2 py-2">{row.days} days</td>
                      <td className="px-2 py-2 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.reservationId} details`}
                            onClick={() =>
                              navigate({
                                screen: "advance-commission-details",
                                itemId: row.reservationId,
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
                    {filter.kind === "select" &&
                      filter.label === "No. of Days" && (
                        <Select
                          size="md"
                          value={filters.noOfDays}
                          onChange={(value) =>
                            setFilters({ ...filters, noOfDays: value })
                          }
                          placeholder={filter.placeholder}
                          options={[
                            { value: "", label: filter.placeholder },
                            { value: "1-5", label: "1-5 days" },
                            { value: "6-10", label: "6-10 days" },
                            { value: "11-15", label: "11-15 days" },
                            { value: "15+", label: "15+ days" },
                          ]}
                        />
                      )}
                    {filter.kind === "select" &&
                      filter.label === "Accounts" && (
                        <Select
                          size="md"
                          value={filters.accounts}
                          onChange={(value) =>
                            setFilters({ ...filters, accounts: value })
                          }
                          placeholder={filter.placeholder}
                          options={[
                            { value: "", label: filter.placeholder },
                            { value: "account1", label: "Account 1" },
                            { value: "account2", label: "Account 2" },
                            { value: "account3", label: "Account 3" },
                          ]}
                        />
                      )}
                    {filter.kind === "select" &&
                      filter.label === "Commission Type" && (
                        <Select
                          size="md"
                          value={filters.commissionType}
                          onChange={(value) =>
                            setFilters({ ...filters, commissionType: value })
                          }
                          placeholder={filter.placeholder}
                          options={[
                            { value: "", label: filter.placeholder },
                            { value: "advance", label: "Advance" },
                            { value: "balance", label: "Balance" },
                            { value: "final", label: "Final" },
                          ]}
                        />
                      )}
                    {filter.kind === "text" &&
                      filter.label === "Client Name" && (
                        <input
                          type="text"
                          placeholder={filter.placeholder}
                          value={filters.clientName}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              clientName: e.target.value,
                            })
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                        />
                      )}
                    {filter.kind === "text" &&
                      filter.label === "Seller Name" && (
                        <input
                          type="text"
                          placeholder={filter.placeholder}
                          value={filters.sellerName}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              sellerName: e.target.value,
                            })
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                        />
                      )}
                    {filter.kind === "text" &&
                      filter.label === "Property Unit" && (
                        <input
                          type="text"
                          placeholder={filter.placeholder}
                          value={filters.propertyUnit}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              propertyUnit: e.target.value,
                            })
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                        />
                      )}
                    {filter.kind === "date-range" && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={filters.reservationDateStart}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              reservationDateStart: e.target.value,
                            })
                          }
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={filters.reservationDateEnd}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              reservationDateEnd: e.target.value,
                            })
                          }
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
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
                      clientName: "",
                      sellerName: "",
                      propertyUnit: "",
                      noOfDays: "",
                      accounts: "",
                      reservationDateStart: "",
                      reservationDateEnd: "",
                      commissionType: "",
                    });
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </Layout>
  );
}
