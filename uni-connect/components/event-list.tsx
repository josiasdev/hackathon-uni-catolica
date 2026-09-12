"use client";

import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventItem = { id: string; title: string; description: string | null; event_type: string; starts_at: string; modality: string; location: string | null; registration: { id: string; status: string } | null };

function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export function EventList({ userId, initialEvents }: { userId: string; initialEvents: EventItem[] }) {
  const [events, setEvents] = useState(initialEvents); const [loadingId, setLoadingId] = useState<string | null>(null);
  async function register(eventId: string) { setLoadingId(eventId); const supabase = createClient(); const { data } = await supabase.from("event_registrations").insert({ event_id: eventId, user_id: userId }).select("id, status").single(); if (data) setEvents((current) => current.map((item) => item.id === eventId ? { ...item, registration: data } : item)); setLoadingId(null); }
  return <div className="grid gap-4 md:grid-cols-2">{events.length ? events.map((event) => <Card key={event.id} className="flex flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-muted"><CalendarDays className="size-5" /></div><Badge variant="outline">{event.event_type}</Badge></div><CardTitle className="mt-4 text-lg">{event.title}</CardTitle><p className="text-sm text-muted-foreground">{formatDate(event.starts_at)}</p></CardHeader><CardContent className="flex flex-1 flex-col"><p className="flex-1 text-sm leading-6 text-muted-foreground">{event.description ?? "Uma experiência para aprender e se conectar."}</p><div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>{event.modality}</span>{event.location ? <span className="flex items-center gap-1"><MapPin className="size-3.5" />{event.location}</span> : null}</div><div className="mt-5 border-t border-border pt-4">{event.registration ? <span className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Inscrição confirmada</span> : <Button size="sm" onClick={() => register(event.id)} disabled={loadingId === event.id}>{loadingId === event.id ? "Inscrevendo..." : "Participar"}</Button>}</div></CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><CalendarDays className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nenhum evento publicado ainda</p><p className="mt-1 text-sm text-muted-foreground">Novos encontros aparecerão aqui.</p></div>}</div>;
}