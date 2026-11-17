"use client";

// Sliding tab underline for DMCI "Advance Commission" page.
// Same technique as the Motion Brew Preview/Source toggle:
// a shared-layout indicator (layoutId) that springs between tabs.
//
// Install: npm i motion
// (If your project already uses framer-motion, change the import to "framer-motion".)

import { motion } from "motion/react";
import { useId } from "react";

// Spring measured from the Motion Brew toggle:
// ~190 ms to peak, ~3% overshoot, settled by ~380 ms.
export const tabSpring = {
  type: "spring",
  stiffness: 550,
  damping: 35,
  mass: 1,
} as const;

type Tab = { value: string; label: string };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export function CommissionTabs({ tabs, value, onChange }: Props) {
  // Unique id per tab group, so two tab bars on one page never share an indicator.
  const groupId = useId();

  return (
    <div role="tablist" className="flex gap-6 border-b border-gray-200 px-6">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={
              "relative py-3 text-sm font-semibold outline-none transition-colors duration-200 " +
              (active ? "text-[#1E3A8A]" : "text-gray-500 hover:text-gray-700")
            }
          >
            {tab.label}

            {active && (
              <motion.span
                layoutId={`${groupId}-underline`}
                transition={tabSpring}
                className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#1E3A8A]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Usage

const [tab, setTab] = useState("mine");

<CommissionTabs
  value={tab}
  onChange={setTab}
  tabs={[
    { value: "mine", label: "My commission" },
    { value: "team", label: "Teams Commission" },
  ]}
/>

Keep your existing classes for colour, font size and padding.
Only two parts matter for the motion:
1. Render the underline span inside the active button only.
2. Give it motion.span + layoutId + tabSpring.
*/
