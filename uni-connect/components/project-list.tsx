"use client";

import { ArrowRight, CheckCircle2, FolderKanban, MapPin } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Project = { id: string; title: string; description: string | null; modality: string; roles: { id: string; title: string; skill_names: string[] }[]; application: { id: string; status: string } | null };

export function ProjectList({ userId, initialProjects }: { userId: string; initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  async function join(project: Project) {
    setLoadingId(project.id);
    const supabase = createClient();
    const { data } = await supabase.from("project_applications").insert({ project_id: project.id, role_id: project.roles[0]?.id ?? null, user_id: userId }).select("id, status").single();
    if (data) setProjects((current) => current.map((item) => item.id === project.id ? { ...item, application: data } : item));
    setLoadingId(null);
  }
  return <div className="grid gap-4 md:grid-cols-2">{projects.length ? projects.map((project) => <Card key={project.id} className="flex flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-muted"><FolderKanban className="size-5" /></div><Badge variant="outline"><MapPin className="size-3" /> {project.modality}</Badge></div><CardTitle className="mt-4 text-lg">{project.title}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col"><p className="flex-1 text-sm leading-6 text-muted-foreground">{project.description ?? "Um projeto para construir em equipe."}</p><div className="mt-4 rounded-xl bg-muted p-3"><p className="text-xs font-semibold uppercase">Vaga aberta</p><p className="mt-1 text-sm font-medium">{project.roles[0]?.title ?? "Pessoa colaboradora"}</p>{project.roles[0]?.skill_names.length ? <div className="mt-2 flex flex-wrap gap-1">{project.roles[0].skill_names.map((skill) => <Badge key={skill} variant="secondary" className="text-[11px]">{skill}</Badge>)}</div> : null}</div><div className="mt-5 border-t border-border pt-4">{project.application ? <span className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Interesse registrado</span> : <Button size="sm" onClick={() => join(project)} disabled={loadingId === project.id}>{loadingId === project.id ? "Enviando..." : "Tenho interesse"}<ArrowRight /></Button>}</div></CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><FolderKanban className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nenhum projeto aberto ainda</p><p className="mt-1 text-sm text-muted-foreground">Novos projetos aparecerão aqui.</p></div>}</div>;
}