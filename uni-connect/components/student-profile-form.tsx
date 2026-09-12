"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  course: string | null;
  semester: number | null;
  avatar_url?: string | null;
};

export function StudentProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [course, setCourse] = useState(profile.course ?? "");
  const [semester, setSemester] = useState(profile.semester?.toString() ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    let avatarUrl = profile.avatar_url ?? null;
    if (avatarFile) {
      const extension = avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${profile.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
      if (uploadError) { setError("Não foi possível enviar sua foto. Tente outra imagem."); setSaving(false); return; }
      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = `${publicUrl.publicUrl}?v=${Date.now()}`;
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        course: course.trim() || null,
        semester: semester ? Number(semester) : null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id);

    if (updateError) {
      setError("Não foi possível salvar seu perfil. Tente novamente.");
      setSaving(false);
      return;
    }

    if (fullName.trim() && course.trim() && semester && bio.trim()) {
      await supabase.rpc("award_xp", { points: 25, xp_reason: "Perfil acadêmico completo", xp_source_type: "profile_completed", xp_source_id: profile.id });
      const { data: achievement } = await supabase.from("achievements").select("id, xp_reward").eq("key", "profile_complete").single();
      if (achievement) { const { data: unlocked } = await supabase.from("user_achievements").insert({ user_id: profile.id, achievement_id: achievement.id }).select("id").single(); if (unlocked && achievement.xp_reward > 0) await supabase.rpc("award_xp", { points: achievement.xp_reward, xp_reason: "Conquista: Perfil completo", xp_source_type: "achievement", xp_source_id: achievement.id }); }
    }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex items-center gap-4 sm:col-span-2"><Avatar size="lg" className="size-16 border-2 border-primary"><AvatarImage src={avatarPreview || undefined} alt="Prévia da foto de perfil" /><AvatarFallback>{fullName.slice(0, 2).toUpperCase() || "EU"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 space-y-2"><Label htmlFor="avatar">Foto de perfil</Label><Input id="avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0] ?? null; setAvatarFile(file); if (file) setAvatarPreview(URL.createObjectURL(file)); }} className="h-11 pt-2" /><p className="text-xs text-muted-foreground">Escolha uma imagem para aparecer no seu perfil público.</p></div></div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input id="full_name" required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Como você quer ser encontrado?" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Curso</Label>
          <Input id="course" value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Ex.: Sistemas de Informação" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semestre atual</Label>
          <Input id="semester" type="number" min="1" max="20" value={semester} onChange={(event) => setSemester(event.target.value)} placeholder="Ex.: 4" className="h-11" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bio">Sobre você</Label>
          <Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Conte um pouco sobre seus interesses, projetos e onde quer chegar." className="min-h-32" maxLength={500} />
          <p className="text-xs text-muted-foreground">Uma apresentação curta ajuda nas conexões certas.</p>
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Perfil atualizado.</p>}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={saving}><Save />{saving ? "Salvando..." : "Salvar perfil"}</Button>
        <Link href="/student/dashboard" className={buttonVariants({ variant: "ghost" })}><ArrowLeft /> Voltar ao dashboard</Link>
      </div>
    </form>
  );
}