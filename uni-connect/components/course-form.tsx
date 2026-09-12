"use client";

import { BookOpen, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CourseForm({ creatorId, institutionId }: { creatorId: string; institutionId: string | null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workload, setWorkload] = useState("");
  const [skillNames, setSkillNames] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const supabase = createClient();
    const { data: insertedCourse, error: insertError } = await supabase.from("courses").insert({
      title: title.trim(),
      description: description.trim() || null,
      workload_hours: workload ? Number(workload) : null,
      published,
      created_by: creatorId,
      institution_id: institutionId,
    });

    const course = insertedCourse as { id: string } | null;
    if (insertError || !course) {
      setError("Não foi possível criar o curso. Confira os dados e tente novamente.");
      setSaving(false);
      return;
    }

    const names = skillNames.split(",").map((name) => name.trim()).filter(Boolean);
    for (const name of names) {
      const { data: existingSkill } = await supabase.from("skills").select("id").ilike("name", name).maybeSingle();
      let skillId = existingSkill?.id;
      if (!skillId) {
        const { data: createdSkill } = await supabase.from("skills").insert({ name }).select("id").single();
        skillId = createdSkill?.id;
      }
      if (skillId) await supabase.from("course_skills").insert({ course_id: course.id, skill_id: skillId });
    }

    setTitle("");
    setDescription("");
    setWorkload("");
    setSkillNames("");
    setSaved(true);
    setSaving(false);
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary"><BookOpen className="size-5" /></div><div><p className="font-medium">Novo curso</p><p className="text-xs text-muted-foreground">Publique uma nova oportunidade de aprendizagem.</p></div></div>
      <div className="space-y-2"><Label htmlFor="course-title">Título</Label><Input id="course-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Fundamentos de Python" className="h-11" /></div>
      <div className="space-y-2"><Label htmlFor="course-description">Descrição</Label><Textarea id="course-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="O que o aluno vai aprender?" /></div>
      <div className="space-y-2"><Label htmlFor="course-skills">Competências desenvolvidas</Label><Input id="course-skills" value={skillNames} onChange={(event) => setSkillNames(event.target.value)} placeholder="Python, APIs, PostgreSQL" className="h-11" /><p className="text-xs text-muted-foreground">Separe as competências por vírgula.</p></div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><div className="space-y-2"><Label htmlFor="course-workload">Carga horária</Label><Input id="course-workload" type="number" min="1" value={workload} onChange={(event) => setWorkload(event.target.value)} placeholder="Horas" className="h-11" /></div><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="size-4 accent-primary" /> Publicar agora</label></div>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Curso criado.</p>}
      <Button type="submit" disabled={saving || !title.trim()}><Plus />{saving ? "Criando..." : "Criar curso"}</Button>
    </form>
  );
}