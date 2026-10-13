import Layout, { PageBackHeading } from "./Layout";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Badge } from "./StatusBadge";
import { useNavigation, type Screen } from "./NavigationContext";
import PropertyCard, { type PropertyCardData } from "./PropertyCard";

/**
 * ProjectDetails — a single project's overview screen, reached from the
 * Property List by clicking a project row/card. The five pills top-right
 * (Tower / Floor / Unit / Parking Slot / Service Area) are the entry points
 * into each resource table for this project.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:205335.
 */

const RESOURCE_TABS: { label: string; screen: Screen }[] = [
  { label: "Tower", screen: "tower" },
  { label: "Floor", screen: "floor" },
  { label: "Unit", screen: "unit" },
  { label: "Parking Slot", screen: "parking-slot" },
  { label: "Service Area", screen: "service-area" },
];

const PROJECT_INFO: { label: string; value: string }[] = [
  { label: "Project Code", value: "ACE" },
  { label: "Project Status", value: "Ready for Occupancy" },
  { label: "Project Type", value: "Mid-rise" },
  {
    label: "Project Address",
    value:
      "P. Tuazon Boulevard Kaunlaran Quezon Paolo 1111-D Metro Manila, Philippines",
  },
  { label: "No. of Building/s", value: "1" },
  { label: "Floor/s per Tower", value: "6" },
  { label: "Total Unit/s", value: "435" },
];

interface OverviewRow {
  code: string;
  screen: Screen;
  total: number;
  sold: number;
  available: number;
  onHold: number;
}

const OVERVIEW_ROWS: OverviewRow[] = [
  {
    code: "Units",
    screen: "unit",
    total: 1,
    sold: 130,
    available: 130,
    onHold: 130,
  },
  {
    code: "Parking Slot",
    screen: "parking-slot",
    total: 5,
    sold: 523,
    available: 523,
    onHold: 523,
  },
  {
    code: "Service Area",
    screen: "service-area",
    total: 10,
    sold: 874,
    available: 874,
    onHold: 874,
  },
];

const RECENTLY_VIEWED: PropertyCardData[] = [
  {
    name: "Acacia Estates",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Arista Place",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "The Valeron Tower",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Alta Vista De Boracay",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
  {
    name: "Arista Place",
    available: [1302, 1230, 1123],
    sold: [523, 523, 523],
  },
];

export default function ProjectDetails() {
  const { route, navigate } = useNavigation();
  const project = route.project ?? "Acacia Estates";

  return (
    <Layout
      active="properties"
      activeSubItem="Projects"
      breadcrumb={[
        {
          label: "Property",
          onClick: () => navigate({ screen: "properties" }),
        },
        { label: "List", onClick: () => navigate({ screen: "properties" }) },
        { label: project },
      ]}
      orgBadge
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading
          title="Project Details"
          onBack={() => navigate({ screen: "properties" })}
        />

        <section className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-primary-500">{project}</h2>
            <div className="flex flex-wrap gap-1.5">
              {RESOURCE_TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => navigate({ screen: tab.screen, project })}
                  className="cursor-pointer"
                >
                  <Badge
                    label={tab.label}
                    color="brand"
                    size="sm"
                    icon="leading"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-50 p-6 lg:w-64 lg:shrink-0">
              <span className="text-center text-lg font-bold uppercase tracking-wide text-gray-600">
                Accolade Place
              </span>
            </div>
            <dl className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[160px_1fr]">
              {PROJECT_INFO.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-sm text-gray-500">{row.label}</dt>
                  <dd className="text-sm text-gray-900 before:mr-2 before:text-gray-500 before:content-[':']">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900">Overview</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50 [&_th]:text-xs [&_th]:font-semibold">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="px-5 py-2">Code</th>
                    <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                      Total
                    </th>
                    <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                      Sold
                    </th>
                    <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                      Available
                    </th>
                    <th className="border-b border-[#e9eaeb] px-5 py-2 text-center text-xs font-semibold">
                      On Hold
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {OVERVIEW_ROWS.map((row) => (
                    <tr key={row.code}>
                      <td className="h-[54px] border-b border-[#e5e7eb] px-5 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            navigate({ screen: row.screen, project })
                          }
                          className="cursor-pointer text-sm font-semibold text-[#06318a] hover:underline"
                        >
                          {row.code}
                        </button>
                      </td>
                      <td className="h-[54px] border-b border-[#e5e7eb] px-5 py-1 text-center text-sm text-gray-900">
                        {row.total}
                      </td>
                      <td className="h-[54px] border-b border-[#e5e7eb] px-5 py-1 text-center text-sm text-gray-900">
                        {row.sold}
                      </td>
                      <td className="h-[54px] border-b border-[#e5e7eb] px-5 py-1 text-center text-sm text-gray-900">
                        {row.available}
                      </td>
                      <td className="h-[54px] border-b border-[#e5e7eb] px-5 py-1 text-center text-sm text-gray-900">
                        {row.onHold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Recently Viewed
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {RECENTLY_VIEWED.map((card, index) => (
              <PropertyCard
                key={card.name + index}
                card={card}
                onClick={() =>
                  navigate({ screen: "project-details", project: card.name })
                }
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
