import { ArrowLeft, FolderKanban } from "lucide-react";
import Link from "next/link";
import { getProfile, getPublishedProjects } from "@/lib/supabase/dal";
import { ProjectSections } from "@/components/project-sections";

export default async function StudentProjectsPage() {
  const profile = await getProfile();
  const projects = await getPublishedProjects(profile.id);
  return <div className="space-y-8 pb-10"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><FolderKanban className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Colabore</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Projetos</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Encontre uma equipe, aplique suas competências e construa algo que importa.</p></div><ProjectSections userId={profile.id} institutionId={profile.institution_id} projects={projects} /></div>;
}