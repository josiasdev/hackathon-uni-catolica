import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, institutions(id, name), courses(id, name)")
    .eq("id", user?.id ?? "")
    .single();

  const { data: institutions } = await supabase
    .from("institutions")
    .select("id, name")
    .order("name");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, institution_id")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e acadêmicas.
        </p>
      </div>
      <ProfileForm
        profile={profile}
        institutions={institutions ?? []}
        courses={courses ?? []}
      />
    </div>
  );
}
