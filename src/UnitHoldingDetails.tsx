import Layout, { PageBackHeading } from "./Layout";
import KeyValueList from "./KeyValueList";
import { StatusPill } from "./StatusBadge";
import { useNavigation } from "./NavigationContext";

/**
 * UnitHoldingDetails — opened by clicking the eye ("View") icon in the
 * Unit Holding table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:195339.
 */

interface UnitBlock {
  project: string;
  building: string;
  category: string;
  propertyUnit: string;
}

function UnitBlockCard({ title, unit }: { title: string; unit: UnitBlock }) {
  return (
    <section className="card flex w-full flex-col gap-4 p-5">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Project</span>
          <span className="text-sm text-gray-900">{unit.project}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Building</span>
          <span className="text-sm text-gray-900">{unit.building}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Category</span>
          <span className="text-sm text-gray-900">{unit.category}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Property Unit</span>
          <span className="text-sm text-gray-900">{unit.propertyUnit}</span>
        </div>
      </div>
    </section>
  );
}

export default function UnitHoldingDetails() {
  const { route, navigate } = useNavigation();
  const holdingId = route.itemId ?? "HLD0327515";

  const leftRows = [
    { label: "Unit Holding ID", value: holdingId },
    { label: "Holding Status", value: <StatusPill status="Active" /> },
    { label: "CRF No.", value: "CRF1301229" },
    { label: "Account No.", value: "B000208142" },
    { label: "Client Name", value: "JUAN JUAN DELA CRUZ" },
    { label: "Expired Date/Time", value: "Dummy Online CRF" },
    { label: "Sales Group", value: "Dummy_CRF" },
  ];

  const rightRows = [
    { label: "Re-opened Unit Category", value: "-" },
    { label: "Reason Code", value: "Normal Holding/Queueing" },
    { label: "Created Date/Time", value: "3/30/2026 5:18:10 PM" },
    { label: "Holding Date/Time", value: "3/31/2026 5:18:36 PM" },
    { label: "Expired Date/Time", value: "3/31/2026 5:18:36 PM" },
    { label: "User ID", value: "sellerportal" },
  ];

  const primaryUnit: UnitBlock = { project: "Allegra Garden Place", building: "C- Amina 2223", category: "CondoUnit", propertyUnit: "AGP-00A-C-22023" };
  const tandemUnit: UnitBlock = { project: "Allegra Garden Place", building: "C- Amina 2223", category: "CondoUnit", propertyUnit: "AGP-00A-C-22023" };

  return (
    <Layout
      active="properties"
      activeSubItem="Unit Holding"
      breadcrumb={[
        { label: "Property", onClick: () => navigate({ screen: "properties" }) },
        { label: "Unit Holding", onClick: () => navigate({ screen: "unit-holding" }) },
        { label: "Details" },
      ]}
      orgBadge
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Unit Holding Details" onBack={() => navigate({ screen: "unit-holding" })} />

        <section className="card flex w-full flex-col gap-4 p-5">
          <h3 className="text-base font-semibold text-gray-900">Overview</h3>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
            <KeyValueList rows={leftRows} />
            <KeyValueList rows={rightRows} />
          </div>
        </section>

        <UnitBlockCard title="Primary Unit" unit={primaryUnit} />
        <UnitBlockCard title="Tandem/Package Unit" unit={tandemUnit} />
      </div>
    </Layout>
  );
}
