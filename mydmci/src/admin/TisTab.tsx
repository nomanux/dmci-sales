import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import Badge from "./Badge";
import type { RtoApplicationDetails } from "./rtoData";
import arrowSquareRight from "@/assets/arrow-square-right.svg";
import sampleIdPhoto from "@/assets/dummyid.png";
import users02 from "../assets/icons/users-02.svg";
import chevronDown from "../assets/icons/chevron-down.svg";

/**
 * TIS tab on the TIS details page (read-only preview of the submitted TIS).
 * Figma: DMCI-SID-Portal, "RTO Application / Application details / TIS"
 * 163989:123417.
 *
 * Values are the design's sample data, except TIS ID, customer name and the
 * D365 sync status, which come from the application.
 */

export type Pair = [label: string, value: ReactNode];

/* ---------- building blocks ---------- */

/** "Label : value" row (Figma "preview information"). */
export function Row({ label, value, labelWidth = "w-40" }: { label: string; value: ReactNode; labelWidth?: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2 py-0.5 text-sm leading-5">
      <dt className={`shrink-0 font-semibold text-[#6b7280] ${labelWidth}`}>{label}</dt>
      <span aria-hidden className="shrink-0 font-semibold text-[#6b7280]">
        :
      </span>
      <dd className="m-0 min-w-0 flex-1 break-words text-[#111827]">{value}</dd>
    </div>
  );
}

export type Photo = { label: string; src?: string };

/** Two-column grid of rows, with optional photos (ID, selfie) on the right. */
export function Rows({ pairs, id, photos }: { pairs: Pair[]; id?: Photo; photos?: Photo[] }) {
  const shown = photos ?? (id ? [id] : []);
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <dl className="m-0 grid min-w-0 flex-1 grid-cols-1 content-start gap-x-4 gap-y-2 md:grid-cols-2 xl:max-w-[784px]">
        {pairs.map(([label, value], i) =>
          // An empty label leaves its grid cell blank (keeps the next pair on a new row).
          label ? <Row key={label + i} label={label} value={value} /> : <div key={i} aria-hidden className="hidden md:block" />,
        )}
      </dl>
      {shown.length > 0 && (
        <div className="flex shrink-0 flex-row gap-4 md:ml-auto md:flex-col">
          {shown.map((p) => (
            <figure key={p.label} className="m-0 flex flex-col gap-2">
              <figcaption className="text-sm font-semibold leading-5 text-[#6b7280]">{p.label}</figcaption>
              <div className="flex h-[100px] w-36 items-center overflow-hidden border-[0.75px] border-solid border-[#e5e7eb] bg-white px-1.5 py-1">
                <img
                  src={p.src ?? sampleIdPhoto}
                  alt={p.label.replace(/:$/, "")}
                  className={`block w-full object-cover ${p.src ? "h-full" : "aspect-[1092/705]"}`}
                />
              </div>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

/** Sub-section with the arrow-square icon (Figma "Step Number" Variant3). */
export function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="m-0 flex items-center gap-3 text-lg font-semibold leading-7 text-[#07389d]">
        <img src={arrowSquareRight} alt="" width={24} height={24} className="block size-6 shrink-0" />
        {title}
      </h4>
      {children}
    </section>
  );
}

/** Small brand-coloured label above a block of rows. */
export function MiniHeading({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <p className={`m-0 mt-2 text-sm leading-5 ${strong ? "font-semibold text-[#1448b3]" : "font-medium text-[#07389d]"}`}>
      {children}
    </p>
  );
}

/** Grey card holding one part of the TIS. */
export function Part({ title, icon, children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-solid border-[#e5e7eb] bg-[#f9fafb] p-5">
      <h3
        className={`m-0 flex items-center gap-3 font-semibold text-[#07389d] ${icon ? "text-lg leading-7" : "text-xl leading-[30px]"}`}
      >
        {icon && <img src={icon} alt="" width={24} height={24} className="block size-6 shrink-0" />}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Divider() {
  return <hr className="m-0 h-px border-0 bg-[#e5e7eb]" />;
}

/* ---------- sample person data (from the design) ---------- */

export type Person = {
  personal: Pair[];
  birth: Pair[];
  contact: Pair[];
  present?: Pair[];
  home?: Pair[];
};

export const BIRTH: Pair[] = [
  ["Country", "Philippines"],
  ["State/Province", "Metro Manila (NCR)"],
  ["City/Municipality", "Quezon Paoloo"],
];
export const CONTACT: Pair[] = [
  ["Email Address 1", "dr.alvarez@email.com"],
  ["Email Address 2", "luna.nova@email.com"],
  ["Mobile Number 1", "+1-555-984-3485"],
  ["Mobile Number 2", "+1-555-349-2938"],
  ["Landline", "555-234-2345"],
];
export const address = (street: string): Pair[] => [
  ["Country", "Philippines"],
  ["State/Province", "Metro Manila (NCR)"],
  ["City/Municipality", "Quezon Paoloo"],
  ["Barangay", "Filipino"],
  ["House No./Building/ Street", street],
  ["Zip Code", "4565"],
];

export const LESSEE: Person = {
  personal: [
    ["Prefix", "Mr"],
    ["First Name", "JOHN"],
    ["Middle Name", "RANSON"],
    ["Last Name", "DOE"],
    ["Suffix", "Jr."],
    ["Date Of Birth", "08/12/1996"],
    ["Religion", "Filipino"],
    ["Nationality", "Filipino"],
    ["Civil Status", "Single"],
    ["Citizenship", "American"],
    ["Gender", "Female"],
  ],
  birth: BIRTH,
  contact: CONTACT,
  present: address("Quezon Paoloo"),
  home: address("-"),
};

export const SPOUSE: Person = {
  personal: [
    ["Prefix", "Ms."],
    ["First Name", "ARYA"],
    ["Middle Name", "SAMANTHA"],
    ["Last Name", "STARK"],
    ["Suffix", "III"],
    ["Date of Birth", "02/29/1992"],
    ["Religion", "Cristian"],
    ["Nationality", "Philipino"],
    ["Citizenship", "American"],
    ["Gender", "Female"],
  ],
  birth: BIRTH,
  contact: CONTACT,
};

export const CO_LESSEE: Person = {
  personal: [
    ["Prefix", "Mr."],
    ["First Name", "JON"],
    ["Middle Name", "DAENERYS"],
    ["Last Name", "SNOW"],
    ["Suffix", "Sr."],
    ["Date of Birth", "03/15/1989"],
    ["Religion", "Targaryen"],
    ["Civil Status", "Single"],
    ["Nationality", "British"],
    ["Citizenship", "American"],
    ["Gender", "Male"],
  ],
  birth: BIRTH,
  contact: CONTACT,
  present: address("Unit 23C, Sunrise Residences, Orion Street"),
  home: address("Unit 23C, Sunrise Residences, Orion Street"),
};

export function Occupation() {
  return (
    <Sub title="Occupation Information">
      <Rows
        pairs={[
          ["Selected Occupation", "Test Value"],
          ["TIN Number", "6546465465465"],
        ]}
      />
      <MiniHeading>Business and Employment Information</MiniHeading>
      <Rows
        pairs={[
          ["Employer/Practice/ Business Name", "Philippines"],
          ["Job Title", "Metro Manila (NCR)"],
          ["Industry/Sector", "Information Technology"],
          ["Base of Occupation", "Remote"],
          ["Employee Salary/ Income Bracket", "$80,000 - $100,000"],
          ["Length of Work (In year)", "2 years"],
          ["Level of Designation", "Associate"],
          ["Professional Practice", "Quezon Paoloo"],
        ]}
      />
      <MiniHeading>Office Address Information</MiniHeading>
      <Rows
        pairs={[
          ["Country", "Philippines"],
          ["State/Province", "Metro Manila (NCR)"],
          ["City/Municipality", "Quezon Paoloo"],
          ["Barangay", "-"],
          ["No./Floor/Room", "-"],
          ["Street", "-"],
          ["Zip Code", "5656"],
          ["Office Contact Number", "+1 (555) 000-0000"],
        ]}
      />
    </Sub>
  );
}

/** Personal, birth place, contact, addresses and occupation for one person. */
export function PersonBlocks({ person, idLabel, photos }: { person: Person; idLabel: string; photos?: Photo[] }) {
  return (
    <>
      <Sub title="Personal Details">
        <Rows pairs={person.personal} photos={photos ?? [{ label: idLabel }]} />
      </Sub>
      <Sub title="Birth Place Information">
        <Rows pairs={person.birth} />
      </Sub>
      <Sub title="Contact Information">
        <Rows pairs={person.contact} />
      </Sub>
      {person.present && (
        <Sub title="Present Address">
          <Rows pairs={person.present} />
        </Sub>
      )}
      {person.home && (
        <Sub title="Home Address">
          <Rows pairs={person.home} />
        </Sub>
      )}
    </>
  );
}

export function HomeOwnership() {
  return (
    <Sub title="Home Ownership">
      <Rows
        pairs={[
          ["Ownership Category", "Philippines"],
          ["Length of Stay (In Year)", "1 year"],
        ]}
      />
    </Sub>
  );
}

export function MailingAddress() {
  return (
    <Sub title="Preferred Mailing Address">
      <Rows
        pairs={[
          ["Preferred Mailing Address Source", "Primary Buyer"],
          ["", ""],
          ["Preferred Mailing Address", "Home address"],
          ["Preferred Mailing Method", "Philippines"],
        ]}
      />
      <dl className="m-0">
        <Row
          label="Special Mailing Instruction"
          value="Please send your correspondence to the following address: 123 Maple Street, Quezon Paoloo, Philippines."
        />
      </dl>
    </Sub>
  );
}

export function SpouseBlock() {
  return (
    <>
      <Divider />
      <h4 className="m-0 rounded-md bg-[#d4e1fc] px-2 py-1 text-xl font-semibold leading-[30px] text-[#07389d]">
        Spouse information
      </h4>
      <PersonBlocks person={SPOUSE} idLabel="Spouse ID:" />
      <Occupation />
    </>
  );
}

/* ---------- parts ---------- */

function PrivacyPart() {
  const [open, setOpen] = useState(false);
  return (
    <Part title="Privacy Policy & Identity Verification">
      <div className="flex flex-col items-start gap-4">
        <h4 className="m-0 text-base font-semibold leading-7 text-[#111827]">DMCI Homes Privacy Policy</h4>
        <div
          id="tis-privacy-text"
          className={`flex flex-col gap-4 overflow-hidden text-base leading-6 text-[#4b5563] ${open ? "" : "max-h-[138px]"}`}
        >
          <p className="m-0">
            We, DMCI Project Developers, Inc. (the "Company"), together with its subsidiaries, special projects and
            business units, highly value the confidentiality of information you have entrusted us. We highly regard your
            personal, sensitive and privileged information such that it will only be used for its intended purpose (or as
            may be required by existing national and local laws, rules and regulations), kept within the agreed period and
            protected against data privacy breach.
          </p>
          <p className="m-0">
            Any personal, sensitive and privileged information that you provide shall be kept safe under the Data Privacy
            Act of 2012 (the "Act"), applicable laws of the Philippines and the Company's very own commitment through its
            Data Privacy Policy.
          </p>
          <p className="m-0">
            Personal, sensitive and privileged information that you provide shall be used for transactions related to the
            sale of the Company's products and all matters arising out of the said transaction. Information collected by
            the Company shall be considered accurate unless the Client/Potential Client requests for update. It shall
            never be the responsibility of the Company to ensure validity/accuracy of information shared by the
            Client/Potential Client.
          </p>
          <p className="m-0">
            Under the Data Privacy Act of 2012, you have the right to access, modify, erase and/or object to any
            processing of personal, sensitive or privileged data that you have provided to us. To do so, kindly contact
            our Data Protection Officer with the following information:
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="tis-privacy-text"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold leading-5 text-[#052b78] hover:underline"
        >
          {open ? "See less" : "See more"}
        </button>
      </div>
    </Part>
  );
}

function LesseePart() {
  return (
    <Part title="Lessee Personal Data and Contact">
      <PersonBlocks person={LESSEE} idLabel="ID:" />
      <HomeOwnership />
      <Occupation />
      <MailingAddress />
      <SpouseBlock />
    </Part>
  );
}

/** White card that opens and closes (co-lessee, co-buyer, PEP entries). */
export function Collapsible({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col rounded-xl border border-solid border-[#e5e7eb] bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl border-0 bg-transparent px-5 py-4 text-left"
      >
        <span className="flex-1 text-base font-semibold leading-6 text-[#07389d]">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex p-2">
          <img src={chevronDown} alt="" width={20} height={20} className="block size-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-5 flex flex-col gap-8 border-0 border-t border-solid border-[#e5e7eb] pb-4 pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoLesseePart() {
  return (
    <Part title="Co-lessee Information" icon={users02}>
      <Collapsible title="Co-lessee #1">
        <PersonBlocks person={CO_LESSEE} idLabel="Co-lessee #1 ID:" />
        <Occupation />
        <SpouseBlock />
      </Collapsible>
    </Part>
  );
}

export function Entries({ prefix, entries }: { prefix: string; entries: Pair[][] }) {
  return (
    <div className="flex flex-col gap-4">
      {entries.map((pairs, i) => (
        <div key={i} className="flex flex-col gap-1">
          <MiniHeading strong>
            {prefix} #{i + 1}
          </MiniHeading>
          <dl className="m-0 grid grid-cols-1 gap-2 md:grid-cols-3 xl:max-w-[904px]">
            {pairs.map(([label, value]) => (
              <Row key={label} label={label} value={value} labelWidth="min-w-[100px] whitespace-nowrap" />
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function HouseholdPart() {
  const occupant: Pair[] = [
    ["Full Name", "Ranson"],
    ["Relationship", "Cousin"],
    ["Age", "25"],
  ];
  return (
    <Part title="Household and vehicles">
      <Sub title="Occupants and Pets">
        <Entries prefix="Occupant Entry" entries={[occupant, occupant, occupant]} />
      </Sub>
      <Sub title="Pets Information">
        <dl className="m-0 grid grid-cols-1 gap-2 md:grid-cols-2 xl:max-w-[784px]">
          <Row label="Breed" value="Shih Tzu" />
          <Row label="Number Of Pets" value="1" />
        </dl>
      </Sub>
      <Sub title="Domestic Helper / Driver">
        <Entries
          prefix="Entry"
          entries={[
            [
              ["Position Name", "Domestic Helper"],
              ["Stays In", "Yes"],
            ],
            [
              ["Position Name", "Driver"],
              ["Stays In", "No"],
            ],
          ]}
        />
      </Sub>
      <Sub title="Vehicles">
        <dl className="m-0 grid grid-cols-1 gap-2 md:grid-cols-3 xl:max-w-[904px]">
          <Row label="Total Count" value="2" labelWidth="w-[100px]" />
          <Row label="Plate Numbers" value="ABC 1234, XYZ 5678" labelWidth="w-[100px]" />
        </dl>
      </Sub>
      <Sub title="Emergency Contact">
        <Entries
          prefix="Contact"
          entries={[
            [
              ["Full Name", "Ranson"],
              ["Relationship", "Cousin"],
              ["Contact Number", "+63 222 333 555"],
            ],
            [
              ["Full Name", "Jeorge"],
              ["Relationship", "Father"],
              ["Contact Number", "+63 222 333 555"],
            ],
          ]}
        />
      </Sub>
    </Part>
  );
}

/* ---------- tab ---------- */

export default function TisTab({ app }: { app: RtoApplicationDetails }) {
  const summary: Pair[] = [
    ["TIS ID", app.tisNo],
    ["Entity", "-"],
    ["Customer Account Number", "-"],
    ["Customer Name", app.client],
    ["Agent Code", "-"],
    ["Agent Name", "-"],
    ["Synced to D365 F&O", <Badge key="sync">{app.sync}</Badge>],
    ["Submitted At", "Feb 5, 2026 4:13 PM"],
  ];

  return (
    <div className="flex flex-col gap-8 p-5">
      {/* Summary */}
      <dl className="m-0 flex flex-col gap-1.5 rounded-xl border border-solid border-[#e5e7eb] bg-white p-5">
        {summary.map(([label, value]) => (
          <Row key={label} label={label} value={value} labelWidth="w-[200px]" />
        ))}
      </dl>

      {/* TIS Details */}
      <section className="flex flex-col rounded-xl border border-solid border-[#e5e7eb] bg-white">
        <h2 className="m-0 border-0 border-b border-solid border-[#e5e7eb] px-5 py-2.5 text-base font-semibold leading-6 text-[#374151]">
          TIS Details
        </h2>
        <div className="flex flex-col gap-8 p-5">
          <PrivacyPart />
          <LesseePart />
          <CoLesseePart />
          <HouseholdPart />
        </div>
      </section>
    </div>
  );
}
