import type { ReactNode } from "react";

/**
 * Underlined tab row used at the top of admin cards.
 * Figma: DMCI-SID-Portal "Horizontal tabs" (_Tab button base).
 */
export default function UnderlineTabs<K extends string>({
  label,
  tabs,
  value,
  onChange,
}: {
  label: string;
  tabs: { key: K; label: string; badge?: ReactNode }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] border-0 border-b border-solid border-[#e5e7eb] px-6 pt-4"
    >
      {tabs.map((t) => {
        const selected = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.key)}
            className={`-mb-px flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-0 border-b-2 border-solid bg-transparent px-5 pb-4 text-sm font-semibold leading-5 outline-none focus-visible:rounded-t-md focus-visible:bg-[#f5f8ff] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1448b3]/40 ${
              selected ? "border-[#10398e] text-[#0a255c]" : "border-transparent text-[#717680] hover:text-[#414651]"
            }`}
          >
            {t.label}
            {t.badge !== undefined && (
              <span
                className={`rounded-full border border-solid px-1.5 py-0.5 text-xs font-medium leading-4 ${
                  selected ? "border-[#8cadf2] bg-[#e8effe] text-[#1448b3]" : "border-[#e9eaeb] bg-[#fafafa] text-[#414651]"
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
