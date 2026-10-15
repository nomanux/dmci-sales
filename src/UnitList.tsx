import UnitStyleTable, { type UnitStyleRow } from "./UnitStyleTable";

// Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173418:206320 ("Property > List > Unit").
// Matches the reference Unit table (Accolade Place condo units).
const ROWS: UnitStyleRow[] = [
  { code: "ACP", buildingUnit: "C- Accolade 101", description: "3- Bedroom ( End )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01001" },
  { code: "ACP", buildingUnit: "C- Accolade 103", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01003" },
  { code: "ACP", buildingUnit: "C- Accolade 104", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01004" },
  { code: "ACP", buildingUnit: "C- Accolade 105", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01005" },
  { code: "ACP", buildingUnit: "C- Accolade 106", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01006" },
  { code: "ACP", buildingUnit: "C- Accolade 107", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01007" },
  { code: "ACP", buildingUnit: "C- Accolade 108", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01008" },
  { code: "ACP", buildingUnit: "C- Accolade 109", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01009" },
  { code: "ACP", buildingUnit: "C- Accolade 110", description: "2- Bedroom ( Inner )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01010" },
  { code: "ACP", buildingUnit: "C- Accolade 111", description: "3- Bedroom ( End )", status: "Sold", category: "Condo Unit", propertyUnit: "ACP-00A-C-01011" },
];

export default function UnitList() {
  return (
    <UnitStyleTable
      title="Unit"
      categoryDefault="Condo Unit"
      showPropertyUnitColumn
      showHoldAction
      rows={ROWS}
    />
  );
}
