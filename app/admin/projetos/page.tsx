// app/admin/projetos/page.tsx
//
// Server Component: busca a agregação de projetos e passa pros
// gráficos client-side. Mesma auth check das outras páginas /admin.

import { redirect } from "next/navigation";
import { Grid, Stack, Typography } from "@mui/material";
import { requireAdmin } from "@/lib/auth/require-admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { BarChartCard } from "@/components/admin/charts/BarChartCard";
import { GrowthLineChart } from "@/components/admin/charts/GrowthLineChart";

const RANGE_DAYS = 30;

interface ProjectsOverview {
  top_projects: Array<{
    project_id: string;
    project_name: string;
    views: number;
    clicks_github: number;
    clicks_demo: number;
    clicks_case: number;
    avg_time_seconds: number;
    technologies: string[];
  }>;
  least_accessed: Array<{ project_name: string; views: number }>;
  growth_trend: Array<{ day: string; views: number }>;
  tech_ranking: Array<{ technology: string; count: number }>;
  most_accessed_project: { project_name: string; views: number } | null;
}

export default async function AdminProjectsPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const overview = await fetchProjectsOverview();

  const topProjectsChartData = overview.top_projects.map((p) => ({
    label: p.project_name,
    value: p.views,
  }));

  const techChartData = overview.tech_ranking
    .slice(0, 10)
    .map((t) => ({ label: t.technology, value: t.count }));

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Projetos — últimos {RANGE_DAYS} dias
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label="Projeto mais acessado"
            value={overview.most_accessed_project?.project_name ?? "—"}
            helperText={
              overview.most_accessed_project
                ? `${overview.most_accessed_project.views} visualizações`
                : undefined
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label="Projetos com visualização"
            value={overview.top_projects.length}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label="Tecnologias distintas vistas"
            value={overview.tech_ranking.length}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard title="Top 10 projetos mais visitados" data={topProjectsChartData} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Tecnologias mais visualizadas"
            data={techChartData}
            barColor="#22c55e"
          />
        </Grid>
      </Grid>

      <GrowthLineChart data={overview.growth_trend} />

      <ProjectsTable projects={overview.top_projects} />

      {overview.least_accessed.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Projetos menos acessados
          </Typography>
          <Stack spacing={0.5}>
            {overview.least_accessed.map((p) => (
              <Stack
                key={p.project_name}
                direction="row"
                sx={{ justifyContent: "space-between" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {p.project_name}
                </Typography>
                <Typography variant="body2">{p.views} visualizações</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

function ProjectsTable({
  projects,
}: {
  projects: ProjectsOverview["top_projects"];
}) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Detalhamento por projeto
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", fontSize: 13, color: "#666" }}>
            <th style={{ padding: "8px 4px" }}>Projeto</th>
            <th style={{ padding: "8px 4px" }}>Views</th>
            <th style={{ padding: "8px 4px" }}>Tempo médio</th>
            <th style={{ padding: "8px 4px" }}>GitHub</th>
            <th style={{ padding: "8px 4px" }}>Demo</th>
            <th style={{ padding: "8px 4px" }}>Case</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.project_id} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "8px 4px" }}>{p.project_name}</td>
              <td style={{ padding: "8px 4px" }}>{p.views}</td>
              <td style={{ padding: "8px 4px" }}>
                {Math.floor(p.avg_time_seconds / 60)}m {p.avg_time_seconds % 60}s
              </td>
              <td style={{ padding: "8px 4px" }}>{p.clicks_github}</td>
              <td style={{ padding: "8px 4px" }}>{p.clicks_demo}</td>
              <td style={{ padding: "8px 4px" }}>{p.clicks_case}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  );
}

async function fetchProjectsOverview(): Promise<ProjectsOverview> {
  // Chama a própria rota de agregação internamente. Alternativa seria
  // duplicar a lógica de agregação aqui (como fizemos no overview da
  // Fase 1) — optei por reaproveitar a rota porque essa agregação é
  // mais complexa e não vale manter em dois lugares.
  const { headers, cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const headerList = await headers();

  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("host");

  const res = await fetch(
    `${protocol}://${host}/api/analytics/dashboard/projects?days=${RANGE_DAYS}`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      top_projects: [],
      least_accessed: [],
      growth_trend: [],
      tech_ranking: [],
      most_accessed_project: null,
    };
  }

  return res.json();
}
