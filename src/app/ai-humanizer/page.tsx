import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { AiHumanizer } from "@/components/tools/AiHumanizer";

const SLUG = "ai-humanizer";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<AiHumanizer />} />;
}
