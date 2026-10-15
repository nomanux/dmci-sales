import { LinkIcon, FileIcon } from "./icons";
import Button from "./Button";

/**
 * Small shared pill/badge/card-header pieces reused across every property
 * table (status pills, "Tower / Floor / Unit" link badges, the card header
 * with a "Download PDF" action).
 */

// Pill colors match Figma "Badge / Pill color" (file NcMe5sSgPs65q3Ed2rV1Kv):
// Brand = node 9:12758 (bg #f0f5ff, border primary-50 #d4e1fc, text primary-500 #07389d)
// Success = Tailwind emerald (bg emerald-50, border emerald-200, text emerald-700)
// Gray = node 9:12824 (bg gray-50 #f9fafb, border gray-200 #e5e7eb, text gray-700 #374151)
// Warning/Error statuses aren't in the referenced nodes, so they keep their prior colors.
const STATUS_STYLES: Record<string, string> = {
  "On Hold": "bg-warning-100 text-warning-800",
  Available: "border border-primary-50 bg-[#f0f5ff] text-primary-500",
  Sold: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "Ready for Occupancy": "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "Ongoing Construction": "bg-warning-100 text-warning-800",
  "Under Review": "border border-primary-50 bg-[#f0f5ff] text-primary-500",
  "Pending Approval": "bg-warning-100 text-warning-800",
  Approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Completed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "On Hold ": "bg-warning-100 text-warning-800",
  Cancelled: "bg-error-50 text-error-700",
  Postponed: "border border-gray-200 bg-gray-50 text-gray-700",
  Active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "On Queue": "bg-warning-100 text-warning-800",
  Closed: "border border-gray-200 bg-gray-50 text-gray-700",
  Expired: "bg-error-50 text-error-700",
  Confirmed: "border border-primary-50 bg-[#f0f5ff] text-primary-500",
  Pass: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "Not Qualified": "bg-error-50 text-error-700",
};

export function StatusPill({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ?? "border border-gray-200 bg-gray-50 text-gray-700";
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
        style
      }
    >
      {status}
    </span>
  );
}

// "Badge color" component set (file NcMe5sSgPs65q3Ed2rV1Kv):
// Brand, no icon = node 9:12762 (sm) / 9:13642 (md) — bg brand-50 #d4e1fc, border brand-100 #98b9ff, text brand-700 #052b78, rounded-sm (6px).
// Brand, icon leading = node 9:13000 (sm) — same fill/text, border darkens to #6293f8 when an icon is present, gap-1, pl-1 pr-1.5 py-0.5.
export type BadgeColor = "brand";
export type BadgeSize = "sm" | "md";
export type BadgeIcon = "none" | "leading" | "trailing" | "only";

const BADGE_COLOR_STYLES: Record<BadgeColor, string> = {
  brand: "bg-[#d4e1fc] text-[#052b78]",
};

const BADGE_BORDER_STYLES: Record<BadgeColor, { plain: string; icon: string }> =
  {
    // Icon (link) badges: the same soft border as plain ones at rest; the
    // stronger blue only on hover, as a "clickable" cue.
    brand: { plain: "border-[#98b9ff]", icon: "border-[#98b9ff] hover:border-[#6293f8]" },
  };

const BADGE_TEXT_STYLES: Record<BadgeSize, string> = {
  sm: "text-xs leading-[18px]",
  md: "text-sm leading-5",
};

const BADGE_PADDING_STYLES: Record<BadgeSize, Record<BadgeIcon, string>> = {
  sm: {
    none: "px-1.5 py-0.5",
    // Roomier than the other sm variants: these are clickable link badges.
    leading: "gap-1.5 py-1 pl-2 pr-2.5",
    trailing: "gap-1 py-0.5 pl-1.5 pr-1",
    only: "p-1",
  },
  md: {
    none: "px-2 py-0.5",
    leading: "gap-1 py-0.5 pl-1.5 pr-2",
    trailing: "gap-1 py-0.5 pl-2 pr-1.5",
    only: "p-1.5",
  },
};

export function Badge({
  label,
  color = "brand",
  size = "sm",
  icon = "none",
}: {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: BadgeIcon;
}) {
  const iconEl =
    icon !== "none" ? <LinkIcon className="h-3 w-3 shrink-0" /> : null;
  const border =
    icon === "none"
      ? BADGE_BORDER_STYLES[color].plain
      : BADGE_BORDER_STYLES[color].icon;
  return (
    <span
      className={
        "inline-flex items-center justify-center whitespace-nowrap rounded-md border font-medium transition-colors hover:bg-white " +
        BADGE_COLOR_STYLES[color] +
        " " +
        border +
        " " +
        BADGE_TEXT_STYLES[size] +
        " " +
        BADGE_PADDING_STYLES[size][icon]
      }
    >
      {icon === "leading" && iconEl}
      {icon !== "only" && label}
      {icon === "trailing" && iconEl}
      {icon === "only" && iconEl}
    </span>
  );
}

export function LinkBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-primary-50 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-primary-500">
      <LinkIcon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function TableCardHeader({
  title,
  leftSlot,
  rightSlot,
}: {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        )}
        {leftSlot && <div className="flex items-center gap-2">{leftSlot}</div>}
      </div>
      <div className="flex items-center gap-3">{rightSlot}</div>
    </div>
  );
}

/** Tab switcher used at the top of the Advance/Regular Commission tables ("My commission" / "Teams Commission"). */
export function RecordTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-100 px-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={
            "cursor-pointer border-b-2 py-3 text-sm font-semibold " +
            (tab === active
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-gray-500 hover:text-gray-700")
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/**
 * Download PDF — uses the "Secondary color" button variant (brand-blue
 * outline), not the neutral-gray secondary used elsewhere. Size "sm" (32px)
 * matches the button's own Figma spec (node 9:10812/9:10911, h-32px).
 * Reference: Figma node 173424:198691.
 */
export function DownloadPdfButton() {
  return (
    <Button variant="secondary-color" size="sm">
      <FileIcon className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
