import { useState } from "react";
import Layout from "./Layout";
import { type FilterField } from "./FilterBar";
import Pagination from "./Pagination";
import { StatusPill } from "./StatusBadge";
import { ArrowRightIcon, CalendarIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import { useCountdown } from "./useCountdown";
import RegisterCrfModal, { type RegisterCrfDetails } from "./RegisterCrfModal";
import RightDrawer from "./RightDrawer";
import FilterTrigger from "./FilterTrigger";
import Button from "./Button";
import Select from "./Select";
import Input from "./Input";

/**
 * LotteryRegistrationList — "Lottery Event > Registration" screen: the
 * live-batch banner + search + filter drawer + the registration table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173096:181809.
 * The "Register" action opens node 173424:175687.
 */

const FILTERS: FilterField[] = [
  { kind: "text", label: "CRF Number", placeholder: "Enter CRF number" },
  { kind: "text", label: "Client Name", placeholder: "Enter client name" },
  {
    kind: "text",
    label: "Primary Seller",
    placeholder: "Enter primary seller",
  },
  { kind: "select", label: "Status", placeholder: "Select one" },
];

interface RegistrationRow {
  crfNumber: string;
  accountNumber: string;
  clientName: string;
  status: string;
  sellerName: string;
}

const ROWS: RegistrationRow[] = [
  {
    crfNumber: "CRF1297569",
    accountNumber: "B000143929",
    clientName: "Ja Morant",
    status: "Active",
    sellerName: "Jean Valjean",
  },
  {
    crfNumber: "CRF1303552",
    accountNumber: "B000203725",
    clientName: "Damian Lillard",
    status: "Active",
    sellerName: "Cosette Fauchelevent",
  },
  {
    crfNumber: "CRF1302814",
    accountNumber: "B000210020",
    clientName: "Stephen Curry",
    status: "Active",
    sellerName: "Éponine Thénardier",
  },
  {
    crfNumber: "CRF1308471",
    accountNumber: "B000314679",
    clientName: "Kevin Durant",
    status: "Active",
    sellerName: "Gavroche Thénardier",
  },
  {
    crfNumber: "CRF1310034",
    accountNumber: "B000415832",
    clientName: "Anthony Edwards",
    status: "Active",
    sellerName: "Enjolras ABC",
  },
  {
    crfNumber: "CRF1314228",
    accountNumber: "B000527014",
    clientName: "Jimmy Butler",
    status: "Active",
    sellerName: "Javert XYZ",
  },
  {
    crfNumber: "CRF1320197",
    accountNumber: "B000635920",
    clientName: "Joel Embiid",
    status: "Active",
    sellerName: "Fantine QWE",
  },
  {
    crfNumber: "CRF1324570",
    accountNumber: "B000742118",
    clientName: "Jayson Tatum",
    status: "Active",
    sellerName: "Grantaire UIO",
  },
  {
    crfNumber: "CRF1330085",
    accountNumber: "B000856403",
    clientName: "Lebron James",
    status: "Active",
    sellerName: "Marius Pontmercy",
  },
  {
    crfNumber: "CRF1335421",
    accountNumber: "B000964107",
    clientName: "Luka Doncic",
    status: "Pending",
    sellerName: "Fantine ABC",
  },
  {
    crfNumber: "CRF1340156",
    accountNumber: "B001072458",
    clientName: "Giannis Antetokounmpo",
    status: "Active",
    sellerName: "Thénardier QWE",
  },
  {
    crfNumber: "CRF1345789",
    accountNumber: "B001185632",
    clientName: "Kawhi Leonard",
    status: "Cancelled",
    sellerName: "Valjean XYZ",
  },
  {
    crfNumber: "CRF1350234",
    accountNumber: "B001298704",
    clientName: "Nikola Jokic",
    status: "Pending",
    sellerName: "Enjolras DEF",
  },
  {
    crfNumber: "CRF1355867",
    accountNumber: "B001407856",
    clientName: "Devin Booker",
    status: "Active",
    sellerName: "Cosette GHI",
  },
  {
    crfNumber: "CRF1360512",
    accountNumber: "B001516923",
    clientName: "Shai Gilgeous-Alexander",
    status: "Active",
    sellerName: "Gavroche JKL",
  },
  {
    crfNumber: "CRF1365743",
    accountNumber: "B001625174",
    clientName: "Trae Young",
    status: "Pending",
    sellerName: "Javert MNO",
  },
  {
    crfNumber: "CRF1370198",
    accountNumber: "B001734285",
    clientName: "Donovan Mitchell",
    status: "Active",
    sellerName: "Fantine PQR",
  },
  {
    crfNumber: "CRF1375621",
    accountNumber: "B001843396",
    clientName: "Paolo Banchero",
    status: "Active",
    sellerName: "Enjolras STU",
  },
  {
    crfNumber: "CRF1380456",
    accountNumber: "B001952507",
    clientName: "Victor Wembanyama",
    status: "Cancelled",
    sellerName: "Valjean VWX",
  },
  {
    crfNumber: "CRF1385789",
    accountNumber: "B002061618",
    clientName: "Zion Williamson",
    status: "Pending",
    sellerName: "Cosette YZA",
  },
  {
    crfNumber: "CRF1390234",
    accountNumber: "B002170729",
    clientName: "Tyler Herro",
    status: "Active",
    sellerName: "Gavroche BCD",
  },
  {
    crfNumber: "CRF1395867",
    accountNumber: "B002289830",
    clientName: "Chris Paul",
    status: "Active",
    sellerName: "Javert EFG",
  },
  {
    crfNumber: "CRF1400512",
    accountNumber: "B002398941",
    clientName: "Khris Middleton",
    status: "Pending",
    sellerName: "Fantine HIJ",
  },
  {
    crfNumber: "CRF1405743",
    accountNumber: "B002507052",
    clientName: "Scottie Barnes",
    status: "Active",
    sellerName: "Enjolras KLM",
  },
  {
    crfNumber: "CRF1410198",
    accountNumber: "B002616163",
    clientName: "Jalen Brunson",
    status: "Active",
    sellerName: "Valjean NOP",
  },
  {
    crfNumber: "CRF1415621",
    accountNumber: "B002725274",
    clientName: "Darius Garland",
    status: "Cancelled",
    sellerName: "Cosette QRS",
  },
  {
    crfNumber: "CRF1420456",
    accountNumber: "B002834385",
    clientName: "Anfernee Simons",
    status: "Active",
    sellerName: "Gavroche TUV",
  },
  {
    crfNumber: "CRF1425789",
    accountNumber: "B002943496",
    clientName: "Tyrese Maxey",
    status: "Pending",
    sellerName: "Javert WXY",
  },
  {
    crfNumber: "CRF1430234",
    accountNumber: "B003052507",
    clientName: "Lamelo Ball",
    status: "Active",
    sellerName: "Fantine ZAB",
  },
  {
    crfNumber: "CRF1435867",
    accountNumber: "B003161618",
    clientName: "Franz Wagner",
    status: "Active",
    sellerName: "Enjolras CDE",
  },
];

function LiveBatchBanner() {
  const closesIn = useCountdown(4 * 3600 + 9 * 60 + 13);
  return (
    <div className="shrink-0 px-5 py-0">
      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-primary-500 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-primary-600 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success-500" />
              LIVE
            </span>
            <span className="text-base font-semibold text-white">
              15 July Lottery Batch
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-white/80">
            CLOSES IN
            <span className="rounded-md bg-white/15 px-2.5 py-1 font-mono text-sm font-bold text-white">
              {closesIn}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-primary-50 px-5 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-primary-900 px-2 py-1 text-xs font-semibold text-white">
              OPENS
            </span>
            <span className="text-gray-700">Jul 15, 2026 · 9:00 AM</span>
            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
            <span className="rounded-md bg-primary-900 px-2 py-1 text-xs font-semibold text-white">
              CLOSES
            </span>
            <span className="text-gray-700">Jul 15, 2026 · 9:00 PM</span>
            <span className="h-4 w-px bg-primary-200" />
            <CalendarIcon className="h-4 w-4 text-primary-600" />
            <span className="text-gray-700">
              CRF valid until{" "}
              <strong className="font-semibold text-primary-600">
                Jul 15, 2026
              </strong>
            </span>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-56">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary-600 to-success-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900">65%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LotteryRegistrationList() {
  const { navigate } = useNavigation();
  const [registering, setRegistering] = useState<RegistrationRow | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    crfNumber: "",
    clientName: "",
    sellerName: "",
    status: "",
  });

  const activeFilterCount = Object.values(filters).filter((val) => val).length;

  const resetFilters = () => {
    setFilters({
      crfNumber: "",
      clientName: "",
      sellerName: "",
      status: "",
    });
  };

  const filteredRows = ROWS.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    if (
      query &&
      !row.crfNumber.toLowerCase().includes(query) &&
      !row.clientName.toLowerCase().includes(query) &&
      !row.sellerName.toLowerCase().includes(query)
    )
      return false;
    if (
      filters.crfNumber &&
      !row.crfNumber.toLowerCase().includes(filters.crfNumber.toLowerCase())
    )
      return false;
    if (
      filters.clientName &&
      !row.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
    )
      return false;
    if (
      filters.sellerName &&
      !row.sellerName.toLowerCase().includes(filters.sellerName.toLowerCase())
    )
      return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });

  const toDetails = (row: RegistrationRow): RegisterCrfDetails => ({
    crfNumber: row.crfNumber,
    clientName: row.clientName,
    sellerName: row.sellerName,
    crfExpiry: "08/06/2026, 06:00:00",
  });

  return (
    <Layout
      active="lottery"
      activeSubItem="Registration"
      breadcrumb={[
        {
          label: "Dashboard",
          onClick: () => navigate({ screen: "dashboard" }),
        },
        { label: "Lottery Event" },
        { label: "Registration" },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              Lottery Registration
            </h1>
            <p className="text-xs text-gray-600">
              {filteredRows.length} registrations available
            </p>
          </div>
        </div>

        <LiveBatchBanner />

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
          <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
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
            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              <table
                className="w-full min-w-[1040px] border-collapse"
                style={{ fontSize: "13px" }}
              >
                <thead className="table-head">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="py-1 pl-4 pr-2 font-semibold">CRF Number</th>
                    <th className="px-2 py-1 font-semibold">Account Number</th>
                    <th className="px-2 py-1 font-semibold">Client Name</th>
                    <th className="px-2 py-1 font-semibold">Status</th>
                    <th className="px-2 py-1 font-semibold">Seller Name</th>
                    <th className="w-16 px-2 py-1 text-center font-semibold col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.crfNumber}
                      className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="py-2 pl-4 pr-2 font-medium text-gray-900">
                        {row.crfNumber}
                      </td>
                      <td className="px-2 py-2">{row.accountNumber}</td>
                      <td className="px-2 py-2">{row.clientName}</td>
                      <td className="px-2 py-2">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-2">{row.sellerName}</td>
                      <td className="px-2 py-2 col-actions">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="tertiary"
                            size="xs"
                            onClick={() => setRegistering(row)}
                          >
                            Register
                          </Button>
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

        <RightDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filters"
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
            {FILTERS.map((filter, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-900">
                  {filter.label}
                </label>
                {filter.kind === "text" && filter.label === "CRF Number" && (
                  <Input
                    type="text"
                    placeholder={filter.placeholder}
                    value={filters.crfNumber}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        crfNumber: e.target.value,
                      })
                    }
                    size="sm"
                  />
                )}
                {filter.kind === "text" && filter.label === "Client Name" && (
                  <Input
                    type="text"
                    placeholder={filter.placeholder}
                    value={filters.clientName}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        clientName: e.target.value,
                      })
                    }
                    size="sm"
                  />
                )}
                {filter.kind === "text" &&
                  filter.label === "Primary Seller" && (
                    <Input
                      type="text"
                      placeholder={filter.placeholder}
                      value={filters.sellerName}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sellerName: e.target.value,
                        })
                      }
                      size="sm"
                    />
                  )}
                {filter.kind === "select" && filter.label === "Status" && (
                  <Select
                    size="sm"
                    value={filters.status}
                    onChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
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
              </div>
            ))}
          </div>

          {/* Sticky buttons at bottom */}
          <div className="shrink-0 border-t border-gray-200 px-5 py-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    crfNumber: "",
                    clientName: "",
                    sellerName: "",
                    status: "",
                  });
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowFilters(false)}
                className="flex-1"
              >
                Search
              </Button>
            </div>
          </div>
        </RightDrawer>
      </div>

      {registering && (
        <RegisterCrfModal
          details={toDetails(registering)}
          onCancel={() => setRegistering(null)}
          onConfirm={() => setRegistering(null)}
        />
      )}
    </Layout>
  );
}
