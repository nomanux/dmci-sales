import { useEffect, useRef, useState, type CSSProperties } from "react";
import Button from "./Button";
import BuyerDetailsStep from "./BuyerDetailsStep";
import BuyerPropertyStep from "./BuyerPropertyStep";
import IdentityVerificationStep from "./IdentityVerificationStep";
import TermsStep from "./TermsStep";
import DataPrivacyStep from "./DataPrivacyStep";
import ConsentStep from "./ConsentStep";
import ReviewStep from "./ReviewStep";
import StepHeader from "./StepHeader";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import {
  COUNTDOWN_DELAY_MS,
  COUNTDOWN_FROM,
  CaptureGuides,
  MIRROR_STYLE,
  RotateToLandscapePrompt,
  checkFaceFit,
  isCardInGuide,
  loadFaceApi,
  lockLandscape,
  releaseLandscape,
  usePhoneOrientation,
  type FaceFit,
} from "./selfieCapture";
import {
  dmciLogoUrl,
  idCardImageUrl,
  thumbnailPhoto1Url,
  thumbnailPhoto2Url,
  thumbnailPhoto3Url,
  thumbnailPhoto4Url,
  thumbnailOverexposedUrl,
  sendIconUrl,
} from "./assets/figmaAssets";

type CaptureMode = "selfie" | "upload";

type IconProps = { className?: string };

const lucideProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function CameraIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path
        d="M12.6974 3.5H11.303C10.5884 3.5 10.2311 3.5 9.91067 3.612C9.71499 3.68039 9.53113 3.77879 9.36568 3.90367C9.09474 4.10816 8.89655 4.40544 8.50018 5L8.50017 5.00001C8.29717 5.30453 7.99794 5.75337 7.87867 5.87871C7.58314 6.18927 7.19563 6.39666 6.77329 6.47029C6.60284 6.5 6.41985 6.5 6.05387 6.5C5.07379 6.5 4.58376 6.5 4.18307 6.61342C3.18074 6.89716 2.39734 7.68055 2.1136 8.68289C2.00018 9.08357 2.00018 9.57361 2.00018 10.5537V14.5C2.00018 17.3284 2.00018 18.7426 2.87886 19.6213C3.75754 20.5 5.17176 20.5 8.00018 20.5H16.0002C18.8286 20.5 20.2428 20.5 21.1215 19.6213C22.0002 18.7426 22.0002 17.3284 22.0002 14.5V10.5537C22.0002 9.57361 22.0002 9.08357 21.8868 8.68289C21.603 7.68055 20.8196 6.89716 19.8173 6.61342C19.4166 6.5 18.9266 6.5 17.9465 6.5C17.5805 6.5 17.3975 6.5 17.2271 6.47029C16.8047 6.39666 16.4172 6.18927 16.1217 5.87871C16.0024 5.75336 15.7032 5.30451 15.5002 5C15.1038 4.40544 14.9056 4.10816 14.6347 3.90367C14.4692 3.77879 14.2854 3.68039 14.0897 3.612C13.7693 3.5 13.412 3.5 12.6974 3.5Z"
        strokeLinejoin="round"
      />
      <path
        d="M16.0002 13C16.0002 15.2091 14.2093 17 12.0002 17C9.79104 17 8.00018 15.2091 8.00018 13C8.00018 10.7909 9.79104 9 12.0002 9C14.2093 9 16.0002 10.7909 16.0002 13Z"
        strokeLinejoin="round"
      />
      <path d="M19.1252 9.5H19.0002M19.2502 9.5C19.2502 9.63807 19.1383 9.75 19.0002 9.75C18.8621 9.75 18.7502 9.63807 18.7502 9.5C18.7502 9.36193 18.8621 9.25 19.0002 9.25C19.1383 9.25 19.2502 9.36193 19.2502 9.5Z" />
    </svg>
  );
}

function CameraOffIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" />
      <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" />
      <path d="M14.121 15.121A3 3 0 1 1 9.88 10.88" />
    </svg>
  );
}

function UploadIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function TrashIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function ExpandIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function RotateCcwIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function CircleCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleAlertIcon({ className }: IconProps) {
  return (
    <svg className={className} {...lucideProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function CheckmarkIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3327 4L5.99935 11.3333L2.66602 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.75 8.25V6C12.75 3.92893 11.0711 2.25 9 2.25C6.92893 2.25 5.25 3.92893 5.25 6V8.25M6.6 15.75H11.4C12.6601 15.75 13.2902 15.75 13.7715 15.5048C14.1948 15.289 14.539 14.9448 14.7548 14.5215C15 14.0402 15 13.4101 15 12.15V11.85C15 10.5899 15 9.95982 14.7548 9.47852C14.539 9.05516 14.1948 8.71095 13.7715 8.49524C13.2902 8.25 12.6601 8.25 11.4 8.25H6.6C5.33988 8.25 4.70982 8.25 4.22852 8.49524C3.80516 8.71095 3.46095 9.05516 3.24524 9.47852C3 9.95982 3 10.5899 3 11.85V12.15C3 13.4101 3 14.0402 3.24524 14.5215C3.46095 14.9448 3.80516 15.289 4.22852 15.5048C4.70982 15.75 5.33988 15.75 6.6 15.75Z"
        stroke="#9CA3AF"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ThumbnailAttempt {
  id: string;
  photo: string;
  label: string;
  status: "rejected" | "accepted";
}

// Rejected examples first, the good one last.
const THUMBNAIL_ATTEMPTS: ThumbnailAttempt[] = [
  { id: "attempt-1", photo: thumbnailPhoto1Url, label: "Too far", status: "rejected" },
  { id: "attempt-2", photo: thumbnailPhoto2Url, label: "Sunglasses on", status: "rejected" },
  { id: "attempt-3", photo: thumbnailPhoto3Url, label: "Face turned", status: "rejected" },
  { id: "attempt-5", photo: thumbnailOverexposedUrl, label: "Overexposed", status: "rejected" },
  { id: "attempt-4", photo: thumbnailPhoto4Url, label: "Good example", status: "accepted" },
];

/**
 * Full-size preview of a "Check your photo" example: dark backdrop, the
 * photo large, its verdict underneath, arrows (and ←/→ keys) to step
 * through the examples. Closes on ✕, Esc or a tap outside the photo.
 */
function ExamplePhotoPreview({
  index,
  onIndexChange,
  onClose,
}: {
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const count = THUMBNAIL_ATTEMPTS.length;
  const attempt = THUMBNAIL_ATTEMPTS[index];
  const accepted = attempt.status === "accepted";
  const step = (delta: number) => onIndexChange((index + delta + count) % count);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") stepRef.current(-1);
      else if (event.key === "ArrowRight") stepRef.current(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const navButton =
    "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={"Example photo: " + attempt.label}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 md:p-8"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className={navButton + " absolute right-4 top-4"}
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <div className="flex w-full max-w-3xl items-center gap-2 md:gap-4">
        <button
          type="button"
          aria-label="Previous example"
          onClick={(e) => {
            e.stopPropagation();
            step(-1);
          }}
          className={navButton}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <figure
          onClick={(e) => e.stopPropagation()}
          className="m-0 flex min-w-0 flex-1 flex-col items-center gap-3"
        >
          <img
            src={attempt.photo}
            alt={attempt.label + " example"}
            className={
              "block max-h-[75dvh] w-full rounded-xl object-contain outline outline-2 -outline-offset-2 " +
              (accepted ? "outline-[#079455]" : "outline-[#f02b2b]")
            }
          />
          <figcaption className="flex items-center gap-3">
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold leading-5 text-white " +
                (accepted ? "bg-[#079455]" : "bg-[#f02b2b]")
              }
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25">
                {accepted ? <CheckIcon /> : <XIcon />}
              </span>
              {attempt.label}
            </span>
            <span className="text-xs font-medium text-white/70">
              {index + 1} / {count}
            </span>
          </figcaption>
        </figure>

        <button
          type="button"
          aria-label="Next example"
          onClick={(e) => {
            e.stopPropagation();
            step(1);
          }}
          className={navButton}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

const TOTAL_STEPS = 8;
const BUYER_PROPERTY_STEP = 1;
const BUYER_DETAILS_STEP = 2;
const IDENTITY_STEP = 3;
const SELFIE_STEP = 4;
const TERMS_STEP = 5;
const PRIVACY_STEP = 6;
const CONSENT_STEP = 7;
const REVIEW_STEP = 8;
// Steps that have a screen in this prototype; the rest can't be opened yet.
const STEPS_WITH_CONTENT = [BUYER_PROPERTY_STEP, BUYER_DETAILS_STEP, IDENTITY_STEP, SELFIE_STEP, TERMS_STEP, PRIVACY_STEP, CONSENT_STEP, REVIEW_STEP];

export default function CaptureSelfieTrack() {
  // Phones: the live camera only runs full screen in landscape (an upright
  // 16:9 frame is too small to fit face + ID), so they start on Upload.
  // Upright, or after closing the full-screen view, a rotate / open-camera
  // prompt replaces the camera.
  const { isPhone, isPortrait } = usePhoneOrientation();
  const [captureMode, setCaptureMode] = useState<CaptureMode>(isPhone ? "upload" : "selfie");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  // "Check your photo" example open in the preview, by index.
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [faceFit, setFaceFit] = useState<FaceFit>("none");
  const faceDetected = faceFit === "ok";
  const [idHeld, setIdHeld] = useState(false);
  const [currentStep, setCurrentStep] = useState(BUYER_PROPERTY_STEP);
  // Step 3 reports when the uploaded ID has been read; Next waits for it.
  const [identityReady, setIdentityReady] = useState(false);
  // Step 5 reports when both acknowledgements are ticked.
  const [termsReady, setTermsReady] = useState(false);
  // Step 6 reports when the privacy policy checkbox is ticked.
  const [privacyReady, setPrivacyReady] = useState(false);
  // Step 7 reports when both consents are ticked.
  const [consentReady, setConsentReady] = useState(false);
  // Step 8: final confirmation gates Submit; submitted locks the button.
  const [reviewReady, setReviewReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const onSelfieStep = currentStep === SELFIE_STEP;

  const [rotateFailed, setRotateFailed] = useState(false);
  const phoneCameraBlocked = isPhone && (isPortrait || !isExpanded);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // The footer is fixed over the page, so main reserves exactly its height
  // (+ the same gap as above the card) instead of a guessed pb-24. That keeps
  // the gap above and below each step card equal at any width.
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const observer = new ResizeObserver(() => setFooterHeight(footer.offsetHeight));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!onSelfieStep || captureMode !== "selfie" || capturedImage || phoneCameraBlocked) {
      stopStream();
      return;
    }

    let cancelled = false;
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "This browser can't access the camera. Try uploading a photo instead.",
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError(
            "Camera access was blocked. Allow camera permission in your browser, then try again.",
          );
        }
      });

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelfieStep, captureMode, capturedImage, retryToken, phoneCameraBlocked]);

  useEffect(() => {
    if (
      !onSelfieStep ||
      captureMode !== "selfie" ||
      capturedImage ||
      cameraError ||
      phoneCameraBlocked
    ) {
      setFaceFit("none");
      setIdHeld(false);
      return;
    }

    let cancelled = false;
    setFaceFit("none");
    setIdHeld(false);

    let intervalId: number | undefined;

    loadFaceApi()
      .then(() => {
        if (cancelled) return;
        intervalId = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return;

          try {
            const faceapi = window.faceapi;
            // All faces, so the small photo printed on the ID can't stand
            // in for the person's own face.
            const results = await faceapi.detectAllFaces(
              video,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 224,
                scoreThreshold: 0.5,
              }),
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

          if (!cancelled) {
            setIdHeld(isCardInGuide(video, detectionCanvasRef.current));
          }
        }, 500);
      })
      .catch(() => {
        // If the CDN can't be reached, fall back to leaving both flags false
      });

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [onSelfieStep, captureMode, capturedImage, cameraError, retryToken, phoneCameraBlocked]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isExpanded]);

  // Phones: turning sideways opens the full-screen camera, turning upright
  // closes it. (Closing with ✕ while sideways stays closed: isExpanded isn't a
  // dependency, so this only re-runs on a real change.)
  useEffect(() => {
    if (!isPhone || !onSelfieStep || captureMode !== "selfie" || capturedImage) return;
    setIsExpanded(!isPortrait);
  }, [isPhone, isPortrait, onSelfieStep, captureMode, capturedImage]);

  // Hand rotation back once the full-screen view closes (in case "Rotate
  // screen" locked it to landscape).
  useEffect(() => {
    if (!isExpanded) releaseLandscape();
  }, [isExpanded]);

  const openPhoneCamera = async () => {
    if (isPortrait) setRotateFailed(!(await lockLandscape()));
    else setIsExpanded(true);
  };

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  const handleModeChange = (mode: CaptureMode) => {
    setCaptureMode(mode);
    setCapturedImage(null);
    setCameraError(null);
    setIsExpanded(false);
    // Phones: "Take Selfie" goes straight to the sideways camera, same as "Rotate screen".
    if (mode === "selfie" && isPhone) openPhoneCamera();
  };

  useEffect(() => {
    const canCapture =
      onSelfieStep &&
      captureMode === "selfie" &&
      !capturedImage &&
      !cameraError &&
      !phoneCameraBlocked;
    if (!canCapture) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "Space" && !event.repeat) {
        event.preventDefault();
        handleCaptureRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSelfieStep, captureMode, capturedImage, cameraError, phoneCameraBlocked]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Stay in full screen (if open) so the user can review and confirm the shot
    setCapturedImage(canvas.toDataURL("image/png"));
  };
  const handleCaptureRef = useRef(handleCapture);
  handleCaptureRef.current = handleCapture;

  // Auto capture: once the face and ID are both in frame, count 3-2-1 and
  // take the photo. Detection runs every 500ms and can miss a single frame,
  // so a lost match only cancels the countdown after a short grace period.
  const readyToCapture =
    onSelfieStep &&
    captureMode === "selfie" &&
    !capturedImage &&
    !cameraError &&
    !phoneCameraBlocked &&
    faceDetected &&
    idHeld;
  const readyRef = useRef(readyToCapture);
  readyRef.current = readyToCapture;
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (readyToCapture) {
      // Give the person a moment to settle: the face and ID must stay in
      // place for COUNTDOWN_DELAY_MS before 3-2-1 begins.
      const t = window.setTimeout(() => setCountdown((c) => c ?? COUNTDOWN_FROM), COUNTDOWN_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCountdown(null), 700);
    return () => window.clearTimeout(t);
  }, [readyToCapture]);

  useEffect(() => {
    if (countdown === null) return;
    const t = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        return;
      }
      setCountdown(null);
      // Only shoot if the face and ID are still in frame at the last moment.
      if (readyRef.current) handleCaptureRef.current();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleDelete = () => {
    setCapturedImage(null);
    setIsExpanded(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCapturedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const showLiveVideoCompact =
    captureMode === "selfie" && !capturedImage && !cameraError && !isExpanded && !isPhone;
  const showPhonePrompt =
    isPhone && captureMode === "selfie" && !capturedImage && !isExpanded;
  const showLiveVideoExpanded =
    captureMode === "selfie" && !capturedImage && !cameraError && isExpanded;
  const steps = [
    "Buyer & Property",
    "Representative Details",
    "Identity Verification",
    "Live Selfie",
    "Terms & Conditions",
    "Data Privacy",
    "Consent & Acceptance",
    "Review & Submit",
  ].map((name, index) => {
    const id = index + 1;
    const status =
      id < currentStep
        ? "completed"
        : id === currentStep
          ? "current"
          : "pending";
    return { id, name, status: status as "completed" | "current" | "pending" };
  });

  const mainRef = useRef<HTMLElement>(null);
  const goToStep = (step: number) => {
    if (!STEPS_WITH_CONTENT.includes(step)) return;
    setIsExpanded(false);
    setCurrentStep(step);
    // Each step opens at its top (on phones the page scrolls, so Next is
    // pressed from the bottom of the previous step).
    mainRef.current?.scrollTo({ top: 0 });
  };
  const stepPosition = STEPS_WITH_CONTENT.indexOf(currentStep);
  const previousStep = STEPS_WITH_CONTENT[stepPosition - 1];
  const nextStep = STEPS_WITH_CONTENT[stepPosition + 1];
  // Steps that must be completed before Next unlocks, with the hint shown beside it.
  const nextBlockedHint =
    currentStep === IDENTITY_STEP && !identityReady
      ? "Upload your ID to continue"
      : currentStep === TERMS_STEP && !termsReady
        ? "Agree to the terms to continue"
        : currentStep === PRIVACY_STEP && !privacyReady
          ? "Agree to the privacy policy to continue"
          : currentStep === CONSENT_STEP && !consentReady
            ? "Give your consent to continue"
            : currentStep === REVIEW_STEP && !reviewReady
              ? "Confirm your details to submit"
              : null;
  const nextBlocked = nextBlockedHint !== null;
  const handlePrevious = () => goToStep(previousStep);
  const handleNext = () =>
    currentStep === REVIEW_STEP ? setSubmitted(true) : nextStep !== undefined && goToStep(nextStep);
  const nextLabel =
    currentStep === REVIEW_STEP ? (
      <>
        <img src={sendIconUrl} alt="" width={16} height={16} />
        {submitted ? "Submitted" : "Submit"}
      </>
    ) : (
      "Next"
    );

  return (
    <div
      className="flex flex-col h-screen w-full  font-sans overflow-hidden bg-[#f5f7fb]"
      style={{ "--footer-h": footerHeight + "px" } as CSSProperties}
    >
      <header className="bg-white border-b border-gray-200 flex justify-center">
        <div className="w-full max-w-[1280px] h-[72px] px-4 md:px-0 flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src={dmciLogoUrl}
              alt="DMCI Homes Sales"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row justify-center items-start gap-0 md:gap-4 md:px-4 md:py-3">
        {/* Phones: label and segments on one line, thin segments. */}
        <div className="md:hidden w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold text-gray-900">
            {currentStep}/{TOTAL_STEPS} steps
          </span>
          <div className="flex flex-1 gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  idx < currentStep ? "bg-brand-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <aside className="hidden md:flex items-center flex-shrink-0 min-h-0 w-[240px]">
          <div className="  rounded-xl  py-8 flex flex-col gap-1 w-full self-start">
            <div className="px-3 mb-1">
              <p className="text-xs font-medium text-gray-400 m-0">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            </div>
            <div className="flex flex-col gap-0">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col self-start">
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    disabled={!STEPS_WITH_CONTENT.includes(step.id)}
                    aria-current={
                      step.status === "current" ? "step" : undefined
                    }
                    className="flex items-center gap-3 px-1 py-1 bg-transparent border-none text-left rounded-md enabled:cursor-pointer enabled:hover:bg-gray-100 disabled:cursor-default"
                  >
                    <div
                      className={`size-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-brand-400"
                          : step.status === "current"
                            ? "border-2 border-brand-400 bg-white"
                            : "border-2 border-gray-300 bg-white"
                      }`}
                      style={
                        step.status === "current"
                          ? { boxShadow: "0 0 0 4px rgba(13, 77, 224, 0.15)" }
                          : {}
                      }
                    >
                      {step.status === "completed" && (
                        <CheckmarkIcon className="h-4 w-4 text-white" />
                      )}
                      {step.status === "current" && (
                        <div
                          className="rounded-full bg-brand-400"
                          style={{ width: "8px", height: "8px" }}
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm leading-normal m-0 whitespace-nowrap ${
                        step.status === "completed"
                          ? "font-normal text-gray-900"
                          : step.status === "current"
                            ? "font-semibold text-brand-500"
                            : "font-medium text-gray-500"
                      }`}
                      style={{ width: "162px" }}
                    >
                      {step.name}
                    </p>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="flex h-6 items-center px-0.5 py-0 w-full">
                      <div className="flex h-full items-center justify-center w-6">
                        <div
                          className={`w-px h-full rounded ${
                            step.status === "completed"
                              ? "bg-brand-400"
                              : "bg-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* self-stretch (and flex-1 when stacked on mobile) pins main to the
            viewport height so long steps scroll inside it; under the row's
            items-start it would otherwise grow to its content and get clipped. */}
        <main ref={mainRef} className="w-full md:w-[1024px] min-h-0 max-md:flex-1 self-stretch flex justify-center items-start overflow-y-auto pb-[var(--footer-h)]">
          {/* Fill-height steps scroll inside their card, so the wrapper is pinned
              to the viewport. Step 2 scrolls the page instead: its wrapper must
              grow with it, or main's footer padding lands mid-content and the
              last fields slide under the fixed footer. */}
          <div className={`w-full flex flex-col ${currentStep === BUYER_DETAILS_STEP ? "" : "md:h-full"}`}>
          {currentStep === BUYER_PROPERTY_STEP ? (
            <BuyerPropertyStep />
          ) : currentStep === BUYER_DETAILS_STEP ? (
            <BuyerDetailsStep />
          ) : currentStep === IDENTITY_STEP ? (
            <IdentityVerificationStep onReadyChange={setIdentityReady} />
          ) : currentStep === TERMS_STEP ? (
            <TermsStep onReadyChange={setTermsReady} />
          ) : currentStep === PRIVACY_STEP ? (
            <DataPrivacyStep onReadyChange={setPrivacyReady} />
          ) : currentStep === CONSENT_STEP ? (
            <ConsentStep onReadyChange={setConsentReady} />
          ) : currentStep === REVIEW_STEP ? (
            <ReviewStep onEdit={goToStep} onReadyChange={setReviewReady} />
          ) : (
            <section className="w-full md:max-h-full bg-white rounded-none md:rounded-[16px] overflow-hidden flex flex-col border border-[#e4e8f0]">
              <StepHeader
                title="Capture Live Selfie with ID"
                className="px-4 md:px-8 pt-6 pb-6 flex-shrink-0"
              >
                Take a live selfie holding your ID. Make sure your face and ID
                are clear.
              </StepHeader>

              {/* Only the card body scrolls; the title stays put. */}
              <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
              <div className="px-4 md:px-8 pb-6 flex flex-col gap-2 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6 md:gap-12 min-h-0">
                  <div className="flex flex-col gap-4">
                    <div className="md:flex gap-0 p-1 bg-gray-100 rounded-[12px] w-full md:w-fit hidden">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={captureMode === "selfie"}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-3.5 py-3 md:py-1.5 rounded-lg border-none ${captureMode === "selfie" ? "bg-white text-[#052b78] shadow-[0_1px_2px_-1px_rgba(10,12.67,18,0.1),0_1px_3px_rgba(10,12.67,18,0.1)]" : "bg-transparent text-gray-700 hover:bg-blue-50"} text-sm font-semibold leading-5 cursor-pointer transition-all duration-200`}
                        onClick={() => handleModeChange("selfie")}
                      >
                        <CameraIcon className="h-5 w-5 flex-shrink-0" />
                        <span>Take Selfie</span>
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={captureMode === "upload"}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-3.5 py-3 md:py-1.5 rounded-lg border-none ${captureMode === "upload" ? "bg-white text-[#052b78] shadow-[0_1px_2px_-1px_rgba(10,12.67,18,0.1),0_1px_3px_rgba(10,12.67,18,0.1)]" : "bg-transparent text-gray-700 hover:bg-blue-50"} text-sm font-semibold leading-5 cursor-pointer transition-all duration-200`}
                        onClick={() => handleModeChange("upload")}
                      >
                        <UploadIcon className="h-5 w-5 flex-shrink-0" />
                        <span>Upload Photo</span>
                      </button>
                    </div>

                    {/* Phones: Upload Photo first (the default), Take Selfie on the right. */}
                    <div className="md:hidden flex gap-0 p-1 bg-gray-100 rounded-[12px] w-full">
                      <button
                        type="button"
                        onClick={() => handleModeChange("upload")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-none ${captureMode === "upload" ? "bg-white text-[#052b78] shadow-[0_1px_2px_-1px_rgba(10,12.67,18,0.1),0_1px_3px_rgba(10,12.67,18,0.1)]" : "bg-transparent text-gray-700 hover:bg-blue-50"} text-sm font-semibold leading-5 cursor-pointer transition-all duration-200`}
                      >
                        <UploadIcon className="h-5 w-5 flex-shrink-0" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeChange("selfie")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-none ${captureMode === "selfie" ? "bg-white text-[#052b78] shadow-[0_1px_2px_-1px_rgba(10,12.67,18,0.1),0_1px_3px_rgba(10,12.67,18,0.1)]" : "bg-transparent text-gray-700 hover:bg-blue-50"} text-sm font-semibold leading-5 cursor-pointer transition-all duration-200`}
                      >
                        <CameraIcon className="h-5 w-5 flex-shrink-0" />
                        <span>Take Selfie</span>
                      </button>
                    </div>

                    {showPhonePrompt ? (
                      <RotateToLandscapePrompt
                        cameraClosed={!isPortrait}
                        rotateFailed={rotateFailed}
                        onRotate={openPhoneCamera}
                      />
                    ) : (
                    <div
                      className={
                        "relative rounded-xl w-full aspect-video md:aspect-video overflow-hidden transition-[border-color,outline-color,box-shadow] duration-500 " +
                        (captureMode === "upload"
                          ? "border-2 border-dashed border-primary-400"
                          : "outline outline-2 outline-offset-4 " +
                            (showLiveVideoCompact && faceDetected
                              ? "outline-emerald-500"
                              : "outline-primary-400"))
                      }
                      style={{
                        boxShadow: showLiveVideoCompact
                          ? faceDetected
                            ? "0 8px 24px rgba(16, 185, 129, 0.25)"
                            : "0 8px 24px rgba(10, 77, 224, 0.2)"
                          : "none",
                        minHeight: "200px",
                      }}
                    >
                      {capturedImage ? (
                        <>
                          <img
                            className="w-full h-full object-cover block"
                            src={capturedImage}
                            alt="Captured selfie holding ID"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/55 to-transparent" />
                        </>
                      ) : showLiveVideoCompact ? (
                        <>
                          <video
                            ref={videoRef}
                            className="w-full h-full object-cover block bg-black"
                            style={MIRROR_STYLE}
                            autoPlay
                            playsInline
                            muted
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/55 to-transparent" />
                          <CaptureGuides faceFit={faceFit} idOk={idHeld} countdown={countdown} />
                        </>
                      ) : showLiveVideoExpanded ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-center text-xs text-gray-600">
                          <ExpandIcon className="h-5 w-5" />
                          Viewing full screen
                        </div>
                      ) : captureMode === "selfie" && cameraError ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-xs leading-4 text-yellow-900">
                          <CameraOffIcon className="h-6 w-6" />
                          <span>{cameraError}</span>
                          <button
                            type="button"
                            onClick={() => setRetryToken((n) => n + 1)}
                            className="mt-0.5 h-7 cursor-pointer rounded-full border border-yellow-500 bg-white px-3 text-[11px] font-semibold text-yellow-900"
                          >
                            Try again
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 md:gap-4 border-none p-4 md:p-8 text-center transition-all duration-300 hover:bg-gray-100/80"
                          style={{
                            background:
                              "linear-gradient(135deg, #f0f4ff 0%, #f5f9ff 100%)",
                          }}
                        >
                          <div className="flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-full bg-brand-400/15 transition-all duration-300 group-hover:bg-brand-400/25">
                            <UploadIcon className="h-6 md:h-8 w-6 md:w-8 text-brand-400" />
                          </div>
                          <div className="flex flex-col gap-0.5 md:gap-1">
                            <p className="text-sm md:text-sm font-semibold text-gray-900">
                              Upload your selfie
                            </p>
                            <span className="text-[11px] md:text-xs text-gray-600 leading-4">
                              Click to upload a photo holding your ID
                            </span>
                          </div>
                          <div className="hidden md:block text-xs font-medium text-brand-400">
                            or drag and drop
                          </div>
                        </button>
                      )}

                      {capturedImage ? (
                        <button
                          type="button"
                          onClick={handleRetake}
                          className="group absolute bottom-[22px] left-1/2 flex h-9 -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-4 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:border-white/40 active:scale-95"
                        >
                          <RotateCcwIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-180" />
                          Retake
                        </button>
                      ) : showLiveVideoCompact ? (
                        <button
                          type="button"
                          aria-label="Capture selfie (Ctrl + Space)"
                          title="Capture selfie (Ctrl + Space)"
                          onClick={handleCapture}
                          className="group absolute bottom-3 left-1/2 flex h-11 w-11 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/90 bg-transparent p-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                          <span className="h-full w-full rounded-full bg-white transition-transform duration-150 group-active:scale-90" />
                        </button>
                      ) : null}

                      {(capturedImage || showLiveVideoCompact) && (
                        <button
                          type="button"
                          aria-label={
                            isExpanded
                              ? "Collapse preview"
                              : "Expand preview to full screen"
                          }
                          onClick={() => setIsExpanded((v) => !v)}
                          className="group absolute bottom-[22px] right-3 flex h-9 cursor-pointer items-center rounded-full border border-white/25 bg-black/35 px-2.5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:bg-black/55 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
                        >
                          <ExpandIcon className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110" />
                          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-1.5 group-hover:max-w-[80px] group-hover:opacity-100 group-focus-visible:ml-1.5 group-focus-visible:max-w-[80px] group-focus-visible:opacity-100">
                            Full screen
                          </span>
                        </button>
                      )}
                    </div>
                    )}

                    <div className="hidden md:flex min-h-8 items-center justify-between gap-2 mt-1">
                      {capturedImage && (
                        <button
                          type="button"
                          aria-label="Delete captured photo"
                          title="Delete photo"
                          onClick={handleDelete}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-error-500/40 bg-white text-error-500 transition-all duration-150 hover:bg-error-600 hover:text-white active:scale-90"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                      {showLiveVideoCompact || showLiveVideoExpanded ? (
                        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                          {showLiveVideoCompact && (
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors duration-300 " +
                                  (faceDetected
                                    ? "border-success-500/40 bg-success-25"
                                    : "border-warning-500/40 bg-warning-100")
                                }
                              >
                                <span className="font-medium text-gray-700">
                                  Face:
                                </span>
                                <span
                                  className={
                                    "flex items-center gap-1 font-semibold " +
                                    (faceDetected
                                      ? "text-success-500"
                                      : "text-warning-800")
                                  }
                                >
                                  {faceDetected ? (
                                    <CircleCheckIcon className="h-3.5 w-3.5 text-success-500" />
                                  ) : (
                                    <CircleAlertIcon className="h-3.5 w-3.5 animate-pulse text-warning-500" />
                                  )}
                                  {faceDetected ? "Detected" : "Not Detected"}
                                </span>
                              </span>
                              <span
                                className={
                                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors duration-300 " +
                                  (idHeld
                                    ? "border-success-500/40 bg-success-25"
                                    : "border-warning-500/40 bg-warning-100")
                                }
                              >
                                <span className="font-medium text-gray-700">
                                  ID:
                                </span>
                                <span
                                  className={
                                    "flex items-center gap-1 font-semibold " +
                                    (idHeld
                                      ? "text-success-500"
                                      : "text-warning-800")
                                  }
                                >
                                  {idHeld ? (
                                    <CircleCheckIcon className="h-3.5 w-3.5 text-success-500" />
                                  ) : (
                                    <CircleAlertIcon className="h-3.5 w-3.5 animate-pulse text-warning-500" />
                                  )}
                                  {idHeld ? "Held" : "Not Held"}
                                </span>
                              </span>
                            </div>
                          )}
                          <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400">
                            <span className="flex items-center gap-0.5">
                              <kbd className="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-[11px] font-semibold leading-none text-gray-500">
                                Ctrl
                              </kbd>
                              <span className="text-gray-300">+</span>
                              <kbd className="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-[11px] font-semibold leading-none text-gray-500">
                                Space
                              </kbd>
                            </span>
                            <span className="text-gray-400">to capture</span>
                          </span>
                        </div>
                      ) : (
                        <span />
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <canvas ref={detectionCanvasRef} className="hidden" />

                    <div className="flex flex-col gap-2 flex-shrink-0 mt-1 md:mt-2 p-3 bg-white border border-gray-200 rounded-2xl md:order-last">
                      <p className="m-0 text-xs leading-4 font-semibold text-gray-900">
                        Check your photo
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 w-full">
                        {THUMBNAIL_ATTEMPTS.map((attempt, index) => (
                          <div
                            key={attempt.id}
                            className="flex flex-col items-center gap-1"
                          >
                            <button
                              type="button"
                              aria-label={"View example: " + attempt.label}
                              onClick={() => setPreviewIndex(index)}
                              className={`relative w-full cursor-zoom-in overflow-hidden bg-white min-w-0 border-0 outline outline-[1.4px] -outline-offset-[1.4px] rounded-lg p-0.5 transition-transform duration-150 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
                                attempt.status === "accepted"
                                  ? "outline-[#079455]"
                                  : "outline-[#f02b2b]"
                              }`}
                              style={{ aspectRatio: "16 / 9" }}
                            >
                              <img
                                className="rounded-md w-full h-full object-cover block"
                                src={attempt.photo}
                                alt={
                                  attempt.status === "accepted"
                                    ? "Accepted selfie with ID attempt"
                                    : "Rejected selfie with ID attempt"
                                }
                              />
                              {attempt.status === "accepted" ? (
                                <span
                                  className={`absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center overflow-hidden outline outline-0.75 outline-white bg-[#079455]`}
                                >
                                  <CheckIcon />
                                </span>
                              ) : (
                                <span
                                  className={`absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center overflow-hidden outline outline-0.75 outline-white bg-[#f02b2b]`}
                                >
                                  <XIcon />
                                </span>
                              )}
                            </button>
                            <span
                              className={`text-[10px] md:text-xs leading-4 font-medium text-center ${
                                attempt.status === "accepted"
                                  ? "text-emerald-600"
                                  : "text-error-600"
                              }`}
                            >
                              {attempt.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hidden bg-yellow-50 border-l-[3px] border-yellow-500 px-3 py-1 text-yellow-900 text-xs leading-4 flex-shrink-0">
                      <strong>Important: </strong>
                      Ensure that the face on your ID matches the face in your
                      live selfie.
                    </div>
                  </div>

                  {/* Offset by the desktop tab bar (40px) + column gap (12px) so the card lines up with the camera frame */}
                  <div className="hidden md:flex flex-col md:pt-[52px]">
                    <div className="bg-white border border-gray-300 rounded-[12px] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="m-0 text-sm leading-5 font-semibold text-gray-700">
                          Your uploaded ID
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs leading-4 font-semibold text-emerald-600">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              d="M13.3327 4L5.99935 11.3333L2.66602 8"
                              stroke="#059669"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Verified
                        </span>
                      </div>
                      <div
                        className="w-full rounded-lg overflow-hidden"
                        style={{ aspectRatio: "303/194" }}
                      >
                        <img
                          className="w-full h-full object-cover block"
                          src={idCardImageUrl}
                          alt="Uploaded government issued ID"
                        />
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <LockIcon />
                        </div>
                        <p className="m-0 text-xs leading-4 font-normal text-gray-400">
                          Government-issued ID, locked for this session. Used
                          only to check against your live selfie.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>
          )}
          {/* Phones: actions sit at the end of the step (scroll down to reach
              them); desktop uses the fixed footer instead. */}
          <div className="md:hidden flex flex-col gap-3 border-x border-b border-[#e4e8f0] bg-white px-4 pb-6 pt-2">
            {nextBlocked && <p className="m-0 text-center text-xs text-gray-500">{nextBlockedHint}</p>}
            <Button variant="tertiary" size="md" className="w-full">
              Save as draft
            </Button>
            <Button variant="secondary" size="md" className="w-full" disabled={previousStep === undefined} onClick={handlePrevious}>
              Previous
            </Button>
            <Button variant="primary" size="md" className="w-full" disabled={nextBlocked || submitted} onClick={handleNext}>
              {nextLabel}
            </Button>
          </div>
          </div>
        </main>
      </div>

      <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[-2px_-2px_8px_rgba(10,13,18,0.08)] hidden md:flex items-center justify-center p-0 flex-wrap gap-0 flex-shrink-0 h-auto">
        <div className="w-full max-w-[1280px] flex flex-col md:flex-row md:items-center md:justify-between py-3 md:py-3 gap-2 md:gap-3 px-4 md:px-0">
          <Button
            variant="secondary"
            size="sm"
            className="w-full md:w-24"
            disabled={previousStep === undefined}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            {nextBlocked && (
              <span className="w-full md:w-auto text-xs text-gray-500 text-center md:text-left">
                {nextBlockedHint}
              </span>
            )}
            <Button
              variant="tertiary"
              size="sm"
              className="flex-1 md:flex-none"
            >
              Save as draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              className={`flex-1 md:flex-none ${currentStep === REVIEW_STEP ? "md:w-32" : "md:w-24"}`}
              disabled={nextBlocked || submitted}
              onClick={handleNext}
            >
              {nextLabel}
            </Button>
          </div>
        </div>
      </footer>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen selfie camera"
        >
          {capturedImage ? (
            <img
              className="absolute inset-0 h-full w-full object-contain"
              src={capturedImage}
              alt="Captured selfie holding ID"
            />
          ) : showLiveVideoExpanded ? (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-contain"
                style={MIRROR_STYLE}
                autoPlay
                playsInline
                muted
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative aspect-video w-[min(100vw,calc(100dvh*16/9))]">
                  <CaptureGuides faceFit={faceFit} idOk={idHeld} countdown={countdown} large />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
              No live preview
            </div>
          )}

          {/* Scrims keep the controls readable over bright video */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/70 to-transparent" />

          {/* Top bar: detection status, collapse, close */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {showLiveVideoExpanded && (
                <>
                  <span className="border border-white/20 bg-black/40 text-white backdrop-blur-md inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
                    <span
                      className={
                        "h-2 w-2 rounded-full " +
                        (faceDetected ? "bg-emerald-400" : "bg-amber-400")
                      }
                    />
                    Face {faceDetected ? "detected" : "not detected"}
                  </span>
                  <span className="border border-white/20 bg-black/40 text-white backdrop-blur-md inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
                    <span
                      className={
                        "h-2 w-2 rounded-full " +
                        (idHeld ? "bg-emerald-400" : "bg-amber-400")
                      }
                    />
                    ID {idHeld ? "held" : "not held"}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label="Exit full screen"
              title="Exit full screen"
              onClick={() => setIsExpanded(false)}
              className="absolute left-1/2 top-3 flex h-8 w-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-90"
            >
              <ChevronDownIcon className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Close full screen (Esc)"
              title="Close (Esc)"
              onClick={() => setIsExpanded(false)}
              className="border border-white/20 bg-black/40 text-white backdrop-blur-md flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:rotate-90 hover:bg-black/60 active:scale-90"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom controls */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-6 md:pb-8">
            {capturedImage ? (
              <>
                <p className="m-0 text-sm font-medium text-white/90">
                  Is your face and ID clearly visible?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="border border-white/20 bg-black/40 text-white backdrop-blur-md group flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 hover:bg-black/60 active:scale-95"
                  >
                    <RotateCcwIcon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-error-600/90 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-error-600 active:scale-95"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(5,150,105,0.4)] transition-all duration-200 hover:bg-emerald-700 active:scale-95"
                  >
                    <CircleCheckIcon className="h-4 w-4" />
                    Use this photo
                  </button>
                </div>
              </>
            ) : showLiveVideoExpanded && !isPhone ? (
              <>
                <button
                  type="button"
                  aria-label="Capture selfie (Ctrl + Space)"
                  title="Capture selfie (Ctrl + Space)"
                  onClick={handleCapture}
                  className="group flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-4 border-white/90 bg-transparent p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <span className="h-full w-full rounded-full bg-white transition-transform duration-150 group-active:scale-90" />
                </button>
                <span className="flex flex-wrap items-center justify-center gap-1 text-xs font-medium text-white/75">
                  Hold your ID beside your face &middot;
                  <kbd className="ml-1 rounded border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none">
                    Ctrl
                  </kbd>
                  +
                  <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none">
                    Space
                  </kbd>
                  to capture
                </span>
              </>
            ) : null}
          </div>

          {/* Landscape phone: shutter on the right edge, like a camera app (clear of the face oval). */}
          {showLiveVideoExpanded && isPhone && (
            <button
              type="button"
              aria-label="Capture selfie"
              onClick={handleCapture}
              className="group absolute right-4 top-1/2 flex h-16 w-16 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-white/90 bg-transparent p-1 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-200 active:scale-95"
            >
              <span className="h-full w-full rounded-full bg-white transition-transform duration-150 group-active:scale-90" />
            </button>
          )}
        </div>
      )}

      {previewIndex !== null && (
        <ExamplePhotoPreview
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}
