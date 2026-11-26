import { useMemo, useState, type ReactNode } from "react";
import qrcode from "qrcode-generator";
import Button from "@/Button";
import Select from "@/Select";
import Input from "@/Input";
import DatePicker from "@/DatePicker";
import { AlertCircleIcon } from "@/icons";
import AdminLayout from "./AdminLayout";
import { navigate } from "../router";
import backChevron from "../assets/icons/back-chevron.svg";

/**
 * Create Application Link at /mydmci/admin/create-link, opened from
 * "Create Link" on RTO Applications.
 * Figma: DMCI-SID-Portal, "RTO Application_Create Link" 163980:143111.
 *
 * Generate and Send checks the required fields, then shows the Link Created
 * card (QR, link, Copy Link) beside the form.
 */

type AppType = "rto" | "lease-dmci" | "lease-non-dmci";

const APP_TYPES: { key: AppType; title: string; sub: string }[] = [
  { key: "rto", title: "Rent-To-Own", sub: "DMCI owned" },
  { key: "lease-dmci", title: "Regular Leasing", sub: "DMCI owned" },
  { key: "lease-non-dmci", title: "Regular Leasing", sub: "non-DMCI owned (enrolled)" },
];

// Sample options until the form is wired to D365.
const opts = (values: string[]) => values.map((v) => ({ value: v, label: v }));
const SELLERS = opts(["Olivia Rhye", "Phoenix Baker", "Lana Steiner", "Demi Wilkinson"]);
const PROJECTS = opts(["Allegra Garden Place", "Alder Residences", "Satori Residences", "Sonora Garden Residences"]);
const FLOORS = opts(["5th Floor", "8th Floor", "12th Floor", "18th Floor", "22nd Floor"]);
const UNITS = opts(["AGP-00A-C-22023", "AGP-00A-C-22024", "AGP-00B-C-18011", "AGP-00B-C-18015"]);
const PARKING = opts(["P1-014", "P1-022", "P2-031"]);
const DRESS_UP = opts(["Bare", "Semi-furnished", "Fully furnished"]);
const LEASE_TERMS = opts(["12 months", "24 months", "36 months", "60 months"]);
const PAYMENT_TERMS = opts(["Monthly"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "seller" | "project" | "floor" | "unit" | "parking" | "dressUp" | "leaseTerm" | "paymentTerms" | "startDate" | "email";
type FormState = Record<FieldKey, string>;

const REQUIRED: FieldKey[] = ["seller", "project", "floor", "unit", "dressUp", "leaseTerm", "paymentTerms", "startDate", "email"];

const INVALID = "[&_.select-trigger]:!border-[#f04438] [&_.input-field]:!border-[#f04438] [&_.date-picker-trigger]:!border-[#f04438]";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${error ? INVALID : ""}`}>
      <span className="flex items-center gap-0.5 text-sm font-medium leading-5 text-[#414651]">
        {label}
        {required && <span className="text-[#10398e]">*</span>}
      </span>
      {children}
      {error ? (
        <span className="text-sm leading-5 text-[#d92d20]">{error}</span>
      ) : (
        hint && <span className="text-sm leading-5 text-[#535862]">{hint}</span>
      )}
    </div>
  );
}

function TypeCard({ type, selected, onSelect }: { type: (typeof APP_TYPES)[number]; selected: boolean; onSelect: () => void }) {
  return (
    <label
      className={`flex min-w-0 flex-1 cursor-pointer flex-col gap-1.5 rounded-xl border border-solid p-5 transition-colors ${
        selected ? "border-[#1448b3] bg-[#e8effe]" : "border-[#d1d5db] bg-white hover:border-[#a4a7ae]"
      }`}
    >
      <span className="flex items-start gap-3">
        <input type="radio" name="application-type" checked={selected} onChange={onSelect} className="peer sr-only" />
        <span
          aria-hidden
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full peer-focus-visible:ring-4 peer-focus-visible:ring-[#1448b3]/20 ${
            selected ? "bg-[#10398e]" : "border border-solid border-[#d5d7da] bg-white"
          }`}
        >
          {selected && <span className="size-2 rounded-full bg-white" />}
        </span>
        <span className={`text-base leading-6 ${selected ? "font-semibold text-[#111827]" : "font-medium text-[#414651]"}`}>
          {type.title}
        </span>
      </span>
      <span className={`pl-8 text-xs leading-[18px] ${selected ? "text-[#374151]" : "text-[#85888e]"}`}>{type.sub}</span>
    </label>
  );
}

/** QR for the generated link, drawn as one SVG path. */
function QrCode({ value, size = 124 }: { value: string; size?: number }) {
  const { n, d } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    let path = "";
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) path += `M${c} ${r}h1v1h-1z`;
    return { n: count, d: path };
  }, [value]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${value}`}>
      <path d={d} fill="#000" />
    </svg>
  );
}

function CardHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-0 border-b border-solid border-[#e5e7eb] px-5 py-2.5">
      <h2 className="m-0 text-base font-semibold leading-6 text-[#374151]">{title}</h2>
      {children}
    </div>
  );
}

function LinkCreatedCard({ link, email, expires }: { link: string; email: string; expires: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://${link}`;
  return (
    <section className="flex w-full flex-col rounded-xl border border-solid border-[#e9eaeb] bg-white lg:w-80 lg:shrink-0">
      <CardHeader title="Link Created">
        <span className="inline-flex items-center gap-1 rounded-full border border-solid border-[#abefc6] bg-[#ecfdf3] py-0.5 pl-1.5 pr-2 text-xs font-medium leading-[18px] text-[#067647]">
          <span aria-hidden className="size-1.5 rounded-full bg-[#17b26a]" />
          Active
        </span>
      </CardHeader>
      <div className="flex flex-col items-center gap-5 p-5">
        <div className="rounded-[5px] border-[0.6px] border-solid border-[#e9eaeb] bg-white p-4">
          <QrCode value={url} />
        </div>
        <div className="flex w-full flex-col gap-1.5">
          <span className="text-sm font-medium leading-5 text-[#414651]">Link</span>
          <Input size="md" className="!bg-white" readOnly value={link} aria-label="Link" onFocus={(e) => e.currentTarget.select()} />
          <span className="text-sm leading-5 text-[#535862]">Sent by email to {email}</span>
        </div>
        <div className="flex w-full gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 flex-1"
            onClick={() => {
              navigator.clipboard?.writeText(url).then(
                () => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                },
                () => undefined,
              );
            }}
          >
            {copied ? "Copied" : "Copy Link"}
          </Button>
          {/* Only after the link expires. */}
          <Button variant="secondary" size="sm" className="h-9 flex-1" disabled>
            Regenerate
          </Button>
        </div>
        <p className="m-0 w-full rounded-lg bg-[#fafafa] px-3 py-2 text-xs leading-5 text-[#717680]">
          Expires {expires}. Regenerate the link after it expires.
        </p>
      </div>
    </section>
  );
}

const newCode = () => Math.random().toString(36).slice(2, 6).toUpperCase();

export default function CreateLinkPage() {
  const [appType, setAppType] = useState<AppType>("rto");
  const [form, setForm] = useState<FormState>({
    seller: "Olivia Rhye",
    project: "",
    floor: "",
    unit: "",
    parking: "",
    dressUp: "",
    leaseTerm: "",
    paymentTerms: "",
    startDate: "",
    email: "",
  });
  const [attempted, setAttempted] = useState(false);
  const [created, setCreated] = useState<{ link: string; email: string; expires: string } | null>(null);

  const set = (key: FieldKey) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    for (const key of REQUIRED) if (!form[key].trim()) e[key] = "Required";
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email";
    return e;
  }, [form]);
  const err = (key: FieldKey) => (attempted ? errors[key] : undefined);

  function generate() {
    setAttempted(true);
    if (Object.keys(errors).length > 0) return;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    setCreated({
      link: `mydmcihomes.com/apply/${newCode()}`,
      email: form.email.trim(),
      expires: expires.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  return (
    <AdminLayout
      active="rto-applications"
      breadcrumb={["Dashboard", { label: "RTO Applications", route: "admin" }, "Create Link"]}
    >
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Back to RTO Applications"
              onClick={() => navigate("admin")}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-solid border-[#d5d7da] bg-white p-0 hover:bg-[#fafafa]"
            >
              <img src={backChevron} alt="" width={20} height={20} className="block size-5" />
            </button>
            <h1 className="m-0 text-xl font-semibold leading-[30px] text-[#181d27]">Create Application Link</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" className="h-9" onClick={generate}>
              Generate and Send
            </Button>
            <Button variant="secondary" size="sm" className="h-9" onClick={() => navigate("admin")}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* Form */}
          <section className="flex w-full min-w-0 flex-1 flex-col rounded-xl border border-solid border-[#e9eaeb] bg-white">
            <CardHeader title="New Application Link" />
            <div className="flex flex-col gap-5 p-5">
              <div className="flex flex-col gap-3">
                <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                  <legend className="mb-1.5 p-0 text-sm font-medium leading-5 text-[#414651]">Application Type</legend>
                  <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                    {APP_TYPES.map((t) => (
                      <TypeCard key={t.key} type={t} selected={appType === t.key} onSelect={() => setAppType(t.key)} />
                    ))}
                  </div>
                </fieldset>
                {appType === "rto" && (
                  <div className="flex items-start gap-1.5 rounded-[10px] bg-[#e8effe] px-4 py-3 text-sm leading-5 text-[#1448b3]">
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <p className="m-0">
                      <span className="font-semibold">Rent-To-Own:</span> Available for Seller, Property Advisor
                    </p>
                  </div>
                )}
              </div>

              <Field label="Seller" required error={err("seller")}>
                <Select size="md" aria-label="Seller" options={SELLERS} value={form.seller} onChange={set("seller")} />
              </Field>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Project" required error={err("project")}>
                  <Select size="md" aria-label="Project" options={PROJECTS} value={form.project} onChange={set("project")} />
                </Field>
                <Field label="Floor" required error={err("floor")}>
                  <Select size="md" aria-label="Floor" options={FLOORS} value={form.floor} onChange={set("floor")} />
                </Field>
                <Field label="Unit" required hint="Available only" error={err("unit")}>
                  <Select size="md" aria-label="Unit" options={UNITS} value={form.unit} onChange={set("unit")} />
                </Field>
                <Field label="Parking Slot">
                  <Select size="md" aria-label="Parking Slot" options={PARKING} value={form.parking} onChange={set("parking")} />
                </Field>
                <Field label="Unit Dress-up" required error={err("dressUp")}>
                  <Select size="md" aria-label="Unit Dress-up" options={DRESS_UP} value={form.dressUp} onChange={set("dressUp")} />
                </Field>
                <Field label="Lease Term" required hint="From the RTO term list" error={err("leaseTerm")}>
                  <Select size="md" aria-label="Lease Term" options={LEASE_TERMS} value={form.leaseTerm} onChange={set("leaseTerm")} />
                </Field>
                <Field label="Payment Terms" required hint="Monthly only MVP" error={err("paymentTerms")}>
                  <Select size="md" aria-label="Payment Terms" options={PAYMENT_TERMS} value={form.paymentTerms} onChange={set("paymentTerms")} />
                </Field>
                <Field label="Lease Start Date" required error={err("startDate")}>
                  <DatePicker size="md" aria-label="Lease Start Date" placeholder="MM/DD/YYYY" value={form.startDate} onChange={set("startDate")} />
                </Field>
              </div>

              <Field label="Client Email" required error={err("email")}>
                <Input
                  size="md"
                  type="email"
                  className="!bg-white"
                  inputMode="email"
                  aria-label="Client Email"
                  placeholder="client@example.com"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {created && <LinkCreatedCard key={created.link} {...created} />}
        </div>
      </div>
    </AdminLayout>
  );
}
