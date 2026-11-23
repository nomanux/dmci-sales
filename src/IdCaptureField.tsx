import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { motion } from "motion/react";
import { SelfieCamera, usePhoneOrientation } from "./selfieCapture";

/**
 * Same capture as the Live Selfie step, for a co-buyer: a segmented toggle
 * (Take Selfie / Upload Photo). Take Selfie is the shared SelfieCamera from
 * selfieCapture.tsx (face oval + "ID here" guides, face and ID detection,
 * 2s settle and 3-2-1 auto-capture). Upload Photo is a drop zone. The result
 * replaces the area, with Retake/Replace and Remove.
 */

type Mode = "selfie" | "upload";
type Result = { kind: "image"; url: string; name: string } | { kind: "file"; name: string; size: number };

const SPRING = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const;
const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,application/pdf";

const formatSize = (bytes: number) =>
  bytes > 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...stroke}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}
function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...stroke}>
      <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function RotateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...stroke}>
      <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...stroke}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  );
}
function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...stroke}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

export default function IdCaptureField({
  onCaptured,
  uploadTitle = "Upload a photo holding their ID",
  uploadHelp = "Their face and the front of their ID, clearly visible. JPG, PNG or PDF, up to 10 MB.",
}: {
  /** Fires once a photo is taken or a file is picked (used to fill the form from the ID). */
  onCaptured?: () => void;
  uploadTitle?: string;
  uploadHelp?: string;
}) {
  const uid = useId();
  const { isPhone } = usePhoneOrientation();
  // Same default as the Live Selfie step: camera on desktop, upload on phones.
  const [mode, setMode] = useState<Mode>(isPhone ? "upload" : "selfie");
  const [result, setResult] = useState<Result | null>(null);
  const [dragging, setDragging] = useState(false);
  // Remounts the camera for Retake.
  const [cameraKey, setCameraKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Free an uploaded image's preview URL when it is replaced or removed.
  useEffect(
    () => () => {
      if (result?.kind === "image" && result.url.startsWith("blob:")) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    setResult(f.type.startsWith("image/") ? { kind: "image", url: URL.createObjectURL(f), name: f.name } : { kind: "file", name: f.name, size: f.size });
    onCaptured?.();
  };
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    pickFile(e.target.files?.[0]);
    e.target.value = "";
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const onSelfie = (dataUrl: string) => {
    setResult({ kind: "image", url: dataUrl, name: "Selfie with ID" });
    onCaptured?.();
  };

  const tab = (value: Mode, label: string, Icon: typeof UploadIcon) => {
    const on = mode === value;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={on}
        onClick={() => {
          setMode(value);
          setResult(null);
        }}
        className={`relative isolate flex h-full cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 text-[13px] font-medium outline-none transition-colors focus-visible:underline focus-visible:underline-offset-4 ${
          on ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        {on && (
          <motion.span
            layoutId={`${uid}-seg`}
            transition={SPRING}
            className="absolute inset-0 -z-10 rounded-md bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
          />
        )}
        <Icon className="size-4 flex-shrink-0" />
        {label}
      </button>
    );
  };

  const overlayBtn =
    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-white/25 bg-black/45 px-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/65";

  return (
    <div className="flex flex-col gap-2.5">
      <div role="tablist" aria-label="How to add the co-buyer photo" className="inline-flex h-9 w-fit items-center gap-0.5 rounded-lg bg-gray-100 p-[3px]">
        {tab("selfie", "Take Selfie", CameraIcon)}
        {tab("upload", "Upload Photo", UploadIcon)}
      </div>

      {!result && mode === "selfie" ? (
        <div className="w-full max-w-[560px]">
          <SelfieCamera key={cameraKey} onCapture={onSelfie} />
        </div>
      ) : (
        <div
          className={`relative aspect-video w-full max-w-[560px] overflow-hidden rounded-xl ${
            result
              ? "border border-solid border-gray-200 bg-gray-50"
              : `border-[1.5px] border-dashed ${dragging ? "border-brand-400 bg-brand-25" : "border-gray-300 bg-gray-50"}`
          }`}
          onDragOver={(e) => {
            if (result) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={result ? undefined : onDrop}
        >
          {result ? (
            <>
              {result.kind === "image" ? (
                <img src={result.url} alt={result.name} className="block h-full w-full object-contain" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
                  <span className="grid size-11 place-items-center rounded-full bg-brand-100 text-brand-400">
                    <DocIcon className="size-5" />
                  </span>
                  <b className="max-w-[80%] truncate text-sm font-semibold text-gray-900">{result.name}</b>
                  <span className="text-xs text-gray-500">{formatSize(result.size)}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                <button
                  type="button"
                  className={overlayBtn}
                  onClick={() => {
                    if (mode === "upload") inputRef.current?.click();
                    else {
                      setResult(null);
                      setCameraKey((k) => k + 1);
                    }
                  }}
                >
                  <RotateIcon className="size-3.5" />
                  {mode === "upload" ? "Replace" : "Retake"}
                </button>
                <button type="button" aria-label="Remove photo" className={overlayBtn} onClick={() => setResult(null)}>
                  <TrashIcon className="size-3.5" />
                  Remove
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 border-0 bg-transparent p-4 text-center"
            >
              <span className="grid size-11 place-items-center rounded-full bg-brand-100 text-brand-400">
                <UploadIcon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-gray-900">{uploadTitle}</span>
              <span className="max-w-[320px] text-xs leading-4 text-gray-500">{uploadHelp}</span>
              <span className="text-xs font-medium text-brand-400">Click to browse or drag and drop</span>
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={onInput} />
    </div>
  );
}
