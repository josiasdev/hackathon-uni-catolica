"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, CheckCircle, Award } from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string | null;
  area: string | null;
  workload_hours: number | null;
  institution_id: string;
  institutions: { name: string }[] | { name: string } | null;
}

interface Enrollment {
  course_id: string;
  status: string;
  completed_at: string | null;
}

interface Certification {
  course_id: string;
  verification_code: string;
  issued_at: string;
}

function getInstitutionName(institutions: { name: string }[] | { name: string } | null): string {
  if (!institutions) return "";
  return Array.isArray(institutions) ? institutions[0]?.name ?? "" : institutions.name;
}

export function CoursesCatalog({
  courses,
  enrollments,
  certifications,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  certifications: Certification[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const enrollmentMap = new Map(enrollments.map((e) => [e.course_id, e]));
  const certificationMap = new Map(certifications.map((c) => [c.course_id, c]));

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.toLowerCase().includes(search.toLowerCase()) ||
      getInstitutionName(c.institutions).toLowerCase().includes(search.toLowerCase())
  );

  async function handleEnroll(courseId: string) {
    setLoading(courseId);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      status: "matriculado",
    });

    if (error) {
      setMessage("Erro ao matricular: " + error.message);
    } else {
      setMessage("Matriculado com sucesso!");
      router.refresh();
    }
    setLoading(null);
  }

  async function handleComplete(courseId: string) {
    setLoading(courseId);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Chamar a função SQL que cria trajectory_event, skills e certificação
    const { error } = await supabase.rpc("complete_course", {
      p_user_id: user.id,
      p_course_id: courseId,
    });

    if (error) {
      setMessage("Erro ao concluir: " + error.message);
    } else {
      setMessage("Curso concluído! Certificação emitida.");
      router.refresh();
    }
    setLoading(null);
  }

  function getStatus(courseId: string) {
    const enrollment = enrollmentMap.get(courseId);
    const certification = certificationMap.get(courseId);

    if (certification) {
      return { status: "certified", verificationCode: certification.verification_code };
    }
    if (enrollment) {
      return { status: enrollment.status };
    }
    return { status: "none" };
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar cursos por nome, área ou instituição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Erro") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Lista de cursos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const statusInfo = getStatus(course.id);

          return (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{course.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getInstitutionName(course.institutions)}
                    </p>
                  </div>
                  {statusInfo.status === "certified" && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  )}
                  {statusInfo.status === "concluido" && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Concluído
                    </Badge>
                  )}
                  {statusInfo.status === "em_andamento" && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Em andamento
                    </Badge>
                  )}
                  {statusInfo.status === "matriculado" && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Matriculado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {course.area && <Badge variant="outline">{course.area}</Badge>}
                  {course.workload_hours && (
                    <Badge variant="outline">{course.workload_hours}h</Badge>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2 mt-1">
                  {statusInfo.status === "none" && (
                    <Button
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                      disabled={loading === course.id}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      {loading === course.id ? "Matriculando..." : "Matricular"}
                    </Button>
                  )}
                  {(statusInfo.status === "matriculado" ||
                    statusInfo.status === "em_andamento") && (
                    <Button
                      size="sm"
                      onClick={() => handleComplete(course.id)}
                      disabled={loading === course.id}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {loading === course.id ? "Concluindo..." : "Concluir curso"}
                    </Button>
                  )}
                  {statusInfo.status === "certified" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs">
                        {statusInfo.verificationCode}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {search ? "Nenhum curso encontrado para essa busca." : "Nenhum curso disponível."}
        </p>
      )}
    </div>
  );
}
