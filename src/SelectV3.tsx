import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "./icons";
import { SELECT_SIZE_CLASSES, type SelectProps } from "./Select";

/**
 * RA form v3 copy of Select with motion, after Motion Brew's ActionMenu:
 * the panel springs out of the trigger, options cascade in, a soft brand
 * tint glides between options on hover / arrow keys, the chevron turns and
 * the chosen option shows a tick. Same props as Select, so it drops in.
 * Select.tsx itself is unchanged for v1 / v2 and the admin screens.
 */
const GLIDE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const;

export default function SelectV3({
  options,
  size = "sm",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [hover, setHover] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex((o) => o.value === selectedValue);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setHover(selectedIndex);
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // selectedIndex only matters at the moment the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function choose(next: string) {
    setInternalValue(next);
    onChange?.(next);
    setOpen(false);
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
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setOpen(true);
            return;
          }
          if (!open) return;
          if (e.key === "ArrowDown") (e.preventDefault(), setHover((h) => (h + 1) % options.length));
          if (e.key === "ArrowUp") (e.preventDefault(), setHover((h) => (h <= 0 ? options.length - 1 : h - 1)));
          if (e.key === "Enter" && hover >= 0) (e.preventDefault(), choose(options[hover].value));
        }}
        className={"select-trigger " + SELECT_SIZE_CLASSES[size] + (open ? " select-trigger-open" : "")}
      >
        <span className={selectedOption ? "truncate text-gray-900" : "truncate text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          className="flex shrink-0 text-gray-500"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: GLIDE }}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.14, ease: GLIDE } }}
            transition={SPRING}
            style={{ transformOrigin: "top center" }}
            className="select-panel"
            onPointerLeave={() => setHover(-1)}
          >
            {selectedOption && (
              <div className="select-clear-row">
                <button
                  type="button"
                  className="select-clear-button"
                  onClick={() => {
                    setInternalValue("");
                    onChange?.("");
                  }}
                >
                  Clear
                </button>
              </div>
            )}
            <motion.div
              className="select-option-list"
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.025, delayChildren: 0.03 } } }}
            >
              {options.map((option, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    variants={{
                      hidden: { opacity: 0, y: 4 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.22, ease: GLIDE } },
                    }}
                    onPointerEnter={() => setHover(i)}
                    onClick={() => choose(option.value)}
                    className={"select-option isolate relative " + (isSelected ? "select-option-selected" : "")}
                  >
                    {hover === i && (
                      <motion.span
                        layoutId={`${uid}-hl`}
                        transition={{ duration: 0.22, ease: GLIDE }}
                        className="rd-hl absolute inset-0 -z-10 rounded-lg"
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected && (
                      <svg viewBox="0 0 16 16" fill="none" className="ml-2 size-3.5 shrink-0" aria-hidden="true">
                        <path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
