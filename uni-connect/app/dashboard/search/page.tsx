import { createClient } from "@/lib/supabase/server";
import { UnifiedSearch } from "./unified-search";

export default async function SearchPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, description, area, institution_id, institutions(name)")
    .eq("is_active", true);

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, slug");

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title, description, type, modality, location, is_active")
    .eq("is_active", true);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buscar</h1>
        <p className="text-muted-foreground">
          Busque cursos, competências e oportunidades. A busca tolera erros de digitação.
        </p>
      </div>
      <UnifiedSearch
        courses={courses ?? []}
        skills={skills ?? []}
        opportunities={opportunities ?? []}
      />
    </div>
  );
}
