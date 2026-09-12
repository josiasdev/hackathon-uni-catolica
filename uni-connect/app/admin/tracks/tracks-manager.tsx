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
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";

interface Institution {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
  description: string | null;
  area: string | null;
  is_active: boolean;
  institution_id: string;
  institutions: { name: string }[] | { name: string } | null;
}

interface Course {
  id: string;
  name: string;
  institution_id: string;
}

interface TrackCourse {
  track_id: string;
  course_id: string;
  position: number;
}

function getInstitutionName(institutions: { name: string }[] | { name: string } | null): string {
  if (!institutions) return "";
  return Array.isArray(institutions) ? institutions[0]?.name ?? "" : institutions.name;
}

export function TracksManager({
  tracks,
  institutions,
  courses,
  trackCourses,
}: {
  tracks: Track[];
  institutions: Institution[];
  courses: Course[];
  trackCourses: TrackCourse[];
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
  const [institutionId, setInstitutionId] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const filteredCourses = institutionId
    ? courses.filter((c) => c.institution_id === institutionId)
    : courses;

  function resetForm() {
    setName("");
    setDescription("");
    setArea("");
    setInstitutionId("");
    setSelectedCourses([]);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(track: Track) {
    setEditingId(track.id);
    setName(track.name);
    setDescription(track.description ?? "");
    setArea(track.area ?? "");
    setInstitutionId(track.institution_id);
    setSelectedCourses(
      trackCourses
        .filter((tc) => tc.track_id === track.id)
        .sort((a, b) => a.position - b.position)
        .map((tc) => tc.course_id)
    );
    setShowForm(true);
  }

  async function handleDelete(trackId: string) {
    if (!confirm("Tem certeza que deseja excluir esta trilha?")) return;
    setLoading(true);

    const { error } = await supabase.from("learning_tracks").delete().eq("id", trackId);

    if (error) {
      setMessage("Erro ao excluir: " + error.message);
    } else {
      setMessage("Trilha excluída!");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const trackData = {
      name,
      description: description || null,
      area: area || null,
      institution_id: institutionId,
    };

    let trackId: string;

    if (editingId) {
      const { error } = await supabase
        .from("learning_tracks")
        .update(trackData)
        .eq("id", editingId);
      if (error) {
        setMessage("Erro ao atualizar: " + error.message);
        setLoading(false);
        return;
      }
      trackId = editingId;
      await supabase.from("track_courses").delete().eq("track_id", trackId);
    } else {
      const { data, error } = await supabase
        .from("learning_tracks")
        .insert(trackData)
        .select("id")
        .single();
      if (error) {
        setMessage("Erro ao criar: " + error.message);
        setLoading(false);
        return;
      }
      trackId = data.id;
    }

    if (selectedCourses.length > 0) {
      const { error } = await supabase.from("track_courses").insert(
        selectedCourses.map((courseId, index) => ({
          track_id: trackId,
          course_id: courseId,
          position: index,
        }))
      );
      if (error) {
        setMessage("Erro ao salvar cursos da trilha: " + error.message);
        setLoading(false);
        return;
      }
    }

    setMessage(editingId ? "Trilha atualizada!" : "Trilha criada!");
    resetForm();
    router.refresh();
    setLoading(false);
  }

  function toggleCourse(courseId: string) {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  }

  function moveCourse(courseId: string, direction: "up" | "down") {
    setSelectedCourses((prev) => {
      const idx = prev.indexOf(courseId);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Trilha
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingId ? "Editar Trilha" : "Nova Trilha"}</CardTitle>
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
                    placeholder="Nome da trilha"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Instituição *</label>
                  <Select
                    value={institutionId}
                    onChange={(e) => {
                      setInstitutionId(e.target.value);
                      setSelectedCourses([]);
                    }}
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
                  placeholder="Descrição da trilha"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Área</label>
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="ex.: Frontend, Backend, Dados"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Cursos da trilha (na ordem desejada)
                </label>
                {selectedCourses.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {selectedCourses.map((courseId, index) => {
                      const course = courses.find((c) => c.id === courseId);
                      return (
                        <div
                          key={courseId}
                          className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground w-6 text-center">
                            {index + 1}
                          </span>
                          <span className="flex-1">{course?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveCourse(courseId, "up")}
                            disabled={index === 0}
                          >
                            <GripVertical className="h-3 w-3 rotate-180" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveCourse(courseId, "down")}
                            disabled={index === selectedCourses.length - 1}
                          >
                            <GripVertical className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleCourse(courseId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {filteredCourses
                    .filter((c) => !selectedCourses.includes(c.id))
                    .map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className="inline-flex items-center rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {course.name}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const trackCourseNames = trackCourses
            .filter((tc) => tc.track_id === track.id)
            .sort((a, b) => a.position - b.position)
            .map((tc) => courses.find((c) => c.id === tc.course_id)?.name)
            .filter(Boolean);

          return (
            <Card key={track.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{track.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getInstitutionName(track.institutions)}
                    </p>
                  </div>
                  <Badge variant={track.is_active ? "default" : "secondary"}>
                    {track.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {track.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {track.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {track.area && <Badge variant="outline">{track.area}</Badge>}
                  <Badge variant="outline">
                    {trackCourseNames.length} curso(s)
                  </Badge>
                </div>
                {trackCourseNames.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {trackCourseNames.join(" → ")}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(track)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(track.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tracks.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma trilha cadastrada.
        </p>
      )}
    </div>
  );
}
