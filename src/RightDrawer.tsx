import { XIcon } from "./icons";

export interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function RightDrawer({
  isOpen,
  onClose,
  title,
  children,
}: RightDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
          <div
            className={`pointer-events-auto w-96 flex flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3">
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close drawer"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content - flex column with scrollable content area */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
