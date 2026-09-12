"use client";

import { Award, BookOpen, CheckCircle2, CircleUserRound, Filter, Sparkles, Wrench } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type Event = { id: string; type: string; title: string; description: string | null; occurred_at: string };
type Skill = { id: string; name: string; origin: string; date: string };
type Course = { id: string; title: string; status: string; enrolledAt: string; completedAt: string | null };
type Certification = { id: string; title: string; code: string; date: string };

type TimelineItem = { id: string; title: string; description: string; date: string; kind: "event" | "course" | "skill" | "certification"; meta?: string };

const filters = [{ id: "all", label: "Tudo" }, { id: "course", label: "Cursos" }, { id: "skill", label: "Competências" }, { id: "certification", label: "Certificações" }, { id: "event", label: "Atividades" }] as const;

function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value)); }
function Icon({ kind }: { kind: TimelineItem["kind"] }) { if (kind === "course") return <BookOpen className="size-4" />; if (kind === "skill") return <Wrench className="size-4" />; if (kind === "certification") return <Award className="size-4" />; if (kind === "event") return <Sparkles className="size-4" />; return <CircleUserRound className="size-4" />; }

export function TrajectoryTimeline({ events, skills, courses, certifications }: { events: Event[]; skills: Skill[]; courses: Course[]; certifications: Certification[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const items: TimelineItem[] = [
    ...events.map((item) => ({ id: `event-${item.id}`, title: item.title, description: item.description ?? "Atividade registrada na sua jornada.", date: item.occurred_at, kind: "event" as const })),
    ...skills.map((item) => ({ id: `skill-${item.id}`, title: `Competência adicionada: ${item.name}`, description: item.origin === "course" ? "Desenvolvida a partir de um curso concluído." : "Adicionada ao seu repertório.", date: item.date, kind: "skill" as const, meta: item.origin === "course" ? "Origem: curso" : "Origem: manual" })),
    ...courses.map((item) => ({ id: `course-${item.id}`, title: item.status === "completed" ? `Curso concluído: ${item.title}` : `Matrícula realizada: ${item.title}`, description: item.status === "completed" ? "Você concluiu uma etapa de aprendizagem." : "Curso em andamento.", date: item.completedAt ?? item.enrolledAt, kind: "course" as const, meta: item.status === "completed" ? "Concluído" : "Em andamento" })),
    ...certifications.map((item) => ({ id: `certification-${item.id}`, title: `Certificação emitida: ${item.title}`, description: "Uma conquista verificável foi adicionada ao seu perfil.", date: item.date, kind: "certification" as const, meta: `Código: ${item.code}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const visibleItems = filter === "all" ? items : items.filter((item) => item.kind === filter);

  return <div className="space-y-5"><div className="flex items-center gap-2 overflow-x-auto pb-1"><Filter className="size-4 shrink-0 text-muted-foreground" />{filters.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === item.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{item.label}</button>)}</div>{visibleItems.length ? <div className="relative ml-3 border-l border-border pl-7">{visibleItems.map((item, index) => <article key={item.id} className="relative pb-8 last:pb-1"><div className="absolute -left-[2.05rem] flex size-7 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground"><Icon kind={item.kind} /></div><p className="text-xs text-muted-foreground">{formatDate(item.date)}</p><h3 className="mt-1 font-medium">{item.title}</h3><p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">{item.description}</p>{item.meta ? <Badge variant="outline" className="mt-2 text-[11px]">{item.meta}</Badge> : null}{index === 0 ? <span className="sr-only">Atividade mais recente</span> : null}</article>)}</div> : <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center"><CheckCircle2 className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nada neste filtro ainda</p><p className="mt-1 text-sm text-muted-foreground">Quando você avançar nessa frente, ela aparecerá aqui.</p></div>}</div>;
}