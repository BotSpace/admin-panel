import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Release } from "@/shared/types/release";

type Props = {
  status: Release["status"];
};

const statusConfig: Record<
  Release["status"],
  { label: string; className: string; dot: string }
> = {
  running: {
    label: "Ishlayapti",
    className:
      "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
    dot: "bg-green-500 animate-pulse",
  },
  pending: {
    label: "Kutilmoqda",
    className:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dot: "bg-amber-500 animate-pulse",
  },
  initializing: {
    label: "Ishga tushmoqda",
    className:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dot: "bg-blue-500 animate-pulse",
  },
  stopping: {
    label: "To'xtatilmoqda",
    className:
      "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
    dot: "bg-orange-500",
  },
  stopped: {
    label: "To'xtagan",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
  failed: {
    label: "Xato",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  suspended: {
    label: "To'xtatib qo'yilgan",
    className:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dot: "bg-purple-500",
  },
};

function ContainerBadge({ status }: Props) {
  const config = statusConfig[status] ?? statusConfig.stopped;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </Badge>
  );
}

export default ContainerBadge;
