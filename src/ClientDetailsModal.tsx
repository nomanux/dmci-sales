import { CheckSquareIcon, XIcon } from "./icons";
import Button from "./Button";

/**
 * ClientDetailsModal — "View Client" modal opened by clicking the eye
 * ("Actions") icon in the Clients table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 172025:276541.
 */

export interface ClientDetails {
  address: string;
  registrationDate: string;
  expirationDate: string;
  contactNumber: string;
  emailAddress: string;
  customerGroup: string;
  sourceOfAwareness: string[];
}

export default function ClientDetailsModal({ client, onClose }: { client: ClientDetails; onClose: () => void }) {
  // The design lays these out in three columns, top to bottom then wrapping.
  const columns: string[][] = [[], [], []];
  client.sourceOfAwareness.forEach((item, index) => columns[index % 3].push(item));
  const rows = Math.max(...columns.map((c) => c.length));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-[2px] p-6"
      role="dialog"
      aria-modal="true"
      aria-label="View Client"
      onClick={onClose}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">View Client</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-5">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-sm font-medium text-gray-900">{client.address}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Registration Date</span>
                <span className="text-sm font-medium text-gray-900">{client.registrationDate}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Expiration Date</span>
                <span className="text-sm font-medium text-gray-900">{client.expirationDate}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Contact Number</span>
                <span className="text-sm font-medium text-gray-900">{client.contactNumber}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Email Address</span>
                <span className="text-sm font-medium text-gray-900">{client.emailAddress}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Customer Group:</span>
              <span className="rounded-full border border-primary-50 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-primary-500">
                {client.customerGroup}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900">Source of Awareness</h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
              {Array.from({ length: rows }).map((_, rowIndex) =>
                columns.map((col, colIndex) =>
                  col[rowIndex] ? (
                    <div key={colIndex + "-" + rowIndex} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckSquareIcon className="h-4 w-4 shrink-0 text-primary-500" />
                      {col[rowIndex]}
                    </div>
                  ) : (
                    <div key={colIndex + "-" + rowIndex} />
                  )
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
