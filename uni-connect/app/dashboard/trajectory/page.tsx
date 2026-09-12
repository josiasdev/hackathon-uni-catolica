import { createClient } from "@/lib/supabase/server";
import { Timeline } from "@/components/ui/timeline";

export default async function TrajectoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: events } = await supabase
    .from("trajectory_events")
    .select("id, type, title, description, date, source_type")
    .eq("user_id", user?.id ?? "")
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trajetória</h1>
        <p className="text-muted-foreground">
          Sua linha do tempo de atividades acadêmicas e profissionais.
        </p>
      </div>
      <Timeline events={events ?? []} />
    </div>
  );
}
