import { Download01Icon } from "hugeicons-react";
import Button from "@/Button";
import type { RtoApplicationDetails } from "./rtoData";
import { Row, type Pair } from "./TisTab";

/**
 * Payment tab on the TIS details page: the reservation payment and the unit
 * it was paid for.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details / Payment"
 * 164000:117470.
 *
 * Values are the design's sample data. Download Receipt saves a plain-text
 * receipt of these details until a real receipt (PDF) is available.
 */

const PAYMENT = {
  id: "8c35734c-c3c7-4fd7-b4df-da8a348a0d60",
  type: "Online",
  note: "To be paid in PHP",
  method: "Debit Card",
  gateway: "PAYMAYA",
  result: "SUCCESS",
  message: "Transaction Successful!",
  amount: "Twenty Eight Thousand (₱28,000)",
};

const PROPERTY = {
  holdingId: "HLD0327518",
  customerName: "Jose B. Santos",
  property: "CAL",
  unit: "CAL-00A-C-12020",
  description: "Reservation fee for Unit CAL-00A-C-12020",
};

/** Green outlined status pill with a dot (Figma "Badge", success, outline). */
function ResultBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-solid border-[#079455] py-0.5 pl-1.5 pr-2 text-xs font-medium leading-[18px] text-[#067647]">
      <span aria-hidden className="size-1.5 rounded-full bg-[#17b26a]" />
      {children}
    </span>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-solid border-[#e5e7eb] bg-white">
      <div className="flex min-h-11 items-center justify-between gap-3 border-0 border-b border-solid border-[#e5e7eb] px-5 py-2.5">
        <h2 className="m-0 text-base font-semibold leading-6 text-[#374151]">{title}</h2>
        {action}
      </div>
      <dl className="m-0 flex flex-col gap-1.5 p-5">{children}</dl>
    </section>
  );
}

function Rows({ pairs }: { pairs: Pair[] }) {
  return (
    <>
      {pairs.map(([label, value]) => (
        <Row key={label} label={label} value={value} labelWidth="w-[200px]" />
      ))}
    </>
  );
}

function downloadReceipt(app: RtoApplicationDetails) {
  const lines = [
    "DMCI Homes - Payment Receipt",
    "",
    `TIS: ${app.tisNo} (${app.client})`,
    `Payment ID: ${PAYMENT.id}`,
    `Payment Type: ${PAYMENT.type}`,
    `Method: ${PAYMENT.method}`,
    `Gateway: ${PAYMENT.gateway}`,
    `Result: ${PAYMENT.result}`,
    `Amount: ${PAYMENT.amount}`,
    "",
    `Holding ID: ${PROPERTY.holdingId}`,
    `Property Unit: ${PROPERTY.unit}`,
    `Description: ${PROPERTY.description}`,
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${app.tisNo}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PaymentTab({ app }: { app: RtoApplicationDetails }) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Card
        title="Payment Details"
        action={
          <Button
            variant="secondary"
            size="sm"
            className="h-9 gap-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)]"
            onClick={() => downloadReceipt(app)}
          >
            <Download01Icon size={20} strokeWidth={1.5} color="currentColor" aria-hidden="true" />
            Download Receipt
          </Button>
        }
      >
        <div className="flex min-w-0 items-center gap-2 py-0.5 text-sm leading-5">
          <dt className="w-[200px] shrink-0 font-semibold text-[#6b7280]">Payment ID</dt>
          <span aria-hidden className="shrink-0 font-semibold text-[#6b7280]">
            :
          </span>
          <dd className="m-0 min-w-0 break-all text-lg font-semibold leading-7 text-[#07389d]">{PAYMENT.id}</dd>
        </div>
        <Rows
          pairs={[
            ["Payment Type", PAYMENT.type],
            ["Note", PAYMENT.note],
            ["Method", PAYMENT.method],
            ["Gateway", PAYMENT.gateway],
            ["Result", <ResultBadge key="result">{PAYMENT.result}</ResultBadge>],
            ["Message", PAYMENT.message],
            ["Amount", PAYMENT.amount],
          ]}
        />
      </Card>

      <Card title="Property Information">
        <Rows
          pairs={[
            ["Holding ID", <span key="hld" className="font-bold">{PROPERTY.holdingId}</span>],
            ["Customer Name", PROPERTY.customerName],
            ["Property", PROPERTY.property],
            ["Property Unit", PROPERTY.unit],
            ["Description", PROPERTY.description],
          ]}
        />
      </Card>
    </div>
  );
}
