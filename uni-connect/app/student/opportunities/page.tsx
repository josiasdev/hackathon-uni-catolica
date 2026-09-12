import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { getProfile, getPublishedOpportunities } from "@/lib/supabase/dal";
import { OpportunityList } from "@/components/opportunity-list";

export default async function StudentOpportunitiesPage() {
  const profile = await getProfile();
  const opportunities = await getPublishedOpportunities(profile.id);
  return <div className="space-y-8 pb-10"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><BriefcaseBusiness className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Próximo passo</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Oportunidades</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Descubra experiências que combinam com as competências que você já construiu.</p></div><OpportunityList userId={profile.id} initialOpportunities={opportunities} /></div>;
}