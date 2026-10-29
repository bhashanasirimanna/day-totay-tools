import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { ImageFlipper } from "@/components/tools/ImageFlipper";

const SLUG = "image-flipper";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<ImageFlipper />} />;
}
