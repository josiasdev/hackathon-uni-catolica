import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/lib/supabase/dal";
import { getPublishedCourses } from "@/lib/supabase/dal";
import { buttonVariants } from "@/components/ui/button";
import { CourseCatalog } from "@/components/course-catalog";

export default async function StudentCoursesPage() {
  const profile = await getProfile();
  const courses = await getPublishedCourses(profile.id);

  return <div className="space-y-8 pb-10"><div className="flex items-start justify-between gap-4"><div><Link href="/student/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary"><GraduationCap className="size-6" /></div><div><p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Academia</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Cursos e trilhas</h1></div></div><p className="mt-4 max-w-xl text-muted-foreground">Escolha um próximo passo e transforme aprendizado em trajetória.</p></div><Link href="/student/profile" className={buttonVariants({ variant: "outline" })}>Minhas competências</Link></div><CourseCatalog userId={profile.id} initialCourses={courses} /></div>;
}