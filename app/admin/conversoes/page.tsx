// app/admin/conversoes/page.tsx
//
// Server Component: busca a agregação de conversão (funil + downloads
// + contatos) e renderiza. Mesmo padrão de auth das outras páginas /admin.

import { redirect } from "next/navigation";
import { Grid, Stack, Typography } from "@mui/material";
import { requireAdmin } from "@/lib/auth/require-admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { FunnelChart } from "@/components/admin/charts/FunnelChart";
import { BarChartCard } from "@/components/admin/charts/BarChartCard";

const RANGE_DAYS = 30;

interface ConversionOverview {
  total_sessions: number;
  funnel: Array<{
    step: string;
    sessions: number;
    conversion_from_previous: number;
    conversion_from_start: number;
  }>;
  downloads: {
    total: number;
    by_type: Record<string, number>;
    by_language: Record<string, number>;
  };
  contacts: {
    channels: Array<{
      channel: string;
      clicks: number;
      conversion_rate: number;
    }>;
    form_submits: number;
    form_conversion_rate: number;
  };
}

export default async function AdminConversionPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const overview = await fetchConversionOverview();

  const downloadsByTypeChart = Object.entries(overview.downloads.by_type).map(
    ([label, value]) => ({ label, value })
  );
  const contactsChart = overview.contacts.channels.map((c) => ({
    label: c.channel,
    value: c.clicks,
  }));

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Conversão — últimos {RANGE_DAYS} dias
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label="Sessões" value={overview.total_sessions} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label="Downloads de CV" value={overview.downloads.total} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Envios do formulário"
            value={overview.contacts.form_submits}
            helperText={`${(overview.contacts.form_conversion_rate * 100).toFixed(1)}% das sessões`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Conversão total do funil"
            value={`${((overview.funnel.at(-1)?.conversion_from_start ?? 0) * 100).toFixed(1)}%`}
            helperText="Visitante → última etapa"
          />
        </Grid>
      </Grid>

      <FunnelChart nodes={overview.funnel} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Downloads por tipo de documento"
            data={downloadsByTypeChart}
            barColor="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartCard
            title="Cliques por canal de contato"
            data={contactsChart}
            barColor="#0ea5e9"
          />
        </Grid>
      </Grid>

      <Stack spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Taxa de conversão por canal
        </Typography>
        <Stack spacing={0.5}>
          {overview.contacts.channels.map((c) => (
            <Stack key={c.channel} direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {c.channel}
              </Typography>
              <Typography variant="body2">
                {c.clicks} cliques · {(c.conversion_rate * 100).toFixed(1)}%
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

async function fetchConversionOverview(): Promise<ConversionOverview> {
  const { headers, cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const headerList = await headers();

  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("host");

  const res = await fetch(
    `${protocol}://${host}/api/analytics/dashboard/conversion?days=${RANGE_DAYS}`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      total_sessions: 0,
      funnel: [],
      downloads: { total: 0, by_type: {}, by_language: {} },
      contacts: { channels: [], form_submits: 0, form_conversion_rate: 0 },
    };
  }

  return res.json();
}
