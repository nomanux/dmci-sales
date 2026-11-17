import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * RowActionButton ("Table Action Button" on the /component page) — icon +
 * label action used in table "Actions" columns (e.g. View / Image / Hold,
 * View / Register, View / Deactivate). Icon and label share one color so
 * hover/disabled apply consistently: default gray-400, hover bg-slate-100
 * with brand-500 text/icon, disabled gray-300 text/icon.
 */
export interface RowActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  /**
   * "sm": tighter padding for columns with several actions (View / Image / Hold).
   * "segment": one part of a RowActionGroup (joined toolbar look). Keeps the
   * 13px label; the icon size comes from the icon's own className.
   */
  size?: "md" | "sm" | "segment";
}

export default function RowActionButton({
  icon,
  label,
  size = "md",
  className = "",
  type = "button",
  ...rest
}: RowActionButtonProps) {
  return (
    <button
      type={type}
      className={
        (size === "segment"
          ? "flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-gray-600 " +
            "transition-[background-color,color,transform] duration-150 ease-out " +
            "[&>svg]:shrink-0 [&>svg]:text-gray-400 [&>svg]:transition-colors [&>svg]:duration-150 " +
            "hover:bg-primary-25 hover:text-brand-500 hover:[&>svg]:text-brand-500 " +
            "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 " +
            "disabled:cursor-not-allowed disabled:text-gray-300 disabled:[&>svg]:text-gray-300 disabled:hover:bg-transparent"
          : (size === "sm"
              ? "flex h-9 cursor-pointer items-center gap-1 overflow-hidden rounded-md px-2.5 py-1 text-[13px]"
              : "flex h-8 cursor-pointer items-center gap-1 overflow-hidden rounded-lg px-3 py-2 text-xs") +
            " font-medium text-gray-400 transition-colors hover:bg-slate-100 hover:text-brand-500 disabled:cursor-not-allowed disabled:text-gray-300") +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * RowActionGroup: keeps several "segment" RowActionButtons close together
 * (no border, no background) so they read as one set of row actions.
 */
export function RowActionGroup({ children }: { children: ReactNode }) {
  return <div className="inline-flex items-center gap-0.5">{children}</div>;
}
