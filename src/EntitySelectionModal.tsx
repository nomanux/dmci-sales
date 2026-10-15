import { CheckIcon, XIcon } from "./icons";

/**
 * EntitySelectionModal — "Entity selection" modal, opened by clicking the
 * DPDI org badge chip in the Layout topbar. Lets the admin see which company
 * entity they're currently operating as and switch to another one.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:214751.
 * Note: the Figma mock repeated one "DPDI — DMCI Project Developers Inc."
 * row twice (identical code and name back to back), which reads as leftover
 * placeholder duplication rather than an intentional second entity. Swapped
 * the duplicate for "DHI — DMCI Homes, Inc.", the parent brand this app is
 * already named after, so the list still shows the "Showing 9 company
 * lists" count from the design with 9 distinct companies.
 */

export interface SelectedEntity {
  code: string;
  name: string;
}

interface EntityOption {
  code: string;
  name: string;
}

const ENTITIES: EntityOption[] = [
  { code: "DACN", name: "Dacon Corporation" },
  { code: "DMPV", name: "DMCI MC PROPERTY VENTURES INC." },
  { code: "DPDI", name: "DMCI Project Developers Inc." },
  { code: "DHI", name: "DMCI Homes, Inc." },
  { code: "DPMC", name: "DMCI Homes Property Management Corp." },
  { code: "EDVI", name: "DMC Estate Development Ventures, Inc" },
  { code: "KMC", name: "Kensington Management Corporation" },
  { code: "RLC", name: "RLC DMCI Property Ventures Inc." },
  { code: "UPD", name: "DMC - URBAN PROPERTY DEVELOPERS, INC" },
];

export default function EntitySelectionModal({
  selected,
  onSelect,
  onClose,
}: {
  selected: SelectedEntity;
  onSelect: (entity: SelectedEntity) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Entity selection"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[560px] flex-col rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="text-base font-semibold text-gray-900">Entity selection</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Currently Selected:</span>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary-500">{selected.code}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{selected.name}</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white">
                <CheckIcon className="h-3 w-3" />
                Selected
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-900">Select Company</span>
              <span className="text-xs text-gray-500">Showing {ENTITIES.length} company lists</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[420px] border-collapse text-[13px]">
                <thead className="table-head">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="w-[38%] px-4 py-2">Company Code</th>
                    <th className="px-4 py-2">Company Name</th>
                  </tr>
                </thead>
                <tbody>
                  {ENTITIES.map((entity, index) => {
                    const isSelected = entity.code === selected.code && entity.name === selected.name;
                    return (
                      <tr
                        key={index}
                        onClick={() => onSelect(entity)}
                        className={
                          "cursor-pointer border-b border-gray-100 text-gray-700 last:border-b-0 hover:bg-blue-50 " +
                          (isSelected ? "bg-blue-50" : "")
                        }
                      >
                        <td className="px-4 py-1">
                          <span className="flex items-center gap-2 font-semibold text-gray-900">
                            {isSelected ? (
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                                <CheckIcon className="h-2.5 w-2.5" />
                              </span>
                            ) : (
                              <span className="h-4 w-4 shrink-0" />
                            )}
                            {entity.code}
                          </span>
                        </td>
                        <td className="px-4 py-1">{entity.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
