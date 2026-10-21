import {
  Combine,
  FileImage,
  FileText,
  Maximize,
  Ruler,
  Scale,
  Split,
  Thermometer,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/tools";

const icons = {
  "file-text": FileText,
  combine: Combine,
  split: Split,
  "file-image": FileImage,
  ruler: Ruler,
  scale: Scale,
  thermometer: Thermometer,
  area: Maximize,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function ToolIcon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}

/** Icon inside a tinted rounded square. */
export function ToolIconTile({
  name,
  large = false,
}: {
  name: IconName;
  large?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ${
        large ? "size-12" : "size-10"
      }`}
    >
      <ToolIcon name={name} size={large ? 24 : 20} />
    </span>
  );
}
