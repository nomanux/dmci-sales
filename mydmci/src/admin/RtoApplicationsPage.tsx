import { useMemo, useState } from "react";
import Button from "@/Button";
import AdminLayout from "./AdminLayout";
import TablePagination from "./TablePagination";
import Badge from "./Badge";
import UnderlineTabs from "./UnderlineTabs";
import { navigate } from "../router";
import { RTO_APPLICATIONS, type RtoApplication, type Track } from "./rtoData";
import searchLg from "../assets/icons/search-lg.svg";
import filterLines from "../assets/icons/filter-lines.svg";
import share06 from "../assets/icons/share-06.svg";
import eye from "../assets/icons/eye.svg";

/**
 * RTO Applications list at /mydmci/admin.
 * Figma: DMCI-SID-Portal, "RTO Application" 163939:140079.
 */

type TabKey = "all" | Track;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "rto", label: "RTO" },
  { key: "dmci", label: "Leasing: DMCI owned" },
  { key: "non-dmci", label: "Leasing: non-DMCI owned" },
];

const COLUMNS: { label: string; width: number }[] = [
  { label: "TIS No.", width: 161 },
  { label: "Client", width: 161 },
  { label: "Customer Type", width: 129 },
  { label: "Unit", width: 161 },
  { label: "Seller", width: 161 },
  { label: "Unit Status", width: 161 },
  { label: "Stage", width: 161 },
  { label: "D365 Sync", width: 100 },
  { label: "Actions", width: 117 },
];

const cell = "h-11 border-0 border-b border-solid border-[#e9eaeb] px-5 text-sm leading-5 whitespace-nowrap";

function matches(row: RtoApplication, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [row.tisNo, row.client, row.unit, row.seller].some((v) => v.toLowerCase().includes(q));
}

export default function RtoApplicationsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searched = useMemo(() => RTO_APPLICATIONS.filter((row) => matches(row, query.trim())), [query]);
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { all: searched.length, rto: 0, dmci: 0, "non-dmci": 0 };
    for (const row of searched) c[row.track] += 1;
    return c;
  }, [searched]);
  const rows = tab === "all" ? searched : searched.filter((row) => row.track === tab);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AdminLayout active="rto-applications" breadcrumb={["Dashboard", "RTO Applications"]}>
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
        {/* Page header: title, count and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="m-0 text-xl font-semibold leading-[30px] text-[#181d27]">RTO Applications</h1>
            <p className="m-0 text-xs leading-[18px] text-[#535862]">
              {RTO_APPLICATIONS.length} items are available
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-9 w-40 items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 shadow-[0_1px_2px_rgba(10,13,18,0.05)] focus-within:border-[#2b68e5]">
              <img src={searchLg} alt="" width={20} height={20} className="block size-5 shrink-0" />
              <span className="sr-only">Search applications</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 text-[#181d27] outline-none placeholder:text-[#717680]"
              />
            </label>
            <Button variant="secondary" size="sm" className="h-9 gap-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
              <img src={filterLines} alt="" width={20} height={20} className="block size-5" />
              Filter
            </Button>
            <Button variant="secondary" size="sm" className="h-9 gap-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
              <img src={share06} alt="" width={20} height={20} className="block size-5" />
              Export
            </Button>
            <Button variant="primary" size="sm" className="h-9">
              Create Link
            </Button>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white">
          <UnderlineTabs
            label="Application type"
            tabs={TABS.map((t) => ({ ...t, badge: counts[t.key] }))}
            value={tab}
            onChange={(key) => {
              setTab(key);
              setPage(1);
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1312px] table-fixed border-collapse">
              <colgroup>
                {COLUMNS.map((c) => (
                  <col key={c.label} style={{ width: c.width }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.label}
                      scope="col"
                      className="h-11 border-0 border-b border-solid border-[#e9eaeb] bg-[#fafafa] px-5 text-left text-xs font-semibold leading-[18px] text-[#717680]"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.tisNo} className="hover:bg-[#fafafa]">
                    <td className={`${cell} font-medium text-[#181d27]`}>{row.tisNo}</td>
                    <td className={`${cell} text-[#535862]`}>{row.client}</td>
                    <td className={cell}><Badge>{row.customerType}</Badge></td>
                    <td className={`${cell} text-[#535862]`}>{row.unit}</td>
                    <td className={`${cell} text-[#535862]`}>{row.seller}</td>
                    <td className={cell}><Badge>{row.unitStatus}</Badge></td>
                    <td className={`${cell} text-[#535862]`}>{row.stage}</td>
                    <td className={cell}><Badge>{row.sync}</Badge></td>
                    <td className={`${cell} px-4 text-center`}>
                      <button
                        type="button"
                        aria-label={`View ${row.tisNo}`}
                        onClick={() => navigate(`admin/rto/${row.tisNo}`)}
                        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-3 py-2 text-xs font-medium leading-[18px] text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#414651]"
                      >
                        <img src={eye} alt="" width={24} height={24} className="block size-6" />
                        <span className="px-0.5">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-5 py-12 text-center text-sm text-[#717680]">
                      No applications match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            total={rows.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
