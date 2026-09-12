"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Send } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  modality: string;
  location: string | null;
  workload_hours: number | null;
  compensation: string | null;
  is_active: boolean;
  created_at: string;
}

interface OpportunitySkill {
  opportunity_id: string;
  skill_id: string;
  skills: { id: string; name: string } | { id: string; name: string }[] | null;
}

interface Application {
  opportunity_id: string;
  status: string;
}

const typeLabels: Record<string, string> = {
  emprego: "Emprego",
  estagio: "Estágio",
  trainee: "Trainee",
  freelance: "Freelance",
  bolsa: "Bolsa",
  pesquisa: "Pesquisa",
  extensao: "Extensão",
  monitoria: "Monitoria",
  projeto: "Projeto",
  voluntariado: "Voluntariado",
  intercambio: "Intercâmbio",
  hackathon: "Hackathon",
  selecao: "Seleção",
  outro: "Outro",
};

const modalityLabels: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

function getSkillName(skills: { id: string; name: string } | { id: string; name: string }[] | null): string {
  if (!skills) return "";
  return Array.isArray(skills) ? skills[0]?.name ?? "" : skills.name;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OpportunitiesCatalog({
  opportunities,
  opportunitySkills,
  userSkillIds,
  applications,
}: {
  opportunities: Opportunity[];
  opportunitySkills: OpportunitySkill[];
  userSkillIds: Set<string>;
  applications: Application[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");

  const applicationMap = new Map(applications.map((a) => [a.opportunity_id, a.status]));

  const opportunitiesWithCompatibility = useMemo(() => {
    return opportunities.map((opp) => {
      const oppSkills = opportunitySkills.filter((os) => os.opportunity_id === opp.id);
      const requiredCount = oppSkills.length;

      if (requiredCount === 0) {
        return { ...opp, compatibility: 100, matchedCount: 0, requiredCount: 0, oppSkillNames: [] };
      }

      const matchedCount = oppSkills.filter((os) => userSkillIds.has(os.skill_id)).length;
      const compatibility = Math.round((matchedCount / requiredCount) * 100);
      const oppSkillNames = oppSkills.map((os) => getSkillName(os.skills));

      return { ...opp, compatibility, matchedCount, requiredCount, oppSkillNames };
    });
  }, [opportunities, opportunitySkills, userSkillIds]);

  const filtered = opportunitiesWithCompatibility.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.oppSkillNames.some((n) => n.toLowerCase().includes(search.toLowerCase()));
    const matchesType = !typeFilter || opp.type === typeFilter;
    const matchesModality = !modalityFilter || opp.modality === modalityFilter;
    return matchesSearch && matchesType && matchesModality;
  });

  async function handleApply(oppId: string) {
    setLoading(oppId);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      opportunity_id: oppId,
      status: "candidatado",
    });

    if (error) {
      setMessage("Erro ao candidatar: " + error.message);
    } else {
      setMessage("Candidatura enviada!");
      router.refresh();
    }
    setLoading(null);
  }

  function getCompatibilityColor(pct: number) {
    if (pct >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (pct >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título ou competência..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(typeLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={modalityFilter}
          onChange={(e) => setModalityFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas as modalidades</option>
          {Object.entries(modalityLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Erro") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Lista */}
      <div className="flex flex-col gap-4">
        {filtered.map((opp) => {
          const appStatus = applicationMap.get(opp.id);

          return (
            <Card key={opp.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{opp.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline">{typeLabels[opp.type] ?? opp.type}</Badge>
                      <Badge variant="outline">{modalityLabels[opp.modality] ?? opp.modality}</Badge>
                      {opp.location && <Badge variant="outline">{opp.location}</Badge>}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${getCompatibilityColor(opp.compatibility)}`}>
                    {opp.compatibility}% compatível
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {opp.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {opp.workload_hours && <Badge variant="outline">{opp.workload_hours}h/sem</Badge>}
                  {opp.compensation && <Badge variant="outline">{opp.compensation}</Badge>}
                  <Badge variant="outline" className="text-muted-foreground">
                    {opp.matchedCount}/{opp.requiredCount} competências
                  </Badge>
                </div>
                {opp.oppSkillNames.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {opp.oppSkillNames.map((name, i) => (
                      <Badge
                        key={i}
                        className={
                          userSkillIds.has(opportunitySkills.find((os) => os.opportunity_id === opp.id && getSkillName(os.skills) === name)?.skill_id ?? "")
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    Publicada em {formatDate(opp.created_at)}
                  </span>
                  {appStatus ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {appStatus === "candidatado" ? "Candidatado" : appStatus === "aprovado" ? "Aprovado" : appStatus}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleApply(opp.id)}
                      disabled={loading === opp.id}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {loading === opp.id ? "Enviando..." : "Candidatar"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {search || typeFilter || modalityFilter
            ? "Nenhuma oportunidade encontrada para os filtros selecionados."
            : "Nenhuma oportunidade disponível no momento."}
        </p>
      )}
    </div>
  );
}
