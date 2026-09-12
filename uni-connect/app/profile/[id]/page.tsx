import { ArrowLeft, BriefcaseBusiness, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfile } from "@/lib/supabase/dal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function initials(name: string | null) { return (name ?? "Perfil").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPublicProfile(id);
  if (!data) notFound();
  const { profile, skills } = data;
  return <div className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6"><div className="mx-auto max-w-3xl"><Link href="/student/dashboard" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Voltar</Link><Card className="overflow-hidden"><div className="h-28 bg-foreground sm:h-36" /><CardHeader className="relative -mt-14 flex flex-col items-start gap-4 px-6 sm:-mt-16 sm:flex-row sm:items-end sm:px-8"><Avatar size="lg" className="size-24 border-4 border-background"><AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "Foto de perfil"} /><AvatarFallback className="text-xl">{initials(profile.full_name)}</AvatarFallback></Avatar><div className="pb-1"><Badge variant="secondary">{profile.role === "egresso" ? "Egresso" : "Estudante"}</Badge><CardTitle className="mt-2 text-2xl">{profile.full_name ?? "Perfil UniConnect"}</CardTitle></div></CardHeader><CardContent className="space-y-8 px-6 pb-8 sm:px-8"><div className="grid gap-4 border-b border-border pb-6 sm:grid-cols-2">{profile.course ? <div className="flex items-start gap-3"><GraduationCap className="mt-0.5 size-5 text-primary-foreground" /><div><p className="text-xs text-muted-foreground">Formação</p><p className="mt-1 text-sm font-medium">{profile.course}{profile.semester ? ` · ${profile.semester}º semestre` : ""}</p></div></div> : null}<div className="flex items-start gap-3"><BriefcaseBusiness className="mt-0.5 size-5 text-primary-foreground" /><div><p className="text-xs text-muted-foreground">Na UniConnect</p><p className="mt-1 text-sm font-medium">Construindo trajetória</p></div></div></div><div><CardTitle className="text-lg">Sobre</CardTitle><p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.bio ?? "Este perfil ainda está construindo sua apresentação."}</p></div><div><CardTitle className="text-lg">Competências</CardTitle><div className="mt-3 flex flex-wrap gap-2">{skills.length ? skills.map((skill) => <Badge key={skill.id} variant="outline" className="border-primary/50">{skill.name}</Badge>) : <p className="text-sm text-muted-foreground">Nenhuma competência adicionada ainda.</p>}</div></div><Link href={`mailto:?subject=Conexão no UniConnect&body=Olá, ${profile.full_name ?? ""}!`} className={buttonVariants({ variant: "outline" })}><Mail /> Entrar em contato</Link></CardContent></Card></div></div>;
}