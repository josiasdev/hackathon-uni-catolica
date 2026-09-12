"use client";

import { CheckCircle2, HandHeart, Send } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mentor = { id: string; user_id: string; headline: string; expertise: string[]; availability: string | null; profile: { full_name: string | null; avatar_url: string | null } | null; request: { id: string; status: string } | null };

function initials(name: string | null) { return (name ?? "Mentor").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

export function MentorList({ userId, initialMentors }: { userId: string; initialMentors: Mentor[] }) {
  const [mentors, setMentors] = useState(initialMentors); const [message, setMessage] = useState<Record<string, string>>({}); const [loadingId, setLoadingId] = useState<string | null>(null);
  async function requestMentorship(mentor: Mentor) { setLoadingId(mentor.id); const supabase = createClient(); const { data } = await supabase.from("mentorship_requests").insert({ mentor_id: mentor.id, mentee_id: userId, message: message[mentor.id]?.trim() || null }).select("id, status").single(); if (data) setMentors((current) => current.map((item) => item.id === mentor.id ? { ...item, request: data } : item)); setLoadingId(null); }
  return <div className="grid gap-4 md:grid-cols-2">{mentors.length ? mentors.map((mentor) => <Card key={mentor.id}><CardHeader><div className="flex items-start gap-3"><Avatar size="lg"><AvatarImage src={mentor.profile?.avatar_url ?? undefined} alt={mentor.profile?.full_name ?? "Mentor"} /><AvatarFallback>{initials(mentor.profile?.full_name ?? null)}</AvatarFallback></Avatar><div><CardTitle className="text-lg">{mentor.profile?.full_name ?? "Mentor da comunidade"}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{mentor.headline}</p></div></div></CardHeader><CardContent><div className="flex flex-wrap gap-1.5">{mentor.expertise.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}</div>{mentor.availability ? <p className="mt-3 text-xs text-muted-foreground">Disponibilidade: {mentor.availability}</p> : null}{mentor.request ? <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Solicitação {mentor.request.status === "accepted" ? "aceita" : "enviada"}</p> : <div className="mt-5 space-y-2"><Textarea value={message[mentor.id] ?? ""} onChange={(event) => setMessage((current) => ({ ...current, [mentor.id]: event.target.value }))} placeholder="Por que você quer conversar com essa pessoa?" className="min-h-20" /><Button size="sm" onClick={() => requestMentorship(mentor)} disabled={loadingId === mentor.id}><Send />{loadingId === mentor.id ? "Enviando..." : "Pedir mentoria"}</Button></div>}</CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><HandHeart className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nenhum mentor disponível ainda</p><p className="mt-1 text-sm text-muted-foreground">Novos mentores aparecerão aqui.</p></div>}</div>;
}