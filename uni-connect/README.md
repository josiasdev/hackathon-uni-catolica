# UniConnect — Frontend

> **A graduação termina. A conexão não.**
> Estude · Conecte · Conquiste

Aplicação web do UniConnect — rede acadêmica, profissional e de oportunidades.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Auth + Postgres com `pg_trgm` + Storage)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Poppins](https://fonts.google.com/specimen/Poppins) (tipografia)
- [lucide-react](https://lucide.dev/) (iconografia)

## Estrutura do projeto

```
uni-connect/
├── app/
│   ├── (auth)/               # Login, signup e callback do Supabase
│   ├── admin/                # Painel institucional
│   │   ├── courses/          # CRUD de cursos
│   │   ├── institutions/     # Gestão de instituições
│   │   ├── opportunities/    # CRUD de oportunidades
│   │   └── tracks/           # CRUD de trilhas de aprendizado
│   ├── dashboard/            # Área do aluno
│   │   ├── achievements/     # Conquistas desbloqueadas
│   │   ├── courses/          # Catálogo de cursos e matrículas
│   │   ├── opportunities/    # Catálogo de oportunidades com compatibilidade
│   │   ├── profile/          # Edição de perfil
│   │   ├── search/           # Busca unificada (cursos, skills, oportunidades)
│   │   ├── skills/           # Gerenciamento de competências
│   │   └── trajectory/       # Timeline de atividades
│   ├── globals.css           # Tema UniConnect (Tailwind v4)
│   ├── layout.tsx            # Layout raiz (Poppins)
│   └── page.tsx              # Landing page
├── components/ui/            # Componentes shadcn/ui customizados
├── lib/
│   ├── supabase/             # Clientes browser/server e middleware
│   └── utils.ts              # Utilitário cn()
├── supabase/
│   ├── schema.sql            # Schema completo (Fases 0-3)
│   └── seed.sql              # Skills iniciais
├── middleware.ts              # Autenticação e rotas protegidas
└── components.json           # Configuração shadcn/ui
```

## Como rodar

```bash
# Instale dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

Preencha o `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

```bash
# Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Banco de dados

Execute o arquivo `supabase/schema.sql` no SQL Editor do Supabase para criar todas as tabelas. Opcionalmente, execute `supabase/seed.sql` para popular skills iniciais.

### Tabelas

| Tabela | Descrição |
|---|---|
| `profiles` | Dados do usuário, papel (aluno/egresso/empresa/instituição) e vínculo institucional |
| `institutions` | Universidades/faculdades parceiras |
| `courses` | Cursos oferecidos por instituições |
| `learning_tracks` | Trilhas de aprendizado (conjuntos de cursos) |
| `track_courses` | Relação trilha ↔ cursos com ordem |
| `skills` | Competências disponíveis |
| `course_skills` | Competências exigidas por cada curso |
| `user_skills` | Competências do usuário com origem rastreável |
| `enrollments` | Matrículas de alunos em cursos |
| `certifications` | Certificações emitidas com código de verificação |
| `trajectory_events` | Timeline polimórfica de atividades |
| `achievements` | Conquistas do sistema |
| `user_achievements` | Conquistas desbloqueadas pelo usuário |
| `opportunities` | Oportunidades (vagas, estágios, bolsas, etc.) |
| `opportunity_skills` | Competências exigidas pela oportunidade |
| `applications` | Candidaturas dos alunos às oportunidades |

### Funções SQL

- `complete_course(user_id, course_id)` — Conclui um curso, gerando: matrícula, trajectory_event, user_skills e certificação.
- `calculate_compatibility(user_id, opportunity_id)` — Calcula compatibilidade (0-100%) entre as skills do usuário e as exigidas pela oportunidade.
- `unified_search(query)` — Busca unificada com `pg_trgm` (tolerância a erro de digitação) em cursos, skills e oportunidades.
- `generate_verification_code()` — Gera código alfanumérico de 12 caracteres.

## Funcionalidades implementadas

### Fase 0 — Fundação
- Autenticação (cadastro/login) com Supabase Auth
- Tema visual UniConnect (laranja #FF8A00, Poppins)
- shadcn/ui configurado com tema da marca
- Middleware de proteção de rotas
- Roteamento por papel (aluno/admin)

### Fase 1 — Perfil, trajetória e competências
- Edição de perfil acadêmico (nome, bio, instituição, curso, semestre, ano de ingresso)
- Gerenciamento de competências com busca e badges
- Timeline de eventos de trajetória
- Sistema de conquistas com progresso

### Fase 2 — Academia
- CRUD de cursos no painel admin (com competências vinculadas)
- CRUD de trilhas de aprendizado no painel admin
- Catálogo de cursos público com busca
- Matrícula em cursos
- Conclusão de curso com geração automática de: trajectory_event, user_skills e certificação
- Certificação com código de verificação público

### Fase 3 — Oportunidades, busca e compatibilidade
- CRUD de oportunidades no painel admin (título, tipo, modalidade, local, competências exigidas)
- Catálogo de oportunidades para o aluno com score de compatibilidade
- Cálculo de compatibilidade por regra (interseção de skills, sem IA)
- Candidatura simples a oportunidades
- Busca unificada com tolerância a erros de digitação (cursos, skills, oportunidades)
- Filtros por tipo e modalidade de oportunidade
- Indicador visual de compatibilidade (verde ≥80%, amarelo ≥50%, vermelho <50%)
- Skills exigidas destacadas em verde quando o usuário já as possui

## Comandos úteis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar servidor de produção
npm run lint     # Verificar código com ESLint
npx tsc --noEmit # Verificar tipos TypeScript
```
