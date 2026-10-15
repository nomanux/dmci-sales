import { useEffect, useRef, useState, type ReactNode } from "react";

const CELL_ANIM_MS = 420;

/**
 * One character of the clock. When the character changes, the old one slides
 * out and the new one slides in (see .clock-cell rules in tailwind.css).
 */
function ClockCell({ char, isDigit }: { char: string; isDigit: boolean }) {
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const prev = useRef(char);

  useEffect(() => {
    if (prev.current === char) return;
    setOutgoing(prev.current);
    prev.current = char;
    const timer = setTimeout(() => setOutgoing(null), CELL_ANIM_MS);
    return () => clearTimeout(timer);
  }, [char]);

  return (
    <span className={`clock-cell${isDigit ? " clock-cell-digit" : ""}`}>
      {outgoing !== null && <span className="clock-cell-out">{outgoing}</span>}
      <span className={outgoing !== null ? "clock-cell-in" : ""}>{char}</span>
    </span>
  );
}

function Clock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2 rounded-lg bg-[#F9FAFB] inset-ring-1 inset-ring-[#F3F4F6] px-3 py-1 shrink-0">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_174329_140792)">
          <path
            d="M9 4.5V9L12 10.5M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
            stroke="#07389D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_174329_140792">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span className="inline-flex text-[14px] leading-[17px] font-semibold text-[#374151] font-ubuntu-sans tabular-nums whitespace-pre">
        <span className="sr-only">{time}</span>
        <span className="inline-flex align-bottom" aria-hidden="true">
          {time.split("").map((char, index) => (
            <ClockCell key={index} char={char} isDigit={/\d/.test(char)} />
          ))}
        </span>
      </span>

      <span className="text-[#D4E1FC]">|</span>

      <span className="text-[14px] leading-[17px] font-normal text-[#6B7280] font-ubuntu-sans whitespace-nowrap">
        {date}
      </span>
    </div>
  );
}

import "./tailwind.css";
import "./Dashboard.css";
import { dmciLogoUrl } from "./assets/figmaAssets";
import { useNavigation } from "./NavigationContext";
import EntitySelectionModal, {
  type SelectedEntity,
} from "./EntitySelectionModal";
import {
  LayoutDashboardIcon,
  Building2Icon,
  WalletIcon,
  FileTextIcon,
  UsersIcon,
  TicketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  MenuIcon,
  XIcon,
  type IconProps,
} from "./icons";

/**
 * Layout — shared sidebar navigation + topbar shell used by every DMCI Homes
 * Sales CRF/RA screen (Dashboard, Properties, Project Details, Tower, Floor,
 * Unit, Parking Slot, Service Area). Extracted from Dashboard.tsx so each new
 * page doesn't re-implement the ~150 lines of nav markup. Navigation is
 * wired through NavigationContext (see App.tsx / NavigationContext.tsx).
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, "Sidebar navigation" + "Avatar
 * and Title" components (shared across nodes 170838:208627, 173418:205101,
 * 173418:205335, 173418:206077/206944/206320/206142/206498).
 */

export type NavKey =
  | "dashboard"
  | "properties"
  | "commissions"
  | "computation"
  | "clients"
  | "lottery";

interface NavLeaf {
  key: NavKey;
  label: string;
  icon: (props: IconProps) => React.JSX.Element;
  onClick?: () => void;
}

interface NavSubItem {
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
}

interface NavBranch {
  key: NavKey;
  label: string;
  icon: (props: IconProps) => React.JSX.Element;
  items: NavSubItem[];
}

function isBranch(item: NavLeaf | NavBranch): item is NavBranch {
  return "items" in item;
}

// Sidebar brand styling (client: "subtle DMCI Homes brand colors"): the
// active item gets a light brand tint, navy text and a 3px navy bar on its
// left edge; hover is a fainter tint. Everything else stays neutral.
// Hierarchy: top level medium/gray-700 > sub-items regular/gray-600; the
// selected main menu and sub-item are semibold in the primary color. Icons
// sit a shade lighter than their labels (gray-500, still 4.8:1 on white).
const NAV_ACTIVE =
  "relative bg-brand-25 font-semibold text-primary-500 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full before:bg-primary-500";
const NAV_IDLE = "font-medium text-gray-700 hover:bg-brand-25/60 hover:text-gray-900";
// Parent of the active sub-item (expanded): primary text, no tint (the
// sub-item carries the background highlight).
const NAV_PARENT_ACTIVE = "font-semibold text-primary-500 hover:bg-brand-25/60";
const ICON_ACTIVE = "text-primary-500";
const ICON_IDLE = "text-gray-500 group-hover:text-gray-700";
const SUB_ACTIVE = "bg-brand-25 font-semibold text-primary-500";
const SUB_IDLE = "font-normal text-gray-600 hover:bg-brand-25/60 hover:text-gray-900";

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
}: {
  icon: (props: IconProps) => React.JSX.Element;
  label: string;
  active?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onClick?.(e)}
      title={collapsed ? label : undefined}
      className={
        "group flex h-10 w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors " +
        (collapsed ? "lg:justify-center lg:px-0 " : "") +
        (active ? NAV_ACTIVE : NAV_IDLE)
      }
    >
      <Icon className={"h-4 w-4 shrink-0 transition-colors " + (active ? ICON_ACTIVE : ICON_IDLE)} />
      <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
    </button>
  );
}

function NavDropdown({
  icon: Icon,
  label,
  items,
  active,
  activeSubItem,
  defaultOpen,
  collapsed,
}: {
  icon: (props: IconProps) => React.JSX.Element;
  label: string;
  items: NavSubItem[];
  active?: boolean;
  activeSubItem?: string;
  defaultOpen?: boolean;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen || !!active);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => collapsed && setFlyoutOpen(true)}
      onMouseLeave={() => setFlyoutOpen(false)}
    >
      <button
        type="button"
        onClick={() => !collapsed && setOpen((v) => !v)}
        title={collapsed ? label : undefined}
        className={
          "group flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors " +
          (collapsed ? "lg:justify-center lg:px-0 " : "") +
          // Expanded, the active sub-item carries the highlight, so the parent
          // only darkens; on the icon rail it gets the full active style.
          (active ? (collapsed ? NAV_ACTIVE : NAV_PARENT_ACTIVE) : NAV_IDLE)
        }
      >
        <Icon className={"h-4 w-4 shrink-0 transition-colors " + (active ? ICON_ACTIVE : ICON_IDLE)} />
        <span className={"flex-1 " + (collapsed ? "lg:hidden" : "")}>
          {label}
        </span>
        <span className={"text-gray-400 " + (collapsed ? "lg:hidden" : "")}>
          {open ? (
            <ChevronUpIcon className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 shrink-0" />
          )}
        </span>
      </button>

      {/* Inline accordion — expanded sidebar (and always on mobile). */}
      {open && items.length > 0 && (
        // Guide line under the parent's icon; the active sub-item draws a navy
        // segment over it. Text still starts 32px in, as before.
        <div
          className={
            "ml-[15px] mt-0.5 flex flex-col items-start gap-0.5 border-l border-gray-200 pb-1 pl-2 " +
            (collapsed ? "lg:hidden" : "")
          }
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => item.onClick?.(e)}
              disabled={!item.onClick}
              className={
                "relative w-full rounded-md px-2 py-1.5 text-left text-[13px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent " +
                (item.onClick ? "cursor-pointer " : "") +
                (item.label === activeSubItem
                  ? SUB_ACTIVE +
                    " before:absolute before:inset-y-1 before:-left-[9px] before:w-[2px] before:rounded-full before:bg-brand-500"
                  : SUB_IDLE)
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Flyout — icon rail (collapsed, lg) only, shown on hover. */}
      {collapsed && flyoutOpen && items.length > 0 && (
        <div className="absolute left-full top-0 z-50 ml-2 hidden w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg lg:block">
          <div className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {label}
          </div>
          <div className="flex flex-col items-start">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={(e) => item.onClick?.(e)}
                disabled={!item.onClick}
                className={
                  "w-full rounded-md px-2 py-1.5 text-left text-[13px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent " +
                  (item.onClick ? "cursor-pointer " : "") +
                  (item.label === activeSubItem ? SUB_ACTIVE : SUB_IDLE)
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface LayoutProps {
  /** Which top-level sidebar section is highlighted. */
  active: NavKey;
  /** Which sub-item (for Properties / Commissions) is highlighted, if any. */
  activeSubItem?: string;
  /** Breadcrumb trail shown in the topbar. Last item is emphasized and not clickable. */
  breadcrumb: (string | BreadcrumbItem)[];
  /** @deprecated the entity chip now always shows in the topbar on every screen; this prop is ignored and kept only so existing call sites don't need to change. */
  orgBadge?: boolean;
  children: ReactNode;
}

// Sidebar collapse default: icon-only on mid-size screens (1000–1440px wide;
// below lg the sidebar is a drawer, so in practice 1024–1440), expanded on
// wider ones. Each page renders its own Layout, so a ☰ toggle is remembered
// here for the rest of the session instead of resetting on every navigation.
let userCollapsedChoice: boolean | null = null;
function initialCollapsed(): boolean {
  if (userCollapsedChoice !== null) return userCollapsedChoice;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1000px) and (max-width: 1440px)").matches;
}

export default function Layout({
  active,
  activeSubItem,
  breadcrumb,
  children,
}: LayoutProps) {
  const { navigate, route: currentRoute } = useNavigation();
  const mainRef = useRef<HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop-only: collapses the static sidebar to an icon-only rail. Mobile
  // keeps its own off-canvas drawer (sidebarOpen) untouched.
  const [collapsed, setCollapsedState] = useState(initialCollapsed);
  const setCollapsed = (update: (value: boolean) => boolean) =>
    setCollapsedState((value) => {
      const next = update(value);
      userCollapsedChoice = next;
      return next;
    });
  const [entityModalOpen, setEntityModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>({
    code: "DPDI",
    name: "DMCI Project Developers Insc.",
  });

  // Helper to convert route to URL for new tab support
  const routeToUrl = (route: Parameters<typeof navigate>[0]): string => {
    const screenPaths: Record<string, string> = {
      dashboard: "/dashboard",
      properties: "/properties",
      "project-details": "/properties/details",
      tower: "/properties/tower",
      floor: "/properties/floor",
      unit: "/properties/unit",
      "parking-slot": "/properties/parking-slot",
      "service-area": "/properties/service-area",
      "unit-availability": "/unit-availability",
      "unit-availability-details": "/unit-availability/details",
      "unit-holding": "/unit-holding",
      "unit-holding-details": "/unit-holding/details",
      "computation-sheet": "/computation-sheet",
      clients: "/clients",
      "advance-commission": "/commission/advance",
      "advance-commission-details": "/commission/advance/details",
      "regular-commission": "/commission/regular",
      "regular-commission-details": "/commission/regular/details",
      compliance: "/commission/compliance",
      "compliance-details": "/commission/compliance/details",
      "lottery-registration": "/lottery/registration",
      "lottery-unit-picker": "/lottery/unit-picker",
    };
    const path = screenPaths[route.screen] ?? "/dashboard";
    const params = new URLSearchParams();
    if (route.project) params.set("project", route.project);
    if (route.itemId) params.set("itemId", route.itemId);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  // Wraps navigate() so tapping any nav destination also closes the mobile
  // drawer. Also supports Ctrl+click to open in new tab.
  // Dropdown expand/collapse (NavDropdown's own onClick) is untouched
  // so opening "Properties" on a phone doesn't immediately hide its sub-items.
  const go = (
    route: Parameters<typeof navigate>[0],
    event?: React.MouseEvent,
  ) => {
    if (event && (event.ctrlKey || event.metaKey)) {
      // Ctrl/Cmd+click: open in new tab
      window.open(routeToUrl(route), "_blank");
    } else {
      // Normal click: navigate in current tab
      navigate(route);
      setSidebarOpen(false);
    }
  };

  // The topbar hamburger drives two different behaviours depending on
  // viewport: below lg it opens/closes the off-canvas drawer, at lg and up
  // it collapses the static sidebar to an icon-only rail.
  const toggleSidebar = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      setCollapsed((v) => !v);
    } else {
      setSidebarOpen((v) => !v);
    }
  };

  // Every navigation (sidebar, breadcrumb, in-page links/cards) re-renders
  // this same Layout with new children rather than remounting the page, so
  // the scroll container keeps whatever scroll position it had. Without
  // this, clicking a link/card while scrolled down (e.g. a "Recently
  // Viewed" card at the bottom of Project Details) looks like it did
  // nothing, since the updated breadcrumb/title land off-screen above.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [currentRoute.screen, currentRoute.project, currentRoute.itemId]);

  const navItems: (NavLeaf | NavBranch)[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      onClick: (e?: React.MouseEvent) => go({ screen: "dashboard" }, e),
    },
    {
      key: "properties",
      label: "Properties",
      icon: Building2Icon,
      items: [
        {
          label: "Projects",
          onClick: (e?: React.MouseEvent) => go({ screen: "properties" }, e),
        },
        {
          label: "Unit Availability",
          onClick: (e?: React.MouseEvent) =>
            go({ screen: "unit-availability" }, e),
        },
        {
          label: "Unit Holding",
          onClick: (e?: React.MouseEvent) => go({ screen: "unit-holding" }, e),
        },
      ],
    },
    {
      key: "commissions",
      label: "Commissions",
      icon: WalletIcon,
      items: [
        {
          label: "Advance Commission",
          onClick: (e?: React.MouseEvent) =>
            go({ screen: "advance-commission" }, e),
        },
        {
          label: "Regular Commission",
          onClick: (e?: React.MouseEvent) =>
            go({ screen: "regular-commission" }, e),
        },
        {
          label: "For Compliance",
          onClick: (e?: React.MouseEvent) => go({ screen: "compliance" }, e),
        },
      ],
    },
    {
      key: "computation",
      label: "Computation Sheet",
      icon: FileTextIcon,
      onClick: (e?: React.MouseEvent) => go({ screen: "computation-sheet" }, e),
    },
    {
      key: "clients",
      label: "Clients",
      icon: UsersIcon,
      onClick: (e?: React.MouseEvent) => go({ screen: "clients" }, e),
    },
    {
      key: "lottery",
      label: "Lottery Event",
      icon: TicketIcon,
      items: [
        {
          label: "Registration",
          onClick: (e?: React.MouseEvent) =>
            go({ screen: "lottery-registration" }, e),
        },
        {
          label: "Lottery",
          onClick: (e?: React.MouseEvent) =>
            go({ screen: "lottery-unit-picker" }, e),
        },
      ],
    },
  ];

  const crumbs: BreadcrumbItem[] = breadcrumb.map((c) =>
    typeof c === "string" ? { label: c } : c,
  );

  return (
    <div className="db-page">
      {/* Mobile backdrop — tap to close the drawer. Sidebar is always in
          normal flow from lg upward, so this never renders there. */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation — fixed off-canvas drawer below lg, static
          in-flow column from lg upward. */}
      <aside
        className={
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 -translate-x-full transition-all duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 " +
          (collapsed ? "lg:w-[76px]" : "lg:w-60") +
          " " +
          (sidebarOpen ? "translate-x-0" : "")
        }
      >
        <div className="flex h-full w-full flex-col justify-between overflow-visible border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-visible pt-5">
            <div
              className={
                "flex items-center justify-between gap-2 px-4 " +
                (collapsed ? "lg:justify-center lg:px-3" : "")
              }
            >
              <button
                type="button"
                onClick={(e) => go({ screen: "dashboard" }, e)}
                className="flex cursor-pointer items-center self-start"
                aria-label="Go to dashboard"
              >
                <img
                  className={"h-8 w-auto " + (collapsed ? "lg:hidden" : "")}
                  src={dmciLogoUrl}
                  alt="DMCI Homes Sales"
                />
                {collapsed && (
                  <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-500 text-sm font-bold text-white lg:flex">
                    D
                  </span>
                )}
              </button>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 lg:hidden"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <nav
              className={
                "flex flex-1 flex-col items-start gap-1 px-4 " +
                (collapsed ? "lg:px-2" : "")
              }
            >
              {navItems.map((item) =>
                isBranch(item) ? (
                  <NavDropdown
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    items={item.items}
                    active={active === item.key}
                    activeSubItem={
                      active === item.key ? activeSubItem : undefined
                    }
                    collapsed={collapsed}
                  />
                ) : (
                  <NavItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={active === item.key}
                    onClick={item.onClick}
                    collapsed={collapsed}
                  />
                ),
              )}
            </nav>
          </div>

          <div
            className={
              "flex flex-col gap-4 px-4 pb-4 " + (collapsed ? "lg:px-2" : "")
            }
          >
            <div
              className={
                "relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-[0_1px_1px_rgba(10,13,18,0.05)] " +
                (collapsed ? "lg:justify-center lg:p-2" : "")
              }
            >
              <div
                className={
                  "flex flex-1 items-center gap-2 " +
                  (collapsed ? "lg:flex-none lg:justify-center" : "")
                }
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-25 text-sm font-semibold text-brand-600">
                  OR
                </div>
                <div
                  className={
                    "flex min-w-0 flex-col text-sm leading-5 " +
                    (collapsed ? "lg:hidden" : "")
                  }
                >
                  <span className="truncate font-semibold text-gray-900">
                    Super Admin
                  </span>
                  <span className="truncate text-xs leading-[18px] text-gray-500">Admin</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Account menu"
                className={
                  "absolute right-[5px] top-[5px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 " +
                  (collapsed ? "lg:hidden" : "")
                }
              >
                <ChevronsUpDownIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="db-main-col">
        {/* Top bar */}
        <header className="flex w-full shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3 sm:gap-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-pressed={collapsed}
              onClick={toggleSidebar}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-50"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-2 overflow-hidden text-sm"
            >
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <span
                    key={index}
                    className={
                      "items-center gap-2 " +
                      (isLast
                        ? "flex min-w-0 shrink"
                        : "hidden shrink-0 sm:flex")
                    }
                  >
                    {index > 0 && (
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    {crumb.onClick && !isLast ? (
                      <button
                        type="button"
                        onClick={crumb.onClick}
                        className="cursor-pointer truncate rounded-md px-1 font-medium text-gray-500 hover:text-primary-500 hover:underline"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span
                        className={
                          "truncate rounded-md px-1 " +
                          (isLast
                            ? "font-semibold text-primary-500"
                            : "font-medium text-gray-500")
                        }
                      >
                        {crumb.label}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Clock />
            <button
              type="button"
              onClick={() => setEntityModalOpen(true)}
              className="entity-chip-glow group flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-primary-50 bg-white py-1 pl-1 pr-2 px-1 hover:bg-gray-50"
            >
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary-500 transition-colors group-hover:bg-white">
                {selectedEntity.code}
              </span>
              <span className="hidden truncate text-sm font-medium text-gray-700 sm:block">
                {selectedEntity.name}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main ref={mainRef} className="db-main">
          {children}
        </main>
      </div>

      {entityModalOpen && (
        <EntitySelectionModal
          selected={selectedEntity}
          onSelect={setSelectedEntity}
          onClose={() => setEntityModalOpen(false)}
        />
      )}
    </div>
  );
}

export function PageBackHeading({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const { back } = useNavigation();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack ?? back}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </div>
  );
}
