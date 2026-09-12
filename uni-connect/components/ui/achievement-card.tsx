import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export interface AchievementCardProps {
  name: string;
  description: string;
  unlocked?: boolean;
  unlockedAt?: string;
  className?: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AchievementCard({
  name,
  description,
  unlocked = false,
  unlockedAt,
  className,
}: AchievementCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border p-4 transition-colors",
        unlocked
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/50 opacity-60",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Trophy className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {unlocked && unlockedAt && (
          <p className="mt-1 text-xs text-primary">
            Desbloqueada em {formatDate(unlockedAt)}
          </p>
        )}
        {!unlocked && (
          <p className="mt-1 text-xs text-muted-foreground">Bloqueada</p>
        )}
      </div>
    </div>
  );
}
