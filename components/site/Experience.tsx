// components/site/Experience.tsx
//
// Timeline numerada faz sentido aqui de propósito: é uma sequência real
// (progressão de carreira), não um enfeite de "01 / 02 / 03".

import styles from "./Experience.module.css";
import { Reveal } from "./Reveal";

const ROLES = [
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
      "Web com ReactJS, TypeScript e Styled Components a partir de designs no Figma. Mobile com React Native. Deploy em AWS (Docker, PM2, Nginx) e scripts de automação.",
  },
  {
    period: "DEZ 2019 — SET 2020",
    role: "Sales Development Representative",
    company: "Baitz Solutions",
    description:
      "Antes do desenvolvimento — a base de comunicação e entendimento de necessidade de cliente que ainda carrego pra como escrevo requisito e converso com stakeholder.",
  },
];

export function Experience() {
  return (
    <section id="experiencia" className={styles.section}>
      <div className="container">
        <p className="eyebrow">Experiência</p>
        <h2 className={styles.title}>Onde já passei</h2>

        <div className={styles.timeline}>
          {ROLES.map((role, index) => (
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
