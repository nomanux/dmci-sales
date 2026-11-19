import type { ReactNode } from "react";

/**
 * RA form v3 step header: a soft gradient banner with a colour icon for the
 * step, the step title and description, and a ring showing step N of 8.
 * Drop-in for StepHeader (same title / children / className), plus `step`.
 */
const LOOK: Record<number, { fg: string; bg: string; d: string }> = {
  1: { fg: "#0A4DE0", bg: "#EEF4FF", d: "M2.5 13.5h11M4 13.5V3.5h5v10M9 6h3v7.5M6 5.5h1M6 8h1M6 10.5h1" },
  2: { fg: "#0A4DE0", bg: "#EEF4FF", d: "M8 8.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5zM2.75 13.5c.8-2.3 2.8-3.5 5.25-3.5s4.45 1.2 5.25 3.5" },
  3: { fg: "#0E7090", bg: "#F0F9FF", d: "M2.75 3.5h10.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2.75a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM6 8.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM3.75 10.75c.4-.9 1.2-1.4 2.25-1.4s1.85.5 2.25 1.4M10 6.5h2.25M10 9h2.25" },
  4: { fg: "#6941C6", bg: "#F4F3FF", d: "M2 5.5a1 1 0 0 1 1-1h2l1-1.75h4l1 1.75h2a1 1 0 0 1 1 1v6.75a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zM8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
  5: { fg: "#B54708", bg: "#FFFAEB", d: "M4 1.75h5.5L12.5 4.75v9.5H4zM9.25 1.75v3.25h3.25M6 8h4.5M6 10.5h4.5" },
  6: { fg: "#039855", bg: "#ECFDF3", d: "M4.25 7.25h7.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-7.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zM5.5 7.25V5a2.5 2.5 0 0 1 5 0v2.25M8 10v1.5" },
  7: { fg: "#C01048", bg: "#FFF1F3", d: "M8 1.75 13 3.5v4.25c0 3-2.2 5.3-5 6.5-2.8-1.2-5-3.5-5-6.5V3.5zM5.75 8l1.5 1.5 3-3" },
  8: { fg: "#0A4DE0", bg: "#EEF4FF", d: "M5.5 2.5h5v2h-5zM5.5 3.5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-1.5M5.75 9.5l1.5 1.5 3-3" },
};
const TOTAL = 8;

export default function StepHeaderV3({
  title,
  step,
  children,
  className = "",
}: {
  title: string;
  step: number;
  children?: ReactNode;
  className?: string;
}) {
  const look = LOOK[step] ?? LOOK[1];
  const pct = Math.round((step / TOTAL) * 100);
  return (
    <div className={className}>
      <div className="flex items-center gap-4 rounded-2xl bg-[linear-gradient(135deg,#EEF4FF_0%,#F5F3FF_55%,#FDF2FA_100%)] px-4 py-4 md:px-5">
        <span
          className="hidden size-10 flex-shrink-0 place-items-center rounded-xl md:grid"
          style={{ color: look.fg, background: "#fff", boxShadow: `inset 0 0 0 1px ${look.bg}` }}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
            <path d={look.d} />
          </svg>
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="m-0 text-xs font-semibold leading-4 text-brand-400">
            Step {step} of {TOTAL}
          </p>
          <h1 className="m-0 text-lg font-bold leading-6 tracking-[-0.02em] text-gray-900 md:text-[22px] md:leading-7">{title}</h1>
          {children && <p className="m-0 text-[13px] leading-5 text-gray-600">{children}</p>}
        </div>
        <div
          className="grid size-14 flex-shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(#0a4de0 ${pct}%, #ffffff 0)` }}
          aria-hidden="true"
        >
          <span className="grid size-[44px] place-items-center rounded-full bg-white text-xs font-semibold text-brand-500">
            {step}/{TOTAL}
          </span>
        </div>
      </div>
    </div>
  );
}
