import { useState, type ReactNode } from "react";
import { hrefFor, navigate } from "../router";
import logoSymbol from "../assets/logo-symbol.svg";
import logoText from "../assets/logo-text.svg";
import barChartSquare02 from "../assets/icons/bar-chart-square-02.svg";
import users02 from "../assets/icons/users-02.svg";
import userSquare from "../assets/icons/user-square.svg";
import fileCheck02 from "../assets/icons/file-check-02.svg";
import gitPullRequest from "../assets/icons/git-pull-request.svg";
import creditCard02 from "../assets/icons/credit-card-02.svg";
import creditCardEdit from "../assets/icons/credit-card-edit.svg";
import bell01 from "../assets/icons/bell-01.svg";
import clockRewind from "../assets/icons/clock-rewind.svg";
import grid01 from "../assets/icons/grid-01.svg";
import clipboardCheck from "../assets/icons/clipboard-check.svg";
import barChart08 from "../assets/icons/bar-chart-08.svg";
import usersRight from "../assets/icons/users-right.svg";
import userPlus01 from "../assets/icons/user-plus-01.svg";
import file06 from "../assets/icons/file-06.svg";
import calendar from "../assets/icons/calendar.svg";
import fileAttachment04 from "../assets/icons/file-attachment-04.svg";
import creditCardSearch from "../assets/icons/credit-card-search.svg";
import fileSearch02 from "../assets/icons/file-search-02.svg";
import calendarCheck02 from "../assets/icons/calendar-check-02.svg";
import chevronSelectorVertical from "../assets/icons/chevron-selector-vertical.svg";
import menu01 from "../assets/icons/menu-01.svg";
import breadcrumbChevron from "../assets/icons/breadcrumb-chevron-right.svg";

/**
 * MyDMCI admin shell: sidebar + top bar.
 * Figma: DMCI-SID-Portal, "Sidebar navigation" 163939:140690 and
 * "Avatar and Title" 163939:140082.
 */

export type AdminNavKey =
  | "dashboard"
  | "users"
  | "roles"
  | "mydmci-users"
  | "change-request"
  | "payment-histories"
  | "payment-config"
  | "notifications"
  | "audit-logs"
  | "widgets"
  | "surveys"
  | "analytics"
  | "blast"
  | "registration"
  | "rto-applications"
  | "reservation-ops"
  | "docs-in"
  | "credit-review"
  | "lease-contracts"
  | "turnover";

interface NavItem {
  key: AdminNavKey;
  label: string;
  icon: string;
}

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "GENERAL",
    items: [
      { key: "dashboard", label: "Dashboard", icon: barChartSquare02 },
      { key: "users", label: "User Management", icon: users02 },
      { key: "roles", label: "Role Management", icon: userSquare },
      { key: "mydmci-users", label: "myDMCIHomes Users", icon: fileCheck02 },
      { key: "change-request", label: "Change Request", icon: gitPullRequest },
      { key: "payment-histories", label: "Payment Histories", icon: creditCard02 },
      { key: "payment-config", label: "Payment Configuration", icon: creditCardEdit },
      { key: "notifications", label: "Notification Hub", icon: bell01 },
      { key: "audit-logs", label: "Audit Logs", icon: clockRewind },
      { key: "widgets", label: "Widget Management", icon: grid01 },
      { key: "surveys", label: "Survey Management", icon: clipboardCheck },
      { key: "analytics", label: "Analytics Management", icon: barChart08 },
      { key: "blast", label: "Blast Management", icon: usersRight },
      { key: "registration", label: "Registration Assistance", icon: userPlus01 },
    ],
  },
  {
    heading: "RTO / Leasing",
    items: [
      { key: "rto-applications", label: "RTO Applications", icon: file06 },
      { key: "reservation-ops", label: "Reservation Operations", icon: calendar },
      { key: "docs-in", label: "Docs-in Review", icon: fileAttachment04 },
      { key: "credit-review", label: "Credit Review", icon: creditCardSearch },
      { key: "lease-contracts", label: "Lease Contracts", icon: fileSearch02 },
      { key: "turnover", label: "Turnover Schedule", icon: calendarCheck02 },
    ],
  },
];

function Sidebar({ active }: { active: AdminNavKey }) {
  return (
    <nav
      aria-label="Admin"
      className="flex h-full w-60 shrink-0 flex-col justify-between overflow-y-auto border-0 border-r border-solid border-[#e9eaeb] bg-white"
    >
      <div className="flex flex-col gap-6 pt-5">
        <a
          href={hrefFor("admin")}
          onClick={(e) => {
            e.preventDefault();
            navigate("admin");
          }}
          className="flex items-end gap-1.5 px-4"
          aria-label="DMCI Homes"
        >
          <img src={logoSymbol} alt="" width={23.287} height={32} className="block h-8 w-[23.287px]" />
          <img src={logoText} alt="" width={145.088} height={20.037} className="block h-[20.037px] w-[145.088px]" />
        </a>

        <div className="flex flex-col">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="m-0 px-5 pb-1 text-xs font-bold leading-[18px] text-[#717680]">{section.heading}</p>
              <ul className="m-0 flex list-none flex-col p-0 px-4 pb-5">
                {section.items.map((item) => {
                  const isActive = item.key === active;
                  return (
                    <li key={item.key} className="py-1">
                      <button
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        onClick={item.key === "rto-applications" ? () => navigate("admin") : undefined}
                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-0 px-2 py-1.5 text-left text-sm font-semibold leading-6 transition-colors ${
                          isActive
                            ? "bg-[#fafafa] text-[#1448b3]"
                            : "bg-white text-[#414651] hover:bg-[#fafafa]"
                        }`}
                      >
                        <img src={item.icon} alt="" width={16} height={16} className="block size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative flex items-center gap-2 rounded-xl border border-solid border-[#e9eaeb] bg-white p-3 shadow-[0_1px_1px_rgba(10,13,18,0.05)]">
          <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-base font-semibold leading-6 text-[#10398e]">
            <span className="absolute inset-0 rounded-full border-[0.75px] border-solid border-black/[0.08]" aria-hidden />
            OR
          </span>
          <span className="flex min-w-0 flex-col text-sm leading-5">
            <span className="truncate font-semibold text-[#181d27]">Olivia Rhye</span>
            <span className="text-[#535862]">Admin</span>
          </span>
          <button
            type="button"
            aria-label="Account menu"
            className="absolute right-[5px] top-[5px] flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-1.5 hover:bg-[#fafafa]"
          >
            <img src={chevronSelectorVertical} alt="" width={20} height={20} className="block size-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({
  active,
  breadcrumb,
  children,
}: {
  active: AdminNavKey;
  /** Last item is the current page; earlier ones can link to a route. */
  breadcrumb: (string | { label: string; route: string })[];
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] font-sans">
      {sidebarOpen && <Sidebar active={active} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-0 border-b border-solid border-[#e9eaeb] bg-white px-5 py-3">
          <button
            type="button"
            aria-label={sidebarOpen ? "Hide menu" : "Show menu"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-2 hover:bg-[#fafafa]"
          >
            <img src={menu01} alt="" width={20} height={20} className="block size-5" />
          </button>
          <ol aria-label="Breadcrumb" className="m-0 flex list-none items-center gap-1 p-0">
            {breadcrumb.map((item, i) => {
              const last = i === breadcrumb.length - 1;
              const label = typeof item === "string" ? item : item.label;
              const route = typeof item === "string" ? undefined : item.route;
              return (
                <li key={label} className="flex items-center gap-1">
                  {i > 0 && <img src={breadcrumbChevron} alt="" width={16} height={16} className="block size-4" />}
                  {route && !last ? (
                    <a
                      href={hrefFor(route)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(route);
                      }}
                      className="rounded-md px-2 py-1 text-sm font-medium leading-5 text-[#717680] no-underline hover:bg-[#fafafa] hover:text-[#414651]"
                    >
                      {label}
                    </a>
                  ) : (
                    <span
                      aria-current={last ? "page" : undefined}
                      className={`rounded-md px-2 py-1 text-sm font-medium leading-5 ${
                        last ? "bg-[#fafafa] text-[#0a255c]" : "text-[#717680]"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
