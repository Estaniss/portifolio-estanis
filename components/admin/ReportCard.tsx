// components/admin/ReportCard.tsx
//
// Exportação em PDF via diálogo de impressão do navegador (Ctrl+P →
// "Salvar como PDF") — mesmo padrão que você já usa no Paulapalooza.
// Evita trazer uma lib de geração de PDF (puppeteer etc.) só pra isso,
// o que complicaria bastante o deploy serverless sem necessidade.

"use client";

import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { ReportContent } from "@/lib/ai/generate-report";

interface ReportCardProps {
  title: string;
  referenceDate: string | null;
  report: ReportContent | null;
}

export function ReportCard({ title, referenceDate, report }: ReportCardProps) {
  return (
    <Card variant="outlined" className="print-report">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {report && (
              <Button
                size="small"
                variant="outlined"
                className="no-print"
                onClick={() => window.print()}
              >
                Exportar PDF
              </Button>
            )}
          </Stack>

          {!report ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum relatório gerado ainda para este período. O cron job
              gera automaticamente na próxima execução agendada.
            </Typography>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary">
                Referência: {referenceDate}
              </Typography>

              <Typography variant="body2">{report.summary_text}</Typography>

              <ReportSection title="Tecnologias mais procuradas" items={report.top_recruiter_technologies} />
              <ReportSection title="Projetos mais relevantes" items={report.most_relevant_projects} />
              <ReportSection title="Tecnologias em crescimento" items={report.growing_technologies} />
              <ReportSection title="Competências mais solicitadas" items={report.most_requested_skills} />
              <ReportSection title="Sugestões para o portfólio" items={report.portfolio_suggestions} />
              <ReportSection title="Recomendações de novos projetos" items={report.new_project_recommendations} />
              <ReportSection title="Tendências do mercado" items={report.market_trends} />
              <ReportSection title="Áreas a fortalecer" items={report.areas_to_strengthen} />

              {report.avg_job_compatibility !== null && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="body2">Compatibilidade média das vagas:</Typography>
                  <Chip
                    label={`${report.avg_job_compatibility}%`}
                    size="small"
                    color="primary"
                  />
                </Stack>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Stack component="ul" sx={{ margin: 0, paddingLeft: 2.5 }}>
        {items.map((item) => (
          <Typography key={item} component="li" variant="body2" color="text.secondary">
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
