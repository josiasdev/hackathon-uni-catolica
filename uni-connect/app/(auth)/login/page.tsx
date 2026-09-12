"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
        <CardHeader className="px-0 pb-8">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase">Bem-vindo de volta</p>
          <CardTitle className="text-3xl font-semibold tracking-tight">Entre na sua jornada.</CardTitle>
          <CardDescription className="mt-2 text-base">Acesse seu espaço de conexões e oportunidades.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-10" placeholder="voce@universidade.edu.br" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pl-10" placeholder="Sua senha" />
              </div>
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">Não foi possível entrar. Confira seus dados e tente novamente.</p>}
            <Button type="submit" disabled={loading} size="lg" className="mt-2 w-full">
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight />}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">Ainda não tem uma conta? <Link href="/signup" className="font-medium text-foreground underline decoration-primary underline-offset-4">Criar conta</Link></p>
        </CardContent>
      </Card>
  );
}
