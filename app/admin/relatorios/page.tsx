// app/admin/relatorios/page.tsx

import { redirect } from "next/navigation";
import { Stack, Typography } from "@mui/material";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ReportCard } from "@/components/admin/ReportCard";
import type { ReportContent } from "@/lib/ai/generate-report";

interface StoredReport {
  period: string;
  reference_date: string;
  summary_text: string;
  content: ReportContent;
}

interface ReportsResponse {
  weekly: StoredReport | null;
  monthly: StoredReport | null;
  yearly: StoredReport | null;
}

export default async function AdminReportsPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const reports = await fetchReports();

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }} className="no-print">
        Relatórios de IA
      </Typography>

      <ReportCard
        title="Relatório semanal"
        referenceDate={reports.weekly?.reference_date ?? null}
        report={reports.weekly?.content ?? null}
      />
      <ReportCard
        title="Relatório mensal"
        referenceDate={reports.monthly?.reference_date ?? null}
        report={reports.monthly?.content ?? null}
      />
      <ReportCard
        title="Relatório anual"
        referenceDate={reports.yearly?.reference_date ?? null}
        report={reports.yearly?.content ?? null}
      />

      {/* Estilos de impressão: some com tudo que não é o relatório sendo exportado. */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </Stack>
  );
}

async function fetchReports(): Promise<ReportsResponse> {
  const { headers, cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const headerList = await headers();

  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("host");

  const res = await fetch(
    `${protocol}://${host}/api/analytics/dashboard/reports`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { weekly: null, monthly: null, yearly: null };
  }

  return res.json();
}
