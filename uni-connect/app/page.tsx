import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Check, FolderKanban, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const steps = [
  { icon: BookOpen, title: "Aprenda", text: "Cursos e trilhas que fazem sentido para o seu momento." },
  { icon: FolderKanban, title: "Mostre o que faz", text: "Sua trajetória vira um registro vivo de competências." },
  { icon: Users, title: "Encontre seu lugar", text: "Pessoas, projetos e oportunidades para seguir em frente." },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="relative z-10 border-b border-border/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt="UniConnect"
              width={32}
              height={34}
              priority
            />
            <span className="text-lg font-semibold tracking-tight">
              UniConnect
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Entrar</Link>
            <Link href="/signup" className={buttonVariants()}>Criar conta <ArrowRight /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-28">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-6 text-xs font-semibold tracking-[0.24em] text-primary-foreground uppercase">Estude · Conecte · Conquiste</p>
            <h1 className="text-5xl leading-[1.04] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">A graduação termina. A conexão não.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground text-balance">O UniConnect acompanha sua trajetória acadêmica e transforma cada aprendizado em uma nova possibilidade.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/signup" className={buttonVariants({ size: "lg" })}>Começar minha trajetória <ArrowRight /></Link>
              <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>Já tenho conta</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="size-4 text-primary-foreground" /> Perfil que evolui com você</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-primary-foreground" /> Conexões relevantes</span>
            </div>
          </div>
          <div className="relative min-h-[390px] lg:min-h-[480px]">
            <div className="absolute inset-x-5 top-8 bottom-0 rounded-[2rem] bg-foreground sm:inset-x-12" />
            <div className="absolute top-0 right-0 w-[78%] rounded-2xl bg-background p-5 shadow-xl ring-1 ring-foreground/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-4"><div><p className="text-xs text-muted-foreground">Sua trajetória</p><p className="mt-1 font-semibold">Marina Alves</p></div><div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold">MA</div></div>
              <div className="mt-6 space-y-5"><div><div className="mb-2 flex justify-between text-xs"><span className="font-medium">Perfil completo</span><span className="text-muted-foreground">72%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[72%] rounded-full bg-primary" /></div></div><div className="rounded-xl bg-muted p-4"><div className="flex items-start gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-background"><Award className="size-4" /></div><div><p className="text-sm font-medium">Projeto adicionado</p><p className="mt-1 text-xs text-muted-foreground">App de impacto social · agora</p></div></div></div><div className="flex items-center gap-3 text-sm"><span className="flex size-8 items-center justify-center rounded-full bg-primary/20"><Users className="size-4" /></span><span><strong>12 novas conexões</strong><br /><span className="text-xs text-muted-foreground">na sua área de interesse</span></span></div></div>
            </div>
            <div className="absolute bottom-10 left-0 w-[68%] rounded-2xl bg-primary p-5 shadow-lg sm:bottom-14 sm:left-5 sm:p-6"><p className="text-xs font-semibold tracking-widest uppercase">Próximo passo</p><p className="mt-8 text-lg font-semibold">Descobrir uma oportunidade que combina com você.</p><ArrowRight className="mt-5 size-5" /></div>
            <div className="absolute -right-12 -bottom-24 size-72 rounded-full border-[42px] border-primary/15" />
          </div>
        </section>
        <section className="border-t border-border bg-muted/45"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div><p className="text-xs font-semibold tracking-[0.24em] text-primary-foreground uppercase">Um lugar para continuar</p><h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">O que você faz hoje constrói o seu amanhã.</h2></div><div className="grid gap-8 sm:grid-cols-3">{steps.map((step) => { const Icon = step.icon; return <div key={step.title} className="border-t border-foreground/20 pt-4"><Icon className="size-5" /><h3 className="mt-8 font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p></div>; })}</div></div></div></section>
      </main>
      <footer className="border-t border-border px-5 py-7 sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-muted-foreground"><span>UniConnect</span><span>Estude · Conecte · Conquiste</span></div></footer>
    </div>
  );
}
