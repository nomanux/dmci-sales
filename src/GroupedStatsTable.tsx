import Layout, { PageBackHeading } from "./Layout";
import type { FilterField } from "./FilterBar";
import ListSearchFilter from "./ListSearchFilter";
import Pagination from "./Pagination";
import { DownloadPdfButton, TableCardHeader } from "./StatusBadge";
import { useNavigation } from "./NavigationContext";

/**
 * GroupedStatsTable — shared table shape used by the Tower and Floor
 * screens: a few descriptive leading columns, followed by repeated
 * "Units / Parking Slot / Service Area" groups that each break down into
 * three sub-metrics (Tower: Sold/Available/On hold, Floor: Total/Sold/Available).
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, nodes 173418:206077 (Tower) and
 * 173418:206944 (Floor).
 */

export interface GroupedStatsRow {
  leading: (string | number)[];
  groupValues: [number, number, number][];
}

export interface GroupedStatsTableProps {
  title: string;
  filters: FilterField[];
  leadingColumns: string[];
  groups: string[];
  subColumns: [string, string, string];
  rows: GroupedStatsRow[];
}

export default function GroupedStatsTable({ title, filters, leadingColumns, groups, subColumns, rows }: GroupedStatsTableProps) {
  const { route, navigate } = useNavigation();
  const project = route.project ?? "Acacia Estates";

  return (
    <Layout
      active="properties"
      activeSubItem="Projects"
      breadcrumb={[
        { label: "Property", onClick: () => navigate({ screen: "properties" }) },
        { label: "List", onClick: () => navigate({ screen: "properties" }) },
        { label: project, onClick: () => navigate({ screen: "project-details", project }) },
        { label: title },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <PageBackHeading title={title} onBack={() => navigate({ screen: "project-details", project })} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <TableCardHeader
            title="Property List"
            leftSlot={<ListSearchFilter fields={filters} />}
            rightSlot={<DownloadPdfButton />}
          />
          <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
          <table className="w-full min-w-[1100px] border-collapse text-[13px]">
            <thead className="table-head">
              <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                {/* First column starts 16px in, lining up with the search box above. */}
                {leadingColumns.map((col, i) => (
                  <th key={col} rowSpan={2} className={(i === 0 ? "pl-4 pr-3" : "px-3") + " py-2 align-bottom font-semibold"}>
                    {col}
                  </th>
                ))}
                {groups.map((group) => (
                  <th key={group} colSpan={3} className="border-l border-gray-100 px-3 py-2 text-center font-semibold text-gray-500">
                    {group}
                  </th>
                ))}
              </tr>
              <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] text-left text-gray-400">
                {groups.map((group) =>
                  subColumns.map((sub, i) => (
                    <th key={group + sub} className={"px-3 py-2 text-center text-xs font-medium " + (i === 0 ? "border-l border-gray-100" : "")}>
                      {sub}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 text-gray-600 hover:bg-gray-50">
                  {row.leading.map((value, i) => (
                    <td key={i} className={"py-1 " + (i === 0 ? "pl-4 pr-3 font-medium text-gray-900" : "px-3")}>
                      {value}
                    </td>
                  ))}
                  {row.groupValues.map((values, groupIndex) =>
                    values.map((value, subIndex) => (
                      <td
                        key={groupIndex + "-" + subIndex}
                        className={
                          "px-3 py-1 text-center " +
                          (subIndex === 0 ? "border-l border-gray-100 " : "") +
                          (subIndex === 1 ? "font-semibold text-primary-500" : "text-gray-600")
                        }
                      >
                        {value}
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <Pagination total={85} />
        </div>
        </div>
      </div>
    </Layout>
  );
}
