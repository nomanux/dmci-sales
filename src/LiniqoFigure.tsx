import { useEffect } from "react";

const EMBED_SRC = "https://liniqo.com/live/embed.js";

/**
 * Adds Liniqo's embed script to the page once. It mounts into any [data-liniqo]
 * element and watches for new ones, so every figure on a screen shares it.
 */
export function useLiniqoEmbed() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);
}
