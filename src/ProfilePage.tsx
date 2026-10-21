import { useRef } from "react";
import Layout, { PageBackHeading, UserAvatar } from "./Layout";
import KeyValueList from "./KeyValueList";
import { useNavigation } from "./NavigationContext";
import { CURRENT_USER, setProfilePhoto } from "./currentUser";
import { UploadIcon } from "./icons";

/**
 * ProfilePage — opened from the sidebar account menu ("View Profile").
 * Read-only account details plus "Upload Image", which swaps the initials
 * avatar here and in the sidebar for the picked photo (session only).
 */
export default function ProfilePage() {
  const { navigate } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = CURRENT_USER;

  const rows = [
    { label: "User ID", value: user.userId },
    { label: "Sales Group", value: user.salesGroup },
    { label: "Report To", value: user.reportTo },
    { label: "Department", value: user.department },
    { label: "Email", value: user.email },
    { label: "Position", value: user.position },
    { label: "Status", value: user.status },
    { label: "TIN Number", value: user.tin },
    { label: "Bank Name", value: user.bankName },
    { label: "Bank Account", value: user.bankAccount },
    { label: "Phone Number", value: user.phone },
    { label: "Start Date", value: user.startDate },
    { label: "End Date", value: user.endDate },
  ];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  }

  return (
    <Layout
      breadcrumb={[
        { label: "Dashboard", onClick: () => navigate({ screen: "dashboard" }) },
        { label: "Profile" },
      ]}
    >
      <div className="flex w-full flex-col gap-4 px-5 py-3">
        <PageBackHeading title="Profile" />

        <section className="card flex w-full flex-col overflow-hidden">
          <h3 className="border-b border-gray-200 px-5 py-3 text-base font-semibold text-gray-900">
            Profile Information
          </h3>

          <div className="flex items-center gap-4 border-b border-gray-200 px-5 py-5">
            <UserAvatar className="h-24 w-24 border-0 bg-gray-200 text-2xl text-brand-600" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-lg font-semibold text-brand-600">
                {user.name}
              </span>
              <span className="text-sm text-gray-600">{user.role}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex w-fit cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 hover:text-brand-400"
              >
                <UploadIcon className="h-4 w-4" />
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="px-5 py-5">
            <KeyValueList rows={rows} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
