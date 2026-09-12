import { Bolt, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function XpProgress({ xp }: { xp: number }) {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  const nextLevelXp = 100 - currentLevelXp;
  return <Card className="overflow-hidden"><CardHeader className="border-b"><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2 text-lg"><Bolt className="size-5 text-primary-foreground" /> Sua evolução</CardTitle><CardDescription>Cada passo da sua trajetória soma experiência.</CardDescription></div><div className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-semibold"><Sparkles className="size-4" /> Nível {level}</div></div></CardHeader><CardContent className="space-y-4 pt-5"><div className="flex items-end justify-between"><div><p className="text-3xl font-semibold">{xp} XP</p><p className="text-xs text-muted-foreground">{nextLevelXp === 100 ? "Comece sua jornada" : `${nextLevelXp} XP para o próximo nível`}</p></div><p className="text-sm font-medium">{currentLevelXp}/100</p></div><Progress value={currentLevelXp} aria-label={`${currentLevelXp}% para o próximo nível`} /><div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3"><span>Perfil completo <strong className="text-foreground">+25 XP</strong></span><span>Competência <strong className="text-foreground">+10 XP</strong></span><span>Curso concluído <strong className="text-foreground">+100 XP</strong></span></div></CardContent></Card>;
}