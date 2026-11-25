// RA form v4 step 5: optional supporting documents, after Live selfie and before Terms.
// Ported from Claude outputs/dmci-upload-additional-documents-themed.html.
import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { FileUploadIcon } from "hugeicons-react";
import StepHeaderV3 from "./StepHeaderV3";
import "./RepresentativeDetailsStepV3.css";

/**
 * Step 5 of the v4 RA form — "Upload Additional Documents" (optional).
 * Pick a type, then choose one file (or drop one file on the bar); it is
 * added under that type. One file per upload. Choose file stays off
 * until a type is picked.
 * Each file can change type, open in a preview, or be deleted after a
 * confirm. Nothing here blocks the shell's Next.
 */

export const DOCUMENT_TYPES = [
  "Birth Certificate",
  "SEC Registration",
  "Marriage Certificate",
] as const;
type DocType = (typeof DOCUMENT_TYPES)[number];

const MAX = 10 * 1024 * 1024;
const OK_EXT = ["jpeg", "jpg", "png", "webp", "heic", "pdf"];
const ACCEPT = ".jpeg,.jpg,.png,.webp,.heic,.pdf,image/jpeg,image/png,image/webp,image/heic,application/pdf";

const ext = (n: string) => n.split(".").pop()?.toLowerCase() ?? "";
const tag = (n: string) => (ext(n) === "pdf" ? "PDF" : ext(n) === "jpeg" ? "JPG" : ext(n).toUpperCase());
const fmtSize = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");


/** Type tag on a document row: opens a small menu to move the file to another type. */
function RowTypeMenu({
  value,
  fileName,
  disabled,
  onChange,
}: {
  value: DocType;
  fileName: string;
  disabled?: boolean;
  onChange: (c: DocType) => void;
}) {
  const [open, setOpen] = useState(false);
  // Fixed position from the tag's box; flips above when there's no room below.
  // When up, `top` holds the distance from the viewport bottom.
  const [pos, setPos] = useState<{ top: number; right: number; up: boolean } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const MENU_H = 8 + DOCUMENT_TYPES.length * 40;

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const up = window.innerHeight - r.bottom < MENU_H + 12 && r.top > MENU_H + 12;
    setPos({ top: up ? window.innerHeight - r.top + 6 : r.bottom + 6, right: window.innerWidth - r.right, up });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    // The menu is fixed, so close it when the page or a parent scrolls.
    const close = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  useEffect(() => {
    if (open && pos) menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
  }, [open, pos]);

  const onKey = (e: KeyboardEvent) => {
    const opts = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [])];
    const i = opts.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") { e.preventDefault(); opts[Math.min(i + 1, opts.length - 1)]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); opts[Math.max(i - 1, 0)]?.focus(); }
    if (e.key === "Escape") { e.stopPropagation(); setOpen(false); btnRef.current?.focus(); }
  };

  return (
    <div ref={wrapRef} className="relative flex-none">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Document type for ${fileName}: ${value}`}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-7 max-w-[180px] items-center gap-1.5 rounded-full border border-solid px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-default ${
          open ? "border-brand-400 bg-brand-25 text-brand-600" : "border-[#c7d7fe] bg-brand-25 text-brand-600 enabled:cursor-pointer enabled:hover:border-brand-400"
        }`}
      >
        <span className="truncate">{value}</span>
        <svg className={`flex-none transition-transform ${open ? "rotate-180" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {createPortal(
      <AnimatePresence>
        {open && pos && (
          <motion.div
            ref={menuRef}
            role="listbox"
            aria-label="Document type"
            onKeyDown={onKey}
            style={pos.up ? { position: "fixed", right: pos.right, bottom: pos.top } : { position: "fixed", right: pos.right, top: pos.top }}
            initial={{ opacity: 0, y: pos.up ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: pos.up ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={`z-[45] flex w-56 ${pos.up ? "origin-bottom-right" : "origin-top-right"} flex-col gap-1 rounded-lg border border-solid border-gray-200 bg-white p-1.5 shadow-[0_12px_16px_-4px_#0a0d1214,0_4px_6px_-2px_#0a0d1208]`}
          >
            {DOCUMENT_TYPES.map((c) => {
              const on = c === value;
              return (
                <button
                  key={c}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => {
                    setOpen(false);
                    if (!on) onChange(c);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-0 px-2.5 py-2 text-left text-[13px] font-medium text-gray-900 outline-none ${
                    on ? "bg-brand-25" : "bg-transparent hover:bg-gray-50 focus-visible:bg-gray-50"
                  }`}
                >
                  <span className="flex-1 truncate">{c}</span>
                  {on && (
                    <svg className="flex-none text-brand-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

/** File icon from the design (document with a paperclip), used on each document row. */
function DocFileIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.3307 4.66634V4.53301C13.3307 3.4129 13.3307 2.85285 13.1127 2.42503C12.921 2.0487 12.615 1.74274 12.2387 1.55099C11.8109 1.33301 11.2508 1.33301 10.1307 1.33301H5.86406C4.74396 1.33301 4.1839 1.33301 3.75608 1.55099C3.37976 1.74274 3.0738 2.0487 2.88205 2.42503C2.66406 2.85285 2.66406 3.4129 2.66406 4.53301V11.4663C2.66406 12.5864 2.66406 13.1465 2.88205 13.5743C3.0738 13.9506 3.37976 14.2566 3.75608 14.4484C4.1839 14.6663 4.74396 14.6663 5.86406 14.6663H8.33073M8.33073 7.33301H5.33073M7.66406 9.99967H5.33073M10.6641 4.66634H5.33073M11.9974 11.9997V8.33301C11.9974 7.78072 12.4451 7.33301 12.9974 7.33301C13.5497 7.33301 13.9974 7.78072 13.9974 8.33301V11.9997C13.9974 13.1042 13.102 13.9997 11.9974 13.9997C10.8928 13.9997 9.9974 13.1042 9.9974 11.9997V9.33301"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Item = {
  id: number;
  file: File;
  cat: DocType;
  other: string;
  url: string;
  isNew: boolean;
  /** Upload state (simulated until the API exists). */
  uploading: boolean;
  progress: number;
  /** Bytes per second, for the time-left estimate. */
  speed: number;
  /** Shows a tick next to the size for a moment after upload. */
  justDone: boolean;
};

const timeLeft = (i: Item) => {
  if (!i.speed || i.progress >= 100) return "";
  const sec = Math.ceil((i.file.size * (1 - i.progress / 100)) / i.speed);
  return sec < 60 ? `${sec} sec left` : `${Math.ceil(sec / 60)} min left`;
};
type Modal = { kind: "preview" | "delete"; id: number } | null;

const label = (i: Item) => i.cat;

export default function AdditionalDocumentsStepV4() {
  const [sel, setSel] = useState<DocType | "">("");
  const [items, setItems] = useState<Item[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [nudge, setNudge] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [toastText, setToastText] = useState<{ text: string; key: number } | null>(null);

  const uid = useRef(0);
  const pickerRef = useRef<HTMLInputElement>(null);
  const tbtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;


  const toast = (text: string) => setToastText({ text, key: Date.now() });
  useEffect(() => {
    if (!toastText) return;
    const t = setTimeout(() => setToastText(null), 2400);
    return () => clearTimeout(t);
  }, [toastText]);

  // Free preview URLs when the step unmounts.
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  // Close the type menu on an outside click; focus the selected option on open.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    const opts = menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]");
    const selected = menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    (selected ?? opts?.[0])?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  // Add files under the picked type; the type resets for the next upload.
  const commit = (files: File[], cat: DocType) => {
    const added = files.map((f) => ({ id: ++uid.current, file: f, cat, other: "", url: URL.createObjectURL(f), isNew: true, uploading: true, progress: 0, speed: 0, justDone: false }));
    setItems((prev) => [...prev.map((i) => ({ ...i, isNew: false })), ...added]);
    toast(`Uploading ${files[0].name} to ${cat}`);
    setSel("");
  };

  const pickType = (c: DocType) => {
    setSel(c);
    setErrors([]);
    setMenuOpen(false);
  };

  const take = (list: File[]) => {
    if (!list.length) return;
    // One file at a time: a drop with several files is refused.
    if (list.length > 1) {
      setErrors(["Upload one file at a time."]);
      return;
    }
    // A type comes first (Choose file is off until then; this covers drops).
    if (!sel) {
      setErrors(["Select a document type first."]);
      setNudge((n) => n + 1);
      return;
    }
    const errs: string[] = [];
    const ok: File[] = [];
    list.forEach((f) => {
      if (!OK_EXT.includes(ext(f.name))) errs.push(`${f.name}: only JPEG, JPG, PNG, WebP, HEIC or PDF files are allowed.`);
      else if (f.size > MAX) errs.push(`${f.name}: ${fmtSize(f.size)} is over the 10 MB limit.`);
      else if (!f.size) errs.push(`${f.name}: file is empty.`);
      else ok.push(f);
    });
    setErrors(errs);
    if (ok.length) commit(ok, sel);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    take([...e.dataTransfer.files]);
  };

  // Stop a file dropped outside the bar from opening in the tab.
  useEffect(() => {
    const stop = (e: globalThis.DragEvent) => e.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  const onMenuKey = (e: KeyboardEvent) => {
    const opts = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [])];
    const i = opts.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") { e.preventDefault(); opts[Math.min(i + 1, opts.length - 1)]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); opts[Math.max(i - 1, 0)]?.focus(); }
    if (e.key === "Escape") { setMenuOpen(false); tbtnRef.current?.focus(); }
  };

  // Simulated upload at about 1.5 to 2.5 MB per second. Swap for the real
  // request's progress events once the upload API exists.
  const anyUploading = items.some((i) => i.uploading);
  useEffect(() => {
    if (!anyUploading) return;
    const t = setInterval(() => {
      setItems((prev) =>
        prev.map((i) => {
          if (!i.uploading) return i;
          const speed = (1.5 + Math.random()) * 1048576;
          const progress = Math.min(100, i.progress + ((speed * 0.25) / i.file.size) * 100);
          return progress >= 100
            ? { ...i, progress: 100, speed, uploading: false, justDone: true, isNew: false }
            : { ...i, progress, speed, isNew: false };
        }),
      );
    }, 250);
    return () => clearInterval(t);
  }, [anyUploading]);

  // Announce each finished upload once, then drop its tick after 2.5 s.
  const announced = useRef(new Set<number>());
  useEffect(() => {
    items.forEach((i) => {
      if (!i.justDone || announced.current.has(i.id)) return;
      announced.current.add(i.id);
      toast(`${i.file.name} uploaded`);
      setTimeout(() => setItems((prev) => prev.map((x) => (x.id === i.id ? { ...x, justDone: false } : x))), 2500);
    });
  }, [items]);

  const cancelUpload = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    URL.revokeObjectURL(it.url);
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast(`Upload cancelled: ${it.file.name}`);
  };

  const moveTo = (id: number, c: DocType) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cat: c, other: "", isNew: true } : { ...i, isNew: false })));
    toast(`Moved to ${c}`);
  };

  const doDelete = (id: number) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((x) => x.id !== id);
    });
    setModal(null);
    toast("File deleted");
  };

  const modalItem = modal ? items.find((i) => i.id === modal.id) : undefined;

  return (
    <section className="antialiased w-full md:max-h-full rd-v3 flex flex-col px-4 pt-4 md:px-0 md:pt-0">
      <StepHeaderV3 hideStep step={5} total={9} icon={FileUploadIcon} title="Upload Additional Documents" className="flex-shrink-0 pb-6">
        Add supporting documents to help process your application. You can skip this step and submit them later.
      </StepHeaderV3>

      <div className="flex min-h-0 flex-col overflow-hidden bg-white md:flex-1 md:rounded-xl md:border md:border-solid md:border-gray-200">
        <div className="flex flex-col px-4 py-6 text-sm leading-5 text-gray-700 md:flex-1 md:min-h-0 md:overflow-y-auto md:px-8 [scrollbar-width:thin] [scrollbar-color:#d0d5dd_transparent]">
          {/* Composer: type picker + file button in one bar; files can be dropped on it. */}
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
            onDrop={onDrop}
            className={`flex h-[52px] items-center gap-1 rounded-lg border border-solid p-1 shadow-[0_1px_2px_#0a0d120d] transition ${
              dragOver ? "border-brand-400 bg-brand-25 shadow-[0_0_0_4px_#0a4dd71f]" : "border-gray-300 bg-white"
            }`}
          >
            <div ref={wrapRef} className="relative h-full min-w-0 flex-1">
              <motion.button
                key={nudge}
                ref={tbtnRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                animate={nudge ? { backgroundColor: ["rgba(255,250,235,0)", "#FFFAEB", "rgba(255,250,235,0)", "#FFFAEB", "rgba(255,250,235,0)"] } : undefined}
                transition={{ duration: 1 }}
                className={`flex h-full w-full cursor-pointer items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 text-left hover:bg-gray-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[rgba(26,86,219,.25)] ${
                  sel ? "font-semibold text-gray-900" : "text-gray-500"
                }`}
              >
                <span className="grid size-7 flex-none place-items-center rounded-md bg-gray-100 text-gray-500">
                  <DocFileIcon size={16} />
                </span>
                <span className="min-w-0 flex-1 truncate">{sel || "Select document type"}</span>
                <svg className={`flex-none text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </motion.button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    ref={menuRef}
                    role="listbox"
                    aria-label="Document type"
                    onKeyDown={onMenuKey}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -left-1 top-[calc(100%+8px)] z-20 flex max-h-80 flex-col gap-1 w-[min(340px,calc(100vw-32px))] overflow-auto rounded-lg border border-solid border-gray-200 bg-white p-1.5 shadow-[0_20px_24px_-4px_#0a0d1214,0_8px_8px_-4px_#0a0d1208]"
                  >
                    {DOCUMENT_TYPES.map((c) => {
                      const on = c === sel;
                      return (
                        <button
                          key={c}
                          type="button"
                          role="option"
                          aria-selected={on}
                          onClick={() => pickType(c)}
                          className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-0 px-3 py-2.5 text-left text-sm font-medium text-gray-900 outline-none ${
                            on ? "bg-brand-25" : "bg-transparent hover:bg-brand-25 focus-visible:bg-brand-25"
                          }`}
                        >
                          <span className="flex-1">{c}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="h-7 w-px flex-none bg-gray-200" />
            <button
              type="button"
              onClick={() => pickerRef.current?.click()}
              disabled={!sel}
              title={sel ? undefined : "Select a document type first"}
              className="flex h-full flex-none cursor-pointer items-center gap-2 rounded-lg border-0 bg-brand-600 px-3.5 font-semibold text-white shadow-[0_1px_2px_#0a0d120d,inset_0_-2px_0_#0a0d120d,inset_0_0_0_1px_#0a0d122e] enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[#8a9cc6] disabled:shadow-none sm:px-[18px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[rgba(26,86,219,.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
              <span className="max-sm:sr-only">Choose file</span>
            </button>
            <input
              ref={pickerRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                take([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
          </div>

          <p className="m-0 mt-2 text-xs text-gray-500">JPEG, JPG, PNG, WebP, HEIC or PDF • Max 10 MB</p>

          {errors.length > 0 && (
            <div role="alert" className="mt-2 flex items-start gap-2 rounded-lg border border-solid border-[#fecdca] bg-[#fef3f2] px-2.5 py-2 text-xs text-[#b42318]">
              <span aria-hidden="true">⚠</span>
              <div className="flex-1">{errors.map((e) => <div key={e}>{e}</div>)}</div>
              <button type="button" aria-label="Dismiss" onClick={() => setErrors([])} className="grid size-[22px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-sm text-gray-500 hover:bg-white hover:text-error-500">×</button>
            </div>
          )}

          {/* Upload tips: amber note with a left bar, as in the design. */}
          <div role="note" className="mt-5 rounded-lg border-0 border-l-[3px] border-solid border-[#F79009] bg-[#FFFAEB] px-4 py-3">
            <p className="m-0 text-[13px] font-semibold leading-5 text-[#B54708]">Important</p>
            <ul className="m-0 mt-1 flex list-none flex-col gap-0.5 p-0 text-[13px] leading-5 text-[#B54708]">
              {["Make sure documents are clear, complete and readable."].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* List */}
          <div className="mb-2.5 mt-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 text-base font-semibold text-gray-900">Your documents</h3>
          </div>
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-[#fdfdfd] px-4 py-7 text-center text-gray-500">No documents yet. Pick a type and upload a file above.</div>
          ) : (
            <ul className="m-0 list-none rounded-xl border border-solid border-gray-200 p-0">
              {items.map((i) => (
                <motion.li
                  key={`${i.id}-${i.cat}`}
                  initial={i.isNew ? { backgroundColor: i.uploading ? "#f9fafb" : "#ecfdf3" } : false}
                  animate={{ backgroundColor: i.uploading ? "#f9fafb" : "#ffffff" }}
                  transition={{ duration: i.uploading ? 0.2 : 1.4 }}
                  className="flex items-center gap-3 border-0 border-b border-solid border-gray-200 px-3.5 py-3 first:rounded-t-xl last:rounded-b-xl last:border-b-0"
                >
                  {i.uploading ? (
                    <>
                      <span className="grid size-9 flex-none place-items-center rounded-lg bg-gray-100 text-gray-500">
                        <DocFileIcon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-gray-900" title={i.file.name}>{i.file.name}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs leading-[18px]">
                          <span className="size-3.5 flex-none animate-spin rounded-full border-2 border-solid border-[#98b9ff] border-t-brand-400" aria-hidden="true" />
                          <b className="font-semibold text-brand-500">Uploading…</b>
                          <span className="text-gray-600 tabular-nums">{timeLeft(i)}</span>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`Uploading ${i.file.name}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(i.progress)}
                          className="mt-2 flex max-w-[480px] items-center gap-4"
                        >
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#dbe6ff]">
                            <div className="h-full rounded-full bg-brand-500 transition-[width] duration-[250ms] ease-linear" style={{ width: `${i.progress}%` }} />
                          </div>
                          <span className="min-w-10 text-right text-sm font-medium text-gray-700 tabular-nums">{Math.round(i.progress)}%</span>
                        </div>
                      </div>
                      <RowTypeMenu value={i.cat} fileName={i.file.name} disabled={i.uploading} onChange={(c) => moveTo(i.id, c)} />
                      <button type="button" title="Cancel upload" aria-label={`Cancel upload of ${i.file.name}`} onClick={() => cancelUpload(i.id)} className="grid size-9 flex-none cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-500 hover:bg-[#fef3f2] hover:text-error-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <>
                  <span className="grid size-9 flex-none place-items-center rounded-lg bg-gray-100 text-gray-500" title={tag(i.file.name)}>
                    <DocFileIcon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-gray-900" title={i.file.name}>{i.file.name}</div>
                    <div className="mt-[3px] flex items-center gap-2">
                      <small className="text-xs text-gray-500">{fmtSize(i.file.size)}</small>
                      {i.justDone && (
                        <span title="Uploaded" className="inline-flex text-success-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-label="Uploaded"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                      )}
                    </div>
                  </div>
                  <RowTypeMenu value={i.cat} fileName={i.file.name} disabled={i.uploading} onChange={(c) => moveTo(i.id, c)} />
                  <div className="flex flex-none items-center gap-0.5">
                    <button type="button" title="View" aria-label={`View ${i.file.name}`} onClick={() => setModal({ kind: "preview", id: i.id })} className="grid size-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-500 hover:bg-brand-25 hover:text-brand-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button type="button" title="Delete" aria-label={`Delete ${i.file.name}`} onClick={() => setModal({ kind: "delete", id: i.id })} className="grid size-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-500 hover:bg-[#fef3f2] hover:text-error-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                    </button>
                  </div>
                    </>
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Preview and delete dialogs */}
      <AnimatePresence>
        {modal && modalItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(16,24,40,.55)] sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={modal.kind === "preview" ? `Preview ${modalItem.file.name}` : "Delete file"}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className={`relative w-full rounded-t-xl bg-white shadow-[0_20px_24px_-4px_#0a0d1214] sm:rounded-xl ${modal.kind === "preview" ? "p-5 sm:w-[880px]" : "px-6 pb-6 pt-8 text-center sm:w-[400px]"}`}
            >
              <button type="button" aria-label="Close" onClick={() => setModal(null)} className="absolute right-3.5 top-3 size-9 cursor-pointer border-0 bg-transparent text-[22px] text-gray-400">×</button>
              {modal.kind === "preview" ? (
                <>
                  <div className="mb-3 mr-10 break-all">
                    <b className="text-gray-900">{modalItem.file.name}</b>{" "}
                    <span className="text-xs text-gray-500">· {fmtSize(modalItem.file.size)} · {label(modalItem)}</span>
                  </div>
                  <div className="flex h-[65vh] items-center justify-center overflow-auto rounded-[10px] bg-[#F2F4F7] sm:h-[70vh]">
                    {ext(modalItem.file.name) === "pdf" ? (
                      <iframe src={modalItem.url} title="PDF preview" className="size-full rounded-[10px] border-0" />
                    ) : (
                      <img src={modalItem.url} alt={modalItem.file.name} className="max-h-full max-w-full" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[#fef3f2] text-error-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                  </div>
                  <h3 className="m-0 mb-2 text-lg font-semibold text-gray-900">Delete file?</h3>
                  <p className="m-0 leading-normal text-gray-700">{modalItem.file.name} will be removed from {label(modalItem)}.</p>
                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => setModal(null)} className="h-10 flex-1 cursor-pointer rounded-lg border border-solid border-gray-300 bg-white font-semibold text-gray-700 shadow-[0_1px_2px_#0a0d120d]">Cancel</button>
                    <button type="button" onClick={() => doDelete(modalItem.id)} className="h-10 flex-1 cursor-pointer rounded-lg border border-solid border-[#d92d20] bg-[#d92d20] font-semibold text-white">Delete</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            key={toastText.key}
            role="status"
            initial={{ opacity: 0, y: -8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -8, x: "-50%" }}
            className="fixed left-1/2 top-5 z-[60] max-w-[calc(100%-32px)] rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white shadow-[0_12px_24px_rgba(16,24,40,.2)]"
          >
            {toastText.text}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
