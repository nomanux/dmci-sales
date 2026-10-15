import { useState } from "react";
import Layout from "./Layout";
import { type FilterField } from "./FilterBar";
import FilterTrigger from "./FilterTrigger";
import Pagination from "./Pagination";
import Select from "./Select";
import { StatusPill } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import ClientDetailsModal, { type ClientDetails } from "./ClientDetailsModal";

/**
 * ClientsList — "Clients" screen, reached from the sidebar.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 169326:205226.
 * Clicking the eye ("Actions") icon opens the "View Client" modal,
 * node 172025:276541.
 */

const FILTERS: FilterField[] = [
  { kind: "text", label: "Client Name", placeholder: "Enter client name" },
  { kind: "text", label: "Primary Seller", placeholder: "Enter primary seller" },
  { kind: "select", label: "Status", placeholder: "Select one" },
];

interface ClientRow {
  crfNumber: string;
  accountNo: string;
  clientName: string;
  status: string;
  sellerName: string;
  salesGroup: string;
}

const ROWS: ClientRow[] = [
  { crfNumber: "CRF1297569", accountNo: "B000143929", clientName: "Ja Morant", status: "Expired", sellerName: "Jean Valjean", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1303552", accountNo: "B000203725", clientName: "Damian Lillard", status: "Active", sellerName: "Cosette Fauchelevent", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1302814", accountNo: "B000210020", clientName: "Stephen Curry", status: "Active", sellerName: "Éponine Thénardier", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1308471", accountNo: "B000314679", clientName: "Kevin Durant", status: "Expired", sellerName: "Gavroche Thénardier", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1310034", accountNo: "B000415832", clientName: "Anthony Edwards", status: "Expired", sellerName: "Enjolras ABC", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1314228", accountNo: "B000527014", clientName: "Jimmy Butler", status: "Active", sellerName: "Javert XYZ", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1320197", accountNo: "B000635920", clientName: "Joel Embiid", status: "Active", sellerName: "Fantine QWE", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1324570", accountNo: "B000742118", clientName: "Jayson Tatum", status: "Active", sellerName: "Grantaire UIO", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1330085", accountNo: "B000856403", clientName: "Lebron James", status: "Active", sellerName: "Marius Pontmercy", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1335412", accountNo: "B000967521", clientName: "Luka Doncic", status: "Active", sellerName: "Urban Development", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1340678", accountNo: "B001054837", clientName: "Giannis Antetokounmpo", status: "Expired", sellerName: "Green Space", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1345923", accountNo: "B001152643", clientName: "Kawhi Leonard", status: "Active", sellerName: "Retail Partners", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1351256", accountNo: "B001256789", clientName: "Nikola Jokic", status: "Active", sellerName: "Commercial Spaces", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1356789", accountNo: "B001358901", clientName: "Devin Booker", status: "Expired", sellerName: "Motorcycle Parking", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1362145", accountNo: "B001450213", clientName: "Shai Gilgeous-Alexander", status: "Active", sellerName: "Urban Development", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1367589", accountNo: "B001567924", clientName: "Trae Young", status: "Active", sellerName: "Retail Partners", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1372934", accountNo: "B001678435", clientName: "Donovan Mitchell", status: "Active", sellerName: "Green Space", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1378256", accountNo: "B001789546", clientName: "Damian Lillard", status: "Expired", sellerName: "Commercial Spaces", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1383567", accountNo: "B001890657", clientName: "Tyson Jalis", status: "Active", sellerName: "Motorcycle Parking", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1388912", accountNo: "B001956789", clientName: "Paolo Banchero", status: "Active", sellerName: "Urban Development", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1394156", accountNo: "B002056843", clientName: "Victor Wembanyama", status: "Expired", sellerName: "Retail Partners", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1399567", accountNo: "B002145932", clientName: "Zion Williamson", status: "Active", sellerName: "Green Space", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1404823", accountNo: "B002256471", clientName: "Tyler Herro", status: "Active", sellerName: "Commercial Spaces", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1410189", accountNo: "B002367582", clientName: "Chris Paul", status: "Active", sellerName: "Motorcycle Parking", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1415456", accountNo: "B002478693", clientName: "Khris Middleton", status: "Expired", sellerName: "Urban Development", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1420734", accountNo: "B002589704", clientName: "Jimmy Butler", status: "Active", sellerName: "Retail Partners", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1426089", accountNo: "B002690815", clientName: "Scottie Barnes", status: "Active", sellerName: "Green Space", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1431345", accountNo: "B002701926", clientName: "Jalen Brunson", status: "Active", sellerName: "Commercial Spaces", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1436678", accountNo: "B002812037", clientName: "Darius Garland", status: "Expired", sellerName: "Motorcycle Parking", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1442012", accountNo: "B002923148", clientName: "Anfernee Simons", status: "Active", sellerName: "Urban Development", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1447356", accountNo: "B003034259", clientName: "Michael Porter Jr", status: "Active", sellerName: "Retail Partners", salesGroup: "Dummy_CRF" },
  { crfNumber: "CRF1452689", accountNo: "B003145360", clientName: "Jamal Murray", status: "Expired", sellerName: "Green Space", salesGroup: "Dummy_CRF" },
];

// Demo client detail payload — the table doesn't carry these fields per row, so
// every "View" click shows the same representative record from the design.
const SAMPLE_CLIENT_DETAILS: ClientDetails = {
  address: "SLR-102938",
  registrationDate: "06/17/2026",
  expirationDate: "07/17/2026",
  contactNumber: "+639181231231",
  emailAddress: "asd@mailtrap.cc",
  customerGroup: "C-Local",
  sourceOfAwareness: [
    "Referral: Home Owner",
    "Online",
    "Agent/Broker",
    "Outdoor Ads",
    "Referral: DMCI Employee",
    "Referral: Others",
    "Booth (Asdsd D)",
    "Property Sites (ACP)",
    "Other Sources (lsd Sdiiss)",
  ],
};

export default function ClientsList() {
  const { navigate } = useNavigation();
  const [viewingClient, setViewingClient] = useState<ClientRow | null>(null);
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
      !row.crfNumber.toLowerCase().includes(query) &&
      !row.accountNo.toLowerCase().includes(query) &&
      !row.clientName.toLowerCase().includes(query) &&
      !row.sellerName.toLowerCase().includes(query)
    )
      return false;
    if (filters.clientName && !row.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
    if (filters.sellerName && !row.sellerName.toLowerCase().includes(filters.sellerName.toLowerCase())) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });

  return (
    <Layout
      active="clients"
      breadcrumb={[{ label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) }, { label: "Client" }]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">Clients</h1>
            <p className="text-xs text-gray-600">{filteredRows.length} clients available</p>
          </div>
        </div>

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
              <table className="w-full min-w-[1040px] border-collapse" style={{ fontSize: "13px" }}>
                <thead className="table-head">
                  <tr className="text-left">
                    <th className="py-2 pl-4 pr-2 font-semibold">CRF Number</th>
                    <th className="px-2 py-2 font-semibold">Account #</th>
                    <th className="px-2 py-2 font-semibold">Client Name</th>
                    <th className="px-2 py-2 font-semibold">Status</th>
                    <th className="px-2 py-2 font-semibold">Seller Name</th>
                    <th className="px-2 py-2 font-semibold">Sales Group</th>
                    <th className="w-24 px-2 py-2 text-center font-semibold col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.crfNumber} className="border-b border-gray-100 text-gray-600 transition-colors hover:bg-primary-25/50">
                      <td className="py-1 pl-4 pr-2 font-medium text-gray-900">{row.crfNumber}</td>
                      <td className="px-2 py-1">{row.accountNo}</td>
                      <td className="px-2 py-1">{row.clientName}</td>
                      <td className="px-2 py-1">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-1">{row.sellerName}</td>
                      <td className="px-2 py-1">{row.salesGroup}</td>
                      <td className="px-2 py-1 col-actions">
                        <div className="flex items-center justify-center">
                          <RowActionButton
                            aria-label={`View ${row.clientName}`}
                            onClick={() => setViewingClient(row)}
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
                    {filter.kind === "text" && filter.label === "Primary Seller" && (
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
                  onClick={() => {
                    setFilters({
                      clientName: "",
                      sellerName: "",
                      status: "",
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

      {viewingClient && <ClientDetailsModal client={SAMPLE_CLIENT_DETAILS} onClose={() => setViewingClient(null)} />}
    </Layout>
  );
}
