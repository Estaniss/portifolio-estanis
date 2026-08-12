// components/admin/charts/LineChartCard.tsx
//
// Versão genérica do GrowthLineChart da Fase 2 — aquele ficou fixo em
// "views por dia"; esse aceita qualquer título/label, pra Fase 4
// (evolução de análises) reaproveitar sem precisar de outro componente
// quase-idêntico. Se um dia sobrar tempo, vale substituir o
// GrowthLineChart por esse e deletar a duplicação — não fiz agora pra
// não mexer em arquivo já entregue sem necessidade.

"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, Typography, Stack } from "@mui/material";

interface LineChartCardProps {
  title: string;
  data: Array<{ day: string; value: number }>;
  color?: string;
  emptyMessage?: string;
}

export function LineChartCard({
  title,
  data,
  color = "#6366f1",
  emptyMessage = "Sem dados no período selecionado.",
}: LineChartCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          {data.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          ) : (
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
