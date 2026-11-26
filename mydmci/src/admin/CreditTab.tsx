import type { ReactNode } from "react";
import { CheckCircleIcon } from "@/icons";
import type { RtoApplicationDetails } from "./rtoData";
import bell01 from "../assets/icons/bell-01.svg";

/**
 * Credit tab on the TIS details page: the credit investigation (CI) request
 * and its result.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details / Credit"
 * 164000:121674.
 *
 * Application, client and type come from the application; the CI dates,
 * result and remarks are the design's sample data.
 */

const TRACK_LABEL: Record<RtoApplicationDetails["track"], string> = {
  rto: "RTO",
  dmci: "DMCI",
  "non-dmci": "Non-DMCI",
};

const CI = {
  result: "Passed",
  requested: "Oct 12, 2026",
  sentToCredit: "Oct 14, 2026",
  remarks: "No issues found.",
  savedBy: "Olivia Rhye",
  date: "Oct 19, 2026",
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <dt className="text-xs leading-[18px] text-[#4b5563]">{label}</dt>
      <dd className="m-0 text-sm font-medium leading-5 text-[#111827]">{children}</dd>
    </div>
  );
}

function PassedBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-solid border-[#abefc6] bg-[#ecfdf3] py-0.5 pl-1.5 pr-2 text-xs font-medium leading-[18px] text-[#067647]">
      <span aria-hidden className="size-1.5 rounded-full bg-[#17b26a]" />
      {children}
    </span>
  );
}

function GrayBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-solid border-[#e9eaeb] bg-[#fafafa] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#414651]">
      {children}
    </span>
  );
}

export default function CreditTab({ app }: { app: RtoApplicationDetails }) {
  const result: [string, string][] = [
    ["Result", CI.result],
    ["Remarks", CI.remarks],
    ["Saved by", CI.savedBy],
    ["Date", CI.date],
  ];

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Summary */}
      <dl className="m-0 grid grid-cols-1 gap-4 rounded-xl border border-solid border-[#e9eaeb] bg-[#fafafa] p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Application">
          {app.tisNo} · {app.client}
        </Field>
        <Field label="CI Result">
          <PassedBadge>{CI.result}</PassedBadge>
        </Field>
        <Field label="Client">{app.client}</Field>
        <Field label="Type">
          <GrayBadge>{TRACK_LABEL[app.track]}</GrayBadge>
        </Field>
        <Field label="CI requested">{CI.requested}</Field>
      </dl>

      <p className="m-0 flex items-center gap-2.5 text-xs leading-[18px] text-[#717680]">
        <img src={bell01} alt="" width={20} height={20} className="block size-5 shrink-0" />
        CI request sent to Credit on {CI.sentToCredit}
      </p>

      {/* CI result */}
      <dl className="m-0 grid grid-cols-[88px_minmax(0,1fr)] gap-x-2 gap-y-3 text-sm leading-5">
        {result.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[#535862]">{label}</dt>
            <dd className="m-0 text-[#181d27]">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Next step once CI has passed */}
      <div className="flex items-start gap-2.5 rounded-lg bg-[#dcfae6] px-3.5 py-3 text-sm leading-5 text-[#079455]">
        <CheckCircleIcon className="mt-px size-[18px] shrink-0" />
        <div className="flex flex-col gap-0.5">
          <p className="m-0 font-semibold">Waiting for the security deposit</p>
          <p className="m-0">The client sees the deposit step in their portal.</p>
        </div>
      </div>
    </div>
  );
}
