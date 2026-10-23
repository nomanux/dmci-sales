import { useEffect, useRef } from "react";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "./icons";

export interface ExamplePhoto {
  photo: string;
  label: string;
  accepted: boolean;
}

/**
 * Full-size preview of a good/bad example photo (Live Selfie "Check your
 * photo", Identity Verification ID examples): dark backdrop, the photo large,
 * its verdict underneath, arrows (and ←/→ keys) to step through the examples.
 * Closes on ✕, Esc or a tap outside the photo.
 */
export default function ExamplePhotoPreview({
  examples,
  index,
  onIndexChange,
  onClose,
}: {
  examples: ExamplePhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const count = examples.length;
  const example = examples[index];
  const { accepted } = example;
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
      aria-label={"Example photo: " + example.label}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 md:p-8"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className={navButton + " absolute right-4 top-4"}
      >
        <XIcon className="h-5 w-5" />
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
            src={example.photo}
            alt={example.label + " example"}
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
                {accepted ? <CheckIcon className="h-2 w-2" /> : <XIcon className="h-2 w-2" />}
              </span>
              {example.label}
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
