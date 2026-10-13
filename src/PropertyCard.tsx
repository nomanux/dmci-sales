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
      className="group flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white text-left transition-shadow duration-200 ease-out hover:shadow-lg"
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      <div className="flex h-32 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-gray-50">
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
      <div className="flex flex-col gap-3 p-4">
        <span className="text-base font-semibold text-primary-500">
          {card.name}
        </span>
        <div className="grid grid-cols-[1fr_repeat(3,minmax(40px,auto))] items-center gap-x-3 gap-y-1.5">
          <span />
          {["CU", "PS", "SA"].map((label) => (
            <span
              key={label}
              className="justify-self-center rounded-md bg-gray-50 px-3 py-0.5 text-xs font-semibold text-gray-600"
            >
              {label}
            </span>
          ))}

          <span className="text-xs font-semibold text-gray-700">Available</span>
          {card.available.map((value, i) => (
            <span key={i} className="text-center text-sm text-gray-700">
              {value}
            </span>
          ))}

          <span className="text-xs font-semibold text-gray-700">Sold</span>
          {card.sold.map((value, i) => (
            <span key={i} className="text-center text-sm text-gray-700">
              {value}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
