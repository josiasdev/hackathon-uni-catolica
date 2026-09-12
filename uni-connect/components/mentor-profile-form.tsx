"use client";

import { CheckCircle2, HandHeart, Save } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MentorProfile = { id: string; headline: string; expertise: string[]; availability: string | null; accepting_requests: boolean } | null;

export function MentorProfileForm({ userId, initialProfile }: { userId: string; initialProfile: MentorProfile }) {
  const [headline, setHeadline] = useState(initialProfile?.headline ?? "");
  const [expertise, setExpertise] = useState(initialProfile?.expertise.join(", ") ?? "");
  const [availability, setAvailability] = useState(initialProfile?.availability ?? "");
  const [accepting, setAccepting] = useState(initialProfile?.accepting_requests ?? true);
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState<string | null>(null);
  async function save(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setSaved(false); setError(null); const supabase = createClient(); const payload = { user_id: userId, headline: headline.trim(), expertise: expertise.split(",").map((item) => item.trim()).filter(Boolean), availability: availability.trim() || null, accepting_requests: accepting }; const { error: saveError } = await supabase.from("mentor_profiles").upsert(payload, { onConflict: "user_id" }); if (saveError) setError("Não foi possível salvar seu perfil de mentor."); else setSaved(true); setSaving(false); }
  return <form onSubmit={save} className="space-y-5"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary"><HandHeart className="size-5" /></div><div><p className="font-medium">Ofereça sua experiência</p><p className="text-xs text-muted-foreground">Ajude alguém a dar o próximo passo.</p></div></div><div className="space-y-2"><Label htmlFor="mentor-headline">Como você pode ajudar?</Label><Input id="mentor-headline" required value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Ex.: Desenvolvedor e mentor de carreira" className="h-11" /></div><div className="space-y-2"><Label htmlFor="mentor-expertise">Temas e competências</Label><Input id="mentor-expertise" value={expertise} onChange={(event) => setExpertise(event.target.value)} placeholder="Frontend, carreira, portfólio" className="h-11" /><p className="text-xs text-muted-foreground">Separe os temas por vírgula.</p></div><div className="space-y-2"><Label htmlFor="mentor-availability">Disponibilidade</Label><Input id="mentor-availability" value={availability} onChange={(event) => setAvailability(event.target.value)} placeholder="Ex.: 1 conversa por semana" className="h-11" /></div><label className="flex items-start gap-3 rounded-xl bg-muted p-3 text-sm"><input type="checkbox" checked={accepting} onChange={(event) => setAccepting(event.target.checked)} className="mt-0.5 size-4 accent-primary" /><span><strong>Aceitar novas solicitações</strong><br /><span className="text-xs text-muted-foreground">Seu perfil aparecerá para estudantes.</span></span></label>{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Perfil de mentor salvo.</p>}<Button type="submit" disabled={saving || !headline.trim()}><Save />{saving ? "Salvando..." : "Salvar disponibilidade"}</Button></form>;
}