// app/api/analytics/dashboard/projects/route.ts
//
// Agrega, em JS (mesmo padrão da Fase 1 — volume de portfólio não
// justifica função SQL dedicada ainda): views, cliques por tipo,
// tempo médio, ranking de tecnologias e evolução diária de views.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EVENT_TYPES } from "@/lib/analytics/events";
import type {
  ProjectEventPayload,
  ProjectTimeSpentPayload,
} from "@/lib/analytics/events";

const RELEVANT_EVENT_TYPES = [
  EVENT_TYPES.PROJECT_VIEW,
  EVENT_TYPES.PROJECT_TIME_SPENT,
  EVENT_TYPES.CLICK_GITHUB,
  EVENT_TYPES.CLICK_DEMO,
  EVENT_TYPES.CLICK_CASE,
];

interface ProjectAgg {
  project_id: string;
  project_name: string;
  views: number;
  clicks_github: number;
  clicks_demo: number;
  clicks_case: number;
  technologies: Set<string>;
  durations: number[];
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data: events, error } = await supabaseAdmin
    .from("events")
    .select("event_type, event_payload, occurred_at")
    .in("event_type", RELEVANT_EVENT_TYPES)
    .gte("occurred_at", since);

  if (error) {
    console.error("[dashboard/projects] erro:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const byProject = new Map<string, ProjectAgg>();
  const viewsByDay = new Map<string, number>();
  const techCount = new Map<string, number>();

  for (const row of events) {
    const payload = row.event_payload as
      | ProjectEventPayload
      | ProjectTimeSpentPayload;

    if (!payload?.project_id) continue;

    const agg = byProject.get(payload.project_id) ?? {
      project_id: payload.project_id,
      project_name: payload.project_name,
      views: 0,
      clicks_github: 0,
      clicks_demo: 0,
      clicks_case: 0,
      technologies: new Set<string>(),
      durations: [],
    };

    switch (row.event_type) {
      case EVENT_TYPES.PROJECT_VIEW: {
        agg.views += 1;
        payload.technologies?.forEach((tech) => {
          agg.technologies.add(tech);
          techCount.set(tech, (techCount.get(tech) ?? 0) + 1);
        });

        const day = row.occurred_at.slice(0, 10); // YYYY-MM-DD
        viewsByDay.set(day, (viewsByDay.get(day) ?? 0) + 1);
        break;
      }
      case EVENT_TYPES.PROJECT_TIME_SPENT: {
        const { duration_seconds } = payload as ProjectTimeSpentPayload;
        if (typeof duration_seconds === "number") {
          agg.durations.push(duration_seconds);
        }
        break;
      }
      case EVENT_TYPES.CLICK_GITHUB:
        agg.clicks_github += 1;
        break;
      case EVENT_TYPES.CLICK_DEMO:
        agg.clicks_demo += 1;
        break;
      case EVENT_TYPES.CLICK_CASE:
        agg.clicks_case += 1;
        break;
    }

    byProject.set(payload.project_id, agg);
  }

  const projects = Array.from(byProject.values())
    .map((agg) => ({
      project_id: agg.project_id,
      project_name: agg.project_name,
      views: agg.views,
      clicks_github: agg.clicks_github,
      clicks_demo: agg.clicks_demo,
      clicks_case: agg.clicks_case,
      technologies: Array.from(agg.technologies),
      avg_time_seconds:
        agg.durations.length > 0
          ? Math.round(
              agg.durations.reduce((a, b) => a + b, 0) / agg.durations.length
            )
          : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const topProjects = projects.slice(0, 10);
  const leastAccessed = [...projects]
    .filter((p) => p.views > 0)
    .sort((a, b) => a.views - b.views)
    .slice(0, 5);

  const growthTrend = Array.from(viewsByDay.entries())
    .map(([day, views]) => ({ day, views }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const techRanking = Array.from(techCount.entries())
    .map(([technology, count]) => ({ technology, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    range_days: days,
    top_projects: topProjects,
    least_accessed: leastAccessed,
    growth_trend: growthTrend,
    tech_ranking: techRanking,
    most_accessed_project: projects[0] ?? null,
  });
}
