// components/admin/charts/GrowthLineChart.tsx

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

interface GrowthLineChartProps {
  data: Array<{ day: string; views: number }>;
}

export function GrowthLineChart({ data }: GrowthLineChartProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Evolução de acessos aos projetos
          </Typography>

          {data.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Sem dados no período selecionado.
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
                    dataKey="views"
                    stroke="#6366f1"
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
