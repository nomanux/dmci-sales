import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { XIcon } from "./icons";

/**
 * ImagePreviewModal — "Property Unit Image" modal opened by clicking the
 * image-icon row action in the Unit / Parking Slot / Service Area tables.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:206567 ("Modal").
 *
 * Motion: the panel grows out of the "Image" button that opened it and
 * springs to the centre (blur + scale + fade), the backdrop fades in with a
 * soft blur, and the picture fades up once it has loaded. Closing (X, backdrop
 * click or Esc) plays the same path back into the button, then calls onClose.
 * Callers keep rendering it conditionally; no AnimatePresence needed outside.
 */

const OPEN_SPRING: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 };
const CLOSE_TWEEN: Transition = { duration: 0.2, ease: [0.4, 0, 1, 1] };

type Origin = { x: number; y: number };

/** Offset from the viewport centre to the button that opened the modal. */
function readOrigin(): Origin | null {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  return {
    x: r.left + r.width / 2 - window.innerWidth / 2,
    y: r.top + r.height / 2 - window.innerHeight / 2,
  };
}

export default function ImagePreviewModal({
  imageUrl,
  imageAlt = "Property unit image",
  onClose,
}: {
  imageUrl?: string;
  imageAlt?: string;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  // Read once, on first render, while focus is still on the clicked button.
  const [origin] = useState<Origin | null>(() => readOrigin());
  const opener = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const requestClose = () => setOpen(false);

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const hidden = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.35,
        x: origin?.x ?? 0,
        y: origin?.y ?? 24,
        filter: "blur(10px)",
      };

  return (
    <AnimatePresence
      onExitComplete={() => {
        opener.current?.focus?.({ preventScroll: true });
        onClose();
      }}
    >
      {open && (
        <motion.div
          key="image-preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Property Unit Image"
          onClick={requestClose}
        >
          {/* Backdrop */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          />

          {/* Panel */}
          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl will-change-transform"
            onClick={(event) => event.stopPropagation()}
            initial={hidden}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              transition: reduceMotion ? { duration: 0.15 } : OPEN_SPRING,
            }}
            exit={{ ...hidden, transition: reduceMotion ? { duration: 0.12 } : CLOSE_TWEEN }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <motion.h2
                className="text-base font-semibold text-gray-900"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.08, duration: 0.25, ease: "easeOut" } }}
              >
                Property Unit Image
              </motion.h2>
              <motion.button
                ref={closeBtn}
                type="button"
                aria-label="Close"
                onClick={requestClose}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand-500/30"
              >
                <XIcon className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-5">
              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {imageUrl ? (
                  <>
                    {/* Shimmer while the image loads */}
                    {!loaded && (
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50" />
                    )}
                    <motion.img
                      src={imageUrl}
                      alt={imageAlt}
                      onLoad={() => setLoaded(true)}
                      className="max-h-full w-full object-contain"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={
                        loaded
                          ? { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
                          : { opacity: 0, scale: 1.04 }
                      }
                    />
                  </>
                ) : (
                  <motion.span
                    className="p-10 text-center text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.12 } }}
                  >
                    No image uploaded for this unit yet.
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
