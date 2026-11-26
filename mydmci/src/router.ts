import { useEffect, useState } from "react";

/**
 * Tiny path router for MyDMCI. The app is served under /mydmci/ (vite
 * `base`), so routes here are relative to that, e.g. "admin" or
 * "admin/rto/TIS-0001".
 */
const BASE = import.meta.env.BASE_URL; // "/mydmci/"

export function currentRoute(): string {
  const path = window.location.pathname;
  const rest = path.startsWith(BASE) ? path.slice(BASE.length) : path.replace(/^\/+/, "");
  return decodeURIComponent(rest.replace(/\/+$/, ""));
}

export function hrefFor(route: string): string {
  return BASE + route;
}

export function navigate(route: string, { replace = false } = {}) {
  const url = hrefFor(route);
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute(): string {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const onPop = () => setRoute(currentRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return route;
}
