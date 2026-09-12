import { createClient } from "@/lib/supabase/server";
import { CoursesCatalog } from "./courses-catalog";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, description, area, workload_hours, institution_id, institutions(name)")
    .eq("is_active", true)
    .order("name");

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, status, completed_at")
    .eq("user_id", user?.id ?? "");

  const { data: certifications } = await supabase
    .from("certifications")
    .select("course_id, verification_code, issued_at")
    .eq("user_id", user?.id ?? "");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
        <p className="text-muted-foreground">
          Explore e matricule-se em cursos disponíveis.
        </p>
      </div>
      <CoursesCatalog
        courses={courses ?? []}
        enrollments={enrollments ?? []}
        certifications={certifications ?? []}
      />
    </div>
  );
}
