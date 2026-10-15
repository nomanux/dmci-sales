import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import Select from "./Select";

/**
 * Pagination — the "Total N items … 10 / page" footer repeated at the
 * bottom of every table screen. Fully interactive (real page state, real
 * prev/next/page-size behavior), not a static decoration.
 * Desktop (sm+) matches the web pagination bar exactly: Figma file
 * NcMe5sSgPs65q3Ed2rV1Kv, node 173424:195170 — one centered row (Total N
 * items, prev, numbered pages with "•••" ellipsis, next, page-size select).
 * Below sm there's no Figma spec for this control, so it falls back to a
 * "Page X of Y" jump-to-page control (matches the uploaded pagination.html
 * reference) since the numbered row doesn't fit a phone width.
 */

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
];

/**
 * First page, last page, current page ± 1 neighbor, "…" filling any gaps.
 * A gap of a single page shows that page instead of "…" (9 pages on page 6:
 * 1 … 5 6 7 8 9, not 1 … 5 6 7 9).
 */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push(start === 3 ? 2 : "...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(end === total - 2 ? total - 1 : "...");
  pages.push(total);
  return pages;
}

export default function Pagination({
  total,
  defaultPage = 6,
  defaultPageSize = 10,
}: {
  total: number;
  defaultPage?: number;
  defaultPageSize?: number;
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [page, setPage] = useState(() => Math.min(defaultPage, totalPages));
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState(String(page));
  const jumpInputRef = useRef<HTMLInputElement>(null);

  // Clamp the current page if a page-size change (or a fresh `total`) makes
  // it fall past the new last page.
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (jumpOpen) {
      jumpInputRef.current?.focus();
      jumpInputRef.current?.select();
    }
  }, [jumpOpen]);

  const goTo = (next: number) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  };

  const openJump = () => {
    setJumpValue(String(page));
    setJumpOpen(true);
  };

  const submitJump = () => {
    const value = Number(jumpValue);
    if (Number.isInteger(value) && value >= 1 && value <= totalPages) {
      setPage(value);
    }
    setJumpOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 bg-white px-4 py-1.5 text-xs sm:flex-nowrap">
      {/* Mobile: prev/next + a "Page X of Y" control that opens a jump-to-page box. */}
      <div className="flex w-full items-center justify-between gap-2 sm:hidden">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => goTo(page - 1)}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>

          {jumpOpen ? (
            <div className="flex flex-1 items-center justify-center gap-1.5">
              <input
                ref={jumpInputRef}
                type="number"
                min={1}
                max={totalPages}
                inputMode="numeric"
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitJump();
                  if (e.key === "Escape") setJumpOpen(false);
                }}
                className="h-7 w-12 rounded border border-primary-500 text-center text-xs text-gray-900 outline-none"
              />
              <span className="whitespace-nowrap text-xs text-gray-500">
                of {totalPages}
              </span>
              <button
                type="button"
                onClick={submitJump}
                className="h-7 shrink-0 cursor-pointer rounded bg-primary-600 px-2.5 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Go
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openJump}
              className="flex h-7 cursor-pointer items-center justify-center gap-1 rounded border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-700 hover:bg-gray-100"
            >
              Page <b className="font-semibold text-gray-900">{page}</b> of{" "}
              {totalPages}
              <ChevronDownIcon className="h-3 w-3 text-gray-400" />
            </button>
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => goTo(page + 1)}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

      {/* Desktop: Figma node 173424:195170 — one centered row, Total N items
          grouped together with the numbered nav, "•••" ellipsis, then a
          16px gap before the page-size select. */}
      <div className="hidden items-center gap-1 sm:flex">
        <span className="whitespace-nowrap pr-2 text-xs text-gray-600">Total {total} items</span>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => goTo(page - 1)}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeftIcon className="h-3 w-3" />
        </button>
        {getPageNumbers(page, totalPages).map((p, index) =>
          p === "..." ? (
            <span key={"dots-" + index} className="flex h-6 w-5 items-center justify-center tracking-[1px] text-[10px] text-gray-400">
              •••
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              aria-current={p === page ? "page" : undefined}
              className={
                "flex h-6 min-w-6 cursor-pointer items-center justify-center rounded px-1 text-xs leading-none " +
                (p === page
                  ? "border border-primary-500 bg-white font-semibold text-primary-500"
                  : "border border-transparent text-gray-700 hover:bg-gray-100")
              }
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => goTo(page + 1)}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRightIcon className="h-3 w-3" />
        </button>
      </div>

      <div className="hidden w-[100px] shrink-0 pl-1 sm:block">
        <Select
          size="xs"
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
          aria-label="Rows per page"
        />
      </div>
    </div>
  );
}
