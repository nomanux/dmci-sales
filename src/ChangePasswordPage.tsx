import { useState } from "react";
import Layout, { PageBackHeading } from "./Layout";
import Button from "./Button";
import Input from "./Input";
import { useNavigation } from "./NavigationContext";
import { CheckCircleIcon, EyeIcon, EyeOffIcon, LockIcon } from "./icons";

/**
 * ChangePasswordPage — opened from the sidebar account menu ("Change
 * Password") or the Profile breadcrumb. UI prototype: validates on submit
 * and shows a success message; nothing is sent anywhere.
 */

type FieldName = "current" | "next" | "confirm";

const MIN_LENGTH = 8;

const FIELDS: { name: FieldName; label: string; placeholder: string; autoComplete: string }[] = [
  { name: "current", label: "Current Password", placeholder: "Enter current password", autoComplete: "current-password" },
  { name: "next", label: "New Password", placeholder: "Enter new password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirm Password", placeholder: "Re-enter new password", autoComplete: "new-password" },
];

const EMPTY = { current: "", next: "", confirm: "" };

function validate(values: Record<FieldName, string>): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.current) errors.current = "Please enter your current password.";
  if (!values.next) errors.next = "Please enter a new password.";
  else if (values.next.length < MIN_LENGTH) errors.next = `Use at least ${MIN_LENGTH} characters.`;
  else if (values.next === values.current) errors.next = "New password must be different from your current one.";
  if (!values.confirm) errors.confirm = "Please re-enter your new password.";
  else if (values.confirm !== values.next) errors.confirm = "Passwords don't match.";
  return errors;
}

export default function ChangePasswordPage() {
  const { navigate } = useNavigation();
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY);
  const [visible, setVisible] = useState<Record<FieldName, boolean>>({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(name: FieldName, value: string) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setSaved(false);
    // After the first submit, re-check as the person types so errors clear.
    if (submitted) setErrors(validate(nextValues));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setValues(EMPTY);
    setSubmitted(false);
    setSaved(true);
  }

  return (
    <Layout
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Profile", onClick: () => navigate({ screen: "profile" }) },
        { label: "Change Password" },
      ]}
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Change Password" />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="card flex w-full flex-col overflow-hidden"
        >
          <h3 className="border-b border-gray-200 px-5 py-3 text-base font-semibold text-gray-900">
            Password Details
          </h3>

          <div className="flex max-w-xl flex-col gap-5 px-5 py-5">
            {saved && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-2.5 text-sm font-medium text-success-700"
              >
                <CheckCircleIcon className="h-4 w-4 shrink-0" />
                Your password has been updated.
              </div>
            )}

            {FIELDS.map((field) => {
              const error = errors[field.name];
              const shown = visible[field.name];
              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                    {field.label}
                    <span className="ml-0.5 text-brand-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <LockIcon className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type={shown ? "text" : "password"}
                      size="md"
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      clearable={false}
                      aria-invalid={!!error}
                      aria-describedby={error ? `${field.name}-error` : undefined}
                      className={
                        "rounded-lg bg-white pl-9 pr-10 " +
                        (error ? "border-error-500 focus:border-error-500 focus:ring-error-500" : "")
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setVisible((v) => ({ ...v, [field.name]: !v[field.name] }))}
                      aria-label={shown ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
                      className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                      {shown ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {error ? (
                    <p id={`${field.name}-error`} className="text-xs text-error-600">
                      {error}
                    </p>
                  ) : (
                    field.name === "next" && (
                      <p className="text-xs text-gray-500">At least {MIN_LENGTH} characters.</p>
                    )
                  )}
                </div>
              );
            })}

            {/* Right after the last field, lined up with the inputs' right edge. */}
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="secondary" size="md" onClick={() => navigate({ screen: "profile" })}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
