import { MotionConfig, motion } from "motion/react";
import Layout, { PageBackHeading } from "./Layout";
import { StatusPill } from "./StatusBadge";
import { useNavigation } from "./NavigationContext";
import { itemEnter } from "./ViewToggle";
import { BuildingIcon, CalendarIcon, FileTextIcon, UserIcon, UsersIcon, WalletIcon } from "./icons";

/**
 * UnitHoldingDetails — opened by clicking the eye ("View") icon in the
 * Unit Holding table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173424:195339.
 *
 * Same fields as the original Overview / Primary Unit / Tandem cards,
 * regrouped in the style of Unit Details: a summary card with the holding
 * ID and status, a joined key-facts panel, the three holding dates as a
 * timeline, and the two units side by side.
 */

interface UnitBlock {
  project: string;
  building: string;
  category: string;
  propertyUnit: string;
}

type IconComponent = (props: { className?: string }) => React.JSX.Element;

// One cell of the key-facts panel (same look as Unit Details).
function FactTile({ label, value, icon: Icon, className = "" }: { label: string; value: string; icon: IconComponent; className?: string }) {
  return (
    <div className={"flex items-center gap-3 bg-white px-4 py-3.5 " + className}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <dt className="text-xs font-medium text-gray-500">{label}</dt>
        <dd className="truncate text-sm font-semibold text-gray-900" title={value}>
          {value}
        </dd>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{children}</h2>;
}

function UnitCard({ title, unit, index }: { title: string; unit: UnitBlock; index: number }) {
  return (
    <motion.section variants={itemEnter} custom={index} className="card flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BuildingIcon className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
        <span className="text-xs font-medium text-gray-500">Property Unit</span>
        <span className="text-lg font-semibold tracking-tight text-primary-500">{unit.propertyUnit}</span>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
        {[
          ["Project", unit.project],
          ["Building", unit.building],
          ["Category", unit.category],
        ].map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-500">{label}</dt>
            <dd className="truncate text-sm font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}

export default function UnitHoldingDetails() {
  const { route, navigate } = useNavigation();
  const holdingId = route.itemId ?? "HLD0327515";

  const holding = {
    status: "Active",
    crfNo: "CRF1301229",
    accountNo: "B000208142",
    clientName: "JUAN JUAN DELA CRUZ",
    crfExpired: "Dummy Online CRF",
    salesGroup: "Dummy_CRF",
    reopenedCategory: "-",
    reasonCode: "Normal Holding/Queueing",
    created: "3/30/2026 5:18:10 PM",
    held: "3/31/2026 5:18:36 PM",
    expired: "3/31/2026 5:18:36 PM",
    userId: "sellerportal",
  };

  const timeline = [
    { label: "Created Date/Time", value: holding.created },
    { label: "Holding Date/Time", value: holding.held },
    { label: "Expired Date/Time", value: holding.expired },
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
      <MotionConfig reducedMotion="user">
        <motion.div initial="hidden" animate="show" className="flex w-full flex-col gap-5 px-5 py-3">
          <PageBackHeading title="Unit Holding Details" onBack={() => navigate({ screen: "unit-holding" })} />

          {/* Summary: holding ID and status, then the key facts */}
          <motion.section variants={itemEnter} custom={0} className="card flex w-full flex-col gap-5 p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Unit Holding ID</span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">{holdingId}</span>
                  <span className="flex items-center">
                    <span className="sr-only">Holding Status: </span>
                    <StatusPill status={holding.status} />
                  </span>
                </div>
              </div>
            </div>

            {/* One joined panel; the 1px gaps show the gray behind as dividers. */}
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-5">
              <FactTile label="Client Name" value={holding.clientName} icon={UserIcon} />
              <FactTile label="CRF No." value={holding.crfNo} icon={FileTextIcon} />
              <FactTile label="Account No." value={holding.accountNo} icon={WalletIcon} />
              <FactTile label="Sales Group" value={holding.salesGroup} icon={UsersIcon} />
              <FactTile label="Expired Date/Time" value={holding.crfExpired} icon={CalendarIcon} className="sm:col-span-2 lg:col-span-1" />
            </dl>
          </motion.section>

          {/* Holding: the three dates as a timeline, then the remaining fields */}
          <motion.section variants={itemEnter} custom={1} className="card flex w-full flex-col gap-5 p-5">
            <SectionTitle>Holding</SectionTitle>

            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
              {timeline.map((step, i) => (
                <li key={step.label} className="relative flex gap-3 sm:flex-col sm:gap-3 sm:pr-6">
                  {/* Dot, with a line running on to the next step */}
                  <div className="flex items-center sm:w-full">
                    <span
                      className={
                        "relative z-[1] flex h-3 w-3 shrink-0 rounded-full ring-4 " +
                        (i === timeline.length - 1 ? "bg-white ring-brand-50 outline outline-2 outline-brand-400" : "bg-brand-500 ring-brand-50")
                      }
                    />
                    {i < timeline.length - 1 && <span className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-brand-200 to-gray-200 sm:block" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500">{step.label}</span>
                    <span className="text-sm font-semibold tabular-nums text-gray-900">{step.value}</span>
                  </div>
                </li>
              ))}
            </ol>

            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
              {[
                ["Reason Code", holding.reasonCode],
                ["Re-opened Unit Category", holding.reopenedCategory],
                ["User ID", holding.userId],
              ].map(([label, value]) => (
                <div key={label} className="flex min-w-0 flex-col gap-0.5 bg-white px-4 py-3">
                  <dt className="text-xs font-medium text-gray-500">{label}</dt>
                  <dd className="truncate text-sm font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.section>

          {/* The two units, side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <UnitCard title="Primary Unit" unit={primaryUnit} index={2} />
            <UnitCard title="Tandem/Package Unit" unit={tandemUnit} index={3} />
          </div>
        </motion.div>
      </MotionConfig>
    </Layout>
  );
}
