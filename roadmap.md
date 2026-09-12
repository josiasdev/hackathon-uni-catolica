# UniConnect — Roadmap de Implementação

A visão completa em [`context.md`](./context.md) tem 15 módulos funcionais — maior do que qualquer time constrói em um hackathon. Este documento define **o que entra no MVP do hackathon** (Fases 0–3) e **o que fica para depois** (Fases 4+), em ordem de dependência técnica.

Critério de corte do MVP: o menor conjunto de módulos que já demonstra o **loop de integração central** (curso → competência → trajetória → conquista → compatibilidade → oportunidade) ponta a ponta, para um único perfil de Aluno, com dados reais no banco (sem mocks).

---

## Fase 0 — Fundação

Infraestrutura sem a qual nada mais funciona.

- [ ] Configurar Supabase (projeto, Auth, Postgres) e variáveis de ambiente (`.env.example` real, hoje ausente do repo)
- [ ] Habilitar extensão `pg_trgm` no Postgres (busca aproximada, [context.md §3.9](./context.md#39-busca))
- [ ] Schema inicial: `profiles` (com `role`: aluno/egresso/empresa/instituição), `institutions`, `skills`
- [ ] Autenticação (cadastro/login) e roteamento por papel usando os route groups já existentes (`(auth)/`, `(student)/`, `(admin)/`)
- [ ] Tema visual aplicado: Tailwind v4 tokens + Poppins de [`design.md`](./design.md#7-tema-claroescuro--tailwind-v4)
- [ ] shadcn/ui instalado e configurado com o tema da marca

## Fase 1 — Perfil, trajetória e competências

O núcleo do produto: sem isso não há "loop de integração".

- [ ] Perfil do Aluno (dados acadêmicos, foto, bio, curso, semestre)
- [ ] `user_skills` — competências agregadas, com origem rastreável ([context.md §6](./context.md#6-modelo-de-dados-conceitual))
- [ ] `trajectory_events` — timeline polimórfica (visual: componente Timeline de [`design.md`](./design.md#6-componentes-tailwind-v4--shadcnui))
- [ ] Conquistas básicas (`achievements`, `user_achievements`) — regras simples (ex.: primeiro curso concluído)

## Fase 2 — Academia

Primeira fonte real de dados para trajetória/competências.

- [ ] Instituição cria cursos e trilhas (CRUD básico, painel `(admin)`)
- [ ] Aluno se matricula e conclui curso → gera `user_skill` + `trajectory_event`
- [ ] Certificação emitida ao concluir curso, com código de verificação público

## Fase 3 — Oportunidades, busca e compatibilidade

Fecha o loop: mostra o valor da trajetória construída nas Fases 1–2.

- [ ] Empresa/instituição publica oportunidades com competências exigidas
- [ ] Busca unificada com `pg_trgm` (tolerância a erro de digitação, [context.md §3.9](./context.md#39-busca))
- [ ] Cálculo de compatibilidade por regra (interseção de competências, [context.md §3.10](./context.md#310-compatibilidade)) — **sem IA**
- [ ] Candidatura simples a uma oportunidade

> **Linha de corte do hackathon:** um MVP demonstrável termina aqui. Da Fase 4 em diante é a visão completa do produto, priorizável conforme tempo restante.

---

## Fase 4 — Projetos e equipes

- [ ] CRUD de projetos com vagas internas ([context.md §3.5](./context.md#35-projetos-e-formação-de-equipes))
- [ ] Candidatura a vaga de projeto (reaproveita `APPLICATION` genérica)

## Fase 5 — Eventos e presença

- [ ] CRUD de eventos com visibilidade configurável ([context.md §3.6](./context.md#36-eventos-e-presença))
- [ ] Check-in por QR Code (mais simples de implementar que geofence em prazo curto)
- [ ] Presença confirmada gera `trajectory_event` + competência/conquista quando aplicável

## Fase 6 — Seleções

- [ ] Processos seletivos com etapas configuráveis ([context.md §3.7](./context.md#37-seleções))
- [ ] Acompanhamento de status pelo candidato

## Fase 7 — Networking, mentorias, comunidade e notificações

- [ ] Conexões entre usuários e busca de pessoas
- [ ] Mentorias (oferta, solicitação, aceite)
- [ ] Feed de comunidade
- [ ] Notificações (in-app; e-mail/push fora do MVP)

## Fase 8 — Empresas, gestão universitária, analytics e empregabilidade

- [ ] Busca de talentos e perfis salvos para empresas
- [ ] Painel institucional com indicadores agregados ([context.md §3.14](./context.md#314-gestão-universitária-e-analytics))
- [ ] Métricas de empregabilidade de egressos

## Fase 9 — IA e recomendação (futuro, fora do escopo atual)

Explicitamente adiado — ver [context.md §4](./context.md#4-fora-do-escopo-por-enquanto). Só começa depois que houver volume real de dados estruturados das fases anteriores.

- [ ] Recomendação de cursos/vagas
- [ ] Matching aluno↔empresa, pessoa↔projeto, mentor↔aluno
- [ ] Assistente de carreira baseado em trajetória

---

## Como usar este roadmap

- Cada fase é sequencial em dependência de dados (ex.: Fase 3 precisa de competências geradas na Fase 1–2), mas o **trabalho de UI pode ser paralelizado** entre membros do time dentro de uma fase.
- Ao final de cada fase, valide o loop ponta a ponta com um usuário de teste real — não avance com dados mockados.
- Se o tempo do hackathon acabar no meio de uma fase, prefira **entregar a fase anterior completa e funcional** a deixar duas fases parcialmente feitas.
