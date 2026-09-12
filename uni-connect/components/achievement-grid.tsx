import { Award, BadgeCheck, BookOpen, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Achievement = { id: string; key: string; title: string; description: string; xp_reward: number; unlocked_at: string | null };

const icons = { profile_complete: UserRoundCheck, first_skill: BadgeCheck, first_course: BookOpen };

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return <div className="grid gap-4 md:grid-cols-3">{achievements.map((achievement) => { const Icon = icons[achievement.key as keyof typeof icons] ?? Award; const unlocked = Boolean(achievement.unlocked_at); return <Card key={achievement.id} className={unlocked ? "border-primary/40" : "opacity-60"}><CardContent className="p-5"><div className={`flex size-11 items-center justify-center rounded-xl ${unlocked ? "bg-primary" : "bg-muted"}`}><Icon className="size-5" /></div><h3 className="mt-5 font-medium">{achievement.title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{achievement.description}</p><div className="mt-4 flex items-center justify-between"><Badge variant={unlocked ? "default" : "outline"}>{unlocked ? "Desbloqueada" : "A desbloquear"}</Badge><span className="text-xs font-semibold text-muted-foreground">+{achievement.xp_reward} XP</span></div></CardContent></Card>; })}</div>;
}