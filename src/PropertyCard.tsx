import { noImageAvailableUrl, projectPhotoUrls } from "./assets/figmaAssets";

/**
 * PropertyCard — the project card used in the Property List grid view
 * (project photo, name, CU/PS/SA Available/Sold stats). Also reused by the
 * "Recently Viewed" section on ProjectDetails so both places render an
 * identical card.
 */

export interface PropertyCardData {
  name: string;
  available: [number, number, number];
  sold: [number, number, number];
}

export default function PropertyCard({
  card,
  onClick,
}: {
  card: PropertyCardData;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      // Same look and hover as the Property List grid cards: primary-tinted
      // border, soft lifted shadow, underlined name.
      className="group flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-primary-200 hover:shadow-[0_10px_24px_-8px_rgba(16,24,40,0.15)]"
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      {/* Photo inset from the card edge, with its own rounded corners. */}
      <div className="shrink-0 px-3 pt-3">
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          {projectPhotoUrls[card.name] ? (
            <img
              src={projectPhotoUrls[card.name]}
              alt={card.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={noImageAvailableUrl}
              alt="No image available"
              className="max-h-full max-w-full object-contain p-4"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <span className="text-base font-semibold text-primary-500 group-hover:underline">
          {card.name}
        </span>
        <div className="grid grid-cols-[1fr_repeat(3,minmax(40px,auto))] items-center gap-x-3 gap-y-1.5 text-[13px]">
          <span />
          {["CU", "PS", "SA"].map((label) => (
            <span
              key={label}
              className="mb-1.5 justify-self-center rounded-md bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500"
            >
              {label}
            </span>
          ))}

          <span className="font-medium text-gray-500">Available</span>
          {card.available.map((value, i) => (
            <span key={i} className="text-center text-gray-900">
              {value}
            </span>
          ))}

          <span className="font-medium text-gray-500">Sold</span>
          {card.sold.map((value, i) => (
            <span key={i} className="text-center text-gray-900">
              {value}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
