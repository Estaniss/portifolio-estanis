// components/site/About.tsx

import styles from "./About.module.css";
import { Reveal } from "./Reveal";

const TEXT = {
  pt: {
    eyebrow: "Sobre",
    title: "Quem constrói",
    paragraphs: [
      "Atuo com desenvolvimento fullstack há alguns anos, passando por front-end web, mobile e back-end — sempre com o mesmo critério: interface que funciona bem pra quem usa, e código que o próximo desenvolvedor (ou eu mesmo, seis meses depois) consegue entender sem arqueologia.",
      "Hoje trabalho na Mitra, desenvolvendo o sistema de gestão tributária do município de Vinhedo — React, Next.js, TypeScript e MUI no front, PHP Laravel e PostgreSQL no back, com integrações gov.br e autenticação JWT. Antes disso, passei pela BeOnUp, onde também construí e publiquei aplicações React Native nas lojas (App Store e Google Play), além de fazer deploy de infraestrutura em AWS.",
      "Nas horas vagas, construo projetos pessoais pra continuar aprendendo — os três que estão abaixo saíram do zero até produção, incluindo a infraestrutura de analytics que acompanha este próprio portfólio.",
    ],
    facts: [
      { label: "LOCALIZAÇÃO", value: "São Paulo, SP — Brasil" },
      { label: "STACK PRINCIPAL", value: "React, React Native, TypeScript, Node.js" },
      { label: "TAMBÉM", value: "AWS, Docker, PostgreSQL, CI/CD" },
      { label: "FORMAÇÃO", value: "Pós-graduação em Dev. Mobile — IFSP" },
    ],
  },
  en: {
    eyebrow: "About",
    title: "Who's building this",
    paragraphs: [
      "I've worked as a fullstack developer for a few years, across web front-end, mobile and back-end — always with the same criteria: an interface that works well for whoever uses it, and code that the next developer (or me, six months later) can understand without archaeology.",
      "Right now I work at Mitra, building the tax management system for the city of Vinhedo — React, Next.js, TypeScript and MUI on the front, PHP Laravel and PostgreSQL on the back, with gov.br integrations and JWT authentication. Before that, I was at BeOnUp, where I also built and published React Native apps to both stores (App Store and Google Play), plus deployed infrastructure on AWS.",
      "In my spare time, I build personal projects to keep learning — the three below went from zero to production, including the analytics infrastructure behind this very portfolio.",
    ],
    facts: [
      { label: "LOCATION", value: "São Paulo, Brazil" },
      { label: "MAIN STACK", value: "React, React Native, TypeScript, Node.js" },
      { label: "ALSO", value: "AWS, Docker, PostgreSQL, CI/CD" },
      { label: "EDUCATION", value: "Postgrad in Mobile Dev — IFSP" },
    ],
  },
} as const;

export function About({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <section id="sobre" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className={styles.title}>{t.title}</h2>
            <div className={styles.body}>
              {t.paragraphs.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className={styles.facts}>
              {t.facts.map((fact) => (
                <div className={styles.fact} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
