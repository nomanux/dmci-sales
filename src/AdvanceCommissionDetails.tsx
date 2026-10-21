import Layout, { PageBackHeading } from "./Layout";
import KeyValueList from "./KeyValueList";
import { useNavigation } from "./NavigationContext";

/**
 * AdvanceCommissionDetails — opened by clicking the eye icon in the
 * Advance Commission table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171752:279841.
 */
export default function AdvanceCommissionDetails() {
  const { route, navigate } = useNavigation();
  const reservationId = route.itemId ?? "HLD0327515";

  const sellerRows = [
    { label: "Seller ID", value: reservationId },
    { label: "Seller Group", value: "-" },
    { label: "Seller Name", value: "Juan Dela Cruz" },
    { label: "Seller Department", value: "LG_23452345" },
    { label: "Seller Role", value: "SM" },
  ];

  const reservationRows = [
    { label: "Reservation ID", value: "RES-6574574567" },
    { label: "Reservation Amount", value: "Php 20,000.00" },
    { label: "OR Number", value: "MNL-45345345345" },
    { label: "Date Released", value: "Jan 01, 2025" },
  ];

  return (
    <Layout
      active="commissions"
      activeSubItem="Advance Commission"
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Commission", onClick: () => navigate({ screen: "advance-commission" }) },
        { label: "Advance Commission", onClick: () => navigate({ screen: "advance-commission" }) },
        { label: "Detail" },
      ]}
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Advance Commission Detail" onBack={() => navigate({ screen: "advance-commission" })} />

        <section className="card flex w-full flex-col gap-4 p-5">
          <h3 className="text-base font-semibold text-gray-900">Seller Information</h3>
          <KeyValueList rows={sellerRows} />
        </section>

        <section className="card flex w-full flex-col gap-4 p-5">
          <h3 className="text-base font-semibold text-gray-900">Reservation Information</h3>
          <KeyValueList rows={reservationRows} />
        </section>
      </div>
    </Layout>
  );
}
