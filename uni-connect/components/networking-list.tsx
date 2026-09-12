"use client";

import { Check, GraduationCap, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Person = { id: string; full_name: string | null; role: string; course: string | null; avatar_url: string | null; connection: { id: string; status: string; requester_id: string; addressee_id: string } | null };

function initials(name: string | null) { return (name ?? "Perfil").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

export function NetworkingList({ userId, initialPeople }: { userId: string; initialPeople: Person[] }) {
  const [people, setPeople] = useState(initialPeople); const [loadingId, setLoadingId] = useState<string | null>(null);
  async function connect(personId: string) { setLoadingId(personId); const supabase = createClient(); const { data } = await supabase.from("connections").insert({ requester_id: userId, addressee_id: personId }).select("id, status, requester_id, addressee_id").single(); if (data) setPeople((current) => current.map((person) => person.id === personId ? { ...person, connection: data } : person)); setLoadingId(null); }
  return <div className="grid gap-4 md:grid-cols-2">{people.length ? people.map((person) => <Card key={person.id}><CardContent className="flex items-center gap-4 p-5"><Avatar size="lg"><AvatarImage src={person.avatar_url ?? undefined} alt={person.full_name ?? "Pessoa"} /><AvatarFallback>{initials(person.full_name)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate font-medium">{person.full_name ?? "Pessoa da comunidade"}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><GraduationCap className="size-3.5" /> {person.course ?? (person.role === "egresso" ? "Egresso" : "Estudante")}</p><a href={`/profile/${person.id}`} className="mt-2 inline-block text-xs font-medium underline decoration-primary underline-offset-4">Ver perfil</a></div>{person.connection ? <Badge variant="secondary"><Check /> {person.connection.status === "accepted" ? "Conectado" : "Pendente"}</Badge> : <Button size="sm" onClick={() => connect(person.id)} disabled={loadingId === person.id} aria-label={`Conectar com ${person.full_name ?? "pessoa"}`}><UserPlus />{loadingId === person.id ? "..." : "Conectar"}</Button>}</CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><Users className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Ainda não há pessoas para descobrir</p><p className="mt-1 text-sm text-muted-foreground">Novos perfis aparecerão aqui.</p></div>}</div>;
}