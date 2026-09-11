# Trajetória Unicatólica

> **A graduação termina. A conexão não.**

MVP desenvolvido durante o **Hackathon Unicatólica** — Trilha CONECTAR, Desafio 16: *Estudantes, egressos e oportunidades*.

## 💡 Sobre o projeto

Uma plataforma de **engajamento, reconhecimento e conexão de talentos** da Unicatólica.

O estudante acumula pontos e conquistas ao participar de atividades acadêmicas e profissionais (projetos, pesquisa, extensão, monitoria, eventos, certificações, estágios, voluntariado), construindo um **perfil de trajetória** que o conecta a novas oportunidades — mesmo após a formatura.

**Problema:** ausência de mecanismos que conectem talentos formados às demandas do mercado, e falta de continuidade no relacionamento entre universidade, estudante e egresso.

**Solução:** transformar `Participação → Trajetória → Reconhecimento → Oportunidades → Conexão`.

## 🚀 Como funciona

1. O aluno registra atividades acadêmicas e profissionais
2. A universidade aprova e atribui pontos
3. O aluno evolui de nível e desbloqueia conquistas
4. Seu perfil de talento fica visível para oportunidades de mercado
5. Após a graduação, o vínculo continua via mentorias, eventos e networking

## 🛠️ Tecnologias

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Auth + Postgres + Storage)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/) (deploy)

## 📦 Rodando o projeto localmente

```bash
# clone o repositório
git clone https://github.com/seu-usuario/hackathon-uni-catolica.git
cd hackathon-uni-catolica

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

- `profiles` — dados do usuário, pontos totais e nível
- `activity_categories` — tipos de atividade e valor em pontos
- `activities` — atividades registradas pelo aluno (com status de aprovação)
- `achievements` — conquistas/badges desbloqueadas

O script SQL completo de criação das tabelas está em [`/supabase/schema.sql`](./supabase/schema.sql).

## 📁 Estrutura do projeto

```
app/
├── (auth)/          # login e cadastro
├── (student)/        # dashboard, atividades, conquistas, oportunidades
├── (admin)/          # aprovação de atividades
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