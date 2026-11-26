import { useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import { Pdf02Icon } from "hugeicons-react";
import Button from "@/Button";
import Badge from "./Badge";
import { PreviewDialog } from "./DocumentsTab";
import type { RtoApplicationDetails } from "./rtoData";
import stepComplete from "../assets/icons/step-complete.svg";
import stepDot from "../assets/icons/step-dot.svg";

/**
 * Lease Contract tab on the TIS details page: contract details, the contract
 * file from D365 and how far the contract has got.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details / Lease
 * Contract" 164000:123121.
 *
 * Client, application and type come from the application; the rest is the
 * design's sample data.
 */

const TRACK_LABEL: Record<RtoApplicationDetails["track"], string> = {
  rto: "RTO",
  dmci: "DMCI",
  "non-dmci": "Non-DMCI",
};

const CONTRACT = {
  status: "Signed",
  unit: "Unit 0612",
  advanceRental: "PHP 25,000 (reservation paid)",
  billing: "Generated in D365",
  file: "LC-0001-draft.pdf",
  fileMeta: "Draft from D365 · Nov 1, 2026",
};

const STAGES: { title: string; detail: string; done: boolean }[] = [
  { title: "Draft", detail: "Created in D365 with billing", done: true },
  { title: "Released", detail: "Sent to the client portal", done: true },
  { title: "Signed", detail: "Signed by the client", done: true },
  { title: "Docs-in", detail: "Original copies collected", done: true },
  { title: "Turnover", detail: "Move-in date set by PCG", done: true },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="m-0 text-sm font-semibold leading-5 text-[#181d27]">{children}</h3>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <dt className="text-xs leading-[18px] text-[#535862]">{label}</dt>
      <dd className="m-0 text-sm font-medium leading-5 text-[#181d27]">{children}</dd>
    </div>
  );
}

export function PdfIcon({ size = 40 }: { size?: number }) {
  return <Pdf02Icon size={size} strokeWidth={1.5} color="#d92d20" aria-hidden="true" className="shrink-0" />;
}

export default function LeaseContractTab({ app }: { app: RtoApplicationDetails }) {
  const [viewing, setViewing] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-5">
      <section className="flex flex-col gap-3">
        <SectionTitle>Contract details</SectionTitle>
        <dl className="m-0 grid grid-cols-1 gap-4 rounded-[10px] border border-solid border-[#e9eaeb] bg-[#fafafa] px-4 py-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Client">{app.client}</Field>
          <Field label="Status">
            <Badge>{CONTRACT.status}</Badge>
          </Field>
          <Field label="Type">
            <Badge tone="brand">{TRACK_LABEL[app.track]}</Badge>
          </Field>
          <Field label="Unit">{CONTRACT.unit}</Field>
          <Field label="Application">{app.tisNo}</Field>
          <Field label="Advance rental">{CONTRACT.advanceRental}</Field>
          <Field label="Billing">{CONTRACT.billing}</Field>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Contract document</SectionTitle>
        <div className="flex items-center gap-3 rounded-[10px] border border-solid border-[#e9eaeb] px-3.5 py-3">
          <PdfIcon />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium leading-5 text-[#181d27]">{CONTRACT.file}</span>
            <span className="truncate text-xs leading-[18px] text-[#535862]">{CONTRACT.fileMeta}</span>
          </div>
          <Button variant="secondary" size="sm" className="h-9 shadow-[0_1px_2px_rgba(10,13,18,0.05)]" onClick={() => setViewing(true)}>
            View
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Contract stage</SectionTitle>
        <ol className="m-0 flex list-none flex-col p-0">
          {STAGES.map((stage, i) => {
            const last = i === STAGES.length - 1;
            return (
              <li key={stage.title} className="flex gap-3">
                <div className="flex flex-col items-center gap-1 pb-1">
                  {stage.done ? (
                    <img src={stepComplete} alt="" width={24} height={24} className="block size-6 shrink-0" />
                  ) : (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#e9eaeb] bg-[#fafafa]">
                      <img src={stepDot} alt="" width={8} height={8} className="block size-2" />
                    </span>
                  )}
                  {!last && <span aria-hidden className={`w-0.5 flex-1 rounded-sm ${stage.done ? "bg-[#10398e]" : "bg-[#e9eaeb]"}`} />}
                </div>
                <div className={`flex flex-1 flex-col pt-0.5 text-sm leading-5 ${last ? "" : "pb-6"}`}>
                  <span className="font-semibold text-[#414651]">
                    {stage.title}
                    <span className="sr-only">{stage.done ? " (done)" : " (not yet)"}</span>
                  </span>
                  <span className="text-[#535862]">{stage.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <AnimatePresence>
        {viewing && (
          <PreviewDialog title={CONTRACT.file} meta={CONTRACT.fileMeta} onClose={() => setViewing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
