import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AnalyticsProvider } from "@/lib/analytics/tracker";

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <AppRouterCacheProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </AppRouterCacheProvider>
  );
}
