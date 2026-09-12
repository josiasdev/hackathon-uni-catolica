"use client";

import { CheckCircle2, FolderKanban, Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({ creatorId, institutionId }: { creatorId: string; institutionId: string | null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [modality, setModality] = useState("remoto");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setSaved(false); setError(null);
    const supabase = createClient();
    const { data: project, error: projectError } = await supabase.from("projects").insert({ title: title.trim(), description: description.trim() || null, modality, published: true, created_by: creatorId, institution_id: institutionId }).select("id").single();
    if (projectError || !project) { setError("Não foi possível publicar o projeto."); setSaving(false); return; }
    const { error: roleError } = await supabase.from("project_roles").insert({ project_id: project.id, title: role.trim(), skill_names: skills.split(",").map((item) => item.trim()).filter(Boolean) });
    if (roleError) { setError("Projeto criado, mas não foi possível adicionar a vaga."); setSaving(false); return; }
    setTitle(""); setDescription(""); setRole(""); setSkills(""); setSaved(true); setSaving(false); window.location.reload();
  }

  return <form onSubmit={submit} className="space-y-5"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary"><FolderKanban className="size-5" /></div><div><p className="font-medium">Novo projeto</p><p className="text-xs text-muted-foreground">Monte uma equipe para tirar uma ideia do papel.</p></div></div><div className="space-y-2"><Label htmlFor="project-title">Nome do projeto</Label><Input id="project-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Plataforma de impacto social" className="h-11" /></div><div className="space-y-2"><Label htmlFor="project-description">Objetivo</Label><Textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Qual problema o projeto quer resolver?" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-role">Primeira vaga</Label><Input id="project-role" required value={role} onChange={(event) => setRole(event.target.value)} placeholder="Ex.: Pessoa desenvolvedora" className="h-11" /></div><div className="space-y-2"><Label htmlFor="project-modality">Modalidade</Label><select id="project-modality" value={modality} onChange={(event) => setModality(event.target.value)} className="border-input flex h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="remoto">Remoto</option><option value="hibrido">Híbrido</option><option value="presencial">Presencial</option></select></div></div><div className="space-y-2"><Label htmlFor="project-skills">Competências desejadas</Label><Input id="project-skills" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, produto, comunicação" className="h-11" /><p className="text-xs text-muted-foreground">Separe por vírgula.</p></div>{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Projeto publicado.</p>}<Button type="submit" disabled={saving || !title.trim() || !role.trim()}><Plus />{saving ? "Publicando..." : "Publicar projeto"}</Button></form>;
}