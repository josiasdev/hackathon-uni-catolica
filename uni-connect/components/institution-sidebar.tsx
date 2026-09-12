"use client";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const navigation = [
  { label: "Visão geral", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Cursos e trilhas", href: "/admin/dashboard#academia", icon: BookOpen },
  { label: "Oportunidades", href: "/admin/dashboard#oportunidades", icon: BriefcaseBusiness },
  { label: "Projetos", href: "/admin/dashboard#projetos", icon: FolderKanban },
  { label: "Eventos", href: "/admin/dashboard#eventos", icon: CalendarDays },
  { label: "Seleções", href: "/admin/dashboard#selecoes", icon: ListChecks },
];

export function InstitutionSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-border bg-background lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:border-r lg:pr-5">
      <div className="mb-5 hidden items-center gap-3 px-3 lg:flex">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary"><BarChart3 className="size-5" /></div>
        <div><p className="text-sm font-semibold">Central de gestão</p><p className="text-xs text-muted-foreground">Área institucional</p></div>
      </div>
      <nav aria-label="Navegação institucional" className="flex gap-1 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin/dashboard" ? pathname === item.href : pathname === "/admin/dashboard";
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{item.label}</Link>;
        })}
      </nav>
      <div className="mt-8 hidden rounded-2xl bg-muted p-4 lg:block"><Users className="size-5" /><p className="mt-5 text-sm font-medium">Impacto em um só lugar</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Publique, acompanhe e conecte pessoas às próximas oportunidades.</p></div>
    </aside>
  );
}
