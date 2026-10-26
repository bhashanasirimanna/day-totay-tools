import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { ImageColorPicker } from "@/components/tools/ImageColorPicker";

const SLUG = "image-color-picker";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<ImageColorPicker />} />;
}
