import Layout, { PageBackHeading } from "./Layout";
import KeyValueList from "./KeyValueList";
import { DownloadPdfButton } from "./StatusBadge";
import { InfoIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import { noImageAvailableGraphicUrl } from "./assets/figmaAssets";

/**
 * UnitAvailabilityDetails — opened by clicking the eye ("View") icon in the
 * Unit Availability table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:198691.
 */
export default function UnitAvailabilityDetails() {
  const { route, navigate } = useNavigation();
  const unitCode = route.itemId ?? "C- Accolade 320";

  const rows = [
    { label: "Project Code", value: "ACE" },
    { label: "Building Unit", value: unitCode },
    { label: "Description", value: "2- Bedroom ( Inner )" },
    { label: "Tower Description", value: "ACP-00A" },
    { label: "Floor Description", value: "----" },
    { label: "Type", value: "2BR" },
    { label: "Project Type", value: "Mid-rise" },
    { label: "Status", value: "Sold" },
    { label: "Category", value: "Condo Unit" },
    { label: "Location", value: "---" },
    { label: "Gross Area", value: "55.20 sq..." },
    { label: "RFO Date", value: "1/1/0001" },
    { label: "Theme", value: "----" },
    { label: "Non-Installation", value: "----" },
    { label: "Re-Open Unit Category", value: "----" },
  ];

  return (
    <Layout
      active="properties"
      activeSubItem="Unit Availability"
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Property", onClick: () => navigate({ screen: "properties" }) },
        { label: "Unit Availability", onClick: () => navigate({ screen: "unit-availability" }) },
        { label: "Details" },
      ]}
      orgBadge
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Details" onBack={() => navigate({ screen: "unit-availability" })} />

        <section className="card flex w-full flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-primary-500">{unitCode.toUpperCase()}</h2>
            <DownloadPdfButton />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-[420px] lg:shrink-0">
              <KeyValueList rows={rows} />
            </div>
            <div className="flex min-h-[380px] flex-1 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 p-5">
              <img src={noImageAvailableGraphicUrl} alt="No image available" className="w-full max-w-[280px]" />
            </div>
          </div>
        </section>

        <section className="card flex w-full items-center justify-between px-6 py-5">
          <span className="text-sm text-gray-500">List Price:</span>
          <span className="text-base font-bold text-gray-900">Php 8,695,000.00</span>
        </section>

        <div className="flex items-start gap-3 rounded-lg border border-primary-50 bg-blue-50 px-5 py-4 text-sm text-gray-700">
          <InfoIcon className="h-5 w-5 shrink-0 text-primary-500" />
          <p>
            <strong className="font-semibold text-gray-900">Disclaimer:</strong> Holding of this unit/parking slot is still
            subject for validation/approval of DICD prior to acceptance of reservation.
          </p>
        </div>
      </div>
    </Layout>
  );
}
