import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import StepHeader from "./StepHeader";

/**
 * Step 7 of the CRF track — "Customer Acceptance Policy & Client Consent".
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 167635:167886.
 *
 * One policy paragraph (verbatim from the design) and two consents; both
 * must be ticked before the shell's Next button unlocks.
 */

export const CONSENTS = [
  "I agree to the Customer Acceptance Policy Form.",
  "I authorize the seller to edit or update the Reservation Agreement details if the initially submitted agreement is rejected by the DICD department.",
];

export default function ConsentStep({
  onReadyChange,
}: {
  /** Fires with true once every consent is ticked — gates the shell's Next button. */
  onReadyChange?: (ready: boolean) => void;
}) {
  const [agreed, setAgreed] = useState(() => CONSENTS.map(() => false));
  const ready = agreed.every(Boolean);

  useEffect(() => {
    onReadyChange?.(ready);
  }, [ready, onReadyChange]);

  return (
    <section className="antialiased w-full md:max-h-full bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader title="Customer Acceptance Policy & Client Consent" className="px-4 md:px-8 pt-6 pb-6">
        Please review the Customer Acceptance Policy and provide your consent before proceeding to the next step.
      </StepHeader>

      {/* Only the card body scrolls; the title stays put. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
      <div className="px-4 md:px-8 pb-6 flex flex-col gap-6">
        {/* Same panel and text scale as the Terms and Data Privacy steps. */}
        <div className="rounded-xl bg-gray-50 px-4 py-5 md:px-6 md:py-6 text-sm md:text-[15px] leading-6 text-gray-600">
          <ConsentPolicyText />
        </div>

        <div className="flex flex-col gap-4">
        {CONSENTS.map((text, i) => (
          <label key={text} className="flex cursor-pointer items-start gap-2 text-sm font-medium leading-5 text-gray-700">
            <span className="pt-0.5">
              <Checkbox
                checked={agreed[i]}
                onChange={(e) => setAgreed((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
              />
            </span>
            {text}
          </label>
        ))}
        </div>
      </div>
      </div>
    </section>
  );
}

/** The AMLA policy paragraph — shared with the Review & Submit step. */
export function ConsentPolicyText() {
  return (
    <p className="m-0">
      In compliance with the Anti-Money Laundering Act (AMLA), DMCI Homes is required to verify each client’s
      identity before proceeding with any official transaction. This includes collecting valid government-issued
      IDs and contact information. Additional supporting documents, such as proof of income and/ or business
      registration, may also be requested as part of our due diligence procedures. Additionally, clients are
      responsible for updating all information and records pertaining to their account, and failure to do so shall
      be deemed as confirmation that all existing information and records remain current, valid, and effective
      until the required updates are reported.
    </p>
  );
}
