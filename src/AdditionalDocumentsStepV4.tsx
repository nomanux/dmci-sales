// RA form v4 step 5: optional supporting documents, after Live selfie and before Terms.
// Ported from Claude outputs/dmci-upload-additional-documents-themed.html.
import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileAttachmentIcon, FileUploadIcon } from "hugeicons-react";
import StepHeaderV3 from "./StepHeaderV3";
import "./RepresentativeDetailsStepV3.css";

/**
 * Step 5 of the v4 RA form — "Upload Additional Documents" (optional).
 * Pick a type and a file in any order (or drop files on the bar); once both
 * are set the files are added under that type. "Others" asks for a name.
 * Each file can change type, open in a preview, or be deleted after a
 * confirm. Nothing here blocks the shell's Next.
 */

export const DOCUMENT_TYPES = [
  "Birth Certificate",
  "SEC Registration",
  "Marriage Certificate",
  "Others",
] as const;
type DocType = (typeof DOCUMENT_TYPES)[number];

const MAX = 20 * 1024 * 1024;
const OK_EXT = ["pdf", "jpg", "jpeg", "png"];
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const ext = (n: string) => n.split(".").pop()?.toLowerCase() ?? "";
const tag = (n: string) => (ext(n) === "pdf" ? "PDF" : ext(n) === "jpeg" ? "JPG" : ext(n).toUpperCase());
const fmtSize = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");
const plural = (n: number) => `${n} file${n === 1 ? "" : "s"}`;

const PATHS: Record<DocType | "", ReactNode> = {
  "Birth Certificate": (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><circle cx="12" cy="13" r="2.5" /><path d="M8.5 19a3.5 3.5 0 0 1 7 0" /></>),
  "SEC Registration": (<><path d="M3 21h18M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /></>),
  "Marriage Certificate": (<><circle cx="9" cy="14" r="5" /><circle cx="15" cy="14" r="5" /><path d="m10 4 2 2 2-2" /></>),
  Others: (<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>),
  "": (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>),
};
function TypeIcon({ type, size = 16 }: { type: DocType | ""; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[type]}
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

const label = (i: Item) => (i.cat === "Others" ? i.other : i.cat);

export default function AdditionalDocumentsStepV4() {
  const [sel, setSel] = useState<DocType | "">("");
  const [otherName, setOtherName] = useState("");
  const [staged, setStaged] = useState<File[]>([]);
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
  const otherRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const typeLabel = sel === "Others" ? otherName.trim() : sel;

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

  // Add the staged files once a type (and for Others, a name) is set.
  const commit = (files: File[], cat: DocType | "", name: string) => {
    const t = cat === "Others" ? name.trim() : cat;
    if (!files.length || !cat || !t) return false;
    const added = files.map((f) => ({ id: ++uid.current, file: f, cat, other: cat === "Others" ? t : "", url: URL.createObjectURL(f), isNew: true, uploading: true, progress: 0, speed: 0, justDone: false }));
    setItems((prev) => [...prev.map((i) => ({ ...i, isNew: false })), ...added]);
    toast(`Uploading ${plural(added.length)} to ${t}`);
    setStaged([]);
    setSel("");
    setOtherName("");
    return true;
  };

  const pickType = (c: DocType) => {
    setSel(c);
    setMenuOpen(false);
    if (c === "Others") setTimeout(() => otherRef.current?.focus(), 0);
    else commit(staged, c, "");
  };

  const take = (list: File[]) => {
    const errs: string[] = [];
    const next = [...staged];
    list.forEach((f) => {
      const dup = (x: File) => x.name === f.name && x.size === f.size;
      if (!OK_EXT.includes(ext(f.name))) errs.push(`${f.name}: only PDF, JPG or PNG files are allowed.`);
      else if (f.size > MAX) errs.push(`${f.name}: ${fmtSize(f.size)} is over the 20 MB limit.`);
      else if (!f.size) errs.push(`${f.name}: file is empty.`);
      else if (next.some(dup) || items.some((i) => dup(i.file))) errs.push(`${f.name}: already added.`);
      else next.push(f);
    });
    setErrors(errs);
    // Others waits for the user to finish typing the name.
    const ready = sel && sel !== "Others" ? commit(next, sel, "") : false;
    if (!ready) {
      setStaged(next);
      if (next.length && !typeLabel) setNudge((n) => n + 1);
    }
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
                <span className={`grid size-7 flex-none place-items-center rounded-md ${sel ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                  <TypeIcon type={sel} />
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
                    className="absolute -left-1 top-[calc(100%+8px)] z-20 max-h-80 w-[min(340px,calc(100vw-32px))] overflow-auto rounded-lg border border-solid border-gray-200 bg-white p-1.5 shadow-[0_20px_24px_-4px_#0a0d1214,0_8px_8px_-4px_#0a0d1208]"
                  >
                    {DOCUMENT_TYPES.map((c) => {
                      const n = items.filter((i) => i.cat === c).length;
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
                          {n > 0 && <span className="rounded-full bg-success-50 px-[7px] py-px text-[11px] font-semibold text-success-700">{n}</span>}
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
              className="flex h-full flex-none cursor-pointer items-center gap-2 rounded-lg border-0 bg-brand-600 px-3.5 font-semibold text-white shadow-[0_1px_2px_#0a0d120d,inset_0_-2px_0_#0a0d120d,inset_0_0_0_1px_#0a0d122e] hover:bg-brand-700 sm:px-[18px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[rgba(26,86,219,.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
              <span className="max-sm:sr-only">Choose file</span>
            </button>
            <input
              ref={pickerRef}
              type="file"
              multiple
              accept={ACCEPT}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                take([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
          </div>

          {sel === "Others" && (
            <input
              ref={otherRef}
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit(staged, sel, otherName)}
              onBlur={() => commit(staged, sel, otherName)}
              placeholder="Type the document name"
              maxLength={60}
              aria-label="Other document name"
              className="mt-2 h-11 w-full rounded-lg border border-solid border-gray-300 px-3.5 text-gray-900 shadow-[0_1px_2px_#0a0d120d] focus:outline focus:outline-[3px] focus:outline-[rgba(26,86,219,.25)]"
            />
          )}

          {staged.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#93370D]">
              <b className="font-semibold">{sel === "Others" && !typeLabel ? "Type the document name" : "Select document type"}</b> to add:
              {staged.map((f, i) => (
                <span key={f.name + i} className="inline-flex max-w-[240px] items-center gap-1 rounded-full border border-solid border-[#FEDF89] bg-[#FFFAEB] py-0.5 pl-2.5 pr-1 text-gray-900">
                  <span className="truncate">{f.name}</span>
                  <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setStaged((p) => p.filter((_, j) => j !== i))} className="grid size-[22px] flex-none cursor-pointer place-items-center rounded-full border-0 bg-transparent text-sm leading-none text-gray-500 hover:bg-white hover:text-error-500">×</button>
                </span>
              ))}
            </div>
          ) : (
            <p className="m-0 mt-2 text-xs text-gray-500">Pick a type and a file, in any order. Or drag files onto the bar. PDF, JPG or PNG, up to 20 MB.</p>
          )}

          {errors.length > 0 && (
            <div role="alert" className="mt-2 flex items-start gap-2 rounded-lg border border-solid border-[#fecdca] bg-[#fef3f2] px-2.5 py-2 text-xs text-[#b42318]">
              <span aria-hidden="true">⚠</span>
              <div className="flex-1">{errors.map((e) => <div key={e}>{e}</div>)}</div>
              <button type="button" aria-label="Dismiss" onClick={() => setErrors([])} className="grid size-[22px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-sm text-gray-500 hover:bg-white hover:text-error-500">×</button>
            </div>
          )}

          {/* List */}
          <div className="mb-2.5 mt-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 text-base font-semibold text-gray-900">Your documents</h3>
            <span className="whitespace-nowrap rounded-full border border-solid border-[#B2CCFF] bg-brand-25 px-2 py-0.5 text-xs font-medium text-brand-600">{plural(items.length)}</span>
          </div>
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-[#fdfdfd] px-4 py-7 text-center text-gray-500">No documents yet. Pick a type and upload a file above.</div>
          ) : (
            <ul className="m-0 list-none overflow-hidden rounded-xl border border-solid border-gray-200 p-0">
              {items.map((i) => (
                <motion.li
                  key={`${i.id}-${i.cat}`}
                  initial={i.isNew ? { backgroundColor: i.uploading ? "#f9fafb" : "#ecfdf3" } : false}
                  animate={{ backgroundColor: i.uploading ? "#f9fafb" : "#ffffff" }}
                  transition={{ duration: i.uploading ? 0.2 : 1.4 }}
                  className="flex items-center gap-3 border-0 border-b border-solid border-gray-200 px-3.5 py-3 last:border-b-0"
                >
                  {i.uploading ? (
                    <>
                      <span className="grid size-9 flex-none place-items-center self-start rounded-lg bg-gray-100 text-gray-500">
                        <FileAttachmentIcon size={18} strokeWidth={1.5} color="currentColor" aria-hidden="true" />
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
                      <select
                        title="Change document type"
                        aria-label={`Document type for ${i.file.name}`}
                        value={i.cat === "Others" ? "__other" : i.cat}
                        onChange={(e) => moveTo(i.id, e.target.value as DocType)}
                        disabled={i.uploading}
                        className="h-[22px] max-w-[150px] cursor-pointer appearance-none truncate rounded-md border border-solid border-[#c7d7fe] bg-brand-25 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%230B2E83%22%20stroke-width=%223%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_8px_center] bg-no-repeat pl-2.5 pr-6 text-xs font-semibold text-brand-600 enabled:hover:bg-[#DDE7FF] disabled:cursor-default disabled:opacity-100 sm:max-w-[200px]"
                      >
                        {i.cat === "Others" && <option value="__other">{i.other}</option>}
                        {DOCUMENT_TYPES.filter((c) => c !== "Others").map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button type="button" title="Cancel upload" aria-label={`Cancel upload of ${i.file.name}`} onClick={() => cancelUpload(i.id)} className="grid size-9 flex-none cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-500 hover:bg-[#fef3f2] hover:text-error-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <>
                  <span className={`grid size-9 flex-none place-items-center rounded-lg text-[10px] font-bold ${ext(i.file.name) === "pdf" ? "bg-[#fef3f2] text-[#b42318]" : "bg-brand-25 text-brand-500"}`}>{tag(i.file.name)}</span>
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
                  <select
                        title="Change document type"
                        aria-label={`Document type for ${i.file.name}`}
                        value={i.cat === "Others" ? "__other" : i.cat}
                        onChange={(e) => moveTo(i.id, e.target.value as DocType)}
                        disabled={i.uploading}
                        className="h-[22px] max-w-[150px] cursor-pointer appearance-none truncate rounded-md border border-solid border-[#c7d7fe] bg-brand-25 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%230B2E83%22%20stroke-width=%223%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_8px_center] bg-no-repeat pl-2.5 pr-6 text-xs font-semibold text-brand-600 enabled:hover:bg-[#DDE7FF] disabled:cursor-default disabled:opacity-100 sm:max-w-[200px]"
                      >
                        {i.cat === "Others" && <option value="__other">{i.other}</option>}
                        {DOCUMENT_TYPES.filter((c) => c !== "Others").map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
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

          <div className="mt-6 rounded-lg border-0 border-l-4 border-solid border-[#F79009] bg-[#FEF0C7] px-4 py-3 text-[#93370D]">
            <b className="mb-0.5 block font-semibold">Important</b>
            <ul className="m-0 mt-1 pl-[18px]">
              <li>Make sure documents are clear, complete and readable.</li>
              <li>For multi-page documents, upload a single PDF instead of separate images.</li>
            </ul>
          </div>
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
