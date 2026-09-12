# UniConnect — Design System

> Estude · Conecte · Conquiste

Este documento define a identidade visual e o sistema de componentes do UniConnect, derivados da marca (`slogan-uniconnect.png`). Para o produto/domínio, veja [`context.md`](./context.md); para a ordem de implementação, veja [`roadmap.md`](./roadmap.md).

---

## 1. Identidade da marca

- **Nome:** UniConnect
- **Slogan:** Estude · Conecte · Conquiste
- **Tagline:** A graduação termina. A conexão não.
- **Símbolo:** capelo de formatura estilizado + silhueta de pessoa — representa a transição de estudante para profissional conectado.
- **Variantes de logo:** colorida (laranja + cinza escuro), monocromática escura (para fundos claros) e monocromática clara/branca (para fundos escuros e o app icon).
- **Tom de voz:** direto, encorajador, profissional sem ser corporativo-frio. Fala com o aluno como alguém que já foi aluno — nunca institucional-burocrático.

---

## 2. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `--color-primary` (Laranja Principal) | `#FF8A00` | Ações primárias, destaques, ícones ativos, progresso, marca |
| `--color-foreground` (Cinza Escuro) | `#1F1F1F` | Texto principal, ícones sobre laranja, fundo do tema escuro |
| `--color-background` | `#FFFFFF` | Fundo do tema claro |
| `--color-muted` | `#F5F5F5` | Fundos secundários, cards, divisores sutis |
| `--color-border` | `#E5E5E5` | Bordas, inputs, separadores |

### 2.1 Acessibilidade de contraste (WCAG 2.1)

Cálculo de luminância relativa/contraste feito sobre as duas cores da marca:

| Combinação | Contraste | Resultado |
|---|---|---|
| Texto `#FF8A00` sobre fundo branco `#FFFFFF` | ≈ 2.36:1 | ❌ Falha AA para texto (mínimo 4.5:1) |
| Texto branco `#FFFFFF` sobre fundo `#FF8A00` | ≈ 1.78:1 | ❌ Falha AA |
| Texto/ícone `#1F1F1F` sobre fundo `#FF8A00` | ≈ 6.97:1 | ✅ Passa AA, próximo de AAA (7:1) |
| Texto `#1F1F1F` sobre fundo branco `#FFFFFF` | ≈ 16.1:1 | ✅ Passa AAA |

**Regras práticas de uso:**

- ✅ Laranja como **fundo** de botão/badge/destaque, com texto/ícone **`#1F1F1F` por cima** (nunca branco).
- ✅ Laranja como **acento** (ícone ativo, borda, indicador de progresso, sublinhado) em elementos grandes o suficiente para não depender de contraste de texto fino.
- ❌ Nunca usar laranja como cor de **texto pequeno** sobre fundo claro (falha AA).
- ❌ Nunca usar **texto branco diretamente sobre laranja** (falha AA) — se precisar de laranja com texto claro, escureça o laranja (~15-20%) antes.
- Em tema escuro, mantenha a mesma regra: laranja é fundo/acento, nunca cor de texto de leitura corrida.

---

## 3. Tipografia

- **Fonte:** Poppins (Google Fonts), substituindo Geist no scaffold atual.
- **Pesos usados:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

| Estilo | Peso | Tamanho | Uso |
|---|---|---|---|
| Display | 700 | 2.25rem–3rem | Títulos de página, hero |
| H1 | 600 | 1.875rem | Título de seção principal |
| H2 | 600 | 1.5rem | Subtítulo de seção |
| H3 | 500 | 1.25rem | Título de card |
| Body | 400 | 1rem | Texto corrido |
| Small | 400 | 0.875rem | Metadados, legendas, timestamps |
| Label | 500 | 0.75rem (uppercase, tracking-wide) | Rótulos de badge/categoria |

---

## 4. Iconografia

Estilo **outline** (traço, não preenchido), consistente com os 6 ícones da marca. Cada módulo funcional tem um ícone fixo, reutilizado em nav, cards e badges:

| Módulo | Ícone (referência lucide-react) |
|---|---|
| Cursos e Trilhas | `graduation-cap` |
| Certificações | `award` |
| Eventos | `calendar` |
| Networking | `users` |
| Oportunidades | `briefcase` |
| Projetos | `folder-kanban` |

Recomenda-se a biblioteca `lucide-react` (compatível com shadcn/ui) por já oferecer variantes outline equivalentes.

---

## 5. Espaçamento e layout

- **Escala de espaçamento:** múltiplos de 4px (Tailwind padrão: `1 = 4px`).
- **Container:** `max-width: 1280px`, padding lateral `1rem` (mobile) / `2rem` (desktop).
- **Raio de borda:** `--radius: 0.75rem` (cards, botões, inputs) — visual amigável, não muito arredondado.
- **Breakpoints:** Tailwind padrão (`sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`).
- **Grid de cards:** 1 coluna (mobile) → 2 (tablet) → 3–4 (desktop).

---

## 6. Componentes (Tailwind v4 + shadcn/ui)

| Componente | Base shadcn/ui | Notas de tema |
|---|---|---|
| Botão primário | `Button` (`variant="default"`) | fundo `--color-primary`, texto `--color-foreground` |
| Botão secundário | `Button` (`variant="outline"`) | borda `--color-border`, texto `--color-foreground` |
| Card | `Card` | fundo `--color-muted` ou branco, borda sutil, radius padrão |
| Badge de competência | `Badge` | fundo `--color-muted`, texto `--color-foreground`, borda laranja fina |
| Badge de status (seleção/candidatura) | `Badge` | variantes semânticas: pendente (cinza), aprovado (verde), reprovado (vermelho) — cores semânticas fora da paleta de marca |
| Input / Select / Textarea | `Input` / `Select` / `Textarea` | borda `--color-border`, foco com anel laranja (`ring-primary`) |
| Navegação (topo/lateral) | custom, ícones outline | item ativo com acento laranja (borda esquerda ou ícone preenchido) |
| Barra de progresso (trajetória, trilha) | `Progress` | preenchimento laranja sobre trilho `--color-muted` |
| Timeline (trajetória) | custom | linha vertical `--color-border`, pontos de evento em laranja |
| Avatar | `Avatar` | anel laranja opcional para indicar mentor/destaque |

---

## 7. Tema (claro/escuro) — Tailwind v4

Seguindo o padrão já usado em `uni-connect/app/globals.css` (`@theme inline` + variáveis CSS, Tailwind v4 — **não** `tailwind.config.js`):

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #1f1f1f;
  --primary: #ff8a00;
  --primary-foreground: #1f1f1f;
  --muted: #f5f5f5;
  --muted-foreground: #6b6b6b;
  --border: #e5e5e5;
  --radius: 0.75rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --radius-md: var(--radius);
  --font-sans: var(--font-poppins);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1f1f1f;
    --foreground: #f5f5f5;
    --primary: #ff8a00;
    --primary-foreground: #1f1f1f;
    --muted: #2a2a2a;
    --muted-foreground: #a3a3a3;
    --border: #3a3a3a;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), sans-serif;
}
```

Troca de fonte em `app/layout.tsx` (Geist → Poppins):

```tsx
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

---

## 8. Tom de voz e microcopy

- Segunda pessoa, direta: "Complete seu perfil" em vez de "O perfil deve ser completado".
- Celebra conquistas sem exagero: "Certificado emitido 🎓" em vez de "Parabéns campeão, você é incrível!!!".
- Erros e vazios são orientativos, não punitivos: "Você ainda não tem projetos. Que tal criar o primeiro?" em vez de "Nenhum dado encontrado."
- Nunca usa jargão institucional-burocrático em telas do aluno/egresso (evitar "requerente", "protocolo", "processo administrativo").
