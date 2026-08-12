// components/admin/charts/FunnelChart.tsx

"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface FunnelNode {
  step: string;
  sessions: number;
  conversion_from_previous: number;
}

export function FunnelChart({ nodes }: { nodes: FunnelNode[] }) {
  const maxSessions = Math.max(...nodes.map((n) => n.sessions), 1);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Funil de conversão
          </Typography>

          <Stack spacing={1.5}>
            {nodes.map((node, index) => {
              const widthPct = Math.max(
                (node.sessions / maxSessions) * 100,
                4
              );

              return (
                <Stack key={node.step} spacing={0.5}>
                  {index > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 0.5 }}
                    >
                      ↓ {(node.conversion_from_previous * 100).toFixed(1)}%
                      de conversão da etapa anterior
                    </Typography>
                  )}
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: `${widthPct}%`,
                        minWidth: 40,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: "#6366f1",
                        opacity: 1 - index * 0.08,
                        transition: "width 0.3s ease",
                      }}
                    />
                    <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                      {node.step} — {node.sessions}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
