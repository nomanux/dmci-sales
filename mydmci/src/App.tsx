import { useEffect } from "react";
import { navigate, useRoute } from "./router";
import RtoApplicationsPage from "./admin/RtoApplicationsPage";
import TisDetailsPage from "./admin/TisDetailsPage";

/**
 * MyDMCI routes (under /mydmci/):
 *   admin               RTO Applications list
 *   admin/rto/:tisNo    TIS details
 * Anything else goes to admin.
 */
export default function App() {
  const route = useRoute();
  const detail = route.match(/^admin\/rto\/([^/]+)$/);
  const known = route === "admin" || Boolean(detail);

  useEffect(() => {
    if (!known) navigate("admin", { replace: true });
  }, [known]);

  useEffect(() => {
    document.querySelector("main")?.scrollTo(0, 0);
  }, [route]);

  if (detail) return <TisDetailsPage tisNo={detail[1]} />;
  return <RtoApplicationsPage />;
}
