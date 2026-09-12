import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, School, BookOpen, Route, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "UniConnect — Administração",
};

const navItems = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/institutions", label: "Instituições", icon: School },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen },
  { href: "/admin/tracks", label: "Trilhas", icon: Route },
  { href: "/admin/opportunities", label: "Oportunidades", icon: Briefcase },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-muted/50 md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">UniConnect</span>
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
