import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Lateral esquerda — branding */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="flex flex-col items-center gap-6 text-primary-foreground">
          <GraduationCap className="h-20 w-20" strokeWidth={1.5} />
          <h1 className="text-4xl font-bold tracking-tight">UniConnect</h1>
          <p className="text-lg opacity-80">Estude · Conecte · Conquiste</p>
        </div>
      </div>

      {/* Lateral direita — formulário */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
