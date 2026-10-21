import { useState } from "react";
import type { FilterField } from "./FilterBar";
import FilterTrigger from "./FilterTrigger";
import RightDrawer from "./RightDrawer";
import Select from "./Select";
import Input from "./Input";
import DatePicker from "./DatePicker";

/**
 * ListSearchFilter — the current list-screen toolbar (Search box + "Filter"
 * button with active count + Reset) and its right-side filters drawer, built
 * from the same declarative `FilterField[]` the old always-open FilterBar
 * took. Lets the Tower / Unit / Service Area screens match Unit
 * Availability, Floor and Parking Slot without hand-writing a drawer each.
 * Pages that filter their rows pass onSearchChange / onApply to receive the
 * search text and the applied values (keyed by field label; a date range
 * adds ":from"/":to"). Dropdowns without their own options get dummy 1–10
 * options, like FilterBar.
 */

const DUMMY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

export type FilterValues = Record<string, string>;
type Values = FilterValues;

function initialValues(fields: FilterField[]): Values {
  const values: Values = {};
  for (const field of fields) {
    if (field.kind === "select" && field.value) values[field.label] = field.value;
  }
  return values;
}

function FieldLabel({ label, labelAccent }: { label: string; labelAccent?: string }) {
  return (
    <label className="text-xs font-medium text-gray-900">
      {label}
      {labelAccent && <span className="text-primary-600"> {labelAccent}</span>}
    </label>
  );
}

export default function ListSearchFilter({
  fields,
  searchPlaceholder = "Search...",
  onSearchChange,
  onApply,
}: {
  fields: FilterField[];
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  onApply?: (values: FilterValues) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  // `draft` is what the drawer shows; `applied` is what Apply committed.
  const [draft, setDraft] = useState<Values>(() => initialValues(fields));
  const [applied, setApplied] = useState<Values>(() => initialValues(fields));
  const set = (key: string, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  // A date range counts once, however many of its ends are set.
  const activeCount = fields.filter((field) =>
    field.kind === "date-range"
      ? applied[field.label + ":from"] || applied[field.label + ":to"]
      : field.kind === "select-text"
        ? applied[field.label] || applied[field.label + ":text"]
        : applied[field.label],
  ).length;

  const reset = () => {
    setDraft({});
    setApplied({});
    onApply?.({});
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          aria-label="Search"
          className="w-56 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs placeholder-gray-500 focus:border-brand-400 focus:outline-none"
        />
        <FilterTrigger
          activeFilterCount={activeCount}
          onOpenFilters={() => {
            setDraft(applied);
            setOpen(true);
          }}
          onReset={reset}
        />
      </div>

      <RightDrawer isOpen={open} onClose={() => setOpen(false)} title="Filters">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <FieldLabel label={field.label} labelAccent={field.labelAccent} />
              {field.kind === "select" && (
                <Select
                  size="sm"
                  placeholder={field.placeholder}
                  value={draft[field.label] ?? ""}
                  onChange={(value) => set(field.label, value)}
                  options={
                    field.options ??
                    (field.value
                      ? [{ value: field.value, label: field.value }, ...DUMMY_OPTIONS]
                      : DUMMY_OPTIONS)
                  }
                />
              )}
              {field.kind === "text" && (
                <Input
                  size="sm"
                  placeholder={field.placeholder}
                  value={draft[field.label] ?? ""}
                  onChange={(e) => set(field.label, e.target.value)}
                />
              )}
              {field.kind === "date-range" && (
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    size="sm"
                    aria-label={field.label + " from"}
                    placeholder="From"
                    value={draft[field.label + ":from"] ?? ""}
                    onChange={(value) => set(field.label + ":from", value)}
                  />
                  <DatePicker
                    size="sm"
                    aria-label={field.label + " to"}
                    placeholder="To"
                    value={draft[field.label + ":to"] ?? ""}
                    onChange={(value) => set(field.label + ":to", value)}
                  />
                </div>
              )}
              {field.kind === "select-text" && (
                <div className="flex flex-col gap-2">
                  <Select
                    size="sm"
                    placeholder={field.selectPlaceholder}
                    disabled={field.selectDisabled}
                    value={draft[field.label] ?? ""}
                    onChange={(value) => set(field.label, value)}
                    options={DUMMY_OPTIONS}
                  />
                  <Input
                    size="sm"
                    placeholder={field.textPlaceholder}
                    value={draft[field.label + ":text"] ?? ""}
                    onChange={(e) => set(field.label + ":text", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sticky footer, same as the other list screens' drawers. */}
        <div className="shrink-0 border-t border-gray-200 px-5 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft({})}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setApplied(draft);
                onApply?.(draft);
                setOpen(false);
              }}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </div>
      </RightDrawer>
    </>
  );
}
