"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = "aluno" | "egresso" | "empresa" | "instituicao";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("aluno");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
      <Card className="w-full border-0 bg-transparent shadow-none ring-0">
        <CardHeader className="px-0 pb-7">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Comece por aqui</p>
          <CardTitle className="text-3xl font-semibold tracking-tight">Crie seu próximo capítulo.</CardTitle>
          <CardDescription className="mt-2 text-base">Entre para uma rede que acompanha sua trajetória.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Nome completo</Label>
              <Input
                id="full_name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Como você se chama?"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@universidade.edu.br"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Eu sou</Label>
              <select
                id="role"
                className="border-input flex h-11 w-full rounded-lg border bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="aluno">Aluno</option>
                <option value="egresso">Egresso</option>
                <option value="empresa">Empresa</option>
                <option value="instituicao">Instituição</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 shadow-sm"><GraduationCap className="size-4 text-primary-foreground" /> Para aprender</div>
              <div className="flex items-center gap-2 px-3 py-2"><BriefcaseBusiness className="size-4" /> Para conectar</div>
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">Não foi possível criar sua conta. Revise os dados e tente novamente.</p>}
            <Button type="submit" disabled={loading} size="lg" className="mt-2 w-full">
              {loading ? "Criando..." : "Criar conta"}
              {!loading && <ArrowRight />}
            </Button>
          </form>
          <p className="mt-7 text-center text-sm text-muted-foreground">Já tem uma conta? <Link href="/login" className="font-medium text-foreground underline decoration-primary underline-offset-4">Entrar</Link></p>
        </CardContent>
      </Card>
  );
}
