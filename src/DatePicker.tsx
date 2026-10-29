import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

/**
 * DatePicker — a custom calendar dropdown, replacing the native
 * <input type="date"> UI (which renders differently per browser/OS and
 * can't be themed). Same trigger + floating panel + outside-click/Escape
 * pattern as Select.tsx, so it drops in wherever a date field is needed
 * (FilterBar's date-range fields, ComputationSheet's Reservation Date, the
 * /component reference page).
 *
 * Panel layout follows a concept the team shared: chevron header, Month/Year
 * quick-jump selects, a divider, then a 7-column day grid with muted
 * leading/trailing days from the neighboring months and a ringed "today".
 *
 * Value is an ISO "yyyy-mm-dd" string — the same shape a native date input
 * gives you — so it drops in without changing how callers read the value.
 */

export type DatePickerSize = "sm" | "md";

export interface DatePickerProps {
  size?: DatePickerSize;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
  "aria-label"?: string;
}

/** Maps size -> the CSS class defined in tailwind.css (@layer components). */
export const DATE_PICKER_SIZE_CLASSES: Record<DatePickerSize, string> = {
  sm: "date-picker-sm",
  md: "date-picker-md",
};

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseISO(value: string | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function formatDisplay(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return m + "/" + d + "/" + date.getFullYear();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** 6 rows x 7 cols starting on the Sunday on/before the 1st of viewMonth. */
function buildMonthGrid(viewYear: number, viewMonth: number): Date[] {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const gridStart = new Date(viewYear, viewMonth, 1 - firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export default function DatePicker({
  size = "sm",
  value,
  defaultValue,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className = "",
  min,
  max,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);

  const selectedValue = value ?? internalValue;
  const selectedDate = parseISO(selectedValue);

  const [viewDate, setViewDate] = useState(selectedDate ?? today);

  useEffect(() => {
    // With nothing picked yet, start on today — or on max when today is past it.
    const latest = parseISO(max);
    if (open) setViewDate(selectedDate ?? (latest && today > latest ? latest : today));
    // Only reset the visible month when the panel opens, not on every keystroke/value change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const minDate = parseISO(min);
  const maxDate = parseISO(max);
  const grid = useMemo(() => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  // ±10 years around today, or the min/max range when given (e.g. a date of
  // birth decades back), always including the year on screen.
  const viewYear = viewDate.getFullYear();
  const yearOptions = useMemo(() => {
    const first = Math.min(minDate ? minDate.getFullYear() : today.getFullYear() - 10, viewYear);
    const last = Math.max(maxDate ? maxDate.getFullYear() : today.getFullYear() + 10, viewYear);
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, min, max, viewYear]);

  function commit(date: Date) {
    const iso = toISO(date);
    setInternalValue(iso);
    onChange?.(iso);
    setOpen(false);
  }

  function clearValue() {
    setInternalValue("");
    onChange?.("");
  }

  function isDisabledDate(date: Date): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  return (
    <div ref={containerRef} className={"relative " + className}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={"date-picker-trigger " + DATE_PICKER_SIZE_CLASSES[size] + (open ? " date-picker-trigger-open" : "")}
      >
        <span className={"truncate " + (selectedDate ? "text-gray-900" : "text-gray-400")}>
          {selectedDate ? formatDisplay(selectedDate) : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="date-picker-panel" role="dialog" aria-label={ariaLabel ?? "Choose date"}>
          <div className="flex items-center justify-between px-3 pt-3">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="date-picker-nav-button"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="date-picker-nav-button"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 pt-2">
            <select
              aria-label="Month"
              value={viewDate.getMonth()}
              onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), Number(e.target.value), 1))}
              className="date-picker-select"
            >
              {MONTH_LABELS.map((label, i) => (
                <option key={label} value={i}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="Year"
              value={viewDate.getFullYear()}
              onChange={(e) => setViewDate(new Date(Number(e.target.value), viewDate.getMonth(), 1))}
              className="date-picker-select"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="date-picker-grid">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="date-picker-weekday">
                {label}
              </span>
            ))}
            {grid.map((date) => {
              const inMonth = date.getMonth() === viewDate.getMonth();
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={isDisabledDate(date)}
                  onClick={() => commit(date)}
                  className={
                    "date-picker-day" +
                    (!inMonth ? " date-picker-day-outside" : "") +
                    (isToday && !isSelected ? " date-picker-day-today" : "") +
                    (isSelected ? " date-picker-day-selected" : "")
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="date-picker-footer">
            <button type="button" className="date-picker-footer-button" onClick={clearValue}>
              Clear
            </button>
            <button
              type="button"
              className="date-picker-footer-button date-picker-footer-button-primary"
              onClick={() => commit(today)}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
