import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  source_type?: string;
}

const typeColors: Record<string, string> = {
  ingresso: "bg-blue-500",
  curso: "bg-primary",
  certificacao: "bg-green-500",
  projeto: "bg-purple-500",
  evento: "bg-cyan-500",
  selecao: "bg-yellow-500",
  experiencia: "bg-indigo-500",
  conquista: "bg-amber-500",
  manual: "bg-muted-foreground",
};

const typeLabels: Record<string, string> = {
  ingresso: "Ingresso",
  curso: "Curso",
  certificacao: "Certificação",
  projeto: "Projeto",
  evento: "Evento",
  selecao: "Seleção",
  experiencia: "Experiência",
  conquista: "Conquista",
  manual: "Manual",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-muted-foreground">
          Nenhum evento na sua trajetória ainda.
        </p>
        <p className="text-sm text-muted-foreground/70">
          Suas atividades aparecerão aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Linha vertical */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {events.map((event) => (
        <div key={event.id} className="relative flex gap-4">
          {/* Ponto */}
          <div
            className={cn(
              "relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background",
              typeColors[event.source_type ?? event.type] ?? "bg-muted-foreground"
            )}
          >
            <span className="text-xs font-bold text-white">
              {(event.source_type ?? event.type).charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {typeLabels[event.source_type ?? event.type] ?? event.type}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(event.date)}
              </span>
            </div>
            <h3 className="font-medium text-card-foreground">{event.title}</h3>
            {event.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
