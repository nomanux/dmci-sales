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
}: {
  title: string;
  step: number;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = ICONS[step] ?? ICONS[1];
  const pct = Math.round((step / TOTAL) * 100);
  return (
    <div className={className}>
      <div className="flex items-center gap-4 rounded-2xl bg-[linear-gradient(135deg,#EEF4FF_0%,#F5F3FF_55%,#FDF2FA_100%)] px-4 py-4 md:px-5">
        <span className="hidden size-10 flex-shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-[0_1px_2px_rgba(16,24,40,0.06)] md:grid">
          <Icon size={20} strokeWidth={1.5} color="currentColor" aria-hidden="true" />
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
