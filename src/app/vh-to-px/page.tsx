import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { CssUnitConverter } from "@/components/tools/CssUnitConverter";

const SLUG = "vh-to-px";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<CssUnitConverter mode="vh-to-px" />} />;
}
