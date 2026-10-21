import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { WordCounter } from "@/components/tools/WordCounter";

const SLUG = "word-counter";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<WordCounter />} />;
}
