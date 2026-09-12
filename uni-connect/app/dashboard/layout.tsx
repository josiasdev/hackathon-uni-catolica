import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, LayoutDashboard, Briefcase, User } from "lucide-react";

export const metadata: Metadata = {
  title: "UniConnect — Dashboard",
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/trajectory", label: "Trajetória", icon: GraduationCap },
  { href: "/dashboard/opportunities", label: "Oportunidades", icon: Briefcase },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-muted/50 md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">UniConnect</span>
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
        <div className="border-t border-border px-6 py-4">
          <p className="truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-border px-6 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">UniConnect</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
