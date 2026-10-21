import Layout, { PageBackHeading } from "./Layout";
import KeyValueList from "./KeyValueList";
import { StatusPill } from "./StatusBadge";
import { useNavigation } from "./NavigationContext";

/**
 * RegularCommissionDetails — opened by clicking the eye icon in the
 * Regular Commission table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171748:282832.
 */

interface Milestone {
  milestone: number;
  netTcp: string;
  rate: string;
  grossCommission: string;
  percentage: string;
  commissionAmount: string;
}

const MILESTONES: Milestone[] = [
  { milestone: 1, netTcp: "Php 365,345", rate: "4000", grossCommission: "Php 365,345", percentage: "30", commissionAmount: "Php 365,345" },
  { milestone: 2, netTcp: "Php 365,345", rate: "4000", grossCommission: "Php 365,345", percentage: "20", commissionAmount: "Php 365,345" },
  { milestone: 3, netTcp: "Php 365,345", rate: "4000", grossCommission: "Php 365,345", percentage: "20", commissionAmount: "Php 365,345" },
];

export default function RegularCommissionDetails() {
  const { route, navigate } = useNavigation();
  const contractNo = route.itemId ?? "SC-0000105207";

  const leftRows = [
    { label: "Contract No", value: contractNo },
    { label: "Contract Status", value: <StatusPill status="Confirmed" /> },
    { label: "Client Account", value: "B000090778" },
    { label: "Client Name", value: "JOHN FRANCIS ENDRINAL VERGARA" },
    { label: "Comm. Document Compliance", value: "Yes" },
    { label: "Comm. Payout Plan", value: "C008-REGULAR" },
    { label: "Seller Name", value: "Dummy_CRF" },
    { label: "Employee ID", value: "Dummy_CRF" },
    { label: "Seller Role", value: "Dummy_CRF" },
  ];

  const rightRows = [
    { label: "Primary Seller Name", value: "-" },
    { label: "Primary Seller Id", value: "SLR-2345" },
    { label: "Primary Seller Role", value: "SM" },
    { label: "Sales Group", value: "LG_RMC132" },
    { label: "Department/Division", value: "Sales" },
    { label: "Payment Milestone Regular Commission", value: "28185" },
    { label: "Payment Received Percentage", value: "28185" },
  ];

  return (
    <Layout
      active="commissions"
      activeSubItem="Regular Commission"
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Commission", onClick: () => navigate({ screen: "regular-commission" }) },
        { label: "Regular Commission", onClick: () => navigate({ screen: "regular-commission" }) },
        { label: "Detail" },
      ]}
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Regular Commission Detail" onBack={() => navigate({ screen: "regular-commission" })} />

        <section className="card flex w-full flex-col gap-4 p-5">
          <h3 className="text-base font-semibold text-gray-900">Information</h3>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
            <KeyValueList rows={leftRows} />
            <KeyValueList rows={rightRows} />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[720px] border-collapse" style={{ fontSize: "13px" }}>
              <thead className="table-head">
                <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-1">Milestone</th>
                  <th className="px-5 py-1">Net TCP</th>
                  <th className="px-5 py-1">Rate</th>
                  <th className="px-5 py-1">Gross Commission</th>
                  <th className="px-5 py-1">Percentage</th>
                  <th className="px-5 py-1">Commission Amount</th>
                </tr>
              </thead>
              <tbody>
                {MILESTONES.map((row) => (
                  <tr key={row.milestone} className="border-t border-gray-100 text-gray-600">
                    <td className="px-5 py-2">{row.milestone}</td>
                    <td className="px-5 py-2">{row.netTcp}</td>
                    <td className="px-5 py-2">{row.rate}</td>
                    <td className="px-5 py-2">{row.grossCommission}</td>
                    <td className="px-5 py-2">{row.percentage}</td>
                    <td className="px-5 py-2">{row.commissionAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
