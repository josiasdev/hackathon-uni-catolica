"use client";

import { Check, CheckCircle2, Clock3, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Request = { id: string; status: string; message: string | null; created_at: string; mentee: { full_name: string | null; course: string | null } | null };

export function MentorRequests({ initialRequests }: { initialRequests: Request[] }) {
  const [requests, setRequests] = useState(initialRequests); const [loadingId, setLoadingId] = useState<string | null>(null);
  async function updateRequest(id: string, status: "accepted" | "declined" | "completed") { setLoadingId(id); const supabase = createClient(); const { data } = await supabase.from("mentorship_requests").update({ status }).eq("id", id).select("id, status").single(); if (data) setRequests((current) => current.map((request) => request.id === id ? { ...request, status: data.status } : request)); setLoadingId(null); }
  return <Card><CardHeader><CardTitle className="text-lg">Solicitações recebidas</CardTitle></CardHeader><CardContent className="space-y-3">{requests.length ? requests.map((request) => <div key={request.id} className="rounded-xl bg-muted p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{request.mentee?.full_name ?? "Estudante"}</p><p className="text-xs text-muted-foreground">{request.mentee?.course ?? "Estudante da comunidade"}</p></div><Badge variant={request.status === "accepted" ? "default" : "secondary"}>{request.status === "pending" ? "Pendente" : request.status === "accepted" ? "Aceita" : request.status === "completed" ? "Concluída" : "Recusada"}</Badge></div>{request.message ? <p className="mt-3 text-sm leading-5 text-muted-foreground">“{request.message}”</p> : null}{request.status === "pending" ? <div className="mt-4 flex gap-2"><Button size="sm" onClick={() => updateRequest(request.id, "accepted")} disabled={loadingId === request.id}><Check /> Aceitar</Button><Button size="sm" variant="outline" onClick={() => updateRequest(request.id, "declined")} disabled={loadingId === request.id}><X /> Recusar</Button></div> : request.status === "accepted" ? <Button size="sm" variant="outline" className="mt-4" onClick={() => updateRequest(request.id, "completed")} disabled={loadingId === request.id}><CheckCircle2 /> Marcar como concluída</Button> : null}</div>) : <div className="py-8 text-center"><Clock3 className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Nenhuma solicitação ainda</p><p className="mt-1 text-xs text-muted-foreground">Quando alguém pedir mentoria, aparecerá aqui.</p></div>}</CardContent></Card>;
}