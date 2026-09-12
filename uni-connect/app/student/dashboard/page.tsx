import { getProfile } from "@/lib/supabase/dal";

export default async function StudentDashboardPage() {
  const profile = await getProfile();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Olá, {profile.full_name}</h1>
      <p className="text-muted-foreground">Dashboard do estudante.</p>
    </div>
  );
}
