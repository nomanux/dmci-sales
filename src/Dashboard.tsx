import { useMemo, useState, type ReactNode } from "react";
import Layout from "./Layout";
import { useNavigation } from "./NavigationContext";
import type { Screen } from "./NavigationContext";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BuildingIcon,
  CarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  InfoIcon,
  WalletIcon,
  XIcon,
  type IconProps,
} from "./icons";

/**
 * Dashboard — DMCI Homes Sales CRF/RA seller dashboard.
 *
 * Sections, top to bottom:
 *  1. Profile-changes notice (dismissible)
 *  2. Greeting + period switch (This month / Last 90 days / Year to date)
 *  3. KPI row: sales value, units reserved, commission earned, hold conversion
 *  4. Monthly sales vs target chart + hold status donut
 *  5. Active holds with expiry countdown + top projects by sales value
 *  6. Commission registry pipeline + advance commission
 *  7. Unit hold summary by sales group
 *
 * All figures below are sample data shaped like the live API responses.
 * Sidebar navigation + topbar are shared via Layout.tsx.
 */

// --- Types & helpers ---------------------------------------------------

type Icon = (props: IconProps) => React.JSX.Element;
type StatusKey = "active" | "expired" | "closed" | "cancelled";
type StatusCounts = Record<StatusKey, number>;
type PeriodKey = "month" | "90d" | "ytd";

const peso = (n: number) => {
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(n >= 100_000_000 ? 1 : 2)}M`;
  if (n >= 1_000) return `₱${Math.round(n / 1_000).toLocaleString("en-PH")}K`;
  return `₱${n.toLocaleString("en-PH")}`;
};
const pesoFull = (n: number) => `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// --- Data ----------------------------------------------------------------

const USER_NAME = "ALICE BAHALA";
const USER_ROLE = "Property Consultant · BC_ARV2116";
const SUPPORT_EMAIL = "salessupport@dmcihomes.com";

const STATUSES: { key: StatusKey; label: string; color: string }[] = [
  { key: "active", label: "Active", color: "#0a4de0" },
  { key: "closed", label: "Closed", color: "#10b981" },
  { key: "expired", label: "Expired", color: "#cbd2dc" },
  { key: "cancelled", label: "Cancelled", color: "#ff6868" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
/** Reserved sales value per month, 2026, in pesos. */
const MONTHLY_SALES = [8.4, 12.1, 6.9, 15.3, 10.8, 18.2, 9.6, 14.7, 16.9, 11.4].map((m) => m * 1_000_000);
const MONTHLY_UNITS = [1, 1, 1, 2, 1, 2, 1, 2, 2, 1];
const MONTHLY_TARGET = 12_000_000;
const COMMISSION_RATE = 0.02;

interface Kpis {
  label: string;
  range: string;
  sales: number;
  salesPrev: number;
  units: number;
  unitsPrev: number;
  holds: number;
  holdsPrev: number;
  closed: number;
  closedPrev: number;
  compareLabel: string;
  sparkFrom: number;
}

const PERIODS: Record<PeriodKey, Kpis> = {
  month: {
    label: "This month",
    range: "Oct 1 – Oct 30, 2026",
    sales: 11_400_000,
    salesPrev: 16_900_000,
    units: 1,
    unitsPrev: 2,
    holds: 4,
    holdsPrev: 5,
    closed: 1,
    closedPrev: 2,
    compareLabel: "vs Sep",
    sparkFrom: 4,
  },
  "90d": {
    label: "Last 90 days",
    range: "Aug 1 – Oct 30, 2026",
    sales: 43_000_000,
    salesPrev: 38_600_000,
    units: 5,
    unitsPrev: 4,
    holds: 11,
    holdsPrev: 12,
    closed: 5,
    closedPrev: 4,
    compareLabel: "vs prior 90 days",
    sparkFrom: 4,
  },
  ytd: {
    label: "Year to date",
    range: "Jan 1 – Oct 30, 2026",
    sales: 124_300_000,
    salesPrev: 108_600_000,
    units: 14,
    unitsPrev: 11,
    holds: 32,
    holdsPrev: 29,
    closed: 14,
    closedPrev: 11,
    compareLabel: "vs 2025 YTD",
    sparkFrom: 0,
  },
};

interface SalesGroupRow extends StatusCounts {
  salesGroup: string;
  position: string;
  division: string;
}

const SALES_GROUP_ROWS: SalesGroupRow[] = [
  { salesGroup: "BC_ARV2116", position: "PC_14671", division: "DIVISION 1", active: 2, expired: 3, closed: 5, cancelled: 1 },
  { salesGroup: "BC_ARV2116", position: "PC_14682", division: "DIVISION 1", active: 1, expired: 2, closed: 4, cancelled: 0 },
  { salesGroup: "BC_MNL3304", position: "PC_20517", division: "DIVISION 2", active: 2, expired: 3, closed: 3, cancelled: 1 },
  { salesGroup: "BC_QC1189", position: "PC_31146", division: "DIVISION 3", active: 1, expired: 1, closed: 2, cancelled: 1 },
];

/** Active holds. `hoursLeft` is relative to page load so the list never looks stale. */
const ACTIVE_HOLDS: {
  id: string;
  project: string;
  unit: string;
  client: string;
  kind: "unit" | "parking";
  price: number;
  hoursLeft: number;
}[] = [
  { id: "HLD0327451", project: "Aston Place", unit: "AST-00A-C-08018", client: "Maria Santos", kind: "unit", price: 9_850_000, hoursLeft: 5 },
  { id: "HLD0327340", project: "Valeron Tower", unit: "VAL-00B-D-12019", client: "Jose Ramirez", kind: "unit", price: 12_400_000, hoursLeft: 20 },
  { id: "HLD0327328", project: "Alea Residences", unit: "ALR-00F-C-02015", client: "Angela Cruz", kind: "unit", price: 7_250_000, hoursLeft: 46 },
  { id: "HLD0327289", project: "Asteria Residences", unit: "ASR-P-B1-0207", client: "Ramon Dela Cruz", kind: "parking", price: 950_000, hoursLeft: 74 },
  { id: "HLD0327211", project: "Atherton", unit: "ATH-00C-C-05012", client: "Patricia Reyes", kind: "unit", price: 8_900_000, hoursLeft: 118 },
  { id: "HLD0327107", project: "Allegra Garden Place", unit: "AGP-00A-C-03007", client: "Carlo Mendoza", kind: "unit", price: 6_400_000, hoursLeft: 142 },
];

const TOP_PROJECTS = [
  { name: "Valeron Tower", location: "Pasig City", value: 34_600_000, units: 3 },
  { name: "Aston Place", location: "Taguig City", value: 27_900_000, units: 3 },
  { name: "Alea Residences", location: "Bacoor, Cavite", value: 22_400_000, units: 3 },
  { name: "Atherton", location: "Parañaque City", value: 18_100_000, units: 2 },
  { name: "Allegra Garden Place", location: "Pasig City", value: 12_800_000, units: 2 },
  { name: "Other projects", location: "1 project", value: 8_500_000, units: 1 },
];

const COMMISSION_STAGES: {
  label: string;
  count: number;
  amount: number;
  icon: Icon;
  tone: "brand" | "success" | "warning";
  help: string;
  screen: Screen;
}[] = [
  { label: "Qualified", count: 14, amount: 2_486_000, icon: CheckCircleIcon, tone: "brand", help: "Accounts that met the payment threshold", screen: "regular-commission" },
  { label: "Posted", count: 9, amount: 1_618_000, icon: FileTextIcon, tone: "brand", help: "Approved and posted for payout", screen: "regular-commission" },
  { label: "Released", count: 7, amount: 1_182_000, icon: BanknoteIcon, tone: "success", help: "Paid out to your account", screen: "regular-commission" },
  { label: "For Compliance", count: 3, amount: 412_000, icon: AlertCircleIcon, tone: "warning", help: "Blocked by missing documents", screen: "compliance" },
];

const ADVANCE_COMMISSION = { qualified: { amount: 180_000, accounts: 2 }, notQualified: { amount: 64_500, accounts: 1 } };

const sumBy = (rows: StatusCounts[], key: StatusKey) => rows.reduce((n, r) => n + r[key], 0);
const totalOf = (r: StatusCounts) => STATUSES.reduce((n, s) => n + r[s.key], 0);

// Dismissing the notice lasts for the rest of the session, across page changes.
let noticeDismissed = false;

// --- Building blocks -------------------------------------------------------

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={"card flex min-w-0 flex-col gap-5 rounded-xl p-4 sm:p-5 " + className}>{children}</section>;
}

function FeaturedIcon({ icon: I, tone = "brand", size = 40 }: { icon: Icon; tone?: "brand" | "success" | "warning" | "gray"; size?: number }) {
  const tones = {
    brand: "bg-brand-25 text-brand-400 ring-brand-100",
    success: "bg-success-50 text-success-600 ring-success-100",
    warning: "bg-warning-50 text-warning-600 ring-warning-100",
    gray: "bg-gray-50 text-gray-600 ring-gray-200",
  };
  return (
    <div className={"flex shrink-0 items-center justify-center rounded-lg ring-1 ring-inset " + tones[tone]} style={{ width: size, height: size }}>
      <I className="h-1/2 w-1/2" />
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <InfoIcon className="size-4 shrink-0 cursor-help text-gray-400" />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-medium normal-case text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}

function CardHeader({ title, subtitle, info, action }: { title: string; subtitle?: string; info?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="m-0 flex items-center gap-2 text-base font-semibold text-gray-900">
          {title}
          {info && <Tooltip text={info} />}
        </h2>
        {subtitle && <p className="m-0 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function ViewAll({ screen, label = "View all" }: { screen: Screen; label?: string }) {
  const { navigate } = useNavigation();
  return (
    <button
      type="button"
      onClick={() => navigate({ screen })}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-sm font-semibold text-brand-400 hover:bg-brand-25"
    >
      {label}
      <ArrowRightIcon className="size-4" />
    </button>
  );
}

function Delta({ current, previous, suffix }: { current: number; previous: number; suffix: string }) {
  const change = previous === 0 ? 0 : (current - previous) / previous;
  const up = change >= 0;
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={
          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold " +
          (up ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700")
        }
      >
        {up ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
        {Math.abs(change * 100).toFixed(1)}%
      </span>
      <span className="text-gray-500">{suffix}</span>
    </span>
  );
}

function Sparkline({ values, color = "#0a4de0" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const w = 96;
  const h = 32;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - ((v - min) / (max - min || 1)) * (h - 4)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const id = `spark-${color.slice(1)}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  icon,
  info,
  delta,
  spark,
}: {
  label: string;
  value: string;
  icon: Icon;
  info: string;
  delta: ReactNode;
  spark?: number[];
}) {
  return (
    <div className="card flex min-w-0 flex-col gap-4 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <FeaturedIcon icon={icon} size={36} />
        <p className="m-0 flex min-w-0 items-center gap-1.5 text-sm font-medium text-gray-600">
          <span className="truncate">{label}</span>
          <Tooltip text={info} />
        </p>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="m-0 text-[28px] font-semibold leading-[34px] tracking-tight text-gray-900">{value}</p>
          {delta}
        </div>
        {spark && <Sparkline values={spark} />}
      </div>
    </div>
  );
}

function PeriodSwitch({ value, onChange }: { value: PeriodKey; onChange: (p: PeriodKey) => void }) {
  return (
    <div role="tablist" aria-label="Reporting period" className="inline-flex rounded-lg bg-white p-1 shadow-card">
      {(Object.keys(PERIODS) as PeriodKey[]).map((key) => {
        const on = key === value;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => onChange(key)}
            className={
              "cursor-pointer whitespace-nowrap rounded-md border-0 px-3 py-1.5 text-sm font-semibold transition-colors " +
              (on ? "bg-brand-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900")
            }
          >
            {PERIODS[key].label}
          </button>
        );
      })}
    </div>
  );
}

/** Monthly reserved sales value vs the monthly target. */
function SalesChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = 20_000_000;
  const ticks = [20, 15, 10, 5, 0];
  const targetPct = (MONTHLY_TARGET / max) * 100;
  const hit = MONTHLY_SALES.filter((v) => v >= MONTHLY_TARGET).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-400" />
          Target met
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-200" />
          Below target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-warning-500" />
          Monthly target {peso(MONTHLY_TARGET)}
        </span>
        <span className="ml-auto font-medium text-gray-900">
          Target met in {hit} of {MONTHS.length} months
        </span>
      </div>

      <div className="flex gap-3">
        <div className="flex h-[220px] w-9 flex-col justify-between text-right text-xs text-gray-400">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {t ? `₱${t}M` : "0"}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative h-[220px]">
            {ticks.map((t, i) => (
              <span key={t} className="absolute inset-x-0 border-t border-solid border-gray-100" style={{ top: `${(i / 4) * 100}%` }} />
            ))}
            <span
              className="absolute inset-x-0 z-10 border-t-2 border-dashed border-warning-500"
              style={{ bottom: `${targetPct}%` }}
            />
            <div className="relative flex h-full items-end gap-2 sm:gap-3">
              {MONTHLY_SALES.map((v, i) => {
                const met = v >= MONTHLY_TARGET;
                return (
                  <div
                    key={MONTHS[i]}
                    className="relative flex h-full flex-1 flex-col items-center justify-end"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {hover === i && (
                      <div className="absolute z-20 w-max -translate-y-2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg" style={{ bottom: `${(v / max) * 100}%` }}>
                        <p className="m-0 font-semibold">{MONTHS[i]} 2026</p>
                        <p className="m-0 text-gray-300">
                          {pesoFull(v)} · {MONTHLY_UNITS[i]} {MONTHLY_UNITS[i] === 1 ? "unit" : "units"}
                        </p>
                      </div>
                    )}
                    <div
                      className={
                        "w-full max-w-[40px] rounded-t-md transition-colors " +
                        (met ? "bg-brand-400" : "bg-brand-200") +
                        (hover === i ? " opacity-80" : "")
                      }
                      style={{ height: `${(v / max) * 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-2 text-center text-xs text-gray-500 sm:gap-3">
            {MONTHS.map((m) => (
              <span key={m} className="flex-1">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDonut({ counts }: { counts: StatusCounts }) {
  const total = totalOf(counts);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative size-[148px] shrink-0">
        <svg viewBox="0 0 132 132" className="size-full -rotate-90">
          <circle cx="66" cy="66" r={r} fill="none" stroke="#f3f4f6" strokeWidth={14} />
          {STATUSES.map((s) => {
            const len = (counts[s.key] / total) * c;
            const el = (
              <circle
                key={s.key}
                cx="66"
                cy="66"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={14}
                strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500">Total holds</span>
        </div>
      </div>
      <ul className="m-0 flex w-full list-none flex-col gap-2.5 p-0">
        {STATUSES.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="flex-1 text-gray-600">{s.label}</span>
            <span className="font-semibold text-gray-900">{counts[s.key]}</span>
            <span className="w-12 text-right text-xs text-gray-500">{pct(counts[s.key] / total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function expiryTone(hours: number) {
  if (hours <= 24) return "bg-error-50 text-error-700";
  if (hours <= 72) return "bg-warning-50 text-warning-700";
  return "bg-gray-100 text-gray-700";
}

function expiryLabel(hours: number) {
  if (hours < 24) return `${hours}h left`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return h ? `${d}d ${h}h left` : `${d}d left`;
}

// --- Page ----------------------------------------------------------------------

export default function Dashboard() {
  const [showNotice, setShowNotice] = useState(!noticeDismissed);
  const [period, setPeriod] = useState<PeriodKey>("ytd");
  const k = PERIODS[period];

  const totals: StatusCounts = useMemo(
    () => ({
      active: sumBy(SALES_GROUP_ROWS, "active"),
      expired: sumBy(SALES_GROUP_ROWS, "expired"),
      closed: sumBy(SALES_GROUP_ROWS, "closed"),
      cancelled: sumBy(SALES_GROUP_ROWS, "cancelled"),
    }),
    [],
  );

  const spark = MONTHLY_SALES.slice(k.sparkFrom);
  const sparkUnits = MONTHLY_UNITS.slice(k.sparkFrom);
  const conv = k.closed / k.holds;
  const convPrev = k.closedPrev / k.holdsPrev;
  const unitHolds = ACTIVE_HOLDS.filter((h) => h.kind === "unit").length;
  const parkingHolds = ACTIVE_HOLDS.length - unitHolds;
  const topMax = Math.max(...TOP_PROJECTS.map((p) => p.value));
  const ytdSales = MONTHLY_SALES.reduce((a, b) => a + b, 0);
  const releasedShare = COMMISSION_STAGES[2].amount / COMMISSION_STAGES[0].amount;

  return (
    <Layout active="dashboard" breadcrumb={["Dashboard"]}>
      {showNotice && (
        <div role="status" className="flex items-center gap-3 bg-brand-500 px-4 py-2.5 text-sm text-white sm:px-5">
          <InfoIcon className="size-4 shrink-0" />
          <p className="m-0 min-w-0 flex-1 sm:text-center">
            For changes to your mobile number or email address, or for any discrepancy in your profile details, please
            email Sales Management at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-white underline-offset-2 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            aria-label="Dismiss notice"
            onClick={() => {
              noticeDismissed = true;
              setShowNotice(false);
            }}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-brand-500 hover:bg-white"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex w-full flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6">
        {/* Greeting + period */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 text-xl font-semibold text-gray-900 sm:text-2xl">Welcome back, {USER_NAME}</h1>
            <p className="m-0 text-sm text-gray-500">
              {USER_ROLE} · Showing {k.range}
            </p>
          </div>
          <PeriodSwitch value={period} onChange={setPeriod} />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Reserved sales value"
            value={peso(k.sales)}
            icon={WalletIcon}
            info="Total contract price of units reserved in the period."
            delta={<Delta current={k.sales} previous={k.salesPrev} suffix={k.compareLabel} />}
            spark={spark}
          />
          <KpiCard
            label="Units reserved"
            value={String(k.units)}
            icon={BuildingIcon}
            info="Units and parking slots with a completed reservation."
            delta={<Delta current={k.units} previous={k.unitsPrev} suffix={k.compareLabel} />}
            spark={sparkUnits}
          />
          <KpiCard
            label="Commission earned"
            value={peso(k.sales * COMMISSION_RATE)}
            icon={BanknoteIcon}
            info="Estimated at your 2% commission rate on reserved sales value."
            delta={<Delta current={k.sales} previous={k.salesPrev} suffix={k.compareLabel} />}
            spark={spark}
          />
          <KpiCard
            label="Hold to sale conversion"
            value={pct(conv)}
            icon={CheckCircleIcon}
            info="Closed holds divided by all holds created in the period."
            delta={
              <span className="text-xs text-gray-500">
                {k.closed} of {k.holds} holds closed ·{" "}
                <span className={conv >= convPrev ? "font-semibold text-success-700" : "font-semibold text-error-700"}>
                  {conv >= convPrev ? "+" : ""}
                  {((conv - convPrev) * 100).toFixed(1)} pts
                </span>
              </span>
            }
          />
        </div>

        {/* Sales trend + hold status */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Monthly Sales Performance"
              subtitle={`Reserved sales value, Jan – Oct 2026 · ${pesoFull(ytdSales)} total`}
              info="Hover a bar to see the value and number of units reserved."
            />
            <SalesChart />
          </Card>

          <Card>
            <CardHeader
              title="Unit Hold Status"
              subtitle="All holds, Jan 1 – Oct 30, 2026"
              action={<ViewAll screen="unit-holding" />}
            />
            <StatusDonut counts={totals} />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <FeaturedIcon icon={BuildingIcon} size={32} />
                <div>
                  <p className="m-0 text-lg font-semibold leading-6 text-gray-900">{unitHolds}</p>
                  <p className="m-0 text-xs text-gray-500">Units on hold</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <FeaturedIcon icon={CarIcon} size={32} />
                <div>
                  <p className="m-0 text-lg font-semibold leading-6 text-gray-900">{parkingHolds}</p>
                  <p className="m-0 text-xs text-gray-500">Parking on hold</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Expiring holds + top projects */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Active Holds"
              subtitle={`${ACTIVE_HOLDS.filter((h) => h.hoursLeft <= 48).length} holds expire within 48 hours`}
              action={<ViewAll screen="unit-holding" />}
            />
            <ul className="m-0 flex list-none flex-col p-0">
              {[...ACTIVE_HOLDS]
                .sort((a, b) => a.hoursLeft - b.hoursLeft)
                .map((h) => (
                  <li key={h.id} className="flex items-center gap-3 border-b border-solid border-gray-100 py-3 first:pt-0 last:border-0 last:pb-0">
                    <FeaturedIcon icon={h.kind === "unit" ? BuildingIcon : CarIcon} tone="gray" size={36} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="m-0 truncate text-sm font-semibold text-gray-900">
                        {h.project} <span className="font-normal text-gray-500">· {h.unit}</span>
                      </p>
                      <p className="m-0 truncate text-xs text-gray-500">
                        {h.client} · {pesoFull(h.price)}
                      </p>
                    </div>
                    <span className={"shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold " + expiryTone(h.hoursLeft)}>
                      {expiryLabel(h.hoursLeft)}
                    </span>
                  </li>
                ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Top Projects by Sales"
              subtitle="Reserved sales value, year to date"
              action={<ViewAll screen="properties" label="Projects" />}
            />
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {TOP_PROJECTS.map((p, i) => (
                <li key={p.name} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate">
                      <span className="mr-2 inline-block w-4 text-xs font-semibold text-gray-400">{i + 1}</span>
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      <span className="text-gray-500"> · {p.location}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-gray-900">
                      {peso(p.value)}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        ({p.units} {p.units === 1 ? "unit" : "units"})
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={"h-full rounded-full " + (i === TOP_PROJECTS.length - 1 ? "bg-gray-300" : "bg-brand-400")}
                      style={{ width: `${(p.value / topMax) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Commission registry */}
        <Card>
          <CardHeader
            title="Commission Registry"
            subtitle={`Jan 1 – Oct 30, 2026 · ${pct(releasedShare)} of qualified commission released`}
            action={<ViewAll screen="regular-commission" />}
          />

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full">
              <div className="h-full bg-success-500" style={{ width: `${releasedShare * 100}%` }} />
              <div
                className="h-full bg-brand-400"
                style={{ width: `${((COMMISSION_STAGES[1].amount - COMMISSION_STAGES[2].amount) / COMMISSION_STAGES[0].amount) * 100}%` }}
              />
              <div className="h-full bg-warning-400" style={{ width: `${(COMMISSION_STAGES[3].amount / COMMISSION_STAGES[0].amount) * 100}%` }} />
            </div>
          </div>

          <div className="-mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-success-500" />Released</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand-400" />Posted, awaiting release</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-warning-400" />For compliance</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-gray-200" />Qualified, not yet posted</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {COMMISSION_STAGES.map((s) => (
              <div
                key={s.label}
                className={
                  "flex flex-col gap-3 rounded-xl border border-solid p-4 " +
                  (s.tone === "warning" ? "border-warning-200 bg-warning-25" : "border-gray-200 bg-white")
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <FeaturedIcon icon={s.icon} tone={s.tone} size={36} />
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {s.count} {s.count === 1 ? "account" : "accounts"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="m-0 text-sm font-medium text-gray-600">{s.label}</p>
                  <p className="m-0 text-2xl font-semibold text-gray-900">{pesoFull(s.amount)}</p>
                  <p className="m-0 text-xs text-gray-500">{s.help}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-solid border-gray-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="m-0 text-sm font-semibold text-gray-900">My Advance Commission</h3>
              <ViewAll screen="advance-commission" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-center gap-4 rounded-xl border border-solid border-success-200 bg-success-25 p-4">
                <FeaturedIcon icon={CheckCircleIcon} tone="success" size={40} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="m-0 text-sm text-gray-600">Qualified</p>
                  <p className="m-0 text-xl font-semibold text-gray-900">{pesoFull(ADVANCE_COMMISSION.qualified.amount)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-success-100 px-2 py-0.5 text-xs font-semibold text-success-700">
                  {ADVANCE_COMMISSION.qualified.accounts} accounts
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-solid border-gray-200 bg-white p-4">
                <FeaturedIcon icon={AlertCircleIcon} tone="warning" size={40} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="m-0 text-sm text-gray-600">Not qualified, pending review</p>
                  <p className="m-0 text-xl font-semibold text-gray-900">{pesoFull(ADVANCE_COMMISSION.notQualified.amount)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-warning-100 px-2 py-0.5 text-xs font-semibold text-warning-700">
                  {ADVANCE_COMMISSION.notQualified.accounts} account
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Unit Hold Summary by Sales Group */}
        <Card>
          <CardHeader
            title="Unit Hold Summary by Sales Group"
            subtitle="Number of unit holds by status for each sales group, year to date."
            info="Counts are grouped by the sales group, position and division of each hold."
          />

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
                  <th className="rounded-l-lg px-4 py-3">Sales Group</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Division</th>
                  {STATUSES.map((s) => (
                    <th key={s.key} className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">Close rate</th>
                </tr>
              </thead>
              <tbody>
                {SALES_GROUP_ROWS.map((row) => {
                  const t = totalOf(row);
                  return (
                    <tr key={`${row.salesGroup}|${row.position}`} className="border-b border-solid border-gray-100 text-gray-700 hover:bg-gray-25">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.salesGroup}</td>
                      <td className="px-4 py-3">{row.position}</td>
                      <td className="whitespace-nowrap px-4 py-3">{row.division}</td>
                      {STATUSES.map((s) => (
                        <td key={s.key} className="px-4 py-3 text-right tabular-nums">
                          {row[s.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-gray-900">{t}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{pct(row.closed / t)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-gray-900">
                  <td className="px-4 py-3" colSpan={3}>
                    <span className="inline-flex items-center gap-2">
                      Overall Total
                      <Tooltip text="Sum of every sales group above. Total includes all hold statuses." />
                    </span>
                  </td>
                  {STATUSES.map((s) => (
                    <td key={s.key} className="px-4 py-3 text-right tabular-nums">
                      {totals[s.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right tabular-nums">{totalOf(totals)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pct(totals.closed / totalOf(totals))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <p className="m-0 text-center text-xs text-gray-400">Last updated {formatDate(new Date())}</p>
      </div>
    </Layout>
  );
}
