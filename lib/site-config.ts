// lib/site-config.ts
//
// URL central do site — usada no OG image, sitemap, robots.txt e
// metadata do <head>. Se um dia trocar pra domínio próprio, só mexe
// aqui (ou define NEXT_PUBLIC_SITE_URL no Vercel, que tem prioridade).

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://portifolio-estanis.vercel.app";

export const SITE_NAME = "Thomas Estanislau — Desenvolvedor Fullstack";
export const SITE_DESCRIPTION =
  "React, React Native, TypeScript e Node.js. Interfaces modernas, código limpo, do frontend à infraestrutura.";
