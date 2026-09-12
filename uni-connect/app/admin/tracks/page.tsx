import { createClient } from "@/lib/supabase/server";
import { TracksManager } from "./tracks-manager";

export default async function TracksPage() {
  const supabase = await createClient();

  const { data: tracks } = await supabase
    .from("learning_tracks")
    .select("id, name, description, area, is_active, institution_id, institutions(name)")
    .order("name");

  const { data: institutions } = await supabase
    .from("institutions")
    .select("id, name")
    .order("name");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, institution_id")
    .eq("is_active", true)
    .order("name");

  const { data: trackCourses } = await supabase
    .from("track_courses")
    .select("track_id, course_id, position")
    .order("position");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trilhas</h1>
        <p className="text-muted-foreground">
          Gerencie as trilhas de aprendizado (conjuntos de cursos).
        </p>
      </div>
      <TracksManager
        tracks={tracks ?? []}
        institutions={institutions ?? []}
        courses={courses ?? []}
        trackCourses={trackCourses ?? []}
      />
    </div>
  );
}
