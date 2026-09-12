import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { getProfile, getPublishedEvents } from "@/lib/supabase/dal";
import { EventList } from "@/components/event-list";

export default async function StudentEventsPage() {
  const profile = await getProfile();
  const events = await getPublishedEvents(profile.id);
  return <div className="space-y-8 pb-10"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><CalendarDays className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Conecte-se</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Eventos</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Participe de encontros, workshops e experiências que movimentam sua trajetória.</p></div><EventList userId={profile.id} initialEvents={events} /></div>;
}