// RA form v3 copy of ConsentStep.tsx: StepHeaderV3 banner, focused card and compact fields. The original stays as v1/v2 use it.
import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import StepHeaderV3 from "./StepHeaderV3";
import { Shield01Icon } from "hugeicons-react";
import "./RepresentativeDetailsStepV3.css";

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

export default function ConsentStepV4({
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
    <section className="antialiased w-full md:max-h-full rd-v3 flex flex-col px-4 pt-4 md:px-0 md:pt-0">
      <StepHeaderV3 hideStep step={8} total={9} icon={Shield01Icon} title="Customer Acceptance Policy & Client Consent" className="flex-shrink-0 pb-6">
        Please review the Customer Acceptance Policy and provide your consent before proceeding to the next step.
      </StepHeaderV3>

      <div className="flex min-h-0 flex-col overflow-hidden bg-white pt-6 md:flex-1 md:rounded-xl md:border md:border-solid md:border-gray-200">

      {/* Same text scale as Terms and Data Privacy; no box, one left edge for text and consents. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
        <div className="px-4 pb-5 text-[14px] leading-6 text-gray-700 md:px-8">
          <ConsentPolicyText />
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-2 border-0 border-t border-solid border-gray-100 px-4 py-4 md:px-8">
        {CONSENTS.map((text, i) => (
          <label key={text} className="flex cursor-pointer items-start gap-3 py-0.5">
            <span className="flex h-5 items-center">
              <Checkbox
                checked={agreed[i]}
                onChange={(e) => setAgreed((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
              />
            </span>
            <span className="text-sm font-medium leading-5 text-gray-900">{text}</span>
          </label>
        ))}
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
