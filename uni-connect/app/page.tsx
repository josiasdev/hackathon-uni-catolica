import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/login" />}>
              Entrar
            </Button>
            <Button render={<Link href="/signup" />}>Criar conta</Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <Image
          src="/logo-horizontal.png"
          alt="UniConnect"
          width={340}
          height={97}
          priority
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Conecte sua trajetória acadêmica ao mercado
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg text-balance">
            Estude, construa competências e encontre oportunidades reais.
          </p>
          <p className="text-primary text-sm font-semibold tracking-widest uppercase">
            Estude · Conecte · Conquiste
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Comece agora
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Já tenho conta
          </Button>
        </div>
      </main>
    </div>
  );
}
