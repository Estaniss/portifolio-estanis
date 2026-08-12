// app/admin/layout.tsx — navegação entre as páginas do painel admin

"use client";

import Link from "next/link";
import { Container, Stack, Tab, Tabs } from "@mui/material";

const TABS = [
  { label: "Visão geral", href: "/admin" },
  { label: "Projetos", href: "/admin/projetos" },
  { label: "Conversão", href: "/admin/conversoes" },
  { label: "IA Match", href: "/admin/ia-match" },
  { label: "Relatórios", href: "/admin/relatorios" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Stack>
      <Container maxWidth="lg" className="no-print">
        <Tabs value={false} variant="scrollable" scrollButtons="auto">
          {TABS.map((tab) => (
            <Tab key={tab.href} label={tab.label} component={Link} href={tab.href} />
          ))}
        </Tabs>
      </Container>
      {children}
    </Stack>
  );
}
