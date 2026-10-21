import Layout from "./Layout";
import Input from "./Input";
import DatePicker from "./DatePicker";
import Select, { type SelectOption } from "./Select";
import Button from "./Button";
import IconButton from "./IconButton";
import { LinkIcon, MoreHorizontalIcon, PlusIcon, RotateCcwIcon, ListIcon, FileDownIcon, EyeIcon } from "./icons";
import { useNavigation } from "./NavigationContext";

/**
 * ComputationSheet — "Computation Sheet" screen, reached from the sidebar.
 * A single long form (Reservation info -> Unit info -> Payment info) rather
 * than a table screen like the rest of the app.
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 173839:400937. The design
 * reuses a "New Unit Holding" primary button and a "Property > List > Unit"
 * breadcrumb left over from another screen's component instance (unedited
 * overrides) — replaced here with copy that actually fits this screen.
 */

const DUMMY_OPTIONS: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

function todayFormatted() {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-error-500"> *</span>}
    </label>
  );
}

function TextField({ label, placeholder, type = "text", required }: { label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      {type === "date" ? <DatePicker size="sm" aria-label={label} /> : <Input size="sm" type={type} placeholder={placeholder} />}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <Input size="sm" defaultValue={value} readOnly className="cursor-default bg-gray-50" />
    </div>
  );
}

function DropdownField({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <Select size="sm" options={DUMMY_OPTIONS} placeholder="Select one" />
    </div>
  );
}

export default function ComputationSheet() {
  const { navigate } = useNavigation();

  return (
    <Layout
      active="computation"
      breadcrumb={[{ label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) }, { label: "Computation Sheet" }]}
      orgBadge
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-3 [scrollbar-gutter:stable]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-semibold text-gray-900">Computation Sheet</h1>
            <Button variant="primary" size="sm">
              <PlusIcon className="h-4 w-4" />
              Save Computation Sheet
            </Button>
          </div>

          <div className="card w-full p-4">
            <div className="flex max-w-5xl flex-col gap-5">
              {/* Reservation info */}
              <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
                <ReadOnlyField label="Generation Date" value={todayFormatted()} />
                <DropdownField label="Reservation Amount" />
                <TextField label="Reservation Date" type="date" required />
                <TextField label="Non-RFO/RFO" placeholder="Enter status" />
                <div className="flex items-end gap-3 sm:col-span-2">
                  <div className="flex-1">
                    <TextField label="Client Name" placeholder="Enter client name" />
                  </div>
                  <Button variant="secondary" size="sm">
                    <LinkIcon className="h-4 w-4" />
                    Link
                  </Button>
                </div>
              </div>

              {/* Unit info */}
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
                <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
                  <DropdownField label="Project" />
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Unit No.</FieldLabel>
                    <div className="flex gap-2">
                      <Input size="sm" defaultValue="AGP-00A-C-28003" readOnly className="flex-1 cursor-default bg-gray-50" />
                      <IconButton aria-label="Unit No. options">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                  <DropdownField label="Building" />
                  <ReadOnlyField label="Unit Category" value="Condo Unit" />
                  <ReadOnlyField label="Project Type" value="High Rise" />
                  <ReadOnlyField label="Unit Location" value="Rear Unit facing West" />
                  <ReadOnlyField label="Project Status" value="Blank" />
                  <ReadOnlyField label="RFO Date" value="07/31/2024" />
                </div>
              </div>

              {/* Payment info */}
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
                <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
                  <DropdownField label="Payment Plan Type" />
                  <DropdownField label="Closing Fee" />
                  <DropdownField label="Payment Method" />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <DropdownField label="Spot Cash(DP)" />
                    </div>
                    <div className="flex-1">
                      <TextField label="Enter Value" placeholder="0.00" />
                    </div>
                  </div>
                  <DropdownField label="Payment Plan" />
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <TextField label="Promo Discount" placeholder="0.00" />
                    </div>
                    <IconButton aria-label="Promo Discount options">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <DropdownField label="Payment Term" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex w-full flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-3">
          <Button variant="tertiary" size="sm">
            <RotateCcwIcon className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="secondary" size="sm">
            <ListIcon className="h-4 w-4" />
            List
          </Button>
          <Button variant="secondary" size="sm">
            <FileDownIcon className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="primary" size="sm">
            <EyeIcon className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </Layout>
  );
}
