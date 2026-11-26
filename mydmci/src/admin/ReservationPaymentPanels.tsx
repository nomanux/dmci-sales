import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { CheckIcon } from "@/icons";
import Button from "@/Button";
import Badge from "./Badge";
import { PdfIcon } from "./LeaseContractTab";
import type { OpsRow } from "./ReservationOpsPage";
import stepComplete from "../assets/icons/step-complete.svg";
import stepDot from "../assets/icons/step-dot.svg";
import stepDotCurrent from "../assets/icons/step-dot-current.svg";

/**
 * Reservation Operations overlays.
 * Figma: DMCI-SID-Portal "Reservation Operations_Online Proof View Modal"
 * 164001:155540, "_Paid_Open" 164003:159797 and "_Pending_Open" 164003:161412.
 */

const TYPE_LABEL: Record<OpsRow["track"], string> = {
  rto: "RTO",
  dmci: "Leasing · DMCI",
  "non-dmci": "Leasing · non-DMCI",
};

const STATUS_BADGE: Record<OpsRow["status"], { label: string; tone: "warning" | "info" | "success" | "error" }> = {
  "RA pending": { label: "Pending", tone: "warning" },
  "For verification": { label: "For Verification", tone: "info" },
  Paid: { label: "Paid", tone: "success" },
  Rejected: { label: "Rejected", tone: "error" },
};

const CHECKLIST = (row: OpsRow) => [
  `Amount paid matches the reservation fee (${row.amount})`,
  "Reference number and payment date match the proof",
  "Payer name and unit match the client record",
];

function useEscape(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, enabled]);
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#a4a7ae] hover:bg-[#fafafa] hover:text-[#717680]"
    >
      <Cancel01Icon size={22} strokeWidth={1.8} color="currentColor" />
    </button>
  );
}

function downloadText(name: string, lines: string[]) {
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- Proof of payment ---------------- */

export function ProofDialog({ row, onClose }: { row: OpsRow; onClose: () => void }) {
  useEscape(onClose);
  const online = row.method === "Online";
  const amount = `${row.amount}.00`;
  const lines: [string, string][] = [
    ["Reference no.", row.reference ?? "-"],
    ["Date paid", row.datePaid ?? "-"],
    ["Payment channel", row.channel ?? "-"],
    ["Payer", row.client],
    ["Paid to", "DMCI Homes Leasing Services, Inc."],
    ["Purpose", `Reservation fee · ${row.tisNo}`],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0d12]/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="proof-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
        className="flex max-h-full w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03)]"
      >
        <div className="flex items-center gap-3 border-0 border-b border-solid border-[#e9eaeb] py-[11px] pl-6 pr-3">
          <PdfIcon />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id="proof-title" className="m-0 text-lg font-semibold leading-7 text-[#181d27]">
              Proof of payment
            </h2>
            <p className="m-0 truncate text-sm leading-5 text-[#535862]">
              {row.proofFile} · Uploaded {row.datePaid}
            </p>
          </div>
          <CloseButton onClick={onClose} label="Close proof of payment" />
        </div>

        <div className="overflow-y-auto bg-[#f5f5f5] p-6">
          <div className="mx-auto flex w-full max-w-[440px] flex-col gap-5 rounded border border-solid border-[#e9eaeb] bg-white px-8 py-7 shadow-[0_1px_1.5px_rgba(10,13,18,0.1)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-base font-bold leading-6 text-[#181d27]">
                  {online ? (row.channel ?? "").split(" ")[0] : row.channel}
                </span>
                <span className="text-xs leading-[18px] text-[#717680]">{online ? "Payment confirmation" : "Deposit slip"}</span>
              </div>
              <Badge tone={row.status === "Paid" || online ? "success" : "info"}>
                {row.status === "Paid" || online ? "Successful" : "For verification"}
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-0.5 border-0 border-y border-dashed border-[#d5d7da] py-4">
              <span className="text-xs leading-[18px] text-[#535862]">Amount paid</span>
              <span className="text-[28px] font-semibold leading-9 text-[#181d27]">{amount}</span>
            </div>
            <dl className="m-0 flex flex-col gap-2.5">
              {lines.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 text-xs leading-[18px]">
                  <dt className="text-[#535862]">{k}</dt>
                  <dd className="m-0 text-right font-medium text-[#181d27]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 border-0 border-t border-solid border-[#e9eaeb] pt-2 text-center text-[11px] leading-4 text-[#717680]">
              This is a system-generated copy of the document uploaded by the client.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-0 border-t border-solid border-[#e9eaeb] px-6 py-4">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() =>
              downloadText(
                (row.proofFile ?? "proof.pdf").replace(/\.pdf$/, ".txt"),
                [`Proof of payment · ${row.tisNo}`, `Amount paid: ${amount}`, ...lines.map(([k, v]) => `${k}: ${v}`)],
              )
            }
          >
            Download
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Payment drawer ---------------- */

type StepState = "done" | "current" | "todo";

function stagesFor(row: OpsRow): { title: string; detail: string; state: StepState }[] {
  const steps =
    row.method === "Online"
      ? [
          { title: "Initiated", detail: "Client paid through the portal" },
          { title: "Confirmed", detail: "Gateway confirmed the transaction" },
          { title: "Paid", detail: "Reservation marked as paid" },
          { title: "Receipt issued", detail: "Provisional receipt sent to client" },
        ]
      : [
          { title: "Proof uploaded", detail: "Client uploaded proof of payment" },
          { title: "Verification", detail: "Admin checks details against the proof" },
          { title: "Paid", detail: "Reservation marked as paid" },
          { title: "Receipt issued", detail: "Provisional receipt sent to client" },
        ];
  // How many steps are done: all when paid, the upload when waiting for verification.
  const done = row.status === "Paid" ? steps.length : row.status === "For verification" || row.status === "Rejected" ? 1 : 0;
  return steps.map((s, i) => ({ ...s, state: i < done ? "done" : i === done ? "current" : "todo" }));
}

function StageList({ row }: { row: OpsRow }) {
  const stages = stagesFor(row);
  return (
    <ol className="m-0 flex list-none flex-col p-0">
      {stages.map((s, i) => {
        const last = i === stages.length - 1;
        return (
          <li key={s.title} aria-current={s.state === "current" ? "step" : undefined} className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pb-1">
              {s.state === "done" ? (
                <img src={stepComplete} alt="" width={24} height={24} className="block size-6 shrink-0" />
              ) : s.state === "current" ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#10398e] shadow-[0_0_0_2px_white,0_0_0_4px_#1448b3]">
                  <img src={stepDotCurrent} alt="" width={8} height={8} className="block size-2" />
                </span>
              ) : (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#e9eaeb] bg-[#fafafa]">
                  <img src={stepDot} alt="" width={8} height={8} className="block size-2" />
                </span>
              )}
              {!last && <span aria-hidden className={`w-0.5 flex-1 rounded-sm ${s.state === "done" ? "bg-[#10398e]" : "bg-[#e9eaeb]"}`} />}
            </div>
            <div className={`flex flex-1 flex-col pt-0.5 text-sm leading-5 ${last ? "" : "pb-6"}`}>
              <span className={`font-semibold ${s.state === "current" ? "text-[#1448b3]" : "text-[#414651]"}`}>{s.title}</span>
              <span className={s.state === "current" ? "text-[#1448b3]" : "text-[#535862]"}>{s.detail}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <dt className="text-xs leading-[18px] text-[#535862]">{label}</dt>
      <dd className="m-0 text-sm font-medium leading-5 text-[#181d27]">{children}</dd>
    </div>
  );
}

function Note({ tone, title, children }: { tone: "brand" | "warning" | "error"; title: string; children: ReactNode }) {
  const styles = {
    brand: "bg-[#e8effe] text-[#10398e]",
    warning: "bg-[#fffaeb] text-[#dc6803]",
    error: "bg-[#fef3f2] text-[#d92d20]",
  }[tone];
  return (
    <div className={`flex items-start gap-3 rounded-[10px] px-4 py-3.5 text-sm leading-5 ${styles}`}>
      <AlertCircleIcon size={18} strokeWidth={1.8} color="currentColor" className="mt-px shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <p className="m-0 font-semibold">{title}</p>
        <p className="m-0">{children}</p>
      </div>
    </div>
  );
}

export function PaymentDrawer({
  row,
  onClose,
  onViewProof,
  onApprove,
  onReject,
  covered = false,
}: {
  row: OpsRow;
  onClose: () => void;
  onViewProof: () => void;
  onApprove: () => void;
  onReject: () => void;
  /** A window is open on top; Esc should close that one only. */
  covered?: boolean;
}) {
  useEscape(onClose, !covered);
  const [reminded, setReminded] = useState(false);
  const checklist = CHECKLIST(row);
  const [checked, setChecked] = useState<boolean[]>(() => checklist.map(() => false));
  const allChecked = checked.every(Boolean);
  const badge = STATUS_BADGE[row.status];
  const dash = (v: string | null) => v ?? "-";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-[#0a0d12]/40 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-drawer-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 40 }}
        className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03)]"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-0 border-b border-solid border-[#e9eaeb] py-[18px] pl-6 pr-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="pay-drawer-title" className="m-0 text-lg font-semibold leading-7 text-[#181d27]">
                Reservation Payment
              </h2>
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>
            <p className="m-0 truncate text-sm leading-5 text-[#535862]">
              Reservation Operation · {row.client} · {row.method}
            </p>
          </div>
          <CloseButton onClick={onClose} label="Close payment details" />
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
          {row.status === "Paid" ? (
            <Note tone="brand" title="Payment confirmed">
              {row.method === "Online"
                ? `Paid online via ${row.channel}. Receipt ${row.receipt} was issued automatically.`
                : `Manual payment via ${row.channel} was verified. Receipt ${row.receipt} was issued.`}
            </Note>
          ) : row.status === "RA pending" ? (
            <Note tone="warning" title="Waiting for RA signature">
              The client has not signed the Reservation Agreement yet. Payment can be submitted once the RA is signed.
            </Note>
          ) : row.status === "Rejected" ? (
            <Note tone="error" title="Proof rejected">
              The proof did not match the payment details. The client was asked to upload a new proof of payment.
            </Note>
          ) : (
            <Note tone="brand" title="Manual payment for verification">
              The client uploaded a proof of payment. Check the payment details against the proof, then approve it to mark the
              reservation as paid.
            </Note>
          )}

          <section className="flex flex-col gap-3">
            <h3 className="m-0 text-sm font-semibold leading-5 text-[#181d27]">Payment details</h3>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3.5 rounded-[10px] border border-solid border-[#e9eaeb] bg-[#fafafa] px-4 py-3.5">
              <Field label="Client">{row.client}</Field>
              <Field label="Type">
                <Badge tone="brand">{TYPE_LABEL[row.track]}</Badge>
              </Field>
              <Field label="Unit">{row.unit}</Field>
              <Field label="Application">{row.tisNo}</Field>
              <Field label="Reservation Fee">{row.amount}</Field>
              <Field label="Amount Paid">{row.status === "RA pending" ? "-" : row.amount}</Field>
              <Field label="Method">{row.method}</Field>
              <Field label="Channel">{dash(row.channel)}</Field>
              <Field label="Reference No.">{dash(row.reference)}</Field>
              <Field label="Date Paid">{dash(row.datePaid)}</Field>
              <Field label="Project">{row.project}</Field>
              <Field label="Receipt">{row.receipt ?? "Not Issued"}</Field>
            </dl>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="m-0 text-sm font-semibold leading-5 text-[#181d27]">Proof of Payment</h3>
            {row.proofFile ? (
              <div className="flex items-center gap-3 rounded-[10px] border border-solid border-[#e9eaeb] px-3.5 py-3">
                <PdfIcon />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium leading-5 text-[#181d27]">{row.proofFile}</span>
                  <span className="truncate text-xs leading-[18px] text-[#535862]">Uploaded by client · {row.datePaid}</span>
                </div>
                <Button variant="secondary" size="sm" className="h-9 shadow-[0_1px_2px_rgba(10,13,18,0.05)]" onClick={onViewProof}>
                  View
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5 rounded-[10px] border border-dashed border-[#d5d7da] px-3.5 py-[18px] text-center">
                <span className="text-sm font-medium leading-5 text-[#414651]">Not uploaded</span>
                <span className="text-xs leading-[18px] text-[#717680]">The client has not submitted a proof of payment.</span>
              </div>
            )}
          </section>

          {row.status === "For verification" && (
            <section className="flex flex-col gap-3">
              <h3 id="verify-checklist" className="m-0 text-sm font-semibold leading-5 text-[#181d27]">
                Verification checklist
              </h3>
              <div
                role="group"
                aria-labelledby="verify-checklist"
                className="flex flex-col gap-3 rounded-[10px] border border-solid border-[#e9eaeb] px-4 py-3.5"
              >
                {checklist.map((item, i) => (
                  <label key={item} className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#414651]">
                    <input
                      type="checkbox"
                      checked={checked[i]}
                      onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-solid transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-[#1448b3]/20 ${
                        checked[i] ? "border-[#10398e] bg-[#10398e] text-white" : "border-[#d5d7da] bg-white"
                      }`}
                    >
                      {checked[i] && <CheckIcon className="size-3" />}
                    </span>
                    {item}
                  </label>
                ))}
              </div>
              <p className="m-0 text-xs leading-[18px] text-[#717680]">Confirm every item after reviewing the proof to enable approval.</p>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h3 className="m-0 text-sm font-semibold leading-5 text-[#181d27]">Payment Stage</h3>
            <StageList row={row} />
          </section>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-0 border-t border-solid border-[#e9eaeb] px-6 py-4">
          {row.status === "For verification" ? (
            <>
              <Button variant="secondary" size="sm" className="h-9 flex-1" onClick={onReject}>
                Reject
              </Button>
              <Button variant="primary" size="sm" className="h-9 flex-1" disabled={!allChecked} onClick={onApprove}>
                Approve &amp; Mark as Paid
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" className="h-9 flex-1" onClick={onClose}>
              Close
            </Button>
          )}
          {row.status === "Paid" ? (
            <Button
              variant="primary"
              size="sm"
              className="h-9 flex-1"
              onClick={() =>
                downloadText(`${row.receipt}.txt`, [
                  `DMCI Homes · Provisional receipt ${row.receipt}`,
                  `Application: ${row.tisNo} (${row.client})`,
                  `Reservation fee: ${row.amount}`,
                  `Method: ${row.method} · ${row.channel}`,
                  `Reference: ${row.reference}`,
                  `Date paid: ${row.datePaid}`,
                ])
              }
            >
              Download Receipt
            </Button>
          ) : row.status === "For verification" ? null : row.status === "Rejected" ? (
            <Button variant="primary" size="sm" className="h-9 flex-1 gap-1.5" disabled={reminded} onClick={() => setReminded(true)}>
              {reminded && <CheckmarkCircle02Icon size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" />}
              {reminded ? "Reminder sent" : "Remind client to re-upload"}
            </Button>
          ) : (
            <Button variant="primary" size="sm" className="h-9 flex-1 gap-1.5" disabled={reminded} onClick={() => setReminded(true)}>
              {reminded && <CheckmarkCircle02Icon size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" />}
              {reminded ? "Reminder sent" : "Release Reminder"}
            </Button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}
