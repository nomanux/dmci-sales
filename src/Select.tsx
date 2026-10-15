import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";

/**
 * Select — the single shared source of truth for every dropdown in the app.
 * Shown on the /component page (ComponentsPage.tsx), which renders this
 * exact component, not a copy — so editing a class in tailwind.css's
 * `.select-*` rules updates both the reference page and every screen that
 * imports Select (FilterBar's dropdown fields, etc). Styling is class-based
 * (see src/tailwind.css `@layer components`), mirroring Button.tsx /
 * Input.tsx's pattern — this file holds no utility strings.
 *
 * This is a custom combobox, not a native <select>: the design calls for a
 * highlighted selected row (bg-primary-25 / text-primary-500) and a "Clear"
 * action inside the open panel, neither of which a browser's own <select>
 * dropdown UI can render.
 */

export type SelectSize = "xs" | "sm" | "md";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  size?: SelectSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Maps size -> the CSS class defined in tailwind.css (@layer components). */
export const SELECT_SIZE_CLASSES: Record<SelectSize, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "select-md",
};

export default function Select({
  options,
  size = "sm",
  placeholder = "Select one",
  value,
  defaultValue,
  onChange,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

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

  function selectValue(next: string) {
    setInternalValue(next);
    onChange?.(next);
    setOpen(false);
  }

  function clearValue() {
    setInternalValue("");
    onChange?.("");
  }

  return (
    <div ref={containerRef} className={"relative " + className}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={"select-trigger " + SELECT_SIZE_CLASSES[size] + (open ? " select-trigger-open" : "")}
      >
        <span className={selectedOption ? "truncate text-gray-900" : "truncate text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {open ? (
          <ChevronUpIcon className="h-4 w-4 shrink-0 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="select-panel" role="listbox">
          {selectedOption && (
            <div className="select-clear-row">
              <button type="button" className="select-clear-button" onClick={clearValue}>
                Clear
              </button>
            </div>
          )}
          <div className="select-option-list">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectValue(option.value)}
                  className={"select-option " + (isSelected ? "select-option-selected" : "")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
