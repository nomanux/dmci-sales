import { useState } from "react";
import { SearchIcon, MoreHorizontalIcon } from "./icons";
import Button, { IconButton, type ButtonSize, type ButtonVariant } from "./Button";
import SecondaryIconButton from "./IconButton";
import Select from "./Select";
import Input from "./Input";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import RightDrawer from "./RightDrawer";
import { StatusPill, Badge } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon } from "./icons";

/**
 * ComponentsPage — standalone style-guide screen listing the shared form
 * primitives (Button, Input, Date picker, Dropdown) so any screen can be
 * checked against a single source of truth instead of re-guessing control
 * sizes/colors per page. Reachable directly at /component (see main.tsx).
 * Not wrapped in the dashboard Layout — this is a reference page, not part
 * of the CRF/RA app flow.
 *
 * The Button section renders the actual shared Button / IconButton
 * components from ./Button.tsx (not a copy of their styles) — reference:
 * Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 9:9698 ("Button CTA" kitchen
 * sink) plus the "Secondary color" variant (node 9:10812/9:10911).
 * 5 style variants x 5 sizes (xs-xl). Editing Button.tsx changes
 * both this page and every screen that imports it. "Default" is the real
 * resting state; hover the buttons to see the real :hover state — it isn't
 * faked here.
 */

const DUMMY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

const BUTTON_SIZES: { size: ButtonSize; label: string; iconClasses: string }[] = [
  { size: "xs", label: "XS / 28px", iconClasses: "h-3.5 w-3.5" },
  { size: "sm", label: "SM / 32px", iconClasses: "h-4 w-4" },
  { size: "md", label: "MD / 40px", iconClasses: "h-4 w-4" },
  { size: "lg", label: "LG / 44px", iconClasses: "h-5 w-5" },
  { size: "xl", label: "XL / 48px", iconClasses: "h-5 w-5" },
];

function SizeHeaderRow() {
  return (
    <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
      <th className="w-24 px-2 py-2">State</th>
      {BUTTON_SIZES.map((s) => (
        <th key={s.size} className="px-3 py-2">
          {s.label}
        </th>
      ))}
    </tr>
  );
}

function ButtonVariantTable({ variant }: { variant: ButtonVariant }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]">
        <thead className="table-head">
          <SizeHeaderRow />
        </thead>
        <tbody>
          {[false, true].map((isDisabled) => (
            <tr key={String(isDisabled)}>
              <td className="px-2 py-1 text-[13px] font-medium text-gray-700">{isDisabled ? "Disabled" : "Default"}</td>
              {BUTTON_SIZES.map(({ size, iconClasses }) => (
                <td key={size} className="px-3 py-1">
                  <Button variant={variant} size={size} disabled={isDisabled}>
                    <SearchIcon className={iconClasses} />
                    Button CTA
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconOnlyButtonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]">
        <thead className="table-head">
          <SizeHeaderRow />
        </thead>
        <tbody>
          {[false, true].map((isDisabled) => (
            <tr key={String(isDisabled)}>
              <td className="px-2 py-1 text-[13px] font-medium text-gray-700">{isDisabled ? "Disabled" : "Default"}</td>
              {BUTTON_SIZES.map(({ size, iconClasses }) => (
                <td key={size} className="px-3 py-1">
                  <IconButton size={size} aria-label="Icon action" disabled={isDisabled}>
                    <SearchIcon className={iconClasses} />
                  </IconButton>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecondaryIconButtonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]">
        <thead className="table-head">
          <SizeHeaderRow />
        </thead>
        <tbody>
          {[false, true].map((isDisabled) => (
            <tr key={String(isDisabled)}>
              <td className="px-2 py-1 text-[13px] font-medium text-gray-700">{isDisabled ? "Disabled" : "Default"}</td>
              {BUTTON_SIZES.map(({ size, iconClasses }) => (
                <td key={size} className="px-3 py-1">
                  <SecondaryIconButton size={size} aria-label="Secondary action" disabled={isDisabled}>
                    <MoreHorizontalIcon className={iconClasses} />
                  </SecondaryIconButton>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-6 sm:px-10">
        <h1 className="text-xl font-semibold text-gray-900">Component Library</h1>
        <p className="mt-1 text-sm text-gray-600">
          Full button variant set (reference: Figma node 9:9698) plus small/medium sizes for the remaining shared
          form primitives used across the DMCI Homes Sales CRF/RA app.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 sm:px-10">
        {/* Button */}
        <Section
          title="Button"
          description="Primary (filled), Secondary (outline), Tertiary (text-only), and Icon-only — 5 sizes x 3 states each."
        >
          <div className="flex flex-col gap-6">
            <Swatch label="Primary">
              <ButtonVariantTable variant="primary" />
            </Swatch>
            <Swatch label="Secondary">
              <ButtonVariantTable variant="secondary" />
            </Swatch>
            <Swatch label="Secondary color">
              <ButtonVariantTable variant="secondary-color" />
            </Swatch>
            <Swatch label="Tertiary">
              <ButtonVariantTable variant="tertiary" />
            </Swatch>
            <Swatch label="Icon-only">
              <IconOnlyButtonTable />
            </Swatch>
            <Swatch label="Secondary icon (for form fields)">
              <SecondaryIconButtonTable />
            </Swatch>
          </div>
        </Section>

        {/* Table Action Button */}
        <Section
          title="Table Action Button"
          description="Icon + label action used in table 'Actions' columns (View / Image / Hold, etc). Default is gray-400 icon and text; hover shows a slate-100 background with brand-500 icon/text; disabled drops both to gray-300. These are real buttons — hover or inspect to see the true states, the middle one isn't faked."
        >
          <div className="flex items-center gap-6">
            <Swatch label="Default">
              <RowActionButton icon={<EyeIcon className="h-6 w-6" />} label="View" />
            </Swatch>
            <Swatch label="Hover (hover over it)">
              <RowActionButton icon={<EyeIcon className="h-6 w-6" />} label="View" />
            </Swatch>
            <Swatch label="Disabled">
              <RowActionButton icon={<EyeIcon className="h-6 w-6" />} label="View" disabled />
            </Swatch>
          </div>
        </Section>

        {/* Input */}
        <Section title="Input" description="Plain text field, small and medium heights.">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            <Swatch label="Small (h-8)">
              <Input size="sm" type="text" placeholder="Enter a value" className="w-56" />
            </Swatch>
            <Swatch label="Medium (h-10)">
              <Input size="md" type="text" placeholder="Enter a value" className="w-56" />
            </Swatch>
          </div>
        </Section>

        {/* Date picker */}
        <Section
          title="Date picker"
          description="Custom calendar dropdown — chevron month nav, Month/Year quick-jump selects, and a 7-day grid with muted leading/trailing days. Open one to see it, small and medium heights."
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            <Swatch label="Small (h-8)">
              <DatePicker size="sm" aria-label="Date" className="w-48" />
            </Swatch>
            <Swatch label="Medium (h-10) — pre-selected">
              <DatePicker size="md" aria-label="Date" defaultValue="2026-08-11" className="w-48" />
            </Swatch>
          </div>
        </Section>

        {/* Dropdown */}
        <Section
          title="Dropdown"
          description="Custom combobox (not a native select) filled with dummy 1-10 options. Selected row shows bg-primary-25/text-primary-500, plus a Clear action — open one to see it."
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            <Swatch label="Small (h-8)">
              <div className="w-56">
                <Select size="sm" options={DUMMY_OPTIONS} placeholder="Select one" />
              </div>
            </Swatch>
            <Swatch label="Medium (h-10) — pre-selected">
              <div className="w-56">
                <Select size="md" options={DUMMY_OPTIONS} placeholder="Select one" defaultValue="4" />
              </div>
            </Swatch>
          </div>
        </Section>

        {/* Badge */}
        <Section
          title="Badge"
          description="Status pill (colored by state, reference: Figma 'Badge / Pill color' node 9:12758/9:12770/9:12824) and the Tower/Floor/Unit-style link badge used in table Links columns."
        >
          <div className="flex flex-col gap-6">
            <Swatch label="Status pill — brand">
              <div className="flex flex-wrap gap-2">
                <StatusPill status="Available" />
                <StatusPill status="Under Review" />
                <StatusPill status="Confirmed" />
              </div>
            </Swatch>
            <Swatch label="Status pill — success">
              <div className="flex flex-wrap gap-2">
                <StatusPill status="Sold" />
                <StatusPill status="Ready for Occupancy" />
                <StatusPill status="Approved" />
                <StatusPill status="Completed" />
                <StatusPill status="Active" />
                <StatusPill status="Pass" />
              </div>
            </Swatch>
            <Swatch label="Status pill — warning">
              <div className="flex flex-wrap gap-2">
                <StatusPill status="On Hold" />
                <StatusPill status="Ongoing Construction" />
                <StatusPill status="Pending Approval" />
                <StatusPill status="On Queue" />
              </div>
            </Swatch>
            <Swatch label="Status pill — error">
              <div className="flex flex-wrap gap-2">
                <StatusPill status="Cancelled" />
                <StatusPill status="Expired" />
                <StatusPill status="Not Qualified" />
              </div>
            </Swatch>
            <Swatch label="Status pill — gray">
              <div className="flex flex-wrap gap-2">
                <StatusPill status="Postponed" />
                <StatusPill status="Closed" />
              </div>
            </Swatch>
            <Swatch label="Badge color — Brand (sm/md)">
              <div className="flex flex-wrap items-center gap-2">
                <Badge label="Label" color="brand" size="sm" />
                <Badge label="Label" color="brand" size="md" />
              </div>
            </Swatch>
            <Swatch label="Badge color — Brand, link variant (used for Tower/Floor/Unit table links)">
              <div className="flex flex-wrap items-center gap-2">
                <Badge label="Tower" color="brand" size="sm" icon="leading" />
                <Badge label="Floor" color="brand" size="sm" icon="leading" />
                <Badge label="Unit" color="brand" size="sm" icon="leading" />
                <Badge label="House & Lot" color="brand" size="sm" icon="leading" />
                <Badge label="Lot Only" color="brand" size="sm" icon="leading" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge label="Label" color="brand" size="md" icon="leading" />
                <Badge label="Label" color="brand" size="sm" icon="trailing" />
                <Badge label="Label" color="brand" size="md" icon="trailing" />
                <Badge label="Label" color="brand" size="sm" icon="only" />
                <Badge label="Label" color="brand" size="md" icon="only" />
              </div>
            </Swatch>
          </div>
        </Section>

        {/* Checkbox */}
        <Section
          title="Checkbox"
          description="Table row selection checkbox — reference: Figma node 18:14072. Small and medium sizes x default/checked/indeterminate x default/disabled. These are real inputs, not faked swatches — hover, click, or tab to one to see the true :hover/:checked/:focus states."
        >
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
            <Swatch label="Small (16px)">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox size="sm" aria-label="Unchecked" />
                  <Checkbox size="sm" defaultChecked aria-label="Checked" />
                  <Checkbox size="sm" indeterminate aria-label="Indeterminate" />
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox size="sm" disabled aria-label="Disabled unchecked" />
                  <Checkbox size="sm" disabled defaultChecked aria-label="Disabled checked" />
                  <Checkbox size="sm" disabled indeterminate aria-label="Disabled indeterminate" />
                </div>
              </div>
            </Swatch>
            <Swatch label="Medium (20px)">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox size="md" aria-label="Unchecked" />
                  <Checkbox size="md" defaultChecked aria-label="Checked" />
                  <Checkbox size="md" indeterminate aria-label="Indeterminate" />
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox size="md" disabled aria-label="Disabled unchecked" />
                  <Checkbox size="md" disabled defaultChecked aria-label="Disabled checked" />
                  <Checkbox size="md" disabled indeterminate aria-label="Disabled indeterminate" />
                </div>
              </div>
            </Swatch>
          </div>
        </Section>

        {/* Right Drawer */}
        <Section
          title="Right Drawer"
          description="Slide-out drawer from the right side with transitions, used for filters and other content. Click the button below to see it in action."
        >
          <RightDrawerDemo />
        </Section>
      </main>
    </div>
  );
}

function RightDrawerDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button onClick={() => setIsOpen(true)}>
          <SearchIcon className="h-4 w-4" />
          Open Filter Drawer
        </Button>
        <p className="text-sm text-gray-600">Click to see the right drawer with sticky buttons</p>
      </div>

      <RightDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filters">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Project</label>
            <Select placeholder="Select one" options={[
              { value: "ast", label: "AST" },
              { value: "sat", label: "SAT" },
              { value: "bxp", label: "BXP" },
            ]} size="sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Expiry Date</label>
            <div className="flex gap-2">
              <input type="date" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
              <input type="date" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Client Name</label>
            <Input type="text" placeholder="Enter client name" size="sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Seller Name</label>
            <Input type="text" placeholder="Enter seller name" size="sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-900">Status</label>
            <Select placeholder="Select one" options={[
              { value: "active", label: "Active" },
              { value: "queue", label: "On Queue" },
              { value: "cancelled", label: "Cancelled" },
            ]} size="sm" />
          </div>
        </div>

        {/* Sticky buttons at bottom */}
        <div className="shrink-0 border-t border-gray-200 px-5 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {}}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <div className="flex-1">
              <Button onClick={() => setIsOpen(false)} size="md" className="w-full">
                Search
              </Button>
            </div>
          </div>
        </div>
      </RightDrawer>
    </div>
  );
}
