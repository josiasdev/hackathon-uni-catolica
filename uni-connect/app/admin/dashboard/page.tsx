import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { getInstitutionCourses, getOwnedEvents, getOwnedOpportunities, getOwnedProjects, getOwnedSelections, getProfile } from "@/lib/supabase/dal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/components/course-form";
import { EventForm } from "@/components/event-form";
import { OpportunityForm } from "@/components/opportunity-form";
import { ProjectForm } from "@/components/project-form";
import { SelectionForm } from "@/components/selection-form";

export default async function AdminDashboardPage() {
  const profile = await getProfile();
  const [courses, opportunities, projects, events, selections] = await Promise.all([
    getInstitutionCourses(profile.id),
    getOwnedOpportunities(profile.id),
    getOwnedProjects(profile.id),
    getOwnedEvents(profile.id),
    getOwnedSelections(profile.id),
  ]);
  const firstName = profile.full_name?.split(" ")[0] ?? "gestor";
  const publishedCount = [...courses, ...opportunities, ...projects, ...events, ...selections].filter((item) => item.published).length;

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-8 text-background shadow-sm sm:px-8">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-5 bg-primary text-primary-foreground hover:bg-primary"><BarChart3 /> Central de gestão</Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Olá, {firstName}. Faça a comunidade avançar.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-background/70 sm:text-base">Publique oportunidades, organize experiências e acompanhe tudo que sua instituição está movimentando.</p>
          <Link href="#acoes" className={`${buttonVariants()} mt-6`}>Criar uma publicação <ArrowUpRight /></Link>
        </div>
        <div className="pointer-events-none absolute -right-12 -bottom-20 size-64 rounded-full border-32 border-primary/20 sm:size-80" />
        <div className="pointer-events-none absolute -right-4 -bottom-12 size-44 rounded-full border-16 border-primary sm:size-56" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo institucional">
        {[{ icon: BookOpen, value: courses.length, label: "Cursos publicados", href: "#academia" }, { icon: BriefcaseBusiness, value: opportunities.length, label: "Oportunidades", href: "#oportunidades" }, { icon: FolderKanban, value: projects.length, label: "Projetos abertos", href: "#projetos" }, { icon: CalendarDays, value: events.length, label: "Eventos", href: "#eventos" }].map(({ icon: Icon, value, label, href }) => <Link key={label} href={`/admin/dashboard${href}`}><Card size="sm" className="transition-transform hover:-translate-y-0.5"><CardContent className="flex items-center gap-4 pt-3"><div className="flex size-10 items-center justify-center rounded-xl bg-muted"><Icon className="size-5" /></div><div><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card></Link>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="border-b"><CardTitle className="flex items-center gap-2 text-lg"><Activity className="size-5" /> Pulso da plataforma</CardTitle><CardDescription>Uma leitura rápida do que sua área já colocou em movimento.</CardDescription></CardHeader>
          <CardContent className="space-y-5 pt-5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Publicações ativas</span><strong>{publishedCount}</strong></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[68%] rounded-full bg-primary" /></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">Cursos</p><p className="mt-1 font-semibold">{courses.length}</p></div><div className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">Seleções</p><p className="mt-1 font-semibold">{selections.length}</p></div><div className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">Eventos</p><p className="mt-1 font-semibold">{events.length}</p></div></div></CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-lg">Próximo passo</CardTitle><CardDescription>Escolha uma frente para movimentar hoje.</CardDescription></CardHeader><CardContent><div className="rounded-xl bg-primary p-4"><Plus className="size-5" /><p className="mt-6 font-semibold">Publique algo útil para a comunidade.</p><p className="mt-1 text-sm leading-5 text-primary-foreground/75">Uma oportunidade, um projeto ou um evento já pode gerar novas conexões.</p><Link href="#acoes" className={`${buttonVariants({ variant: "outline" })} mt-5 border-foreground/20 bg-background/80`}>Ver ações <ChevronRight /></Link></div></CardContent></Card>
      </section>

      <section id="acoes" className="scroll-mt-24"><div className="mb-4"><p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Ações</p><h2 className="mt-1 text-xl font-semibold">Crie e publique</h2><p className="mt-1 text-sm text-muted-foreground">Cada módulo tem um papel diferente na jornada dos estudantes.</p></div><div className="grid gap-6 lg:grid-cols-2">
        <Card id="oportunidades"><CardHeader><CardTitle className="text-lg">Publicar oportunidade</CardTitle><CardDescription>Abra uma experiência para estudantes e egressos.</CardDescription></CardHeader><CardContent><OpportunityForm creatorId={profile.id} institutionId={profile.institution_id} /></CardContent></Card>
        <Card id="projetos"><CardHeader><CardTitle className="text-lg">Publicar projeto</CardTitle><CardDescription>Monte uma equipe para um desafio real.</CardDescription></CardHeader><CardContent><ProjectForm creatorId={profile.id} institutionId={profile.institution_id} /></CardContent></Card>
        <Card id="eventos"><CardHeader><CardTitle className="text-lg">Publicar evento</CardTitle><CardDescription>Crie um encontro para a comunidade.</CardDescription></CardHeader><CardContent><EventForm creatorId={profile.id} institutionId={profile.institution_id} /></CardContent></Card>
        <Card id="selecoes"><CardHeader><CardTitle className="text-lg">Publicar seleção</CardTitle><CardDescription>Crie um processo com etapas claras.</CardDescription></CardHeader><CardContent><SelectionForm creatorId={profile.id} institutionId={profile.institution_id} /></CardContent></Card>
        {profile.role === "instituicao" ? <Card id="academia" className="lg:col-span-2"><CardHeader><CardTitle className="text-lg">Publicar curso</CardTitle><CardDescription>Construa o catálogo de aprendizagem da instituição.</CardDescription></CardHeader><CardContent><CourseForm creatorId={profile.id} institutionId={profile.institution_id} /></CardContent></Card> : null}
      </div></section>

      <section><div className="mb-4"><p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Atividade recente</p><h2 className="mt-1 text-xl font-semibold">Suas publicações</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[...opportunities.map((item) => ({ ...item, kind: "Oportunidade" })), ...projects.map((item) => ({ ...item, kind: "Projeto" })), ...events.map((item) => ({ ...item, kind: "Evento" }))].slice(0, 6).map((item) => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><CheckCircle2 className="size-5 shrink-0 text-primary-foreground" /><div className="min-w-0"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.kind} · {item.published ? "Publicado" : "Rascunho"}</p></div></div>)}</div></section>
    </div>
  );
}
