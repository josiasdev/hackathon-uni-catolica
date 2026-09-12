import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const sourceLabels: Record<string, string> = {
  curso: "Curso",
  certificacao: "Certificação",
  projeto: "Projeto",
  evento: "Evento",
  selecao: "Seleção",
  experiencia: "Experiência",
  manual: "Manual",
};

export interface SkillBadgeProps {
  name: string;
  sourceType?: string;
  onRemove?: () => void;
  className?: string;
}

export function SkillBadge({ name, sourceType, onRemove, className }: SkillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-foreground",
        className
      )}
    >
      {name}
      {sourceType && (
        <span className="text-xs text-muted-foreground">
          · {sourceLabels[sourceType] ?? sourceType}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
