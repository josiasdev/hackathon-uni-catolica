"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  description: string | null;
  area: string | null;
  workload_hours: number | null;
  is_active: boolean;
  institution_id: string;
  institutions: { name: string }[] | { name: string } | null;
}

interface Skill {
  id: string;
  name: string;
}

interface CourseSkill {
  course_id: string;
  skill_id: string;
}

function getInstitutionName(institutions: { name: string }[] | { name: string } | null): string {
  if (!institutions) return "";
  return Array.isArray(institutions) ? institutions[0]?.name ?? "" : institutions.name;
}

export function CoursesManager({
  courses,
  institutions,
  skills,
  courseSkills,
}: {
  courses: Course[];
  institutions: Institution[];
  skills: Skill[];
  courseSkills: CourseSkill[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [workloadHours, setWorkloadHours] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  function resetForm() {
    setName("");
    setDescription("");
    setArea("");
    setWorkloadHours("");
    setInstitutionId("");
    setSelectedSkills([]);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(course: Course) {
    setEditingId(course.id);
    setName(course.name);
    setDescription(course.description ?? "");
    setArea(course.area ?? "");
    setWorkloadHours(course.workload_hours?.toString() ?? "");
    setInstitutionId(course.institution_id);
    setSelectedSkills(
      courseSkills.filter((cs) => cs.course_id === course.id).map((cs) => cs.skill_id)
    );
    setShowForm(true);
  }

  async function handleDelete(courseId: string) {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;
    setLoading(true);

    const { error } = await supabase.from("courses").delete().eq("id", courseId);

    if (error) {
      setMessage("Erro ao excluir: " + error.message);
    } else {
      setMessage("Curso excluído!");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const courseData = {
      name,
      description: description || null,
      area: area || null,
      workload_hours: workloadHours ? Number(workloadHours) : null,
      institution_id: institutionId,
    };

    let courseId: string;

    if (editingId) {
      const { error } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", editingId);
      if (error) {
        setMessage("Erro ao atualizar: " + error.message);
        setLoading(false);
        return;
      }
      courseId = editingId;

      // Remover skills antigos
      await supabase.from("course_skills").delete().eq("course_id", courseId);
    } else {
      const { data, error } = await supabase
        .from("courses")
        .insert(courseData)
        .select("id")
        .single();
      if (error) {
        setMessage("Erro ao criar: " + error.message);
        setLoading(false);
        return;
      }
      courseId = data.id;
    }

    // Adicionar skills
    if (selectedSkills.length > 0) {
      const { error } = await supabase.from("course_skills").insert(
        selectedSkills.map((skillId) => ({
          course_id: courseId,
          skill_id: skillId,
        }))
      );
      if (error) {
        setMessage("Erro ao salvar competências: " + error.message);
        setLoading(false);
        return;
      }
    }

    setMessage(editingId ? "Curso atualizado!" : "Curso criado!");
    resetForm();
    router.refresh();
    setLoading(false);
  }

  function toggleSkill(skillId: string) {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Botão adicionar */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingId ? "Editar Curso" : "Novo Curso"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nome do curso"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Instituição *</label>
                  <Select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Descrição do curso"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Área</label>
                  <Input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="ex.: Frontend, Backend, Dados"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Carga horária (horas)</label>
                  <Input
                    type="number"
                    value={workloadHours}
                    onChange={(e) => setWorkloadHours(e.target.value)}
                    placeholder="ex.: 40"
                    min={1}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Competências do curso</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedSkills.includes(skill.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {message && (
        <p className={`text-sm ${message.includes("Erro") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Lista de cursos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">{course.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getInstitutionName(course.institutions)}
                  </p>
                </div>
                <Badge variant={course.is_active ? "default" : "secondary"}>
                  {course.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
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
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(course)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum curso cadastrado.
        </p>
      )}
    </div>
  );
}
