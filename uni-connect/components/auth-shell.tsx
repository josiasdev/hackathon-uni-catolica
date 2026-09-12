import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[minmax(360px,0.9fr)_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo-icon.png" alt="UniConnect" width={38} height={40} priority />
            <span className="text-xl font-semibold tracking-tight">UniConnect</span>
          </Link>
          <div className="mt-24 max-w-md">
            <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-primary uppercase">A graduação termina. A conexão não.</p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">Sua história acadêmica merece continuar crescendo.</h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-background/65">Um lugar para transformar aprendizados em competências, conexões e oportunidades reais.</p>
          </div>
        </div>
        <div className="relative z-10 grid max-w-md grid-cols-3 gap-3 text-sm">
          <div className="border-t border-background/20 pt-3"><GraduationCap className="mb-4 size-5 text-primary" /><span className="text-background/65">Aprenda</span></div>
          <div className="border-t border-background/20 pt-3"><Award className="mb-4 size-5 text-primary" /><span className="text-background/65">Construa</span></div>
          <div className="border-t border-background/20 pt-3"><BriefcaseBusiness className="mb-4 size-5 text-primary" /><span className="text-background/65">Conquiste</span></div>
        </div>
        <div className="pointer-events-none absolute -right-36 top-1/3 size-96 rounded-full border-[60px] border-primary/15" />
        <div className="pointer-events-none absolute -right-20 top-[42%] size-60 rounded-full border-[22px] border-primary" />
      </aside>
      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-14 lg:py-10 xl:px-24">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 lg:hidden"><Image src="/logo-icon.png" alt="UniConnect" width={30} height={32} priority /><span className="font-semibold tracking-tight">UniConnect</span></Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">Voltar para início<ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-12"><div className="w-full max-w-md">{children}</div></div>
      </main>
    </div>
  );
}