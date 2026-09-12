"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillBadge } from "@/components/ui/skill-badge";
import { Plus, Search } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  slug: string;
}

interface UserSkill {
  id: string;
  skill_id: string;
  source_type: string;
  source_id: string | null;
  acquired_at: string;
  skills: Skill | Skill[];
}

function getSkillName(skills: Skill | Skill[]): string {
  return Array.isArray(skills) ? skills[0]?.name ?? "" : skills.name;
}

export function SkillsManager({
  userSkills,
  allSkills,
}: {
  userSkills: UserSkill[];
  allSkills: Skill[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const userSkillIds = new Set(userSkills.map((us) => us.skill_id));

  const availableSkills = allSkills.filter(
    (s) =>
      !userSkillIds.has(s.id) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddSkill(skillId: string) {
    setLoading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("user_skills").insert({
      user_id: user.id,
      skill_id: skillId,
      source_type: "manual",
    });

    if (error) {
      setMessage("Erro ao adicionar: " + error.message);
    } else {
      setMessage("Competência adicionada!");
      setSearch("");
      router.refresh();
    }

    setLoading(false);
  }

  async function handleRemoveSkill(userSkillId: string) {
    setLoading(true);

    const { error } = await supabase
      .from("user_skills")
      .delete()
      .eq("id", userSkillId);

    if (!error) {
      setMessage("Competência removida.");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Skills atuais */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Competências ({userSkills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Você ainda não adicionou nenhuma competência.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userSkills.map((us) => (
                <SkillBadge
                  key={us.id}
                  name={getSkillName(us.skills)}
                  sourceType={us.source_type}
                  onRemove={() => handleRemoveSkill(us.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar competência */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Competência</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar competência..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {search && (
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {availableSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma competência encontrada.
                </p>
              ) : (
                availableSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleAddSkill(skill.id)}
                    disabled={loading}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Plus className="h-3 w-3" />
                    {skill.name}
                  </button>
                ))
              )}
            </div>
          )}
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
    </div>
  );
}
