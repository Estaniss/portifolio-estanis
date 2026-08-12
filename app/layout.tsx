import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AnalyticsProvider } from "@/lib/analytics/tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thomas Estanislau — Portfólio",
  description: "Portfólio com Analytics — teste de integração Fase 1 e 2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AppRouterCacheProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
