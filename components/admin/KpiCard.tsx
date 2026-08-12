// components/admin/KpiCard.tsx

import { Card, CardContent, Stack, Typography } from "@mui/material";

interface KpiCardProps {
  label: string;
  value: string | number;
  helperText?: string;
}

export function KpiCard({ label, value, helperText }: KpiCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          {helperText && (
            <Typography variant="caption" color="text.secondary">
              {helperText}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
