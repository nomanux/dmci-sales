/** Sample RTO / leasing applications until the API is wired in. */

export type CustomerType = "Existing" | "New";
export type UnitStatus = "Hold for Lease" | "For Lease" | "Leased";
export type SyncStatus = "Synced" | "Pending" | "Failed";
export type Stage = "TIS" | "RA" | "Docs-in" | "Credit" | "Contract";
export type Track = "rto" | "dmci" | "non-dmci";

export interface RtoApplication {
  tisNo: string;
  client: string;
  customerType: CustomerType;
  unit: string;
  seller: string;
  unitStatus: UnitStatus;
  stage: Stage;
  sync: SyncStatus;
  track: Track;
}

type Row = [string, CustomerType, string, string, UnitStatus, Stage, SyncStatus, Track];

const ROWS: Row[] = [
  ["John Doe", "Existing", "1204", "M. Santos", "Hold for Lease", "TIS", "Synced", "rto"],
  ["Mary Reyes", "New", "0815", "T. Nguyen", "Hold for Lease", "RA", "Synced", "dmci"],
  ["Peter Cruz", "New", "2210", "R. Lim", "For Lease", "Docs-in", "Synced", "non-dmci"],
  ["Ana Lopez", "Existing", "0507", "K. Patel", "Hold for Lease", "TIS", "Failed", "rto"],
  ["Ben Tan", "New", "1101", "J. Uy", "Leased", "Contract", "Synced", "dmci"],
  ["Dang Ong", "New", "1803", "D. Kim", "For Lease", "Credit", "Pending", "dmci"],
  ["Sofia Garcia", "Existing", "0906", "A. Reyes", "Hold for Lease", "TIS", "Failed", "rto"],
  ["Miguel Santos", "New", "1502", "C. Cruz", "Leased", "Contract", "Synced", "non-dmci"],
  ["Isabel Lim", "New", "0712", "L. Garcia", "Hold for Lease", "TIS", "Pending", "rto"],
  ["Carlo Mendoza", "Existing", "2005", "P. Tan", "Leased", "Contract", "Synced", "dmci"],
  ["Grace Flores", "New", "0310", "S. Flores", "Leased", "Contract", "Synced", "non-dmci"],
  ["Hannah Kim", "New", "0408", "F. Chen", "For Lease", "RA", "Failed", "dmci"],
  ["Liam Chen", "Existing", "0921", "E. Johnson", "For Lease", "Docs-in", "Pending", "rto"],
  ["Zoe Patel", "New", "1604", "H. Thompson", "Hold for Lease", "TIS", "Failed", "dmci"],
  ["Ethan Nguyen", "Existing", "1309", "O. Martinez", "Leased", "Contract", "Synced", "non-dmci"],
  ["Chloe Ramirez", "New", "2107", "N. Brown", "For Lease", "Credit", "Pending", "rto"],
  ["Oliver Smith", "New", "0756", "G. Walker", "Hold for Lease", "RA", "Failed", "dmci"],
  ["Mia Johnson", "Existing", "0853", "J. Scott", "Leased", "TIS", "Synced", "non-dmci"],
  ["Noah Torres", "New", "1412", "B. Ramos", "For Lease", "Docs-in", "Synced", "rto"],
  ["Ava Castillo", "Existing", "0219", "V. Aquino", "Hold for Lease", "Credit", "Pending", "dmci"],
  ["Lucas Navarro", "New", "1708", "M. Santos", "Leased", "Contract", "Synced", "non-dmci"],
  ["Ella Bautista", "New", "0634", "T. Nguyen", "For Lease", "RA", "Synced", "rto"],
];

export const RTO_APPLICATIONS: RtoApplication[] = ROWS.map(
  ([client, customerType, unit, seller, unitStatus, stage, sync, track], i) => ({
    tisNo: `TIS-${String(i + 1).padStart(4, "0")}`,
    client,
    customerType,
    unit: `Unit ${unit}`,
    seller,
    unitStatus,
    stage,
    sync,
    track,
  }),
);

/** Extra fields shown on the TIS details page (sample values). */
export interface RtoApplicationDetails extends RtoApplication {
  email: string;
  birthday: string;
  composition: string;
  mydmciAccount: string;
  d365Customer: string;
  checkResult: string;
  crf: string;
  holding: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getApplicationDetails(tisNo: string): RtoApplicationDetails | undefined {
  const index = RTO_APPLICATIONS.findIndex((row) => row.tisNo === tisNo);
  if (index < 0) return undefined;
  const row = RTO_APPLICATIONS[index];
  const n = index + 1;
  const existing = row.customerType === "Existing";
  return {
    ...row,
    email: `${row.client.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    birthday: `${MONTHS[index % 12]} ${((index * 7) % 27) + 1}, ${1985 + (index % 12)}`,
    composition: `${row.client} (sole applicant)`,
    mydmciAccount: existing ? "Existing (signed)" : "New (invite sent)",
    d365Customer: row.sync === "Synced" ? "Synced Account" : row.sync === "Pending" ? "Sync in progress" : "Not synced",
    checkResult: existing ? "Matched on email, birthday and name" : "No match found, new customer",
    crf: `CRF-${String(n).padStart(4, "0")}`,
    holding: `HLD-${String(n).padStart(3, "0")}`,
  };
}
