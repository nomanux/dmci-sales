/** Pill badge. Colours from the Figma "Badge" pill variants (DMCI-SID-Portal). */

const TONES = {
  brand: "border-[#8cadf2] bg-[#e8effe] text-[#1448b3]",
  purple: "border-[#d9d6fe] bg-[#f4f3ff] text-[#5925dc]",
  warning: "border-[#fedf89] bg-[#fffaeb] text-[#b54708]",
  blue: "border-[#b9e6fe] bg-[#f0f9ff] text-[#026aa2]",
  success: "border-[#abefc6] bg-[#ecfdf3] text-[#067647]",
  info: "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]",
  error: "border-[#fecdca] bg-[#fef3f2] text-[#b42318]",
  gray: "border-[#e9eaeb] bg-[#fafafa] text-[#414651]",
} as const;

export type BadgeTone = keyof typeof TONES;

const TONE_BY_VALUE: Record<string, keyof typeof TONES> = {
  Existing: "brand",
  New: "purple",
  "Hold for Lease": "warning",
  "For Lease": "blue",
  Leased: "success",
  Synced: "success",
  Pending: "warning",
  Failed: "error",
  Sufficient: "success",
  Deficient: "error",
  Submitted: "info",
  Released: "info",
  Signed: "success",
  Passed: "success",
  Paid: "success",
  Draft: "gray",
  "In review": "warning",
};

const SIZES = {
  sm: "px-2 py-0.5 text-xs leading-[18px]",
  md: "px-3 py-1 text-sm leading-5",
};

export default function Badge({
  children,
  size = "sm",
  tone,
}: {
  children: string;
  size?: keyof typeof SIZES;
  /** Overrides the colour picked from the label. */
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-solid font-medium ${SIZES[size]} ${
        TONES[tone ?? TONE_BY_VALUE[children] ?? "brand"]
      }`}
    >
      {children}
    </span>
  );
}
