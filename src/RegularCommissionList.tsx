import { useState } from "react";
import Layout from "./Layout";
import RightDrawer from "./RightDrawer";
import FilterTrigger from "./FilterTrigger";
import Select from "./Select";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import { DownloadPdfButton, RecordTabs } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon, InfoIcon, UserCheckIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * RegularCommissionList — "Commission > Regular Commission" screen.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171748:282530.
 */

interface RegularRow {
  contractNo: string;
  buildingUnit: string;
  clientName: string;
  netTcp: string;
  primarySellerName: string;
  sellerRole: string;
  sellerGroup: string;
  accounts: string;
  contractStatus: string;
  commissionStatus: string;
  reservationDate: string;
}

const ROWS: RegularRow[] = [
  {
    contractNo: "HLD0327451",
    buildingUnit: "AST-00A-C-08018",
    clientName: "Ja Morant",
    netTcp: "1,235",
    primarySellerName: "Ja Morant",
    sellerRole: "-",
    sellerGroup: "LG_RMC29",
    accounts: "E000000000000000008729345",
    contractStatus: "Approved",
    commissionStatus: "Released",
    reservationDate: "2026-01-10",
  },
  {
    contractNo: "HLD0327448",
    buildingUnit: "SAT-00D-P-B1207",
    clientName: "Damian Lillard",
    netTcp: "2,451",
    primarySellerName: "Damian Lillard",
    sellerRole: "-",
    sellerGroup: "LG_RMC189",
    accounts: "E000000000000000008729345",
    contractStatus: "Pending",
    commissionStatus: "Pending",
    reservationDate: "2026-01-18",
  },
  {
    contractNo: "HLD0327426",
    buildingUnit: "LMR-00E-C-02014",
    clientName: "Stephen Curry",
    netTcp: "3,678",
    primarySellerName: "Stephen Curry",
    sellerRole: "-",
    sellerGroup: "LG_RMC132",
    accounts: "E000000000000000008729345",
    contractStatus: "Approved",
    commissionStatus: "Released",
    reservationDate: "2025-12-22",
  },
  {
    contractNo: "HLD0327412",
    buildingUnit: "ALR-00C-C-01007",
    clientName: "Kevin Durant",
    netTcp: "4,890",
    primarySellerName: "Kevin Durant",
    sellerRole: "-",
    sellerGroup: "LG_RMC6",
    accounts: "E000000000000000008729345",
    contractStatus: "Cancelled",
    commissionStatus: "Withheld",
    reservationDate: "2025-12-05",
  },
  {
    contractNo: "HLD0327408",
    buildingUnit: "ARP-00K-C-04005",
    clientName: "Anthony Edwards",
    netTcp: "5,123",
    primarySellerName: "Anthony Edwards",
    sellerRole: "-",
    sellerGroup: "LG_RMC195",
    accounts: "E000000000000000008729345",
    contractStatus: "Approved",
    commissionStatus: "Released",
    reservationDate: "2025-11-19",
  },
  {
    contractNo: "HLD0327395",
    buildingUnit: "AVB-00A-C-01001",
    clientName: "Jimmy Butler",
    netTcp: "6,245",
    primarySellerName: "Jimmy Butler",
    sellerRole: "-",
    sellerGroup: "LG_RMC195",
    accounts: "E000000000000000008729345",
    contractStatus: "Pending",
    commissionStatus: "Pending",
    reservationDate: "2025-11-02",
  },
  {
    contractNo: "HLD0327382",
    buildingUnit: "BRX-00F-C-03009",
    clientName: "Joel Embiid",
    netTcp: "7,890",
    primarySellerName: "Joel Embiid",
    sellerRole: "-",
    sellerGroup: "LG_RMC6",
    accounts: "E000000000000000008729345",
    contractStatus: "Approved",
    commissionStatus: "Released",
    reservationDate: "2025-10-14",
  },
];

const ACCOUNTS_OPTIONS = [...new Set(ROWS.map((r) => r.accounts))].map(
  (value) => ({ value, label: value }),
);
const CONTRACT_STATUS_OPTIONS = [
  ...new Set(ROWS.map((r) => r.contractStatus)),
].map((value) => ({ value, label: value }));
const COMMISSION_STATUS_OPTIONS = [
  ...new Set(ROWS.map((r) => r.commissionStatus)),
].map((value) => ({ value, label: value }));

export default function RegularCommissionList() {
  const { navigate } = useNavigation();
  const [tab, setTab] = useState("My commission");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [sellerNameFilter, setSellerNameFilter] = useState("");
  const [accountsFilter, setAccountsFilter] = useState("");
  const [contractStatusFilter, setContractStatusFilter] = useState("");
  const [commissionStatusFilter, setCommissionStatusFilter] = useState("");
  const [reservationDateStart, setReservationDateStart] = useState("");
  const [reservationDateEnd, setReservationDateEnd] = useState("");

  const resetFilters = () => {
    setSearchQuery("");
    setClientNameFilter("");
    setSellerNameFilter("");
    setAccountsFilter("");
    setContractStatusFilter("");
    setCommissionStatusFilter("");
    setReservationDateStart("");
    setReservationDateEnd("");
  };

  const activeFilterCount = [
    clientNameFilter,
    sellerNameFilter,
    accountsFilter,
    contractStatusFilter,
    commissionStatusFilter,
    reservationDateStart,
    reservationDateEnd,
  ].filter((val) => val !== "").length;

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      row.contractNo.toLowerCase().includes(query) ||
      row.buildingUnit.toLowerCase().includes(query) ||
      row.clientName.toLowerCase().includes(query) ||
      row.primarySellerName.toLowerCase().includes(query) ||
      row.sellerGroup.toLowerCase().includes(query);
    const matchesClientName =
      clientNameFilter.trim() === "" ||
      row.clientName
        .toLowerCase()
        .includes(clientNameFilter.trim().toLowerCase());
    const matchesSellerName =
      sellerNameFilter.trim() === "" ||
      row.primarySellerName
        .toLowerCase()
        .includes(sellerNameFilter.trim().toLowerCase());
    const matchesAccounts =
      accountsFilter === "" || row.accounts === accountsFilter;
    const matchesContractStatus =
      contractStatusFilter === "" ||
      row.contractStatus === contractStatusFilter;
    const matchesCommissionStatus =
      commissionStatusFilter === "" ||
      row.commissionStatus === commissionStatusFilter;
    const matchesReservationDate =
      (reservationDateStart === "" ||
        row.reservationDate >= reservationDateStart) &&
      (reservationDateEnd === "" || row.reservationDate <= reservationDateEnd);
    return (
      matchesSearch &&
      matchesClientName &&
      matchesSellerName &&
      matchesAccounts &&
      matchesContractStatus &&
      matchesCommissionStatus &&
      matchesReservationDate
    );
  });

  return (
    <Layout
      active="commissions"
      activeSubItem="Regular Commission"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        { label: "Commission" },
        { label: "Regular Commission" },
      ]}
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              Regular Commission
            </h1>
            <p className="text-xs text-gray-600">
              {filteredRows.length} records found
            </p>
          </div>
        </div>

        {/* pb-4: same 16px gap between the seller card and the table card. */}
        <div className="flex flex-col gap-4 px-5 pb-4">
          {/* Highlighted caveat, same soft yellow as the selfie step's "Important" note. */}
          <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs leading-[18px] text-yellow-900">
            <InfoIcon className="mt-px h-4 w-4 shrink-0 text-yellow-600" />
            <p className="m-0">
              <strong className="font-semibold">Note:</strong> All reservations
              prior to July 1, 2016 and released in IFCA (previous system) will
              not be displayed in commission ledger.
            </p>
          </div>

          {/* Compact seller bar: icon + seller ID on the left, the seller's
              ledger reports as small buttons (same light-blue look) on the right. */}
          <div className="card flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-25 text-primary-500">
                <UserCheckIcon className="h-4 w-4" />
              </span>
              <span className="text-xs text-gray-500">View Seller</span>
              <strong className="truncate text-[13px] font-semibold tracking-wide tabular-nums text-gray-900">
                E000000000000000008729345
              </strong>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Deduction", "Posted VAT", "Debit Advice"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="h-7 cursor-pointer rounded-md border border-primary-50 bg-blue-50 px-2.5 text-xs font-semibold text-primary-500 transition-colors hover:border-primary-100 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
          <div className="card flex w-full flex-1 flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 pt-1">
              <RecordTabs
                tabs={["My commission", "Teams Commission"]}
                active={tab}
                onChange={setTab}
              />
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
                <DownloadPdfButton />
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              <table className="w-full min-w-[1040px] border-collapse text-[13px]">
                <thead className="table-head">
                  <tr className="text-left">
                    <th className="w-10 px-4 py-2">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-2 font-semibold">Contract No.</th>
                    <th className="px-2 py-2 font-semibold">Building Unit</th>
                    <th className="px-2 py-2 font-semibold">Client Name</th>
                    <th className="px-2 py-2 font-semibold">Net TCP</th>
                    <th className="px-2 py-2 font-semibold">
                      Primary Seller Name
                    </th>
                    <th className="px-2 py-2 font-semibold">Seller Role</th>
                    <th className="px-2 py-2 font-semibold">Seller Group</th>
                    <th className="w-24 px-2 py-2 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.contractNo}
                      className="border-b border-gray-100 text-gray-600 transition-colors hover:bg-primary-25/50"
                    >
                      <td className="px-4 py-1">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-1 font-medium text-gray-900">
                        {row.contractNo}
                      </td>
                      <td className="px-2 py-1">{row.buildingUnit}</td>
                      <td className="px-2 py-1 font-medium text-gray-900">
                        {row.clientName}
                      </td>
                      <td className="px-2 py-1">{row.netTcp}</td>
                      <td className="px-2 py-1">{row.primarySellerName}</td>
                      <td className="px-2 py-1">{row.sellerRole}</td>
                      <td className="px-2 py-1">{row.sellerGroup}</td>
                      <td className="px-2 py-1 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.contractNo} details`}
                            onClick={() =>
                              navigate({
                                screen: "regular-commission-details",
                                itemId: row.contractNo,
                              })
                            }
                            size="sm"
                            icon={<EyeIcon className="h-[22px] w-[22px]" />}
                            label="View"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={85} />
          </div>
        </div>
      </div>

      <RightDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
      >
        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Client Name
            </label>
            <input
              type="text"
              placeholder="Enter client name"
              value={clientNameFilter}
              onChange={(e) => setClientNameFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Seller Name
            </label>
            <input
              type="text"
              placeholder="Enter seller name"
              value={sellerNameFilter}
              onChange={(e) => setSellerNameFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Accounts
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              value={accountsFilter}
              onChange={setAccountsFilter}
              options={ACCOUNTS_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Contract Status
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              value={contractStatusFilter}
              onChange={setContractStatusFilter}
              options={CONTRACT_STATUS_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Reservation Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={reservationDateStart}
                onChange={(e) => setReservationDateStart(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
              />
              <input
                type="date"
                value={reservationDateEnd}
                onChange={(e) => setReservationDateEnd(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">
              Commission Status
            </label>
            <Select
              size="sm"
              placeholder="Select one"
              value={commissionStatusFilter}
              onChange={setCommissionStatusFilter}
              options={COMMISSION_STATUS_OPTIONS}
            />
          </div>
        </div>

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
    </Layout>
  );
}
