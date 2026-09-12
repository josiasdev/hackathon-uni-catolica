import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMentorshipRequests, getMyMentorProfile, getProfile } from "@/lib/supabase/dal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MentorProfileForm } from "@/components/mentor-profile-form";
import { MentorRequests } from "@/components/mentor-requests";

export default async function ManageMentorshipPage() {
  const profile = await getProfile();
  if (profile.role !== "egresso" && profile.role !== "empresa") redirect("/student/mentorship");
  const [mentor, requests] = await Promise.all([getMyMentorProfile(profile.id), getMentorshipRequests(profile.id)]);
  return <div className="mx-auto max-w-3xl space-y-8 pb-10"><Link href="/student/mentorship" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Mentorias</Link><div><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><ShieldCheck className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Compartilhe experiência</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Oferecer mentoria</h1></div></div><p className="mt-4 text-muted-foreground">Configure sua disponibilidade e acompanhe quem pediu sua ajuda.</p></div><Card><CardHeader><CardTitle>Seu perfil de mentor</CardTitle><CardDescription>Você pode pausar novas solicitações a qualquer momento.</CardDescription></CardHeader><CardContent><MentorProfileForm userId={profile.id} initialProfile={mentor} /></CardContent></Card><MentorRequests initialRequests={requests} /></div>;
}