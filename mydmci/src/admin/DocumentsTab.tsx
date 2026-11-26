import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircleIcon } from "@/icons";
import Button from "@/Button";
import sampleIdPhoto from "@/assets/dummyid.png";
import Badge from "./Badge";
import eye from "../assets/icons/eye.svg";

/**
 * Documents tab on the TIS details page: the four Docs-in documents with
 * their version and review status.
 * Figma: DMCI-SID-Portal, "RTO Application / Application details /
 * Documents" 164000:119891.
 *
 * Rows are the design's sample data. View opens a preview; only the IDs row
 * has a sample file until real uploads are wired in.
 */

type DocStatus = "Sufficient" | "Deficient" | "Submitted";

type Doc = { name: string; version: string; status: DocStatus; preview?: string };

const DOCUMENTS: Doc[] = [
  { name: "Reservation Agreement", version: "v1", status: "Sufficient" },
  { name: "Valid IDs, 3 specimen signatures", version: "v2", status: "Deficient", preview: sampleIdPhoto },
  { name: "Tenant Information Sheet", version: "v1", status: "Sufficient" },
  { name: "Proof of reservation payment", version: "v1", status: "Submitted" },
];

const th = "h-11 border-0 border-b border-solid border-[#e9eaeb] bg-[#fafafa] px-5 text-left text-xs font-semibold leading-[18px] text-[#717680]";
const td = "h-11 border-0 border-b border-solid border-[#e9eaeb] px-5 text-sm leading-5";

/** Centered preview window for a document or file. */
export function PreviewDialog({
  title,
  meta,
  preview,
  onClose,
}: {
  title: string;
  meta?: ReactNode;
  preview?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d12]/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-preview-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
        className="flex w-full max-w-lg flex-col gap-4 rounded-xl bg-white p-5 shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="doc-preview-title" className="m-0 text-base font-semibold leading-6 text-[#181d27]">
              {title}
            </h2>
            {meta && <div className="flex items-center gap-2 text-sm leading-5 text-[#535862]">{meta}</div>}
          </div>
        </div>
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-solid border-[#e9eaeb] bg-[#fafafa] p-4">
          {preview ? (
            <img src={preview} alt={title} className="block max-h-72 w-full object-contain" />
          ) : (
            <p className="m-0 text-center text-sm leading-5 text-[#717680]">No file preview in this prototype yet.</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" className="h-9" onClick={onClose} autoFocus>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocumentsTab() {
  const [viewing, setViewing] = useState<Doc | null>(null);

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="overflow-x-auto rounded-xl border border-solid border-[#e9eaeb]">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th scope="col" className={th}>Document</th>
              <th scope="col" className={`${th} w-[85px]`}>Version</th>
              <th scope="col" className={`${th} w-[116px]`}>Status</th>
              <th scope="col" className={`${th} w-[117px] text-center`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((doc) => (
              <tr key={doc.name} className="hover:bg-[#fafafa] [&:last-child>td]:border-b-0">
                <td className={`${td} font-medium text-[#181d27]`}>{doc.name}</td>
                <td className={`${td} text-[#535862]`}>{doc.version}</td>
                <td className={td}>
                  <Badge>{doc.status}</Badge>
                </td>
                <td className={`${td} px-4 text-center`}>
                  <button
                    type="button"
                    aria-label={`View ${doc.name}`}
                    onClick={() => setViewing(doc)}
                    className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-3 py-2 text-xs font-medium leading-[18px] text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#414651]"
                  >
                    <img src={eye} alt="" width={24} height={24} className="block size-6" />
                    <span className="px-0.5">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg bg-[#e8effe] px-3.5 py-3 text-sm leading-5 text-[#10398e]">
        <AlertCircleIcon className="mt-px size-[18px] shrink-0" />
        <div className="flex flex-col gap-0.5">
          <p className="m-0 font-semibold">When all 4 are sufficient</p>
          <p className="m-0">
            The documents are attached in D365 and the customer is updated from Non-Client. The application then moves to
            Credit review.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {viewing && (
          <PreviewDialog
            key={viewing.name}
            title={viewing.name}
            meta={
              <>
                {viewing.version}
                <Badge>{viewing.status}</Badge>
              </>
            }
            preview={viewing.preview}
            onClose={() => setViewing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
