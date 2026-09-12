import { createClient } from "@/lib/supabase/server";
import { CoursesManager } from "./courses-manager";

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, description, area, workload_hours, is_active, institution_id, institutions(name)")
    .order("name");

  const { data: institutions } = await supabase
    .from("institutions")
    .select("id, name")
    .order("name");

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name")
    .order("name");

  const { data: courseSkills } = await supabase
    .from("course_skills")
    .select("course_id, skill_id");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
        <p className="text-muted-foreground">
          Gerencie os cursos oferecidos pelas instituições.
        </p>
      </div>
      <CoursesManager
        courses={courses ?? []}
        institutions={institutions ?? []}
        skills={skills ?? []}
        courseSkills={courseSkills ?? []}
      />
    </div>
  );
}
