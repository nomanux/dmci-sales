import { useRef } from "react";
import { LiniqoApartmentBlockBalconies } from "@/components/liniqo/illustrations/apartment-block-balconies";

/**
 * InteractiveApartment — Liniqo's apartment block, made to react to the pointer:
 * windows and balconies near it light up and the building tilts slightly. The
 * artwork is static, so this works on its paths directly, without re-rendering.
 */

const STRONG = "#07389d"; // brand-500
const GLOW = "#d9e6ff"; // brand-100
const LIGHT_RADIUS = 80; // in the artwork's 1000-unit space
const MAX_PART_SIZE = 150; // larger paths are walls and the base, not windows or balconies
const MAX_TILT = 5; // degrees

type Part = { el: SVGPathElement; x: number; y: number; on: boolean };

export default function InteractiveApartment({ label, className = "" }: { label: string; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Part[] | null>(null);

  // Measured on first use: the paths only exist once the illustration has rendered.
  const parts = () => {
    if (partsRef.current) return partsRef.current;
    const found: Part[] = [];
    rootRef.current?.querySelectorAll<SVGPathElement>("svg g path:not([data-role='decor'])").forEach((el) => {
      const b = el.getBBox();
      if (b.width > MAX_PART_SIZE || b.height > MAX_PART_SIZE) return;
      el.style.transition = "fill 200ms ease-out, stroke 200ms ease-out";
      found.push({ el, x: b.x + b.width / 2, y: b.y + b.height / 2, on: false });
    });
    partsRef.current = found;
    return found;
  };

  const setLit = (part: Part, on: boolean) => {
    if (part.on === on) return;
    part.on = on;
    part.el.style.stroke = on ? STRONG : "";
    if (part.el.getAttribute("fill") !== "none") part.el.style.fill = on ? GLOW : "";
  };

  const track = (e: React.PointerEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const u = (e.clientX - box.left) / box.width;
    const v = (e.clientY - box.top) / box.height;
    for (const part of parts()) setLit(part, Math.hypot(u * 1000 - part.x, v * 1000 - part.y) < LIGHT_RADIUS);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.transform = `perspective(900px) rotateX(${((0.5 - v) * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${((u - 0.5) * 2 * MAX_TILT).toFixed(2)}deg)`;
    }
  };

  const reset = () => {
    for (const part of parts()) setLit(part, false);
    if (rootRef.current) rootRef.current.style.transform = "";
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={track}
      onPointerLeave={reset}
      className={"aspect-square transition-[transform,opacity] duration-200 ease-out " + className}
    >
      <LiniqoApartmentBlockBalconies label={label} accent={STRONG} line="#7f9be0" className="block" />
    </div>
  );
}
