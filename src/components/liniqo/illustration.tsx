import * as React from "react"

export type IllustrationTheme = "auto" | "light" | "dark" | "system"
export type IllustrationAnimation = "none" | "draw" | "float" | "draw-float"
export type IllustrationTrigger = "mount" | "hover" | "inView"

export interface IllustrationProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "title"> {
  /** Inner SVG markup (what the Liniqo registry items pass in). */
  art?: string
  /** A full Liniqo SVG file as a string (e.g. imported with `?raw`). Used when `art` is not set. */
  svg?: string
  /** Accessible name. Ignored when `decorative` is true. */
  label?: string
  /** Hide from assistive tech. */
  decorative?: boolean
  /** Accent colour, any CSS colour. Default #3a57ff. */
  accent?: string
  /** Line colour, any CSS colour. Default follows the theme. */
  line?: string
  /**
   * "auto" follows a `.dark` class (shadcn default) or `[data-theme="dark"]` on an ancestor.
   * "system" follows the OS setting. "light" and "dark" force a palette.
   */
  theme?: IllustrationTheme
  /** "transparent" (default), "surface" (theme tinted panel) or any CSS colour. */
  background?: string
  /** Width in px or any CSS length. Height follows (square). Default "100%". */
  size?: number | string
  animation?: IllustrationAnimation
  /** When the animation starts. Default "mount". */
  trigger?: IllustrationTrigger
  /** Animation speed multiplier. Default 1. */
  speed?: number
}

const CSS = `
.liniqo-illustration{--hl-ink:#15171c;--hl-graphite:#555a62;--hl-mute:#8d9097;--hl-grid:#b5b7bc;--hl-surface-3:#d4d4d8;--hl-surface-2:#e4e4e6;--hl-surface-1:#f1f1f2;--hl-surface-0:#ffffff;--hl-accent:#3a57ff;--hl-accent-tint:#dfe5ff;--liniqo-stage:#f3f3f4;display:inline-block;aspect-ratio:1/1;line-height:0;max-width:100%}
.liniqo-illustration[data-theme="dark"],.dark .liniqo-illustration[data-theme="auto"],[data-theme="dark"] .liniqo-illustration[data-theme="auto"]{--hl-ink:#eef0f3;--hl-graphite:#9aa0aa;--hl-mute:#6b717c;--hl-grid:#4a505a;--hl-surface-3:#363b44;--hl-surface-2:#1b1f25;--hl-surface-1:#232830;--hl-surface-0:#2b3038;--hl-accent-tint:#212b5e;--liniqo-stage:#101215}
@media (prefers-color-scheme:dark){.liniqo-illustration[data-theme="system"]{--hl-ink:#eef0f3;--hl-graphite:#9aa0aa;--hl-mute:#6b717c;--hl-grid:#4a505a;--hl-surface-3:#363b44;--hl-surface-2:#1b1f25;--hl-surface-1:#232830;--hl-surface-0:#2b3038;--hl-accent-tint:#212b5e;--liniqo-stage:#101215}}
.liniqo-illustration svg{display:block;width:100%;height:100%;overflow:visible}
.liniqo-illustration .f-ink{fill:var(--hl-ink)}.liniqo-illustration .s-ink{stroke:var(--hl-ink)}
.liniqo-illustration .f-graphite{fill:var(--hl-graphite)}.liniqo-illustration .s-graphite{stroke:var(--hl-graphite)}
.liniqo-illustration .f-mute{fill:var(--hl-mute)}.liniqo-illustration .s-mute{stroke:var(--hl-mute)}
.liniqo-illustration .f-grid{fill:var(--hl-grid)}.liniqo-illustration .s-grid{stroke:var(--hl-grid)}
.liniqo-illustration .f-surface-3{fill:var(--hl-surface-3)}.liniqo-illustration .s-surface-3{stroke:var(--hl-surface-3)}
.liniqo-illustration .f-surface-2{fill:var(--hl-surface-2)}.liniqo-illustration .s-surface-2{stroke:var(--hl-surface-2)}
.liniqo-illustration .f-surface-1{fill:var(--hl-surface-1)}.liniqo-illustration .s-surface-1{stroke:var(--hl-surface-1)}
.liniqo-illustration .f-surface-0{fill:var(--hl-surface-0)}.liniqo-illustration .s-surface-0{stroke:var(--hl-surface-0)}
.liniqo-illustration .f-accent{fill:var(--hl-accent)}.liniqo-illustration .s-accent{stroke:var(--hl-accent)}
.liniqo-illustration .f-accent-tint{fill:var(--hl-accent-tint)}.liniqo-illustration .s-accent-tint{stroke:var(--hl-accent-tint)}
`

/** Turns a full Liniqo SVG file into the inner markup the component renders. */
export function prepareSvg(svg: string): string {
  let s = svg
  const open = s.indexOf("<svg")
  if (open >= 0) s = s.slice(open)
  s = s.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
  s = s
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<desc>[\s\S]*?<\/desc>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    .replace(/<rect[^>]*width="1000"[^>]*height="1000"[^>]*\/>/, "")
    .replace(/ id="artwork"/, "")
    .replace(/url\(#hatch\)/g, "url(#liniqo-hatch)")
  return s
}

function runAnimation(
  root: SVGGElement,
  mode: IllustrationAnimation,
  speed: number,
  out: Animation[]
) {
  const els = Array.from(root.querySelectorAll<SVGElement>("path,circle"))
  const art = els.filter((e) => e.getAttribute("data-role") !== "decor")
  const n = Math.max(1, art.length)
  let k = 0
  if (mode === "draw" || mode === "draw-float") {
    for (const e of els) {
      const decor = e.getAttribute("data-role") === "decor"
      let delay = 0
      if (!decor) {
        delay = ((0.35 + (k / n) * 2.4) * 1000) / speed
        k++
      }
      const dashed = e.hasAttribute("stroke-dasharray")
      const cls = e.getAttribute("class") || ""
      const f = e.getAttribute("fill")
      const fillOnly =
        e.getAttribute("stroke") === "none" ||
        /(^|\s)f-/.test(cls) ||
        (f && f !== "none")
      const draw = !decor && !dashed && e.tagName === "path" && !fillOnly
      if (draw) {
        e.setAttribute("pathLength", "1")
        e.style.strokeDasharray = "1"
        out.push(
          e.animate(
            [
              { strokeDashoffset: 1, opacity: 0 },
              { strokeDashoffset: 1, opacity: 1, offset: 0.3 },
              { strokeDashoffset: 0, opacity: 1 },
            ],
            { duration: 900 / speed, delay, fill: "both", easing: "ease-out" }
          )
        )
      } else {
        const o =
          decor && e.getAttribute("opacity") ? Number(e.getAttribute("opacity")) : 1
        out.push(
          e.animate([{ opacity: 0 }, { opacity: o }], {
            duration: 500 / speed,
            delay,
            fill: "both",
            easing: "ease-out",
          })
        )
      }
    }
  }
  if (mode === "float" || mode === "draw-float") {
    let fg = root.querySelector<SVGGElement>("g.liniqo-float")
    if (!fg) {
      const nd = els.filter((e) => e.getAttribute("data-role") !== "decor")
      if (nd.length) {
        fg = document.createElementNS("http://www.w3.org/2000/svg", "g")
        fg.setAttribute("class", "liniqo-float")
        nd[0].parentNode!.insertBefore(fg, nd[0])
        nd.forEach((e) => fg!.appendChild(e))
      }
    }
    out.push(
      (fg || root).animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-16px)" },
          { transform: "translateY(0)" },
        ],
        {
          duration: 2800 / speed,
          delay: mode === "float" ? 0 : 1200 / speed,
          iterations: Infinity,
          easing: "ease-in-out",
        }
      )
    )
  }
}

export function Illustration({
  art,
  svg,
  label,
  decorative,
  accent,
  line,
  theme = "auto",
  background = "transparent",
  size = "100%",
  animation = "none",
  trigger = "mount",
  speed = 1,
  className,
  style,
  ...rest
}: IllustrationProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const gRef = React.useRef<SVGGElement>(null)
  const markup = React.useMemo(
    () => (art ?? (svg ? prepareSvg(svg) : "")).replace(/url\(#hatch\)/g, "url(#liniqo-hatch)"),
    [art, svg]
  )

  React.useEffect(() => {
    const root = rootRef.current
    const g = gRef.current
    if (!root || !g || animation === "none") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let running: Animation[] = []
    const stop = () => {
      running.forEach((a) => {
        try {
          a.cancel()
        } catch {}
      })
      running = []
    }
    const start = () => {
      stop()
      runAnimation(g, animation, speed, running)
    }
    let io: IntersectionObserver | undefined
    if (trigger === "mount") start()
    else if (trigger === "inView") {
      io = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) {
          start()
          io?.disconnect()
        }
      })
      io.observe(root)
    } else {
      root.addEventListener("pointerenter", start)
    }
    return () => {
      io?.disconnect()
      root.removeEventListener("pointerenter", start)
      stop()
    }
  }, [animation, trigger, speed, markup])

  const vars: Record<string, string> = {}
  if (accent) {
    vars["--hl-accent"] = accent
    vars["--hl-accent-tint"] = `color-mix(in srgb, ${accent} 18%, var(--hl-surface-0))`
  }
  if (line) {
    vars["--hl-ink"] = line
    vars["--hl-graphite"] = `color-mix(in srgb, ${line} 70%, var(--hl-surface-0))`
  }
  const bg =
    background === "surface"
      ? "var(--liniqo-stage)"
      : background === "transparent"
        ? undefined
        : background

  return (
    <span
      ref={rootRef}
      data-theme={theme}
      className={["liniqo-illustration", className].filter(Boolean).join(" ")}
      style={
        {
          ...vars,
          width: size,
          background: bg,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <svg
        viewBox="0 0 1000 1000"
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative ? true : undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{CSS}</style>
        <defs>
          <pattern
            id="liniqo-hatch"
            width="2.6"
            height="2.6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="2.6" stroke="var(--hl-grid)" strokeWidth="0.55" />
          </pattern>
        </defs>
        <g ref={gRef} fill="none" strokeLinejoin="round" strokeLinecap="round" dangerouslySetInnerHTML={{ __html: markup }} />
      </svg>
    </span>
  )
}
