import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Shared live-selfie capture pieces: face-api loading, the face-oval and
 * ID-card guide geometry, the in-frame checks and the guide overlay. Used by
 * the Live Selfie step (CaptureSelfieTrack) and the co-buyer selfie in step 2
 * (SelfieCamera), so both cameras behave the same.
 */

declare global {
  interface Window {
    faceapi?: any;
  }
}

const FACE_API_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const FACE_API_MODEL_URL =
  "https://justadudewhohacks.github.io/face-api.js/models";

let faceApiReadyPromise: Promise<void> | null = null;

export function loadFaceApi(): Promise<void> {
  if (faceApiReadyPromise) return faceApiReadyPromise;
  faceApiReadyPromise = new Promise((resolve, reject) => {
    const afterScript = () => {
      const faceapi = window.faceapi;
      if (!faceapi) {
        reject(new Error("face-api.js did not load"));
        return;
      }
      faceapi.nets.tinyFaceDetector
        .loadFromUri(FACE_API_MODEL_URL)
        .then(resolve)
        .catch(reject);
    };
    if (window.faceapi) {
      afterScript();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${FACE_API_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", afterScript);
      existing.addEventListener("error", () =>
        reject(new Error("face-api.js failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = FACE_API_SCRIPT_URL;
    script.async = true;
    script.onload = afterScript;
    script.onerror = () => reject(new Error("face-api.js failed to load"));
    document.head.appendChild(script);
  });
  return faceApiReadyPromise;
}

/** A guide frame, as fractions (0–1) of the 16:9 camera box. */
interface GuideRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Single source for where the guides are drawn AND where the checks look,
// in SCREEN coordinates (the preview is mirrored): ID card on the left, face
// oval on the right.
export const FACE_GUIDE: GuideRect = { left: 0.52, top: 0.1, width: 0.28, height: 0.7 };
export const CARD_GUIDE: GuideRect = { left: 0.1, top: 0.38, width: 0.32, height: 0.36 };

// Mirrors the live preview (and its frames). The saved photo is not mirrored,
// so the text on the ID stays readable for verification.
export const MIRROR_STYLE = { transform: "scaleX(-1)" };

/** A screen-space guide as it falls on the camera's raw (un-mirrored) pixels. */
const inCameraSpace = (g: GuideRect): GuideRect => ({ ...g, left: 1 - g.left - g.width });

const toPercent = (g: GuideRect) => ({
  left: g.left * 100 + "%",
  top: g.top * 100 + "%",
  width: g.width * 100 + "%",
  height: g.height * 100 + "%",
});

/**
 * The part of the camera image the 16:9 preview shows (object-cover crops a
 * 4:3 camera top and bottom), in video pixels. Guide fractions map onto this.
 */
function visibleVideoArea(video: HTMLVideoElement) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const aspect = 16 / 9;
  if (vw / vh > aspect) {
    const w = vh * aspect;
    return { x: (vw - w) / 2, y: 0, w, h: vh };
  }
  const h = vw / aspect;
  return { x: 0, y: (vh - h) / 2, w: vw, h };
}

export type FaceFit = "none" | "ok" | "outside";

/**
 * How the best face relates to the oval. The detector's box is much bigger
 * than the visible face (it takes in hair, ears and margin — about 1.3× the
 * face width), so it's shrunk to the face itself first. "ok" when at least
 * 78% of that face area sits inside the oval: a face filling the oval passes,
 * one spilling past its sides (too close or off-centre) does not.
 */
export function checkFaceFit(
  video: HTMLVideoElement,
  boxes: { x: number; y: number; width: number; height: number }[],
): FaceFit {
  if (boxes.length === 0) return "none";
  const area = visibleVideoArea(video);
  const face = inCameraSpace(FACE_GUIDE);
  const cx = face.left + face.width / 2;
  const cy = face.top + face.height / 2;
  const rx = face.width / 2;
  const ry = face.height / 2;
  const inOval = (x: number, y: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

  // Judge the largest face — the person, not the photo on their ID.
  const box = boxes.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
  const midX = (box.x + box.width / 2 - area.x) / area.w;
  const midY = (box.y + box.height / 2 - area.y) / area.h;
  const w = (box.width / area.w) * 0.75;
  const h = (box.height / area.h) * 0.8;

  // Share of the face area inside the oval, sampled on a grid.
  const steps = 20;
  let inside = 0;
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const x = midX - w / 2 + (w * (i + 0.5)) / steps;
      const y = midY - h / 2 + (h * (j + 0.5)) / steps;
      if (inOval(x, y)) inside++;
    }
  }
  return inside / (steps * steps) >= 0.78 ? "ok" : "outside";
}

/**
 * Heuristic check that an ID card is held inside the card frame: looks only
 * at that region (plus a small margin) for a card outline — long straight
 * horizontal and vertical edges — with printed detail inside. A real
 * document detector can replace this later; the call site stays the same.
 */
export function isCardInGuide(video: HTMLVideoElement, canvas: HTMLCanvasElement | null): boolean {
  if (!canvas || video.videoWidth === 0 || video.videoHeight === 0) return false;
  const area = visibleVideoArea(video);
  const margin = 0.12;
  const card = inCameraSpace(CARD_GUIDE);
  const sx = area.x + (card.left - card.width * margin) * area.w;
  const sy = area.y + (card.top - card.height * margin) * area.h;
  const sw = card.width * (1 + 2 * margin) * area.w;
  const sh = card.height * (1 + 2 * margin) * area.h;

  const w = 120;
  const h = Math.max(24, Math.round((w * sh) / sw));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true } as CanvasRenderingContext2DSettings);
  if (!ctx) return false;
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const lum = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  const EDGE = 22;
  const rowHits = new Array(h).fill(0); // strong vertical-gradient pixels per row (horizontal lines)
  const colHits = new Array(w).fill(0); // strong horizontal-gradient pixels per column (vertical lines)
  let edgeSum = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = Math.abs(lum(x + 1, y) - lum(x - 1, y));
      const gy = Math.abs(lum(x, y + 1) - lum(x, y - 1));
      if (gy > EDGE) rowHits[y]++;
      if (gx > EDGE) colHits[x]++;
      edgeSum += gx + gy;
      n++;
    }
  }
  // A card edge spans most of the frame's width / height.
  const longHorizontal = rowHits.filter((c) => c > w * 0.45).length;
  const longVertical = colHits.filter((c) => c > h * 0.45).length;
  const detail = n > 0 ? edgeSum / n : 0;
  return longHorizontal >= 1 && longVertical >= 1 && detail > 12;
}

export const COUNTDOWN_FROM = 3;
/** How long the face and ID must stay in their frames before the countdown starts. */
export const COUNTDOWN_DELAY_MS = 2000;

/**
 * Face oval + ID card frame drawn over the live camera. Each frame turns
 * green once that check passes; when both pass, the 3-2-1 countdown shows in
 * the middle and the photo is taken automatically at the end of it.
 * Positions come from FACE_GUIDE / CARD_GUIDE, the same regions the
 * checks inspect.
 */
export function CaptureGuides({
  faceFit,
  idOk,
  countdown,
  large = false,
}: {
  faceFit: FaceFit;
  idOk: boolean;
  countdown: number | null;
  large?: boolean;
}) {
  const faceOk = faceFit === "ok";
  const faceHints: Record<FaceFit, string> = {
    none: "Place your face inside the oval",
    outside: "Move so your whole face is inside the oval",
    ok: "",
  };
  const hint =
    countdown !== null
      ? "Hold still…"
      : !faceOk
        ? faceHints[faceFit]
        : !idOk
          ? "Hold your ID inside the card frame"
          : "Hold still…";
  const frame = (ok: boolean) =>
    "absolute border border-dashed transition-colors duration-300 " +
    (ok ? "border-emerald-400" : "border-white/85");
  const tag = (ok: boolean) =>
    "absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold " +
    (ok ? "bg-emerald-500 text-white" : "bg-black/50 text-white");

  const maskId = useId();
  const f = FACE_GUIDE;
  const c = CARD_GUIDE;

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Dims everything except the face oval and the card frame. Drawn in a
          0–100 box stretched over the camera, so the cut-outs line up with the
          percentage-positioned frames below. */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            <ellipse
              cx={(f.left + f.width / 2) * 100}
              cy={(f.top + f.height / 2) * 100}
              rx={(f.width / 2) * 100}
              ry={(f.height / 2) * 100}
              fill="black"
            />
            <rect x={c.left * 100} y={c.top * 100} width={c.width * 100} height={c.height * 100} rx="1" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="rgba(0,0,0,0.1)" mask={`url(#${maskId})`} />
      </svg>

      {/* Not shown on screen (the frame tags say enough); kept for screen readers. */}
      <p aria-live="polite" className="sr-only">
        {hint}
      </p>

      {/* Face oval */}
      <div className={frame(faceOk) + " rounded-[50%]"} style={toPercent(FACE_GUIDE)}>
        <span className={tag(faceOk)}>{faceOk ? "Face ✓" : "Your face"}</span>
      </div>

      {/* ID card frame (ID-1 card proportions) */}
      <div className={frame(idOk) + " rounded-lg"} style={toPercent(CARD_GUIDE)}>
        <span className={tag(idOk)}>{idOk ? "ID ✓" : "ID here"}</span>
      </div>

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            key={countdown}
            role="status"
            aria-label={"Capturing in " + countdown}
            className={
              "selfie-countdown flex items-center justify-center rounded-full bg-black/45 font-bold text-white shadow-[0_0_0_4px_rgba(16,185,129,0.8)] " +
              (large ? "h-32 w-32 text-7xl" : "h-20 w-20 text-5xl")
            }
          >
            {countdown}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile layout (narrower than `md`, same breakpoint as the page), or a touch
 * device whose short side is phone-sized, which keeps a sideways phone wider
 * than 768px counted as a phone. Tablets in landscape keep the inline camera.
 */
const isPhoneNow = () =>
  window.innerWidth < 768 ||
  (window.matchMedia("(pointer: coarse)").matches && Math.min(window.screen.width, window.screen.height) < 600);
const isPortraitNow = () => window.matchMedia("(orientation: portrait)").matches;

export function usePhoneOrientation() {
  const [isPhone, setIsPhone] = useState(isPhoneNow);
  const [isPortrait, setIsPortrait] = useState(isPortraitNow);
  useEffect(() => {
    const update = () => {
      setIsPhone(isPhoneNow());
      setIsPortrait(isPortraitNow());
    };
    const portraitQuery = window.matchMedia("(orientation: portrait)");
    portraitQuery.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      portraitQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return { isPhone, isPortrait };
}

/**
 * Turns the screen to landscape for the user where the browser allows it
 * without full screen (e.g. an installed web app). Browser full screen is
 * avoided on purpose: Android Chrome then shows its own "To exit full screen,
 * drag from the top…" banner over the camera. Resolves false otherwise
 * (regular Chrome tab, iPhone Safari), and the user is asked to turn the
 * phone sideways themselves.
 */
export async function lockLandscape(): Promise<boolean> {
  const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  // Desktop screens can't rotate.
  if (!window.matchMedia("(pointer: coarse)").matches) return false;
  if (!orientation?.lock) return false;
  try {
    await orientation.lock("landscape");
    return true;
  } catch {
    return false;
  }
}

export function releaseLandscape() {
  try {
    screen.orientation?.unlock?.();
  } catch {
    // nothing was locked
  }
}

/**
 * Shown instead of the camera on an upright phone (the 16:9 frame is too
 * small there to fit face + ID), or after the full-screen camera is closed.
 */
export function RotateToLandscapePrompt({
  cameraClosed,
  rotateFailed,
  onRotate,
}: {
  cameraClosed: boolean;
  rotateFailed: boolean;
  onRotate: () => void;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-brand-400 bg-brand-25 px-4 py-6 text-center"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="rotate-phone-hint text-brand-600"
      >
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
      <div className="flex flex-col gap-1">
        <p className="m-0 text-sm font-semibold leading-5 text-gray-900">
          {cameraClosed ? "Camera closed" : "Turn your phone sideways"}
        </p>
        <p className="m-0 text-xs leading-[18px] text-gray-600">
          {cameraClosed
            ? "Tap the button below to open it again."
            : "The camera opens in landscape so your face and ID both fit in the frame."}
        </p>
      </div>
      <button
        type="button"
        onClick={onRotate}
        className="flex h-11 w-full max-w-[260px] cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-brand-600 px-4 text-sm font-semibold text-white shadow-xs hover:bg-brand-700 active:bg-brand-800"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {cameraClosed ? (
            <>
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </>
          ) : (
            <>
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </>
          )}
        </svg>
        {cameraClosed ? "Open camera" : "Rotate screen"}
      </button>
      {rotateFailed && !cameraClosed && (
        <p className="m-0 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-left text-xs leading-[18px] text-yellow-900">
          Your phone can't turn the screen by itself. Please hold your phone sideways. If the screen
          still doesn't turn, switch off <span className="font-semibold">Rotation Lock</span> in your
          phone's quick settings.
        </p>
      )}
    </div>
  );
}

/**
 * Live selfie camera for the co-buyer selfie. On a phone it only runs in
 * landscape, full screen (16:9 fits the short landscape viewport there);
 * upright, it shows a rotate prompt and can't capture. Desktop and tablets
 * get the inline camera. It mounts when "Take Selfie" is tapped, so on a
 * phone it turns the screen sideways right away (that tap still counts as
 * the user gesture full screen needs).
 */
export function SelfieCamera({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const { isPhone, isPortrait } = usePhoneOrientation();
  // Closed with ✕ while still sideways; turning upright again starts over.
  const [closed, setClosed] = useState(false);
  const [rotateFailed, setRotateFailed] = useState(false);
  useEffect(() => {
    if (isPortrait) setClosed(false);
  }, [isPortrait]);

  const openCamera = async () => {
    setClosed(false);
    // Once the screen turns, the orientation listener swaps in the camera.
    if (isPortrait) setRotateFailed(!(await lockLandscape()));
  };

  useEffect(() => {
    if (isPhone && isPortrait) openCamera();
    // Mount only: this is the "Take Selfie" tap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPhone) return <CameraView onCapture={onCapture} />;

  if (isPortrait || closed) {
    return (
      <RotateToLandscapePrompt
        cameraClosed={closed && !isPortrait}
        rotateFailed={rotateFailed}
        onRotate={openCamera}
      />
    );
  }
  return (
    <>
      {/* Holds the card's space while the camera is up full screen. */}
      <div className="aspect-video w-full rounded-xl bg-black" />
      {createPortal(
        <CameraView onCapture={onCapture} fullscreen onClose={() => setClosed(true)} />,
        document.body,
      )}
    </>
  );
}

/**
 * Camera with the same face-oval / ID-card guides, 2s settle and 3-2-1
 * auto-capture as the Live Selfie step. Calls onCapture with a JPEG data URL
 * (not mirrored, so the ID text stays readable). The round button captures
 * straight away.
 */
function CameraView({
  onCapture,
  fullscreen = false,
  onClose,
}: {
  onCapture: (dataUrl: string) => void;
  fullscreen?: boolean;
  onClose?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [faceFit, setFaceFit] = useState<FaceFit>("none");
  const [idOk, setIdOk] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Camera stream — stopped whenever the component unmounts or retries.
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't open the camera. Use Upload photo instead.");
      return;
    }
    let stream: MediaStream | null = null;
    let cancelled = false;
    setError(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        if (!cancelled) setError("Camera access was blocked. Allow camera permission in your browser, then try again.");
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [retry]);

  // Face + ID checks twice a second.
  useEffect(() => {
    if (error) return;
    let cancelled = false;
    let intervalId: number | undefined;
    setFaceFit("none");
    setIdOk(false);
    loadFaceApi()
      .then(() => {
        if (cancelled) return;
        intervalId = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return;
          try {
            const faceapi = window.faceapi;
            const results = await faceapi.detectAllFaces(
              video,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }),
            );
            if (!cancelled) {
              setFaceFit(
                checkFaceFit(
                  video,
                  (results ?? []).map((d: { box: { x: number; y: number; width: number; height: number } }) => d.box),
                ),
              );
            }
          } catch {
            // transient decode/timing errors are fine to ignore
          }
          if (!cancelled) setIdOk(isCardInGuide(video, detectionCanvasRef.current));
        }, 500);
      })
      .catch(() => {
        // CDN unreachable: checks stay off; the capture button still works.
      });
    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [error, retry]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.92));
  };
  const captureRef = useRef(capture);
  captureRef.current = capture;

  // Same auto-capture timing as the Live Selfie step.
  const ready = !error && faceFit === "ok" && idOk;
  const readyRef = useRef(ready);
  readyRef.current = ready;
  useEffect(() => {
    if (ready) {
      const t = window.setTimeout(() => setCountdown((c) => c ?? COUNTDOWN_FROM), COUNTDOWN_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCountdown(null), 700);
    return () => window.clearTimeout(t);
  }, [ready]);
  useEffect(() => {
    if (countdown === null) return;
    const t = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        return;
      }
      setCountdown(null);
      if (readyRef.current) captureRef.current();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  // Full screen: keep the page behind from scrolling under the camera. On
  // close or capture, hand rotation back (in case "Rotate screen" locked it).
  useEffect(() => {
    if (!fullscreen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      releaseLandscape();
    };
  }, [fullscreen]);

  const camera = (
    <div
      className={
        "relative aspect-video overflow-hidden bg-black " +
        (fullscreen
          ? // Largest 16:9 box that fits the landscape screen.
            "w-[min(100vw,calc(100dvh*16/9))]"
          : "w-full rounded-xl border border-dashed border-brand-400")
      }
    >
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-yellow-50 p-4 text-center text-xs leading-4 text-yellow-900">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetry((n) => n + 1)}
            className="h-7 cursor-pointer rounded-full border border-yellow-500 bg-white px-3 text-[11px] font-semibold text-yellow-900"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="block h-full w-full object-cover" style={MIRROR_STYLE} autoPlay playsInline muted />
          <CaptureGuides faceFit={faceFit} idOk={idOk} countdown={countdown} />
          <button
            type="button"
            aria-label="Capture selfie"
            onClick={capture}
            className={
              "group absolute flex cursor-pointer items-center justify-center rounded-full border-2 border-white/90 bg-transparent p-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95 " +
              (fullscreen
                ? // Landscape phone: right edge, centred, like a camera app's shutter (clear of the face oval).
                  "right-4 top-1/2 h-14 w-14 -translate-y-1/2"
                : "bottom-3 left-1/2 h-11 w-11 -translate-x-1/2")
            }
          >
            <span className="h-full w-full rounded-full bg-white transition-transform duration-150 group-active:scale-90" />
          </button>
        </>
      )}
      <canvas ref={detectionCanvasRef} className="hidden" />
    </div>
  );

  if (!fullscreen) return camera;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Take selfie with your ID"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      {camera}
      {/* Way out when the screen is locked sideways and turning the phone won't close it. */}
      {onClose && (
        <button
          type="button"
          aria-label="Close camera"
          onClick={onClose}
          className="absolute left-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-black/55 text-white hover:bg-black/70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
