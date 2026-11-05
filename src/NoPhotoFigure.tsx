import { useRef, useState } from "react";

/**
 * NoPhotoFigure — "no photo available" for a project card: a line drawing of a
 * picture with a strike through it. The sun follows the pointer and the hills
 * shift slightly behind it. Same tones as the lamp on NoResults.
 */

const STRONG = "#07389d"; // brand-500
const OUTLINE = "#7f9be0";
const DETAIL = "#b3ccff"; // brand-200
const GLOW = "#d9e6ff"; // brand-100

const FRAME = { x: 46, y: 22, w: 108, h: 80 };
const REST: [number, number] = [0, 0];

export default function NoPhotoFigure({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Pointer position from the centre of the figure, -1 to 1 on each axis.
  const [[px, py], setPointer] = useState(REST);

  const track = (e: React.PointerEvent) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (box?.width) setPointer([((e.clientX - box.left) / box.width) * 2 - 1, ((e.clientY - box.top) / box.height) * 2 - 1]);
  };
  const move = (dx: number, dy: number) => ({
    transform: `translate(${dx}px, ${dy}px)`,
    transition: "transform 260ms ease-out",
  });
  const clipId = "no-photo-frame";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 124"
      aria-hidden="true"
      onPointerMove={track}
      onPointerLeave={() => setPointer(REST)}
      className={className}
      fill="none"
      stroke={OUTLINE}
      strokeWidth={1.2}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <clipPath id={clipId}>
        <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={6} />
      </clipPath>
      <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={6} fill="#ffffff" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={82} cy={50} r={9} fill={GLOW} stroke={DETAIL} style={move(px * 26, py * 14)} />
        <path d="M30 118 L78 66 L108 94 L128 74 L176 118 Z" fill="#ffffff" stroke={OUTLINE} style={move(px * -4, 0)} />
      </g>
      <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={6} />
      {/* The strike is the one strong mark, so it reads as "no photo" at a glance. */}
      <line x1={38} y1={110} x2={162} y2={14} stroke="#f9fafb" strokeWidth={5} />
      <line x1={38} y1={110} x2={162} y2={14} stroke={STRONG} strokeWidth={1.6} />
    </svg>
  );
}
