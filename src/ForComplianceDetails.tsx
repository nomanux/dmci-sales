import Layout, { PageBackHeading } from "./Layout";
import KeyValueList from "./KeyValueList";
import { StatusPill } from "./StatusBadge";
import { useNavigation } from "./NavigationContext";

/**
 * ForComplianceDetails — opened by clicking the eye icon in the For
 * Compliance table.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 171801:261927.
 */

interface ComplianceMilestone {
  primarySellerName: string;
  commissionPayoutPlan: string;
  salesRepresentative: string;
  commissionDocumentCompliance: string;
  paymentPercentage: string;
  paymentPercentageRemarks: string;
  milestone: string;
  pdcAllocation: string;
  douCompliance: string;
  salesGroupName: string;
}

const MILESTONES: ComplianceMilestone[] = [
  { primarySellerName: "Pass", commissionPayoutPlan: "Pass", salesRepresentative: "Pass", commissionDocumentCompliance: "Pass", paymentPercentage: "Not Qualified", paymentPercentageRemarks: "Should be (2.5)", milestone: "Php 365,345", pdcAllocation: "Php 365,345", douCompliance: "Php 365,345", salesGroupName: "Php 365,345" },
  { primarySellerName: "Pass", commissionPayoutPlan: "Pass", salesRepresentative: "Pass", commissionDocumentCompliance: "Pass", paymentPercentage: "Not Qualified", paymentPercentageRemarks: "Php 365,345", milestone: "Php 365,345", pdcAllocation: "Php 365,345", douCompliance: "Php 365,345", salesGroupName: "Php 365,345" },
  { primarySellerName: "Pass", commissionPayoutPlan: "Pass", salesRepresentative: "Pass", commissionDocumentCompliance: "Pass", paymentPercentage: "Not Qualified", paymentPercentageRemarks: "Php 365,345", milestone: "Php 365,345", pdcAllocation: "Php 365,345", douCompliance: "Php 365,345", salesGroupName: "Php 365,345" },
];

export default function ForComplianceDetails() {
  const { route, navigate } = useNavigation();
  const account = route.itemId ?? "SC-0000105207";

  const leftRows = [
    { label: "Customer Account", value: account },
    { label: "Payment Term", value: "70% PM - 5% DP1 - 25% FP" },
    { label: "Reservation Date", value: "1 June 2026" },
    { label: "Docs-in Date", value: "1 June 2026" },
  ];

  const rightRows = [
    { label: "Project", value: "-" },
    { label: "Property Unit", value: "ACP-00A-C-08018" },
  ];

  return (
    <Layout
      active="commissions"
      activeSubItem="For Compliance"
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Commission", onClick: () => navigate({ screen: "compliance" }) },
        { label: "For Compliance", onClick: () => navigate({ screen: "compliance" }) },
        { label: "Details" },
      ]}
      orgBadge
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Compliance Details" onBack={() => navigate({ screen: "compliance" })} />

        <section className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <h3 className="text-base font-semibold text-gray-900">Information</h3>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
            <KeyValueList rows={leftRows} />
            <KeyValueList rows={rightRows} />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[1200px] border-collapse text-[13px]">
              <thead className="table-head">
                <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3">Primary Seller Name</th>
                  <th className="px-4 py-3">Commission Payout Plan</th>
                  <th className="px-4 py-3">Sales Representative</th>
                  <th className="px-4 py-3">Commission Document Compliance</th>
                  <th className="px-4 py-3">Payment Percentage</th>
                  <th className="px-4 py-3">Payment Percentage Remarks</th>
                  <th className="px-4 py-3">Milestone</th>
                  <th className="px-4 py-3">PDC Allocation</th>
                  <th className="px-4 py-3">DOU Compliance</th>
                  <th className="px-4 py-3">Sales Group Name</th>
                </tr>
              </thead>
              <tbody>
                {MILESTONES.map((row, index) => (
                  <tr key={index} className="border-t border-gray-100 text-gray-600">
                    <td className="px-4 py-1">
                      <StatusPill status={row.primarySellerName} />
                    </td>
                    <td className="px-4 py-1">
                      <StatusPill status={row.commissionPayoutPlan} />
                    </td>
                    <td className="px-4 py-1">
                      <StatusPill status={row.salesRepresentative} />
                    </td>
                    <td className="px-4 py-1">
                      <StatusPill status={row.commissionDocumentCompliance} />
                    </td>
                    <td className="px-4 py-1">
                      <StatusPill status={row.paymentPercentage} />
                    </td>
                    <td className="px-4 py-1">{row.paymentPercentageRemarks}</td>
                    <td className="px-4 py-1">{row.milestone}</td>
                    <td className="px-4 py-1">{row.pdcAllocation}</td>
                    <td className="px-4 py-1">{row.douCompliance}</td>
                    <td className="px-4 py-1">{row.salesGroupName}</td>
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
