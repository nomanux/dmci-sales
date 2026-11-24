import type { ReactNode } from "react";
import { Building03Icon, Camera01Icon, File01Icon, IdIcon, Shield01Icon, SquareLock02Icon, TaskDone01Icon, UserIcon } from "hugeicons-react";

/**
 * RA form v3 step header: a soft gradient banner with an icon for the
 * step, the step title and description, and a ring showing step N of 8.
 * Drop-in for StepHeader (same title / children / className), plus `step`.
 */
// One icon set (Hugeicons, stroke 1.5) in one brand colour for every step.
const ICONS: Record<number, typeof Building03Icon> = {
  1: Building03Icon,
  2: UserIcon,
  3: IdIcon,
  4: Camera01Icon,
  5: File01Icon,
  6: SquareLock02Icon,
  7: Shield01Icon,
  8: TaskDone01Icon,
};
const TOTAL = 8;

export default function StepHeaderV3({
  title,
  step,
  children,
  className = "",
  titleSize = "md:text-[22px]",
  plain = false,
  hideStep = false,
  total = TOTAL,
  icon,
}: {
  title: string;
  step: number;
  children?: ReactNode;
  className?: string;
  /** Desktop title size class; v4 passes a smaller one. */
  titleSize?: string;
  /** Title and one line, no banner or ring: the sidebar already shows the step. */
  plain?: boolean;
  /** Drop the "Step N of 8" line: the sidebar and the ring already show it. */
  hideStep?: boolean;
  /** Steps in the flow; v4 has 9 (Additional documents added). */
  total?: number;
  /** Icon override, for flows whose step numbers differ from ICONS. */
  icon?: typeof Building03Icon;
}) {
  if (plain) {
    return (
      <div className={className}>
        <h1 className="m-0 text-xl font-semibold leading-7 tracking-[-0.01em] text-gray-900">{title}</h1>
        {children && <p className="m-0 mt-1 text-sm leading-5 text-gray-600">{children}</p>}
      </div>
    );
  }
  const Icon = icon ?? ICONS[step] ?? ICONS[1];
  const pct = Math.round((step / total) * 100);
  return (
    <div className={className}>
      <div className="flex items-center gap-4 rounded-2xl border border-solid border-[#E0E8FB] bg-[linear-gradient(135deg,#EEF4FF_0%,#F5F3FF_55%,#FDF2FA_100%)] px-4 py-4 md:px-5">
        <span className="hidden size-10 flex-shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-[0_1px_2px_rgba(16,24,40,0.06)] md:grid">
          <Icon size={20} strokeWidth={1.5} color="currentColor" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {!hideStep && (
            <p className="m-0 text-xs font-semibold leading-4 text-brand-400">
              Step {step} of {total}
            </p>
          )}
          <h1 className={`m-0 text-lg font-bold leading-6 tracking-[-0.02em] text-gray-900 ${titleSize} md:leading-7`}>{title}</h1>
          {children && <p className="m-0 text-[13px] leading-5 text-gray-600">{children}</p>}
        </div>
        {/* Progress ring: an SVG arc so both ends are round. */}
        <div className="relative grid size-14 flex-shrink-0 place-items-center" aria-hidden="true">
          <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="25" fill="none" stroke="#ffffff" strokeWidth="6" />
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="#0a4de0"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${pct} 100`}
            />
          </svg>
          <span className="relative grid size-[44px] place-items-center rounded-full bg-white text-xs font-semibold text-brand-500">
            {step}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}
