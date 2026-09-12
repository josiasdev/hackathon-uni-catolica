import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";
import { getDiscoverableProfiles, getProfile } from "@/lib/supabase/dal";
import { NetworkingList } from "@/components/networking-list";

export default async function StudentNetworkingPage() {
  const profile = await getProfile(); const people = await getDiscoverableProfiles(profile.id);
  return <div className="space-y-8 pb-10"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><Network className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Comunidade</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Networking</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Conheça pessoas que compartilham interesses, cursos e objetivos com você.</p></div><NetworkingList userId={profile.id} initialPeople={people} /></div>;
}