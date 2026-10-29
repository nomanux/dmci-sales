import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Button from "./Button";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select from "./Select";
import StepHeader from "./StepHeader";
import { PHONE_COUNTRIES, PhilippinesFlag } from "./BuyerDetailsStep";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "./icons";

/**
 * Step 2 of RA form v2 — "Client / company representative", redesigned.
 * Source: dmci-step-redesign.html (Representative Details redesign).
 *
 * The step is a stack of collapsible sections (personal details, contact,
 * addresses, ...). Each section shows how many required answers are left and,
 * once complete, a one-line summary. Answers read from the buyer's ID are
 * simply pre-filled, with no special marking.
 *
 * Progress is counted from the DOM: every required field's wrapper carries
 * data-req="ok" | "missing", and a MutationObserver recounts each section
 * whenever one of those flips. Hidden branches (e.g. office address when not
 * employed) are unmounted, so they never count.
 */

/** A barangay (b) in a city (c) and province (p); v = zip may differ by street. */
type Loc = { b: string; c: string; p: string; z: string; v?: boolean };
/** A city or municipality (c) in a province (p), for the birth-place finder. */
type CityLoc = { c: string; p: string };

type PhBarangay = { name: string; zip: string; verifyZip?: boolean };
type PhData = {
  provinces: Record<string, Record<string, PhBarangay[]>>;
  /** Every barangay, flattened for the "find your barangay" search. */
  all: Loc[];
  cities: CityLoc[];
};

// All PH provinces, cities and barangays with zip codes (PSA PSGC; zips from
// GeoNames, CC BY 4.0). ~1.5 MB, so it lives in public/ and is fetched once,
// the first time an address field needs it, instead of riding in the bundle.
let phDataPromise: Promise<PhData> | null = null;
function loadPhData(): Promise<PhData> {
  phDataPromise ??= fetch(`${import.meta.env.BASE_URL}data/ph-address.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then(({ provinces }: Pick<PhData, "provinces">) => {
      const all: Loc[] = [];
      const cities: CityLoc[] = [];
      for (const [p, byCity] of Object.entries(provinces))
        for (const [c, brgys] of Object.entries(byCity)) {
          cities.push({ c, p });
          for (const b of brgys) all.push({ b: b.name, c, p, z: b.zip, v: b.verifyZip });
        }
      return { provinces, all, cities };
    })
    .catch((e) => {
      phDataPromise = null; // let the next address field retry
      throw e;
    });
  return phDataPromise;
}

/** The PH address data, or null while it loads (or if it failed: fields stay free text). */
function usePhData(enabled = true): PhData | null {
  const [data, setData] = useState<PhData | null>(null);
  useEffect(() => {
    if (!enabled || data) return;
    let live = true;
    loadPhData().then(
      (d) => live && setData(d),
      () => {}
    );
    return () => {
      live = false;
    };
  }, [enabled, data]);
  return data;
}

/** The one zip every barangay in a city shares, or "" when they differ. */
function cityZip(brgys: PhBarangay[] | undefined): string {
  const zips = new Set(brgys?.map((b) => b.zip));
  return zips.size === 1 ? [...zips][0] : "";
}

/** Case-insensitive key lookup ("metro manila" finds "Metro Manila"). */
function findKey<T>(rec: Record<string, T> | undefined, key: string): string | undefined {
  if (!rec) return undefined;
  if (key in rec) return key;
  const k = norm(key);
  return k ? Object.keys(rec).find((x) => norm(x) === k) : undefined;
}

// How people actually type PH places: "Brgy. Sto. Nino", "QC", "NCR".
const ALIASES: Record<string, string> = {
  sto: "santo",
  sta: "santa",
  sn: "san",
  gen: "general",
  pres: "president",
  pob: "poblacion",
  qc: "quezon city",
  ncr: "metro manila",
  mm: "metro manila",
  brgy: "",
  bgy: "",
  barangay: "",
};
/** Lower-case, drop accents (Niño = Nino) and dots, expand the usual abbreviations. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\./g, " ")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => ALIASES[w] ?? w)
    .filter(Boolean)
    .join(" ");
}
const sameName = (a: string, b: string) => norm(a) === norm(b);

// Where most DMCI buyers live, listed before the rest (A to Z).
const NEAR_PROVINCES = ["Metro Manila", "Cavite", "Laguna", "Rizal", "Bulacan", "Batangas", "Pampanga"];
const sorted = (xs: string[]) => [...xs].sort((a, b) => a.localeCompare(b));
const provinceOrder = (xs: string[]) => [
  ...NEAR_PROVINCES.filter((p) => xs.includes(p)),
  ...sorted(xs.filter((p) => !NEAR_PROVINCES.includes(p))),
];

// Philippines first (most buyers), then A to Z.
const COUNTRIES = [
  "Philippines",
  ...[
    "Australia", "Bangladesh", "Canada", "Hong Kong", "Italy", "Japan", "Kuwait", "New Zealand",
    "Qatar", "Saudi Arabia", "Singapore", "United Arab Emirates", "United Kingdom", "United States",
  ],
];
const CITIZENSHIPS = [
  "Filipino", "American", "Singaporean", "Japanese", "Emirati", "Canadian", "Australian", "British",
  "Chinese", "Korean", "Indian", "Other",
];
const INDUSTRIES = [
  "Banking and finance", "BPO and shared services", "Construction", "Education", "Government", "Healthcare",
  "Hospitality and tourism", "IT and software", "Manufacturing", "Maritime", "Real estate", "Retail", "Other",
];
const PEP_CATEGORIES = [
  "Head of state or government", "Senior government official", "Senior judicial official",
  "Senior military or police official", "Elected official, national", "Elected official, local",
  "Head of a government-owned corporation", "Senior political party official",
  "Head of an international organisation", "Other",
];
const TITLES = ["Mr.", "Ms.", "Mrs.", "Dr.", "Atty.", "Engr."];
const SUFFIXES = ["None", "Jr.", "Sr.", "II", "III", "IV"];
const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Legally separated", "Annulled"];
const RELIGIONS = ["Roman Catholic", "Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Other"];
const INCOMES = ["Below ₱50k", "₱50k to ₱100k", "₱100k to ₱250k", "₱250k to ₱500k", "Above ₱500k"];
const OCCUPATIONS = ["Employed", "Self-employed", "Business owner", "OFW", "Retired", "Not employed"];
// Occupations that come with an employer or business, so the work details and office address apply.
const WORKING_OCCUPATIONS = ["Employed", "Self-employed", "Business owner", "OFW"];

const STACK = "flex flex-col gap-4";
const G2 = "grid grid-cols-1 items-start gap-4 md:grid-cols-2";
const G3 = "grid grid-cols-1 items-start gap-4 md:grid-cols-3";
const LINK =
  "self-start border-0 bg-transparent p-0 text-sm font-semibold text-brand-500 hover:text-brand-700 hover:underline cursor-pointer";

/* ================= validation ================= */

type Format = "email" | "mobile" | "tin" | "date";

function parseDate(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[1] - 1, +m[2]);
  return d.getMonth() === +m[1] - 1 ? d : null;
}

function formatError(format: Format | undefined, v: string): string {
  switch (format) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, e.g. name@gmail.com";
    case "mobile":
      return v.replace(/\D/g, "").length === 10 ? "" : "Enter 10 digits, e.g. 917 123 4567";
    case "tin": {
      const n = v.replace(/\D/g, "").length;
      return n === 9 || n === 12 ? "" : "A TIN has 9 or 12 digits";
    }
    case "date": {
      const d = parseDate(v);
      if (!d) return "Use MM/DD/YYYY";
      return d > new Date() ? "Date is in the future" : "";
    }
    default:
      return "";
  }
}

// Formats as the user types: dates as MM/DD/YYYY, TIN as 000-000-000-000, mobile as 917 123 4567.
function applyMask(format: Format | undefined, v: string): string {
  const d = v.replace(/\D/g, "");
  switch (format) {
    case "date": {
      const x = d.slice(0, 8);
      return x.slice(0, 2) + (x.length > 2 ? "/" + x.slice(2, 4) : "") + (x.length > 4 ? "/" + x.slice(4) : "");
    }
    case "tin":
      return (d.slice(0, 12).match(/.{1,3}/g) ?? []).join("-");
    case "mobile": {
      const x = d.slice(0, 10);
      return [x.slice(0, 3), x.slice(3, 6), x.slice(6)].filter(Boolean).join(" ");
    }
    default:
      return v;
  }
}

// True once the section's Continue was pressed with answers missing: from then
// on every field in it shows its error, not only the ones the buyer touched.
const ShowErrors = createContext(false);

function useFieldError(error: string, value: string) {
  const showAll = useContext(ShowErrors);
  const [touched, setTouched] = useState(false);
  const shown = error && (showAll || (touched && value.trim())) ? error : "";
  return { shown, onBlur: () => setTouched(true) };
}

// Briefly tints a field after it was filled for the buyer (ID scan, address search).
function useFlash(key?: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!key) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 600);
    return () => clearTimeout(t);
  }, [key]);
  return on;
}

// The shared Input/Select/DatePicker own their styling; these only add the
// error border (and the fill flash) on top, from a wrapping element.
const INVALID = "[&_.input-field]:border-[#e52222] [&_.select-trigger]:border-[#e52222] [&_.date-picker-trigger]:border-[#e52222]";
const FLASH = "[&_.input-field]:!bg-brand-50";

/* ================= building blocks ================= */

function Field({
  label,
  htmlFor,
  optional,
  tag,
  intro,
  help,
  error,
  missing,
  className = "",
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  optional?: boolean;
  tag?: ReactNode;
  intro?: ReactNode;
  help?: ReactNode;
  error?: string;
  missing?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 ${className}`}
      data-req={missing === undefined ? undefined : missing ? "missing" : "ok"}
    >
      <label htmlFor={htmlFor} className="flex flex-wrap items-center gap-2 text-sm font-medium leading-5 text-gray-700">
        {label}
        {optional && <span className="font-normal text-gray-400">(optional)</span>}
        {tag}
      </label>
      {intro}
      {children}
      {help && <span className="text-xs leading-4 text-gray-500">{help}</span>}
      {error && <span className="text-xs leading-4 text-[#e52222]">{error}</span>}
    </div>
  );
}

function SubHead({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 -mb-0.5 mt-1 text-xs font-semibold uppercase leading-5 tracking-[0.5px] text-brand-500">
      {children}
    </p>
  );
}

function Note({ tone = "info", children }: { tone?: "info" | "warn"; children: ReactNode }) {
  return (
    <div
      className={`rounded border-l-[3px] px-3 py-2.5 text-[13px] leading-5 ${
        tone === "warn" ? "border-[#f59e0b] bg-[#fffbeb] text-[#92400e]" : "border-brand-400 bg-brand-25 text-brand-700"
      }`}
    >
      {children}
    </div>
  );
}

type TextFieldProps = {
  label: ReactNode;
  optional?: boolean;
  format?: Format;
  help?: ReactNode;
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  flashKey?: number;
  disabled?: boolean;
  /** Rendered left of the input in the same row (the phone country code). */
  before?: ReactNode;
  /** Rendered under the input (the "No middle name" checkbox). */
  extra?: ReactNode;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder" | "inputMode" | "autoComplete">;

function TextField({
  label,
  optional,
  format,
  help,
  className,
  value,
  defaultValue = "",
  onValueChange,
  flashKey,
  disabled,
  before,
  extra,
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const flash = useFlash(flashKey);
  const error = disabled ? "" : !v.trim() ? (optional ? "" : "Required") : formatError(format, v.trim());
  const { shown, onBlur } = useFieldError(error, v);
  const input = (
    <div className={`min-w-0 flex-1 ${shown ? INVALID : ""} ${flash ? FLASH : ""}`}>
      <Input
        size="sm"
        id={id}
        value={v}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => {
          const next = applyMask(format, e.target.value);
          setOwn(next);
          onValueChange?.(next);
        }}
        {...inputProps}
      />
    </div>
  );
  return (
    <Field
      label={label}
      htmlFor={id}
      optional={optional}
      help={help}
      error={shown}
      missing={optional ? undefined : !!error}
      className={className}
    >
      {before ? <div className="flex gap-1.5">{before}{input}</div> : input}
      {extra}
    </Field>
  );
}

// Same country-code picker as v1's PhoneField: a native <select> sits invisibly over the flag.
function PhoneField(props: TextFieldProps) {
  const [countryCode, setCountryCode] = useState(PHONE_COUNTRIES[0].code);
  return (
    <TextField
      type="tel"
      inputMode="numeric"
      {...props}
      before={
        <div className="select-trigger select-sm relative w-16 shrink-0 focus-within:border-brand-400">
          {countryCode === "PH" ? (
            <PhilippinesFlag />
          ) : (
            <span className="text-xs font-semibold text-gray-700">{countryCode}</span>
          )}
          <ChevronDownIcon className="pointer-events-none h-4 w-4 shrink-0 text-gray-500" />
          <select
            aria-label="Country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          >
            {PHONE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} {c.dial}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
}

// ISO yyyy-mm-dd for the day `years` years before today.
function yearsAgo(years: number) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

/** Date of birth, picked from the shared DatePicker. Buyers must be 18 to 110, so other days are greyed out. */
function BirthDateField({
  value,
  defaultValue = "",
  onValueChange,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (iso: string) => void;
}) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const error = v ? "" : "Required";
  const shown = useContext(ShowErrors) ? error : "";
  return (
    <Field label="Date of birth" missing={!!error} error={shown}>
      <DatePicker
        size="sm"
        aria-label="Date of birth"
        placeholder="MM/DD/YYYY"
        min={yearsAgo(110)}
        max={yearsAgo(18)}
        value={v}
        onChange={(iso) => {
          setOwn(iso);
          onValueChange?.(iso);
        }}
        className={shown ? INVALID : ""}
      />
    </Field>
  );
}

// A flat choice pill: light gray when off, pale brand fill with brand text when picked.
function Chip({ on, invalid, onClick, children }: { on: boolean; invalid?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex min-h-8 cursor-pointer items-center rounded-full border border-solid px-3.5 py-1 text-[13px] font-medium transition-colors duration-150 ${
        on
          ? "border-brand-100 bg-brand-100 text-brand-700"
          : `bg-white text-gray-700 hover:bg-gray-50 ${invalid ? "border-[#f5a3a3]" : "border-gray-300"}`
      }`}
    >
      {children}
    </button>
  );
}

/** Pill buttons. Single choice by default; `multi` keeps every picked option, joined with ";". */
function ChipField({
  label,
  options,
  multi,
  optional,
  value,
  defaultValue = "",
  onValueChange,
  help,
  tag,
  intro,
  className,
}: {
  label: ReactNode;
  options: string[];
  multi?: boolean;
  optional?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  help?: ReactNode;
  tag?: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const selected = v ? v.split(";") : [];
  const showAll = useContext(ShowErrors);
  const error = !optional && !selected.length ? (multi ? "Pick at least one" : "Pick one") : "";
  const toggle = (o: string) => {
    const next = multi
      ? options.filter((x) => (x === o ? !selected.includes(o) : selected.includes(x))).join(";")
      : o;
    setOwn(next);
    onValueChange?.(next);
  };
  return (
    <Field
      label={label}
      optional={optional}
      help={help}
      tag={tag}
      intro={intro}
      error={showAll ? error : ""}
      missing={optional ? undefined : !!error}
      className={className}
    >
      <div role="group" className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} on={selected.includes(o)} invalid={showAll && !!error} onClick={() => toggle(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </Field>
  );
}

/** Dropdown for longer fixed lists (title, civil status, ...), where a row of chips gets busy. */
function SelectField({
  label,
  options,
  optional,
  value,
  defaultValue = "",
  onValueChange,
  className,
}: {
  label: ReactNode;
  options: string[];
  optional?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const error = !optional && !v ? "Required" : "";
  const showAll = useContext(ShowErrors);
  const shown = showAll ? error : "";
  return (
    <Field label={label} optional={optional} error={shown} missing={optional ? undefined : !!error} className={className}>
      <Select
        size="sm"
        aria-label={typeof label === "string" ? label : undefined}
        placeholder="Select"
        options={options.map((o) => ({ value: o, label: o }))}
        value={v}
        onChange={(next) => {
          setOwn(next);
          onValueChange?.(next);
        }}
        className={shown ? INVALID : ""}
      />
    </Field>
  );
}

type ComboItem = string | Loc | CityLoc;
const itemLabel = (o: ComboItem) => (typeof o === "string" ? o : "b" in o ? `${o.b}, ${o.c}` : o.c);
const itemMeta = (o: ComboItem) => (typeof o === "string" ? "" : "b" in o ? `${o.p} · ${o.z}` : o.p);

function highlight(text: string, q: string): ReactNode {
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-brand-600">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** Text input with a filtered suggestion list (country, citizenship, address search, ...). */
function ComboField({
  label,
  items,
  optional,
  value,
  defaultValue = "",
  onValueChange,
  onPick,
  placeholder = "Type to search",
  search,
  help,
  className,
  disabled,
  limit = 8,
  emptyText = "No match. Type the details in the fields below.",
  flashKey,
}: {
  label: ReactNode;
  items: ComboItem[];
  optional?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onPick?: (item: ComboItem) => void;
  placeholder?: string;
  /** Search icon instead of a chevron, for the address finders. */
  search?: boolean;
  help?: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Most suggestions shown at once. */
  limit?: number;
  emptyText?: string;
  flashKey?: number;
}) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Reopening a filled field lists every option, not just the one already chosen.
  const [typed, setTyped] = useState(false);
  const flash = useFlash(flashKey);
  const error = !optional && !v.trim() ? "Required" : "";
  const { shown: shownRaw, onBlur } = useFieldError(error, v);
  const shown = disabled ? "" : shownRaw;

  // Lower-cased search text per item, built once per list (the barangay finder has 42k).
  const haystack = useMemo(() => items.map((o) => norm(`${itemLabel(o)} ${itemMeta(o)}`)), [items]);
  const q = typed ? norm(v) : "";
  const matches = useMemo(() => {
    if (!q) return items.slice(0, limit);
    // Every word must appear ("kapitolyo pasig"); names that start with the query come first.
    const words = q.split(/[\s,]+/).filter(Boolean);
    const starts: ComboItem[] = [];
    const rest: ComboItem[] = [];
    for (let i = 0; i < items.length && starts.length < limit; i++) {
      if (!words.every((w) => haystack[i].includes(w))) continue;
      (haystack[i].startsWith(q) ? starts : rest).push(items[i]);
    }
    return [...starts, ...rest].slice(0, limit);
  }, [items, haystack, q, limit]);

  const set = (next: string) => {
    setOwn(next);
    onValueChange?.(next);
  };
  const pick = (i: number) => {
    const o = matches[i];
    if (!o) return;
    set(itemLabel(o));
    setOpen(false);
    setActive(-1);
    setTyped(false);
    onPick?.(o);
  };

  return (
    <Field
      label={label}
      htmlFor={id}
      optional={optional}
      help={help}
      error={shown}
      missing={optional ? undefined : !!error}
      className={className}
    >
      <div className={`relative ${shown ? INVALID : ""} ${flash ? FLASH : ""}`}>
        <Input
          size="sm"
          clearable={false}
          className="pr-9"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={v}
          disabled={disabled}
          onFocus={() => {
            setActive(-1);
            setTyped(false);
            setOpen(true);
          }}
          onChange={(e) => {
            set(e.target.value);
            setActive(-1);
            setTyped(true);
            setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 120);
            // Typed an exact name ("pasig city")? Treat it as picked, so the next field unlocks.
            const exact = typed && v.trim() ? matches.findIndex((o) => norm(itemLabel(o)) === q) : -1;
            if (exact >= 0) pick(exact);
            onBlur();
          }}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === "ArrowDown") {
              setActive((a) => Math.min(a + 1, matches.length - 1));
              e.preventDefault();
            } else if (e.key === "ArrowUp") {
              setActive((a) => Math.max(a - 1, 0));
              e.preventDefault();
            } else if (e.key === "Enter" && matches.length && (active >= 0 || typed)) {
              pick(Math.max(active, 0));
              e.preventDefault();
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {search ? (
          <SearchIcon className="pointer-events-none absolute right-3 top-2 size-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-2 size-4 text-gray-500" />
        )}
        {open && (
          <ul id={`${id}-list`} role="listbox" className="select-panel select-option-list m-0 list-none">
            {matches.length ? (
              matches.map((o, i) => (
                <li
                  key={`${itemLabel(o)}|${itemMeta(o)}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(i);
                  }}
                  className={`select-option flex-col !items-start ${i === active ? "bg-gray-50" : ""}`}
                >
                  <span>{highlight(itemLabel(o), typed ? v.trim().toLowerCase().split(/[\s,.]+/)[0] : "")}</span>
                  {itemMeta(o) && <small className="text-xs text-gray-500">{itemMeta(o)}</small>}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">{emptyText}</li>
            )}
          </ul>
        )}
      </div>
    </Field>
  );
}

function CheckRow({
  checked,
  onChange,
  required,
  boxed,
  small,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  boxed?: boolean;
  small?: boolean;
  children: ReactNode;
}) {
  const showAll = useContext(ShowErrors);
  return (
    <div className="flex flex-col gap-1.5" data-req={required ? (checked ? "ok" : "missing") : undefined}>
      <label
        className={`flex cursor-pointer items-start gap-2.5 text-gray-700 ${small ? "text-[13px]" : "text-sm"} ${
          boxed ? "rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3" : ""
        }`}
      >
        <Checkbox className="mt-0.5 shrink-0" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{children}</span>
      </label>
      {required && showAll && !checked && <span className="text-xs leading-4 text-[#e52222]">Please confirm</span>}
    </div>
  );
}

function Reveal({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return open ? (
    <>{children}</>
  ) : (
    <button type="button" className={LINK} onClick={() => setOpen(true)}>
      {label}
    </button>
  );
}

function Panel({ title, onRemove, children }: { title?: string; onRemove?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      {title && (
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2.5">
          <strong className="text-[15px] text-brand-500">{title}</strong>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold text-[#b42318] hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      )}
      <div className={STACK}>{children}</div>
    </div>
  );
}

function IdCardIcon({ className = "size-[22px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M14 10h4M14 14h4M6 16h6" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="size-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

function UploadDrop({
  title,
  help,
  icon,
  onUploaded,
}: {
  title: string;
  help: string;
  icon: ReactNode;
  onUploaded?: () => void;
}) {
  const [file, setFile] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const finish = (name: string) => {
    setFile(name);
    onUploaded?.();
  };
  return (
    <div
      className={`flex flex-wrap items-center gap-3.5 rounded-xl border p-3.5 ${
        file ? "border-success-200 bg-success-50" : "border-dashed border-brand-200 bg-[#f7f9fe]"
      }`}
    >
      <span
        className={`grid size-11 flex-shrink-0 place-items-center rounded-full ${
          file ? "bg-success-100 text-success-600" : "bg-brand-100 text-brand-400"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-[180px] flex-1">
        <b className="block font-semibold text-gray-900">{file ? `Uploaded: ${file}` : title}</b>
        <span className="text-xs leading-4 text-gray-500">{help}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
        <Button size="sm" variant="secondary-color" onClick={() => finish("photo from camera")}>
          Take a photo
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) finish(f.name);
        }}
      />
    </div>
  );
}

/* ================= composite blocks ================= */

type Name = { fn: string; mn: string; ln: string };

function NameRow({
  value,
  onChange,
  flashKey,
}: {
  value: Name;
  onChange: (n: Partial<Name>) => void;
  flashKey?: number;
}) {
  const [noMiddle, setNoMiddle] = useState(false);
  return (
    <div className={G3}>
      <TextField
        label="First name"
        value={value.fn}
        onValueChange={(fn) => onChange({ fn })}
        flashKey={flashKey}
        autoComplete="given-name"
        placeholder="Enter first name"
      />
      <TextField
        label="Middle name"
        value={noMiddle ? "" : value.mn}
        onValueChange={(mn) => onChange({ mn })}
        disabled={noMiddle}
        flashKey={flashKey}
        autoComplete="additional-name"
        placeholder="Enter middle name"
        extra={
          <CheckRow
            small
            checked={noMiddle}
            onChange={(c) => {
              setNoMiddle(c);
              if (c) onChange({ mn: "" });
            }}
          >
            No middle name
          </CheckRow>
        }
      />
      <TextField
        label="Last name"
        value={value.ln}
        onValueChange={(ln) => onChange({ ln })}
        flashKey={flashKey}
        autoComplete="family-name"
        placeholder="Enter last name"
      />
    </div>
  );
}

function NationalityFields({ fromId }: { fromId?: boolean }) {
  const initial = fromId ? "Filipino" : "";
  return (
    <>
      <ComboField
        label="Nationality"
        items={CITIZENSHIPS}
        defaultValue={initial}
        help="Where you come from (origin or ethnicity)"
      />
      <ComboField label="Citizenship" items={CITIZENSHIPS} defaultValue={initial} />
    </>
  );
}

function MoreContacts() {
  return (
    <div className={G3}>
      <TextField
        label="Email address 2"
        optional
        format="email"
        type="email"
        inputMode="email"
        placeholder="name@company.com"
      />
      <PhoneField label="Mobile number 2" optional format="mobile" placeholder="917 123 4567" />
      <PhoneField label="Landline" optional placeholder="02 8123 4567" />
    </div>
  );
}

/* ---------- one-box address finder ---------- */

/** What a buyer can pick in the address finder; each kind fills a different depth. */
type FinderHit =
  | { kind: "province"; p: string; n: number }
  | { kind: "city"; p: string; c: string; z: string }
  | { kind: "barangay"; p: string; c: string; b: string; z: string; v?: boolean }
  | { kind: "place"; name: string; p: string; c: string; b: string; z: string };

// Places buyers name instead of their barangay. Each points to the barangay it
// sits in; zip is the post office code PHLPost lists for that place.
const PLACES: { name: string; also?: string[]; c: string; b: string; z: string }[] = [
  { name: "BGC (Bonifacio Global City)", also: ["bgc", "bonifacio global city", "the fort"], c: "Taguig City", b: "Fort Bonifacio", z: "1635" },
  { name: "Ortigas Center", also: ["ortigas"], c: "Pasig City", b: "San Antonio", z: "1605" },
  { name: "Greenbelt / Ayala Center", also: ["greenbelt", "ayala center", "glorietta"], c: "Makati City", b: "San Lorenzo", z: "1228" },
  { name: "Legazpi Village", also: ["legaspi village"], c: "Makati City", b: "San Lorenzo", z: "1229" },
  { name: "Salcedo Village", c: "Makati City", b: "Bel-Air", z: "1227" },
  { name: "Rockwell Center", also: ["rockwell"], c: "Makati City", b: "Poblacion", z: "1210" },
  { name: "Eastwood City", also: ["eastwood"], c: "Quezon City", b: "Bagumbayan", z: "1110" },
  { name: "Cubao / Araneta City", also: ["cubao", "araneta"], c: "Quezon City", b: "Socorro", z: "1109" },
  { name: "UP Diliman", also: ["diliman"], c: "Quezon City", b: "U.P. Campus", z: "1101" },
  { name: "Katipunan", c: "Quezon City", b: "Loyola Heights", z: "1108" },
  { name: "Greenhills", c: "San Juan City", b: "Greenhills", z: "1502" },
  { name: "SM Mall of Asia (MOA)", also: ["moa", "mall of asia"], c: "Pasay City", b: "Barangay 76", z: "1300" },
  { name: "Entertainment City", also: ["okada", "solaire", "city of dreams"], c: "Parañaque City", b: "Tambo", z: "1701" },
  { name: "Filinvest City", also: ["filinvest"], c: "Muntinlupa City", b: "Alabang", z: "1781" },
  { name: "Nuvali", c: "Santa Rosa City", b: "Don Jose", z: "4026" },
];

type FinderIndex = { hits: FinderHit[]; names: string[]; keys: string[] };
const KIND_RANK: Record<FinderHit["kind"], number> = { place: 0, province: 1, city: 2, barangay: 3 };
const KIND_LABEL: Record<FinderHit["kind"], string> = { place: "Place", province: "Province", city: "City", barangay: "Barangay" };

/** One flat list of provinces, cities, places and barangays, normalised once. */
function buildFinderIndex(data: PhData): FinderIndex {
  const ix: FinderIndex = { hits: [], names: [], keys: [] };
  const add = (h: FinderHit, name: string, extra: string) => {
    ix.hits.push(h);
    ix.names.push(norm(name));
    ix.keys.push(` ${norm(`${name} ${extra}`)}`); // leading space: match word starts
  };
  const provinceOf: Record<string, string> = {};
  for (const [p, byCity] of Object.entries(data.provinces)) {
    add({ kind: "province", p, n: Object.keys(byCity).length }, p, "");
    for (const [c, brgys] of Object.entries(byCity)) {
      provinceOf[c] = p;
      const hit: FinderHit = { kind: "city", p, c, z: cityZip(brgys) };
      add(hit, c, p);
      // Manila's districts: "Manila City (Tondo I/II)" is also found as "Tondo".
      const district = /\(([^)]+)\)/.exec(c)?.[1];
      if (district) add(hit, district.replace(/\s+[IVX]+(\/[IVX]+)?$/, ""), `${c} ${p}`);
    }
  }
  for (const pl of PLACES) {
    const p = provinceOf[pl.c];
    if (!p) continue;
    const hit: FinderHit = { kind: "place", name: pl.name, p, c: pl.c, b: pl.b, z: pl.z };
    for (const alias of [pl.name, ...(pl.also ?? [])]) add(hit, alias, `${pl.b} ${pl.c}`);
  }
  for (const l of data.all) add({ kind: "barangay", p: l.p, c: l.c, b: l.b, z: l.z, v: l.v }, l.b, `${l.c} ${l.p} ${l.z}`);
  return ix;
}

/** Best matches first: exact name, then names starting with the query, then the rest. */
function searchFinder(ix: FinderIndex, raw: string, limit = 12): FinderHit[] {
  const q = norm(raw);
  if (!q) return [];
  const words = q.split(" ");
  const zipOnly = /^\d{4}$/.test(q);
  const scored: [number, number][] = [];
  for (let i = 0; i < ix.hits.length; i++) {
    const h = ix.hits[i];
    if (zipOnly) {
      if (h.kind !== "province" && h.z === q) scored.push([KIND_RANK[h.kind], i]);
      continue;
    }
    if (!words.every((w) => ix.keys[i].includes(` ${w}`))) continue;
    const name = ix.names[i];
    const bare = name.replace(/ city$/, "");
    const quality = name === q || bare === q ? 0 : name.startsWith(q) ? 1 : words.every((w) => name.includes(w)) ? 2 : 3;
    scored.push([quality * 10 + KIND_RANK[h.kind], i]);
  }
  // Ties go to Metro Manila and nearby provinces (where most buyers live), then shorter names.
  const far = (i: number) => (NEAR_PROVINCES.includes(ix.hits[i].p) ? 0 : 1);
  scored.sort((a, b) => a[0] - b[0] || far(a[1]) - far(b[1]) || ix.names[a[1]].length - ix.names[b[1]].length);
  // A few provinces and cities, the rest barangays; a place listed once even with many aliases.
  const caps: Record<FinderHit["kind"], number> = { province: 3, city: 5, place: 3, barangay: limit };
  const out: FinderHit[] = [];
  for (const [, i] of scored) {
    const h = ix.hits[i];
    if (out.includes(h) || caps[h.kind] <= 0) continue;
    caps[h.kind]--;
    out.push(h);
    if (out.length >= limit) break;
  }
  return out;
}

const finderLabel = (h: FinderHit) =>
  h.kind === "province" ? h.p : h.kind === "city" ? h.c : h.kind === "place" ? h.name : h.b;
const finderMeta = (h: FinderHit) =>
  h.kind === "province"
    ? `${h.n} cities and municipalities`
    : h.kind === "city"
      ? `${h.p}${h.z ? ` · ${h.z}` : ""}`
      : `${h.kind === "place" ? `${h.b}, ` : ""}${h.c}, ${h.p} · ${h.z}`;

/**
 * The address search: type a province, city, barangay, well-known place or zip
 * ("Cavite", "Pasig", "Kapitolyo", "BGC", "1603"); picking fills every field the
 * result knows and the caller moves focus to the first one still empty.
 */
function AddressFinder({
  label,
  placeholder,
  data,
  loading,
  onPick,
}: {
  label: ReactNode;
  placeholder: string;
  data: PhData | null;
  loading?: string;
  onPick: (h: FinderHit) => void;
}) {
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const index = useMemo(() => (data ? buildFinderIndex(data) : null), [data]);
  const hits = useMemo(() => (index ? searchFinder(index, q) : []), [index, q]);
  const pick = (h: FinderHit | undefined) => {
    if (!h) return;
    onPick(h);
    setQ("");
    setOpen(false);
    setActive(-1);
  };
  const words = norm(q).split(" ").filter(Boolean);
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-25 p-3 md:p-4">
    <Field
      label={
        <span className="flex items-center gap-2 font-semibold text-brand-600">
          <SearchIcon className="size-4" />
          {label}
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700">Fastest way</span>
        </span>
      }
      htmlFor={id}
      help="Type any part: province, city, barangay, a place like BGC or Ortigas, or your zip code. We fill the rest."
    >
      <div className="relative">
        <Input
          size="sm"
          clearable={false}
          className="!border-brand-200 pr-9"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (!open || !hits.length) return;
            if (e.key === "ArrowDown") {
              setActive((a) => Math.min(a + 1, hits.length - 1));
              e.preventDefault();
            } else if (e.key === "ArrowUp") {
              setActive((a) => Math.max(a - 1, 0));
              e.preventDefault();
            } else if (e.key === "Enter") {
              pick(hits[Math.max(active, 0)]);
              e.preventDefault();
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <SearchIcon className="pointer-events-none absolute right-3 top-2 size-4 text-brand-500" />
        {open && q.trim() && (
          <ul id={`${id}-list`} role="listbox" className="select-panel select-option-list m-0 list-none">
            {hits.length ? (
              hits.map((h, i) => (
                <li
                  key={`${h.kind}|${finderLabel(h)}|${finderMeta(h)}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(h);
                  }}
                  className={`select-option !items-center gap-3 ${i === active ? "bg-gray-50" : ""}`}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{highlight(finderLabel(h), words[0] ?? "")}</span>
                    <small className="truncate text-xs text-gray-500">{finderMeta(h)}</small>
                  </span>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                    {KIND_LABEL[h.kind]}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                {loading ?? "No match. Pick your province, city and barangay below."}
              </li>
            )}
          </ul>
        )}
      </div>
    </Field>
    </div>
  );
}

type Addr = { country: string; p: string; c: string; b: string; z: string; s: string; u: string };
const EMPTY_ADDR: Addr = { country: "Philippines", p: "", c: "", b: "", z: "", s: "", u: "" };
const isPhilippines = (country: string) => !country.trim() || country.trim().toLowerCase() === "philippines";

/**
 * Country + (in the Philippines) a barangay/city finder that fills province,
 * city, barangay and zip code. `fill` lets the parent fill it too (the
 * "Use this address" shortcut); bump its key to apply it again.
 */
function AddressBlock({
  unit,
  phoneLabel,
  searchLabel = "Search your address",
  searchPlaceholder = "e.g. Kapitolyo, Pasig City, BGC or 1603",
  fill,
  onChange,
}: {
  unit?: boolean;
  phoneLabel?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  fill?: { addr: Partial<Addr>; key: number };
  onChange?: (a: Addr) => void;
}) {
  const [addr, setAddr] = useState<Addr>(EMPTY_ADDR);
  const [flashKey, setFlashKey] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  /** After a pick, move to the next field still to fill (its list opens on focus). */
  const focusNext = (selector: string) =>
    setTimeout(() => boxRef.current?.querySelector<HTMLInputElement>(selector)?.focus(), 60);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    onChangeRef.current?.(addr);
  }, [addr]);
  useEffect(() => {
    if (!fill) return;
    setAddr((a) => ({ ...a, ...fill.addr }));
    setFlashKey((k) => k + 1);
    // Applies once per fill request; fill.addr is a fresh object every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill?.key]);

  const set = (k: keyof Addr) => (v: string) => setAddr((a) => ({ ...a, [k]: v }));
  const ph = isPhilippines(addr.country);
  const data = usePhData(ph);

  // Province -> city -> barangay, each list narrowed by the one before it.
  const pKey = findKey(data?.provinces, addr.p);
  const cities = pKey ? data!.provinces[pKey] : undefined;
  const cKey = findKey(cities, addr.c);
  const brgys = cKey ? cities![cKey] : undefined;
  const brgy = brgys?.find((b) => sameName(b.name, addr.b));
  const provinceItems = useMemo(() => (data ? provinceOrder(Object.keys(data.provinces)) : []), [data]);
  // No province yet? List every city with its province, so "Pasig" fills Metro Manila too.
  const cityItems = useMemo<ComboItem[]>(
    () => (cities ? sorted(Object.keys(cities)) : data ? [...data.cities].sort((a, b) => a.c.localeCompare(b.c)) : []),
    [cities, data]
  );
  const brgyItems = useMemo(() => brgys?.map((b) => b.name) ?? [], [brgys]);
  // Some barangays span more than one zip; the data flags those.
  const checkZip = !!brgy?.verifyZip && brgy.zip === addr.z;


  // Changing a level clears what's below it, so a stale city never sits under a new province.
  const same = sameName;
  const setProvince = (v: string) => setAddr((a) => (same(a.p, v) ? { ...a, p: v } : { ...a, p: v, c: "", b: "", z: "" }));
  const setCity = (v: string) =>
    setAddr((a) => {
      if (same(a.c, v)) return { ...a, c: v };
      // A city where every barangay shares one zip gets it right away.
      const k = findKey(cities, v);
      return { ...a, c: v, b: "", z: k ? cityZip(cities![k]) : "" };
    });
  const setBarangay = (v: string) =>
    setAddr((a) => {
      const hit = brgys?.find((b) => same(b.name, v));
      return { ...a, b: v, z: hit ? hit.zip : cityZip(brgys) || a.z };
    });
  const loading = ph && !data ? "Loading places…" : undefined;

  const street = (
    <TextField
      label={ph ? "House no., street, subdivision or village" : "House no., building and street"}
      value={addr.s}
      onValueChange={set("s")}
      flashKey={flashKey}
      autoComplete="address-line1"
      placeholder={unit ? "e.g. One Ayala Tower, Ayala Ave." : ph ? "e.g. Blk 5 Lot 12, Mabini St., Greenville Subd." : "e.g. 12 Main Street"}
    />
  );
  const zip = (
    <TextField
      label="Zip code"
      value={addr.z}
      onValueChange={set("z")}
      flashKey={flashKey}
      inputMode="numeric"
      autoComplete="postal-code"
      help={
        checkZip ? (
          <span className="text-warning-700">Please check your zip. Parts of this barangay use a different one.</span>
        ) : ph && addr.z && brgy ? (
          "Filled in from your barangay."
        ) : undefined
      }
    />
  );

  // Country first: it decides whether the finder and the PH lists show at all.
  // Then the finder, then province -> city -> barangay -> zip, and the street last.
  return (
    <div className={STACK} ref={boxRef}>
      <div className={G2}>
        <SelectField label="Country" options={COUNTRIES} value={addr.country} onValueChange={set("country")} />
      </div>
      {ph && (
        <AddressFinder
          label={searchLabel}
          placeholder={searchPlaceholder}
          data={data}
          loading={loading}
          onPick={(h) => {
            if (h.kind === "province") {
              setAddr((a) => ({ ...a, p: h.p, c: "", b: "", z: "" }));
              focusNext(".addr-city input");
            } else if (h.kind === "city") {
              setAddr((a) => ({ ...a, p: h.p, c: h.c, b: "", z: h.z }));
              focusNext(".addr-brgy input");
            } else {
              setAddr((a) => ({ ...a, p: h.p, c: h.c, b: h.b, z: h.z }));
              focusNext('input[autocomplete="address-line1"]');
            }
            setFlashKey((k) => k + 1);
          }}
        />
      )}
      <div className={G2}>
        {ph ? (
          <>
            <ComboField
              label="Province"
              items={provinceItems}
              value={addr.p}
              onValueChange={setProvince}
              placeholder="e.g. Metro Manila or Cavite"
              limit={100}
              emptyText={loading ?? "No province matches."}
              flashKey={flashKey}
            />
            <ComboField
              label="City / Municipality"
              items={cityItems}
              value={addr.c}
              onValueChange={setCity}
              onPick={(o) => {
                if (typeof o === "string" || "b" in o) return;
                const brgysOf = data?.provinces[o.p]?.[o.c];
                setAddr((a) => ({ ...a, p: o.p, c: o.c, b: "", z: cityZip(brgysOf) }));
              }}
              className="addr-city"
              placeholder={addr.p.trim() ? "Select or type" : "e.g. Pasig or Santa Rosa"}
              limit={100}
              emptyText={loading ?? (pKey ? "No city matches in this province." : "Check the province spelling.")}
              flashKey={flashKey}
            />
            <ComboField
              label="Barangay"
              items={brgyItems}
              value={addr.b}
              onValueChange={setBarangay}
              className="addr-brgy"
              disabled={!addr.c.trim()}
              placeholder={addr.c.trim() ? "Select or type" : "Choose a city first"}
              limit={300}
              emptyText={loading ?? (cKey ? "No barangay matches in this city." : "Check the city spelling.")}
              flashKey={flashKey}
            />
          </>
        ) : (
          <>
            <TextField label="State / Province" value={addr.p} onValueChange={set("p")} flashKey={flashKey} autoComplete="address-level1" />
            <TextField label="City / Municipality" value={addr.c} onValueChange={set("c")} flashKey={flashKey} autoComplete="address-level2" />
          </>
        )}
        {ph ? (
          <>
            {zip}
            <div className="md:col-span-2">{street}</div>
          </>
        ) : (
          <>
            {street}
            {zip}
          </>
        )}
        {unit && (
          <TextField label="Unit, floor or room" value={addr.u} onValueChange={set("u")} placeholder="e.g. Unit 1804, 18th floor" />
        )}
      </div>
      {phoneLabel && (
        <div className={G2}>
          <PhoneField label={phoneLabel} placeholder="02 8123 4567" />
        </div>
      )}
    </div>
  );
}

function BirthPlace() {
  const [country, setCountry] = useState("Philippines");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [flashKey, setFlashKey] = useState(0);
  const ph = isPhilippines(country);
  const data = usePhData(ph);
  const pKey = findKey(data?.provinces, province);
  const provinceItems = useMemo(() => (data ? provinceOrder(Object.keys(data.provinces)) : []), [data]);
  const cityItems = useMemo(() => (pKey ? sorted(Object.keys(data!.provinces[pKey])) : []), [data, pKey]);
  const loading = ph && !data ? "Loading places…" : undefined;
  return (
    <div className={STACK}>
      <div className={G2}>
        <SelectField label="Country" options={COUNTRIES} value={country} onValueChange={setCountry} />
        {ph && (
          <ComboField
            label="Find the city of birth"
            items={data?.cities ?? []}
            optional
            search
            placeholder="e.g. Cebu"
            help="We fill province and city for you."
            emptyText={loading ?? "No match. Pick the province and city below."}
            onPick={(o) => {
              if (typeof o === "string" || "b" in o) return;
              setCity(o.c);
              setProvince(o.p);
              setFlashKey((k) => k + 1);
            }}
          />
        )}
      </div>
      <div className={G2}>
        {ph ? (
          <>
            <ComboField
              label="Province"
              items={provinceItems}
              value={province}
              onValueChange={(v) => {
                if (v.trim().toLowerCase() !== province.trim().toLowerCase()) setCity("");
                setProvince(v);
              }}
              placeholder="Select or type"
              limit={100}
              emptyText={loading ?? "No province matches."}
              flashKey={flashKey}
            />
            <ComboField
              label="City / Municipality"
              items={cityItems}
              value={city}
              onValueChange={setCity}
              disabled={!province.trim()}
              placeholder={province.trim() ? "Select or type" : "Choose a province first"}
              limit={100}
              emptyText={loading ?? (pKey ? "No city matches in this province." : "Check the province spelling.")}
              flashKey={flashKey}
            />
          </>
        ) : (
          <>
            <TextField label="State / Province" value={province} onValueChange={setProvince} flashKey={flashKey} />
            <TextField label="City / Municipality" value={city} onValueChange={setCity} flashKey={flashKey} />
          </>
        )}
      </div>
    </div>
  );
}

function HomeAddress({
  onSameChange,
  onAddrChange,
}: {
  onSameChange?: (same: boolean) => void;
  onAddrChange?: (a: Addr) => void;
}) {
  const [same, setSame] = useState(true);
  return (
    <>
      <CheckRow
        boxed
        checked={same}
        onChange={(c) => {
          setSame(c);
          onSameChange?.(c);
        }}
      >
        Home address is the same as present address
      </CheckRow>
      {!same && <AddressBlock searchPlaceholder="e.g. Lahug or Quezon City" onChange={onAddrChange} />}
    </>
  );
}

function Occupation({ onOccChange }: { onOccChange?: (occ: string) => void }) {
  const [occ, setOcc] = useState("Employed");
  const [base, setBase] = useState("");
  const [industry, setIndustry] = useState("");
  return (
    <div className={STACK}>
      <ChipField
        label="Occupation"
        options={OCCUPATIONS}
        value={occ}
        onValueChange={(v) => {
          setOcc(v);
          onOccChange?.(v);
          if (v === "OFW") setBase("Abroad");
        }}
        help="Your answer decides the next questions."
      />
      <div className="max-w-xs">
        <TextField
          label="Tax Identification Number (TIN)"
          format="tin"
          inputMode="numeric"
          placeholder="000-000-000-000"
          help="Printed on your BIR ID or payslip."
        />
      </div>
      {WORKING_OCCUPATIONS.includes(occ) && (
        <>
          <SubHead>Business and employment</SubHead>
          <div className={G2}>
            <TextField label="Employer, practice or business name" autoComplete="organization" placeholder="e.g. Ayala Land Inc." />
            <TextField label="Job title" autoComplete="organization-title" placeholder="e.g. Nurse" />
          </div>
          <div className={G2}>
            <ComboField label="Industry / sector" items={INDUSTRIES} value={industry} onValueChange={setIndustry} />
            {industry === "Other" && <TextField label="Name the industry" placeholder="e.g. Agriculture" />}
          </div>
          <div className={G2}>
            <TextField label="Professional practice" placeholder="e.g. Nursing, Accounting, Law" />
            <ChipField label="Base of occupation" options={["Local", "Abroad"]} value={base} onValueChange={setBase} help="Where you work" />
          </div>
          <div className={G3}>
            <SelectField label="Level of designation" options={["Rank and file", "Supervisor", "Manager", "Executive", "Owner or partner"]} />
            <SelectField label="Monthly salary or income" options={INCOMES} />
            <TextField label="Years in this work" inputMode="numeric" placeholder="e.g. 6" />
          </div>
          <SubHead>Office address</SubHead>
          <AddressBlock
            unit
            phoneLabel="Office contact number"
            searchLabel="Find the office barangay or city"
            searchPlaceholder="e.g. Fort Bonifacio"
          />
        </>
      )}
    </div>
  );
}

function CoBuyerPanel({
  number,
  onRemove,
  onNameChange,
  toast,
}: {
  number: number;
  onRemove: () => void;
  onNameChange: (name: string) => void;
  toast: (text: string) => void;
}) {
  const [name, setName] = useState<Name>({ fn: "", mn: "", ln: "" });
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mode, setMode] = useState("Fill in now");
  // Bumped on every ID scan to flash the fields it filled.
  const [scanned, setScanned] = useState(0);
  const onNameChangeRef = useRef(onNameChange);
  onNameChangeRef.current = onNameChange;
  useEffect(() => {
    onNameChangeRef.current(`${name.fn} ${name.ln}`.trim());
  }, [name.fn, name.ln]);

  return (
    <Panel title={`Co-buyer #${number}`} onRemove={onRemove}>
      <Field label="ID front side">
        <UploadDrop
          title="Upload or scan their ID"
          help="JPG, PNG or PDF, up to 10 MB. We fill name and birth date for you."
          icon={<IdCardIcon />}
          onUploaded={() => {
            setName({ fn: "Juan", mn: "Reyes", ln: "Dela Cruz" });
            setDob("1986-07-22");
            setGender("Male");
            setScanned((k) => k + 1);
            toast("ID read. Name and birth date filled.");
          }}
        />
      </Field>
      <NameRow value={name} onChange={(n) => setName((p) => ({ ...p, ...n }))} flashKey={scanned} />
      <div className={G3}>
        <SelectField label="Title" options={TITLES} />
        <SelectField label="Suffix" options={SUFFIXES} optional defaultValue="None" />
        <BirthDateField value={dob} onValueChange={setDob} />
      </div>
      <div className={G3}>
        <SelectField label="Relationship to you" options={["Spouse", "Partner", "Parent", "Child", "Sibling", "Other"]} />
        <TextField label="Email" format="email" type="email" inputMode="email" placeholder="name@gmail.com" />
        <PhoneField label="Mobile number" format="mobile" placeholder="917 123 4567" />
      </div>
      <ChipField
        label="How should we collect the rest of their details?"
        options={["Fill in now", "Email them a link"]}
        value={mode}
        onValueChange={setMode}
      />
      {mode === "Email them a link" ? (
        <Note>
          <b className="font-semibold">Less typing for you.</b> We email a secure link. Your co-buyer adds birth place,
          addresses and work details. This card shows a tick once they finish.
        </Note>
      ) : (
        <>
          <SubHead>Personal details</SubHead>
          <div className={G3}>
            <ChipField label="Gender" options={["Female", "Male"]} optional value={gender} onValueChange={setGender} />
            <SelectField label="Civil status" options={CIVIL_STATUSES} optional />
          </div>
          <div className={G3}>
            <NationalityFields />
            <SelectField label="Religion" options={RELIGIONS} optional />
          </div>
          <SubHead>Birth place</SubHead>
          <BirthPlace />
          <SubHead>More contact details</SubHead>
          <Reveal label="+ Add Email 2, Mobile 2 or Landline">
            <MoreContacts />
          </Reveal>
          <SubHead>Present address</SubHead>
          <AddressBlock />
          <SubHead>Home address</SubHead>
          <HomeAddress />
          <SubHead>Occupation</SubHead>
          <Occupation />
        </>
      )}
    </Panel>
  );
}

function PepPanel({ number, onRemove }: { number: number; onRemove?: () => void }) {
  const [name, setName] = useState<Name>({ fn: "", mn: "", ln: "" });
  const [period, setPeriod] = useState("From and To");
  return (
    <Panel title={`PEP entry #${number}`} onRemove={onRemove}>
      <SubHead>Personal details</SubHead>
      <NameRow value={name} onChange={(n) => setName((p) => ({ ...p, ...n }))} />
      <div className={G3}>
        <SelectField label="Title" options={[...TITLES, "Hon."]} />
        <SelectField label="Suffix" options={SUFFIXES} optional defaultValue="None" />
      </div>
      <SubHead>Government position</SubHead>
      <div className={G2}>
        <ComboField label="Positions is or was held" items={PEP_CATEGORIES} />
        <TextField label="Specific government position" placeholder="e.g. City councilor" />
      </div>
      <ChipField label="Time period held" options={["Present", "From and To"]} value={period} onValueChange={setPeriod} />
      {period === "From and To" && (
        <div className={G2}>
          <TextField label="From" format="date" inputMode="numeric" placeholder="MM/DD/YYYY" />
          <TextField label="To" format="date" inputMode="numeric" placeholder="MM/DD/YYYY" />
        </div>
      )}
      <div className={G2}>
        <SelectField label="Country where the position was held" options={COUNTRIES} defaultValue="Philippines" />
      </div>
      <SubHead>Your connection and funding source</SubHead>
      <div className={G2}>
        <SelectField
          label="Your relationship to this person"
          options={["Myself", "Spouse", "Parent", "Child", "Sibling", "Other relative", "Close associate"]}
        />
        <SelectField
          label="Source of funds for property acquisition"
          options={["Salary", "Business income", "Savings", "Inheritance", "Bank loan", "Sale of property", "Remittance"]}
        />
      </div>
    </Panel>
  );
}

/* ================= sections ================= */

type SectionId = "company" | "personal" | "contact" | "present" | "home" | "work" | "mailing" | "purchase" | "cob" | "rep";

// `nav` is the short name for the side list; `title` heads the section itself.
const SECTIONS: { id: SectionId; title: string; nav: string; optional?: boolean }[] = [
  { id: "company", title: "Company details", nav: "Company details" },
  { id: "personal", title: "Personal details and birth place", nav: "Personal details" },
  { id: "contact", title: "Contact information", nav: "Contact details" },
  { id: "present", title: "Present address", nav: "Current address" },
  { id: "home", title: "Home address and home ownership", nav: "Permanent home" },
  { id: "work", title: "Occupation information", nav: "Work and income" },
  { id: "mailing", title: "Preferred mailing address", nav: "Mailing address" },
  { id: "purchase", title: "Reason for buying and source of awareness", nav: "Why you are buying" },
  { id: "cob", title: "Co-buyer information", nav: "Co-buyer (optional)", optional: true },
  { id: "rep", title: "Representative information and PEP", nav: "Representative and PEP" },
];

function Section({
  id,
  number,
  title,
  optional,
  open,
  missing,
  summary,
  showErrors,
  onToggle,
  onContinue,
  children,
}: {
  id: SectionId;
  number: number;
  title: string;
  optional?: boolean;
  open: boolean;
  missing?: number;
  summary: string;
  showErrors: boolean;
  onToggle: () => void;
  onContinue: () => void;
  children: ReactNode;
}) {
  const done = missing === 0;
  return (
    <section
      id={`rd-${id}`}
      className={`mb-3 scroll-mt-4 border bg-white transition-[box-shadow,border-color] md:rounded-2xl ${
        open ? "border-brand-200 shadow-[0_4px_16px_-6px_rgba(7,56,157,0.15)]" : "border-[#e4e8f0]"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-0 bg-transparent px-4 py-3 text-left md:px-5 md:py-3.5"
      >
        <span
          className={`grid size-7 flex-shrink-0 place-items-center rounded-full border-[1.5px] text-xs font-semibold ${
            done
              ? "border-success-600 bg-success-600 text-white"
              : open
                ? "border-brand-400 bg-brand-25 text-brand-500"
                : "border-gray-300 text-gray-500"
          }`}
        >
          {done ? <CheckIcon className="size-3.5" /> : number}
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-base font-semibold leading-6 text-gray-900">
            {title}
            {optional && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 align-[2px] text-[11px] font-semibold text-gray-500">
                Optional
              </span>
            )}
          </strong>
          <small className={`block truncate text-[13px] leading-5 ${done ? "text-success-600" : "text-gray-500"}`}>
            {missing === undefined ? "" : done ? summary : `${missing} ${missing === 1 ? "answer" : "answers"} left`}
          </small>
        </span>
        <ChevronDownIcon className={`size-5 flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {/* Closed sections stay mounted (only hidden) so their answers are kept. */}
      <div data-section-body={id} className={open ? "px-4 pb-4 md:pl-[60px] md:pr-5" : "hidden"}>
        <ShowErrors.Provider value={showErrors}>
          <div className={STACK}>{children}</div>
        </ShowErrors.Provider>
        <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
          <Button size="sm" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const countOf = (v: string) => v.split(";").filter(Boolean).length;

export default function RepresentativeDetailsStepV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [clientType, setClientType] = useState("Private individual");
  const [openIds, setOpenIds] = useState<Set<SectionId>>(() => new Set(["personal"]));
  // The one section the side list highlights: the last one opened or moved to.
  const [activeId, setActiveId] = useState<SectionId>("personal");
  const [errorIds, setErrorIds] = useState<Set<SectionId>>(() => new Set());
  const [missing, setMissing] = useState<Partial<Record<SectionId, number>>>({});
  const [toastMsg, setToastMsg] = useState<{ text: string; key: number } | null>(null);

  // Values the section summaries are built from.
  const [company, setCompany] = useState("");
  const [name, setName] = useState<Name>({ fn: "Maria", mn: "Santos", ln: "Dela Cruz" });
  const [email, setEmail] = useState("");
  const [present, setPresent] = useState<Addr>(EMPTY_ADDR);
  const [sameAddr, setSameAddr] = useState(true);
  const [homeCity, setHomeCity] = useState("");
  const [ownership, setOwnership] = useState("");
  const [occupation, setOccupation] = useState("Employed");
  const [mailSource, setMailSource] = useState("Primary buyer");
  const [mailAddress, setMailAddress] = useState("Home address");
  const [mailMethod, setMailMethod] = useState("Email");
  const [reasons, setReasons] = useState("");
  const [sources, setSources] = useState("");
  const [coBuyers, setCoBuyers] = useState<{ id: number; name: string }[]>([]);
  const [coBuyerConfirmed, setCoBuyerConfirmed] = useState(false);
  const [hasRep, setHasRep] = useState("");
  const [isPep, setIsPep] = useState("");
  const [pepIds, setPepIds] = useState<number[]>([1]);
  const [pepCertified, setPepCertified] = useState(false);
  const nextId = useRef(2);

  const isCompany = clientType === "Company representative";
  const visible = SECTIONS.filter((s) => s.id !== "company" || isCompany);

  // Recount each section's missing answers whenever a field's data-req flips
  // or fields mount/unmount (see the note at the top of the file).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let pending = 0;
    const scan = () => {
      pending = 0;
      const next: Partial<Record<SectionId, number>> = {};
      root.querySelectorAll<HTMLElement>("[data-section-body]").forEach((el) => {
        next[el.dataset.sectionBody as SectionId] = el.querySelectorAll('[data-req="missing"]').length;
      });
      setMissing((prev) => {
        const keys = Object.keys(next) as SectionId[];
        const same = keys.length === Object.keys(prev).length && keys.every((k) => prev[k] === next[k]);
        return same ? prev : next;
      });
    };
    scan();
    const observer = new MutationObserver(() => {
      if (!pending) pending = window.setTimeout(scan);
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-req"] });
    return () => {
      observer.disconnect();
      clearTimeout(pending);
    };
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2400);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const toast = (text: string) => setToastMsg({ text, key: Date.now() });
  const scrollTo = (id: SectionId) =>
    setTimeout(() => document.getElementById(`rd-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  const openSection = (id: SectionId) => {
    setOpenIds((s) => new Set(s).add(id));
    setActiveId(id);
    scrollTo(id);
  };
  const toggleSection = (id: SectionId) => {
    if (!openIds.has(id)) setActiveId(id);
    setOpenIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const continueFrom = (id: SectionId) => {
    const bad = rootRef.current?.querySelectorAll<HTMLElement>(`[data-section-body="${id}"] [data-req="missing"]`);
    if (bad?.length) {
      setErrorIds((s) => new Set(s).add(id));
      bad[0].querySelector<HTMLElement>("input:not(:disabled), button")?.focus();
      toast(`${bad.length} ${bad.length === 1 ? "answer needs" : "answers need"} attention`);
      return;
    }
    const next = visible[visible.findIndex((s) => s.id === id) + 1];
    setOpenIds((s) => {
      const n = new Set(s);
      n.delete(id);
      if (next) n.add(next.id);
      return n;
    });
    if (next) {
      setActiveId(next.id);
      scrollTo(next.id);
    } else toast("All sections complete");
  };

  const mailSourceOptions = ["Primary buyer", ...coBuyers.map((_, i) => `Co-buyer #${i + 1}`)];
  const summaries: Record<SectionId, string> = {
    company,
    personal: `${name.fn} ${name.ln}`,
    contact: email,
    present: [present.c, present.country].filter(Boolean).join(", "),
    home: `${sameAddr ? "Same as present address" : homeCity} · ${ownership}`,
    work: occupation,
    mailing: `${mailMethod} · ${mailAddress}`,
    purchase: `${plural(countOf(reasons), "reason", "reasons")} · ${plural(countOf(sources), "source", "sources")}`,
    cob: coBuyers.length ? coBuyers.map((c) => c.name || "Co-buyer").join(", ") : "No co-buyer",
    rep:
      (isPep === "No" ? "Not a PEP" : plural(pepIds.length, "PEP entry", "PEP entries")) +
      (hasRep === "Yes" ? " · Representative added" : " · No representative"),
  };

  const bodies: Record<SectionId, () => ReactNode> = {
    company: () => (
      <>
        <TextField label="Company name" autoComplete="organization" placeholder="e.g. Reyes Holdings Inc." onValueChange={setCompany} />
        <div className={G2}>
          <TextField label="SEC or DTI registration no." placeholder="e.g. CS201912345" />
          <TextField label="Company TIN" format="tin" inputMode="numeric" placeholder="000-000-000-000" />
        </div>
        <div className={G2}>
          <ComboField label="Industry / sector" items={INDUSTRIES} />
          <TextField label="Date of incorporation" format="date" inputMode="numeric" placeholder="MM/DD/YYYY" />
        </div>
        <div className="max-w-xs">
          <TextField label="Your position in the company" placeholder="e.g. Corporate Secretary" />
        </div>
        <SubHead>Company address</SubHead>
        <AddressBlock
          unit
          phoneLabel="Company contact number"
          searchLabel="Find the company barangay or city"
          searchPlaceholder="e.g. Bel-Air"
        />
        <Field label="Proof of authority">
          <UploadDrop
            title="Upload board resolution or secretary's certificate"
            help="PDF, JPG or PNG, up to 10 MB."
            icon={<DocIcon />}
          />
        </Field>
      </>
    ),
    personal: () => (
      <>
        {isCompany && <Note>Enter the details of the person signing for the company.</Note>}
        <NameRow value={name} onChange={(n) => setName((p) => ({ ...p, ...n }))} />
        <div className={G3}>
          <SelectField label="Title" options={TITLES} />
          <SelectField label="Suffix" options={SUFFIXES} optional defaultValue="None" />
          <BirthDateField defaultValue="1988-03-14" />
        </div>
        <div className={G3}>
          <ChipField label="Gender" options={["Female", "Male"]} defaultValue="Female" />
          <SelectField label="Civil status" options={CIVIL_STATUSES} />
        </div>
        <div className={G3}>
          <NationalityFields fromId />
          <SelectField label="Religion" options={RELIGIONS} optional />
        </div>
        <SubHead>Birth place</SubHead>
        <BirthPlace />
      </>
    ),
    contact: () => (
      <>
        <div className={G2}>
          <TextField
            label="Email address 1"
            format="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@gmail.com"
            help="We send your reservation updates here."
            onValueChange={setEmail}
          />
          <PhoneField label="Mobile number 1" format="mobile" autoComplete="tel-national" placeholder="917 123 4567" />
        </div>
        <Reveal label="+ Add Email 2, Mobile 2 or Landline">
          <MoreContacts />
        </Reveal>
      </>
    ),
    present: () => (
      <>
        <AddressBlock onChange={setPresent} />
      </>
    ),
    home: () => (
      <>
        <HomeAddress onSameChange={setSameAddr} onAddrChange={(a) => setHomeCity(a.c)} />
        <SubHead>Home ownership</SubHead>
        <div className={G3}>
          <SelectField
            label="Ownership category"
            options={["Owned", "Owned, with mortgage", "Renting", "Living with family", "Company housing"]}
            value={ownership}
            onValueChange={setOwnership}
          />
          <TextField label="Length of stay (years)" inputMode="numeric" placeholder="e.g. 4" />
        </div>
      </>
    ),
    work: () => <Occupation onOccChange={setOccupation} />,
    mailing: () => (
      <>
        {coBuyers.length > 0 && (
          <ChipField
            label="Whose address should we use?"
            options={mailSourceOptions}
            value={mailSourceOptions.includes(mailSource) ? mailSource : "Primary buyer"}
            onValueChange={setMailSource}
          />
        )}
        <ChipField
          label="Preferred mailing address"
          options={["Home address", "Office address", "Present address (buyers abroad)"]}
          value={mailAddress}
          onValueChange={setMailAddress}
        />
        <ChipField
          label="Preferred mailing method"
          options={["Email", "Courier"]}
          value={mailMethod}
          onValueChange={setMailMethod}
          help="Email is fastest and free."
        />
        <Note>
          <b className="font-semibold">Note:</b> tell DMCI Homes Customer Care when your contact details change, so
          documents keep reaching you.
        </Note>
        <Field label="Special mailing instruction" optional>
          <textarea
            rows={3}
            className="input-field min-h-16 resize-y py-1.5"
            placeholder="Write instructions, e.g. leave with the building guard"
          />
        </Field>
      </>
    ),
    purchase: () => {
      const src = sources.split(";");
      return (
        <>
          <ChipField
            label="Reason for buying"
            multi
            options={["Own home", "Investment", "Rental income", "For my family", "Retirement", "Near work or school", "Vacation home", "Other"]}
            value={reasons}
            onValueChange={setReasons}
            help="Pick all that apply."
          />
          {reasons.split(";").includes("Other") && (
            <div className="max-w-xs">
              <TextField label="Other reason" placeholder="Tell us your reason" />
            </div>
          )}
          <ChipField
            label="How did you learn about the property?"
            multi
            options={[
              "Online", "Agent's effort", "Outdoor ads", "Referral: Homeowner", "Referral: DMCI employee",
              "Referral: Others", "Booth exhibit", "Property site or sales office", "Other sources",
            ]}
            value={sources}
            onValueChange={setSources}
            help="Pick all that apply."
          />
          {(src.includes("Booth exhibit") || src.includes("Property site or sales office") || src.includes("Other sources")) && (
            <div className={G2}>
              {src.includes("Booth exhibit") && <TextField label="Which booth exhibit?" placeholder="e.g. SM Megamall expo" />}
              {src.includes("Property site or sales office") && (
                <TextField label="Which property site or sales office?" placeholder="e.g. Ortigas sales office" />
              )}
              {src.includes("Other sources") && <TextField label="Specify other source" placeholder="e.g. Radio" />}
            </div>
          )}
        </>
      );
    },
    cob: () => (
      <>
        <p className="m-0 text-gray-600">
          Buying with a spouse, partner or family member? Add each one here. Skip this if you buy alone.
        </p>
        {coBuyers.map((c, i) => (
          <CoBuyerPanel
            key={c.id}
            number={i + 1}
            toast={toast}
            onRemove={() => setCoBuyers((list) => list.filter((x) => x.id !== c.id))}
            onNameChange={(n) => setCoBuyers((list) => list.map((x) => (x.id === c.id ? { ...x, name: n } : x)))}
          />
        ))}
        <Button
          variant="secondary-color"
          size="md"
          className="self-start"
          onClick={() => setCoBuyers((list) => [...list, { id: nextId.current++, name: "" }])}
        >
          {coBuyers.length ? "+ Additional co-buyer" : "+ Add a co-buyer"}
        </Button>
        {coBuyers.length > 0 && (
          <CheckRow boxed required checked={coBuyerConfirmed} onChange={setCoBuyerConfirmed}>
            I confirm all co-buyer details provided are accurate.
          </CheckRow>
        )}
      </>
    ),
    rep: () => (
      <>
        <SubHead>Representative information</SubHead>
        <ChipField
          label="Do you have an attorney-in-fact or a financer?"
          options={["No", "Yes"]}
          value={hasRep}
          onValueChange={setHasRep}
        />
        {hasRep === "Yes" && (
          <Panel>
            <ChipField label="Role" options={["Attorney-in-fact", "Financer"]} />
            <div className={G2}>
              <TextField label="Full name" placeholder="Enter full name" />
              <PhoneField label="Mobile number" format="mobile" placeholder="917 123 4567" />
            </div>
            <div className={G2}>
              <TextField label="Email" format="email" type="email" inputMode="email" placeholder="name@gmail.com" />
            </div>
            <Field label="Special power of attorney or financing letter">
              <UploadDrop title="Upload the document" help="PDF, JPG or PNG, up to 10 MB." icon={<DocIcon />} />
            </Field>
          </Panel>
        )}
        <SubHead>Political exposure questionnaire</SubHead>
        <ChipField
          label="Have you or any of your immediate family members or close associates ever held, or now hold, an elected or appointed government position in the Philippines or any other country?"
          options={["No", "Yes"]}
          value={isPep}
          onValueChange={setIsPep}
          intro={
            <Note tone="warn">
              <b className="font-semibold">Why we ask:</b> the Anti-Money Laundering Act (RA 9160) requires this
              question for every property buyer. Most buyers answer No.
            </Note>
          }
        />
        {isPep === "Yes" && (
          <>
            {pepIds.map((id, i) => (
              <PepPanel
                key={id}
                number={i + 1}
                onRemove={pepIds.length > 1 ? () => setPepIds((l) => l.filter((x) => x !== id)) : undefined}
              />
            ))}
            <Button
              variant="secondary-color"
              size="md"
              className="self-start"
              onClick={() => setPepIds((l) => [...l, nextId.current++])}
            >
              + Add another PEP
            </Button>
            <CheckRow boxed required checked={pepCertified} onChange={setPepCertified}>
              I certify all information in the PEP questions above is true and correct.
            </CheckRow>
          </>
        )}
      </>
    ),
  };

  const doneCount = visible.filter((s) => missing[s.id] === 0).length;
  const pct = Math.round((doneCount / visible.length) * 100);

  return (
    <div ref={rootRef} className="form-lg grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_200px]">
      <div className="min-w-0">
        <div className="mb-3 border border-[#e4e8f0] bg-white p-[18px] md:rounded-2xl md:p-6">
          <StepHeader title="Client / company representative">
            Check your details and complete the rest.
          </StepHeader>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              ["Private individual", "I am a private individual or a representative of a private partnership."],
              ["Company representative", "I represent a company or corporation."],
            ].map(([value, hint]) => {
              const on = clientType === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setClientType(value)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    on ? "border-brand-500 bg-brand-25" : "border-gray-300 bg-white hover:border-brand-200 hover:bg-brand-25"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-[18px] flex-shrink-0 place-items-center rounded-full border-[1.5px] ${
                      on ? "border-brand-600 bg-brand-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {on && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                  <span>
                    <strong className="block text-[15px] font-semibold text-gray-900">{value}</strong>
                    <small className="text-xs leading-[18px] text-gray-600">{hint}</small>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Below xl the section list on the right is hidden, so the meter moves here. */}
          <div className="mt-4 xl:hidden">
            <div className="flex justify-between text-xs text-gray-600">
              <span>This step</span>
              <span>
                {doneCount} of {visible.length} sections done
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-brand-400 transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {visible.map((s, i) => (
          <Section
            key={s.id}
            id={s.id}
            number={i + 1}
            title={s.title}
            optional={s.optional}
            open={openIds.has(s.id)}
            missing={missing[s.id]}
            summary={summaries[s.id]}
            showErrors={errorIds.has(s.id)}
            onToggle={() => toggleSection(s.id)}
            onContinue={() => continueFrom(s.id)}
          >
            {bodies[s.id]()}
          </Section>
        ))}
      </div>

      <aside className="sticky top-4 hidden self-start xl:block" aria-label="Sections">
        <h4 className="m-0 mb-1 text-xs font-semibold uppercase tracking-[0.5px] text-gray-500">In this step</h4>
        <div className="mb-1.5 mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-brand-400 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <div className="mb-2 text-xs text-gray-600">
          {doneCount} of {visible.length} sections done
        </div>
        <nav className="flex flex-col">
          {visible.map((s) => {
            const done = missing[s.id] === 0;
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => openSection(s.id)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-[13px] leading-[18px] transition-colors ${
                  active ? "font-semibold text-brand-600" : done ? "text-gray-900 hover:text-brand-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span
                  className={`grid size-4 flex-shrink-0 place-items-center rounded-full border-solid ${
                    done
                      ? "border-0 bg-success-600 text-white"
                      : active
                        ? "border-2 border-brand-400 shadow-[0_0_0_2px_rgba(10,77,224,0.12)]"
                        : "border-[1.5px] border-gray-300"
                  }`}
                >
                  {done && <CheckIcon className="size-2.5" />}
                </span>
                <span className="truncate">{s.nav}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {toastMsg && (
        <div
          key={toastMsg.key}
          role="status"
          className="pointer-events-none fixed bottom-[84px] left-1/2 z-50 -translate-x-1/2 rounded-[10px] bg-gray-900 px-4 py-2.5 text-[13px] text-white"
        >
          {toastMsg.text}
        </div>
      )}
    </div>
  );
}
