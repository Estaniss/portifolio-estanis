// lib/ai/build-summary.ts
//
// Monta um JSON pequeno com os números já agregados do período, pra
// mandar pra IA — NUNCA o banco bruto. Isso mantém o custo/latência da
// chamada baixos e evita o LLM ter que "fazer conta" (soma, ranking)
// que o Postgres/JS já fazem melhor e de graça.
//
// Reaproveita o mesmo padrão de agregação em JS das rotas de dashboard
// (Fases 1-4) — aqui duplico consultas em vez de chamar as rotas HTTP
// internamente, porque o cron roda fora do ciclo de request e não tem
// sentido montar URLs pra chamar a si mesmo.

import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { EVENT_TYPES } from "@/lib/analytics/events";

export type Period = "weekly" | "monthly" | "yearly";

const PERIOD_DAYS: Record<Period, number> = {
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

export interface AnalyticsSummary {
  period: Period;
  range_days: number;
  overview: {
    total_sessions: number;
    unique_visitors: number;
    bounce_rate: number;
  };
  top_projects: Array<{ project_name: string; views: number }>;
  tech_ranking: Array<{ technology: string; count: number }>;
  ia_match: {
    total_analyses: number;
    avg_compatibility: number | null;
    top_hard_skills: string[];
    top_soft_skills: string[];
    top_stack: string[];
  };
  downloads_total: number;
  contact_submits: number;
}

export async function buildAnalyticsSummary(
  period: Period
): Promise<AnalyticsSummary> {
  const days = PERIOD_DAYS[period];
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [sessionsResult, eventsResult, iaMatchResult] = await Promise.all([
    supabaseAdmin
      .from("sessions")
      .select("visitor_id, is_bounce")
      .gte("started_at", since),
    supabaseAdmin
      .from("events")
      .select("event_type, event_payload")
      .gte("occurred_at", since)
      .in("event_type", [
        EVENT_TYPES.PROJECT_VIEW,
        EVENT_TYPES.DOWNLOAD_CV,
        EVENT_TYPES.CONTACT_SUBMIT,
      ]),
    supabaseAdmin
      .from("ia_match_runs")
      .select("compatibility_score, hard_skills, soft_skills, predominant_stack")
      .gte("created_at", since),
  ]);

  if (sessionsResult.error || eventsResult.error || iaMatchResult.error) {
    console.error(
      "[build-summary] falha ao consultar dados:",
      sessionsResult.error ?? eventsResult.error ?? iaMatchResult.error
    );
    throw new Error(
      "Falha ao consultar o Supabase para montar o resumo — abortando geração do relatório em vez de gerar com dados incompletos."
    );
  }

  const sessions = sessionsResult.data ?? [];
  const events = eventsResult.data ?? [];
  const iaMatchRuns = iaMatchResult.data ?? [];

  const totalSessions = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id)).size;
  const bounces = sessions.filter((s) => s.is_bounce).length;

  const projectViews = new Map<string, number>();
  const techCount = new Map<string, number>();
  let downloadsTotal = 0;
  let contactSubmits = 0;

  for (const event of events) {
    const payload = event.event_payload as Record<string, unknown>;

    if (event.event_type === EVENT_TYPES.PROJECT_VIEW) {
      const name = String(payload.project_name ?? "desconhecido");
      projectViews.set(name, (projectViews.get(name) ?? 0) + 1);

      const technologies = (payload.technologies as string[]) ?? [];
      technologies.forEach((tech) => {
        techCount.set(tech, (techCount.get(tech) ?? 0) + 1);
      });
    }
    if (event.event_type === EVENT_TYPES.DOWNLOAD_CV) downloadsTotal += 1;
    if (event.event_type === EVENT_TYPES.CONTACT_SUBMIT) contactSubmits += 1;
  }

  const topProjects = Array.from(projectViews.entries())
    .map(([project_name, views]) => ({ project_name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const techRanking = Array.from(techCount.entries())
    .map(([technology, count]) => ({ technology, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const avgCompatibility =
    iaMatchRuns.length > 0
      ? Number(
          (
            iaMatchRuns.reduce((sum, r) => sum + r.compatibility_score, 0) /
            iaMatchRuns.length
          ).toFixed(1)
        )
      : null;

  return {
    period,
    range_days: days,
    overview: {
      total_sessions: totalSessions,
      unique_visitors: uniqueVisitors,
      bounce_rate:
        totalSessions > 0 ? Number((bounces / totalSessions).toFixed(3)) : 0,
    },
    top_projects: topProjects,
    tech_ranking: techRanking,
    ia_match: {
      total_analyses: iaMatchRuns.length,
      avg_compatibility: avgCompatibility,
      top_hard_skills: topValues(iaMatchRuns.flatMap((r) => r.hard_skills ?? []), 5),
      top_soft_skills: topValues(iaMatchRuns.flatMap((r) => r.soft_skills ?? []), 5),
      top_stack: topValues(iaMatchRuns.flatMap((r) => r.predominant_stack ?? []), 5),
    },
    downloads_total: downloadsTotal,
    contact_submits: contactSubmits,
  };
}

function topValues(values: string[], limit: number): string[] {
  const count = new Map<string, number>();
  values.forEach((v) => count.set(v, (count.get(v) ?? 0) + 1));
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}
