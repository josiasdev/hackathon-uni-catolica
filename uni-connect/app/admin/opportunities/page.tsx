import { createClient } from "@/lib/supabase/server";
import { OpportunitiesManager } from "./opportunities-manager";

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title, description, type, modality, location, workload_hours, compensation, is_active, created_at")
    .eq("publisher_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name")
    .order("name");

  const { data: opportunitySkills } = await supabase
    .from("opportunity_skills")
    .select("opportunity_id, skill_id");

  const { data: applications } = await supabase
    .from("applications")
    .select("id, opportunity_id, status, applied_at, profiles(full_name)")
    .in("opportunity_id", (opportunities ?? []).map((o) => o.id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Oportunidades</h1>
        <p className="text-muted-foreground">
          Gerencie as oportunidades que você publicou.
        </p>
      </div>
      <OpportunitiesManager
        opportunities={opportunities ?? []}
        skills={skills ?? []}
        opportunitySkills={opportunitySkills ?? []}
        applications={applications ?? []}
      />
    </div>
  );
}
