"use client";

import { ArrowRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Course = { id: string; title: string; description: string | null; workload_hours: number | null; enrollment: { id: string; status: string } | null; skills: { id: string; name: string }[] };

export function CourseCatalog({ userId, initialCourses }: { userId: string; initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function enroll(courseId: string) {
    setLoadingId(courseId);
    const supabase = createClient();
    const { data } = await supabase.from("course_enrollments").insert({ course_id: courseId, user_id: userId }).select("id, status").single();
    if (data) setCourses((current) => current.map((course) => course.id === courseId ? { ...course, enrollment: data } : course));
    setLoadingId(null);
  }

  async function complete(course: Course) {
    if (!course.enrollment) return;
    setLoadingId(course.id);
    const supabase = createClient();
    const completedAt = new Date().toISOString();
    const { error } = await supabase.from("course_enrollments").update({ status: "completed", completed_at: completedAt }).eq("id", course.enrollment.id).eq("user_id", userId);
    if (!error) {
      const verificationCode = crypto.randomUUID();
      await supabase.from("certifications").insert({ user_id: userId, course_id: course.id, verification_code: verificationCode });
      await supabase.from("trajectory_events").insert({ user_id: userId, type: "course_completed", title: `Curso concluído: ${course.title}`, description: "Uma nova etapa foi adicionada à sua trajetória.", origin_id: course.id });
      await supabase.rpc("award_xp", { points: 100, xp_reason: `Curso concluído: ${course.title}`, xp_source_type: "course_completed", xp_source_id: course.id });
      const { data: achievement } = await supabase.from("achievements").select("id, xp_reward").eq("key", "first_course").single();
      if (achievement) { const { data: unlocked } = await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: achievement.id }).select("id").single(); if (unlocked && achievement.xp_reward > 0) await supabase.rpc("award_xp", { points: achievement.xp_reward, xp_reason: "Conquista: Primeiro curso concluído", xp_source_type: "achievement", xp_source_id: achievement.id }); }
      for (const skill of course.skills) await supabase.from("user_skills").upsert({ user_id: userId, skill_id: skill.id, origin_type: "course", origin_id: course.id }, { onConflict: "user_id,skill_id" });
      setCourses((current) => current.map((item) => item.id === course.id && item.enrollment ? { ...item, enrollment: { ...item.enrollment, status: "completed" } } : item));
    }
    setLoadingId(null);
  }

  return <div className="grid gap-4 md:grid-cols-2">{courses.length ? courses.map((course) => <Card key={course.id} className="flex flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-muted"><BookOpen className="size-5" /></div>{course.enrollment ? <Badge variant={course.enrollment.status === "completed" ? "default" : "secondary"}><CheckCircle2 /> {course.enrollment.status === "completed" ? "Concluído" : "Matriculado"}</Badge> : null}</div><CardTitle className="mt-4 text-lg">{course.title}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col"><p className="flex-1 text-sm leading-6 text-muted-foreground">{course.description ?? "Um novo caminho para desenvolver suas competências."}</p>{course.skills.length ? <div className="mt-4 flex flex-wrap gap-1.5">{course.skills.map((skill) => <Badge key={skill.id} variant="outline" className="text-[11px]">{skill.name}</Badge>)}</div> : null}<div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4"><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> {course.workload_hours ? `${course.workload_hours} horas` : "Carga livre"}</span>{course.enrollment?.status === "completed" ? <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Certificado emitido</span> : course.enrollment ? <Button size="sm" onClick={() => complete(course)} disabled={loadingId === course.id}>{loadingId === course.id ? "Concluindo..." : "Concluir curso"}<CheckCircle2 /></Button> : <Button size="sm" onClick={() => enroll(course.id)} disabled={loadingId === course.id}>{loadingId === course.id ? "Entrando..." : "Quero fazer"}<ArrowRight /></Button>}</div></CardContent></Card>) : <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center"><BookOpen className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Nenhum curso publicado ainda</p><p className="mt-1 text-sm text-muted-foreground">Quando uma instituição publicar um curso, ele aparecerá aqui.</p></div>}</div>;
}