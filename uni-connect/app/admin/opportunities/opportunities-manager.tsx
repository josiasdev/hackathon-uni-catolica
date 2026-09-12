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
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

interface Skill {
  id: string;
  name: string;
}

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
}

interface Application {
  id: string;
  opportunity_id: string;
  status: string;
  applied_at: string;
  profiles: { full_name: string }[] | { full_name: string } | null;
}

function getProfileName(profiles: { full_name: string }[] | { full_name: string } | null): string {
  if (!profiles) return "Usuário";
  return Array.isArray(profiles) ? profiles[0]?.full_name ?? "Usuário" : profiles.full_name;
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

const statusLabels: Record<string, string> = {
  candidatado: "Candidatado",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  desistiu: "Desistiu",
};

export function OpportunitiesManager({
  opportunities,
  skills,
  opportunitySkills,
  applications,
}: {
  opportunities: Opportunity[];
  skills: Skill[];
  opportunitySkills: OpportunitySkill[];
  applications: Application[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("outro");
  const [modality, setModality] = useState("presencial");
  const [location, setLocation] = useState("");
  const [workloadHours, setWorkloadHours] = useState("");
  const [compensation, setCompensation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showApplications, setShowApplications] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setDescription("");
    setType("outro");
    setModality("presencial");
    setLocation("");
    setWorkloadHours("");
    setCompensation("");
    setSelectedSkills([]);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(opp: Opportunity) {
    setEditingId(opp.id);
    setTitle(opp.title);
    setDescription(opp.description ?? "");
    setType(opp.type);
    setModality(opp.modality);
    setLocation(opp.location ?? "");
    setWorkloadHours(opp.workload_hours?.toString() ?? "");
    setCompensation(opp.compensation ?? "");
    setSelectedSkills(
      opportunitySkills.filter((os) => os.opportunity_id === opp.id).map((os) => os.skill_id)
    );
    setShowForm(true);
  }

  async function handleDelete(oppId: string) {
    if (!confirm("Tem certeza que deseja excluir esta oportunidade?")) return;
    setLoading(true);

    const { error } = await supabase.from("opportunities").delete().eq("id", oppId);

    if (error) {
      setMessage("Erro ao excluir: " + error.message);
    } else {
      setMessage("Oportunidade excluída!");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Erro: usuário não autenticado");
      setLoading(false);
      return;
    }

    const oppData = {
      title,
      description: description || null,
      type,
      modality,
      location: location || null,
      workload_hours: workloadHours ? Number(workloadHours) : null,
      compensation: compensation || null,
      publisher_id: user.id,
    };

    let oppId: string;

    if (editingId) {
      const { error } = await supabase
        .from("opportunities")
        .update(oppData)
        .eq("id", editingId);
      if (error) {
        setMessage("Erro ao atualizar: " + error.message);
        setLoading(false);
        return;
      }
      oppId = editingId;
      await supabase.from("opportunity_skills").delete().eq("opportunity_id", oppId);
    } else {
      const { data, error } = await supabase
        .from("opportunities")
        .insert(oppData)
        .select("id")
        .single();
      if (error) {
        setMessage("Erro ao criar: " + error.message);
        setLoading(false);
        return;
      }
      oppId = data.id;
    }

    if (selectedSkills.length > 0) {
      const { error } = await supabase.from("opportunity_skills").insert(
        selectedSkills.map((skillId) => ({
          opportunity_id: oppId,
          skill_id: skillId,
        }))
      );
      if (error) {
        setMessage("Erro ao salvar competências: " + error.message);
        setLoading(false);
        return;
      }
    }

    setMessage(editingId ? "Oportunidade atualizada!" : "Oportunidade criada!");
    resetForm();
    router.refresh();
    setLoading(false);
  }

  function toggleSkill(skillId: string) {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingId ? "Editar Oportunidade" : "Nova Oportunidade"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Título *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: Estágio Frontend React" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Descreva a oportunidade..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tipo *</label>
                  <Select value={type} onChange={(e) => setType(e.target.value)}>
                    {Object.entries(typeLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Modalidade *</label>
                  <Select value={modality} onChange={(e) => setModality(e.target.value)}>
                    {Object.entries(modalityLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Localização</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex.: São Paulo, SP" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Carga horária (horas/semana)</label>
                  <Input type="number" value={workloadHours} onChange={(e) => setWorkloadHours(e.target.value)} placeholder="Ex.: 20" min={1} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Remuneração</label>
                  <Input value={compensation} onChange={(e) => setCompensation(e.target.value)} placeholder="Ex.: R$ 1.500/mês" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Competências exigidas</label>
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
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
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

      <div className="flex flex-col gap-4">
        {opportunities.map((opp) => {
          const oppSkills = opportunitySkills
            .filter((os) => os.opportunity_id === opp.id)
            .map((os) => skills.find((s) => s.id === os.skill_id)?.name)
            .filter(Boolean);
          const oppApps = applications.filter((a) => a.opportunity_id === opp.id);

          return (
            <Card key={opp.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{opp.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline">{typeLabels[opp.type] ?? opp.type}</Badge>
                      <Badge variant="outline">{modalityLabels[opp.modality] ?? opp.modality}</Badge>
                      {opp.is_active ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {oppApps.length} candidatura(s)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {opp.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {opp.location && <Badge variant="outline">{opp.location}</Badge>}
                  {opp.workload_hours && <Badge variant="outline">{opp.workload_hours}h/sem</Badge>}
                  {opp.compensation && <Badge variant="outline">{opp.compensation}</Badge>}
                </div>
                {oppSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {oppSkills.map((name) => (
                      <Badge key={name} className="bg-primary/10 text-primary border-primary/20">{name}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(opp)}>
                    <Pencil className="h-3 w-3 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowApplications(showApplications === opp.id ? null : opp.id)}>
                    <Users className="h-3 w-3 mr-1" /> Candidatos ({oppApps.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(opp.id)} disabled={loading}>
                    <Trash2 className="h-3 w-3 mr-1" /> Excluir
                  </Button>
                </div>
                {showApplications === opp.id && oppApps.length > 0 && (
                  <div className="mt-3 rounded-md border border-border bg-muted/50 p-3">
                    <p className="text-sm font-medium mb-2">Candidatos:</p>
                    {oppApps.map((app) => (
                      <div key={app.id} className="flex items-center justify-between text-sm py-1">
                        <span>{getProfileName(app.profiles)}</span>
                        <Badge variant="outline">{statusLabels[app.status] ?? app.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {opportunities.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Nenhuma oportunidade publicada.</p>
      )}
    </div>
  );
}
