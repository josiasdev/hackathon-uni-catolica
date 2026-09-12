import { createClient } from "@/lib/supabase/server";
import { AchievementCard } from "@/components/ui/achievement-card";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: allAchievements } = await supabase
    .from("achievements")
    .select("id, name, description, icon, category")
    .order("name");

  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user?.id ?? "");

  const unlockedMap = new Map(
    (userAchievements ?? []).map((ua) => [ua.achievement_id, ua.unlocked_at])
  );

  const unlocked = (allAchievements ?? []).filter((a) => unlockedMap.has(a.id));
  const locked = (allAchievements ?? []).filter((a) => !unlockedMap.has(a.id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conquistas</h1>
        <p className="text-muted-foreground">
          {unlocked.length} de {allAchievements?.length ?? 0} desbloqueadas
        </p>
      </div>

      {unlocked.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Desbloqueadas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlocked.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                unlocked
                unlockedAt={unlockedMap.get(achievement.id) ?? undefined}
              />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Bloqueadas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {locked.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
