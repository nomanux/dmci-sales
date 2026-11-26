import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/Button";
import AdminLayout from "./AdminLayout";
import Badge from "./Badge";
import TablePagination from "./TablePagination";
import UnderlineTabs from "./UnderlineTabs";
import { PaymentDrawer, ProofDialog } from "./ReservationPaymentPanels";
import { RTO_APPLICATIONS, type RtoApplication, type Track } from "./rtoData";
import searchLg from "../assets/icons/search-lg.svg";
import filterLines from "../assets/icons/filter-lines.svg";
import share06 from "../assets/icons/share-06.svg";

/**
 * Reservation Operations at /mydmci/admin/reservation-ops: the reservation
 * payment for every application, with proof, receipt and the next action.
 * Figma: DMCI-SID-Portal, "Reservation Operations" 163990:105415.
 *
 * Rows come from the shared sample applications. Payment status follows the
 * stage: still at TIS = RA pending, RA = waiting for payment verification,
 * later = paid. Verify marks a payment paid and issues a receipt (in memory).
 */

type TabKey = "all" | Track;
export type PayStatus = "RA pending" | "For verification" | "Paid" | "Rejected";
type PayFilter = "all" | PayStatus;

export interface OpsRow {
  tisNo: string;
  client: string;
  track: Track;
  unit: string;
  project: string;
  ra: "Signed" | "Pending";
  amount: string;
  method: "Online" | "Manual";
  status: PayStatus;
  receipt: string | null;
  /** Card or bank, e.g. "Mastercard •••• 1907"; null until the client pays / uploads. */
  channel: string | null;
  reference: string | null;
  datePaid: string | null;
  proofFile: string | null;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "rto", label: "RTO" },
  { key: "dmci", label: "Leasing: DMCI owned" },
  { key: "non-dmci", label: "Leasing: non-DMCI owned" },
];

const PAY_FILTERS: { key: PayFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "RA pending", label: "RA pending" },
  { key: "For verification", label: "For verification" },
  { key: "Paid", label: "Paid" },
];

const AMOUNTS = [25000, 30000, 28000, 22000, 26000, 24000, 32000];
const PROJECTS = ["Prisma Residences", "Kai Garden Residences", "Allegra Garden Place", "Alder Residences", "Satori Residences"];
const CARDS = ["Mastercard •••• 1907", "Visa •••• 4421", "GCash •••• 7782"];
const BANKS = ["BPI Fund Transfer", "BDO Bank Deposit", "UnionBank Transfer"];
const PAID_DATES = ["Nov 4, 2026", "Nov 2, 2026", "Oct 30, 2026", "Oct 27, 2026", "Oct 22, 2026"];

function buildRows(apps: RtoApplication[]): OpsRow[] {
  let receiptNo = 0;
  return apps.map((app, i) => {
    const status: PayStatus = app.stage === "TIS" ? "RA pending" : app.stage === "RA" ? "For verification" : "Paid";
    const method = status === "For verification" || i % 3 === 1 ? "Manual" : "Online";
    const hasProof = status !== "RA pending";
    return {
      tisNo: app.tisNo,
      client: app.client,
      track: app.track,
      unit: app.unit,
      project: PROJECTS[i % PROJECTS.length],
      ra: status === "RA pending" ? "Pending" : "Signed",
      amount: `PHP ${AMOUNTS[i % AMOUNTS.length].toLocaleString("en-US")}`,
      method,
      status,
      receipt: status === "Paid" ? `PR-${String(++receiptNo).padStart(4, "0")}` : null,
      channel: hasProof ? (method === "Online" ? CARDS[i % CARDS.length] : BANKS[i % BANKS.length]) : null,
      reference: hasProof ? `${method === "Online" ? "TXN" : "DEP"}-${809752 + i * 137}` : null,
      datePaid: hasProof ? PAID_DATES[i % PAID_DATES.length] : null,
      proofFile: hasProof ? `${method === "Online" ? "gateway-receipt" : "proof-of-payment"}-${app.tisNo}.pdf` : null,
    };
  });
}

const PAY_TONE = { "RA pending": "warning", "For verification": "info", Paid: "success", Rejected: "error" } as const;

const COLUMNS: { label: string; className?: string }[] = [
  { label: "Application" },
  { label: "Client" },
  { label: "RA" },
  { label: "Reservation" },
  { label: "Method" },
  { label: "Proof", className: "text-center" },
  { label: "Payment" },
  { label: "Receipt" },
  { label: "Action", className: "text-center" },
];

const cell = "h-11 border-0 border-b border-solid border-[#e9eaeb] px-5 text-sm leading-5 whitespace-nowrap";
const linkBtn =
  "inline-flex h-8 cursor-pointer items-center rounded-lg border-0 bg-transparent px-3 text-xs font-medium leading-[18px] text-[#10398e] hover:bg-[#f5f8ff]";

export default function ReservationOpsPage() {
  const [rows, setRows] = useState<OpsRow[]>(() => buildRows(RTO_APPLICATIONS));
  const [tab, setTab] = useState<TabKey>("all");
  const [pay, setPay] = useState<PayFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewing, setViewing] = useState<OpsRow | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // Read from rows so the drawer updates when a payment is verified.
  const openRow = openId ? rows.find((r) => r.tisNo === openId) ?? null : null;

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((r) => [r.tisNo, r.client, r.receipt ?? ""].some((v) => v.toLowerCase().includes(q))) : rows;
  }, [rows, query]);
  const inTab = tab === "all" ? searched : searched.filter((r) => r.track === tab);
  const filtered = pay === "all" ? inTab : inTab.filter((r) => r.status === pay);

  const tabCounts = useMemo(() => {
    const c: Record<TabKey, number> = { all: searched.length, rto: 0, dmci: 0, "non-dmci": 0 };
    for (const r of searched) c[r.track] += 1;
    return c;
  }, [searched]);
  const payCount = (k: PayFilter) => (k === "all" ? inTab.length : inTab.filter((r) => r.status === k).length);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function verify(row: OpsRow) {
    setRows((list) => {
      const next = list.reduce((max, r) => Math.max(max, r.receipt ? Number(r.receipt.slice(3)) : 0), 0) + 1;
      return list.map((r) =>
        r.tisNo === row.tisNo ? { ...r, status: "Paid", receipt: `PR-${String(next).padStart(4, "0")}` } : r,
      );
    });
  }

  /** Proof sent back to the client; they upload a new one. */
  function reject(row: OpsRow) {
    setRows((list) => list.map((r) => (r.tisNo === row.tisNo ? { ...r, status: "Rejected" } : r)));
  }

  function exportCsv() {
    const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      ["Application", "Client", "RA", "Reservation", "Method", "Payment", "Receipt"],
      ...filtered.map((r) => [r.tisNo, r.client, r.ra, r.amount, r.method, r.status, r.receipt ?? "Not issued"]),
    ];
    const url = URL.createObjectURL(new Blob([lines.map((l) => l.map(q).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "reservation-operations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout active="reservation-ops" breadcrumb={["Dashboard", "Reservation Operations"]}>
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="m-0 text-xl font-semibold leading-[30px] text-[#181d27]">Reservation Operations</h1>
            <p className="m-0 text-xs leading-[18px] text-[#535862]">{rows.length} items are available</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-9 w-40 items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 shadow-[0_1px_2px_rgba(10,13,18,0.05)] focus-within:border-[#2b68e5]">
              <img src={searchLg} alt="" width={20} height={20} className="block size-5 shrink-0" />
              <span className="sr-only">Search reservations</span>
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
            <Button variant="secondary" size="sm" className="h-9 gap-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)]" onClick={exportCsv}>
              <img src={share06} alt="" width={20} height={20} className="block size-5" />
              Export
            </Button>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <UnderlineTabs
            label="Application type"
            tabs={TABS.map((t) => ({ ...t, badge: tabCounts[t.key] }))}
            value={tab}
            onChange={(key) => {
              setTab(key);
              setPage(1);
            }}
          />

          {/* Payment status */}
          <div className="flex flex-wrap items-center gap-3 border-0 border-b border-solid border-[#e9eaeb] px-5 py-3">
            <span id="pay-status-label" className="text-sm font-medium leading-5 text-[#535862]">
              Payment status
            </span>
            <div role="group" aria-labelledby="pay-status-label" className="flex gap-0.5 overflow-x-auto rounded-lg bg-[#f5f5f5] p-[3px]">
              {PAY_FILTERS.map((f) => {
                const selected = pay === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setPay(f.key);
                      setPage(1);
                    }}
                    className={`relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-1.5 ${
                      selected ? "text-[#181d27]" : "text-[#535862] hover:text-[#181d27]"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="pay-seg-pill"
                        transition={{ type: "spring", stiffness: 520, damping: 38 }}
                        className="absolute inset-0 rounded-md bg-white shadow-[0_1px_3px_rgba(10,13,18,0.1)]"
                      />
                    )}
                    <span className="relative text-sm font-semibold leading-5">{f.label}</span>
                    <span className="relative text-xs font-medium leading-[18px] text-[#535862]">{payCount(f.key)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.label}
                      scope="col"
                      className={`h-11 border-0 border-b border-solid border-[#e9eaeb] bg-[#fafafa] px-5 text-left text-xs font-semibold leading-[18px] text-[#717680] ${c.className ?? ""}`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.tisNo} className="hover:bg-[#fafafa]">
                    <td className={`${cell} font-medium text-[#181d27]`}>{r.tisNo}</td>
                    <td className={`${cell} text-[#535862]`}>{r.client}</td>
                    <td className={cell}>
                      <Badge tone={r.ra === "Pending" ? "warning" : undefined}>{r.ra}</Badge>
                    </td>
                    <td className={`${cell} text-[#535862]`}>{r.amount}</td>
                    <td className={`${cell} text-[#535862]`}>{r.method}</td>
                    <td className={`${cell} px-4 text-center`}>
                      {r.status === "RA pending" ? (
                        <span className="px-3 text-xs font-medium leading-[18px] text-[#535862]">Not uploaded</span>
                      ) : (
                        <button type="button" className={linkBtn} onClick={() => setViewing(r)}>
                          View<span className="sr-only"> proof of payment for {r.tisNo}</span>
                        </button>
                      )}
                    </td>
                    <td className={cell}>
                      <Badge tone={PAY_TONE[r.status]}>{r.status === "RA pending" ? "Pending" : r.status}</Badge>
                    </td>
                    <td className={`${cell} text-[#535862]`}>{r.receipt ?? "Not issued"}</td>
                    <td className={`${cell} px-4 text-center`}>
                      {r.status === "For verification" ? (
                        <button type="button" className={linkBtn} onClick={() => setOpenId(r.tisNo)}>
                          Verify<span className="sr-only"> payment for {r.tisNo}</span>
                        </button>
                      ) : (
                        <button type="button" className={linkBtn} onClick={() => setOpenId(r.tisNo)}>
                          Open<span className="sr-only"> {r.tisNo}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-5 py-12 text-center text-sm text-[#717680]">
                      No reservations match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            total={filtered.length}
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

      {/* Drawer first, so the proof and verify windows stack above it. */}
      <AnimatePresence>
        {openRow && (
          <PaymentDrawer
            key={`drawer-${openRow.tisNo}`}
            row={openRow}
            onClose={() => setOpenId(null)}
            onViewProof={() => setViewing(openRow)}
            onApprove={() => verify(openRow)}
            onReject={() => reject(openRow)}
            covered={Boolean(viewing)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {viewing && <ProofDialog key={`proof-${viewing.tisNo}`} row={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </AdminLayout>
  );
}
