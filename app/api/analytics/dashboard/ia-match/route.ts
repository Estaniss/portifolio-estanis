// app/api/analytics/dashboard/ia-match/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/require-admin";

interface IaMatchRunRow {
  company_name: string | null;
  seniority: string | null;
  compatibility_score: number;
  predominant_stack: string[] | null;
  hard_skills: string[] | null;
  soft_skills: string[] | null;
  created_at: string;
}

const COMPATIBILITY_BUCKETS = [
  { label: "0-20", min: 0, max: 20 },
  { label: "21-40", min: 21, max: 40 },
  { label: "41-60", min: 41, max: 60 },
  { label: "61-80", min: 61, max: 80 },
  { label: "81-100", min: 81, max: 100 },
];

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 90); // janela maior — tendência de mercado precisa de mais histórico
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("ia_match_runs")
    .select(
      "company_name, seniority, compatibility_score, predominant_stack, hard_skills, soft_skills, created_at"
    )
    .gte("created_at", since);

  if (error) {
    console.error("[dashboard/ia-match] erro:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const runs = (data ?? []) as IaMatchRunRow[];

  if (runs.length === 0) {
    return NextResponse.json({
      range_days: days,
      total_analyses: 0,
      avg_compatibility: 0,
      max_compatibility: 0,
      min_compatibility: 0,
      compatibility_distribution: [],
      evolution_trend: [],
      companies: [],
      seniority_breakdown: [],
      stack_ranking: [],
      hard_skills_ranking: [],
      soft_skills_ranking: [],
    });
  }

  const scores = runs.map((r) => r.compatibility_score);
  const avgCompatibility = scores.reduce((a, b) => a + b, 0) / scores.length;

  const compatibilityDistribution = COMPATIBILITY_BUCKETS.map((bucket) => ({
    label: bucket.label,
    value: scores.filter((s) => s >= bucket.min && s <= bucket.max).length,
  }));

  const evolutionByDay = new Map<string, number>();
  for (const run of runs) {
    const day = run.created_at.slice(0, 10);
    evolutionByDay.set(day, (evolutionByDay.get(day) ?? 0) + 1);
  }
  const evolutionTrend = Array.from(evolutionByDay.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const companies = rankBy(runs, (r) => (r.company_name ? [r.company_name] : []));
  const seniorityBreakdown = rankBy(runs, (r) => (r.seniority ? [r.seniority] : []));
  const stackRanking = rankBy(runs, (r) => r.predominant_stack ?? []);
  const hardSkillsRanking = rankBy(runs, (r) => r.hard_skills ?? []);
  const softSkillsRanking = rankBy(runs, (r) => r.soft_skills ?? []);

  return NextResponse.json({
    range_days: days,
    total_analyses: runs.length,
    avg_compatibility: Number(avgCompatibility.toFixed(1)),
    max_compatibility: Math.max(...scores),
    min_compatibility: Math.min(...scores),
    compatibility_distribution: compatibilityDistribution,
    evolution_trend: evolutionTrend,
    companies,
    seniority_breakdown: seniorityBreakdown,
    stack_ranking: stackRanking,
    hard_skills_ranking: hardSkillsRanking,
    soft_skills_ranking: softSkillsRanking,
  });
}

function rankBy(
  runs: IaMatchRunRow[],
  extractor: (run: IaMatchRunRow) => string[]
): Array<{ label: string; value: number }> {
  const count = new Map<string, number>();

  for (const run of runs) {
    for (const value of extractor(run)) {
      count.set(value, (count.get(value) ?? 0) + 1);
    }
  }

  return Array.from(count.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
