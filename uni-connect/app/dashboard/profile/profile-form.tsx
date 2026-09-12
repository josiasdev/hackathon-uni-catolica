"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  institution_id: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  institution_id: string | null;
  course_id: string | null;
  semester: number | null;
  enrollment_year: number | null;
}

export function ProfileForm({
  profile,
  institutions,
  courses,
}: {
  profile: Profile | null;
  institutions: Institution[];
  courses: Course[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [institutionId, setInstitutionId] = useState(profile?.institution_id ?? "");
  const [courseId, setCourseId] = useState(profile?.course_id ?? "");
  const [semester, setSemester] = useState(profile?.semester?.toString() ?? "");
  const [enrollmentYear, setEnrollmentYear] = useState(
    profile?.enrollment_year?.toString() ?? ""
  );

  const filteredCourses = institutionId
    ? courses.filter((c) => c.institution_id === institutionId)
    : courses;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio: bio || null,
        institution_id: institutionId || null,
        course_id: courseId || null,
        semester: semester ? Number(semester) : null,
        enrollment_year: enrollmentYear ? Number(enrollmentYear) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile?.id ?? "");

    if (error) {
      setMessage("Erro ao salvar: " + error.message);
    } else {
      setMessage("Perfil salvo com sucesso!");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Dados pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={fullName} />}
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                Foto de perfil será implementada em breve.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome completo
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              placeholder="Conte um pouco sobre você..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados acadêmicos */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Acadêmicos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="institution" className="text-sm font-medium">
              Instituição
            </label>
            <Select
              id="institution"
              value={institutionId}
              onChange={(e) => {
                setInstitutionId(e.target.value);
                setCourseId("");
              }}
            >
              <option value="">Selecione uma instituição</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="course" className="text-sm font-medium">
              Curso
            </label>
            <Select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={!institutionId}
            >
              <option value="">Selecione um curso</option>
              {filteredCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="semester" className="text-sm font-medium">
                Semestre atual
              </label>
              <Select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">—</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s}>
                    {s}º semestre
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="enrollmentYear" className="text-sm font-medium">
                Ano de ingresso
              </label>
              <Select
                id="enrollmentYear"
                value={enrollmentYear}
                onChange={(e) => setEnrollmentYear(e.target.value)}
              >
                <option value="">—</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  )
                )}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Erro") ? "text-destructive" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar perfil"}
        </Button>
      </div>
    </form>
  );
}
