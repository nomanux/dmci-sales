import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Sidebar icons that play a short animation while their row is hovered or
 * focused. Same Lucide drawings as icons.tsx; each one moves a single detail
 * (in the style of Motion Brew's SidebarNav), then settles back when `play`
 * turns off. Reduced motion keeps them still.
 */

export type AnimatedIconProps = { className?: string; play?: boolean };

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

// Strokes that redraw one after another: windows, text lines.
const draw = (order: number): Variants => ({
  rest: { pathLength: 1, opacity: 1 },
  play: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.35, delay: order * 0.08, ease: "easeOut" },
  },
});

function usePlayState(play?: boolean) {
  const reduced = useReducedMotion();
  return play && !reduced ? "play" : "rest";
}

export function LayoutDashboardIcon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // The tiles pulse in turn, round the grid.
  const tile = (order: number): Variants => ({
    rest: { scale: 1 },
    play: { scale: [1, 0.8, 1], transition: { duration: 0.4, delay: order * 0.07, ease: "easeInOut" } },
  });
  return (
    <svg className={className} {...svgProps}>
      <motion.rect width="7" height="9" x="3" y="3" rx="1" variants={tile(0)} initial={false} animate={state} />
      <motion.rect width="7" height="5" x="14" y="3" rx="1" variants={tile(1)} initial={false} animate={state} />
      <motion.rect width="7" height="9" x="14" y="12" rx="1" variants={tile(2)} initial={false} animate={state} />
      <motion.rect width="7" height="5" x="3" y="16" rx="1" variants={tile(3)} initial={false} animate={state} />
    </svg>
  );
}

export function Building2Icon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // Windows light up floor by floor, from the ground up.
  return (
    <svg className={className} {...svgProps}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <motion.path d="M10 6h4" variants={draw(3)} initial={false} animate={state} />
      <motion.path d="M10 10h4" variants={draw(2)} initial={false} animate={state} />
      <motion.path d="M10 14h4" variants={draw(1)} initial={false} animate={state} />
      <motion.path d="M10 18h4" variants={draw(0)} initial={false} animate={state} />
    </svg>
  );
}

export function WalletIcon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // The clasp slides out and back, like the wallet opening.
  const clasp: Variants = {
    rest: { x: 0 },
    play: { x: [0, 2, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  };
  return (
    <svg className={className} {...svgProps}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <motion.path d="M18 12a2 2 0 0 0 0 4h4v-4Z" variants={clasp} initial={false} animate={state} />
    </svg>
  );
}

export function FileTextIcon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // The text lines write themselves in, top to bottom.
  return (
    <svg className={className} {...svgProps}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <motion.path d="M10 9H8" variants={draw(0)} initial={false} animate={state} />
      <motion.path d="M16 13H8" variants={draw(1)} initial={false} animate={state} />
      <motion.path d="M16 17H8" variants={draw(2)} initial={false} animate={state} />
    </svg>
  );
}

export function UsersIcon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // The second person steps in from behind the first.
  const second: Variants = {
    rest: { x: 0, opacity: 1 },
    play: { x: [-5, 0], opacity: [0, 1], transition: { duration: 0.4, ease: "easeOut" } },
  };
  return (
    <svg className={className} {...svgProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <motion.g variants={second} initial={false} animate={state}>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </motion.g>
    </svg>
  );
}

export function TicketIcon({ className, play }: AnimatedIconProps) {
  const state = usePlayState(play);
  // The ticket gives a small wiggle, as if just drawn.
  const ticket: Variants = {
    rest: { rotate: 0 },
    play: { rotate: [0, -12, 8, -4, 0], transition: { duration: 0.55, ease: "easeInOut" } },
  };
  return (
    <motion.svg className={className} {...svgProps} variants={ticket} initial={false} animate={state}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </motion.svg>
  );
}
