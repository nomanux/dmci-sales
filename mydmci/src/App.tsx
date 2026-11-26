import { useEffect } from "react";
import { navigate, useRoute } from "./router";
import RtoApplicationsPage from "./admin/RtoApplicationsPage";
import TisDetailsPage from "./admin/TisDetailsPage";
import CreateLinkPage from "./admin/CreateLinkPage";
import ReservationOpsPage from "./admin/ReservationOpsPage";

/**
 * MyDMCI routes (under /mydmci/):
 *   admin               RTO Applications list
 *   admin/rto/:tisNo    TIS details
 *   admin/create-link   Create Application Link
 *   admin/reservation-ops  Reservation Operations
 * Anything else goes to admin.
 */
export default function App() {
  const route = useRoute();
  const detail = route.match(/^admin\/rto\/([^/]+)$/);
  const known = route === "admin" || route === "admin/create-link" || route === "admin/reservation-ops" || Boolean(detail);

  useEffect(() => {
    if (!known) navigate("admin", { replace: true });
  }, [known]);

  useEffect(() => {
    document.querySelector("main")?.scrollTo(0, 0);
  }, [route]);

  if (route === "admin/create-link") return <CreateLinkPage />;
  if (route === "admin/reservation-ops") return <ReservationOpsPage />;
  if (detail) return <TisDetailsPage tisNo={detail[1]} />;
  return <RtoApplicationsPage />;
}
