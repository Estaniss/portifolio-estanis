-- ============================================================
-- Analytics do Portfólio — Fase 1
-- Schema: sessions + events (núcleo do tracking)
-- Rodar no SQL Editor do Supabase
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: sessions
-- 1 linha por visita (identificada por um visitor_id anônimo)
-- ------------------------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  referrer text,
  referrer_source text,        -- normalizado: 'linkedin' | 'github' | 'google' | 'direct' | 'other'
  country text,
  city text,
  language text,
  device_type text,            -- 'desktop' | 'mobile' | 'tablet'
  browser text,
  os text,
  pageview_count int not null default 0,
  is_bounce boolean not null default true
);

create index if not exists idx_sessions_visitor on sessions (visitor_id);
create index if not exists idx_sessions_started_at on sessions (started_at);

-- ------------------------------------------------------------
-- Tabela: events
-- Todo evento bruto (pageview, cliques, downloads, etc.)
-- Fase 1 usa principalmente 'pageview'; os demais event_types
-- (project_view, click_github, download_cv, ia_match_run...)
-- entram nas próximas fases sem precisar migrar nada aqui.
-- ------------------------------------------------------------
create table if not exists events (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  page_path text,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_events_type_time on events (event_type, occurred_at);
create index if not exists idx_events_session on events (session_id);

-- ------------------------------------------------------------
-- RLS: ninguém lê/escreve direto do client.
-- Toda escrita e leitura passa pelas Route Handlers usando a
-- service role key (server-side only). Isso é intencional:
-- o client nunca fala com o Supabase diretamente.
-- ------------------------------------------------------------
alter table sessions enable row level security;
alter table events enable row level security;

-- Nenhuma policy criada para anon/authenticated de propósito.
-- Sem policies + RLS habilitado = acesso bloqueado por padrão
-- para qualquer chave que não seja a service role.

-- ------------------------------------------------------------
-- View: overview_daily
-- Agregação simples usada pelo dashboard (Fase 1)
-- ------------------------------------------------------------
create or replace view overview_daily as
select
  date_trunc('day', started_at) as day,
  count(*) as total_sessions,
  count(distinct visitor_id) as unique_visitors,
  count(*) filter (where is_bounce) as bounce_sessions,
  avg(extract(epoch from (coalesce(ended_at, started_at) - started_at)))
    as avg_duration_seconds
from sessions
group by 1
order by 1 desc;
