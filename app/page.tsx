import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { IaMatch } from "@/components/site/IaMatch";
import { Contact } from "@/components/site/Contact";

export const metadata: Metadata = {
  title: "Thomas Estanislau — Desenvolvedor Fullstack",
  description:
    "React, React Native, TypeScript e Node.js. Interfaces modernas, código limpo, do frontend à infraestrutura.",
  alternates: {
    languages: { "pt-BR": "/", en: "/en" },
  },
};

export default function Home() {
  return (
    <>
      <Header lang="pt" />
      <Hero lang="pt" />
      <About lang="pt" />
      <Skills lang="pt" />
      <Experience lang="pt" />
      <Projects lang="pt" />
      <IaMatch lang="pt" />
      <Contact lang="pt" />
    </>
  );
}
