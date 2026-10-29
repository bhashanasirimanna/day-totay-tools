import { Suspense } from "react";
import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { ColorConverter, ColorConverterFromUrl } from "@/components/tools/ColorConverter";

const SLUG = "color-converter";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  // Suspense is required for useSearchParams; the fallback is the default converter, so nothing shifts.
  return (
    <UtilityPage
      slug={SLUG}
      tool={
        <Suspense fallback={<ColorConverter />}>
          <ColorConverterFromUrl />
        </Suspense>
      }
    />
  );
}
