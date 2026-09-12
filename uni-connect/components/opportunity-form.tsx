"use client";

import { BriefcaseBusiness, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function OpportunityForm({ creatorId, institutionId }: { creatorId: string; institutionId: string | null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("estagio");
  const [modality, setModality] = useState("remoto");
  const [location, setLocation] = useState("");
  const [skillNames, setSkillNames] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setSaved(false); setError(null);
    const supabase = createClient();
    const { data, error: insertError } = await supabase.from("opportunities").insert({ title: title.trim(), description: description.trim() || null, opportunity_type: type, modality, location: location.trim() || null, published: true, created_by: creatorId, institution_id: institutionId }).select("id").single();
    if (insertError || !data) { setError("Não foi possível publicar a oportunidade."); setSaving(false); return; }

    for (const name of skillNames.split(",").map((item) => item.trim()).filter(Boolean)) {
      const { data: existing } = await supabase.from("skills").select("id").ilike("name", name).maybeSingle();
      let skillId = existing?.id;
      if (!skillId) { const { data: created } = await supabase.from("skills").insert({ name }).select("id").single(); skillId = created?.id; }
      if (skillId) await supabase.from("opportunity_skills").insert({ opportunity_id: data.id, skill_id: skillId });
    }
    setTitle(""); setDescription(""); setLocation(""); setSkillNames(""); setSaved(true); setSaving(false); window.location.reload();
  }

  return <form onSubmit={handleSubmit} className="space-y-5"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary"><BriefcaseBusiness className="size-5" /></div><div><p className="font-medium">Nova oportunidade</p><p className="text-xs text-muted-foreground">Publique uma experiência para a comunidade.</p></div></div><div className="space-y-2"><Label htmlFor="opportunity-title">Título</Label><Input id="opportunity-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Estágio em desenvolvimento" className="h-11" /></div><div className="space-y-2"><Label htmlFor="opportunity-description">Descrição</Label><Textarea id="opportunity-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva o desafio, contexto e o que a pessoa vai desenvolver." /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="opportunity-type">Tipo</Label><select id="opportunity-type" value={type} onChange={(event) => setType(event.target.value)} className="border-input flex h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="estagio">Estágio</option><option value="emprego">Emprego</option><option value="projeto">Projeto</option><option value="bolsa">Bolsa</option><option value="hackathon">Hackathon</option></select></div><div className="space-y-2"><Label htmlFor="opportunity-modality">Modalidade</Label><select id="opportunity-modality" value={modality} onChange={(event) => setModality(event.target.value)} className="border-input flex h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="remoto">Remoto</option><option value="hibrido">Híbrido</option><option value="presencial">Presencial</option></select></div></div><div className="space-y-2"><Label htmlFor="opportunity-location">Localização</Label><Input id="opportunity-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ex.: São Paulo ou remoto" className="h-11" /></div><div className="space-y-2"><Label htmlFor="opportunity-skills">Competências exigidas</Label><Input id="opportunity-skills" value={skillNames} onChange={(event) => setSkillNames(event.target.value)} placeholder="React, Git, comunicação" className="h-11" /><p className="text-xs text-muted-foreground">Separe por vírgula para calcular compatibilidade.</p></div>{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Oportunidade publicada.</p>}<Button type="submit" disabled={saving || !title.trim()}><Plus />{saving ? "Publicando..." : "Publicar oportunidade"}</Button></form>;
}