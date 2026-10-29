import { Suspense } from "react";
import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { CssUnitConverter, CssUnitConverterFromUrl } from "@/components/tools/CssUnitConverter";

const SLUG = "css-unit-converter";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  // Suspense is required for useSearchParams; the fallback is the default converter, so nothing shifts.
  return (
    <UtilityPage
      slug={SLUG}
      tool={
        <Suspense fallback={<CssUnitConverter />}>
          <CssUnitConverterFromUrl />
        </Suspense>
      }
    />
  );
}
