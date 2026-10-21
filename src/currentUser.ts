import { useSyncExternalStore } from "react";

/**
 * currentUser — the signed-in account shown in the sidebar user card, the
 * account menu, and the Profile page. UI prototype: static demo data, no API.
 */

export interface CurrentUser {
  name: string;
  role: string;
  userId: string;
  salesGroup: string;
  reportTo: string;
  department: string;
  email: string;
  position: string;
  status: string;
  tin: string;
  bankName: string;
  bankAccount: string;
  phone: string;
  startDate: string;
  endDate: string;
}

export const CURRENT_USER: CurrentUser = {
  name: "Jeah Althea P Godoy",
  role: "Seller",
  userId: "39390",
  salesGroup: "N/A",
  reportTo: "N/A",
  department: "N/A",
  email: "jeah.godoy@example.com",
  position: "N/A",
  status: "Active",
  tin: "000-000-000-000",
  bankName: "N/A",
  bankAccount: "No Bank Account",
  phone: "N/A",
  startDate: "N/A",
  endDate: "N/A",
};

/** "Jeah Althea P Godoy" -> "JA" (first two words, like the design). */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Profile photo picked via "Upload Image". Kept in a tiny module-level store
// so the sidebar avatar updates as soon as the Profile page sets it. Lives
// for the browser session only (object URL, nothing is uploaded).
let profilePhoto: string | null = null;
const listeners = new Set<() => void>();

export function setProfilePhoto(file: File) {
  if (profilePhoto) URL.revokeObjectURL(profilePhoto);
  profilePhoto = URL.createObjectURL(file);
  listeners.forEach((listener) => listener());
}

export function useProfilePhoto(): string | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => profilePhoto,
  );
}
