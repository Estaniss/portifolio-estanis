// components/admin/charts/BarChartCard.tsx

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, Typography, Stack } from "@mui/material";

interface BarChartCardProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  barColor?: string;
  emptyMessage?: string;
}

export function BarChartCard({
  title,
  data,
  barColor = "#6366f1",
  emptyMessage = "Sem dados no período selecionado.",
}: BarChartCardProps) {
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
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill={barColor} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
