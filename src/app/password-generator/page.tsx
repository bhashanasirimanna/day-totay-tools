import { UtilityPage, utilityMetadata } from "@/components/UtilityPage";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";

const SLUG = "password-generator";

export function generateMetadata() {
  return utilityMetadata(SLUG);
}

export default function Page() {
  return <UtilityPage slug={SLUG} tool={<PasswordGenerator />} />;
}
