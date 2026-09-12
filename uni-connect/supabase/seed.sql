-- ============================================================
-- UniConnect — Seed completo para apresentação
-- Execute APÓS o schema.sql
-- ============================================================

-- ============================================================
-- SKILLS (45 competências)
-- ============================================================

insert into skills (name, slug) values
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('Node.js', 'nodejs'),
  ('Python', 'python'),
  ('Java', 'java'),
  ('C#', 'csharp'),
  ('PHP', 'php'),
  ('Ruby', 'ruby'),
  ('Go', 'go'),
  ('Rust', 'rust'),
  ('SQL', 'sql'),
  ('PostgreSQL', 'postgresql'),
  ('MySQL', 'mysql'),
  ('MongoDB', 'mongodb'),
  ('Redis', 'redis'),
  ('Docker', 'docker'),
  ('Kubernetes', 'kubernetes'),
  ('AWS', 'aws'),
  ('Azure', 'azure'),
  ('Google Cloud', 'gcp'),
  ('Git', 'git'),
  ('HTML', 'html'),
  ('CSS', 'css'),
  ('Tailwind CSS', 'tailwindcss'),
  ('Sass', 'sass'),
  ('Figma', 'figma'),
  ('UI/UX Design', 'uiux-design'),
  ('Agile/Scrum', 'agile-scrum'),
  ('CI/CD', 'cicd'),
  ('Linux', 'linux'),
  ('REST API', 'rest-api'),
  ('GraphQL', 'graphql'),
  ('Testing', 'testing'),
  ('Machine Learning', 'machine-learning'),
  ('Data Science', 'data-science'),
  ('Power BI', 'power-bi'),
  ('Excel Avançado', 'excel-avancado'),
  ('Comunicação', 'comunicacao'),
  ('Liderança', 'lideranca'),
  ('Trabalho em Equipe', 'trabalho-em-equipe'),
  ('Gestão de Projetos', 'gestao-de-projetos'),
  ('Inglês', 'ingles'),
  ('Espanhol', 'espanhol');

-- ============================================================
-- INSTITUIÇÕES (3 universidades)
-- ============================================================

insert into institutions (id, name, slug, website) values
  ('a0000000-0000-0000-0000-000000000001', 'Universidade Católica de Brasília', 'ucb', 'https://www.ucb.br'),
  ('a0000000-0000-0000-0000-000000000002', 'Universidade de Brasília', 'unb', 'https://www.unb.br'),
  ('a0000000-0000-0000-0000-000000000003', 'Centro Universitário de Brasília', 'uniceub', 'https://www.uniceub.br');

-- ============================================================
-- CURSOS (8 cursos)
-- ============================================================

insert into courses (id, institution_id, name, description, area, workload_hours) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Ciência da Computação', 'Formação completa em computação com foco em desenvolvimento de software, inteligência artificial e ciência de dados.', 'Tecnologia', 3200),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Engenharia de Software', 'Desenvolvimento de sistemas de software com metodologias ágeis, arquitetura e testes.', 'Tecnologia', 3000),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Sistemas de Informação', 'Convergência de tecnologia e gestão de negócios para transformação digital.', 'Tecnologia', 2800),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Design Digital', 'Design de interfaces, experiência do usuário e prototipação de produtos digitais.', 'Design', 2600),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'Administração com Ênfase em Tecnologia', 'Gestão empresarial aplicada ao ecossistema de tecnologia.', 'Gestão', 2400),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Matemática Computacional', 'Modelagem matemática e computacional para resolução de problemas complexos.', 'Tecnologia', 3000),
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'Ciência de Dados', 'Análise estatística, machine learning e visualização de dados.', 'Tecnologia', 2800),
  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Redes e Segurança', 'Infraestrutura de redes, cybersegurança e sistemas distribuídos.', 'Tecnologia', 2600);

-- ============================================================
-- SKILLS DOS CURSOS (competências vinculadas)
-- ============================================================

-- Ciência da Computação
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000001', id from skills where slug in ('python', 'java', 'sql', 'git', 'docker', 'machine-learning');

-- Engenharia de Software
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000002', id from skills where slug in ('javascript', 'typescript', 'react', 'nodejs', 'git', 'agile-scrum', 'testing');

-- Sistemas de Informação
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000003', id from skills where slug in ('sql', 'excel-avancado', 'power-bi', 'gestao-de-projetos', 'comunicacao');

-- Design Digital
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000004', id from skills where slug in ('figma', 'uiux-design', 'html', 'css', 'tailwindcss');

-- Administração com Ênfase em Tecnologia
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000005', id from skills where slug in ('excel-avancado', 'power-bi', 'gestao-de-projetos', 'comunicacao', 'lideranca');

-- Matemática Computacional
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000006', id from skills where slug in ('python', 'machine-learning', 'data-science', 'sql');

-- Ciência de Dados
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000007', id from skills where slug in ('python', 'machine-learning', 'data-science', 'power-bi', 'sql');

-- Redes e Segurança
insert into course_skills (course_id, skill_id) select 'b0000000-0000-0000-0000-000000000008', id from skills where slug in ('linux', 'docker', 'aws', 'git');

-- ============================================================
-- TRILHAS DE APRENDIZADO (3 trilhas)
-- ============================================================

insert into learning_tracks (id, institution_id, name, description, area) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Trilha Full Stack', 'Domine frontend, backend e banco de dados para se tornar um desenvolvedor full stack completo.', 'Tecnologia'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Trilha Ciência de Dados', 'Aprenda a extrair insights de dados com Python, estatística e machine learning.', 'Dados'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Trilha Product Design', 'Do conceito ao protótipo: design de produtos digitais com foco no usuário.', 'Design');

-- Cursos das trilhas
insert into track_courses (track_id, course_id, position) values
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 1),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 2),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 1),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 2),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 1);

-- ============================================================
-- SKILLS ADICIONAIS (para uso manual dos alunos)
-- ============================================================

-- (as skills já foram inseridas acima, não precisa duplicar)

-- ============================================================
-- NOTA: Os dados abaixo (oportunidades, etc.) dependem de
-- auth.users existir. Execute-os APÓS ter pelo menos 1
-- usuário criado via cadastro, OU insira diretamente na
-- tabela profiles com IDs de teste.
-- ============================================================

-- Para a apresentação, vamos criar oportunidades diretamente
-- (assumindo que o publisher_id será de um usuário existente)

-- ============================================================
-- OPORTUNIDADES (6 vagas de exemplo)
-- ============================================================

-- Nota: publisher_id será preenchido depois com o ID do usuário demo
-- Por enquanto, vamos usar um UUID fixo para demonstração
-- O usuário demo deve se cadastrar e depois rodar:
-- UPDATE opportunities SET publisher_id = '<SEU_ID>' WHERE publisher_id = 'demo-user-00001';

insert into opportunities (id, publisher_id, title, description, type, modality, location, workload_hours, compensation) values
  ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Estágio Frontend React', 'Buscamos desenvolvedor frontend para integrar nosso time de produto. Trabalho com React, TypeScript e design system.', 'estagio', 'hibrido', 'Brasília, DF', 20, 'R$ 2.000/mês'),
  ('d0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Júnior Python Developer', 'Vaga para desenvolvedor Python com conhecimento em APIs REST e bancos de dados. Projeto de dados analíticos.', 'emprego', 'remoto', null, 40, 'R$ 4.500/mês'),
  ('d0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Bolsa de Pesquisa em Machine Learning', 'Projeto de iniciação científica aplicando ML em problemas de saúde pública. Período de 12 meses.', 'bolsa', 'presencial', 'Brasília, DF', 30, 'R$ 1.800/mês'),
  ('d0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Freelance UI/UX Designer', 'Precisamos de designer para criar interface de aplicativo mobile de fintech. Figma e prototipação.', 'freelance', 'remoto', null, 15, 'R$ 3.000 por projeto'),
  ('d0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'Monitoria de Banco de Dados', 'Vaga de monitor para disciplina de Banco de Dados. Auxiliar alunos em SQL e modelagem.', 'monitoria', 'presencial', 'Brasília, DF', 10, 'Bolsa + certificado'),
  ('d0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'Hackathon UniConnect 2026', 'Participe do maior hackathon de tecnologia da região! 48h de desenvolvimento, mentoria e prêmios.', 'hackathon', 'presencial', 'Brasília, DF', 48, 'Prêmios até R$ 10.000');

-- Competências exigidas por cada oportunidade
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000001', id from skills where slug in ('react', 'typescript', 'javascript', 'css', 'figma');
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000002', id from skills where slug in ('python', 'rest-api', 'postgresql', 'docker');
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000003', id from skills where slug in ('python', 'machine-learning', 'data-science');
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000004', id from skills where slug in ('figma', 'uiux-design');
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000005', id from skills where slug in ('sql', 'postgresql', 'comunicacao');
insert into opportunity_skills (opportunity_id, skill_id) select 'd0000000-0000-0000-0000-000000000006', id from skills where slug in ('javascript', 'python', 'react', 'nodejs', 'trabalho-em-equipe');

-- ============================================================
-- CONQUISTAS ADICIONAIS
-- ============================================================

insert into achievements (name, description, icon, category, criteria) values
  ('Candidato', 'Candidatou-se a uma oportunidade', 'Send', 'oportunidades', '{"type": "application_count", "min": 1}'),
  ('Proativo', 'Candidatou-se a 3 ou mais oportunidades', 'Rocket', 'oportunidades', '{"type": "application_count", "min": 3}')
on conflict (name) do nothing;
