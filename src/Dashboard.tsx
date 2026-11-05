import Layout from "./Layout";
import { BuildingIcon, CarIcon, InfoIcon, BanknoteIcon, AlertCircleIcon, CheckCircleIcon, type IconProps } from "./icons";

/**
 * Dashboard — DMCI Homes Sales CRF/RA admin dashboard.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 170838:208627 ("Dashbboard v1").
 * Sidebar navigation + topbar are shared via Layout.tsx.
 */

// --- Data -------------------------------------------------------------

type TrendKey = "active" | "expired" | "closed" | "cancelled";

const TREND_SERIES: { key: TrendKey; label: string; color: string; value: number }[] = [
  { key: "active", label: "Active", color: "#0a4dd7", value: 63 },
  { key: "expired", label: "Expired", color: "#d4e1fc", value: 74 },
  { key: "closed", label: "Closed", color: "#6293f8", value: 52 },
  { key: "cancelled", label: "Cancelled", color: "#041e53", value: 66 },
];

const Y_AXIS_TICKS = [80, 70, 60, 50, 40, 30, 20, 10];

interface HoldingRow {
  position: string;
  active: number;
  expired: number;
  closed: number;
  cancelled: number;
}

const HOLDING_ROWS: HoldingRow[] = [
  { position: "Dummy", active: 67, expired: 67, closed: 22, cancelled: 72 },
  { position: "Dummy", active: 67, expired: 67, closed: 22, cancelled: 72 },
  { position: "Dummy", active: 67, expired: 67, closed: 22, cancelled: 72 },
  { position: "Dummy", active: 67, expired: 67, closed: 22, cancelled: 72 },
  { position: "Dummy", active: 67, expired: 67, closed: 22, cancelled: 72 },
];

const REGULAR_COMMISSION_METRICS = [
  { label: "Qualified for Commission", value: "1200", icon: BanknoteIcon },
  { label: "Posted Commission", value: "200", icon: BanknoteIcon },
  { label: "Released Commission", value: "500", icon: BanknoteIcon },
  { label: "For Compliance", value: "50", icon: AlertCircleIcon },
];

const ADVANCE_COMMISSION_METRICS = [
  {
    label: "Qualified Applications",
    value: "12",
    icon: CheckCircleIcon,
    badge: "Active Status",
    badgeClass: "bg-success-500",
  },
  {
    label: "Not Qualified Applications",
    value: "12",
    icon: AlertCircleIcon,
    badge: "Pending Review",
    badgeClass: "bg-warning-500",
  },
];

// --- Small building blocks ---------------------------------------------

function FeaturedIcon({
  icon: Icon,
  size = 40,
}: {
  icon: (props: IconProps) => React.JSX.Element;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg border border-primary-200 bg-white text-primary-500"
      style={{ width: size, height: size }}
    >
      <Icon className="h-1/2 w-1/2" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-gray-700">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function SectionAccentHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      <span className="w-1 shrink-0 rounded-sm bg-primary-500" />
      <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{children}</h3>
    </div>
  );
}

// --- Page ----------------------------------------------------------------

export default function Dashboard() {

  return (
    <Layout active="dashboard" breadcrumb={["Dashboard"]}>
      <div className="flex w-full flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Welcome back, Super Admin</h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Comprehensive overview of Customer Registration Form and Reservation Agreement metrics
          </p>
        </div>

        {/* Unit Holding Summary card */}
        <section className="card flex w-full flex-col gap-4 rounded-lg p-4 sm:gap-4 sm:rounded-xl sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">Unit Holding Summary</h2>

          <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row">
            {/* Held units / parking slots */}
            <div className="flex w-full flex-col gap-4 sm:gap-5 lg:w-80">
              <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-600">Held Units</p>
                  <p className="text-[30px] font-bold leading-[38px] text-primary-500">1200</p>
                  <p className="text-sm text-primary-600">Units currently held</p>
                </div>
                <FeaturedIcon icon={BuildingIcon} size={42} />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-600">Held Parking Slots</p>
                  <p className="text-[30px] font-bold leading-[38px] text-primary-500">200</p>
                  <p className="text-sm text-primary-600">Parking slots allocated</p>
                </div>
                <FeaturedIcon icon={CarIcon} size={42} />
              </div>
            </div>

            {/* Trends distribution chart */}
            <div className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-error-25 p-4 sm:gap-5 sm:rounded-xl sm:p-5">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Trends distribution</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-6 sm:text-sm">
                  {TREND_SERIES.map((series) => (
                    <LegendDot key={series.key} color={series.color} label={series.label} />
                  ))}
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto">
                <div className="hidden w-8 flex-col justify-between text-right text-xs text-gray-600 sm:flex">
                  {Y_AXIS_TICKS.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="relative flex h-[180px] items-end justify-around gap-2 border-b border-gray-100 pb-0 sm:gap-4 sm:h-[225px]">
                    {TREND_SERIES.map((series) => (
                      <div key={series.key} className="flex h-full w-full items-end justify-center">
                        <div
                          className="w-full max-w-[50px] rounded-t-sm"
                          style={{
                            height: `${(series.value / 80) * 100}%`,
                            backgroundColor: series.color,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 flex justify-around text-center text-xs text-gray-600">
                    {TREND_SERIES.map((series) => (
                      <span key={series.key} className="w-full max-w-[129px]">
                        {series.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Position breakdown table */}
          <div className="relative w-full overflow-x-auto rounded-lg border border-primary-50">
            <table className="w-full border-collapse text-[13px]">
              <thead className="table-head">
                <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                  <th className="px-2 py-2 sm:px-5 sm:py-3">Position</th>
                  {TREND_SERIES.map((series) => (
                    <th key={series.key} className="px-1 py-2 text-center sm:px-5 sm:py-3">
                      <span className="hidden sm:inline"><LegendDot color={series.color} label={series.label} /></span>
                      <span className="sm:hidden">{series.label.charAt(0)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOLDING_ROWS.map((row, index) => (
                  <tr key={index} className="border-b border-blue-50">
                    <td className="px-2 py-1 font-medium text-gray-600 sm:px-5 sm:py-3">{row.position}</td>
                    <td className="px-1 py-1 text-center text-gray-600 sm:px-5 sm:py-3">{row.active}</td>
                    <td className="px-1 py-1 text-center text-gray-600 sm:px-5 sm:py-3">{row.expired}</td>
                    <td className="px-1 py-1 text-center text-gray-600 sm:px-5 sm:py-3">{row.closed}</td>
                    <td className="px-1 py-1 text-center text-gray-600 sm:px-5 sm:py-3">{row.cancelled}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-primary-50">
                  <td className="px-2 py-1 text-[13px] font-semibold text-gray-900 sm:px-5 sm:py-3">Total</td>
                  <td className="px-1 py-1 text-center text-[13px] font-semibold text-gray-900 sm:px-5 sm:py-3">##</td>
                  <td className="px-1 py-1 text-center text-[13px] font-semibold text-gray-900 sm:px-5 sm:py-3">##</td>
                  <td className="px-1 py-1 text-center text-[13px] font-semibold text-gray-900 sm:px-5 sm:py-3">##</td>
                  <td className="px-1 py-1 text-center text-[13px] font-semibold text-gray-900 sm:px-5 sm:py-3">##</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Commission Registry card */}
        <section className="card flex w-full flex-col gap-4 rounded-lg p-4 sm:gap-4 sm:rounded-xl sm:p-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">COMMISSION REGISTRY</h2>
            <span className="text-xs font-semibold text-gray-600 sm:text-sm">(19/08/2025 - 25/02/2026)</span>
            <span className="group relative inline-flex">
              <InfoIcon className="h-4 w-4 shrink-0 cursor-help text-gray-500 sm:h-5 sm:w-5" />
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
              >
                12-month data is currently in preview.
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:gap-5">
            <SectionAccentHeading>My Regular Commission</SectionAccentHeading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {REGULAR_COMMISSION_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:gap-4 sm:rounded-xl sm:p-5"
                >
                  <FeaturedIcon icon={metric.icon} size={36} />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">{metric.label}</p>
                    <p className="text-lg font-bold text-gray-900 sm:text-xl">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-5">
            <SectionAccentHeading>My Advance Commission</SectionAccentHeading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {ADVANCE_COMMISSION_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col gap-3 rounded-lg border border-primary-50 px-4 py-3 sm:gap-5 sm:rounded-xl sm:px-5 sm:py-4"
                  style={{
                    backgroundImage: "linear-gradient(117deg, rgb(255, 255, 255) 1.5%, rgb(240, 245, 255) 98.8%)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-start gap-3 sm:gap-6 min-w-0">
                      <FeaturedIcon icon={metric.icon} size={32} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-2xl font-bold leading-8 tracking-tight text-primary-500 sm:text-[36px] sm:leading-[44px] sm:tracking-[-0.72px]">
                          {metric.value}
                        </p>
                        <p className="text-xs font-medium text-gray-700 sm:text-base line-clamp-2">{metric.label}</p>
                      </div>
                    </div>
                    <span
                      className={"shrink-0 rounded-full px-2 py-1 text-xs font-medium text-white whitespace-nowrap " + metric.badgeClass}
                    >
                      {metric.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
