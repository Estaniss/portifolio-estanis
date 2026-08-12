// app/admin/page.tsx
//
// Server Component: busca as métricas direto no servidor (mesma
// auth check da API, então se não tiver sessão redireciona).
// Fase 1 mostra só o overview — as páginas de projetos, tecnologias,
// funil, etc. entram nas próximas fases como rotas irmãs.

import { redirect } from "next/navigation";
import { Grid, Stack, Typography } from "@mui/material";
import { requireAdmin } from "@/lib/auth/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { KpiCard } from "@/components/admin/KpiCard";

const RANGE_DAYS = 30;

export default async function AdminOverviewPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const overview = await fetchOverview();

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Visão geral — últimos {RANGE_DAYS} dias
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label="Sessões" value={overview.total_sessions} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label="Visitantes únicos" value={overview.unique_visitors} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Taxa de rejeição"
            value={`${(overview.bounce_rate * 100).toFixed(1)}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Tempo médio"
            value={formatDuration(overview.avg_duration_seconds)}
          />
        </Grid>
      </Grid>

      <BreakdownSection title="Origem do acesso" data={overview.by_referrer_source} />
      <BreakdownSection title="Dispositivo" data={overview.by_device_type} />
      <BreakdownSection title="Navegador" data={overview.by_browser} />
      <BreakdownSection title="Sistema operacional" data={overview.by_os} />
    </Stack>
  );
}

function BreakdownSection({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Stack spacing={0.5}>
        {entries.map(([label, count]) => (
          <Stack key={label} direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body2">{count}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

async function fetchOverview() {
  // Reaproveita a mesma lógica de agregação da API, direto no server,
  // sem precisar fazer fetch HTTP de si mesmo.
  const since = new Date(
    Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: sessions } = await supabaseAdmin
    .from("sessions")
    .select(
      "visitor_id, started_at, ended_at, referrer_source, device_type, browser, os, is_bounce"
    )
    .gte("started_at", since);

  const rows = sessions ?? [];
  const totalSessions = rows.length;
  const uniqueVisitors = new Set(rows.map((s) => s.visitor_id)).size;
  const bounces = rows.filter((s) => s.is_bounce).length;

  const durations = rows
    .filter((s) => s.ended_at)
    .map(
      (s) =>
        (new Date(s.ended_at as string).getTime() -
          new Date(s.started_at).getTime()) /
        1000
    );

  return {
    total_sessions: totalSessions,
    unique_visitors: uniqueVisitors,
    bounce_rate: totalSessions > 0 ? bounces / totalSessions : 0,
    avg_duration_seconds:
      durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0,
    by_referrer_source: countBy(rows, "referrer_source"),
    by_device_type: countBy(rows, "device_type"),
    by_browser: countBy(rows, "browser"),
    by_os: countBy(rows, "os"),
  };
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
