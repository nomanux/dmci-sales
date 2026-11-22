// RA form v3 copy of BuyerPropertyStep.tsx: StepHeaderV3 banner, focused card and compact fields. The original stays as v1/v2 use it.
import { useState, type ReactNode } from "react";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select from "./SelectV3";
import StepHeaderV3 from "./StepHeaderV3";
import "./RepresentativeDetailsStepV3.css";
import "./RepresentativeDetailsStepV4.css";

/**
 * Step 1 of the CRF track — "Buyer & Property Information".
 * Adapted from RAForm's step 1 to sit inside the CaptureSelfieTrack shell:
 * same card/heading/field scale as BuyerDetailsStep (`.form-lg`), and no
 * inline buttons since the shell's fixed footer carries Previous / Save as
 * draft / Next.
 */

const BUYER_TYPES = [
  { label: "Primary buyer", value: "primary" },
  { label: "Co-buyer", value: "cobuyer" },
];

const BUYER_CLASSIFICATIONS = [
  { label: "Individual", value: "individual" },
  { label: "Corporate", value: "corporate" },
];

// Read-only property details carried over from the unit picked earlier in the flow.
const PROPERTY_DETAILS = [
  { label: "Property Name", value: "Alta Vista De Boracay" },
  { label: "Unit / Lot No. / Parking Slot No.", value: "SON-00A-C-02008" },
  { label: "Unit Category", value: "Condo unit" },
  { label: "Building Name", value: "Sample Building Name" },
  { label: "Area (M²)", value: "1200" },
  { label: "List Price (Php)", value: "6,500,000" },
];

// Same field states as step 2: a required field that is still empty gets a light
// brand tint and a "Required" note; focus and filled fields look normal.
function Field({ label, required = false, filled = true, children }: { label: string; required?: boolean; filled?: boolean; children: ReactNode }) {
  const missing = required && !filled;
  return (
    <div className="flex flex-col gap-1 min-w-0" data-req={required ? (missing ? "missing" : "ok") : undefined}>
      <span className="flex items-center gap-1.5 text-xs font-medium leading-4 text-gray-600">
        {label}
        {missing && <span className="ml-auto text-[11px] font-medium text-brand-400">Required</span>}
      </span>
      {children}
    </div>
  );
}

export default function BuyerPropertyStepV4() {
  const [buyerType, setBuyerType] = useState("primary");
  const [buyerClassification, setBuyerClassification] = useState<string>();
  const [reservationDate, setReservationDate] = useState<string>();

  return (
    <section className="form-lg w-full md:max-h-full rd-v3 rd-v4 flex flex-col px-4 pt-4 md:px-0 md:pt-0">
      <StepHeaderV3 step={1} title="Buyer & Property Information" className="flex-shrink-0 pb-6">
        Review and confirm buyer type and property details for this reservation.
      </StepHeaderV3>

      <div className="flex min-h-0 flex-col overflow-hidden bg-white md:flex-1 md:rounded-xl md:border md:border-solid md:border-gray-200">

      {/* Only the card body scrolls; the title stays put. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
      <div className="px-4 md:px-8 pb-6 pt-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 items-start">
          <Field label="Buyer Type" required filled={!!buyerType}>
            <Select
              size="sm"
              aria-label="Buyer Type"
              placeholder="Select buyer type"
              options={BUYER_TYPES}
              value={buyerType}
              onChange={setBuyerType}
            />
          </Field>
          <Field label="Buyer Classification" required filled={!!buyerClassification}>
            <Select
              size="sm"
              aria-label="Buyer Classification"
              options={BUYER_CLASSIFICATIONS}
              value={buyerClassification}
              onChange={setBuyerClassification}
            />
          </Field>
          <Field label="Control Number (RA No.)">
            <Input size="sm" aria-label="Control Number (RA No.)" disabled />
          </Field>
        </div>

        {/* Reservation Agreement */}
        <div className="bg-reservation-bg flex flex-col px-1.5 pb-1.5 rounded-2xl">
          <h3 className="m-0 py-1.5 text-center text-base font-semibold text-reservation-heading">
            Reservation Agreement
          </h3>
          <div className="bg-white flex flex-col md:flex-row md:items-center gap-3 md:gap-5 px-4 md:px-5 py-3 rounded-lg">
            <div className="flex flex-col gap-0.5 md:w-[283px] shrink-0">
              <span className="flex items-center gap-1.5 text-sm font-semibold leading-5 text-gray-700">
                Date of Reservation
                {!reservationDate && <span className="ml-auto text-[11px] font-medium text-brand-400">Required</span>}
              </span>
              <p className="m-0 text-xs leading-[18px] text-gray-700">This is subject to validation of payment.</p>
            </div>
            <div className="w-full md:w-[301px]" data-req={reservationDate ? "ok" : "missing"}>
              <DatePicker
                size="sm"
                aria-label="Date of Reservation"
                placeholder="MM/DD/YYYY"
                value={reservationDate}
                onChange={setReservationDate}
              />
            </div>
          </div>
        </div>

        {/* Property Information: read-only, shown as values (they come from the unit picked earlier). */}
        <div className="flex flex-col gap-3 border-0 border-t border-solid border-gray-100 pt-5">
          <h3 className="m-0 text-sm font-semibold leading-5 text-gray-900">Property Information</h3>
          <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3">
            {PROPERTY_DETAILS.map((detail) => (
              <div key={detail.label} className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-xs leading-4 text-gray-500">{detail.label}</dt>
                <dd className="m-0 break-words text-sm font-medium leading-5 text-gray-900">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      </div>
    </div>
    </section>
  );
}
