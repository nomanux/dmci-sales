import { useState } from "react";
import Layout from "./Layout";
import { type FilterField } from "./FilterBar";
import FilterTrigger from "./FilterTrigger";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import Select from "./Select";
import { DownloadPdfButton, StatusPill, TableCardHeader } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * ForComplianceList — "Commission > For Compliance" screen.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171801:261751.
 */

const FILTERS: FilterField[] = [
  { kind: "text", label: "Client Name", placeholder: "Enter client name" },
  { kind: "text", label: "Seller Name", placeholder: "Enter seller name" },
  { kind: "select", label: "Status", placeholder: "Select one" },
];

interface ComplianceRow {
  contractNumber: string;
  accountNo: string;
  clientName: string;
  paymentReceived: string;
  paymentPercent: number;
  status: string;
  sellerName: string;
}

const ROWS: ComplianceRow[] = [
  {
    contractNumber: "ACP",
    accountNo: "B000012748",
    clientName: "Spouses Ricardo A. Cruz and Erlinda A. Cruz",
    paymentReceived: "Php 0.00",
    paymentPercent: 15.48,
    status: "Confirmed",
    sellerName: "Jean Valjean",
  },
  {
    contractNumber: "ALR",
    accountNo: "B000027941",
    clientName: "John Martin Monaghan Married to Candida Orpilla Bonzo",
    paymentReceived: "Php 1,362,340.26",
    paymentPercent: 30.43,
    status: "Confirmed",
    sellerName: "Cosette Fauchelevent",
  },
  {
    contractNumber: "BFS",
    accountNo: "B000054004",
    clientName: "Melanie Audrey Stephen",
    paymentReceived: "Php 2,209,588.14",
    paymentPercent: 98.56,
    status: "Confirmed",
    sellerName: "Éponine Thénardier",
  },
  {
    contractNumber: "CQT",
    accountNo: "B000027459",
    clientName:
      "Spouses Julius Mercader Tiamson and Maria Sharon Lagajino Tiamson",
    paymentReceived: "Php 1,504,177.29",
    paymentPercent: 72.15,
    status: "Confirmed",
    sellerName: "Gavroche Thénardier",
  },
  {
    contractNumber: "DPX",
    accountNo: "B000038172",
    clientName: "2-Bedroom C (Inner)Available",
    paymentReceived: "Php 254,548.92",
    paymentPercent: 45.67,
    status: "Confirmed",
    sellerName: "Enjolras ABC",
  },
  {
    contractNumber: "ERZ",
    accountNo: "B000045689",
    clientName: "Spouses Johnson Chua and Amelita Chua",
    paymentReceived: "Php 1,535,003.41",
    paymentPercent: 85.22,
    status: "Confirmed",
    sellerName: "Javert XYZ",
  },
  {
    contractNumber: "FOS",
    accountNo: "B000061234",
    clientName: "Spouses Kevin Liu and Jessica Yang",
    paymentReceived: "Php 2,289,538.66",
    paymentPercent: 60.34,
    status: "Confirmed",
    sellerName: "Fantine QWE",
  },
  {
    contractNumber: "GHI",
    accountNo: "B000075436",
    clientName: "Spouses Michael Johnson and Sarah Smith",
    paymentReceived: "Php 399,612.42",
    paymentPercent: 40.99,
    status: "Confirmed",
    sellerName: "Grantaire UIO",
  },
  {
    contractNumber: "HJK",
    accountNo: "B000082591",
    clientName: "4-Bedroom A (Corner) Available",
    paymentReceived: "Php 57,035.90",
    paymentPercent: 22.11,
    status: "Confirmed",
    sellerName: "Marius Pontmercy",
  },
  {
    contractNumber: "IJK",
    accountNo: "B000089456",
    clientName: "Spouses Robert Garcia and Maria Garcia",
    paymentReceived: "Php 1,234,567.89",
    paymentPercent: 55.30,
    status: "Confirmed",
    sellerName: "Monsieur Thénardier",
  },
  {
    contractNumber: "JKL",
    accountNo: "B000095623",
    clientName: "3-Bedroom B (Facing) Available",
    paymentReceived: "Php 789,456.23",
    paymentPercent: 78.90,
    status: "Confirmed",
    sellerName: "Madame Thénardier",
  },
  {
    contractNumber: "KLM",
    accountNo: "B000102847",
    clientName: "Spouses Miguel Santos and Rosa Santos",
    paymentReceived: "Php 456,789.12",
    paymentPercent: 34.56,
    status: "Pending",
    sellerName: "Valjean Senior",
  },
  {
    contractNumber: "LMN",
    accountNo: "B000109834",
    clientName: "Spouses David Wong and Angela Wong",
    paymentReceived: "Php 2,345,678.90",
    paymentPercent: 92.15,
    status: "Confirmed",
    sellerName: "Cosette Junior",
  },
  {
    contractNumber: "MNO",
    accountNo: "B000116521",
    clientName: "2-Bedroom A (Inner) Available",
    paymentReceived: "Php 345,678.90",
    paymentPercent: 50.75,
    status: "Confirmed",
    sellerName: "Éponine Senior",
  },
  {
    contractNumber: "NOP",
    accountNo: "B000123456",
    clientName: "Spouses James Lee and Jennifer Lee",
    paymentReceived: "Php 678,901.23",
    paymentPercent: 65.40,
    status: "Confirmed",
    sellerName: "Gavroche Junior",
  },
  {
    contractNumber: "OPQ",
    accountNo: "B000130789",
    clientName: "4-Bedroom B (Corner) Available",
    paymentReceived: "Php 567,890.12",
    paymentPercent: 88.65,
    status: "Pending",
    sellerName: "Enjolras Senior",
  },
  {
    contractNumber: "PQR",
    accountNo: "B000137654",
    clientName: "Spouses Christopher Brown and Lisa Brown",
    paymentReceived: "Php 123,456.78",
    paymentPercent: 25.90,
    status: "Confirmed",
    sellerName: "Javert Junior",
  },
  {
    contractNumber: "QRS",
    accountNo: "B000144321",
    clientName: "3-Bedroom C (Facing) Available",
    paymentReceived: "Php 890,123.45",
    paymentPercent: 75.30,
    status: "Confirmed",
    sellerName: "Fantine Senior",
  },
  {
    contractNumber: "RST",
    accountNo: "B000151098",
    clientName: "Spouses Edward Miller and Patricia Miller",
    paymentReceived: "Php 1,678,901.23",
    paymentPercent: 42.80,
    status: "Confirmed",
    sellerName: "Grantaire Senior",
  },
  {
    contractNumber: "STU",
    accountNo: "B000158765",
    clientName: "2-Bedroom D (Inner) Available",
    paymentReceived: "Php 234,567.89",
    paymentPercent: 67.45,
    status: "Pending",
    sellerName: "Monsieur Pontmercy",
  },
  {
    contractNumber: "TUV",
    accountNo: "B000165432",
    clientName: "Spouses George Taylor and Margaret Taylor",
    paymentReceived: "Php 1,456,789.01",
    paymentPercent: 81.20,
    status: "Confirmed",
    sellerName: "Madame Pontmercy",
  },
  {
    contractNumber: "UVW",
    accountNo: "B000172109",
    clientName: "4-Bedroom C (Facing) Available",
    paymentReceived: "Php 645,678.90",
    paymentPercent: 59.75,
    status: "Confirmed",
    sellerName: "Valjean Junior",
  },
  {
    contractNumber: "VWX",
    accountNo: "B000178876",
    clientName: "Spouses William Anderson and Susan Anderson",
    paymentReceived: "Php 789,012.34",
    paymentPercent: 73.60,
    status: "Confirmed",
    sellerName: "Cosette Senior",
  },
  {
    contractNumber: "WXY",
    accountNo: "B000185543",
    clientName: "3-Bedroom D (Corner) Available",
    paymentReceived: "Php 456,789.01",
    paymentPercent: 48.90,
    status: "Pending",
    sellerName: "Éponine Junior",
  },
  {
    contractNumber: "XYZ",
    accountNo: "B000192210",
    clientName: "Spouses Thomas Martin and Dorothy Martin",
    paymentReceived: "Php 1,789,012.34",
    paymentPercent: 86.45,
    status: "Confirmed",
    sellerName: "Gavroche Senior",
  },
  {
    contractNumber: "YZA",
    accountNo: "B000198987",
    clientName: "2-Bedroom E (Facing) Available",
    paymentReceived: "Php 567,890.23",
    paymentPercent: 71.80,
    status: "Confirmed",
    sellerName: "Enjolras Junior",
  },
  {
    contractNumber: "ZAB",
    accountNo: "B000205654",
    clientName: "Spouses Charles Jackson and Anna Jackson",
    paymentReceived: "Php 234,567.01",
    paymentPercent: 37.25,
    status: "Confirmed",
    sellerName: "Javert Senior",
  },
  {
    contractNumber: "ABC",
    accountNo: "B000212321",
    clientName: "4-Bedroom D (Inner) Available",
    paymentReceived: "Php 678,901.34",
    paymentPercent: 84.15,
    status: "Pending",
    sellerName: "Fantine Junior",
  },
  {
    contractNumber: "BCD",
    accountNo: "B000218998",
    clientName: "Spouses Paul Thompson and Nancy Thompson",
    paymentReceived: "Php 1,234,561.23",
    paymentPercent: 62.70,
    status: "Confirmed",
    sellerName: "Grantaire Junior",
  },
  {
    contractNumber: "CDE",
    accountNo: "B000225665",
    clientName: "3-Bedroom E (Facing) Available",
    paymentReceived: "Php 345,678.01",
    paymentPercent: 79.55,
    status: "Confirmed",
    sellerName: "Monsieur Valjean",
  },
];

export default function ForComplianceList() {
  const { navigate } = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    clientName: "",
    sellerName: "",
    status: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      clientName: "",
      sellerName: "",
      status: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    if (
      query &&
      !row.contractNumber.toLowerCase().includes(query) &&
      !row.accountNo.toLowerCase().includes(query) &&
      !row.clientName.toLowerCase().includes(query) &&
      !row.sellerName.toLowerCase().includes(query) &&
      !row.status.toLowerCase().includes(query)
    )
      return false;
    if (filters.clientName && !row.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
    if (filters.sellerName && !row.sellerName.toLowerCase().includes(filters.sellerName.toLowerCase())) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });

  return (
    <Layout
      active="commissions"
      activeSubItem="For Compliance"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        { label: "Commission" },
        { label: "For Compliance" },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              For Compliance
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
            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              <table className="w-full min-w-[1080px] border-collapse" style={{ fontSize: "13px" }}>
                <thead className="table-head">
                  <tr className="text-left">
                    <th className="w-10 px-4 py-2">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-2 font-semibold">Contract Number</th>
                    <th className="px-2 py-2 font-semibold">Account #</th>
                    <th className="px-2 py-2 font-semibold">Client Name</th>
                    <th className="px-2 py-2 font-semibold">
                      Payment Received
                    </th>
                    <th className="px-2 py-2 font-semibold">Payment %</th>
                    <th className="px-2 py-2 font-semibold">Status</th>
                    <th className="px-2 py-2 font-semibold">Seller Name</th>
                    <th className="w-24 px-2 py-2 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.contractNumber}
                      className="border-b border-gray-100 text-gray-600 transition-colors hover:bg-primary-25/50"
                    >
                      <td className="px-4 py-1">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-1 font-medium text-gray-900">
                        {row.contractNumber}
                      </td>
                      <td className="px-2 py-1">{row.accountNo}</td>
                      <td className="px-2 py-1">
                        {row.clientName}
                      </td>
                      <td className="px-2 py-1">{row.paymentReceived}</td>
                      <td className="px-2 py-1">{row.paymentPercent.toFixed(2)}%</td>
                      <td className="px-2 py-1">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-1">{row.sellerName}</td>
                      <td className="px-2 py-1 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.contractNumber} compliance details`}
                            onClick={() =>
                              navigate({
                                screen: "compliance-details",
                                itemId: row.contractNumber,
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
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                      />
                    )}
                    {filter.kind === "text" && filter.label === "Seller Name" && (
                      <input
                        type="text"
                        placeholder={filter.placeholder}
                        value={filters.sellerName}
                        onChange={(e) => setFilters({ ...filters, sellerName: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 px-5 py-3">
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
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
