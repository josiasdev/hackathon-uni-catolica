"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Award, Briefcase } from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string | null;
  area: string | null;
  institution_id: string;
  institutions: { name: string }[] | { name: string } | null;
}

interface Skill {
  id: string;
  name: string;
  slug: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  modality: string;
  location: string | null;
  is_active: boolean;
}

function getInstitutionName(institutions: { name: string }[] | { name: string } | null): string {
  if (!institutions) return "";
  return Array.isArray(institutions) ? institutions[0]?.name ?? "" : institutions.name;
}

// Busca fuzzy simples no cliente (tolerância a erros de digitação)
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (lowerText.includes(lowerQuery)) return true;

  // Verificar se as letras da query aparecem em ordem no texto
  let queryIdx = 0;
  for (let i = 0; i < lowerText.length && queryIdx < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIdx]) {
      queryIdx++;
    }
  }
  if (queryIdx === lowerQuery.length) return true;

  // Verificar com tolerância a 1 erro (Levenshtein simplificado)
  if (lowerQuery.length >= 3) {
    for (let i = 0; i <= lowerText.length - lowerQuery.length + 1; i++) {
      const substring = lowerText.substring(i, i + lowerQuery.length);
      let mismatches = 0;
      for (let j = 0; j < lowerQuery.length; j++) {
        if (substring[j] !== lowerQuery[j]) mismatches++;
      }
      if (mismatches <= 1) return true;
    }
  }

  return false;
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

export function UnifiedSearch({
  courses,
  skills,
  opportunities,
}: {
  courses: Course[];
  skills: Skill[];
  opportunities: Opportunity[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { courses: [], skills: [], opportunities: [] };

    const matchedCourses = courses.filter(
      (c) =>
        fuzzyMatch(c.name, query) ||
        fuzzyMatch(c.area ?? "", query) ||
        fuzzyMatch(getInstitutionName(c.institutions), query)
    );

    const matchedSkills = skills.filter(
      (s) => fuzzyMatch(s.name, query)
    );

    const matchedOpportunities = opportunities.filter(
      (o) =>
        fuzzyMatch(o.title, query) ||
        fuzzyMatch(o.location ?? "", query) ||
        fuzzyMatch(typeLabels[o.type] ?? "", query)
    );

    return {
      courses: matchedCourses,
      skills: matchedSkills,
      opportunities: matchedOpportunities,
    };
  }, [query, courses, skills, opportunities]);

  const totalResults = results.courses.length + results.skills.length + results.opportunities.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar cursos, competências ou oportunidades..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          autoFocus
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-muted-foreground">
          {totalResults} resultado(s) encontrado(s)
        </p>
      )}

      {/* Skills */}
      {results.skills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-primary" />
              Competências ({results.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.skills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cursos */}
      {results.courses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Cursos ({results.courses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {results.courses.map((course) => (
              <div key={course.id} className="flex items-start justify-between rounded-md border border-border p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{course.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getInstitutionName(course.institutions)}
                  </p>
                  {course.area && (
                    <Badge variant="outline" className="mt-1 text-xs">{course.area}</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Oportunidades */}
      {results.opportunities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-primary" />
              Oportunidades ({results.opportunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {results.opportunities.map((opp) => (
              <div key={opp.id} className="flex items-start justify-between rounded-md border border-border p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{opp.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[opp.type] ?? opp.type}
                    </Badge>
                    {opp.location && (
                      <Badge variant="outline" className="text-xs">{opp.location}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sem resultados */}
      {query.trim() && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Nenhum resultado para &quot;{query}&quot;
          </p>
          <p className="text-sm text-muted-foreground/70">
            Tente buscar com outros termos (a busca tolera erros de digitação)
          </p>
        </div>
      )}

      {/* Estado vazio */}
      {!query.trim() && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Digite algo para buscar
          </p>
          <p className="text-sm text-muted-foreground/70">
            Busque por cursos, competências ou oportunidades
          </p>
        </div>
      )}
    </div>
  );
}
