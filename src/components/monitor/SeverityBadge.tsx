import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  Low: "bg-[hsl(var(--severity-low)/.15)] text-[hsl(var(--severity-low))] border-[hsl(var(--severity-low)/.3)]",
  Medium: "bg-[hsl(var(--severity-medium)/.15)] text-[hsl(var(--severity-medium))] border-[hsl(var(--severity-medium)/.3)]",
  High: "bg-[hsl(var(--severity-high)/.15)] text-[hsl(var(--severity-high))] border-[hsl(var(--severity-high)/.3)]",
  Critical: "bg-[hsl(var(--severity-critical)/.15)] text-[hsl(var(--severity-critical))] border-[hsl(var(--severity-critical)/.3)]",
};

const SeverityBadge = ({ severity }: { severity: string }) => (
  <span
    className={cn(
      "inline-block px-2 py-0.5 rounded-full text-xs font-medium border",
      colorMap[severity] || "bg-secondary text-secondary-foreground border-border"
    )}
  >
    {severity}
  </span>
);

export default SeverityBadge;
