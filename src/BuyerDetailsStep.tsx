import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import Button from "./Button";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select, { type SelectOption } from "./Select";
import StepHeader from "./StepHeader";
import { SelfieCamera, usePhoneOrientation } from "./selfieCapture";
import { IdUploadPanel } from "./IdentityVerificationStep";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "./icons";
import {
  coBuyerIconUrl,
  plusWhiteIconUrl,
  trashIconUrl,
} from "./assets/figmaAssets";

/**
 * Step 2 of the CRF track — "Client/Company Representative".
 * Source: Figma file NcMe5sSgPs65q3Ed2rV1Kv, node 167635:167887.
 *
 * The page is one long form, so it's assembled from small section blocks
 * (personal details, address, occupation, ...) that the buyer, spouse,
 * co-buyer, representative and PEP entries reuse. Field values are left
 * uncontrolled (Input/Select/DatePicker keep their own state); only the
 * choices that show or hide other parts of the form live in state here.
 */

const toOptions = (...labels: string[]): SelectOption[] =>
  labels.map((label) => ({ label, value: label }));

const PREFIXES = toOptions("Mr", "Ms", "Mrs", "Dr", "Atty", "Engr");
const SUFFIXES = toOptions("Jr.", "Sr.", "II", "III", "IV");
const CIVIL_STATUSES = toOptions(
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "Annulled",
);
const NATIONALITIES = toOptions(
  "Filipino",
  "American",
  "Chinese",
  "Japanese",
  "Korean",
  "Indian",
  "Other",
);
const CITIZENSHIPS = toOptions("Filipino", "Dual citizen", "Foreign");
const GENDERS = toOptions("Male", "Female");
const COUNTRIES = toOptions(
  "Philippines",
  "United States",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Saudi Arabia",
  "Japan",
  "Australia",
  "United Kingdom",
);
const OWNERSHIP_CATEGORIES = toOptions(
  "Owned",
  "Mortgaged",
  "Rented",
  "Living with relatives",
  "Company provided",
);
const OCCUPATIONS = toOptions(
  "Employed",
  "Self-employed",
  "Business owner",
  "Professional",
  "Overseas Filipino Worker",
  "Retired",
  "Student",
  "Unemployed",
);
// Occupations that come with an employer/business, so the Business and
// Office Address panels apply.
const WORKING_OCCUPATIONS = [
  "Employed",
  "Self-employed",
  "Business owner",
  "Professional",
  "Overseas Filipino Worker",
];
const INDUSTRIES = toOptions(
  "Banking and Finance",
  "BPO",
  "Construction",
  "Education",
  "Government",
  "Healthcare",
  "Information Technology",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Other",
);
const OCCUPATION_BASES = toOptions("Local", "Overseas");
const SALARY_BRACKETS = toOptions(
  "Below ₱30,000",
  "₱30,000 – ₱59,999",
  "₱60,000 – ₱99,999",
  "₱100,000 – ₱199,999",
  "₱200,000 and above",
);
const DESIGNATIONS = toOptions(
  "Rank and file",
  "Supervisor",
  "Manager",
  "Director",
  "Executive",
  "Owner/Partner",
);
const REASONS_FOR_BUYING = toOptions(
  "Upgrade",
  "Relocate",
  "Investment",
  "First home",
  "Retirement",
  "Other",
);
const PROPERTY_SITES = toOptions(
  "Showroom",
  "Property site",
  "Sales office",
  "Mall booth",
);
const REPRESENTATIVE_TYPES = toOptions("Attorney-in-Fact", "Financer");
const BUYER_RELATIONSHIPS = toOptions(
  "Parent",
  "Child",
  "Sibling",
  "Relative",
  "Friend",
  "Employer",
  "Other",
);
const PEP_POSITIONS = toOptions(
  "Head of State or Government",
  "Senior Politician",
  "Senior Government Official",
  "Judicial or Military Official",
  "Senior Executive of a State-Owned Corporation",
  "Important Political Party Official",
);
const PEP_RELATIONSHIPS = toOptions(
  "Self",
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Close associate",
  "Other",
);
const FUND_SOURCES = toOptions(
  "Salary",
  "Business income",
  "Savings",
  "Investments",
  "Remittance",
  "Inheritance",
  "Other",
);

export const PHONE_COUNTRIES = [
  { code: "PH", flag: "🇵🇭", dial: "+63", placeholder: "+63 (900) 000-0000" },
  { code: "US", flag: "🇺🇸", dial: "+1", placeholder: "+1 (555) 000-0000" },
  { code: "SG", flag: "🇸🇬", dial: "+65", placeholder: "+65 0000 0000" },
  { code: "AE", flag: "🇦🇪", dial: "+971", placeholder: "+971 00 000 0000" },
  { code: "JP", flag: "🇯🇵", dial: "+81", placeholder: "+81 00 0000 0000" },
];

// Windows has no flag-emoji glyphs (🇵🇭 renders as the letters "PH"), so the
// default country's flag is drawn here to match the design on every OS.
export function PhilippinesFlag() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden="true"
      className="shrink-0 rounded-[2px]"
    >
      <rect width="20" height="7" fill="#0038A8" />
      <rect y="7" width="20" height="7" fill="#CE1126" />
      <path d="M0 0L12.1 7L0 14Z" fill="#FFFFFF" />
      <circle cx="4.2" cy="7" r="1.6" fill="#FCD116" />
      <circle cx="1.2" cy="2" r="0.6" fill="#FCD116" />
      <circle cx="1.2" cy="12" r="0.6" fill="#FCD116" />
      <circle cx="9.4" cy="7" r="0.6" fill="#FCD116" />
    </svg>
  );
}

const CLIENT_TYPES = [
  {
    value: "individual",
    title: "Private Individual",
    description:
      "I am a private individual OR a representative of a private partnership.",
  },
  {
    value: "company",
    title: "Company representative",
    description: "I am a representative of a company or corporation.",
  },
] as const;

const GRID_3 = "grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-3 items-start";
const GRID_2 = "grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 items-start";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Divider() {
  return <hr className="m-0 border-0 border-t border-gray-200" />;
}

function SectionHeading({
  title,
  description,
  required = false,
  size = "lg",
  children,
}: {
  title: string;
  description?: string;
  required?: boolean;
  size?: "lg" | "md";
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3
          className={`m-0 font-semibold text-brand-500 ${
            size === "lg"
              ? "text-base leading-6 md:text-lg md:leading-7"
              : "text-base leading-6"
          }`}
        >
          {title}
          {required && <span className="text-brand-600">*</span>}
        </h3>
        {children}
      </div>
      {description && (
        <p className="m-0 text-sm leading-5 text-gray-600">{description}</p>
      )}
    </div>
  );
}

function Field({
  label,
  required = false,
  hint,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={"flex flex-col gap-1.5 min-w-0 " + className}>
      <span className="flex gap-0.5 text-sm font-medium leading-5 text-gray-700">
        {label}
        {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
      {hint && <p className="m-0 text-sm leading-5 text-gray-600">{hint}</p>}
    </div>
  );
}

function TextField({
  label,
  required = false,
  hint,
  className,
  ...inputProps
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "className">) {
  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <Input size="sm" aria-label={label} {...inputProps} />
    </Field>
  );
}

function SelectField({
  label,
  required = false,
  hint,
  className,
  options,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <Select
        size="sm"
        aria-label={label}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </Field>
  );
}

function DateField({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <DatePicker size="sm" aria-label={label} placeholder="MM/DD/YYYY" />
    </Field>
  );
}

function TextArea({
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      className={"input-field min-h-16 resize-y py-1.5 " + className}
      {...rest}
    />
  );
}

function PhoneField({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  const [countryCode, setCountryCode] = useState(PHONE_COUNTRIES[0].code);
  const country =
    PHONE_COUNTRIES.find((c) => c.code === countryCode) ?? PHONE_COUNTRIES[0];

  return (
    <Field label={label} required={required}>
      <div className="flex gap-1.5">
        {/* Native <select> sits invisibly over the flag so the OS picker still handles input. */}
        <div className="select-trigger select-sm relative w-16 shrink-0 focus-within:border-brand-400">
          {country.code === "PH" ? (
            <PhilippinesFlag />
          ) : (
            <span className="text-xs font-semibold text-gray-700">
              {country.code}
            </span>
          )}
          <ChevronDownIcon className="pointer-events-none h-4 w-4 shrink-0 text-gray-500" />
          <select
            aria-label={label + " country code"}
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
        <div className="flex-1 min-w-0">
          <Input
            size="sm"
            type="tel"
            aria-label={label}
            placeholder={country.placeholder}
          />
        </div>
      </div>
    </Field>
  );
}

function CheckboxField({
  label,
  className = "",
  ...checkboxProps
}: { label: ReactNode; className?: string } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
>) {
  return (
    <label
      className={
        "flex items-center gap-2 cursor-pointer text-sm leading-5 text-gray-700 " +
        className
      }
    >
      <Checkbox {...checkboxProps} />
      <span>{label}</span>
    </label>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={"flex flex-wrap gap-x-5 gap-y-3 " + className}
    >
      {options.map((option) => (
        <label
          key={option.value}
          // relative: anchors the absolutely-positioned sr-only input here, so it
          // can't escape <main>'s scroll area and stretch the whole page.
          className="relative flex items-center gap-2 cursor-pointer text-sm leading-5 text-gray-700"
        >
          <input
            type="radio"
            name={name}
            className="peer sr-only"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-colors peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 peer-focus-visible:ring-offset-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          {option.label}
        </label>
      ))}
    </div>
  );
}

const YES_NO = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
];

/** Dropdown with checkbox options; selections show as removable chips. */
function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select all that apply",
}: {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (optionValue: string) =>
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );

  return (
    <div ref={containerRef} className="relative">
      <div
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={`flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-1 focus:outline-none focus-visible:border-brand-400 ${
          open ? "border-primary-500" : "border-gray-300"
        }`}
      >
        <div className="flex flex-1 flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-sm text-gray-400">{placeholder}</span>
          )}
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-0.5 text-xs font-medium leading-[18px] text-gray-700"
            >
              {options.find((o) => o.value === v)?.label ?? v}
              <button
                type="button"
                aria-label={"Remove " + v}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(v);
                }}
                className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
        {open ? (
          <ChevronUpIcon className="h-4 w-4 shrink-0 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500" />
        )}
      </div>
      {open && (
        <div
          className="select-panel"
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="select-option-list">
            {options.map((option) => (
              <label key={option.value} className="select-option gap-2">
                <Checkbox
                  checked={value.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * "<Person> ID (Front Side)" box: the same upload → read → review flow as
 * the Identity Verification step (IdUploadPanel).
 */
function IdUploadCard({
  title,
  className = "bg-white",
  onReadyChange,
  compact = false,
}: {
  title: string;
  className?: string;
  /** Upload only — no ID details panel, privacy note or example photos (co-buyers). */
  compact?: boolean;
  /** True once the ID has been read (the co-buyer selfie opens then). */
  onReadyChange?: (ready: boolean) => void;
}) {
  return (
    <div
      className={
        "flex flex-col gap-4 rounded-2xl px-2 py-3 md:p-4 " + className
      }
    >
      <h4 className="m-0 text-base font-semibold leading-6 text-gray-900">
        {title}
      </h4>
      <IdUploadPanel
        onReadyChange={onReadyChange}
        onGray={className.includes("bg-gray")}
        compact={compact}
      />
    </div>
  );
}

/** Bordered entry card (co-buyer, PEP) with remove + collapse actions. */
function EntryCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-2 md:px-5">
      <div
        className={`flex items-center justify-between gap-4 py-5 ${expanded ? "border-b border-gray-200" : ""}`}
      >
        <h4 className="m-0 text-base font-semibold leading-6 text-brand-500">
          {title}
        </h4>
        <div className="flex items-center gap-6">
          {onRemove && (
            <button
              type="button"
              aria-label={"Remove " + title}
              onClick={onRemove}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent hover:bg-error-50"
            >
              <img src={trashIconUrl} alt="" width={20} height={20} />
            </button>
          )}
          <button
            type="button"
            aria-label={(expanded ? "Collapse " : "Expand ") + title}
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-brand-700 hover:bg-gray-50"
          >
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {expanded && <div className="flex flex-col gap-6 py-5">{children}</div>}
    </div>
  );
}

/** Gray section shell with the users icon — Co-Buyer and PEP blocks. */
function GroupPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="-mx-2 md:mx-0 flex flex-col gap-6 rounded-xl bg-gray-50 px-2 py-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={coBuyerIconUrl} alt="" width={24} height={24} />
          <h3 className="m-0 text-base leading-6 md:text-lg md:leading-7 font-semibold text-brand-500">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function AddEntryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="primary" size="md" className="w-fit" onClick={onClick}>
      <img src={plusWhiteIconUrl} alt="" width={20} height={20} />
      {label}
    </Button>
  );
}

function ConfirmBox({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white px-4 py-3.5">
      <CheckboxField label={label} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section blocks                                                      */
/* ------------------------------------------------------------------ */

type PersonalFieldKey =
  | "prefix"
  | "first"
  | "middle"
  | "last"
  | "suffix"
  | "dob"
  | "religion"
  | "civilStatus"
  | "nationality"
  | "citizenship"
  | "gender";

const NAME_FIELDS: PersonalFieldKey[] = [
  "prefix",
  "first",
  "middle",
  "last",
  "suffix",
];

function MiddleNameField() {
  const [noMiddleName, setNoMiddleName] = useState(false);
  return (
    <Field label="Middle Name">
      <Input
        size="sm"
        aria-label="Middle Name"
        placeholder="Enter middle name"
        disabled={noMiddleName}
      />
      <CheckboxField
        label="No Middle Name"
        className="mt-0.5"
        checked={noMiddleName}
        onChange={(e) => setNoMiddleName(e.target.checked)}
      />
    </Field>
  );
}

function PersonalDetailsFields({
  fields,
  optional = [],
  civilStatus,
  onCivilStatusChange,
  nationalityHint = false,
}: {
  fields: PersonalFieldKey[];
  /** Fields shown without the required asterisk (middle name and suffix always are). */
  optional?: PersonalFieldKey[];
  civilStatus?: string;
  onCivilStatusChange?: (value: string) => void;
  nationalityHint?: boolean;
}) {
  const required = (key: PersonalFieldKey) => !optional.includes(key);

  const renderField = (key: PersonalFieldKey) => {
    switch (key) {
      case "prefix":
        return (
          <SelectField
            key={key}
            label="Prefix"
            required={required(key)}
            options={PREFIXES}
          />
        );
      case "first":
        return (
          <TextField
            key={key}
            label="First Name"
            required={required(key)}
            placeholder="Enter first name"
          />
        );
      case "middle":
        return <MiddleNameField key={key} />;
      case "last":
        return (
          <TextField
            key={key}
            label="Last Name"
            required={required(key)}
            placeholder="Enter last name"
          />
        );
      case "suffix":
        return (
          <SelectField
            key={key}
            label="Suffix"
            options={SUFFIXES}
            placeholder="Select suffix"
          />
        );
      case "dob":
        return (
          <DateField key={key} label="Date of Birth" required={required(key)} />
        );
      case "religion":
        return (
          <TextField
            key={key}
            label="Religion"
            required={required(key)}
            placeholder="Enter religion"
          />
        );
      case "civilStatus":
        return (
          <SelectField
            key={key}
            label="Civil Status"
            required={required(key)}
            options={CIVIL_STATUSES}
            value={civilStatus}
            onChange={onCivilStatusChange}
          />
        );
      case "nationality":
        return (
          <SelectField
            key={key}
            label="Nationality"
            required={required(key)}
            options={NATIONALITIES}
            hint={
              nationalityHint
                ? "Where you come from (Origin/ethnicity)"
                : undefined
            }
          />
        );
      case "citizenship":
        return (
          <SelectField
            key={key}
            label="Citizenship"
            required={required(key)}
            options={CITIZENSHIPS}
          />
        );
      case "gender":
        return (
          <SelectField
            key={key}
            label="Gender"
            required={required(key)}
            options={GENDERS}
          />
        );
    }
  };

  return <div className={GRID_3}>{fields.map(renderField)}</div>;
}

function BirthPlaceFields() {
  return (
    <div className={GRID_3}>
      <SelectField label="Country" required options={COUNTRIES} />
      <TextField
        label="State/Province"
        required
        placeholder="Enter state/province"
      />
      <TextField
        label="City/Municipality"
        required
        placeholder="Enter city/municipality"
      />
    </div>
  );
}

function ContactFields() {
  return (
    <div className={GRID_3}>
      <TextField
        label="Email Address 1"
        required
        type="email"
        placeholder="demomail@gmail.com"
      />
      <TextField
        label="Email Address 2"
        type="email"
        placeholder="demomail@gmail.com"
      />
      <PhoneField label="Mobile Number 1" required />
      <PhoneField label="Mobile Number 2" />
      <PhoneField label="Landline" />
    </div>
  );
}

function AddressFields({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className={GRID_3}>
      <SelectField
        label="Country"
        required
        options={COUNTRIES}
        disabled={disabled}
      />
      <TextField
        label="State/Province"
        required
        placeholder="Enter state/province"
        disabled={disabled}
      />
      <TextField
        label="City/Municipality"
        required
        placeholder="Enter city/municipality"
        disabled={disabled}
      />
      <TextField
        label="Barangay"
        required
        placeholder="Enter barangay"
        disabled={disabled}
      />
      <TextField
        label="House No./Building/Street"
        required
        placeholder="Enter house no./building/street"
        className="md:col-span-2"
        disabled={disabled}
      />
      <TextField
        label="Zip Code"
        required
        placeholder="Enter zip code"
        disabled={disabled}
      />
    </div>
  );
}

function PresentAndHomeAddress({
  headingSize = "lg",
}: {
  headingSize?: "lg" | "md";
}) {
  const [sameAsPresent, setSameAsPresent] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Present Address" size={headingSize} />
        <AddressFields />
      </div>
      {headingSize === "lg" && <Divider />}
      <div className="flex flex-col gap-3">
        <SectionHeading title="Home Address" size={headingSize}>
          <CheckboxField
            label="Same as present address"
            checked={sameAsPresent}
            onChange={(e) => setSameAsPresent(e.target.checked)}
          />
        </SectionHeading>
        <AddressFields disabled={sameAsPresent} />
      </div>
    </>
  );
}

function OfficeAddressPanel({ className }: { className: string }) {
  return (
    <div
      className={
        "flex flex-col gap-5 rounded-xl border border-gray-100 px-2 py-4 md:p-5 " +
        className
      }
    >
      <SectionHeading title="Office Address Information" size="md" />
      <div className={GRID_3}>
        <SelectField label="Country" required options={COUNTRIES} />
        <TextField
          label="State/Province"
          required
          placeholder="Enter state/province"
        />
        <TextField
          label="City/Municipality"
          required
          placeholder="Enter city/municipality"
        />
        <TextField label="Barangay" required placeholder="Enter barangay" />
        <TextField
          label="No./Floor/Room"
          required
          placeholder="Enter no./floor/room"
        />
        <div className="hidden md:block" />
        <TextField
          label="House No./Building/Street"
          required
          placeholder="Enter house no./building/street"
          className="md:col-span-2"
        />
        <TextField label="Zip Code" required placeholder="Enter zip code" />
        <PhoneField label="Office Contact Number" required />
      </div>
    </div>
  );
}

function OccupationFields({
  subject,
  onGrayBackground = false,
}: {
  subject: "client" | "spouse";
  /** Inside a gray panel (spouse block) the office panel flips to white. */
  onGrayBackground?: boolean;
}) {
  const [occupation, setOccupation] = useState("Employed");
  const [industry, setIndustry] = useState<string>();
  const hasEmployer = WORKING_OCCUPATIONS.includes(occupation);
  const whose = subject === "spouse" ? "your spouse's" : "your";

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Occupation Information"
        description={`Identify the client's ${subject === "spouse" ? "spouse's " : ""}employment status or profession.`}
      />
      <div className={GRID_2}>
        <SelectField
          label="Selected Occupation"
          required
          options={OCCUPATIONS}
          value={occupation}
          onChange={setOccupation}
          hint="This selection will determine which additional fields are required."
        />
        <TextField
          label="Tax Identification Number"
          required
          placeholder="Enter tax identification number"
        />
      </div>

      {hasEmployer && (
        <>
          <div
            className={
              "flex flex-col gap-5 rounded-xl border border-brand-100 bg-brand-25 px-2 py-4 md:p-5 " +
              // On the white card, sit 8px from its edge on phones (like the spouse box).
              (onGrayBackground ? "" : "-mx-2 md:mx-0")
            }
          >
            <SectionHeading
              title="Business and Employment Information."
              size="md"
              description={`Please provide details about ${whose} employer or business.`}
            />
            <div className={GRID_2}>
              <TextField
                label="Employer/Practice/Business Name"
                required
                placeholder="Enter company or business name"
              />
              <TextField
                label="Job Title"
                required
                placeholder="Enter job title"
              />
              <SelectField
                label="Industry/Sector"
                required
                options={INDUSTRIES}
                value={industry}
                onChange={setIndustry}
              />
              <TextField
                label="Please Specify “Other” Industry/Sector"
                required
                placeholder="Enter industry/sector name"
                disabled={industry !== "Other"}
              />
              <SelectField
                label="Base of Occupation"
                required
                options={OCCUPATION_BASES}
                hint="Identifies work location scope"
              />
              <SelectField
                label="Employee Salary/Income Bracket"
                required
                options={SALARY_BRACKETS}
              />
              <TextField
                label="Length of Work (In year)"
                required
                type="number"
                min={0}
                placeholder="Enter number of year/s"
              />
              <SelectField
                label="Level of Designation"
                required
                options={DESIGNATIONS}
              />
              <TextField
                label="Professional Practice"
                required
                placeholder="Enter professional practice"
              />
            </div>
          </div>
          <OfficeAddressPanel
            className={
              onGrayBackground ? "bg-white" : "bg-gray-50 -mx-2 md:mx-0"
            }
          />
        </>
      )}
    </div>
  );
}

/** Collapsible gray block shown when the buyer/co-buyer is married. */
function SpouseInformation({ onWhiteCard = false }: { onWhiteCard?: boolean }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="-mx-2 md:mx-0 flex flex-col gap-6 rounded-xl bg-gray-50 px-2 py-4 md:p-5">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left"
      >
        <span className="text-base leading-6 md:text-lg md:leading-7 font-semibold text-brand-500">
          Spouse Information
        </span>
        <span className="flex h-8 w-8 items-center justify-center text-brand-700">
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </span>
      </button>

      {expanded && (
        <>
          <div className="flex flex-col gap-3">
            <SectionHeading title="Personal Details" size="md" />
            <PersonalDetailsFields
              fields={[
                ...NAME_FIELDS,
                "dob",
                "religion",
                "gender",
                "nationality",
                "citizenship",
              ]}
            />
          </div>
          <IdUploadCard title="Spouse ID (Front Side)" />
          <div className="flex flex-col gap-3">
            <SectionHeading title="Birth Place Information" size="md" />
            <BirthPlaceFields />
          </div>
          <div className="flex flex-col gap-3">
            <SectionHeading title="Contact Information" size="md" />
            <ContactFields />
          </div>
          {onWhiteCard && <Divider />}
          <OccupationFields subject="spouse" onGrayBackground />
        </>
      )}
    </div>
  );
}

/**
 * "Co-Buyer #N Selfie with Valid ID" — shown once that co-buyer's ID is
 * uploaded. Upload a photo, or take a live selfie with the same guided
 * auto-capture camera as the Live Selfie step.
 */
function CoBuyerSelfie({ index }: { index: number }) {
  // Phones start on Upload (the camera there needs the phone turned sideways).
  const { isPhone } = usePhoneOrientation();
  const [method, setMethod] = useState<"upload" | "camera">(isPhone ? "upload" : "camera");
  // Remounts the camera on every "Take Selfie" tap, so a phone turns sideways again.
  const [cameraKey, setCameraKey] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const choose = (next: "upload" | "camera") => {
    setPhoto(null);
    setMethod(next);
    if (next === "camera") setCameraKey((k) => k + 1);
  };

  // Same segmented switch as the Live Selfie step.
  const methodButton = (
    value: "upload" | "camera",
    label: string,
    icon: ReactNode,
  ) => (
    <button
      type="button"
      role="tab"
      aria-selected={method === value}
      onClick={() => choose(value)}
      // Phones: 32px-tall segments with 16px icons; desktop keeps the roomier padding.
      className={`flex h-8 md:h-auto flex-1 md:flex-none items-center justify-center gap-1.5 md:gap-2 rounded-md md:rounded-lg border-none px-3 md:px-3.5 md:py-1.5 text-[13px] md:text-sm font-semibold leading-5 cursor-pointer transition-all duration-200 [&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-5 md:[&>svg]:w-5 ${
        method === value
          ? "bg-white text-[#052b78] shadow-[0_1px_2px_-1px_rgba(10,12.67,18,0.1),0_1px_3px_rgba(10,12.67,18,0.1)]"
          : "bg-transparent text-gray-700 hover:bg-blue-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const takeSelfieTab = methodButton(
    "camera",
    "Take Selfie",
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>,
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 px-2 py-3 md:p-4">
      <h4 className="m-0 flex gap-1 text-base font-semibold leading-6 text-gray-900">
        Co-Buyer #{index} Selfie with Valid ID
        <span className="text-brand-600">*</span>
      </h4>

      <p className="m-0 flex gap-3 rounded-lg border-l-4 border-brand-500 bg-brand-25 px-4 py-3 text-sm font-medium italic leading-5 text-brand-600">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M14 10h4M14 14h4M6 16h6" />
        </svg>
        Please submit a selfie while holding the same valid government-issued ID
        that has been uploaded. Ensure that the face and ID details are visible
        and readable.
      </p>

      <div className="flex flex-col gap-0.5">
        <p className="m-0 text-sm font-semibold leading-5 text-gray-900">
          How would you like to submit your picture?
        </p>
        <p className="m-0 text-xs leading-[18px] text-gray-500">
          Choose a method to continue
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Selfie method"
        className="flex w-full md:w-fit gap-0 rounded-lg md:rounded-[12px] bg-gray-100 p-0.5 md:p-1"
      >
        {/* Phones: Upload Photo first (the default), Take Selfie on the right. */}
        {!isPhone && takeSelfieTab}
        {methodButton(
          "upload",
          "Upload Photo",
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 15V4M7 9l5-5 5 5M4 15v4h16v-4" />
          </svg>,
        )}
        {isPhone && takeSelfieTab}
      </div>

      {photo ? (
        <div className="flex flex-col gap-2">
          <img
            src={photo}
            alt={`Co-buyer #${index} selfie holding their ID`}
            className="block aspect-video w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={() =>
              method === "upload" ? fileRef.current?.click() : setPhoto(null)
            }
            className="w-fit cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            {method === "upload" ? "Choose a different photo" : "Retake selfie"}
          </button>
        </div>
      ) : method === "camera" ? (
        <SelfieCamera key={cameraKey} onCapture={setPhoto} />
      ) : method === "upload" ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#6293f8] bg-brand-25 text-center"
        >
          <span className="text-sm font-semibold text-gray-900">
            Upload your selfie with your ID
          </span>
          <span className="text-xs text-gray-500">
            JPEG, JPG or PNG • Max 5 MB
          </span>
        </button>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          readFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function CoBuyerFields({ index }: { index: number }) {
  const [civilStatus, setCivilStatus] = useState<string>();
  const [idUploaded, setIdUploaded] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Personal Details" size="md" />
        <PersonalDetailsFields
          fields={[
            ...NAME_FIELDS,
            "dob",
            "religion",
            "nationality",
            "citizenship",
            "civilStatus",
            "gender",
          ]}
          optional={["civilStatus", "gender"]}
          civilStatus={civilStatus}
          onCivilStatusChange={setCivilStatus}
        />
      </div>
      <IdUploadCard
        title={`Co-Buyer #${index} ID (Front Side)`}
        className="bg-gray-50"
        onReadyChange={setIdUploaded}
        compact
      />
      {idUploaded && <CoBuyerSelfie index={index} />}
      <div className="flex flex-col gap-3">
        <SectionHeading title="Birth Place Information" size="md" />
        <BirthPlaceFields />
      </div>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Contact Information" size="md" />
        <ContactFields />
      </div>
      <PresentAndHomeAddress headingSize="md" />
      <Divider />
      <OccupationFields subject="client" />
      {civilStatus === "Married" && (
        <>
          <Divider />
          <SpouseInformation onWhiteCard />
        </>
      )}
    </>
  );
}

function RepresentativeDetails() {
  const [relationship, setRelationship] = useState<string>();
  return (
    <div className="flex flex-col gap-3">
      <SectionHeading title="Representative Details" />
      {/* Phones: 8px from the card edge, 8px inside, square corners — like the co-buyer box. */}
      <div className="-mx-2 md:mx-0 rounded-xl border border-gray-200 bg-gray-50">
        <div className="px-2 py-4 md:p-5 md:pr-0">
          <SelectField
            label="Type of Representative"
            required
            options={REPRESENTATIVE_TYPES}
            className="md:w-[338px]"
          />
        </div>
        <div className="flex flex-col gap-6 border-t border-gray-200 px-2 py-4 md:p-5">
          <div className="flex flex-col gap-3">
            <SectionHeading title="Personal Details" size="md" />
            <PersonalDetailsFields
              fields={[
                ...NAME_FIELDS,
                "dob",
                "religion",
                "nationality",
                "civilStatus",
                "gender",
              ]}
              optional={["civilStatus", "gender"]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <SectionHeading title="Birth Place Information" size="md" />
            <BirthPlaceFields />
          </div>
          <PresentAndHomeAddress headingSize="md" />
          <div className="flex flex-col gap-3">
            <SectionHeading title="Contact Information" size="md" />
            <ContactFields />
          </div>
          <div className="flex flex-col gap-3">
            <SectionHeading title="Relationship with Buyer" size="md" />
            <SelectField
              label="Name of Relationship"
              required
              options={BUYER_RELATIONSHIPS}
              value={relationship}
              onChange={setRelationship}
              className="md:w-1/3 md:pr-3.5"
            />
            {relationship === "Other" && (
              <TextArea
                aria-label="Specify relationship with buyer"
                placeholder="Please specify...."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectWithOther({
  label,
  options,
}: {
  label: string;
  options: SelectOption[];
}) {
  const [value, setValue] = useState<string>();
  return (
    <div className="flex flex-col gap-1.5">
      <SelectField
        label={label}
        required
        options={options}
        value={value}
        onChange={setValue}
        className="md:w-1/2 md:pr-2.5"
      />
      {value === "Other" && (
        <>
          <TextArea
            aria-label={label + " (other)"}
            placeholder="Please specify...."
          />
          <p className="m-0 text-sm leading-5 text-gray-600">
            Please specify the details it’s required.
          </p>
        </>
      )}
    </div>
  );
}

function PepEntryFields() {
  const [period, setPeriod] = useState("range");
  return (
    <>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Personal Details" size="md" />
        <PersonalDetailsFields fields={NAME_FIELDS} />
      </div>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Government Position Details" size="md" />
        <SelectField
          label="Positions Is Or Was Held"
          required
          options={PEP_POSITIONS}
        />
        <TextField
          label="Specific Government Position"
          required
          placeholder="Enter the position"
        />
        <Field label="Time Period Held" required>
          <RadioGroup
            label="Time Period Held"
            className="flex-col"
            options={[
              { label: "Present", value: "present" },
              { label: "From and To", value: "range" },
            ]}
            value={period}
            onChange={setPeriod}
          />
          {period === "range" && (
            <div className="mt-1.5 grid grid-cols-1 gap-x-5 gap-y-3 pl-6 sm:grid-cols-[206px_206px]">
              <DateField label="From" required />
              <DateField label="To" required />
            </div>
          )}
        </Field>
        <SelectField
          label="In what country was the position held?"
          required
          options={COUNTRIES}
        />
      </div>
      <div className="flex flex-col gap-3">
        <SectionHeading title="Your Connection & Funding Source" size="md" />
        <SelectWithOther
          label="Your Relationship to This Person"
          options={PEP_RELATIONSHIPS}
        />
        <SelectWithOther
          label="Source of Funds for Property Acquisition"
          options={FUND_SOURCES}
        />
      </div>
    </>
  );
}

/** Adds/removes numbered entries; ids stay stable so removing #1 keeps #2's typed values. */
function useEntryList(initialCount = 1) {
  const [ids, setIds] = useState(() =>
    Array.from({ length: initialCount }, (_, i) => i + 1),
  );
  const nextId = useRef(initialCount + 1);
  const add = () => setIds((prev) => [...prev, nextId.current++]);
  const remove = (id: number) => setIds((prev) => prev.filter((i) => i !== id));
  return { ids, add, remove };
}

const AWARENESS_SOURCES = [
  ["Online", "Referral: Homeowner", "Booth exhibit"],
  ["Agent’s Effort", "Referral: DMCI Employee", "Property Sites/ Sales Office"],
  ["Outdoor ads", "Referral: Others", "Other Sources"],
];

/* ------------------------------------------------------------------ */
/* Step                                                                */
/* ------------------------------------------------------------------ */

export default function BuyerDetailsStep() {
  const [clientType, setClientType] = useState<"individual" | "company">(
    "individual",
  );
  // Optional parts (spouse, co-buyers, representative, PEP) start hidden and
  // appear only once the buyer chooses Married / Yes / Add Co-buyer.
  const [civilStatus, setCivilStatus] = useState<string>();
  const [ownership, setOwnership] = useState<string>();
  const [mailingSource, setMailingSource] = useState("primary");
  const [mailingAddress, setMailingAddress] = useState("home");
  const [mailingMethod, setMailingMethod] = useState("courier");
  const [reasons, setReasons] = useState<string[]>([]);
  const [awareness, setAwareness] = useState<string[]>([]);
  const [hasRepresentative, setHasRepresentative] = useState("");
  const [isPep, setIsPep] = useState("");
  const coBuyers = useEntryList(0);
  const pepEntries = useEntryList();

  const toggleAwareness = (source: string) =>
    setAwareness((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source],
    );

  // The selected mailing source falls back to the primary buyer if that co-buyer is removed.
  const mailingSourceOptions = [
    { label: "Primary Buyer", value: "primary" },
    ...coBuyers.ids.map((id, i) => ({
      label: `Co-buyer ${i + 1}`,
      value: `co-buyer-${id}`,
    })),
  ];
  const activeMailingSource = mailingSourceOptions.some(
    (o) => o.value === mailingSource,
  )
    ? mailingSource
    : "primary";

  // Each row's trailing input only applies when its row's last option is ticked.
  const awarenessDetail = [
    <Input
      key="booth"
      size="sm"
      aria-label="Booth exhibit"
      placeholder="Specify booth exhibit"
      disabled={!awareness.includes("Booth exhibit")}
    />,
    <Select
      key="site"
      size="sm"
      aria-label="Property site or sales office"
      options={PROPERTY_SITES}
      disabled={!awareness.includes("Property Sites/ Sales Office")}
    />,
    <Input
      key="other"
      size="sm"
      aria-label="Other sources"
      placeholder="Specify other sources"
      disabled={!awareness.includes("Other Sources")}
    />,
  ];

  return (
    <section className="form-lg w-full h-fit bg-white rounded-none md:rounded-[16px] flex flex-col border border-[#e4e8f0]">
      <StepHeader
        title="Client/Company Representative"
        className="px-4 md:px-8 pt-6 pb-6"
      >
        Enter your personal information as it appears on your official records.
      </StepHeader>

      <div className="px-4 md:px-8 pb-6 flex flex-col gap-8">
        {/* Client Type Selection */}
        <div
          role="radiogroup"
          aria-label="Client type"
          className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-stretch"
        >
          {CLIENT_TYPES.map((type, index) => {
            const selected = clientType === type.value;
            return (
              <div key={type.value} className="contents">
                {index > 0 && (
                  // Radios already say "pick one", so the "or" only earns its row on desktop.
                  <p className="m-0 hidden md:block text-base text-gray-400 self-center">
                    or
                  </p>
                )}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setClientType(type.value)}
                  className={`flex-1 flex gap-3 items-start text-left border rounded-xl p-3 md:p-4 cursor-pointer transition-colors ${
                    selected
                      ? "bg-brand-25 border-brand-500"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center border shrink-0 ${
                      selected
                        ? "bg-brand-600 border-brand-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span
                      className={`text-base font-medium leading-6 ${selected ? "text-gray-900" : "text-gray-700"}`}
                    >
                      {type.title}
                    </span>
                    <span
                      className={`text-xs leading-[18px] ${selected ? "text-gray-600" : "text-gray-500"}`}
                    >
                      {type.description}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          {/* Personal Details */}
          <div className="flex flex-col gap-3">
            <SectionHeading title="Personal Details" />
            <PersonalDetailsFields
              fields={[
                ...NAME_FIELDS,
                "dob",
                "religion",
                "civilStatus",
                "nationality",
                "citizenship",
                "gender",
              ]}
              civilStatus={civilStatus}
              onCivilStatusChange={setCivilStatus}
              nationalityHint
            />
          </div>
          <Divider />

          <div className="flex flex-col gap-3">
            <SectionHeading title="Birth Place Information" />
            <BirthPlaceFields />
          </div>
          <Divider />

          <div className="flex flex-col gap-3">
            <SectionHeading title="Contact Information" />
            <ContactFields />
          </div>
          <Divider />

          <PresentAndHomeAddress />
          <Divider />

          <div className="flex flex-col gap-3">
            <SectionHeading title="Home Ownership" />
            <div className={GRID_3}>
              <SelectField
                label="Ownership Category"
                required
                options={OWNERSHIP_CATEGORIES}
                value={ownership}
                onChange={setOwnership}
              />
              <TextField
                label="Length of Stay (In year)"
                required
                type="number"
                min={0}
                placeholder="Enter number of year/s"
              />
            </div>
          </div>
          <Divider />

          <OccupationFields subject="client" />
          <Divider />

          {/* Preferred Mailing Address */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <SectionHeading title="Preferred Mailing Address" />
              <p className="m-0 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm leading-5 text-gray-700">
                <span className="font-semibold text-error-600">Note:</span> The
                buyer shall ensure he/she is able to update DMCI Homes through
                Customer Care in case of any changes to his/her contact
                information.
              </p>
            </div>
            <Field label="Preferred Mailing Address Source" required>
              <RadioGroup
                label="Preferred mailing address source"
                className="mt-1.5"
                options={mailingSourceOptions}
                value={activeMailingSource}
                onChange={setMailingSource}
              />
            </Field>
            <div className={GRID_2}>
              <Field label="Preferred Mailing Address" required>
                <RadioGroup
                  label="Preferred mailing address"
                  className="mt-1.5 max-w-[320px] gap-x-11"
                  options={[
                    { label: "Home Address", value: "home" },
                    { label: "Office Address", value: "office" },
                    {
                      label: "Present Address for Buyers Abroad",
                      value: "abroad",
                    },
                  ]}
                  value={mailingAddress}
                  onChange={setMailingAddress}
                />
              </Field>
              <Field label="Preferred Mailing Method" required>
                <RadioGroup
                  label="Preferred mailing method"
                  className="mt-1.5"
                  options={[
                    { label: "Email", value: "email" },
                    { label: "Courier", value: "courier" },
                  ]}
                  value={mailingMethod}
                  onChange={setMailingMethod}
                />
              </Field>
            </div>
            <Field label="Special Mailing instruction">
              <TextArea
                aria-label="Special mailing instruction"
                placeholder="Write instructions..."
              />
            </Field>
          </div>
          <Divider />

          {/* Reason For Buying */}
          <div className="flex flex-col gap-5">
            <SectionHeading
              title="Reason For Buying"
              required
              description="Select all that apply"
            />
            <div className="flex flex-col gap-3">
              <MultiSelect
                label="Reason for buying"
                options={REASONS_FOR_BUYING}
                value={reasons}
                onChange={setReasons}
              />
              {reasons.includes("Other") && (
                <Field label="Please specify the “other” reason" required>
                  <TextArea
                    aria-label="Other reason for buying"
                    placeholder="Write instructions..."
                  />
                </Field>
              )}
            </div>
          </div>
          <Divider />

          {/* Source Of Awareness */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <SectionHeading title="Source Of Awareness" />
              <p className="m-0 flex gap-0.5 text-sm leading-5 text-gray-600">
                How did you learn about the property?
                <span className="text-brand-600">*</span>
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-1 md:gap-y-2 items-center">
              {AWARENESS_SOURCES.map((row, rowIndex) => (
                <div key={rowIndex} className="contents">
                  {row.map((source) => (
                    <CheckboxField
                      key={source}
                      label={source}
                      className="py-1.5 md:py-3 font-medium"
                      checked={awareness.includes(source)}
                      onChange={() => toggleAwareness(source)}
                    />
                  ))}
                  {/* Each row's last option has a "specify" field. Phones show it only
                      once that option is ticked; desktop keeps it (disabled) in place. */}
                  <div
                    className={
                      "col-span-2 md:col-span-1 mb-1 md:mb-0 " +
                      (awareness.includes(row[row.length - 1])
                        ? ""
                        : "hidden md:block")
                    }
                  >
                    {awarenessDetail[rowIndex]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />

          {civilStatus === "Married" && (
            <>
              <SpouseInformation />
              <Divider />
            </>
          )}

          {/* Co-Buyers */}
          <GroupPanel title="Co-Buyer Information (Optional)">
            {coBuyers.ids.map((id, i) => (
              <EntryCard
                key={id}
                title={`Co-Buyer #${i + 1}`}
                onRemove={() => coBuyers.remove(id)}
              >
                <CoBuyerFields index={i + 1} />
              </EntryCard>
            ))}
            <AddEntryButton
              label={
                coBuyers.ids.length > 0 ? "Additional Co-buyer" : "Add Co-buyer"
              }
              onClick={coBuyers.add}
            />
            {coBuyers.ids.length > 0 && (
              <ConfirmBox label="I confirm that all co-buyer details provided are accurate." />
            )}
          </GroupPanel>
          <Divider />

          {/* Representative */}
          <div className="flex flex-col gap-3">
            <SectionHeading
              title="Representative Information"
              description="Please provide details if you have an Attorney-in-Fact or Financer involved in this transaction."
            />
            <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 md:p-5">
              <p className="m-0 text-sm font-medium leading-6 text-gray-700">
                Do you have an Attorney-in-Fact / a Financer?
              </p>
              <RadioGroup
                label="Do you have an Attorney-in-Fact or a Financer?"
                options={YES_NO}
                value={hasRepresentative}
                onChange={setHasRepresentative}
              />
            </div>
          </div>
          {hasRepresentative === "yes" && <RepresentativeDetails />}
          <Divider />

          {/* Political Exposure */}
          <div className="flex flex-col gap-3">
            <SectionHeading
              title="Political Exposure Questionnaire"
              description="Have you or any of your immediate family members or close associates ever held an elected or appointed government position?"
            />
            <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 md:p-5">
              <p className="m-0 md:text-base text-sm font-medium leading-6 text-gray-700">
                Have you or any of your immediate family members or close
                associates ever held, or are currently holding, an elected or
                appointed government position in the Philippines or any other
                country?
              </p>
              <RadioGroup
                label="Politically exposed"
                options={YES_NO}
                value={isPep}
                onChange={setIsPep}
              />
            </div>
          </div>
          {isPep === "yes" && (
            <GroupPanel
              title="Politically Exposed Person (PEP) Details"
              action={
                <AddEntryButton label="Add new PEP" onClick={pepEntries.add} />
              }
            >
              {pepEntries.ids.map((id, i) => (
                <EntryCard
                  key={id}
                  title={`PEP Entry #${i + 1}`}
                  onRemove={() => pepEntries.remove(id)}
                >
                  <PepEntryFields />
                </EntryCard>
              ))}
              <AddEntryButton label="Additional PEP" onClick={pepEntries.add} />
              <ConfirmBox label="This is to certify that all information indicated above PEP questions are true and correct." />
            </GroupPanel>
          )}
        </div>
      </div>
    </section>
  );
}
