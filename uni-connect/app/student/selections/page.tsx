import { ArrowLeft, ListChecks } from "lucide-react";
import Link from "next/link";
import { getProfile, getPublishedSelections } from "@/lib/supabase/dal";
import { SelectionList } from "@/components/selection-list";

export default async function StudentSelectionsPage() {
  const profile = await getProfile(); const selections = await getPublishedSelections(profile.id);
  return <div className="space-y-8 pb-10"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><ListChecks className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Acompanhe</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Seleções</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Inscreva-se e acompanhe cada etapa dos processos que combinam com você.</p></div><SelectionList userId={profile.id} initialSelections={selections} /></div>;
}