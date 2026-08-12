// app/admin/ia-match/page.tsx

import { redirect } from "next/navigation";
import { Grid, Stack, Typography } from "@mui/material";
import { requireAdmin } from "@/lib/auth/require-admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { BarChartCard } from "@/components/admin/charts/BarChartCard";
import { LineChartCard } from "@/components/admin/charts/LineChartCard";

const RANGE_DAYS = 90;

interface IaMatchOverview {
  total_analyses: number;
  avg_compatibility: number;
  max_compatibility: number;
  min_compatibility: number;
  compatibility_distribution: Array<{ label: string; value: number }>;
  evolution_trend: Array<{ day: string; count: number }>;
  companies: Array<{ label: string; value: number }>;
  seniority_breakdown: Array<{ label: string; value: number }>;
  stack_ranking: Array<{ label: string; value: number }>;
  hard_skills_ranking: Array<{ label: string; value: number }>;
  soft_skills_ranking: Array<{ label: string; value: number }>;
}

export default async function AdminIaMatchPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const overview = await fetchIaMatchOverview();

  const evolutionData = overview.evolution_trend.map((e) => ({
    day: e.day,
    value: e.count,
  }));

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        IA Match Analytics — últimos {RANGE_DAYS} dias
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label="Total de análises" value={overview.total_analyses} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Compatibilidade média"
            value={`${overview.avg_compatibility}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Compatibilidade máxima"
            value={`${overview.max_compatibility}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Compatibilidade mínima"
            value={`${overview.min_compatibility}%`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Distribuição das compatibilidades"
            data={overview.compatibility_distribution}
            barColor="#8b5cf6"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LineChartCard
            title="Evolução das análises"
            data={evolutionData}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Stack predominante"
            data={overview.stack_ranking.slice(0, 10)}
            barColor="#22c55e"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Senioridade das vagas analisadas"
            data={overview.seniority_breakdown}
            barColor="#f59e0b"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Hard skills mais recorrentes"
            data={overview.hard_skills_ranking.slice(0, 10)}
            barColor="#0ea5e9"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Soft skills mais recorrentes"
            data={overview.soft_skills_ranking.slice(0, 10)}
            barColor="#ec4899"
          />
        </Grid>
      </Grid>

      {overview.companies.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Empresas analisadas
          </Typography>
          <Stack spacing={0.5}>
            {overview.companies.map((c) => (
              <Stack key={c.label} direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {c.label}
                </Typography>
                <Typography variant="body2">{c.value} análise(s)</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

async function fetchIaMatchOverview(): Promise<IaMatchOverview> {
  const { headers, cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const headerList = await headers();

  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("host");

  const res = await fetch(
    `${protocol}://${host}/api/analytics/dashboard/ia-match?days=${RANGE_DAYS}`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
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
    };
  }

  return res.json();
}
