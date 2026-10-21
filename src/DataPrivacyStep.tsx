import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import StepHeader from "./StepHeader";
import { clockIconUrl } from "./assets/figmaAssets";

/**
 * Step 6 of the CRF track — "Data Privacy Policy".
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 167635:167885.
 *
 * Policy text is reproduced verbatim from the design inside a scrollable
 * panel, followed by the Conforme list of signers. The single agreement
 * checkbox gates the shell's Next button.
 */

export const PRIVACY_AGREEMENT =
  "I agree to the DMCI Homes Privacy Policy as guided by RA10173 or the Data Privacy Act of 2012.";

interface Signer {
  name: string;
  role: string;
  /** Display string for when they signed, or null if they haven't yet. */
  signedAt: string | null;
}

// Sample signers from the design. In the real flow these come from the
// buyer, co-buyers and guardians entered in step 2, with their e-sign status.
const SIGNERS: Signer[] = [
  {
    name: "Mr. UUIS LLO JED Sr.",
    role: "Primary Buyer",
    signedAt: "Jul 15, 2026 • 10:42 AM",
  },
  { name: "Mr. JOSE CRUZ SANTOS I", role: "Guardian", signedAt: null },
  {
    name: "Ms. MARIA DELA CRUZ GONZALES",
    role: "Guardian Spouse",
    signedAt: "Jul 15, 2026 • 10:42 AM",
  },
  {
    name: "ANTONIO DELA CRUZ GONZALES",
    role: "Guardian Spouse",
    signedAt: "Jul 15, 2026 • 10:42 AM",
  },
];

const CONTACTS = [
  {
    title: "Sales Transaction",
    lines: [
      ["Name", ": Josephine C. Isidro"],
      ["Address", ": 1321 Apolinario St., Brgy. Bangkal, Makati City PH 1322"],
      ["Phone No.:", " (02) 555-7777 ×7863"],
      ["Email Address:", " dataprivacyoffice@dmcihomes.com"],
    ],
  },
  {
    title: "Site Transaction",
    lines: [
      ["Name", ": Josephine C. Isidro"],
      ["Email Address:", " dataprivacyoffice@dmcihomes.com"],
    ],
  },
];

function SignerCard({ signer }: { signer: Signer }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-6 pt-6 pb-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <p className="m-0 text-center text-lg font-semibold leading-7 text-gray-700">
        {signer.name}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-gray-200 pt-1.5">
        <span className="text-xs font-semibold uppercase leading-[18px] text-brand-500">
          {signer.role}
        </span>
        {signer.signedAt ? (
          <span className="flex items-center gap-1.5 text-xs italic leading-[18px] text-gray-400">
            <img src={clockIconUrl} alt="" width={14} height={14} />
            Signed on {signer.signedAt}
          </span>
        ) : (
          <span className="text-xs italic leading-[18px] text-gray-400">
            Not Signed
          </span>
        )}
      </div>
    </li>
  );
}

export default function DataPrivacyStep({
  onReadyChange,
}: {
  /** Fires with true once the policy checkbox is ticked — gates the shell's Next button. */
  onReadyChange?: (ready: boolean) => void;
}) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    onReadyChange?.(agreed);
  }, [agreed, onReadyChange]);

  // Fills the visible area so only the text panel scrolls (one scrollbar), not the page too.
  return (
    <section className="antialiased w-full md:max-h-full bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader
        title="Data Privacy Policy"
        className="px-4 md:px-8 pt-6 pb-6"
      >
        Please read the Data Privacy Policy carefully before processing next
        step.
      </StepHeader>

      <div className="px-4 md:px-8 pb-6 flex flex-1 min-h-0 flex-col gap-6">
        {/* Scrollable policy text */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Data privacy policy text"
          className="max-h-[60vh] md:max-h-none md:flex-1 md:min-h-0 overflow-y-auto rounded-xl bg-gray-50 px-4 py-5 md:px-6 md:py-6 text-sm md:text-[15px] leading-6 text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <PrivacyPolicyText />
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium leading-5 text-gray-700">
          <span className="pt-0.5">
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          </span>
          {PRIVACY_AGREEMENT}
        </label>
      </div>
    </section>
  );
}

/** The policy body (incl. Conforme) — shared with the Review & Submit step. */
export function PrivacyPolicyText() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-base font-semibold leading-6 text-gray-900 md:text-lg md:leading-7">
        DMCI HOMES Data Privacy Policy
      </h2>
      <p className="m-0">
        We, DMCI Project Developers, Inc. (the "Company"), together with its
        subsidiaries, special projects and business units, highly value the
        confidentiality of information you have entrusted us. We highly regard
        your personal, sensitive and privileged information such that it will
        only be used for its intended purpose (or as may be required by existing
        national and local laws, rules and regulations), kept within the agreed
        period and protected against data privacy breach. Any personal,
        sensitive and privileged information that you provide shall be kept safe
        under the Data Privacy Act of 2012 (the "Act"), applicable laws of the
        Philippines and the Company's very own commitment through its Data
        Privacy Policy.
      </p>
      <p className="m-0">
        Personal, sensitive and privileged information that you provide shall be
        used for transactions related to the sale of the Company's products and
        all matters arising out of the said transaction.
      </p>
      <p className="m-0">
        All information collected by the Company shall be considered accurate
        unless the Client/Potential Client requests for update. It shall never
        be the responsibility of the Company to ensure validity/accuracy of
        information shared by the Client/Potential Client.
      </p>
      <p className="m-0">
        Under the Data Privacy Act of 2012, you have the right to access,
        modify, erase and/or object to any processing of personal, sensitive or
        privileged data that you have provided to us. To do so, kindly contact
        our Data Protection Officer with the following information:
      </p>

      {CONTACTS.map((contact) => (
        <div key={contact.title} className="flex flex-col gap-1.5 pt-3">
          <h3 className="m-0 text-base font-semibold leading-6 text-gray-900">
            {contact.title}
          </h3>
          <p className="m-0">
            {contact.lines.map(([label, value]) => (
              <span key={label} className="block">
                <b className="font-medium text-gray-700">{label}</b>
                {value}
              </span>
            ))}
          </p>
        </div>
      ))}

      <p className="m-0 pt-3">
        The Company will not impose any charge to cover the cost of verifying a
        request for information and locating, retrieving, reviewing and copying
        any material requested.
      </p>
      <p className="m-0">
        Please note, however, that the Company’s decision to provide such access
        or consider any request for correction, erasure and objection to process
        of the personal data as it appears in our records is subject to any
        exceptions under applicable laws, rules and regulations and/or the Act.
      </p>
      <p className="m-0">
        We have implemented technological, organizational, and physical security
        measures to protect your information from loss, misuse, modification,
        unauthorized or accidental access or disclosure, alteration or
        destruction. We put in effect safeguards such as:
      </p>
      <ol className="m-0 flex list-decimal flex-col gap-1.5 pl-6 marker:text-gray-400">
        <li>
          Keeping and protecting your information using a secured server behind
          a firewall, deploying encryption on computing devices and physical
          security controls
        </li>
        <li>
          Restricting access to your information only to qualified and
          authorized personnel who hold your information with strict
          confidentiality including third-party personnel/company who may be
          required to process your information.
        </li>
      </ol>
      <p className="m-0">
        The data will be kept within 10 years from date of last engagement (e.g.
        release of transferred title, release of documents related to back-out)
        and strictly for legitimate business purposes, such as record-keeping,
        internal audits or as may be required by existing laws, rules and
        regulations, unless you request your data to be deleted in our systems,
        databases and hard copies earlier than this date, subject to limitation
        of applicable laws and/or the Act. Once deleted, your information will
        no longer be searchable or included in anonymous searches and will be
        completely removed from all the storage location.
      </p>
      <p className="m-0">
        By agreeing to this policy, you explicitly and unambiguously consent to
        the collection, processing and storage of your personal, sensitive and
        privileged data by DMCI Project Developers, Inc. for the purpose(s)
        described in this Data Privacy Notice.
      </p>

      {/* Conforme */}
      <div className="flex flex-col gap-1.5 pt-3">
        <h3 className="m-0 text-base font-semibold leading-6 text-gray-900">
          Conforme
        </h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
          {SIGNERS.map((signer) => (
            <SignerCard key={signer.name} signer={signer} />
          ))}
        </ul>
      </div>
    </div>
  );
}
