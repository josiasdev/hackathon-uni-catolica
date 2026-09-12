import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";

export default async function DashboardPage() {
  const profile = await getProfile();

  if (profile.role === "aluno" || profile.role === "egresso") {
    redirect("/student/dashboard");
  }

  redirect("/admin/dashboard");
}
