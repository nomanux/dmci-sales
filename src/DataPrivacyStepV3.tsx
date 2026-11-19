// RA form v3 copy of DataPrivacyStep.tsx: StepHeaderV3 banner, focused card and compact fields. The original stays as v1/v2 use it.
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import Checkbox from "./Checkbox";
import StepHeaderV3 from "./StepHeaderV3";
import "./RepresentativeDetailsStepV3.css";
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

export default function DataPrivacyStepV3({
  onReadyChange,
}: {
  /** Fires with true once the policy checkbox is ticked — gates the shell's Next button. */
  onReadyChange?: (ready: boolean) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("overview");
  const scrollRef = useRef<HTMLDivElement>(null);
  const idp = useId().replace(/:/g, "");

  useEffect(() => {
    onReadyChange?.(agreed);
  }, [agreed, onReadyChange]);

  // Reading progress + which section is on screen (scroll spy).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1);
      const secs = el.querySelectorAll<HTMLElement>("[data-policy-sec]");
      const top = el.getBoundingClientRect().top + 72;
      let cur = "overview";
      secs.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= top) cur = sec.dataset.policySec ?? cur;
      });
      if (max > 0 && el.scrollTop >= max - 4) cur = POLICY_SECTIONS[POLICY_SECTIONS.length - 1].id;
      setActive(cur);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jump = (id: string) => {
    const el = scrollRef.current;
    const sec = el?.querySelector<HTMLElement>(`[data-policy-sec="${id}"]`);
    if (!el || !sec) return;
    el.scrollTo({ top: sec.offsetTop - 12, behavior: "smooth" });
  };
  const readAll = progress >= 0.98;
  const pct = Math.round(progress * 100);

  // Fills the visible area so only the policy column scrolls (one scrollbar), not the page too.
  return (
    <section className="antialiased w-full md:max-h-full rd-v3 bg-white rounded-none md:rounded-2xl flex flex-col md:border-[1.5px] md:border-solid md:border-brand-400 md:shadow-[0_0_0_4px_rgba(10,77,224,0.10),0_12px_32px_-12px_rgba(16,24,40,0.18)]">
      <StepHeaderV3
        step={6}
        title="Data Privacy Policy"
        className="px-4 md:px-8 pt-4 pb-4 md:pt-5 md:pb-5"
      >
        Please read the Data Privacy Policy carefully before processing next
        step.
      </StepHeaderV3>

      <div className="flex flex-1 min-h-0 flex-col md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-8 px-4 md:px-8">
        {/* Section list: a sticky rail on desktop, scrollable chips on phones. */}
        <nav aria-label="Policy sections" className="hidden md:flex flex-col gap-0.5 self-start pt-1">
          <p className="m-0 mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">On this page</p>
          {POLICY_SECTIONS.map((sec) => {
            const on = active === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => jump(sec.id)}
                aria-current={on ? "location" : undefined}
                className="relative cursor-pointer rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-[13px] leading-5 outline-none"
              >
                {on && (
                  <motion.span
                    layoutId={`${idp}-toc`}
                    transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
                    className="absolute inset-0 rounded-md bg-[#EBF1FF]"
                  />
                )}
                <span className={`relative transition-colors ${on ? "font-semibold text-brand-500" : "text-gray-500 hover:text-gray-900"}`}>
                  {sec.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-h-0 flex-col">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2 md:hidden [scrollbar-width:none]">
            {POLICY_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => jump(sec.id)}
                className={`h-7 flex-shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-solid px-2.5 text-xs font-medium transition-colors ${
                  active === sec.id ? "border-brand-400 bg-brand-25 text-brand-500" : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
          {/* Reading progress, pinned to the top of the text. */}
          <div className="h-[3px] flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-[width] duration-150 ${readAll ? "bg-success-600" : "bg-brand-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label="Data privacy policy text"
            className="relative max-h-[55vh] md:max-h-none md:flex-1 md:min-h-0 overflow-y-auto pb-6 pt-5 pr-1 text-[14px] leading-6 text-gray-700 focus:outline-none [scrollbar-width:thin] [scrollbar-color:#d0d5dd_transparent]"
          >
            <div className="max-w-[68ch]">
              <PolicyBodyV3 idp={idp} />
            </div>
          </div>
        </div>
      </div>

      {/* Agreement: always in view, turns green once ticked. */}
      <div className="flex-shrink-0 border-0 border-t border-solid border-gray-100 px-4 py-3 md:px-8 md:py-4">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] border-solid px-4 py-3 transition-colors duration-200 ${
            agreed ? "border-success-600 bg-[#ECFDF3]" : "border-gray-200 bg-white hover:border-brand-200"
          }`}
        >
          <span className="pt-0.5">
            <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          </span>
          <span className="text-sm font-medium leading-5 text-gray-900">{PRIVACY_AGREEMENT}</span>
        </label>
      </div>
    </section>
  );
}

/** v3 reading layout: the same policy text, split into navigable sections. */
const POLICY_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "rights", label: "Your rights & contacts" },
  { id: "requests", label: "Requests" },
  { id: "security", label: "Security" },
  { id: "retention", label: "Retention" },
  { id: "consent", label: "Consent" },
  { id: "conforme", label: "Conforme" },
] as const;

function PolicyBodyV3({ idp }: { idp: string }) {
  return (
    <div className="flex flex-col gap-10">
    <section id={`${idp}-overview`} data-policy-sec="overview" aria-label="Overview" className="flex scroll-mt-16 flex-col gap-4">
      <h2 className="m-0 text-[15px] font-semibold leading-6 text-gray-900 md:text-base">
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
    </section>
    <section id={`${idp}-rights`} data-policy-sec="rights" aria-label="Your rights and contacts" className="flex scroll-mt-16 flex-col gap-4">
      <p className="m-0">
        Under the Data Privacy Act of 2012, you have the right to access,
        modify, erase and/or object to any processing of personal, sensitive or
        privileged data that you have provided to us. To do so, kindly contact
        our Data Protection Officer with the following information:
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CONTACTS.map((contact) => (
          <div key={contact.title} className="flex flex-col gap-2 rounded-xl border border-solid border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-[#ECFDF3] text-success-600">
                <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
                  <path d="M8 8.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5zM2.75 13.5c.8-2.3 2.8-3.5 5.25-3.5s4.45 1.2 5.25 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="m-0 text-sm font-semibold leading-5 text-gray-900">{contact.title}</h3>
            </div>
            <dl className="m-0 flex flex-col gap-1 text-[13px] leading-5">
              {contact.lines.map(([label, value]) => {
                const v = value.replace(/^\s*:\s*/, "").trim();
                const isMail = v.includes("@");
                return (
                  <div key={label} className="flex flex-col">
                    <dt className="text-[11px] font-medium uppercase tracking-[0.04em] text-gray-400">{label.replace(/:$/, "")}</dt>
                    <dd className="m-0 break-words text-gray-800">
                      {isMail ? (
                        <a href={`mailto:${v}`} className="font-medium text-brand-400 no-underline hover:underline">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </section>
    <section id={`${idp}-requests`} data-policy-sec="requests" aria-label="Requests" className="flex scroll-mt-16 flex-col gap-4">
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
    </section>
    <section id={`${idp}-security`} data-policy-sec="security" aria-label="Security" className="flex scroll-mt-16 flex-col gap-4">
      <p className="m-0">
        We have implemented technological, organizational, and physical security
        measures to protect your information from loss, misuse, modification,
        unauthorized or accidental access or disclosure, alteration or
        destruction. We put in effect safeguards such as:
      </p>
      <ol className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 [counter-reset:sg] sm:grid-cols-2 [&>li]:relative [&>li]:rounded-xl [&>li]:border [&>li]:border-solid [&>li]:border-gray-200 [&>li]:bg-white [&>li]:p-4 [&>li]:pt-11 [&>li]:[counter-increment:sg] [&>li]:before:absolute [&>li]:before:left-4 [&>li]:before:top-4 [&>li]:before:grid [&>li]:before:size-6 [&>li]:before:place-items-center [&>li]:before:rounded-md [&>li]:before:bg-brand-25 [&>li]:before:text-xs [&>li]:before:font-semibold [&>li]:before:text-brand-500 [&>li]:before:content-[counter(sg)]">
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
    </section>
    <section id={`${idp}-retention`} data-policy-sec="retention" aria-label="Retention" className="flex scroll-mt-16 flex-col gap-4">
      <p className="m-0 rounded-r-xl border-0 border-l-[3px] border-solid border-brand-400 bg-brand-25/60 py-3 pl-4 pr-4">
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
    </section>
    <section id={`${idp}-consent`} data-policy-sec="consent" aria-label="Consent" className="flex scroll-mt-16 flex-col gap-4">
      <p className="m-0 font-medium text-gray-900">
        By agreeing to this policy, you explicitly and unambiguously consent to
        the collection, processing and storage of your personal, sensitive and
        privileged data by DMCI Project Developers, Inc. for the purpose(s)
        described in this Data Privacy Notice.
      </p>

    </section>
    <section id={`${idp}-conforme`} data-policy-sec="conforme" aria-label="Conforme" className="flex scroll-mt-16 flex-col gap-4">
      <div className="flex flex-col gap-1.5 pt-3">
        <h3 className="m-0 text-sm font-semibold leading-5 text-gray-900">
          Conforme
        </h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
          {SIGNERS.map((signer) => (
            <SignerCard key={signer.name} signer={signer} />
          ))}
        </ul>
      </div>
    </section>
    </div>
  );
}

/** The policy body (incl. Conforme) — shared with the Review & Submit step. */
export function PrivacyPolicyText() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-[15px] font-semibold leading-6 text-gray-900 md:text-base">
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
          <h3 className="m-0 text-sm font-semibold leading-5 text-gray-900">
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
        <h3 className="m-0 text-sm font-semibold leading-5 text-gray-900">
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
