import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * NavigationContext — a tiny router so the DMCI Homes Sales CRF/RA screens
 * can actually link to each other (sidebar, breadcrumbs, project rows/cards,
 * the Tower/Floor/Unit/Parking Slot/Service Area tabs) without adding
 * react-router as a dependency. Every screen gets its own real, unique URL
 * (synced via the History API), so the address bar always reflects the
 * current screen and the browser Back/Forward buttons work.
 */

export type Screen =
  | "login"
  | "login0"
  | "profile"
  | "change-password"
  | "dashboard"
  | "properties"
  | "project-details"
  | "tower"
  | "floor"
  | "unit"
  | "parking-slot"
  | "service-area"
  | "unit-availability"
  | "unit-availability-details"
  | "unit-holding"
  | "unit-holding-details"
  | "computation-sheet"
  | "clients"
  | "advance-commission"
  | "advance-commission-details"
  | "regular-commission"
  | "regular-commission-details"
  | "compliance"
  | "compliance-details"
  | "lottery-registration"
  | "lottery-unit-picker"
  | "payment-method"
  | "ra-form"
  | "capture-selfie-track"
  | "ra-form-v2";

export interface Route {
  screen: Screen;
  /** Project name for context, used by Project Details and the five resource tables. */
  project?: string;
  /** Row identifier for context, used by the Unit Availability / Unit Holding detail screens. */
  itemId?: string;
  /** Current step slug for multi-step screens (the RA form track). */
  step?: string;
}

interface NavigationContextValue {
  route: Route;
  navigate: (route: Route) => void;
  back: () => void;
  canGoBack: boolean;
}

const DEFAULT_ROUTE: Route = { screen: "login" };

// One unique, human-readable path per screen. Optional context (project,
// itemId) rides along as a query string so a full URL is always enough to
// reconstruct the exact route (deep-link/refresh/share all just work).
const SCREEN_PATHS: Record<Screen, string> = {
  login: "/login",
  // Original login design, kept for before/after comparison with /login.
  login0: "/login0",
  profile: "/profile",
  "change-password": "/profile/change-password",
  dashboard: "/dashboard",
  properties: "/properties",
  "project-details": "/properties/details",
  tower: "/properties/tower",
  floor: "/properties/floor",
  unit: "/properties/unit",
  "parking-slot": "/properties/parking-slot",
  "service-area": "/properties/service-area",
  "unit-availability": "/unit-availability",
  "unit-availability-details": "/unit-availability/details",
  "unit-holding": "/unit-holding",
  "unit-holding-details": "/unit-holding/details",
  "computation-sheet": "/computation-sheet",
  clients: "/clients",
  "advance-commission": "/commission/advance",
  "advance-commission-details": "/commission/advance/details",
  "regular-commission": "/commission/regular",
  "regular-commission-details": "/commission/regular/details",
  compliance: "/commission/compliance",
  "compliance-details": "/commission/compliance/details",
  "lottery-registration": "/lottery/registration",
  "lottery-unit-picker": "/lottery/unit-picker",
  "payment-method": "/payment-method",
  // The 8-step CRF/RA track: v1 at /ra-form1, v2 (a copy to iterate on) at
  // /ra-form2. The older single-file RA form moved to /ra-form-legacy.
  "ra-form": "/ra-form-legacy",
  "capture-selfie-track": "/ra-form1",
  "ra-form-v2": "/ra-form2",
};

const PATH_TO_SCREEN: Record<string, Screen> = {
  ...(Object.fromEntries(Object.entries(SCREEN_PATHS).map(([screen, path]) => [path, screen])) as Record<string, Screen>),
  // Old bookmarks: open v1 and the URL is rewritten to /ra-form1.
  "/ra-form": "capture-selfie-track",
  "/capture-selfie-track": "capture-selfie-track",
};

function routeToUrl(route: Route): string {
  const path = SCREEN_PATHS[route.screen] ?? SCREEN_PATHS.login;
  const params = new URLSearchParams();
  if (route.project) params.set("project", route.project);
  if (route.itemId) params.set("itemId", route.itemId);
  if (route.step) params.set("step", route.step);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function urlToRoute(pathname: string, search: string): Route {
  const screen = PATH_TO_SCREEN[pathname] ?? DEFAULT_ROUTE.screen;
  const params = new URLSearchParams(search);
  const route: Route = { screen };
  const project = params.get("project");
  if (project) route.project = project;
  const itemId = params.get("itemId");
  if (itemId) route.itemId = itemId;
  const step = params.get("step");
  if (step) route.step = step;
  return route;
}

function readRouteFromLocation(): Route {
  if (typeof window === "undefined") return DEFAULT_ROUTE;
  return urlToRoute(window.location.pathname, window.location.search);
}

interface HistoryState {
  depth: number;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children, initialRoute }: { children: ReactNode; initialRoute?: Route }) {
  const [route, setRoute] = useState<Route>(() => initialRoute ?? readRouteFromLocation());
  const [depth, setDepth] = useState(0);

  // Stamp the starting history entry with depth 0, and normalize the URL to
  // whatever route we actually resolved (covers "/" or an unknown path
  // falling back to the login screen).
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState({ depth: 0 } satisfies HistoryState, "", routeToUrl(route));
    // Only run once on mount — this is deliberately not tied to `route`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep in sync with the browser's own Back/Forward buttons.
  useEffect(() => {
    function onPopState(event: PopStateEvent) {
      const state = event.state as HistoryState | null;
      setRoute(readRouteFromLocation());
      setDepth(state?.depth ?? 0);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((next: Route) => {
    setRoute(next);
    setDepth((current) => {
      const nextDepth = current + 1;
      window.history.pushState({ depth: nextDepth } satisfies HistoryState, "", routeToUrl(next));
      return nextDepth;
    });
  }, []);

  const back = useCallback(() => {
    if (depth > 0) window.history.back();
  }, [depth]);

  const value = useMemo<NavigationContextValue>(
    () => ({ route, navigate, back, canGoBack: depth > 0 }),
    [route, navigate, back, depth]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
}
