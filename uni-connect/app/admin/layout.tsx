import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";
import { SiteHeader } from "@/components/site-header";
import { InstitutionSidebar } from "@/components/institution-sidebar";

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
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:py-8">
        <InstitutionSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
