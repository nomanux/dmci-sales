import Layout, { PageBackHeading } from "./Layout";
import { DownloadPdfButton, StatusPill } from "./StatusBadge";
import { BedDoubleIcon, Building2Icon, InfoIcon, LayersIcon, RulerIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import NoPhotoFigure from "./NoPhotoFigure";

/**
 * UnitAvailabilityDetails — opened by clicking the eye ("View") icon in the
 * Unit Availability table.
 *
 * Redesign (Nov 2026): unit summary, key facts and list price in one card,
 * remaining fields grouped by topic. Empty values read "Not set".
 * The previous design lives in UnitAvailabilityDetailsLegacy.tsx; switch back
 * with USE_LEGACY_UNIT_DETAILS in App.tsx.
 */

/** Blank values from the API ("", "----", "---", or the 1/1/0001 null date) show as "Not set". */
const EMPTY_VALUES = new Set(["", "-", "--", "---", "----", "1/1/0001"]);
const isEmpty = (value?: string | null) => value == null || EMPTY_VALUES.has(value.trim());

type Field = { label: string; value?: string | null };

function FieldValue({ value, className = "" }: { value?: string | null; className?: string }) {
  return isEmpty(value) ? (
    <span className={"font-normal text-gray-500 " + className}>Not set</span>
  ) : (
    <span className={className}>{value}</span>
  );
}

// One cell of the key-facts panel: icon, small label, value.
function FactTile({ label, value, icon: Icon }: Field & { icon: (props: { className?: string }) => React.JSX.Element }) {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <dt className="text-xs font-medium text-gray-500">{label}</dt>
        <dd className="truncate text-base font-semibold text-gray-900">
          <FieldValue value={value} className="text-sm" />
        </dd>
      </div>
    </div>
  );
}

function FieldGroup({ title, fields }: { title: string; fields: Field[] }) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 md:border-b-0 md:border-r last:border-r-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
      <dl className="flex flex-col gap-3.5">
        {fields.map((f) => (
          <div key={f.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-600">{f.label}</dt>
            <dd className="text-right font-medium text-gray-900">
              <FieldValue value={f.value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function UnitAvailabilityDetails() {
  const { route, navigate } = useNavigation();
  const unitCode = (route.itemId ?? "C- Accolade 320").toUpperCase();

  // Sample data, same values as the legacy page. Gross area assumed to be in sqm.
  const unit = {
    projectCode: "ACE",
    buildingUnit: unitCode,
    description: "2-Bedroom (Inner)",
    tower: "ACP-00A",
    floor: "----",
    type: "2BR",
    projectType: "Mid-rise",
    status: "Sold",
    category: "Condo Unit",
    location: "---",
    grossArea: "55.20 sqm",
    rfoDate: "1/1/0001",
    theme: "----",
    nonInstallation: "----",
    reopenCategory: "----",
    listPrice: "Php 8,695,000.00",
  };

  const summary = [unit.description, `Project ${unit.projectCode}`, `Tower ${unit.tower}`]
    .filter((s) => !isEmpty(s))
    .join(" · ");

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
      <div className="flex w-full flex-col gap-5 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageBackHeading title="Unit details" onBack={() => navigate({ screen: "unit-availability" })} />
          <DownloadPdfButton />
        </div>

        {/* Summary: photo, identity, key facts, price */}
        <section aria-labelledby="unit-title" className="card flex w-full flex-col gap-7 p-5 lg:flex-row">
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center lg:w-[400px] lg:shrink-0">
            <NoPhotoFigure className="w-full max-w-[200px]" />
            <p className="text-sm font-semibold text-gray-700">No unit photo yet</p>
            <p className="text-sm text-gray-600">The floor plan or photo appears here once uploaded.</p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={unit.status} />
                {[unit.category, unit.projectType]
                  .filter((t) => !isEmpty(t))
                  .map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
              </div>
              <h2 id="unit-title" className="text-3xl font-bold text-gray-900">
                {unit.buildingUnit}
              </h2>
              <p className="text-base text-gray-600">{summary}</p>
            </div>

            {/* One joined panel; the 1px gaps show the gray behind as dividers. */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
              <FactTile label="Gross area" value={unit.grossArea} icon={RulerIcon} />
              <FactTile label="Unit type" value={unit.type} icon={BedDoubleIcon} />
              <FactTile label="Tower" value={unit.tower} icon={Building2Icon} />
              <FactTile label="Floor" value={unit.floor} icon={LayersIcon} />
            </dl>

            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-600">List price</span>
              <span className="text-3xl font-bold tabular-nums text-brand-600">{unit.listPrice}</span>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-brand-50 bg-brand-25 px-3.5 py-3 text-sm text-brand-700">
              <InfoIcon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
              <p>
                <strong className="font-semibold">Before you hold this unit:</strong> DICD must validate and approve the
                hold before the reservation is accepted. This applies to units and parking slots.
              </p>
            </div>
          </div>
        </section>

        {/* Everything else, grouped */}
        <section aria-labelledby="spec-title" className="card w-full overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 id="spec-title" className="text-lg font-semibold text-gray-900">
              Unit specifications
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <FieldGroup
              title="Unit"
              fields={[
                { label: "Building unit", value: unit.buildingUnit },
                { label: "Description", value: unit.description },
                { label: "Type", value: unit.type },
                { label: "Category", value: unit.category },
                { label: "Gross area", value: unit.grossArea },
              ]}
            />
            <FieldGroup
              title="Project"
              fields={[
                { label: "Project code", value: unit.projectCode },
                { label: "Project type", value: unit.projectType },
                { label: "Tower", value: unit.tower },
                { label: "Floor", value: unit.floor },
                { label: "Location", value: unit.location },
              ]}
            />
            <FieldGroup
              title="Other"
              fields={[
                { label: "RFO date", value: unit.rfoDate },
                { label: "Theme", value: unit.theme },
                { label: "Non-installation", value: unit.nonInstallation },
                { label: "Re-open unit category", value: unit.reopenCategory },
              ]}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
