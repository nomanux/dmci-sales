import { UserCheckIcon, XIcon } from "./icons";
import Button from "./Button";

/**
 * RegisterCrfModal — "Register CRF for Lottery" confirmation modal, opened
 * by clicking the "Register" action in the Lottery Registration table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:175687.
 */

export interface RegisterCrfDetails {
  crfNumber: string;
  clientName: string;
  sellerName: string;
  crfExpiry: string;
}

export default function RegisterCrfModal({
  details,
  onCancel,
  onConfirm,
}: {
  details: RegisterCrfDetails;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-[2px] p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Register CRF for Lottery"
      onClick={onCancel}
    >
      <div className="flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary-500">
            <UserCheckIcon className="h-5 w-5" />
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-gray-900">Register CRF for Lottery</h2>
          <p className="text-sm text-gray-500">Confirm the CRF details below registering</p>
        </div>

        <dl className="grid grid-cols-[130px_1fr] gap-y-2 text-sm">
          <dt className="text-gray-500">CRF Number</dt>
          <dd className="text-gray-900 before:mr-2 before:text-gray-500 before:content-[':']">{details.crfNumber}</dd>
          <dt className="text-gray-500">Client Name</dt>
          <dd className="text-gray-900 before:mr-2 before:text-gray-500 before:content-[':']">{details.clientName}</dd>
          <dt className="text-gray-500">Seller Name</dt>
          <dd className="text-gray-900 before:mr-2 before:text-gray-500 before:content-[':']">{details.sellerName || "-"}</dd>
          <dt className="text-gray-500">CRF Expiry</dt>
          <dd className="text-gray-900 before:mr-2 before:text-gray-500 before:content-[':']">{details.crfExpiry}</dd>
        </dl>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
