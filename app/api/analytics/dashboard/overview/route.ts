// app/api/analytics/dashboard/overview/route.ts
//
// Métricas gerais (Fase 1): totais, únicos, bounce rate, duração
// média, origem de acesso e breakdown de device/browser/os.
// Protegida por requireAdmin — só você acessa.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data: sessions, error } = await supabaseAdmin
    .from("sessions")
    .select(
      "id, visitor_id, started_at, ended_at, referrer_source, device_type, browser, os, is_bounce"
    )
    .gte("started_at", since);

  if (error) {
    console.error("[dashboard/overview] erro:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const totalSessions = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id)).size;
  const bounces = sessions.filter((s) => s.is_bounce).length;
  const bounceRate = totalSessions > 0 ? bounces / totalSessions : 0;

  const durations = sessions
    .filter((s) => s.ended_at)
    .map(
      (s) =>
        (new Date(s.ended_at as string).getTime() -
          new Date(s.started_at).getTime()) /
        1000
    );
  const avgDurationSeconds =
    durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

  return NextResponse.json({
    range_days: days,
    total_sessions: totalSessions,
    unique_visitors: uniqueVisitors,
    bounce_rate: Number(bounceRate.toFixed(3)),
    avg_duration_seconds: Math.round(avgDurationSeconds),
    by_referrer_source: countBy(sessions, "referrer_source"),
    by_device_type: countBy(sessions, "device_type"),
    by_browser: countBy(sessions, "browser"),
    by_os: countBy(sessions, "os"),
  });
}

function countBy<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T
): Record<string, number> {
  return rows.reduce((acc, row) => {
    const value = String(row[key] ?? "unknown");
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
