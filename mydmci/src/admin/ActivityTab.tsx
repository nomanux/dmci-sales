import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircleIcon, Calendar03Icon, Clock01Icon, File01Icon } from "hugeicons-react";
import Button from "@/Button";
import Badge, { type BadgeTone } from "./Badge";
import { PreviewDialog } from "./DocumentsTab";
import { PdfIcon } from "./LeaseContractTab";

/**
 * Activity tab on the TIS details page: an append-only log of every change,
 * newest first, grouped by day. Admins can filter, search, add internal
 * notes and export what is shown.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details /
 * Activity" 164028:131248.
 *
 * Entries are the design's sample data; posted notes live in memory only.
 */

type Category = "Status" | "Documents" | "Contract" | "Payments" | "Notes" | "Turnover";
type MarkerTone = "brand" | "gray" | "warning" | "error" | "success";
type MarkerIcon = "file" | "clock" | "calendar" | "alert" | "peso" | "initials";

interface Entry {
  id: string;
  /** ISO date, used for grouping and the month filter. */
  date: string;
  time: string;
  actor: string;
  action: string;
  role: string;
  category: Category;
  marker: { tone: MarkerTone; icon: MarkerIcon; initials?: string };
  change?: { from: string; fromTone?: BadgeTone; to: string; toTone?: BadgeTone };
  file?: { name: string; meta: string };
  remark?: { text: string; tone: "neutral" | "error" };
}

const SAMPLE: Entry[] = [
  { id: "a1", date: "2026-11-06", time: "10:42 AM", actor: "Mark Cruz", action: "set the turnover date to Dec 1, 2026.", role: "PCG", category: "Turnover", marker: { tone: "gray", icon: "calendar" } },
  { id: "a2", date: "2026-11-06", time: "9:15 AM", actor: "Eva Lim", action: "signed lease contract LC-0001.", role: "Client", category: "Contract", marker: { tone: "brand", icon: "file" }, change: { from: "Released", to: "Signed" } },
  { id: "a3", date: "2026-11-03", time: "4:20 PM", actor: "Olivia Rhye", action: "added an internal note.", role: "Admin", category: "Notes", marker: { tone: "warning", icon: "initials", initials: "OR" }, remark: { text: "Client asked for an early December move-in. Check with PCG before releasing keys.", tone: "neutral" } },
  { id: "a4", date: "2026-11-03", time: "11:05 AM", actor: "Olivia Rhye", action: "released lease contract LC-0001 to the client portal.", role: "Admin", category: "Contract", marker: { tone: "brand", icon: "file" }, change: { from: "Draft", to: "Released" } },
  { id: "a5", date: "2026-11-01", time: "2:30 PM", actor: "System", action: "generated the draft lease contract with billing.", role: "D365", category: "Contract", marker: { tone: "brand", icon: "file" }, file: { name: "LC-0001-draft.pdf", meta: "PDF · 412 KB" } },
  { id: "a6", date: "2026-11-01", time: "10:12 AM", actor: "Anna Reyes", action: "marked the credit review Passed.", role: "Credit and Collection", category: "Status", marker: { tone: "brand", icon: "clock" }, change: { from: "In review", to: "Passed" } },
  { id: "a7", date: "2026-10-28", time: "3:48 PM", actor: "Jose Santos", action: "marked Valid IDs Sufficient.", role: "DICD", category: "Status", marker: { tone: "brand", icon: "clock" }, change: { from: "Submitted", to: "Sufficient" } },
  { id: "a8", date: "2026-10-28", time: "1:10 PM", actor: "Eva Lim", action: "uploaded Valid IDs, version 2.", role: "Client", category: "Documents", marker: { tone: "gray", icon: "file" }, file: { name: "valid-ids-v2.pdf", meta: "PDF · 1.8 MB · Replaces version 1" } },
  { id: "a9", date: "2026-10-28", time: "9:30 AM", actor: "Jose Santos", action: "marked Valid IDs Deficient.", role: "DICD", category: "Documents", marker: { tone: "error", icon: "alert" }, remark: { text: "Second id is expired. Please upload a valid one", tone: "error" } },
  { id: "a10", date: "2026-10-20", time: "5:02 PM", actor: "Eva Lim", action: "paid the reservation fee of PHP 25,000 via GCash.", role: "Client", category: "Payments", marker: { tone: "success", icon: "peso" }, change: { from: "Pending", fromTone: "gray", to: "Paid" } },
];

const FILTERS: ("All" | Exclude<Category, "Turnover">)[] = ["All", "Status", "Documents", "Contract", "Payments", "Notes"];

const MARKER_TONES: Record<MarkerTone, string> = {
  brand: "bg-[#e8effe] text-[#10398e]",
  gray: "bg-[#f5f5f5] text-[#414651]",
  warning: "bg-[#fef0c7] text-[#414651]",
  error: "bg-[#fef3f2] text-[#d92d20]",
  success: "bg-[#dcfae6] text-[#079455]",
};

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
const monthKey = (iso: string) => iso.slice(0, 7);
const monthLabel = (key: string) =>
  new Date(`${key}-01T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function Marker({ marker }: { marker: Entry["marker"] }) {
  const icon: Record<MarkerIcon, ReactNode> = {
    file: <File01Icon size={16} strokeWidth={1.8} color="currentColor" />,
    clock: <Clock01Icon size={16} strokeWidth={1.8} color="currentColor" />,
    calendar: <Calendar03Icon size={16} strokeWidth={1.8} color="currentColor" />,
    alert: <AlertCircleIcon size={16} strokeWidth={1.8} color="currentColor" />,
    peso: <span className="text-xs font-semibold leading-[18px]">₱</span>,
    initials: <span className="text-xs font-semibold leading-[18px]">{marker.initials}</span>,
  };
  return (
    <span aria-hidden className={`flex size-8 shrink-0 items-center justify-center rounded-full ${MARKER_TONES[marker.tone]}`}>
      {icon[marker.icon]}
    </span>
  );
}

function EntryRow({ entry, last, onView }: { entry: Entry; last: boolean; onView: (file: NonNullable<Entry["file"]>) => void }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3.5"
    >
      <div className="flex flex-col items-center gap-1 self-stretch">
        <Marker marker={entry.marker} />
        {!last && <span aria-hidden className="w-0.5 flex-1 bg-[#e9eaeb]" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 pb-5 pt-1.5">
        <div className="flex w-full items-start gap-3 text-sm leading-5">
          <p className="m-0 min-w-0 flex-1 text-[#414651]">
            <span className="font-semibold text-[#181d27]">{entry.actor}</span> {entry.action}
          </p>
          <time className="shrink-0 text-[#535862]">{entry.time}</time>
        </div>
        <p className="m-0 flex items-center gap-2 text-xs leading-[18px] text-[#535862]">
          {entry.role}
          <span aria-hidden>·</span>
          <span className="font-medium">{entry.category === "Payments" ? "Payment" : entry.category === "Notes" ? "Note" : entry.category}</span>
        </p>
        {entry.change && (
          <p className="m-0 flex items-center gap-2 text-sm leading-5 text-[#535862]">
            <Badge tone={entry.change.fromTone}>{entry.change.from}</Badge>
            <span aria-label="changed to">→</span>
            <Badge tone={entry.change.toTone}>{entry.change.to}</Badge>
          </p>
        )}
        {entry.file && (
          <div className="flex items-center gap-2.5 rounded-lg border border-solid border-[#e9eaeb] px-2.5 py-2">
            <PdfIcon size={28} />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-5 text-[#181d27]">{entry.file.name}</span>
              <span className="text-xs leading-[18px] text-[#535862]">{entry.file.meta}</span>
            </div>
            <button
              type="button"
              onClick={() => onView(entry.file!)}
              className="ml-2 cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold leading-5 text-[#0a255c] hover:underline"
            >
              View<span className="sr-only"> {entry.file.name}</span>
            </button>
          </div>
        )}
        {entry.remark && (
          <p
            className={`m-0 w-full max-w-[720px] rounded-lg px-3 py-2.5 text-sm leading-5 ${
              entry.remark.tone === "error" ? "bg-[#fef3f2] text-[#d92d20]" : "bg-[#fafafa] text-[#414651]"
            }`}
          >
            {entry.remark.text}
          </p>
        )}
      </div>
    </motion.li>
  );
}

export default function ActivityTab() {
  const [entries, setEntries] = useState<Entry[]>(SAMPLE);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("all");
  const [note, setNote] = useState("");
  const [olderLoaded, setOlderLoaded] = useState(false);
  const [viewing, setViewing] = useState<NonNullable<Entry["file"]> | null>(null);

  const months = useMemo(() => [...new Set(entries.map((e) => monthKey(e.date)))], [entries]);

  // Entries that match search and month; the chips count within these.
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (month === "all" || monthKey(e.date) === month) &&
        (!q || `${e.actor} ${e.action} ${e.role} ${e.remark?.text ?? ""} ${e.file?.name ?? ""}`.toLowerCase().includes(q)),
    );
  }, [entries, query, month]);
  const visible = filter === "All" ? scoped : scoped.filter((e) => e.category === filter);
  const count = (f: (typeof FILTERS)[number]) => (f === "All" ? scoped.length : scoped.filter((e) => e.category === f).length);

  const days = useMemo(() => {
    const groups: { date: string; items: Entry[] }[] = [];
    for (const e of visible) {
      const g = groups[groups.length - 1];
      if (g && g.date === e.date) g.items.push(e);
      else groups.push({ date: e.date, items: [e] });
    }
    return groups;
  }, [visible]);

  function postNote() {
    const text = note.trim();
    if (!text) return;
    const now = new Date();
    setEntries((list) => [
      {
        id: `n${now.getTime()}`,
        date: todayIso(),
        time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        actor: "Olivia Rhye",
        action: "added an internal note.",
        role: "Admin",
        category: "Notes",
        marker: { tone: "warning", icon: "initials", initials: "OR" },
        remark: { text, tone: "neutral" },
      },
      ...list,
    ]);
    setNote("");
  }

  function exportCsv() {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "Time", "Actor", "Action", "Role", "Category", "Change", "Detail"],
      ...visible.map((e) => [
        e.date,
        e.time,
        e.actor,
        e.action,
        e.role,
        e.category,
        e.change ? `${e.change.from} -> ${e.change.to}` : "",
        e.remark?.text ?? e.file?.name ?? "",
      ]),
    ];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(cell).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 flex-col gap-0.5 text-sm leading-5">
          <h3 className="m-0 text-sm font-semibold leading-5 text-[#181d27]">Activity</h3>
          <p className="m-0 text-[#535862]">Every change on this application, newest first. Logs cannot be edited.</p>
        </div>
        <label className="flex h-9 w-full items-center rounded-lg border border-solid border-[#d5d7da] bg-white px-3 focus-within:border-[#2b68e5] sm:w-[260px]">
          <span className="sr-only">Search activity</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 text-[#181d27] outline-none placeholder:text-[#535862]"
          />
        </label>
        <label className="relative flex h-9 w-full items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 text-sm font-medium leading-5 text-[#414651] focus-within:border-[#2b68e5] sm:w-[200px]">
          <Calendar03Icon size={18} strokeWidth={1.5} color="currentColor" aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Date range</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm font-medium leading-5 text-[#414651] outline-none"
          >
            <option value="all">All dates</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" size="sm" className="h-9 shadow-[0_1px_2px_rgba(10,13,18,0.05)]" onClick={exportCsv}>
          Export
        </Button>
      </div>

      {/* Category filters */}
      <div role="group" aria-label="Filter activity" className="flex max-w-full self-start overflow-x-auto rounded-lg border border-solid border-[#d5d7da]">
        {FILTERS.map((f, i) => {
          const selected = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(f)}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 border-0 px-3.5 py-2 text-sm font-semibold leading-5 ${
                i > 0 ? "border-l border-solid border-[#d5d7da]" : ""
              } ${selected ? "bg-[#fafafa] text-[#181d27]" : "bg-white text-[#414651] hover:bg-[#fafafa]"}`}
            >
              {f}
              <span
                className={`rounded-full border border-solid px-2 py-0.5 text-xs font-medium leading-[18px] ${
                  selected ? "border-[#5586ec] bg-[#8cadf2] text-[#0a255c]" : "border-[#e9eaeb] bg-[#fafafa] text-[#414651]"
                }`}
              >
                {count(f)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add note */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postNote();
        }}
        className="flex items-center gap-3 rounded-[10px] border border-solid border-[#e9eaeb] px-3.5 py-3"
      >
        <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-xs font-semibold leading-[18px] text-[#414651]">
          OR
        </span>
        <label className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-solid border-[#d5d7da] bg-white px-3 focus-within:border-[#2b68e5]">
          <span className="sr-only">Internal note</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an internal note. Only admins see it."
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 text-[#181d27] outline-none placeholder:text-[#535862]"
          />
        </label>
        <Button type="submit" variant="primary" size="sm" className="h-9" disabled={!note.trim()}>
          Post note
        </Button>
      </form>

      {/* Timeline */}
      {days.length === 0 ? (
        <p className="m-0 py-10 text-center text-sm leading-5 text-[#717680]">No activity matches these filters.</p>
      ) : (
        <div className="flex flex-col">
          {days.map((day, di) => (
            <section key={day.date} aria-label={dayLabel(day.date)}>
              <h4 className="m-0 flex items-center gap-3 py-3 text-xs font-semibold leading-[18px] text-[#535862]">
                {dayLabel(day.date)}
                <span aria-hidden className="h-px flex-1 bg-[#e9eaeb]" />
              </h4>
              <ol className="m-0 list-none p-0">
                <AnimatePresence initial={false}>
                  {day.items.map((entry, i) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      last={di === days.length - 1 && i === day.items.length - 1}
                      onView={setViewing}
                    />
                  ))}
                </AnimatePresence>
              </ol>
            </section>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        {olderLoaded ? (
          <p className="m-0 text-sm leading-5 text-[#717680]">No older activity.</p>
        ) : (
          <Button variant="secondary" size="sm" className="h-9 shadow-[0_1px_2px_rgba(10,13,18,0.05)]" onClick={() => setOlderLoaded(true)}>
            Load older activity
          </Button>
        )}
      </div>

      <AnimatePresence>
        {viewing && <PreviewDialog title={viewing.name} meta={viewing.meta} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </div>
  );
}
