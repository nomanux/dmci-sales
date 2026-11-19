// RA form v3 copy of ReviewStep.tsx: StepHeaderV3 banner, focused card and compact fields. The original stays as v1/v2 use it.
import { useEffect, useState, type ReactNode } from "react";
import Checkbox from "./Checkbox";
import StepHeaderV3 from "./StepHeaderV3";
import "./RepresentativeDetailsStepV3.css";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import { AGREEMENTS as TERMS_AGREEMENTS, TermsAgreementText } from "./TermsStep";
import { PRIVACY_AGREEMENT, PrivacyPolicyText } from "./DataPrivacyStep";
import { CONSENTS, ConsentPolicyText } from "./ConsentStep";
import {
  coBuyerIconUrl,
  reviewSampleIdUrl,
  reviewSamplePassportUrl,
  reviewSampleSelfieUrl,
} from "./assets/figmaAssets";

/**
 * Step 8 of the CRF track — "Review & Submit".
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 167635:167900.
 *
 * A read-only summary of steps 1–7 with an Edit button per section (jumps
 * back to that step). The steps don't share form state yet, so every value
 * below is SAMPLE data shaped like the real form — swap the constants for
 * the collected answers once the track has a shared store. The final
 * confirmation checkbox gates the shell's Submit button.
 */

type Pair = [label: string, value: ReactNode];

/* ------------------------------------------------------------------ */
/* Sample data (replace with the real answers from steps 1–7)          */
/* ------------------------------------------------------------------ */

const BUYER_PROPERTY: Pair[] = [
  ["Buyer Type", "Primary buyer"],
  ["Buyer Classification", "New Buyer"],
  ["Control Number (RA No.)", "16B/A"],
  ["Date of Reservation", "08/12/1996"],
  ["Property Name", "Alta Vista De Boracay"],
  ["Unit / Lot No./ Parking Slot No.", "SON-00A-C-02008"],
  ["Unit Category", "Condo unit"],
  ["Area (M2)", "1200"],
  ["List Price (Php)", "6,500,000"],
  ["Building Name", "Sample Building Name"],
];

const BIRTH_PLACE: Pair[] = [
  ["Country", "Philippines"],
  ["State/Province", "Metro Manila (NCR)"],
  ["City/Municipality", "Quezon City"],
];

const CONTACT: Pair[] = [
  ["Email Address 1", "dr.alvarez@email.com"],
  ["Email Address 2", "luna.nova@email.com"],
  ["Mobile Number 1", "+1-555-984-3485"],
  ["Mobile Number 2", "+1-555-349-2938"],
  ["Landline", "555-234-2345"],
];

const ADDRESS: Pair[] = [
  ["Country", "Philippines"],
  ["State/Province", "Metro Manila (NCR)"],
  ["City/Municipality", "Quezon City"],
  ["Barangay", "Bagong Pag-asa"],
  ["House No./Building/ Street", "Unit 23C, Sunrise Residences, Orion Street"],
  ["Zip Code", "4565"],
];

const OCCUPATION: Pair[] = [
  ["Selected Occupation", "Employed"],
  ["TIN Number", "6546465465465"],
];

const BUSINESS: Pair[] = [
  ["Employer/Practice/ Business Name", "Acme Holdings Inc."],
  ["Job Title", "Project Manager"],
  ["Industry/Sector", "Information Technology"],
  ["Base of Occupation", "Remote"],
  ["Employee Salary/ Income Bracket", "$80,000 - $100,000"],
  ["Length of Work (In year)", "2 years"],
  ["Level of Designation", "Associate"],
  ["Professional Practice", "Software Engineering"],
];

const OFFICE: Pair[] = [
  ["Country", "Philippines"],
  ["State/Province", "Metro Manila (NCR)"],
  ["City/Municipality", "Quezon City"],
  ["Barangay", "-"],
  ["No./Floor/Room", "-"],
  ["Street", "-"],
  ["Zip Code", "5656"],
  ["Office Contact Number", "+1 (555) 000-0000"],
];

const BUYER_PERSONAL: Pair[] = [
  ["Prefix", "Mr"],
  ["First Name", "JOHN"],
  ["Middle Name", "RANSON"],
  ["Last Name", "DOE"],
  ["Suffix", "Jr."],
  ["Date Of Birth", "08/12/1996"],
  ["Religion", "Roman Catholic"],
  ["Nationality", "Filipino"],
  ["Civil Status", "Married"],
  ["Citizenship", "American"],
  ["Gender", "Male"],
];

const SPOUSE_PERSONAL: Pair[] = [
  ["Prefix", "Ms."],
  ["First Name", "ARYA"],
  ["Middle Name", "SAMANTHA"],
  ["Last Name", "STARK"],
  ["Suffix", "III"],
  ["Date of Birth", "02/29/1992"],
  ["Religion", "Christian"],
  ["Nationality", "Filipino"],
  ["Citizenship", "American"],
  ["Gender", "Female"],
];

const COBUYER_PERSONAL: Pair[] = [
  ["Prefix", "Mr."],
  ["First Name", "JON"],
  ["Middle Name", "DAENERYS"],
  ["Last Name", "SNOW"],
  ["Suffix", "Sr."],
  ["Date of Birth", "03/15/1989"],
  ["Religion", "Christian"],
  ["Civil Status", "Married"],
  ["Nationality", "British"],
  ["Citizenship", "American"],
  ["Gender", "Male"],
];

const REP_PERSONAL: Pair[] = [
  ["Prefix", "Mr."],
  ["First Name", "JON"],
  ["Middle Name", "DAENERYS"],
  ["Last Name", "SNOW"],
  ["Suffix", "Sr."],
  ["Date of Birth", "03/15/1989"],
  ["Citizenship", "American"],
  ["Religion", "Christian"],
  ["Gender", "Male"],
  ["Civil Status", "Married"],
];

const PEP_PERSONAL: Pair[] = [
  ["Prefix", "Mr."],
  ["First Name", "JON"],
  ["Middle Name", "DAENERYS"],
  ["Last Name", "SNOW"],
  ["Suffix", "Sr."],
];

const PEP_POSITION: Pair[] = [
  ["Position/s Held", "Senior Government Official"],
  ["Specific Government Position", "-"],
  ["Time Period Held", "01/29/2025 - 05/29/2025"],
  ["In What Country Was The Position Held?", "Singapore"],
];

const PEP_CONNECTION: Pair[] = [
  ["Your Relationship to This Person", "Other"],
  ["Relationship Details", "I am the authorized representative and long-term business partner of the buyer."],
  ["Source of Funds for Property Acquisition", "Salary Income"],
  ["Source of Fund Details", "The purchase will be funded through personal savings and monthly salary income."],
];

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

/** Label above value, in a responsive grid. `wide` = one pair per row (long answers). */
function Pairs({ pairs, wide = false }: { pairs: Pair[]; wide?: boolean }) {
  return (
    <dl className={`m-0 grid gap-x-6 gap-y-4 ${wide ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]"}`}>
      {pairs.map(([label, value]) => (
        <div key={label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs leading-4 text-gray-500">{label}</dt>
          <dd className="m-0 min-w-0 break-words text-sm font-medium leading-5 text-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-0 border-t border-solid border-gray-100 pt-4">
      <h4 className="m-0 text-[13px] font-semibold leading-5 text-gray-900">{title}</h4>
      {children}
    </div>
  );
}

function MinorHeading({ children }: { children: ReactNode }) {
  return <h5 className="m-0 mt-1 text-xs font-semibold leading-4 text-gray-600">{children}</h5>;
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={"Edit " + label}
      onClick={onClick}
      className="ml-auto inline-flex h-8 flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-2.5 text-[13px] font-semibold text-brand-400 transition-colors hover:bg-[#F2F6FF]"
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
        <path d="M10.5 2.5 13.5 5.5 6 13H3v-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      Edit
    </button>
  );
}

/** One top-level section: title and Edit on one line, a thin line between sections, no box. */
function SectionCard({
  title,
  icon = false,
  onEdit,
  children,
}: {
  title: string;
  icon?: boolean;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-0 border-t border-solid border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2.5">
        {icon && <img src={coBuyerIconUrl} alt="" width={20} height={20} />}
        <h3 className="m-0 text-base font-semibold leading-6 tracking-[-0.01em] text-gray-900">{title}</h3>
        {onEdit && <EditButton label={title} onClick={onEdit} />}
      </div>
      {children}
    </section>
  );
}

/** Collapsible entry inside a section (co-buyer, PEP entry, representative), on a soft fill. */
function EntryCard({ title, onEdit, children }: { title?: string; onEdit?: () => void; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl bg-gray-50 px-3 md:px-5">
      {title && (
        <div className="flex items-center gap-2 py-3">
          <h4 className="m-0 text-sm font-semibold leading-5 text-gray-900">{title}</h4>
          {onEdit && <EditButton label={title} onClick={onEdit} />}
          <button
            type="button"
            aria-label={(open ? "Collapse " : "Expand ") + title}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`${onEdit ? "" : "ml-auto "}flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-gray-500 hover:bg-white`}
          >
            {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>
      )}
      {open && <div className={`flex flex-col gap-4 pb-4 ${title ? "" : "pt-4"} [&>div:first-child]:border-t-0 [&>div:first-child]:pt-0`}>{children}</div>}
    </div>
  );
}

/** Pairs on the left, document thumbnails in a narrow column on the right. */
function WithPhotos({ photos, children }: { photos: { label: string; src: string; alt: string }[]; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex flex-row gap-4 md:w-[144px] md:flex-col">
        {photos.map((photo) => (
          <figure key={photo.label} className="m-0 flex flex-col gap-2">
            <figcaption className="text-xs leading-4 text-gray-500">{photo.label}</figcaption>
            <img
              src={photo.src}
              alt={photo.alt}
              className="block h-[100px] w-[144px] rounded-lg object-cover ring-1 ring-black/5"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function SpouseBanner() {
  return (
    <h4 className="m-0 w-fit rounded-full bg-[#F4F3FF] px-2.5 py-0.5 text-xs font-semibold leading-5 text-[#6941C6]">
      Spouse information
    </h4>
  );
}

function OccupationBlock() {
  return (
    <SubSection title="Occupation Information">
      <Pairs pairs={OCCUPATION} />
      <MinorHeading>Business and Employment Information</MinorHeading>
      <Pairs pairs={BUSINESS} />
      <MinorHeading>Office Address Information</MinorHeading>
      <Pairs pairs={OFFICE} />
    </SubSection>
  );
}

function SpouseBlock() {
  return (
    <>
      <SpouseBanner />
      <SubSection title="Personal Details">
        <WithPhotos photos={[{ label: "Spouse ID:", src: reviewSamplePassportUrl, alt: "Spouse's uploaded ID" }]}>
          <Pairs pairs={SPOUSE_PERSONAL} />
        </WithPhotos>
      </SubSection>
      <SubSection title="Birth Place Information">
        <Pairs pairs={BIRTH_PLACE} />
      </SubSection>
      <SubSection title="Contact Information">
        <Pairs pairs={CONTACT} />
      </SubSection>
      <OccupationBlock />
    </>
  );
}

function ReadOnlyCheck({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-start gap-2.5 text-sm font-medium leading-5 text-gray-800">
      <span className="pt-0.5">
        <Checkbox checked readOnly disabled aria-label={typeof children === "string" ? children : undefined} />
      </span>
      {children}
    </span>
  );
}

/** Agreement preview that shows the first few lines until "See More". */
function AgreementPreview({ title, agreement, children }: { title: string; agreement: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="flex flex-col gap-3 border-0 border-t border-solid border-gray-100 pt-6">
      <h3 className="m-0 text-base font-semibold leading-6 tracking-[-0.01em] text-gray-900">{title}</h3>
      <div
        className={`relative text-sm leading-6 text-gray-700 ${expanded ? "" : "max-h-[112px] overflow-hidden"}`}
      >
        {children}
        {!expanded && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </div>
      <ReadOnlyCheck>{agreement}</ReadOnlyCheck>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
        className="w-fit cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand-400 hover:underline"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Step                                                                */
/* ------------------------------------------------------------------ */

export default function ReviewStepV3({
  onEdit,
  onReadyChange,
}: {
  /** Jump back to a step (1–7) to change its answers. */
  onEdit: (step: number) => void;
  /** Fires with true once the final confirmation is ticked — gates Submit. */
  onReadyChange?: (ready: boolean) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    onReadyChange?.(confirmed);
  }, [confirmed, onReadyChange]);

  return (
    <section className="antialiased w-full md:max-h-full rd-v3 bg-white rounded-none md:rounded-2xl flex flex-col md:border-[1.5px] md:border-solid md:border-brand-400 md:shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <StepHeaderV3 step={8} title="Review & Submit" className="px-4 md:px-8 pt-4 pb-4 md:pt-5 md:pb-5">
        Review the details below to ensure they are correct and up to date before submission.
      </StepHeaderV3>

      {/* Only the card body scrolls; the title stays put. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [scrollbar-gutter:stable]">
      <div className="px-4 md:pl-8 md:pr-6 pb-6 pt-1 flex flex-col gap-6">
        <SectionCard title="Buyer & Property Information" onEdit={() => onEdit(1)}>
          <Pairs pairs={BUYER_PROPERTY} />
        </SectionCard>

        <SectionCard title="Client/Company Representative" onEdit={() => onEdit(2)}>
          <SubSection title="Personal Details">
            <WithPhotos
              photos={[
                { label: "ID:", src: reviewSampleIdUrl, alt: "Your uploaded government ID" },
                { label: "Selfie:", src: reviewSampleSelfieUrl, alt: "Your live selfie" },
              ]}
            >
              <div className="flex flex-col gap-3">
                <Pairs
                  wide
                  pairs={[
                    [
                      "Account Type",
                      <>
                        <b className="font-semibold">Private Individual (Adult)</b>
                        <span className="block font-normal text-gray-600">
                          I am a private individual OR a representative of a private partnership.
                        </span>
                      </>,
                    ],
                  ]}
                />
                <Pairs pairs={BUYER_PERSONAL} />
              </div>
            </WithPhotos>
          </SubSection>
          <SubSection title="Birth Place Information">
            <Pairs pairs={BIRTH_PLACE} />
          </SubSection>
          <SubSection title="Contact Information">
            <Pairs pairs={CONTACT} />
          </SubSection>
          <SubSection title="Present Address">
            <Pairs pairs={ADDRESS} />
          </SubSection>
          <SubSection title="Home Address">
            <Pairs pairs={ADDRESS} />
          </SubSection>
          <SubSection title="Home Ownership">
            <Pairs
              pairs={[
                ["Ownership Category", "Owned"],
                ["Length of Stay (In Year)", "1 year"],
              ]}
            />
          </SubSection>
          <OccupationBlock />
          <SubSection title="Preferred Mailing Address">
            <Pairs
              pairs={[
                ["Preferred Mailing Address Source", "Primary Buyer"],
                ["Preferred Mailing Address", "Home address"],
                ["Preferred Mailing Method", "Courier"],
              ]}
            />
            <Pairs
              wide
              pairs={[
                [
                  "Special Mailing Instruction",
                  "Please send your correspondence to the following address: 123 Maple Street, Quezon City, Philippines.",
                ],
              ]}
            />
          </SubSection>
          <SubSection title="Reason for Buying">
            <Pairs
              wide
              pairs={[
                [
                  "Chosen option",
                  <span className="flex flex-wrap gap-2">
                    {["Upgrade", "Relocate", "Other"].map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium leading-[18px] text-gray-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </span>,
                ],
                [
                  "Buying Reason",
                  "I am interested in purchasing this item because it meets my needs for quality and functionality.",
                ],
              ]}
            />
          </SubSection>
          <SubSection title="Source of Awareness">
            <Pairs
              wide
              pairs={[
                [
                  "Chosen option",
                  <span className="flex flex-col gap-2">
                    {["Other Sources (Social media)", "Referral: Homeowner", "Other Sources"].map((source) => (
                      <ReadOnlyCheck key={source}>{source}</ReadOnlyCheck>
                    ))}
                  </span>,
                ],
              ]}
            />
          </SubSection>
          <hr className="m-0 border-0 border-t border-solid border-gray-100" />
          <SpouseBlock />
        </SectionCard>

        <SectionCard title="Co-Buyer Information" icon>
          <EntryCard title="Co-Buyer #1" onEdit={() => onEdit(2)}>
            <SubSection title="Personal Details">
              <WithPhotos photos={[{ label: "Co-Buyer #1 ID:", src: reviewSamplePassportUrl, alt: "Co-buyer's uploaded ID" }]}>
                <Pairs pairs={COBUYER_PERSONAL} />
              </WithPhotos>
            </SubSection>
            <SubSection title="Birth Place Information">
              <Pairs pairs={BIRTH_PLACE} />
            </SubSection>
            <SubSection title="Contact Information">
              <Pairs pairs={CONTACT} />
            </SubSection>
            <SubSection title="Present Address">
              <Pairs pairs={ADDRESS} />
            </SubSection>
            <SubSection title="Home Address">
              <Pairs pairs={ADDRESS} />
            </SubSection>
            <OccupationBlock />
            <hr className="m-0 border-0 border-t border-solid border-gray-100" />
            <SpouseBlock />
          </EntryCard>
        </SectionCard>

        <SectionCard title="Representative Information" icon onEdit={() => onEdit(2)}>
          <EntryCard>
            <Pairs wide pairs={[["Type of Representative", "Attorney-in-Fact"]]} />
            <SubSection title="Personal Details">
              <Pairs pairs={REP_PERSONAL} />
            </SubSection>
            <SubSection title="Birth Place Information">
              <Pairs pairs={BIRTH_PLACE} />
            </SubSection>
            <SubSection title="Contact Information">
              <Pairs pairs={CONTACT} />
            </SubSection>
            <SubSection title="Present Address">
              <Pairs pairs={ADDRESS} />
            </SubSection>
            <SubSection title="Home Address">
              <Pairs pairs={ADDRESS} />
            </SubSection>
            <SubSection title="Relationship with Buyer">
              <Pairs
                wide
                pairs={[
                  ["Name Of Relationship", "Other"],
                  ["Details", "I am a relative of the buyer and am assisting with the transaction and documentation."],
                ]}
              />
            </SubSection>
          </EntryCard>
        </SectionCard>

        <SectionCard title="Politically Exposed Person (PEP) Details" icon>
          <EntryCard title="PEP Entry #1" onEdit={() => onEdit(2)}>
            <SubSection title="Personal Details">
              <Pairs pairs={PEP_PERSONAL} />
            </SubSection>
            <SubSection title="Government Position Details">
              <Pairs pairs={PEP_POSITION} />
            </SubSection>
            <SubSection title="Your Connection & Funding Source">
              <Pairs wide pairs={PEP_CONNECTION} />
            </SubSection>
          </EntryCard>
        </SectionCard>

        <AgreementPreview title="Terms and Condition" agreement={TERMS_AGREEMENTS[0]}>
          <TermsAgreementText />
        </AgreementPreview>

        <AgreementPreview title="Data Privacy Policy" agreement={PRIVACY_AGREEMENT}>
          <PrivacyPolicyText />
        </AgreementPreview>

        <section className="flex flex-col gap-3 border-0 border-t border-solid border-gray-100 pt-6">
          <h3 className="m-0 text-base font-semibold leading-6 tracking-[-0.01em] text-gray-900">
            Customer Acceptance Policy &amp; Client Consent
          </h3>
          <div className="text-sm leading-6 text-gray-700">
            <ConsentPolicyText />
          </div>
          <div className="flex flex-col gap-3">
            {CONSENTS.map((consent) => (
              <ReadOnlyCheck key={consent}>{consent}</ReadOnlyCheck>
            ))}
          </div>
        </section>

      </div>
      </div>

      {/* Final confirmation: always in view, like the agreements on Terms and Data privacy. */}
      <div className="flex-shrink-0 border-0 border-t border-solid border-gray-100 px-4 py-4 md:px-8">
        <label className="flex cursor-pointer items-center gap-3 py-0.5">
          <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span className="text-sm font-medium leading-5 text-gray-900">
            I confirm that all information provided is accurate and complete to the best of my knowledge.
          </span>
        </label>
      </div>
    </section>
  );
}
