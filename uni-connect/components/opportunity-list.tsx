"use client";

import { ArrowRight, BriefcaseBusiness, CheckCircle2, MapPin, Percent } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Opportunity = { id: string; title: string; description: string | null; opportunity_type: string; modality: string; location: string | null; skills: { id: string; name: string }[]; application: { id: string; status: string } | null; compatibility: number };

export function OpportunityList({ userId, initialOpportunities }: { userId: string; initialOpportunities: Opportunity[] }) {
  const [items, setItems] = useState(initialOpportunities);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function apply(opportunityId: string) {
    setLoadingId(opportunityId);
    const supabase = createClient();
    const { data } = await supabase.from("applications").insert({ opportunity_id: opportunityId, user_id: userId }).select("id, status").single();
    if (data) setItems((current) => current.map((item) => item.id === opportunityId ? { ...item, application: data } : item));
    setLoadingId(null);
  }

  return <div className="grid gap-4 md:grid-cols-2">{items.length ? items.map((item) => <Card key={item.id} className="flex flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-muted"><BriefcaseBusiness className="size-5" /></div><Badge variant={item.compatibility >= 70 ? "default" : "outline"}><Percent className="size-3" /> {item.compatibility}% compatível</Badge></div><CardTitle className="mt-4 text-lg">{item.title}</CardTitle><div className="flex flex-wrap gap-2 text-xs text-muted-foreground"><span>{item.opportunity_type}</span><span>·</span><span>{item.modality}</span>{item.location ? <><span>·</span><span className="flex items-center gap-1"><MapPin className="size-3" />{item.location}</span></> : null}</div></CardHeader><CardContent className="flex flex-1 flex-col"><p className="flex-1 text-sm leading-6 text-muted-foreground">{item.description ?? "Uma oportunidade para desenvolver sua trajetória."}</p><div className="mt-4 flex flex-wrap gap-1.5">{item.skills.map((skill) => <Badge key={skill.id} variant="outline" className="text-[11px]">{skill.name}</Badge>)}</div><div className="mt-5 border-t border-border pt-4">{item.application ? <span className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Candidatura enviada</span> : <Button size="sm" onClick={() => apply(item.id)} disabled={loadingId === item.id}>{loadingId === item.id ? "Enviando..." : "Quero me candidatar"}<ArrowRight /></Button>}</div></CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nenhuma oportunidade publicada ainda</p><p className="mt-1 text-sm text-muted-foreground">Novas experiências aparecerão aqui.</p></div>}</div>;
}