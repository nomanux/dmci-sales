import { useEffect, useState, type ReactNode } from "react";
import Checkbox from "./Checkbox";
import StepHeader from "./StepHeader";

/**
 * Step 5 of the CRF track — "Terms and Conditions".
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 167635:167884.
 *
 * The agreement text is reproduced verbatim from the design (it's legal copy),
 * inside a scrollable panel. Both acknowledgements must be ticked before the
 * shell's Next button unlocks.
 */

type Row = [requirement: ReactNode, newBuyer: ReactNode, repeatBuyer: ReactNode];

const REQUIREMENTS: Row[] = [
  [<>Signed <b>RESERVATION AGREEMENT</b></>, "*", "*"],
  [
    <>
      Photocopy of 1 <b>VALID GOVERNMENT ISSUED ID</b> (Driver's License, SSS, GSIS e-card / ID, Postal ID, Voter's
      ID, Barangay ID, Philhealth Card with Picture, NBI Clearance, TIN card, Passport, PRC ID)
    </>,
    "*",
    "If ID provided before has lapsed validity period",
  ],
  [<><b>SPECIAL POWER OF ATTORNEY</b>, if applicable;</>, "*", "*"],
  [<><b>VERIFIED TIN</b> (1902 or 1904 with stamp “TIN Verified”. TVS, BIR 2303)</>, "*", "if not provided before"],
  [<><b>BANK/ PAGIBIG LOAN REQUIREMENTS</b>, if applicable:</>, "*", "*"],
  [<>Minimum Required <b>POST-DATED CHECKS</b>/Signed Automatic Debit Arrangement (ADA) form</>, "*", "*"],
  [<><b>CONTRACT TO SELL OR DEED OF ABSOLUTE SALE</b> duly signed by the Buyer/s</>, "*", "*"],
  [<><b>COMPUTATION SHEET</b> (indicating the terms of payment) duly signed by the Buyer/s;</>, "*", "*"],
  [
    <>
      Original <b>PROOF OF BILLING ADDRESS</b> (meralco, water, telephone, cable, bank statement, etc.) Indicating the
      home address or preferred billing address of principal buyer;
    </>,
    "*",
    "if current information needs update",
  ],
  [<b>BIRTH CERTIFICATE</b>, "For minor", ""],
  [<b>MARRIAGE CONTRACT</b>, "If applicable", ""],
  [<><b>CERTIFICATE OF ANNULMENT/DIVORCE</b> W/ Finality</>, "If applicable", ""],
  ["Waiver approval, penalty assessment form", "If applicable", ""],
  [<><b>Authorization/awareness letter</b> for checks not owned by the buyer</>, "If applicable", ""],
  [<><b>AMEF</b> for <b>Change in Due Date</b></>, "If applicable", ""],
  [<><b>CIUF</b> (all Customer Information Update Form requests should be attached in the RA)</>, "If applicable", ""],
  [<><b>Letter of Guardianship</b> (For <b>Minor</b>)</>, "If applicable", ""],
  [<b>Legal separation (court order)</b>, "If applicable", ""],
  [<b>Oath of allegiance for dual citizenship</b>, "If applicable", ""],
  [<><b>Signed Deed of Reconveyance</b> (for Bank Financing Term)</>, "If applicable", ""],
  [<><b>Photocopy of LOG</b> for <b>RFO accounts</b></>, "If applicable", ""],
  [<><b>Credit Notation</b> from <b>C&amp;C helpdesk (</b>for <b>TOO accounts)</b></>, "If applicable", ""],
  [<b>Meralco SPA</b>, "If applicable", ""],
];

const COMPANY_REQUIREMENTS: Row[] = [
  [<><b>SEC REGISTRATION</b> (certified true copy)</>, "*", ""],
  [
    <Bullet>
      <b>SECRETARY’S CERTIFICATE</b> (notarized original copy &amp; indicated the property purchased)
    </Bullet>,
    "*",
    "",
  ],
  [<Bullet><b>ARTICLES OF INCORPORATION</b> (certified true copy by SEC)</Bullet>, "*", ""],
  [<><b>DTI</b> (if not corporation)</>, "*", ""],
  [<b>COMPANY TIN</b>, "*", ""],
  [
    <>
      <b>CERTIFICATE OF REGISTRATION (COR) or PROVISIONAL CERTIFICATE OF REGISTRATION (PCOR)</b> if no COR yet issued
      by AMLC - for covered persons
    </>,
    "*",
    "",
  ],
  [<b>By Laws</b>, "*", ""],
  [<b>Registration data sheet / latest General Information Sheet (GIS)</b>, "*", ""],
  [<><b>Audited Income Statement or ITR</b> - within the last 2 years</>, "*", ""],
  ["OTHERS (as may be required by the Developer)", "*", ""],
];

const CLAUSES = [
  "In additional to the contract price, certain national and local government taxes, fees and other processing expenses are chargeable to me/us. In case that the ownership of the property is to be transferred to second party, I/we or the second party shall be responsible for any taxes and submission of original documentary requirements that will be imposed to such action. All expenses for the installation of certain utilities/services shall also be for my/our account.",
  "Sale under minor may be assessed by Bureau of Internal Revenue (BIR) with Donor’s Tax.",
  "It is my sole responsibility to update the Bureau of Internal Revenue (BIR) on changes of tax identification details reflected on their system to align with the documents I have submitted to DMCI Homes.",
  "It is understood and agreed that I/We cannot assign or transfer the reservation to a third party unless consented to or duly agreed upon, in writing, by DMCI Homes and maybe subject to a fee if approved. Any assignment or transfer without the written consent or approval of DMCI Homes shall be void and shall cause the automatic cancellation or rescission of the reservation as well as the automatic forfeiture of the or reservation fee.",
  "The reservation fee is non-refundable and this agreement shall not be valid and binding unless approved by the developer/ seller and that the corresponding reservation fee has been settled. Unless approved, this agreement shall not be considered as a consummated sale. I/We hereby agree and acknowledge that DMCI Homes or the developer/seller has the right to disapprove, cancel and rescind this agreement for whatsoever cause or reason at anytime before the execution of a Contract to Sell or Deed of Absolute Sale, and the developer/seller has no obligation to disclose the reason for the disapproval or cancellation of reservation. In case of disapproval and in the absence of Buyer's fault, delay or negligence, the developer/seller may refund the reservation fee, without interest and charges",
  "I/We hereby further understand that any representation/s or warranty/ies made to me/us by the agent who handled this sale that is/are not embodied herein shall not be binding on the developer/seller unless (i) such representation/s or warranty/ies are in writing and confirmed by the President of the developer/seller and (ii) such representation/s or warranty/ ies are in accordance with policies, pronouncements and guidelines of DMCI Homes and/or the developer/seller. Furthermore, I/We understand that only duly authorized officers of DMCI Homes or the developer/seller are allowed to make commitments.",
  "I/We certify that the above information are to the best of my/our knowledge, true and correct and are made for the purpose of obtaining credit. I/We hereby authorize DMCI Homes to obtain and verify such information as may be required covering this application from the above references or any other sources. I/We further agreed that all information obtained by DMCI Homes shall remain its property whether or not the loan/purchase is granted. Likewise, DMCI Homes is authorized to release information as may be necessary in furtherance of this transaction. I/We further authorizes DMCI Homes to disclose the information to its accredited banks for possible financing, if applicable; and in case there is a need to verify certain information, including my/our credit information for the purpose of establishing my/our credit worthiness, I/we fully give my/ our consent to DMCI Homes’ accredited banks for further verification.",
  "This agreement shall not be considered as changed, modified, altered or in any way amended by acts of tolerance of developer/seller or DMCI Homes unless such changes, modifications or amendments are made in writing and duly signed by the authorized officers.",
];

export const AGREEMENTS = [
  "I agree to the Terms and Conditions of this agreement.",
  "I confirm that I have read, understood, and agree to comply with the submission requirements.",
];

function Bullet({ children }: { children: ReactNode }) {
  return (
    <span className="flex gap-2 pl-1">
      <span aria-hidden="true">•</span>
      <span>{children}</span>
    </span>
  );
}

/** Underlined blank in the fee sentence, to be filled in on the printed agreement. */
function Blank({ width, label }: { width: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label + " (blank)"}
      className={"mx-1 inline-block border-b border-gray-500 align-baseline " + width}
    />
  );
}

const CELL = "border border-gray-200 px-4 py-2 align-top";

function RequirementRows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map(([requirement, newBuyer, repeatBuyer], i) => (
        <tr key={i}>
          <td className={CELL}>{requirement}</td>
          <td className={CELL + " text-center text-gray-600"}>{newBuyer}</td>
          <td className={CELL + " text-center text-gray-600"}>{repeatBuyer}</td>
        </tr>
      ))}
    </>
  );
}

export default function TermsStep({
  onReadyChange,
}: {
  /** Fires with true once every acknowledgement is ticked — gates the shell's Next button. */
  onReadyChange?: (ready: boolean) => void;
}) {
  const [agreed, setAgreed] = useState(() => AGREEMENTS.map(() => false));
  const ready = agreed.every(Boolean);

  useEffect(() => {
    onReadyChange?.(ready);
  }, [ready, onReadyChange]);

  // Fills the visible area so only the text panel scrolls (one scrollbar), not the page too.
  return (
    <section className="antialiased w-full md:max-h-full bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader title="Terms and Conditions" className="px-4 md:px-8 pt-5 pb-4 md:pt-6 md:pb-6">
        Please read the terms and conditions carefully before proceeding next step.
      </StepHeader>

      <div className="px-4 md:px-8 pb-4 md:pb-6 flex flex-1 min-h-0 flex-col gap-4 md:gap-6">
        {/* Scrollable agreement text */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Terms and conditions text"
          className="max-h-[50vh] md:max-h-none md:flex-1 md:min-h-0 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 md:px-6 md:py-6 text-[13px] leading-5 md:text-[15px] md:leading-6 text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <TermsAgreementText />
        </div>

        {/* Acknowledgements */}
        <div className="flex flex-col gap-3 md:gap-4">
          {AGREEMENTS.map((text, i) => (
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
    </section>
  );
}

/** The agreement body — shared with the Review & Submit step so both show identical copy. */
export function TermsAgreementText() {
  return (
  <div className="flex flex-col gap-4">
    <p className="m-0">
      A reservation fee in the amount of PESOS
      <Blank width="w-[100px]" label="Amount in words" />
      (PHP
      <Blank width="w-[100px]" label="Amount in pesos" />) was paid for above described purchased property on
      <Blank width="w-[124px]" label="Payment date" />.
    </p>
    <p className="m-0">
      This reservation will be automatically cancelled in the event that I/we fail to submit the following
      REQUIRED DOCUMENTS WITHIN THIRTY (30) DAYS FROM PAYMENT OF THE RESERVATION FEE and hence, the reservation
      fee shall not be refunded to wit:
    </p>
  
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse bg-white text-[13px] leading-5 text-gray-700 md:text-sm [&_b]:font-semibold [&_b]:text-gray-900">
        <colgroup>
          <col className="w-1/2" />
          <col className="w-1/4" />
          <col className="w-1/4" />
        </colgroup>
        <thead>
          <tr className="bg-gray-50 text-gray-900">
            <th scope="col" className={CELL + " font-semibold"}>
              Documentary Requirements
            </th>
            <th scope="col" className={CELL + " font-semibold"}>
              New Buyer
            </th>
            <th scope="col" className={CELL + " font-semibold"}>
              Repeat Buyer***
            </th>
          </tr>
        </thead>
        <tbody>
          <RequirementRows rows={REQUIREMENTS} />
          <tr>
            <th scope="colgroup" colSpan={3} className={CELL + " bg-gray-50 text-center font-semibold text-gray-900"}>
              ADDITIONAL REQUIREMENTS FOR PURCHASE UNDER A COMPANY/CORPORATION
            </th>
          </tr>
          <RequirementRows rows={COMPANY_REQUIREMENTS} />
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className={CELL + " text-gray-500"}>
              *** Buyer is qualified as a repeat buyer if it satisfies the following conditions: (1) with an
              active account in DMCI Homes. (2) has complete documentary requirements in the last purchased, and
              (3) has less than 10 years since the title of the past purchased units has been transferred to
              his/her name.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  
    {CLAUSES.map((clause) => (
      <p key={clause.slice(0, 40)} className="m-0">
        {clause}
      </p>
    ))}
  </div>
  );
}
