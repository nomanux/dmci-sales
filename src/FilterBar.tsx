import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  RotateCcwIcon,
  SearchIcon,
} from "./icons";
import Button from "./Button";
import Select from "./Select";
import Input from "./Input";
import DatePicker from "./DatePicker";

/**
 * FilterBar — the collapsible "Search Filters" card used at the top of every
 * property table screen (List, Tower, Floor, Unit, Parking Slot, Service
 * Area). Fields are declarative so each page only needs to describe what it
 * needs, not re-implement the card chrome.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, "header"/"Actions" containers
 * repeated across nodes 173418:205101/206077/206944/206320/206142/206498.
 * Dropdowns are real <select> elements filled with dummy 1-10 options (no
 * backend to source real project/status lists from yet); date range uses the
 * custom DatePicker (calendar dropdown, not a native <input type="date">).
 * All controls sized down to h-8.
 *
 * Figma isn't consistent across screens: some filter bars show a label above
 * each field (e.g. Tower, node 173418:206077 — "Building"/"RFO Date"), others
 * show placeholder-only fields with no label (e.g. Project List, node
 * 173418:205121 — "Select project"/"Enter location"/...). The Project List
 * variant also lays Reset/Search out as a right-hand column spanning both
 * field rows, not a row below the fields. `showLabels` and `actionsColumn`
 * cover those two variants without forking the component per screen.
 */

const DUMMY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

// Explicit grid placement for the actionsColumn layout's 2-fields-per-row
// grid (see FilterBar's actionsColumn prop). Tailwind's JIT scanner only
// picks up class names it can find literally in source, so these can't be
// built with a template string — hence the lookup table instead of a
// `sm:col-start-${n}` computed string.
// Below xl: 2 fields per row (matches the Figma spec's fixed 1272px-wide
// frame). At xl+ the page is full-width (no max-w cap), so there's room to
// lay all 4 fields out on one row instead of wrapping to 2 — cleaner use of
// the extra space on real desktop monitors.
const ACTIONS_COLUMN_CELL_CLASSES = [
  "sm:col-start-1 sm:row-start-1 xl:col-start-1 xl:row-start-1",
  "sm:col-start-2 sm:row-start-1 xl:col-start-2 xl:row-start-1",
  "sm:col-start-1 sm:row-start-2 xl:col-start-3 xl:row-start-1",
  "sm:col-start-2 sm:row-start-2 xl:col-start-4 xl:row-start-1",
  "sm:col-start-1 sm:row-start-3 xl:col-start-5 xl:row-start-1",
  "sm:col-start-2 sm:row-start-3 xl:col-start-6 xl:row-start-1",
];

// Same idea as ACTIONS_COLUMN_CELL_CLASSES above, but for the 3-fields-per-row
// variant (Unit Availability, node 173424:197248: Project/Building/Status on
// row 1, Category/Type/Show List Price on row 2, Reset/Search as a right-hand
// column spanning both rows). Only meant for exactly 6 fields. Single
// breakpoint (lg) rather than the 4-field variant's sm/xl split — 3 fields
// need more room than 2, so it isn't worth squeezing this one in below lg;
// it just stacks to one field per row like the "wrap" layout's mobile case.
const ACTIONS_COLUMN_CELL_CLASSES_3PER_ROW = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
];

// The "wrap" (non-actionsColumn) layout's column count at lg+, per the
// `columns` prop. A static lookup, same reason as above: Tailwind's JIT
// needs the literal class string in source, not a template-built one.
// Default (4) matches the original fixed layout. Pages whose field count
// divides evenly into a different column count (e.g. Unit Availability's 6
// single-select fields) can pass that count so all fields land on one row
// at lg+ instead of wrapping and leaving Reset/Search stranded next to a
// lopsided block of empty cells.
// 5-6 columns only kick in at xl+ (falls back to 3 at lg) — 1024px is too
// narrow to fit that many fields without squeezing; 4 and under are fine
// starting at lg like the original fixed layout was.
const WRAP_COLUMNS_CLASSES: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-3 xl:grid-cols-5",
  6: "lg:grid-cols-3 xl:grid-cols-6",
};

export type FilterField =
  | {
      kind: "select";
      label: string;
      labelAccent?: string;
      placeholder: string;
      value?: string;
      options?: { value: string; label: string }[];
    }
  | { kind: "text"; label: string; labelAccent?: string; placeholder: string }
  | { kind: "date-range"; label: string; labelAccent?: string }
  | {
      kind: "select-text";
      label: string;
      labelAccent?: string;
      selectPlaceholder: string;
      textPlaceholder: string;
      selectDisabled?: boolean;
    };

// Most field labels are plain text, but a couple (Unit Availability / Unit
// Style's "Show List Price? (PDF Report)", node 173424:197248) call out a
// trailing parenthetical in the primary blue used for links elsewhere in the
// app (Badge, breadcrumbs), since it reads as a hint about the linked PDF
// report rather than part of the field name itself. `labelAccent` carries
// that trailing bit so it renders in that color instead of the label's
// default gray-700.
function FieldLabel({ label, labelAccent }: { label: string; labelAccent?: string }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      {labelAccent && <span className="text-primary-600"> {labelAccent}</span>}
    </label>
  );
}

function SelectField({ placeholder }: { placeholder: string }) {
  return <Select size="sm" options={DUMMY_OPTIONS} placeholder={placeholder} />;
}

function TextField({ placeholder }: { placeholder: string }) {
  return <Input size="sm" type="text" placeholder={placeholder} />;
}

// Building / Unit# pairing (Unit Availability, node 173424:197248): a
// project-scoped dropdown plus a free-text unit number search sharing one
// label/row, same visual pairing pattern as DateRangeField's from/to inputs.
// The dropdown starts disabled ("Select a project first") until a Project is
// chosen elsewhere in the filter bar — this component doesn't wire that
// cross-field logic yet, so `selectDisabled` just lets a page opt into the
// disabled/greyed-out starting state shown in the design.
function SelectTextField({
  selectPlaceholder,
  textPlaceholder,
  selectDisabled,
}: {
  selectPlaceholder: string;
  textPlaceholder: string;
  selectDisabled?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Select
        size="sm"
        options={DUMMY_OPTIONS}
        placeholder={selectPlaceholder}
        disabled={selectDisabled}
        className="min-w-0 flex-1"
      />
      <Input
        size="sm"
        type="text"
        placeholder={textPlaceholder}
        className="w-20 shrink-0"
      />
    </div>
  );
}

function DateRangeField() {
  return (
    <div className="flex items-center gap-2">
      <DatePicker size="sm" aria-label="From date" className="min-w-0 flex-1" />
      <span className="text-gray-400">-</span>
      <DatePicker size="sm" aria-label="To date" className="min-w-0 flex-1" />
    </div>
  );
}

export default function FilterBar({
  fields,
  defaultOpen = true,
  showLabels = true,
  actionsColumn = false,
  actionsColumnPerRow = 2,
  columns = 4,
}: {
  fields: FilterField[];
  defaultOpen?: boolean;
  /** Set false for filter bars whose Figma spec has no label above each field (placeholder-only), e.g. Project List. */
  showLabels?: boolean;
  /** Set true to lay Reset/Search out as a right-hand column spanning the field rows (Project List, node 173418:205121), instead of a row below the fields. */
  actionsColumn?: boolean;
  /** Fields per row for the actionsColumn layout. 2 (default) is the original 4-field Project List variant (2 per row below xl, all 4 in one row at xl). 3 is the Unit Availability variant (Project/Building/Status + Category/Type/Show List Price, always 3 per row from lg up) — only meant for exactly 6 fields. Ignored unless actionsColumn is true. */
  actionsColumnPerRow?: 2 | 3;
  /** Column count at lg+ for the "wrap" (non-actionsColumn) layout. Pick whatever the field count divides into evenly so nothing wraps into a lopsided last row. Ignored when actionsColumn is true. */
  columns?: 2 | 3 | 4 | 5 | 6;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="card w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3 text-left"
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
          <FilterIcon className="h-5 w-5 text-gray-700" />
          Search Filters
        </span>
        {open ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {open && actionsColumn && actionsColumnPerRow === 2 && (
        <div className="grid grid-cols-1 items-end gap-x-5 gap-y-3 border-t border-gray-100 px-5 py-3 sm:grid-cols-[1fr_1fr_auto] sm:grid-rows-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] xl:grid-rows-1">
          {fields.map((field, index) => (
            <div
              key={index}
              className={
                "flex min-w-0 flex-col gap-1.5 " +
                (ACTIONS_COLUMN_CELL_CLASSES[index] ?? "")
              }
            >
              {showLabels && <FieldLabel label={field.label} labelAccent={field.labelAccent} />}
              {field.kind === "select" && (
                <SelectField placeholder={field.placeholder} />
              )}
              {field.kind === "text" && (
                <TextField placeholder={field.placeholder} />
              )}
              {field.kind === "date-range" && <DateRangeField />}
              {field.kind === "select-text" && (
                <SelectTextField
                  selectPlaceholder={field.selectPlaceholder}
                  textPlaceholder={field.textPlaceholder}
                  selectDisabled={field.selectDisabled}
                />
              )}
            </div>
          ))}
          <div className="flex flex-col items-end justify-between gap-3 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:h-full xl:col-start-5 xl:row-span-1 xl:h-auto xl:flex-row xl:items-center">
            <Button variant="tertiary" size="sm">
              <RotateCcwIcon className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="primary" size="sm" className="min-w-[120px]">
              <SearchIcon className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      )}

      {open && actionsColumn && actionsColumnPerRow === 3 && (
        <div className="grid grid-cols-1 items-end gap-x-5 gap-y-3 border-t border-gray-100 px-5 py-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:grid-rows-2">
          {fields.map((field, index) => (
            <div
              key={index}
              className={
                "flex min-w-0 flex-col gap-1.5 " +
                (ACTIONS_COLUMN_CELL_CLASSES_3PER_ROW[index] ?? "")
              }
            >
              {showLabels && <FieldLabel label={field.label} labelAccent={field.labelAccent} />}
              {field.kind === "select" && (
                <SelectField placeholder={field.placeholder} />
              )}
              {field.kind === "text" && (
                <TextField placeholder={field.placeholder} />
              )}
              {field.kind === "date-range" && <DateRangeField />}
              {field.kind === "select-text" && (
                <SelectTextField
                  selectPlaceholder={field.selectPlaceholder}
                  textPlaceholder={field.textPlaceholder}
                  selectDisabled={field.selectDisabled}
                />
              )}
            </div>
          ))}
          {/* Below lg there's only 1 grid column, so Reset/Search would otherwise
              land in their own full-width rows (each right-aligned via
              justify-end, leaving an empty gap to Reset's left where Search's
              row is). lg:contents dissolves this wrapper into the grid at lg+
              so the two buttons resume their separate col/row placement; below
              lg it's a plain flex row and they sit side by side instead. */}
          <div className="flex items-center justify-end gap-3 lg:contents">
            <Button variant="tertiary" size="sm" className="lg:col-start-4 lg:row-start-1 lg:justify-self-end">
              <RotateCcwIcon className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="primary" size="sm" className="min-w-[120px] lg:col-start-4 lg:row-start-2 lg:justify-self-end">
              <SearchIcon className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      )}

      {open && !actionsColumn && (
        <div
          className={
            "grid grid-cols-1 items-end gap-x-5 gap-y-3 border-t border-gray-100 px-5 py-3 sm:grid-cols-2 " +
            (WRAP_COLUMNS_CLASSES[columns] ?? WRAP_COLUMNS_CLASSES[4])
          }
        >
          {fields.map((field, index) => (
            <div
              key={index}
              className={
                "flex min-w-0 flex-col gap-1.5 " +
                (field.kind === "date-range" ? "sm:col-span-2" : "")
              }
            >
              {showLabels && <FieldLabel label={field.label} labelAccent={field.labelAccent} />}
              {field.kind === "select" && (
                <SelectField placeholder={field.placeholder} />
              )}
              {field.kind === "text" && (
                <TextField placeholder={field.placeholder} />
              )}
              {field.kind === "date-range" && <DateRangeField />}
              {field.kind === "select-text" && (
                <SelectTextField
                  selectPlaceholder={field.selectPlaceholder}
                  textPlaceholder={field.textPlaceholder}
                  selectDisabled={field.selectDisabled}
                />
              )}
            </div>
          ))}
          {/* Slots into whatever space is left in the fields grid's last row (e.g. Regular Commission: row 2 has 2 fields, buttons take the remaining 2 columns); falls to its own full-width row if the last row is already full. grid-column: auto / -1 (not a fixed span) is what makes both cases work without knowing the field count/breakpoint up front. */}
          <div className="flex items-center justify-end gap-4 [grid-column-end:-1] [grid-column-start:auto]">
            <Button variant="tertiary" size="sm">
              <RotateCcwIcon className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="primary" size="sm" className="min-w-[120px]">
              <SearchIcon className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
