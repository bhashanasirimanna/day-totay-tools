import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { BackgroundRemover } from "@/components/tools/BackgroundRemover";

const SLUG = "bg-remover";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<BackgroundRemover />} />;
}
