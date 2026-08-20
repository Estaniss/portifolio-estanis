import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AnalyticsProvider } from "@/lib/analytics/tracker";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Thomas Estanislau — Desenvolvedor Fullstack",
  description:
    "React, React Native, TypeScript e Node.js. Interfaces modernas, código limpo, do frontend à infraestrutura.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
