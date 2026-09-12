import { ArrowRight, CircleUserRound } from "lucide-react";
import { getProfile, getProfileSkills, getUserXp } from "@/lib/supabase/dal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProfileForm } from "@/components/student-profile-form";
import { SkillsManager } from "@/components/skills-manager";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { XpProgress } from "@/components/xp-progress";

export default async function StudentProfilePage() {
  const profile = await getProfile();
  const [skills, xp] = await Promise.all([getProfileSkills(profile.id), getUserXp(profile.id)]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-10">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary"><CircleUserRound className="size-6" /></div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Seu ponto de partida</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Monte seu perfil</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Essas informações dão contexto para sua trajetória e ajudam a encontrar conexões mais relevantes.</p>
        </div>
      </div>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informações acadêmicas</CardTitle>
          <CardDescription>Você pode atualizar esses dados sempre que sua jornada mudar.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6"><StudentProfileForm profile={profile} /></CardContent>
      </Card>
      <XpProgress xp={xp} />
      <Card>
        <CardHeader className="border-b"><CardTitle>Competências</CardTitle><CardDescription>Registre o que você já sabe fazer e continue construindo seu repertório.</CardDescription></CardHeader>
        <CardContent className="pt-6"><SkillsManager userId={profile.id} initialSkills={skills} /></CardContent>
      </Card>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowRight className="size-4 text-primary-foreground" /> Próximas etapas: competências, trajetória e conquistas.</div>
      <Link href={`/profile/${profile.id}`} className={buttonVariants({ variant: "outline" })}>Ver meu perfil público <ArrowRight /></Link>
    </div>
  );
}