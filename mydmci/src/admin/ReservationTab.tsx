import { useState, type ReactNode } from "react";
import { CheckIcon } from "@/icons";
import { AGREEMENTS as TERMS_AGREEMENTS, TermsAgreementText } from "@/TermsStep";
import { PRIVACY_AGREEMENT, PrivacyPolicyText } from "@/DataPrivacyStep";
import { CONSENTS, ConsentPolicyText } from "@/ConsentStep";
import sampleSelfie from "@/assets/review-sample-selfie.png";
import users02 from "../assets/icons/users-02.svg";
import {
  BIRTH,
  CONTACT,
  CO_LESSEE,
  Collapsible,
  HomeOwnership,
  LESSEE,
  MailingAddress,
  Occupation,
  Part,
  PersonBlocks,
  Row,
  Rows,
  SpouseBlock,
  Sub,
  address,
  type Pair,
  type Person,
} from "./TisTab";

/**
 * Reservation tab on the TIS details page: the submitted Reservation
 * Agreement, read-only.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details /
 * Reservation" 163989:128939.
 *
 * Person blocks are shared with the TIS tab. Terms, data privacy and consent
 * text come from the sales RA form so the wording stays in one place.
 * Values are the design's sample data.
 */

/** Ticked, read-only checkbox with its label. */
function Ticked({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <p className={`m-0 flex items-start gap-2 text-sm font-medium leading-5 ${muted ? "text-[#4b5563]" : "text-[#374151]"}`}>
      <span
        aria-hidden
        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-solid bg-[#fafafa] text-[#9ca3af] ${
          muted ? "border-[#9ca3af]" : "border-[#d1d5db]"
        }`}
      >
        <CheckIcon className="size-3" />
      </span>
      <span>
        <span className="sr-only">Agreed: </span>
        {children}
      </span>
    </p>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-solid border-[#d1d5db] bg-white px-2 py-[3px] text-xs font-medium leading-[18px] text-[#111827]">
      {children}
    </span>
  );
}

function SeeMore({ open, onToggle, controls }: { open: boolean; onToggle: () => void; controls: string }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      className="cursor-pointer self-start border-0 bg-transparent p-0 text-sm font-semibold leading-5 text-[#052b78] hover:underline"
    >
      {open ? "See Less" : "See More"}
    </button>
  );
}

/* ---------- sample data (from the design) ---------- */

const RESERVATION: Pair[] = [
  ["Date of Reservation", "08/12/1996"],
  ["", ""],
  ["Property Name", "SON-00A-C-02008"],
  ["Unit / Lot No./ Parking Slot No.", "Doe"],
  ["Unit Category", "Condo unit"],
  ["Building Name", "Sample Building Name"],
  ["Area (M2)", "1200"],
  ["Account Type", "RTO"],
  ["Primary Agent", "Juan Dela Cruz"],
  ["Reserved Property", "Alta Vista De Boracay"],
  ["List Price (Php)", "6,500,000"],
  ["Payment Details", "Maya"],
  ["Mode Of Payment", "Cash"],
];

const REPRESENTATIVE: Person = {
  personal: [
    ["Prefix", "Mr."],
    ["First Name", "JON"],
    ["Middle Name", "DAENERYS"],
    ["Last Name", "SNOW"],
    ["Suffix", "Sr."],
    ["Date of Birth", "03/15/1989"],
    ["Citizenship", "American"],
    ["Religion", "Targaryen"],
    ["Gender", "Male"],
    ["Civil Status", "Married"],
  ],
  birth: BIRTH,
  contact: CONTACT,
  present: address("Quezon Paoloo"),
  home: address("-"),
};

/* ---------- parts ---------- */

function ReservationDetailsPart() {
  return (
    <Part title="Reservation Details">
      <Rows pairs={RESERVATION} />
    </Part>
  );
}

function ClientPart() {
  return (
    <Part title="Client/Company Representative">
      <PersonBlocks
        person={LESSEE}
        idLabel="ID:"
        photos={[{ label: "ID:" }, { label: "Selfie:", src: sampleSelfie }]}
      />
      <HomeOwnership />
      <Occupation />
      <MailingAddress />
      <Sub title="Reason for Buying">
        <dl className="m-0 flex flex-col gap-2">
          <Row
            label="Chosen option"
            value={
              <span className="flex flex-wrap gap-2">
                <Tag>Upgrade</Tag>
                <Tag>Relocate</Tag>
                <Tag>Other</Tag>
              </span>
            }
          />
          <Row
            label="Buying Reason"
            value="I am interested in purchasing this item because it meets my needs for quality and functionality."
          />
        </dl>
      </Sub>
      <Sub title="Source of Awareness">
        <dl className="m-0">
          <Row
            label="Chosen option"
            value={
              <span className="flex flex-col gap-2">
                <Ticked>Other Sources (Social media)</Ticked>
                <Ticked>Referral: Homeowner</Ticked>
                <Ticked>Other Sources</Ticked>
              </span>
            }
          />
        </dl>
      </Sub>
      <SpouseBlock />
    </Part>
  );
}

function CoBuyerPart() {
  return (
    <Part title="Co-Buyer Information" icon={users02}>
      <Collapsible title="Co-Buyer #1">
        <PersonBlocks person={CO_LESSEE} idLabel="Co-Buyer #1 ID:" />
        <Occupation />
        <SpouseBlock />
      </Collapsible>
    </Part>
  );
}

function RepresentativePart() {
  return (
    <Part title="Representative Information" icon={users02}>
      <div className="flex flex-col gap-8 rounded-xl border border-solid border-[#e5e7eb] bg-white p-5">
        <dl className="m-0">
          <Row label="Type of Representative" value="-" />
        </dl>
        <PersonBlocks person={REPRESENTATIVE} idLabel="" photos={[]} />
        <Sub title="Relationship with Buyer">
          <dl className="m-0 flex flex-col gap-2">
            <Row label="Name Of Relationship" value="Other" />
            <Row label="Details" value="I am a relative of the buyer and am assisting with the transaction and documentation." />
          </dl>
        </Sub>
      </div>
    </Part>
  );
}

function PepPart() {
  return (
    <Part title="Politically Exposed Person (PEP) Details" icon={users02}>
      <Collapsible title="PEP Entry #1">
        <Sub title="Personal Details">
          <Rows
            pairs={[
              ["Prefix", "Mr."],
              ["First Name", "JON"],
              ["Middle Name", "DAENERYS"],
              ["Last Name", "SNOW"],
              ["Suffix", "Sr."],
            ]}
          />
        </Sub>
        <Sub title="Government Position Details">
          <Rows
            pairs={[
              ["Specific Government Position/S Held", "Philippines"],
              ["Specific Government Position", "-"],
              ["Time Period Held", "01/29/2025 - 05/29/2025"],
              ["In What Country Was The Position Held?", "Singapore"],
            ]}
          />
        </Sub>
        <Sub title="Your Connection & Funding Source">
          <dl className="m-0 flex flex-col gap-2">
            <Row label="Your Relationship to This Person" value="Other" />
            <Row
              label="Relationship Details"
              value="I am the authorized representative and long-term business partner of the buyer."
            />
            <Row label="Source of Funds for Property Acquisition" value="Salary Income" />
            <Row
              label="Source of Fund Details"
              value="The purchase will be funded through personal savings and monthly salary income."
            />
          </dl>
        </Sub>
      </Collapsible>
    </Part>
  );
}

function TermsPart() {
  return (
    <Part title="Terms and Condition">
      <ClippedWithAgreement id="res-terms-text" height="max-h-[275px]" agreements={[TERMS_AGREEMENTS[0]]}>
        <TermsAgreementText />
      </ClippedWithAgreement>
    </Part>
  );
}

/** Clipped text, the ticked agreement(s), then See More (design order). */
function ClippedWithAgreement({
  id,
  height,
  agreements,
  children,
}: {
  id: string;
  height: string;
  agreements: string[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div id={id} className={`overflow-hidden text-base leading-6 text-[#4b5563] ${open ? "" : height}`}>
        {children}
      </div>
      <div className="flex flex-col gap-4 pt-4">
        {agreements.map((a) => (
          <Ticked key={a}>{a}</Ticked>
        ))}
      </div>
      <SeeMore open={open} onToggle={() => setOpen((v) => !v)} controls={id} />
    </div>
  );
}

function PrivacyPart() {
  return (
    <Part title="Data Privacy Policy">
      <ClippedWithAgreement id="res-privacy-text" height="max-h-[170px]" agreements={[PRIVACY_AGREEMENT]}>
        {/* The design has no inner heading here; the card title already says it. */}
        <div className="[&_h2]:hidden">
          <PrivacyPolicyText />
        </div>
      </ClippedWithAgreement>
    </Part>
  );
}

function ConsentPart() {
  return (
    <Part title="Customer Acceptance Policy & Client Consent">
      <div className="flex flex-col gap-8">
        <div className="text-base leading-6 text-[#4b5563]">
          <ConsentPolicyText />
        </div>
        <div className="flex flex-col gap-4">
          {CONSENTS.map((c) => (
            <Ticked key={c}>{c}</Ticked>
          ))}
        </div>
      </div>
    </Part>
  );
}

/* ---------- tab ---------- */

export default function ReservationTab() {
  return (
    <div className="p-5">
      <section className="flex flex-col rounded-xl border border-solid border-[#e5e7eb] bg-white">
        <h2 className="m-0 border-0 border-b border-solid border-[#e5e7eb] px-5 py-2.5 text-base font-semibold leading-6 text-[#374151]">
          Reservation Details
        </h2>
        <div className="flex flex-col gap-8 p-5">
          <ReservationDetailsPart />
          <ClientPart />
          <CoBuyerPart />
          <RepresentativePart />
          <PepPart />
          <TermsPart />
          <PrivacyPart />
          <ConsentPart />
          <div className="px-1 py-2">
            <Ticked muted>I confirm that all information provided is accurate and complete to the best of my knowledge.</Ticked>
          </div>
        </div>
      </section>
    </div>
  );
}

