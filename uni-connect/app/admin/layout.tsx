import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";
import { SiteHeader } from "@/components/site-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (profile.role !== "empresa" && profile.role !== "instituicao") {
    redirect("/student/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
