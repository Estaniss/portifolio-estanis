// components/site/Experience.tsx
//
// Timeline numerada faz sentido aqui de propósito: é uma sequência real
// (progressão de carreira), não um enfeite de "01 / 02 / 03".

import styles from "./Experience.module.css";
import { Reveal } from "./Reveal";

const TEXT = {
  pt: {
    eyebrow: "Experiência",
    title: "Onde já passei",
    roles: [
      {
        period: "SET 2024 — PRESENTE",
        role: "Analista Desenvolvedor",
        company: "Mitra",
        description:
          "Front-end com React, Next.js, TypeScript e MUI. APIs em PHP Laravel, PostgreSQL, autenticação e integração gov.br. Scrum, com refinamentos e entregas contínuas.",
      },
      {
        period: "JUL 2022 — AGO 2024",
        role: "Front-end Developer",
        company: "BeOnUp — Soluções de TI em nuvem",
        description:
          "Web com ReactJS, TypeScript e Styled Components a partir de designs no Figma. Mobile com React Native, incluindo publicação e manutenção de apps na App Store e na Google Play. Deploy em AWS (Docker, PM2, Nginx) e scripts de automação.",
      },
      {
        period: "JUL 2021 — JUL 2022",
        role: "Desenvolvedor Front-end",
        company: "BeOnUp — Soluções de TI em nuvem",
        description:
          "Desenvolvimento front-end e colaboração em projetos web com ReactJS e TypeScript.",
      },
      {
        period: "DEZ 2019 — SET 2020",
        role: "Sales Development Representative",
        company: "Baitz Solutions",
        description:
          "Antes do desenvolvimento — a base de comunicação e entendimento de necessidade de cliente que ainda carrego pra como escrevo requisito e converso com stakeholder.",
      },
    ],
  },
  en: {
    eyebrow: "Experience",
    title: "Where I've worked",
    roles: [
      {
        period: "SEP 2024 — PRESENT",
        role: "Software Developer",
        company: "Mitra",
        description:
          "Front-end with React, Next.js, TypeScript and MUI. APIs in PHP Laravel, PostgreSQL, authentication and gov.br integration. Scrum, with refinements and continuous delivery.",
      },
      {
        period: "JUL 2022 — AUG 2024",
        role: "Front-end Developer",
        company: "BeOnUp — Cloud IT Solutions",
        description:
          "Web with ReactJS, TypeScript and Styled Components from Figma designs. Mobile with React Native, including publishing and maintaining apps on the App Store and Google Play. Deployment on AWS (Docker, PM2, Nginx) and automation scripts.",
      },
      {
        period: "JUL 2021 — JUL 2022",
        role: "Front-end Developer",
        company: "BeOnUp — Cloud IT Solutions",
        description:
          "Front-end development and collaboration on web projects using ReactJS and TypeScript.",
      },
      {
        period: "DEC 2019 — SEP 2020",
        role: "Sales Development Representative",
        company: "Baitz Solutions",
        description:
          "Before development — the communication foundation and client-need understanding I still carry into how I write requirements and talk to stakeholders.",
      },
    ],
  },
} as const;

export function Experience({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <section id="experiencia" className={styles.section}>
      <div className="container">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className={styles.title}>{t.title}</h2>

        <div className={styles.timeline}>
          {t.roles.map((role, index) => (
            <Reveal key={role.company + role.period} delay={index * 90}>
              <div className={styles.item}>
                <div className={styles.period}>{role.period}</div>
                <h3 className={styles.role}>
                  {role.role} <span className={styles.company}>· {role.company}</span>
                </h3>
                <p className={styles.desc}>{role.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
