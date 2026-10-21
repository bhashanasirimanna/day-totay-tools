import { ConverterPage, converterMetadata } from "@/components/ConverterPage";
import { converterContent } from "@/lib/converter-content";

const content = converterContent.area;

export const metadata = converterMetadata(content);

export default function Page() {
  return <ConverterPage content={content} />;
}
