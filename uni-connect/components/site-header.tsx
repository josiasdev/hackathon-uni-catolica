"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loggingOut} aria-label="Sair da conta">
            <LogOut />
            <span className="hidden sm:inline">{loggingOut ? "Saindo..." : "Sair"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
