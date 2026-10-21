import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { ColorConverter } from "@/components/tools/ColorConverter";

const SLUG = "rgb-to-hex";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<ColorConverter mode="rgb-to-hex" />} />;
}
