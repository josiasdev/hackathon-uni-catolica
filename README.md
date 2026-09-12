# UniConnect

> **A graduação termina. A conexão não.**
> Estude · Conecte · Conquiste

MVP desenvolvido durante o **Hackathon Unicatólica** — Trilha CONECTAR, Desafio 16: *Estudantes, egressos e oportunidades*.

## 📚 Documentação

- [`context.md`](./context.md) — visão de produto, personas, módulos funcionais e modelo de dados conceitual
- [`design.md`](./design.md) — identidade visual, paleta, tipografia e sistema de componentes
- [`roadmap.md`](./roadmap.md) — plano de implementação em fases (MVP do hackathon → visão completa)

## 💡 Sobre o projeto

O UniConnect é uma **rede acadêmica, profissional e de oportunidades** que conecta universidades, alunos, egressos e empresas em um único perfil contínuo.

Toda atividade do estudante — cursos, certificações, projetos, eventos, seleções — alimenta automaticamente um **perfil de trajetória** e um conjunto de **competências**, usados para calcular compatibilidade com oportunidades reais de mercado. Esse perfil não é substituído quando o aluno se forma: ele evolui para egresso, mantendo o vínculo com a universidade e passando a atuar também como mentor, parceiro ou fonte de talento para empresas.

**Problema:** ausência de mecanismos que conectem talentos formados às demandas do mercado, e falta de continuidade no relacionamento entre universidade, estudante e egresso.

**Solução:** transformar `Participação → Trajetória → Reconhecimento → Oportunidades → Conexão`, mantendo esse ciclo ativo antes, durante e depois da graduação. Detalhes completos do loop em [`context.md`](./context.md#5-o-loop-de-integração-central).

> ℹ️ A visão completa do produto tem 15 módulos funcionais (ver [`context.md`](./context.md)). Este repositório implementa esse escopo **de forma incremental**, seguindo o [`roadmap.md`](./roadmap.md) — o MVP do hackathon cobre fundação, perfil/trajetória/competências, academia e oportunidades/busca/compatibilidade (Fases 0–3).

## 🚀 Como funciona

1. O aluno registra atividades acadêmicas e profissionais (cursos, projetos, eventos, seleções)
2. Cada atividade gera automaticamente competências, entradas na trajetória e, quando aplicável, conquistas
3. O perfil de trajetória é comparado, por regras (sem IA), às competências exigidas por oportunidades
4. O aluno se candidata a vagas, projetos e processos seletivos com compatibilidade calculada
5. Após a graduação, o vínculo continua: o egresso vira mentor, cria projetos ou representa empresas parceiras

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Auth + Postgres com `pg_trgm` + Storage)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/) (deploy)

## 📦 Rodando o projeto localmente

```bash
# clone o repositório
git clone https://github.com/seu-usuario/hackathon-uni-catolica.git
cd hackathon-uni-catolica/uni-connect

# instale as dependências
npm install

# configure as variáveis de ambiente
cp .env.example .env.local
```

Preencha o `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

```bash
# rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 🗄️ Estrutura do banco de dados

> O schema abaixo reflete o escopo inicial (Fases 0–1 do [`roadmap.md`](./roadmap.md)). O modelo conceitual completo, com todas as entidades da visão do produto, está em [`context.md`](./context.md#6-modelo-de-dados-conceitual).

- `profiles` — dados do usuário, papel (aluno/egresso/empresa/instituição) e vínculo institucional
- `skills` / `user_skills` — competências e sua origem (curso, certificação, projeto, evento, seleção)
- `trajectory_events` — timeline de atividades acadêmicas e profissionais
- `achievements` / `user_achievements` — conquistas desbloqueadas

O script SQL de criação das tabelas será versionado em `/supabase/schema.sql` conforme a Fase 0 do roadmap for implementada (ainda não existe neste repositório).

## 📁 Estrutura do projeto

```
uni-connect/
└── app/
    ├── (auth)/          # login e cadastro
    ├── (student)/       # dashboard, trajetória, competências, oportunidades
    ├── (admin)/         # gestão institucional
    └── layout.tsx
```

## 🎯 Impacto

| Para o aluno | Para a universidade | Para o mercado |
|---|---|---|
| Reconhecimento | Maior engajamento | Acesso a talentos |
| Pertencimento | Dados para decisão | Identificação de competências |
| Perfil de trajetória | Aproximação com estudantes | Conexão com egressos |
| Acesso a oportunidades | Relacionamento com egressos | — |

## 👥 Equipe

- Josias Batista — Desenvolvimento

## 📄 Licença

Projeto desenvolvido para fins de hackathon.
