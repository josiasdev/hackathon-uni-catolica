import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <GraduationCap className="h-16 w-16 text-primary" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold tracking-tight">
          UniConnect
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Estude · Conecte · Conquiste
        </p>
        <p className="max-w-lg text-muted-foreground">
          A graduação termina. A conexão não.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Criar conta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
