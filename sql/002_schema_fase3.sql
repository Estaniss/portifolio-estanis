-- ============================================================
-- Analytics do Portfólio — Fase 3
-- Schema: funnel_steps (funil configurável)
-- Rodar no SQL Editor do Supabase, depois do 001_schema_fase1.sql
-- ============================================================

create table if not exists funnel_steps (
  step_order int primary key,
  step_name text not null,
  event_type text not null,   -- 'pageview' | 'project_view' | 'download_cv' | 'ia_match_run' | 'contact_click' | 'contact_submit'
  path_prefix text            -- só usado quando event_type = 'pageview'; null = qualquer path
);

-- Seed inicial — AJUSTE path_prefix conforme a estrutura real do seu site.
-- Se o portfólio for single-page (seções por âncora, não rotas separadas),
-- os passos "Home" e "Projetos" podem precisar virar eventos customizados
-- (ex: scroll até a seção de projetos) em vez de pageview por path — ver
-- nota no README da Fase 3.
insert into funnel_steps (step_order, step_name, event_type, path_prefix) values
  (1, 'Home', 'pageview', '/'),
  (2, 'Projetos', 'pageview', '/projetos'),
  (3, 'Projeto', 'project_view', null),
  (4, 'Download Currículo', 'download_cv', null),
  (5, 'IA Match', 'ia_match_run', null),
  (6, 'Contato', 'contact_click', null)
on conflict (step_order) do update set
  step_name = excluded.step_name,
  event_type = excluded.event_type,
  path_prefix = excluded.path_prefix;

alter table funnel_steps enable row level security;
-- Sem policies de propósito — só a service role (server-side) lê/escreve.

-- ------------------------------------------------------------
-- Nota sobre "Visitante" (topo do funil, spec original):
-- não vira uma linha em funnel_steps porque é simplesmente o total
-- de sessions no período — calculado direto na rota de agregação,
-- sem precisar de matcher.
-- ------------------------------------------------------------
