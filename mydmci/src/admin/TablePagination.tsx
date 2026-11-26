import chevronLeft from "../assets/icons/chevron-left.svg";
import chevronRight from "../assets/icons/chevron-right.svg";
import chevronDown from "../assets/icons/chevron-down.svg";

/**
 * Table footer: "Total N items", numbered pages with ••• gaps, page size.
 * Figma: DMCI-SID-Portal "Pagination" 163939:140183.
 */

const PAGE_SIZES = [10, 20, 50];

/** First, last, current ± 1, with "…" for gaps (a one-page gap shows the page). */
function pageNumbers(current: number, total: number): (number | "gap-start" | "gap-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "gap-start" | "gap-end")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push(start === 3 ? 2 : "gap-start");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(end === total - 2 ? total - 1 : "gap-end");
  pages.push(total);
  return pages;
}

const stepButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-2 hover:bg-[#fafafa] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent";

export default function TablePagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-4 rounded-b-xl bg-white px-6 py-4 text-sm leading-5"
    >
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap pr-2 text-black/85">Total {total} items</span>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={stepButton}
        >
          <img src={chevronLeft} alt="" width={16} height={16} className="block size-4" />
        </button>
        {pageNumbers(page, totalPages).map((p) =>
          typeof p === "number" ? (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onPageChange(p)}
              className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border border-solid px-[7px] ${
                p === page
                  ? "border-[#2b68e5] bg-[#fafafa] font-medium text-[#1448b3]"
                  : "border-transparent bg-transparent text-[#414651] hover:bg-[#fafafa]"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={p} aria-hidden className="flex size-8 items-center justify-center tracking-[2px] text-black/25">
              •••
            </span>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={stepButton}
        >
          <img src={chevronRight} alt="" width={16} height={16} className="block size-4" />
        </button>
      </div>

      <label className="relative flex h-8 w-[108px] items-center">
        <span className="sr-only">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-full w-full cursor-pointer appearance-none rounded-md border border-solid border-[#d9d9d9] bg-white py-1 pl-3 pr-8 text-sm leading-5 text-black/85 outline-none focus-visible:border-[#2b68e5]"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
        <img
          src={chevronDown}
          alt=""
          width={16}
          height={16}
          className="pointer-events-none absolute right-3 top-1/2 block size-4 -translate-y-1/2"
        />
      </label>
    </nav>
  );
}
