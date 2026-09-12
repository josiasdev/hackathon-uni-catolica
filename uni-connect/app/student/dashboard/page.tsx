import { getStudentDashboardData } from "@/lib/supabase/dal";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FolderKanban,
  GraduationCap,
  BadgeCheck,
  Network,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { XpProgress } from "@/components/xp-progress";

const modules = [
  {
    title: "Cursos e trilhas",
    description: "Aprenda no seu ritmo e construa novas competências.",
    icon: BookOpen,
    href: "/student/courses",
  },
  {
    title: "Oportunidades",
    description: "Encontre projetos, estágios e experiências para começar.",
    icon: BriefcaseBusiness,
    href: "/student/opportunities",
  },
  {
    title: "Projetos",
    description: "Encontre uma equipe e construa algo que importa.",
    icon: FolderKanban,
    href: "/student/projects",
  },
  {
    title: "Eventos",
    description: "Participe de encontros e experiências da comunidade.",
    icon: CalendarDays,
    href: "/student/events",
  },
  {
    title: "Networking",
    description: "Conecte-se com pessoas que compartilham seus objetivos.",
    icon: Network,
    href: "/student/networking",
  },
];

function getInitials(name: string | null) {
  return (name ?? "Aluno")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function StudentDashboardPage() {
  const { profile, skills, events, courses, certifications, stats } = await getStudentDashboardData();
  const firstName = profile.full_name?.split(" ")[0] ?? "estudante";
  const profileReady = stats.profileProgress === 100;

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-8 text-background shadow-sm sm:px-8">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-5 bg-primary text-primary-foreground hover:bg-primary">
            <GraduationCap />
            Seu espaço de crescimento
          </Badge>
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Olá, {firstName}. Sua próxima conquista começa aqui.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-background/70 sm:text-base">
            {profileReady
              ? "Seu perfil está pronto para novas conexões. Continue construindo sua trajetória."
              : "Organize sua trajetória, descubra novas oportunidades e deixe seu perfil pronto para as conexões certas."}
          </p>
            <Link href={profileReady ? "/student/courses" : "/student/profile"} className={`${buttonVariants()} mt-6`}>
              {profileReady ? "Explorar cursos" : "Completar meu perfil"}
              <ArrowUpRight />
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-12 -bottom-20 size-64 rounded-full border-32 border-primary/20 sm:size-80" />
        <div className="pointer-events-none absolute -right-4 -bottom-12 size-44 rounded-full border-16 border-primary sm:size-56" />
      </section>

      <XpProgress xp={stats.xp} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo da jornada">
        <Card size="sm">
          <CardContent className="flex items-center gap-4 pt-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary-foreground">
              <CircleUserRound className="size-5 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.profileProgress}%</p>
              <p className="text-xs text-muted-foreground">Perfil completo</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-4 pt-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.enrolledCourses}</p>
              <p className="text-xs text-muted-foreground">Cursos em andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-4 pt-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{certifications.length}</p>
              <p className="text-xs text-muted-foreground">Certificações</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-4 pt-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{skills.length}</p>
              <p className="text-xs text-muted-foreground">Competências</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card id="perfil">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Construa sua trajetória</CardTitle>
                <CardDescription className="mt-1">
                  Um perfil completo abre portas para melhores conexões.
                </CardDescription>
              </div>
              <Avatar size="lg" className="border-2 border-primary">
                <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{profileReady ? "Seu perfil está completo" : "Complete seu perfil"}</span>
              <span className="font-semibold">{stats.profileProgress}%</span>
            </div>
            <Progress value={stats.profileProgress} aria-label={`Perfil completo em ${stats.profileProgress}%`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-muted p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-foreground" />
                <div>
                  <p className="text-sm font-medium">Conta criada</p>
                  <p className="text-xs text-muted-foreground">Seu acesso já está pronto.</p>
                </div>
              </div>
              <div className={`flex items-start gap-3 rounded-xl p-3 ${profileReady ? "bg-muted" : "border border-dashed border-primary/50"}`}>
                {profileReady ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-foreground" /> : <CircleUserRound className="mt-0.5 size-4 shrink-0 text-primary-foreground" />}
                <div>
                  <p className="text-sm font-medium">{profileReady ? "Perfil preenchido" : "Adicione sua formação"}</p>
                  <p className="text-xs text-muted-foreground">{profileReady ? "Tudo pronto para avançar." : "Curso, semestre e bio."}</p>
                </div>
              </div>
            </div>
            <Link href={`/profile/${profile.id}`} className={buttonVariants({ variant: "outline" })}>
                Ver meu perfil
                <ChevronRight />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximo passo</CardTitle>
            <CardDescription>Comece deixando sua história visível.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-primary p-4 text-primary-foreground">
              <GraduationCap className="size-6" />
              <h3 className="mt-8 font-semibold">Conte onde você quer chegar</h3>
              <p className="mt-1 text-sm leading-5 text-primary-foreground/75">
                Sua formação ajuda a UniConnect a encontrar conteúdos e pessoas
                mais relevantes para você.
              </p>
              <Link
                href="/student/profile"
                className={`${buttonVariants({ variant: "outline" })} mt-5 border-foreground/20 bg-background/80`}
              >
                Adicionar formação
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-4"><p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Conquistas</p><h2 className="mt-1 text-xl font-semibold">O que você já construiu</h2></div>
        <div className="grid gap-4 md:grid-cols-3">{certifications.length ? certifications.slice(0, 3).map((certification) => <Card key={certification.id}><CardContent className="flex items-start gap-4 p-5"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary"><Award className="size-5" /></div><div><p className="font-medium">{(certification.courses as unknown as { title: string } | null)?.title ?? "Certificação concluída"}</p><p className="mt-1 text-xs text-muted-foreground">Emitida em {formatDate(certification.issued_at)}</p><p className="mt-3 font-mono text-[11px] text-muted-foreground">{certification.verification_code}</p></div></CardContent></Card>) : <Card className="md:col-span-3"><CardContent className="p-6"><p className="font-medium">Sua primeira certificação está a caminho.</p><p className="mt-1 text-sm text-muted-foreground">Conclua um curso para registrar essa conquista na sua trajetória.</p></CardContent></Card>}</div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Academia</p>
            <h2 className="mt-1 text-xl font-semibold">Continue aprendendo</h2>
          </div>
          <Link href="/student/courses" className={`${buttonVariants({ variant: "link" })} px-0`}>Ver catálogo <ChevronRight /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {courses.filter((course) => !course.enrollment || course.enrollment.status !== "completed").slice(0, 3).map((course) => (
            <Link href="/student/courses" key={course.id} className="group">
              <Card className="h-full transition-transform group-hover:-translate-y-1">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-center justify-between gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><BookOpen className="size-4" /></div>{course.enrollment ? <Badge variant="secondary">Em andamento</Badge> : <Badge variant="outline">Disponível</Badge>}</div>
                  <h3 className="mt-5 font-medium">{course.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-5 text-muted-foreground">{course.description ?? "Desenvolva uma nova competência para sua trajetória."}</p>
                  <span className="mt-5 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> {course.workload_hours ? `${course.workload_hours} horas` : "Carga livre"}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
          {!courses.filter((course) => !course.enrollment || course.enrollment.status !== "completed").length && <Card className="md:col-span-3"><CardContent className="flex items-center gap-4 p-6"><CheckCircle2 className="size-6 text-emerald-600" /><div><p className="font-medium">Você concluiu todos os cursos disponíveis.</p><p className="text-sm text-muted-foreground">Volte ao catálogo para acompanhar novidades.</p></div></CardContent></Card>}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Suas competências</CardTitle><CardDescription>O que já faz parte do seu repertório.</CardDescription></CardHeader>
          <CardContent><div className="flex flex-wrap gap-2">{skills.length ? skills.map((skill) => <Badge key={skill.id} variant="outline" className="border-primary/50">{skill.name}</Badge>) : <p className="text-sm text-muted-foreground">Adicione suas primeiras competências no perfil.</p>}</div><Link href="/student/profile" className={`${buttonVariants({ variant: "link" })} mt-4 px-0`}>Gerenciar competências <ChevronRight /></Link></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Sua trajetória</CardTitle><CardDescription>Os passos que você já registrou na UniConnect.</CardDescription></CardHeader>
          <CardContent>{events.length ? <div className="space-y-4">{events.map((event) => <div key={event.id} className="flex gap-3"><div className="mt-1 size-2 shrink-0 rounded-full bg-primary" /><div><p className="text-sm font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{event.description}</p><time className="mt-1 block text-[11px] text-muted-foreground" dateTime={event.occurred_at}>{formatDate(event.occurred_at)}</time></div></div>)}</div> : <p className="text-sm text-muted-foreground">Sua trajetória começa quando você registra uma competência, curso ou projeto.</p>}</CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Explore</p>
            <h2 className="mt-1 text-xl font-semibold">O que você pode fazer agora</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.title} href={module.href} className="group">
                <Card className="h-full transition-transform group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-6 font-medium">{module.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-5 text-muted-foreground">{module.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">
                      {module.href === "/student/opportunities" ? "Ver oportunidades" : module.href === "/student/projects" ? "Ver projetos" : "Em breve"} <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
