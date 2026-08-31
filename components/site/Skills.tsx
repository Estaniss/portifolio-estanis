// components/site/Skills.tsx

import styles from "./Skills.module.css";
import { Reveal } from "./Reveal";

const TEXT = {
  pt: {
    eyebrow: "Competências",
    title: "Com o que trabalho",
    categories: [
      { label: "FRONTEND", items: ["React", "Next.js", "React Native", "TypeScript", "MUI", "Styled Components", "ANTD", "Tailwind CSS"] },
      { label: "MOBILE", items: ["React Native", "Publicação na App Store", "Publicação na Google Play"] },
      { label: "BACKEND", items: ["Node.js", "PHP Laravel", "APIs RESTful", "JWT"] },
      { label: "DADOS", items: ["PostgreSQL", "MySQL", "Oracle"] },
      { label: "CLOUD & DEVOPS", items: ["AWS", "Docker", "Nginx", "CI/CD"] },
      { label: "PRÁTICAS", items: ["Clean Code", "Scrum", "Git"] },
      { label: "LÍNGUAS", items: ["Inglês — intermediário", "Espanhol — intermediário"] },
    ],
  },
  en: {
    eyebrow: "Skills",
    title: "What I work with",
    categories: [
      { label: "FRONTEND", items: ["React", "Next.js", "React Native", "TypeScript", "MUI", "Styled Components", "ANTD", "Tailwind CSS"] },
      { label: "MOBILE", items: ["React Native", "App Store publishing", "Google Play publishing"] },
      { label: "BACKEND", items: ["Node.js", "PHP Laravel", "RESTful APIs", "JWT"] },
      { label: "DATA", items: ["PostgreSQL", "MySQL", "Oracle"] },
      { label: "CLOUD & DEVOPS", items: ["AWS", "Docker", "Nginx", "CI/CD"] },
      { label: "PRACTICES", items: ["Clean Code", "Scrum", "Git"] },
      { label: "LANGUAGES", items: ["English — intermediate", "Spanish — intermediate"] },
    ],
  },
} as const;

export function Skills({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <section id="competencias" className={styles.section}>
      <div className="container">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className={styles.title}>{t.title}</h2>

        <dl className={styles.grid}>
          {t.categories.map((cat, index) => (
            <Reveal key={cat.label} delay={index * 60}>
              <div className={styles.category}>
                <dt>{cat.label}</dt>
                <dd className={styles.pills}>
                  {cat.items.map((item) => (
                    <span className={styles.pill} key={item}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
