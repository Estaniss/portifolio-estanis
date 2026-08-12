-- ============================================================
-- Analytics do Portfólio — Fase 5
-- Schema: ai_reports
-- Rodar no SQL Editor do Supabase, depois do 003_schema_fase4.sql
-- ============================================================

create table if not exists ai_reports (
  id bigint generated always as identity primary key,
  period text not null check (period in ('weekly', 'monthly', 'yearly')),
  reference_date date not null,
  summary_text text,
  content jsonb not null,
  created_at timestamptz not null default now()
);

-- Um relatório por período por data de referência (evita duplicar se o
-- cron rodar 2x no mesmo dia por retry do Vercel).
create unique index if not exists uq_ai_reports_period_ref
  on ai_reports (period, reference_date);

create index if not exists idx_ai_reports_period_created
  on ai_reports (period, created_at desc);

alter table ai_reports enable row level security;
-- Sem policies de propósito — mesmo padrão: só a service role acessa.
