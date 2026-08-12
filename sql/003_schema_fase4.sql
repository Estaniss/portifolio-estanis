-- ============================================================
-- Analytics do Portfólio — Fase 4
-- Schema: ia_match_runs
-- Rodar no SQL Editor do Supabase, depois do 002_schema_fase3.sql
-- ============================================================

create table if not exists ia_match_runs (
  id bigint generated always as identity primary key,
  session_id uuid references sessions(id) on delete set null,
  company_name text,                 -- opcional, só quando o usuário informar
  seniority text,                    -- ex: 'junior' | 'pleno' | 'senior'
  compatibility_score numeric(5,2) not null check (compatibility_score >= 0 and compatibility_score <= 100),
  predominant_stack text[] default '{}',
  hard_skills text[] default '{}',
  soft_skills text[] default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_ia_match_created_at on ia_match_runs (created_at);
create index if not exists idx_ia_match_session on ia_match_runs (session_id);

alter table ia_match_runs enable row level security;
-- Sem policies de propósito — mesmo padrão das outras tabelas: só a
-- service role (server-side) acessa.

-- Por que uma tabela dedicada em vez de usar `events.event_payload` (jsonb)
-- como as outras fases: os dados aqui têm colunas array (stack, hard_skills,
-- soft_skills) que precisam ser agregadas e rankeadas com frequência — fazer
-- isso via jsonb em cima de milhares de linhas de `events` seria bem mais
-- lento e mais complicado de indexar do que colunas nativas `text[]`.
