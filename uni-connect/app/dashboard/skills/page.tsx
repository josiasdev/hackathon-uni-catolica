import { createClient } from "@/lib/supabase/server";
import { SkillsManager } from "./skills-manager";

export default async function SkillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userSkills } = await supabase
    .from("user_skills")
    .select("id, skill_id, source_type, source_id, acquired_at, skills(id, name, slug)")
    .eq("user_id", user?.id ?? "")
    .order("acquired_at", { ascending: false });

  const { data: allSkills } = await supabase
    .from("skills")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Competências</h1>
        <p className="text-muted-foreground">
          Gerencie suas habilidades e competências técnicas.
        </p>
      </div>
      <SkillsManager userSkills={userSkills ?? []} allSkills={allSkills ?? []} />
    </div>
  );
}
