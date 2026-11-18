import styles from "./Experience.module.css";
import { Reveal } from "./Reveal";

const TEXT = {
  pt: {
    eyebrow: "Experiência",
    title: "Onde já passei",
    index: "03 — TRAJETÓRIA",
    roles: [
      {
        period: "SET 2024 — PRESENTE",
        role: "Analista Desenvolvedor",
        company: "Mitra",
        description:
          "Front-end com React, Next.js, TypeScript e MUI. APIs em PHP Laravel, PostgreSQL, autenticação e integração gov.br. Scrum, com refinamentos e entregas contínuas.",
      },
      {
        period: "JUL 2021 — AGO 2024",
        role: "Front-end Developer",
        company: "BeOnUp — Soluções de TI em nuvem",
        description:
          "Web com ReactJS, TypeScript e Styled Components a partir de designs no Figma. Mobile com React Native, incluindo publicação e manutenção de apps na App Store e na Google Play. Deploy em AWS (Docker, PM2, Nginx) e scripts de automação.",
      },
      {
        period: "DEZ 2019 — SET 2020",
        role: "Sales Development Representative",
        company: "Baitz Solutions",
        description:
          "Antes do desenvolvimento, a base de comunicação e entendimento de necessidade de cliente que ainda carrego pra como escrevo requisito e converso com stakeholder.",
      },
    ],
  },
  en: {
    eyebrow: "Experience",
    title: "Where I've worked",
    index: "03 — CAREER",
    current: "CURRENT",
    roles: [
      {
        period: "SEP 2024 — PRESENT",
        role: "Software Developer",
        company: "Mitra",
        description:
          "Front-end with React, Next.js, TypeScript and MUI. APIs in PHP Laravel, PostgreSQL, authentication and gov.br integration. Scrum, with refinements and continuous delivery.",
      },
      {
        period: "JUL 2021 — AUG 2024",
        role: "Front-end Developer",
        company: "BeOnUp — Cloud IT Solutions",
        description:
          "Web with ReactJS, TypeScript and Styled Components from Figma designs. Mobile with React Native, including publishing and maintaining apps on the App Store and Google Play. Deployment on AWS (Docker, PM2, Nginx) and automation scripts.",
      },
      {
        period: "DEC 2019 — SEP 2020",
        role: "Sales Development Representative",
        company: "Baitz Solutions",
        description:
          "Before development, the communication foundation and client-need understanding I still carry into how I write requirements and talk to stakeholders.",
      },
    ],
  },
} as const;

interface ExperienceProps {
  lang?: "pt" | "en";
}

export function Experience({ lang = "pt" }: ExperienceProps) {
  const t = TEXT[lang];

  return (
    <section id="experiencia" className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
          </Reveal>

          <Reveal delay={80}>
            <span className={styles.index}>{t.index}</span>
          </Reveal>
        </div>

        <Reveal>
          <h2 className={styles.title}>
            {t.title}
            <span className={styles.titleAccent}>.</span>
          </h2>
        </Reveal>

        <div
          className={styles.timeline}
          aria-label={lang === "pt" ? "Histórico profissional" : "Work history"}
        >
          {t.roles.map((role, index) => (
            <Reveal key={role.company + role.period} delay={index * 100}>
              <article className={styles.item}>
                <div className={styles.marker} aria-hidden="true">
                  <span />
                </div>

                <div className={styles.itemContent}>
                  <div className={styles.itemTop}>
                    <span className={styles.period}>{role.period}</span>
                  </div>

                  <div className={styles.heading}>
                    <h3 className={styles.role}>{role.role}</h3>
                    <span className={styles.company}>{role.company}</span>
                  </div>

                  <p className={styles.desc}>{role.description}</p>

                  <span className={styles.itemNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
