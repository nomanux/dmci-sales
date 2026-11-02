import { useState, type ReactNode } from "react";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select from "./Select";
import StepHeader from "./StepHeader";

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

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="flex gap-0.5 text-sm font-medium leading-5 text-gray-700">
        {label}
        {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
    </div>
  );
}

export default function BuyerPropertyStep() {
  const [buyerType, setBuyerType] = useState("primary");
  const [buyerClassification, setBuyerClassification] = useState<string>();
  const [reservationDate, setReservationDate] = useState<string>();

  return (
    <section className="form-lg w-full md:max-h-full bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader title="Buyer & Property Information" className="px-4 md:px-8 pt-6 pb-6">
        Review and confirm buyer type and property details for this reservation.
      </StepHeader>

      {/* Only the card body scrolls; the title stays put. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
      <div className="px-4 md:px-8 pb-6 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-3 items-start">
          <Field label="Buyer Type" required>
            <Select
              size="sm"
              aria-label="Buyer Type"
              placeholder="Select buyer type"
              options={BUYER_TYPES}
              value={buyerType}
              onChange={setBuyerType}
            />
          </Field>
          <Field label="Buyer Classification" required>
            <Select
              size="sm"
              aria-label="Buyer Classification"
              options={BUYER_CLASSIFICATIONS}
              value={buyerClassification}
              onChange={setBuyerClassification}
            />
          </Field>
          <Field label="Control Number (RA No.)">
            <Input size="sm" aria-label="Control Number (RA No.)" placeholder="-" disabled />
          </Field>
        </div>

        {/* Reservation Agreement */}
        <div className="bg-reservation-bg flex flex-col px-1.5 pb-1.5 rounded-2xl">
          <h3 className="m-0 py-1.5 text-center text-base font-semibold text-reservation-heading">
            Reservation Agreement
          </h3>
          <div className="bg-white flex flex-col md:flex-row md:items-center gap-3 md:gap-5 px-4 md:px-5 py-3 rounded-lg">
            <div className="flex flex-col gap-0.5 md:w-[283px] shrink-0">
              <span className="flex gap-0.5 text-sm font-semibold leading-5 text-gray-700">
                Date of Reservation
                <span className="font-medium text-brand-600">*</span>
              </span>
              <p className="m-0 text-xs leading-[18px] text-gray-700">This is subject to validation of payment.</p>
            </div>
            <div className="w-full md:w-[301px]">
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

        {/* Property Information */}
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-lg font-semibold leading-7 text-brand-500">Property Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-3 items-start">
            {PROPERTY_DETAILS.map((detail) => (
              <Field key={detail.label} label={detail.label}>
                <Input size="sm" aria-label={detail.label} value={detail.value} readOnly disabled />
              </Field>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
