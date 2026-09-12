"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  HandHeart,
  CircleUserRound,
  Compass,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Network,
  Route,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const navigation = [
  { label: "Visão geral", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Cursos e trilhas", href: "/student/courses", icon: BookOpen },
  { label: "Oportunidades", href: "/student/opportunities", icon: BriefcaseBusiness },
  { label: "Projetos", href: "/student/projects", icon: FolderKanban },
  { label: "Eventos", href: "/student/events", icon: CalendarDays },
  { label: "Seleções", href: "/student/selections", icon: ListChecks },
  { label: "Networking", href: "/student/networking", icon: Network },
  { label: "Mentorias", href: "/student/mentorship", icon: HandHeart },
  { label: "Minha trajetória", href: "/student/trajectory", icon: Route },
  { label: "Meu perfil", href: "/student/profile", icon: CircleUserRound },
];

const comingSoon: { label: string; icon: typeof Route }[] = [];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-background lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:border-r lg:pr-5">
      <div className="mb-5 hidden items-center gap-3 px-3 lg:flex">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Minha jornada</p>
          <p className="text-xs text-muted-foreground">Área do estudante</p>
        </div>
      </div>

      <nav aria-label="Navegação do estudante" className="flex gap-1 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 hidden lg:block">
        <p className="px-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Em breve</p>
        <div className="mt-2 space-y-1">
          {comingSoon.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground/65" title="Este módulo será liberado em breve">
                <Icon className="size-4" />
                <span>{item.label}</span>
                <span className="ml-auto text-[10px]">breve</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 hidden rounded-2xl bg-muted p-4 lg:block">
        <Compass className="size-5" />
        <p className="mt-5 text-sm font-medium">Cada passo conta</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Cursos, projetos e conexões alimentam a mesma trajetória.</p>
      </div>
    </aside>
  );
}