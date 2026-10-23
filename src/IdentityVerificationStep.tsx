import { useId, useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select from "./Select";
import StepHeader from "./StepHeader";
import ExamplePhotoPreview, { type ExamplePhoto } from "./ExamplePhotoPreview";
import {
  idCardImageUrl,
  idExampleBlurryUrl,
  idExampleGoodUrl,
  idExampleHandUrl,
  idExampleTiltedUrl,
} from "./assets/figmaAssets";

/**
 * Step 3 of the CRF track — "Upload your government ID".
 * Behaviour follows the id-upload.html reference: empty -> reading -> done.
 * The buyer drops/browses/photographs the front of their ID, we "read" it,
 * and the ID details panel fills in as an editable form whose fields are
 * tagged "Read from ID" until the buyer changes them.
 *
 * readIdDetails() is a timed stub — swap it for the real OCR / ID
 * verification API call.
 */

type Phase = "empty" | "reading" | "done";

interface IdDetails {
  type: string;
  number: string;
  /** ISO yyyy-mm-dd, or null when the card has no expiry. */
  validUntil: string | null;
}

const ID_TYPES = [
  { value: "umid", label: "UMID", numberLabel: "Common Reference Number (CRN)", format: "0000-0000000-0" },
  { value: "philsys", label: "PhilSys National ID", numberLabel: "PhilSys Card Number (PCN)", format: "0000-0000-0000-0000" },
  { value: "drivers", label: "Driver's licence", numberLabel: "Licence number", format: "A00-00-000000" },
  { value: "passport", label: "Passport", numberLabel: "Passport number", format: "P0000000A" },
  { value: "prc", label: "PRC ID", numberLabel: "PRC registration number", format: "0000000" },
  { value: "sss", label: "SSS ID", numberLabel: "SSS number", format: "00-0000000-0" },
];

const PANEL_HINTS: Record<Phase, string> = {
  empty: "These fill in on their own after you upload your ID.",
  reading: "Reading your card. This takes a few seconds.",
  done: "We read these from your card. Check they match.",
};

const EXAMPLES = [
  { src: idExampleGoodUrl, ok: true, caption: "Clear & flat", alt: "ID photographed flat with all corners visible" },
  { src: idExampleTiltedUrl, ok: false, caption: "Tilted", alt: "ID photographed at an angle" },
  { src: idExampleHandUrl, ok: false, caption: "Covered", alt: "Fingers covering part of the ID" },
  { src: idExampleBlurryUrl, ok: false, caption: "Blurry", alt: "Blurry photo of an ID" },
];
const PREVIEW_EXAMPLES: ExamplePhoto[] = EXAMPLES.map(({ src, caption, ok }) => ({
  photo: src,
  label: caption,
  accepted: ok,
}));

const READ_DELAY_MS = 2200;

function readIdDetails(): Promise<IdDetails> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve({ type: "umid", number: "0028-1215160-9", validUntil: null }), READ_DELAY_MS),
  );
}

function formatSize(bytes: number) {
  return bytes > 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";
}

/* ------------------------------------------------------------------ */
/* Icons (from the reference markup)                                   */
/* ------------------------------------------------------------------ */

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={3} {...strokeProps}>
    <path d="M5 12l5 5 9-10" />
  </svg>
);
const CrossIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={3} {...strokeProps}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const LockIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function FieldHead({ htmlFor, id, label, edited }: { htmlFor?: string; id?: string; label: string; edited: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} id={id} className="text-sm font-medium leading-5 text-gray-700">
        {label}
      </label>
      {edited && (
        <span className="shrink-0 rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium leading-[18px] text-warning-700">
          Edited
        </span>
      )}
    </div>
  );
}

function SkeletonField({ label, width, loading }: { label: string; width: string; loading: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium leading-5 text-gray-400">{label}</span>
      <div className="flex h-8 items-center rounded-lg bg-gray-100 px-3">
        <span className={`block h-2 rounded-full bg-gray-200 ${loading ? "animate-pulse" : ""}`} style={{ width }} />
      </div>
    </div>
  );
}

function ButtonLike({
  variant,
  onClick,
  children,
  ariaLabel,
  iconOnly = false,
}: {
  variant: "primary" | "outline" | "secondary" | "danger";
  onClick: () => void;
  children: ReactNode;
  ariaLabel?: string;
  /** Square 32px button with no side padding (e.g. the trash button). */
  iconOnly?: boolean;
}) {
  const styles = {
    primary: "border-transparent bg-brand-600 text-white hover:bg-brand-700",
    outline: "border-brand-600 bg-white text-brand-600 hover:bg-brand-25",
    secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "border-gray-300 bg-white text-error-600 hover:bg-error-50",
  }[variant];
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors ${iconOnly ? "w-8" : "px-3"} ${styles}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Step                                                                */
/* ------------------------------------------------------------------ */

/**
 * ID upload → read → review flow (drop zone / take a photo, scan, preview with
 * Replace/Remove, auto-filled ID details, example photos). Used by step 3 and
 * by the spouse / co-buyer ID boxes in step 2.
 */
export function IdUploadPanel({
  onReadyChange,
  onGray = false,
  compact = false,
  mobileDetailsAfterUpload = false,
  hideTakePhoto = false,
}: {
  /** Fires with true once the ID has been read, false otherwise. */
  onReadyChange?: (ready: boolean) => void;
  /** Sitting on a grey box: give the empty details panel a white fill so it still reads as a panel. */
  onGray?: boolean;
  /** Upload + read + preview only — no ID details panel, privacy note or example photos (step 2 ID boxes). */
  compact?: boolean;
  /** Mobile only: keep the ID details panel hidden until an ID is uploaded (step 3). */
  mobileDetailsAfterUpload?: boolean;
  /** Drop the "Take a photo" button, leaving Browse files only (step 3). */
  hideTakePhoto?: boolean;
}) {
  const uid = useId();
  const [phase, setPhase] = useState<Phase>("empty");
  const [preview, setPreview] = useState(idCardImageUrl);
  const [fileMeta, setFileMeta] = useState("umid-front.png · 211 KB");
  const [dragging, setDragging] = useState(false);
  // Example photo open in the full-size preview, by index.
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [idType, setIdType] = useState("umid");
  const [idNumber, setIdNumber] = useState("");
  const [validUntil, setValidUntil] = useState<string>();
  const [noExpiry, setNoExpiry] = useState(false);
  const [edited, setEdited] = useState({ idType: false, idNumber: false, validUntil: false });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every new upload/removal so a stale read can't land after it.
  const readToken = useRef(0);

  useEffect(() => {
    onReadyChange?.(phase === "done");
  }, [phase, onReadyChange]);

  // Free blob URLs from uploads when they're replaced or the step unmounts.
  useEffect(() => {
    if (!preview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  // Cancel any in-flight read on unmount.
  useEffect(() => () => void readToken.current++, []);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.type.startsWith("image/")) setPreview(URL.createObjectURL(file));
    else setPreview(idCardImageUrl); // PDFs: no inline preview in this prototype
    setFileMeta(file.name + " · " + formatSize(file.size));
    setPhase("reading");

    const token = ++readToken.current;
    const data = await readIdDetails();
    if (token !== readToken.current) return;

    setIdType(data.type);
    setIdNumber(data.number);
    setNoExpiry(!data.validUntil);
    setValidUntil(data.validUntil ?? undefined);
    setEdited({ idType: false, idNumber: false, validUntil: false });
    setPhase("done");
  };

  const removeFile = () => {
    readToken.current++;
    setPreview(idCardImageUrl);
    setPhase("empty");
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const idTypeInfo = ID_TYPES.find((t) => t.value === idType) ?? ID_TYPES[0];
  const panelQuiet = phase !== "done";

  return (
    <div className="flex flex-col gap-6">

      <div className={`grid grid-cols-1 gap-4 md:gap-5 ${compact ? "" : "md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"}`}>
        {/* Left: upload / reading / preview */}
        {/* Box fills the row so it matches the ID details panel height. */}
        <section aria-label="ID photo" className="flex flex-col">
          {phase === "empty" && (
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-8 text-center transition-colors ${
                dragging ? "border-brand-500 bg-brand-25" : "border-brand-200 bg-[#f7f9fe]"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                <svg width="26" height="26" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps} className="text-brand-400">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="9" cy="11" r="2" />
                  <path d="M14 10h4M14 14h4M6 16h6" />
                </svg>
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="m-0 text-base font-semibold leading-6 text-gray-900">Drag the front of your ID here</p>
                <p className="m-0 text-xs leading-[18px] text-gray-600">JPG, PNG or PDF, up to 10 MB</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLike variant="primary" onClick={() => fileInputRef.current?.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
                    <path d="M12 15V4M7 9l5-5 5 5M4 15v4h16v-4" />
                  </svg>
                  Browse files
                </ButtonLike>
                {!hideTakePhoto && (
                  <ButtonLike variant="outline" onClick={() => cameraInputRef.current?.click()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
                      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                      <circle cx="12" cy="13" r="3.5" />
                    </svg>
                    Take a photo
                  </ButtonLike>
                )}
              </div>
            </div>
          )}

          {phase !== "empty" && (
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex flex-1 items-center justify-center bg-gray-50 p-4 md:p-6">
                <div className="relative w-full max-w-[420px] overflow-hidden rounded-lg">
                  <img
                    src={preview}
                    alt={phase === "reading" ? "Front of your uploaded ID, being read" : "Front of your uploaded ID"}
                    className={`block w-full h-auto ${phase === "reading" ? "opacity-85" : ""}`}
                  />
                  {phase === "reading" && (
                    <span
                      aria-hidden="true"
                      className="id-scanline pointer-events-none absolute inset-x-0 h-0.5 bg-brand-400 shadow-[0_0_12px_4px_rgba(10,77,224,0.35)]"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
                {phase === "reading" ? (
                  <span aria-live="polite" className="flex items-center gap-2 text-sm font-medium text-brand-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
                      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" />
                    </svg>
                    Reading your ID details
                  </span>
                ) : (
                  <>
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{fileMeta}</span>
                    <div className="flex gap-2">
                      <ButtonLike variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
                          <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />
                        </svg>
                        Replace
                      </ButtonLike>
                      <ButtonLike variant="danger" ariaLabel="Remove photo" onClick={removeFile} iconOnly>
                        <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={2} {...strokeProps}>
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                        </svg>
                      </ButtonLike>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            hidden
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </section>

        {/* Right: ID details — hidden on mobile until an ID is uploaded. */}
        {!compact && (
        <section
          aria-labelledby={uid + "-details"}
          className={`${phase === "empty" && mobileDetailsAfterUpload ? "hidden md:flex" : "flex"} flex-col gap-4 rounded-xl border p-4 md:p-5 transition-colors ${
            panelQuiet && !onGray ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <h2 id={uid + "-details"} className="m-0 text-base font-semibold leading-6 text-gray-900">
              ID details
            </h2>
            <p className="m-0 text-xs leading-[18px] text-gray-600">{PANEL_HINTS[phase]}</p>
          </div>

          {phase !== "done" ? (
            <div className="flex flex-col gap-4">
              <SkeletonField label="ID type" width="40%" loading={phase === "reading"} />
              <SkeletonField label="ID number" width="60%" loading={phase === "reading"} />
              <SkeletonField label="Valid until" width="35%" loading={phase === "reading"} />
            </div>
          ) : (
            <form className="flex flex-col gap-4" noValidate onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <FieldHead id={uid + "-type"} label="ID type" edited={edited.idType} />
                <Select
                  size="sm"
                  aria-label="ID type"
                  options={ID_TYPES}
                  value={idType}
                  onChange={(value) => {
                    if (!value) return;
                    setIdType(value);
                    setEdited((e) => ({ ...e, idType: true }));
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldHead htmlFor={uid + "-number"} label={idTypeInfo.numberLabel} edited={edited.idNumber} />
                <Input
                  id={uid + "-number"}
                  size="sm"
                  placeholder={idTypeInfo.format}
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    setEdited((s) => ({ ...s, idNumber: true }));
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldHead label="Valid until" edited={edited.validUntil} />
                {!noExpiry && (
                  <DatePicker
                    size="sm"
                    aria-label="Valid until"
                    placeholder="MM/DD/YYYY"
                    value={validUntil}
                    onChange={(value) => {
                      setValidUntil(value);
                      setEdited((s) => ({ ...s, validUntil: true }));
                    }}
                  />
                )}
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <Checkbox
                    checked={noExpiry}
                    onChange={(e) => {
                      setNoExpiry(e.target.checked);
                      setEdited((s) => ({ ...s, validUntil: true }));
                    }}
                  />
                  No expiry date
                </label>
              </div>

            </form>
          )}
        </section>
        )}
      </div>

      {/* Below both boxes so it doesn't make the left column taller than the panel. */}
      {!compact && (
        <p className="m-0 -mt-3 flex items-center gap-2 text-xs leading-[18px] text-gray-500">
          <LockIcon />
          Your ID stays encrypted. DMCI uses it only to verify who you are.
        </p>
      )}

      {/* Example photos — upload guidance, so hidden once the ID has been read */}
      {!compact && phase !== "done" && (
        <section aria-labelledby={uid + "-tips"} className="flex flex-col gap-2 border-t border-gray-200 pt-4">
          <h2 id={uid + "-tips"} className="m-0 text-sm font-semibold leading-5 text-gray-900">
            Get the details read right the first time
          </h2>
          <div className="grid max-w-[560px] grid-cols-4 gap-2">
            {EXAMPLES.map((example, index) => (
              <figure key={example.caption} className="m-0 flex flex-col gap-1">
                {/* Same frame as the Live Selfie step's "Check your photo" examples; opens the full-size preview. */}
                <button
                  type="button"
                  aria-label={"View example: " + example.caption}
                  onClick={() => setPreviewIndex(index)}
                  className={`relative block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-white p-0.5 outline outline-[1.4px] -outline-offset-[1.4px] transition-transform duration-150 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
                    example.ok ? "outline-[#079455]" : "outline-[#f02b2b]"
                  }`}
                >
                  <img
                    src={example.src}
                    alt={example.alt}
                    width={840}
                    height={560}
                    loading="lazy"
                    className="block aspect-[3/2] w-full rounded-md object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-white outline outline-1 outline-white ${
                      example.ok ? "bg-[#079455]" : "bg-[#f02b2b]"
                    }`}
                  >
                    {example.ok ? <CheckIcon size={10} /> : <CrossIcon size={10} />}
                  </span>
                </button>
                <figcaption
                  className={`flex items-center gap-1 text-xs font-medium leading-[18px] ${
                    example.ok ? "text-success-700" : "text-error-600"
                  }`}
                >
                  {example.ok ? <CheckIcon size={12} /> : <CrossIcon size={12} />}
                  {example.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {previewIndex !== null && (
        <ExamplePhotoPreview
          examples={PREVIEW_EXAMPLES}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}

export default function IdentityVerificationStep({
  onReadyChange,
}: {
  /** Fires with true once the ID has been read, false otherwise — gates the shell's Next button. */
  onReadyChange?: (ready: boolean) => void;
}) {
  return (
    <section className="form-lg w-full md:max-h-full bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader title="Upload your government ID" className="px-4 md:px-8 pt-6 pb-6">
        Upload the front of your ID. We read your details from the card and fill in the form for you.{" "}
        <a href="#" className="font-semibold text-brand-600 underline hover:text-brand-700">
          See accepted IDs
        </a>
      </StepHeader>

      {/* Only the card body scrolls; the title stays put. */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
        <div className="px-4 md:px-8 pb-6">
          <IdUploadPanel onReadyChange={onReadyChange} mobileDetailsAfterUpload hideTakePhoto />
        </div>
      </div>
    </section>
  );
}
