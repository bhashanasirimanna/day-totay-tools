import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { CssUnitConverter } from "@/components/tools/CssUnitConverter";

const SLUG = "px-to-rem";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<CssUnitConverter mode="px-to-rem" />} />;
}
