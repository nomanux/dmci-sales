import { useEffect, useRef, useState } from "react";
import Button from "./Button";
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
 * already named after, so the list still shows 9 distinct companies.
 *
 * Layout: the current company is pinned above the list (it never scrolls
 * away) and tagged "Current" in the list, which opens scrolled to it.
 * Clicking a row only marks it; "Switch company" confirms and Cancel backs
 * out, so the modal never disappears from under a click.
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
  // The row marked in the list; only applied when "Switch company" is pressed.
  const [pending, setPending] = useState(selected.code);
  const currentRef = useRef<HTMLButtonElement>(null);

  const pendingEntity = ENTITIES.find((e) => e.code === pending);
  const changed = pending !== selected.code;

  // Open scrolled to (and focused on) the current company; Escape closes.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
    currentRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function confirm() {
    if (pendingEntity && changed) onSelect(pendingEntity);
    onClose();
  }

  // Up/Down move between rows without leaving the list.
  function handleListKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const i = rows.indexOf(document.activeElement as HTMLButtonElement);
    const next = rows[e.key === "ArrowDown" ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0)];
    next?.focus();
    e.preventDefault();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entity-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[600px] flex-col overflow-hidden rounded-xl bg-white shadow-xl antialiased"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="entity-title" className="m-0 text-lg font-semibold leading-7 text-gray-900">
              Switch company
            </h2>
            <p className="m-0 text-sm leading-5 text-gray-500">
              Lists and reports will show data for the company you choose.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Pinned: always visible, however far the list is scrolled. */}
        <div className="shrink-0 px-5 pb-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-md bg-brand-600 text-xs font-semibold tracking-wide text-white">
              {selected.code}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs leading-[18px] text-gray-500">Current company</span>
              <span className="truncate text-sm font-semibold text-gray-900">{selected.name}</span>
            </div>
          </div>
        </div>

        {/* Scrolls when the list is taller than the screen allows. */}
        <div
          role="radiogroup"
          aria-label="Companies"
          onKeyDown={handleListKey}
          className="flex max-h-[min(400px,50vh)] min-h-0 flex-col gap-1 overflow-y-auto border-t border-gray-100 px-3 py-2 sm:px-4"
        >
          {ENTITIES.map((entity) => {
            const isCurrent = entity.code === selected.code;
            const isPending = entity.code === pending;
            return (
              <button
                key={entity.code}
                ref={isCurrent ? currentRef : undefined}
                type="button"
                role="radio"
                aria-checked={isPending}
                onClick={() => setPending(entity.code)}
                onDoubleClick={() => {
                  setPending(entity.code);
                  if (entity.code !== selected.code) onSelect(entity);
                  onClose();
                }}
                className={
                  "flex w-full shrink-0 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors " +
                  (isPending ? "border-brand-600 bg-brand-25" : "border-transparent hover:bg-gray-50")
                }
              >
                <span
                  className={
                    "flex h-7 w-14 shrink-0 items-center justify-center rounded-md text-xs font-semibold tracking-wide " +
                    (isPending ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600")
                  }
                >
                  {entity.code}
                </span>
                <span
                  className={
                    "min-w-0 flex-1 truncate text-sm " +
                    (isPending ? "font-semibold text-brand-600" : "text-gray-700")
                  }
                >
                  {entity.name}
                </span>
                {isCurrent && (
                  <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
                    Current
                  </span>
                )}
                {isPending ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="h-5 w-5 shrink-0 rounded-full border border-gray-300 bg-white" />
                )}
              </button>
            );
          })}

        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:px-6">
          <p className="m-0 min-w-0 text-sm text-gray-500" aria-live="polite">
            {changed && pendingEntity ? (
              <>
                Switch to <span className="font-semibold text-gray-900">{pendingEntity.code}</span>
              </>
            ) : (
              "No change"
            )}
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="md" onClick={confirm} disabled={!changed}>
              Switch company
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
