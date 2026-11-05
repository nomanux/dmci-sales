import Button from "./Button";
import Layout from "./Layout";
import { useLiniqoEmbed } from "./LiniqoFigure";
import { useNavigation } from "./NavigationContext";

/**
 * NoResults — the "no result found" page, with Liniqo's interactive desk lamp.
 * The embed script mounts into any [data-liniqo] element and watches for new
 * ones, so it only has to be added to the page once. data-key is Liniqo's
 * sealed embed token, not the licence key, so it is safe to ship.
 */

export default function NoResults() {
  const { navigate, back, canGoBack } = useNavigation();
  useLiniqoEmbed();

  return (
    <Layout breadcrumb={["No results"]}>
      <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-10 text-center">
        <div
          data-liniqo="desk-lamp"
          data-key="lq1.Ivh8pZgDVHQzF9Ba6ibATej_z341TXkrG7YwraOGrz8hyRIqF6aJvE58MEu2zumrAcHzuuxdhLZm-GLFQpjCtLIkJJbgFmHTFKmZ0l_57yy4cj6Oo6kwgw"
          data-accent="#07389d"
          aria-hidden="true"
          className="aspect-[5/4] w-full max-w-[280px] md:max-w-[400px] [&_svg_.hi]:!stroke-brand-500 [&_svg_path:not(.hi):not(.sil)]:!stroke-brand-200 [&_svg_path.sil]:!stroke-[#7f9be0]"
        />
        <h1 className="m-0 mt-4 text-xl font-semibold text-gray-900 sm:text-2xl">No results found</h1>
        <p className="m-0 mt-2 max-w-md text-sm text-gray-600 sm:text-base">
          We couldn&apos;t find anything that matches. Check the spelling or try different search terms and filters.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {canGoBack && (
            <Button size="sm" variant="secondary-color" onClick={back}>
              Go back
            </Button>
          )}
          <Button size="sm" onClick={() => navigate({ screen: "dashboard" })}>
            Go to dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
}
