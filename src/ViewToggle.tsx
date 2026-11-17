import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * ViewToggle — the grid / list switch shared by list pages (Projects, Unit
 * Availability). A soft pill glides to the chosen button, the button gives a
 * small press, and the chosen icon turns navy. Each page passes its own `id`
 * so pills on different pages never try to animate between each other; the
 * id also lets the pill glide when a page renders its two views as separate
 * components, each with its own toggle.
 */

export type ViewMode = "grid" | "list";

const PILL_SPRING = { type: "spring", stiffness: 520, damping: 38 } as const;

function GridGlyph() {
  return (
    <svg viewBox="0 0 17 17" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.667} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="0.833" y="0.833" width="5.833" height="5.833" rx="1.33" />
      <rect x="10" y="0.833" width="5.833" height="5.833" rx="1.33" />
      <rect x="10" y="10" width="5.833" height="5.833" rx="1.33" />
      <rect x="0.833" y="10" width="5.833" height="5.833" rx="1.33" />
    </svg>
  );
}

function ListGlyph() {
  return (
    <svg viewBox="0 0 17 14" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.667} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15.834 6.667H5.834M15.834 1.667H5.834M15.834 11.667H5.834" />
      <circle cx="1.667" cy="6.667" r="0.833" />
      <circle cx="1.667" cy="1.667" r="0.833" />
      <circle cx="1.667" cy="11.667" r="0.833" />
    </svg>
  );
}

const OPTIONS: { value: ViewMode; label: string; Glyph: () => React.JSX.Element }[] = [
  { value: "grid", label: "Grid view", Glyph: GridGlyph },
  { value: "list", label: "List view", Glyph: ListGlyph },
];

export default function ViewToggle({
  id,
  view,
  onChange,
}: {
  id: string;
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Layout">
      {OPTIONS.map(({ value, label, Glyph }) => {
        const selected = view === value;
        return (
          <motion.button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            title={label}
            onClick={() => onChange(value)}
            whileTap={reduced ? undefined : { scale: 0.9 }}
            className={
              "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors " +
              (selected ? "text-[#052B78]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700")
            }
          >
            {selected && (
              <motion.span
                layoutId={`${id}-view-pill`}
                className="absolute inset-0 rounded-md bg-[#F0F5FF]"
                transition={reduced ? { duration: 0 } : PILL_SPRING}
              />
            )}
            <span className="relative">
              <Glyph />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/*
 * Entrance for whichever view was just chosen: the body fades up out of a
 * slight blur, then its rows or cards follow one after another. Only the
 * first dozen or so are staggered, so long lists don't take seconds to fill.
 */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const viewEnter: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.28, ease: EASE_OUT } },
};

export const itemEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: EASE_OUT, delay: 0.06 + Math.min(index, 12) * 0.03 },
  }),
};
