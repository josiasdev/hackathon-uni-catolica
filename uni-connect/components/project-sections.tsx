"use client";

import { Compass, FolderPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";
import { ProjectForm } from "@/components/project-form";
import { ProjectList } from "@/components/project-list";

type Project = { id: string; title: string; description: string | null; modality: string; roles: { id: string; title: string; skill_names: string[] }[]; application: { id: string; status: string } | null };

export function ProjectSections({ userId, institutionId, projects }: { userId: string; institutionId: string | null; projects: Project[] }) {
  const [section, setSection] = useState<"open" | "create">("open");

  return (
    <div className="space-y-6">
      <div className="grid max-w-xl grid-cols-2 rounded-2xl bg-muted p-1.5" role="tablist" aria-label="Área de projetos">
        <button type="button" role="tab" aria-selected={section === "open"} onClick={() => setSection("open")} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors", section === "open" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          <Compass className="size-4" /> Projetos abertos
        </button>
        <button type="button" role="tab" aria-selected={section === "create"} onClick={() => setSection("create")} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors", section === "create" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          <FolderPlus className="size-4" /> Criar projeto
        </button>
      </div>

      {section === "open" ? (
        <section aria-label="Projetos abertos">
          <div className="mb-4"><p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Descubra</p><h2 className="mt-1 text-xl font-semibold">Encontre uma equipe</h2><p className="mt-1 text-sm text-muted-foreground">Entre em um projeto que combina com o que você quer construir.</p></div>
          <ProjectList userId={userId} initialProjects={projects} />
        </section>
      ) : (
        <section aria-label="Criar projeto" className="max-w-3xl">
          <div className="mb-4"><p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">Publique uma ideia</p><h2 className="mt-1 text-xl font-semibold">Monte uma equipe para começar</h2><p className="mt-1 text-sm text-muted-foreground">Descreva o desafio e encontre pessoas para construir com você.</p></div>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><ProjectForm creatorId={userId} institutionId={institutionId} /></div>
        </section>
      )}
    </div>
  );
}