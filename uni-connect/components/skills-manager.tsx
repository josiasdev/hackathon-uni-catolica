"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Skill = { id: string; name: string };

export function SkillsManager({ userId, initialSkills }: { userId: string; initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addSkill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName || skills.some((skill) => skill.name.toLowerCase() === normalizedName.toLowerCase())) return;

    setSaving(true);
    setError(null);
    const supabase = createClient();
    let { data: skill } = await supabase.from("skills").select("id, name").ilike("name", normalizedName).maybeSingle();

    if (!skill) {
      const result = await supabase.from("skills").insert({ name: normalizedName }).select("id, name").single();
      skill = result.data;
    }

    if (!skill) {
      setError("Não foi possível adicionar essa competência.");
      setSaving(false);
      return;
    }

    const { error: linkError } = await supabase.from("user_skills").insert({ user_id: userId, skill_id: skill.id, origin_type: "manual", origin_id: null });
    if (linkError) {
      setError("Essa competência já foi adicionada ou não está disponível.");
      setSaving(false);
      return;
    }

    await supabase.from("trajectory_events").insert({ user_id: userId, type: "skill_added", title: `Competência adicionada: ${skill.name}`, description: "Adicionada manualmente ao perfil.", origin_id: null });
    await supabase.rpc("award_xp", { points: 10, xp_reason: `Competência adicionada: ${skill.name}`, xp_source_type: "skill_added", xp_source_id: skill.id });
    const { data: achievement } = await supabase.from("achievements").select("id, xp_reward").eq("key", "first_skill").single();
    if (achievement) { const { data: unlocked } = await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: achievement.id }).select("id").single(); if (unlocked && achievement.xp_reward > 0) await supabase.rpc("award_xp", { points: achievement.xp_reward, xp_reason: "Conquista: Primeira competência", xp_source_type: "achievement", xp_source_id: achievement.id }); }
    setSkills((current) => [{ id: skill!.id, name: skill!.name }, ...current]);
    setName("");
    setSaving(false);
  }

  async function removeSkill(skillId: string) {
    const supabase = createClient();
    await supabase.from("user_skills").delete().eq("id", skillId).eq("user_id", userId);
    setSkills((current) => current.filter((skill) => skill.id !== skillId));
  }

  return (
    <div className="space-y-4">
      <div><Label htmlFor="skill">Adicionar competência</Label><p className="mt-1 text-xs text-muted-foreground">Inclua tecnologias, ferramentas ou áreas que você domina.</p></div>
      <form onSubmit={addSkill} className="flex gap-2"><Input id="skill" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: React, pesquisa, liderança" className="h-10" /><Button type="submit" size="icon" disabled={saving || !name.trim()} aria-label="Adicionar competência"><Plus /></Button></form>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">{skills.length ? skills.map((skill) => <Badge key={skill.id} variant="outline" className="h-8 gap-2 border-primary/50 px-3">{skill.name}<button type="button" onClick={() => removeSkill(skill.id)} className="rounded-full hover:text-destructive" aria-label={`Remover ${skill.name}`}><X className="size-3" /></button></Badge>) : <p className="text-sm text-muted-foreground">Suas competências aparecerão aqui.</p>}</div>
    </div>
  );
}