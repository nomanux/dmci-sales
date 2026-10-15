import { useState } from "react";
import Layout, { PageBackHeading } from "./Layout";
import type { FilterField } from "./FilterBar";
import ListSearchFilter, { type FilterValues } from "./ListSearchFilter";
import Pagination from "./Pagination";
import Checkbox from "./Checkbox";
import ImagePreviewModal from "./ImagePreviewModal";
import { DownloadPdfButton, StatusPill, TableCardHeader } from "./StatusBadge";
import RowActionButton from "./RowActionButton";
import { EyeIcon, ImageIcon, PauseCircleIcon } from "./icons";
import { useNavigation } from "./NavigationContext";
import { unitFloorplanB3Url } from "./assets/figmaAssets";

/**
 * UnitStyleTable — shared table shape used by the Unit, Parking Slot, and
 * Service Area screens: they're the same columns/filters, just scoped to a
 * different "Category" default and (for Service Area) an extra column.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, nodes 173418:206320 (Unit),
 * 173418:206142 (Parking Slot), 173418:206498 (Service Area). The image
 * action opens the "Property Unit Image" modal, node 173418:206567.
 */

export interface UnitStyleRow {
  code: string;
  buildingUnit: string;
  description: string;
  status: string;
  category: string;
  propertyUnit?: string;
  notes?: string;
}

export interface UnitStyleTableProps {
  title: string;
  categoryDefault: string;
  showPropertyUnitColumn?: boolean;
  /** Unit screen: a third "Hold" action, disabled once the unit is sold. */
  showHoldAction?: boolean;
  rows: UnitStyleRow[];
}

/** "C- Accolade 101" → "C- Accolade" (the building, without the unit number). */
function buildingOf(row: UnitStyleRow): string {
  return row.buildingUnit.replace(/s*S+$/, "");
}

export default function UnitStyleTable({
  title,
  categoryDefault,
  showPropertyUnitColumn,
  showHoldAction,
  rows,
}: UnitStyleTableProps) {
  const [previewRow, setPreviewRow] = useState<UnitStyleRow | null>(null);
  const { route, navigate } = useNavigation();
  const project = route.project ?? "Acacia Estates";

  // Filter options come from this page's own rows, so every choice matches
  // something in the table. Nothing is pre-applied (the page is already
  // scoped to its category).
  const unique = (values: string[]) =>
    [...new Set(values)].sort((a, b) => a.localeCompare(b)).map((value) => ({ value, label: value }));
  const filters: FilterField[] = [
    { kind: "select", label: "Project", placeholder: "Select one", options: unique(rows.map((r) => r.code)) },
    { kind: "select", label: "Building", placeholder: "Select one", options: unique(rows.map(buildingOf)) },
    {
      kind: "select",
      label: "Status",
      placeholder: "Select one",
      options: unique(["Available", "On Hold", "Sold", ...rows.map((r) => r.status)]),
    },
    { kind: "select", label: "Category", placeholder: "Select one", options: unique(rows.map((r) => r.category)) },
    { kind: "select", label: "Unit Type", placeholder: "Select one", options: unique(rows.map((r) => r.description)) },
    {
      kind: "select",
      label: "Show List Price?",
      labelAccent: "(PDF Report)",
      placeholder: "Select one",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
  ];

  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState<FilterValues>({});
  const query = search.trim().toLowerCase();
  const visibleRows = rows.filter(
    (row) =>
      (!applied.Project || row.code === applied.Project) &&
      (!applied.Building || buildingOf(row) === applied.Building) &&
      (!applied.Status || row.status === applied.Status) &&
      (!applied.Category || row.category === applied.Category) &&
      (!applied["Unit Type"] || row.description === applied["Unit Type"]) &&
      (!query ||
        [row.code, row.buildingUnit, row.description, row.category, row.propertyUnit ?? "", row.notes ?? ""].some((v) =>
          v.toLowerCase().includes(query),
        )),
  );

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
        {
          label: project,
          onClick: () => navigate({ screen: "project-details", project }),
        },
        { label: title },
      ]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="shrink-0 px-5 py-3">
          <PageBackHeading
            title={title}
            onBack={() => navigate({ screen: "project-details", project })}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-0">
          <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
            <TableCardHeader
              leftSlot={
                <ListSearchFilter
                  fields={filters}
                  onSearchChange={setSearch}
                  onApply={setApplied}
                />
              }
              rightSlot={<DownloadPdfButton />}
            />
            <div className="flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable]">
              {/* Cells 13px; header labels stay 12px (table-head), pills/actions keep their own size. */}
              <table className="w-full min-w-[960px] border-collapse text-[13px]">
                <thead className="table-head">
                  <tr className="shadow-[inset_0_-1px_0_0_#e5e7eb] bg-gray-50 text-left text-gray-500">
                    <th className="w-10 px-4 py-2">
                      <Checkbox size="sm" />
                    </th>
                    <th className="px-2 py-2 font-semibold">Project</th>
                    <th className="px-2 py-2 font-semibold">Building Unit</th>
                    <th className="px-2 py-2 font-semibold">Description</th>
                    <th className="px-2 py-2 font-semibold">Status</th>
                    <th className="px-2 py-2 font-semibold">Category</th>
                    {showPropertyUnitColumn && (
                      <th className="px-2 py-2 font-semibold">Property Unit</th>
                    )}
                    <th className="px-2 py-2 font-semibold">Property Notes</th>
                    <th
                      className={
                        (showHoldAction ? "w-[300px]" : "w-[200px]") +
                        " col-actions px-2 py-2 text-center font-semibold"
                      }
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={showPropertyUnitColumn ? 9 : 8} className="px-4 py-10 text-center text-[13px] text-gray-500">
                        No {title.toLowerCase()}s match your search or filters.
                      </td>
                    </tr>
                  )}
                  {visibleRows.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="px-4 py-1">
                        <Checkbox size="sm" />
                      </td>
                      <td className="px-2 py-1 font-medium text-gray-900">
                        {row.code}
                      </td>
                      <td className="px-2 py-1">{row.buildingUnit}</td>
                      <td className="px-2 py-1">{row.description}</td>
                      <td className="px-2 py-1">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-2 py-1">{row.category}</td>
                      {showPropertyUnitColumn && (
                        <td className="px-2 py-1">{row.propertyUnit ?? "-"}</td>
                      )}
                      <td className="px-2 py-1">{row.notes ?? "-"}</td>
                      <td className="px-2 py-1 col-actions">
                        <div className="flex items-center justify-center gap-3">
                          <RowActionButton
                            aria-label={`View ${row.code} details`}
                            icon={<EyeIcon className="h-6 w-6" />}
                            label="View"
                          />
                          <RowActionButton
                            aria-label={`View ${row.code} image`}
                            onClick={() => setPreviewRow(row)}
                            icon={<ImageIcon className="h-6 w-6" />}
                            label="Image"
                          />
                          {showHoldAction && (
                            <RowActionButton
                              aria-label={`Put ${row.buildingUnit} on hold`}
                              disabled={row.status === "Sold"}
                              icon={<PauseCircleIcon className="h-6 w-6" />}
                              label="Hold"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={visibleRows.length} />
          </div>
        </div>
      </div>

      {previewRow && (
        <ImagePreviewModal
          imageUrl={
            categoryDefault === "Condo Unit" ? unitFloorplanB3Url : undefined
          }
          imageAlt={`${previewRow.code} unit image`}
          onClose={() => setPreviewRow(null)}
        />
      )}
    </Layout>
  );
}
