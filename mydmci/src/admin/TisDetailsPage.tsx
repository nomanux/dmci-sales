import { useState } from "react";
import Button from "@/Button";
import AdminLayout from "./AdminLayout";
import Badge from "./Badge";
import UnderlineTabs from "./UnderlineTabs";
import { getApplicationDetails, type RtoApplicationDetails } from "./rtoData";
import { navigate } from "../router";
import backChevron from "../assets/icons/back-chevron.svg";
import refreshCcw02 from "../assets/icons/refresh-ccw-02.svg";
import stepComplete from "../assets/icons/step-complete.svg";
import stepDot from "../assets/icons/step-dot.svg";
import stepDotCurrent from "../assets/icons/step-dot-current.svg";

/**
 * One TIS application at /mydmci/admin/rto/:tisNo.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details / Summary"
 * 163987:149947.
 */

const STEPS = ["Link", "TIS", "RA", "Payment", "Docs-in", "Credit", "Contract"] as const;

type TabKey = "summary" | "tis" | "reservation" | "payment" | "documents" | "credit" | "contract" | "activity";

const TABS: { key: TabKey; label: string }[] = [
  { key: "summary", label: "Summary" },
  { key: "tis", label: "TIS" },
  { key: "reservation", label: "Reservation" },
  { key: "payment", label: "Payment" },
  { key: "documents", label: "Documents" },
  { key: "credit", label: "Credit" },
  { key: "contract", label: "Lease Contract" },
  { key: "activity", label: "Activity" },
];

function StepIcon({ status }: { status: "complete" | "current" | "incomplete" }) {
  if (status === "complete") {
    return <img src={stepComplete} alt="" width={24} height={24} className="relative block size-6" />;
  }
  if (status === "current") {
    return (
      <span className="relative flex size-6 items-center justify-center rounded-full bg-[#10398e] shadow-[0_0_0_2px_white,0_0_0_4px_#1448b3]">
        <img src={stepDotCurrent} alt="" width={8} height={8} className="block size-2" />
      </span>
    );
  }
  return (
    <span className="relative flex size-6 items-center justify-center rounded-full border-[1.5px] border-solid border-[#e9eaeb] bg-[#fafafa]">
      <img src={stepDot} alt="" width={8} height={8} className="block size-2" />
    </span>
  );
}

function ProgressSteps({ current }: { current: number }) {
  const n = STEPS.length;
  const edge = 100 / (2 * n); // centre of the first / last column, in %
  const span = 100 - 2 * edge;
  return (
    <div className="overflow-x-auto rounded-xl border border-solid border-[#e9eaeb] bg-white py-5">
      <ol aria-label="Application progress" className="relative m-0 flex min-w-[640px] list-none p-0">
        <span aria-hidden className="absolute top-[11px] h-0.5 bg-[#e9eaeb]" style={{ left: `${edge}%`, right: `${edge}%` }} />
        <span
          aria-hidden
          className="absolute top-[11px] h-0.5 bg-[#10398e]"
          style={{ left: `${edge}%`, width: `${(span * current) / (n - 1)}%` }}
        />
        {STEPS.map((step, i) => {
          const status = i < current ? "complete" : i === current ? "current" : "incomplete";
          return (
            <li
              key={step}
              aria-current={status === "current" ? "step" : undefined}
              className="flex flex-1 flex-col items-center gap-3"
            >
              <StepIcon status={status} />
              <span
                className={`text-center text-sm font-semibold leading-5 ${
                  status === "current" ? "text-[#1448b3]" : "text-[#414651]"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function DetailCard({ title, fields }: { title: string; fields: { label: string; value: React.ReactNode }[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-solid border-[#e9eaeb] bg-[#f9fafb] px-6 py-5">
      <h2 className="m-0 text-base font-semibold leading-6 text-[#181d27]">{title}</h2>
      <dl className="m-0 flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col items-start gap-1">
            <dt className="text-xs leading-[18px] text-[#4b5563]">{f.label}</dt>
            <dd className="m-0 break-words text-sm font-medium leading-5 text-[#111827]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Summary({ app }: { app: RtoApplicationDetails }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-3">
      <DetailCard
        title="Applicant (TIS)"
        fields={[
          { label: "Name", value: app.client },
          { label: "Email", value: app.email },
          { label: "Birthday", value: app.birthday },
          { label: "Composition", value: app.composition },
        ]}
      />
      <DetailCard
        title="Customer accounts"
        fields={[
          { label: "myDMCIHomes", value: app.mydmciAccount },
          { label: "D365 Customer", value: app.d365Customer },
          { label: "Check Result", value: app.checkResult },
        ]}
      />
      <DetailCard
        title="Unit and D365"
        fields={[
          { label: "Unit", value: app.unit },
          { label: "CRF (Opportunity)", value: app.crf },
          { label: "Holding", value: app.holding },
          { label: "D365 Sync", value: <Badge>{app.sync}</Badge> },
        ]}
      />
    </div>
  );
}

export default function TisDetailsPage({ tisNo }: { tisNo: string }) {
  const [tab, setTab] = useState<TabKey>("summary");
  const app = getApplicationDetails(tisNo);
  const breadcrumb = ["Dashboard", { label: "RTO Applications", route: "admin" }, tisNo];

  if (!app) {
    return (
      <AdminLayout active="rto-applications" breadcrumb={breadcrumb}>
        <div className="flex flex-col items-start gap-3 px-6 py-10">
          <h1 className="m-0 text-xl font-semibold leading-[30px] text-[#181d27]">Application not found</h1>
          <p className="m-0 text-sm text-[#535862]">There is no RTO application with the number {tisNo}.</p>
          <Button variant="secondary" size="sm" className="h-9" onClick={() => navigate("admin")}>
            Back to RTO Applications
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const currentStep = Math.max(0, STEPS.indexOf(app.stage));

  return (
    <AdminLayout active="rto-applications" breadcrumb={breadcrumb}>
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              aria-label="Back to RTO Applications"
              onClick={() => navigate("admin")}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-solid border-[#d5d7da] bg-white p-0 hover:bg-[#fafafa]"
            >
              <img src={backChevron} alt="" width={20} height={20} className="block size-5" />
            </button>
            <h1 className="m-0 text-xl font-semibold leading-[30px] text-[#181d27]">
              {app.tisNo} · {app.client}
            </h1>
            <div className="flex items-center gap-2">
              <Badge size="md">{app.customerType}</Badge>
              <Badge size="md">{app.unitStatus}</Badge>
            </div>
          </div>
          {/* Only offered when the D365 sync failed. */}
          {app.sync === "Failed" && (
            <Button variant="secondary" size="sm" className="h-9 gap-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
              <img src={refreshCcw02} alt="" width={20} height={20} className="block size-5" />
              Retry D365 Sync
            </Button>
          )}
        </div>

        <ProgressSteps current={currentStep} />

        <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white">
          <UnderlineTabs label="Application sections" tabs={TABS} value={tab} onChange={setTab} />
          {tab === "summary" ? (
            <Summary app={app} />
          ) : (
            <p className="m-0 px-6 py-12 text-center text-sm text-[#717680]">
              {TABS.find((t) => t.key === tab)?.label} details will appear here.
            </p>
          )}
        </div>

        {/* Composition change notice */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-solid border-[#fedf89] bg-[#fffaeb] px-5 py-4">
          <div className="flex min-w-[240px] flex-1 flex-col gap-1">
            <h2 className="m-0 text-base font-semibold leading-6 text-[#181d27]">Composition changes</h2>
            <p className="m-0 text-sm leading-5 text-[#414651]">
              Before payment, a change creates a new TIS and the original is not updated. After the reservation is
              paid, DICD review and a CIUF are required.
            </p>
            <p className="m-0 text-sm leading-5 text-[#535862]">An active TIS for the same customer blocks a new one.</p>
          </div>
          <Button variant="secondary" size="sm" className="h-9 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
            Request Change
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
