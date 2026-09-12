import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getProfile = cache(async () => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, institution_id, bio, course, semester, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return profile;
});

export const getStudentDashboardData = cache(async () => {
  const profile = await getProfile();
  const supabase = await createClient();

  const [{ data: skillRows }, { data: events }, { data: certifications }, { data: progress }] = await Promise.all([
    supabase
      .from("user_skills")
      .select("id, origin_type, created_at, skills(name)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("trajectory_events")
      .select("id, type, title, description, occurred_at")
      .eq("user_id", profile.id)
      .order("occurred_at", { ascending: false })
      .limit(5),
    supabase
      .from("certifications")
      .select("id, verification_code, issued_at, courses(title)")
      .eq("user_id", profile.id)
      .order("issued_at", { ascending: false }),
    supabase.from("user_progress").select("xp").eq("user_id", profile.id).maybeSingle(),
  ]);

  const skills = (skillRows ?? []).map((row) => {
    const skill = row.skills as unknown as { name: string } | { name: string }[] | null;
    return {
      id: row.id,
      name: Array.isArray(skill) ? skill[0]?.name ?? "Competência" : skill?.name ?? "Competência",
      source: row.origin_type,
    };
  });

  const courses = await getPublishedCourses(profile.id);
  const enrolledCourses = courses.filter((course) => course.enrollment);
  const completedCourses = enrolledCourses.filter((course) => course.enrollment?.status === "completed");
  const completedProfileFields = [profile.full_name, profile.bio, profile.course, profile.semester].filter(Boolean).length;
  const profileProgress = Math.round((completedProfileFields / 4) * 100);

  return {
    profile,
    skills,
    events: events ?? [],
    courses,
    certifications: certifications ?? [],
    stats: {
      profileProgress,
      enrolledCourses: enrolledCourses.length,
      completedCourses: completedCourses.length,
      xp: progress?.xp ?? 0,
    },
  };
});

export const getProfileSkills = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_skills")
    .select("id, skills(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const skill = row.skills as unknown as { name: string } | { name: string }[] | null;
    return { id: row.id, name: Array.isArray(skill) ? skill[0]?.name ?? "Competência" : skill?.name ?? "Competência" };
  });
});

export const getInstitutionCourses = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, description, workload_hours, published, created_at")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getPublishedCourses = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, description, workload_hours, course_skills(skills(id, name)), course_enrollments(id, status, user_id)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (data ?? []).map((course) => {
    const enrollments = course.course_enrollments as unknown as { id: string; status: string; user_id: string }[] | null;
    const courseSkills = course.course_skills as unknown as { skills: { id: string; name: string } | { id: string; name: string }[] | null }[] | null;
    const enrollment = enrollments?.find((item) => item.user_id === userId) ?? null;
    return { id: course.id, title: course.title, description: course.description, workload_hours: course.workload_hours, enrollment, skills: (courseSkills ?? []).map((item) => Array.isArray(item.skills) ? item.skills[0] : item.skills).filter((skill): skill is { id: string; name: string } => Boolean(skill)) };
  });
});

export const getPublishedOpportunities = cache(async (userId: string) => {
  const supabase = await createClient();
  const [{ data: opportunities }, { data: userSkills }] = await Promise.all([
    supabase.from("opportunities").select("id, title, description, opportunity_type, modality, location, opportunity_skills(skills(id, name)), applications(id, status, user_id)").eq("published", true).order("created_at", { ascending: false }),
    supabase.from("user_skills").select("skills(name)").eq("user_id", userId),
  ]);
  const skillNames = new Set((userSkills ?? []).map((item) => { const skill = item.skills as unknown as { name: string } | { name: string }[] | null; return (Array.isArray(skill) ? skill[0]?.name : skill?.name)?.toLowerCase(); }).filter(Boolean));
  return (opportunities ?? []).map((item) => {
    const links = item.opportunity_skills as unknown as { skills: { id: string; name: string } | { id: string; name: string }[] | null }[] | null;
    const skills = (links ?? []).map((link) => Array.isArray(link.skills) ? link.skills[0] : link.skills).filter((skill): skill is { id: string; name: string } => Boolean(skill));
    const applications = item.applications as unknown as { id: string; status: string; user_id: string }[] | null;
    const matching = skills.filter((skill) => skillNames.has(skill.name.toLowerCase())).length;
    return { id: item.id, title: item.title, description: item.description, opportunity_type: item.opportunity_type, modality: item.modality, location: item.location, skills, application: applications?.find((application) => application.user_id === userId) ?? null, compatibility: skills.length ? Math.round((matching / skills.length) * 100) : 0 };
  });
});

export const getOwnedOpportunities = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("opportunities").select("id, title, opportunity_type, modality, published, created_at").eq("created_by", userId).order("created_at", { ascending: false });
  return data ?? [];
});

export const getPublishedProjects = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("id, title, description, modality, project_roles(id, title, skill_names), project_applications(id, status, user_id)").eq("published", true).order("created_at", { ascending: false });
  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    modality: item.modality,
    roles: (item.project_roles ?? []) as unknown as { id: string; title: string; skill_names: string[] }[],
    application: ((item.project_applications ?? []) as unknown as { id: string; status: string; user_id: string }[]).find((application) => application.user_id === userId) ?? null,
  }));
});

export const getOwnedProjects = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("id, title, modality, published, project_roles(title)").eq("created_by", userId).order("created_at", { ascending: false });
  return data ?? [];
});

export const getPublishedEvents = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, description, event_type, starts_at, modality, location, event_registrations(id, status, user_id)")
    .eq("published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
  return (data ?? []).map((item) => ({
    id: item.id, title: item.title, description: item.description, event_type: item.event_type,
    starts_at: item.starts_at, modality: item.modality, location: item.location,
    registration: ((item.event_registrations ?? []) as unknown as { id: string; status: string; user_id: string }[]).find((registration) => registration.user_id === userId) ?? null,
  }));
});

export const getOwnedEvents = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("id, title, starts_at, event_type, published").eq("created_by", userId).order("starts_at", { ascending: true });
  return data ?? [];
});

export const getPublishedSelections = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("selections").select("id, title, description, selection_stages(id, title, position), selection_applications(id, status, current_stage_id, user_id)").eq("published", true).order("created_at", { ascending: false });
  return (data ?? []).map((item) => ({ id: item.id, title: item.title, description: item.description, stages: (item.selection_stages ?? []) as unknown as { id: string; title: string; position: number }[], application: ((item.selection_applications ?? []) as unknown as { id: string; status: string; current_stage_id: string | null; user_id: string }[]).find((application) => application.user_id === userId) ?? null }));
});

export const getOwnedSelections = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("selections").select("id, title, published, selection_stages(title, position)").eq("created_by", userId).order("created_at", { ascending: false });
  return data ?? [];
});

export const getPublicProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("id, full_name, role, bio, course, semester, avatar_url").eq("id", userId).single();
  if (!profile) return null;
  const { data: skillRows } = await supabase.from("user_skills").select("id, skills(name)").eq("user_id", userId).order("created_at", { ascending: false });
  const skills = (skillRows ?? []).map((row) => { const skill = row.skills as unknown as { name: string } | { name: string }[] | null; return { id: row.id, name: Array.isArray(skill) ? skill[0]?.name ?? "Competência" : skill?.name ?? "Competência" }; });
  return { profile, skills };
});

export const getUserXp = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("user_progress").select("xp").eq("user_id", userId).maybeSingle();
  return data?.xp ?? 0;
});

export const getDiscoverableProfiles = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id, full_name, role, course, avatar_url").neq("id", userId).in("role", ["aluno", "egresso"]).order("full_name", { ascending: true }).limit(30);
  const { data: connections } = await supabase.from("connections").select("id, status, requester_id, addressee_id").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  return (profiles ?? []).map((person) => ({ ...person, connection: (connections ?? []).find((connection) => connection.requester_id === person.id || connection.addressee_id === person.id) ?? null }));
});

export const getAvailableMentors = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data: mentors } = await supabase.from("mentor_profiles").select("id, user_id, headline, expertise, availability, profiles!mentor_profiles_user_id_fkey(full_name, avatar_url)").eq("accepting_requests", true).neq("user_id", userId);
  const { data: requests } = await supabase.from("mentorship_requests").select("id, mentor_id, status").eq("mentee_id", userId);
  return (mentors ?? []).map((mentor) => ({ id: mentor.id, user_id: mentor.user_id, headline: mentor.headline, expertise: mentor.expertise, availability: mentor.availability, profile: mentor.profiles as unknown as { full_name: string | null; avatar_url: string | null } | null, request: (requests ?? []).find((request) => request.mentor_id === mentor.id) ?? null }));
});

export const getMyMentorProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("mentor_profiles").select("id, headline, expertise, availability, accepting_requests").eq("user_id", userId).maybeSingle();
  return data;
});

export const getMentorshipRequests = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data: mentor } = await supabase.from("mentor_profiles").select("id").eq("user_id", userId).maybeSingle();
  if (!mentor) return [];
  const { data } = await supabase.from("mentorship_requests").select("id, status, message, created_at, profiles!mentorship_requests_mentee_id_fkey(full_name, course)").eq("mentor_id", mentor.id).order("created_at", { ascending: false });
  return (data ?? []).map((request) => ({ id: request.id, status: request.status, message: request.message, created_at: request.created_at, mentee: request.profiles as unknown as { full_name: string | null; course: string | null } | null }));
});

export const getFullTrajectory = cache(async (userId: string) => {
  const supabase = await createClient();
  const [{ data: events }, { data: skills }, { data: certifications }, { data: enrollments }, { data: progress }] = await Promise.all([
    supabase.from("trajectory_events").select("id, type, title, description, occurred_at, origin_id").eq("user_id", userId).order("occurred_at", { ascending: false }),
    supabase.from("user_skills").select("id, origin_type, created_at, skills(name)").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("certifications").select("id, verification_code, issued_at, courses(title)").eq("user_id", userId).order("issued_at", { ascending: false }),
    supabase.from("course_enrollments").select("id, status, enrolled_at, completed_at, courses(id, title)").eq("user_id", userId).order("enrolled_at", { ascending: false }),
    supabase.from("user_progress").select("xp").eq("user_id", userId).maybeSingle(),
  ]);

  const normalizedSkills = (skills ?? []).map((row) => {
    const skill = row.skills as unknown as { name: string } | { name: string }[] | null;
    return { id: row.id, name: Array.isArray(skill) ? skill[0]?.name ?? "Competência" : skill?.name ?? "Competência", origin: row.origin_type, date: row.created_at };
  });
  const normalizedCourses = (enrollments ?? []).map((row) => ({ id: row.id, title: (row.courses as unknown as { title: string } | null)?.title ?? "Curso", status: row.status, enrolledAt: row.enrolled_at, completedAt: row.completed_at }));
  const normalizedCertifications = (certifications ?? []).map((row) => ({ id: row.id, title: (row.courses as unknown as { title: string } | null)?.title ?? "Certificação", code: row.verification_code, date: row.issued_at }));

  return { events: events ?? [], skills: normalizedSkills, courses: normalizedCourses, certifications: normalizedCertifications, xp: progress?.xp ?? 0 };
});

export const getAchievements = cache(async (userId: string) => {
  const supabase = await createClient();
  const [{ data: achievements }, { data: unlocked }] = await Promise.all([
    supabase.from("achievements").select("id, key, title, description, xp_reward").order("created_at", { ascending: true }),
    supabase.from("user_achievements").select("achievement_id, unlocked_at").eq("user_id", userId),
  ]);
  return (achievements ?? []).map((achievement) => ({ ...achievement, unlocked_at: unlocked?.find((item) => item.achievement_id === achievement.id)?.unlocked_at ?? null }));
});

export const getExternalCertifications = cache(async (userId: string) => {
  const supabase = await createClient();
  const [{ data: certificates }, { data: completedCourses }] = await Promise.all([
    supabase.from("external_certifications").select("id, title, issuer, workload_hours, issued_at, file_url, created_at").eq("user_id", userId).order("issued_at", { ascending: false }),
    supabase.from("course_enrollments").select("id, courses(workload_hours)").eq("user_id", userId).eq("status", "completed"),
  ]);
  const courseHours = (completedCourses ?? []).reduce((total, item) => total + (((item.courses as unknown as { workload_hours: number | null } | null)?.workload_hours) ?? 0), 0);
  const externalHours = (certificates ?? []).reduce((total, item) => total + (item.workload_hours ?? 0), 0);
  return { certificates: certificates ?? [], experienceHours: courseHours + externalHours, courseHours, externalHours };
});
