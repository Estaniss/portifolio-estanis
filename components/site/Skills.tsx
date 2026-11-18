import styles from "./Skills.module.css";
import { Reveal } from "./Reveal";

const TEXT = {
  pt: {
    eyebrow: "Competências",
    title: "Com o que trabalho",
    index: "02 — TOOLKIT",
    categories: [
      {
        label: "FRONTEND",
        items: [
          "React",
          "Next.js",
          "React Native",
          "TypeScript",
          "MUI",
          "Styled Components",
          "ANTD",
          "Tailwind CSS",
        ],
      },
      {
        label: "MOBILE",
        items: [
          "React Native",
          "Publicação na App Store",
          "Publicação na Google Play",
        ],
      },
      {
        label: "BACKEND",
        items: ["Node.js", "PHP Laravel", "APIs RESTful", "JWT"],
      },
      {
        label: "DADOS",
        items: ["PostgreSQL", "MySQL", "Oracle"],
      },
      {
        label: "CLOUD & DEVOPS",
        items: ["AWS", "Docker", "Nginx", "CI/CD"],
      },
      {
        label: "PRÁTICAS",
        items: ["Clean Code", "Scrum", "Git"],
      },
      {
        label: "LÍNGUAS",
        items: ["Inglês — intermediário", "Espanhol — intermediário"],
      },
    ],
  },
  en: {
    eyebrow: "Skills",
    title: "What I work with",
    index: "02 — TOOLKIT",
    categories: [
      {
        label: "FRONTEND",
        items: [
          "React",
          "Next.js",
          "React Native",
          "TypeScript",
          "MUI",
          "Styled Components",
          "ANTD",
          "Tailwind CSS",
        ],
      },
      {
        label: "MOBILE",
        items: [
          "React Native",
          "App Store publishing",
          "Google Play publishing",
        ],
      },
      {
        label: "BACKEND",
        items: ["Node.js", "PHP Laravel", "RESTful APIs", "JWT"],
      },
      {
        label: "DATA",
        items: ["PostgreSQL", "MySQL", "Oracle"],
      },
      {
        label: "CLOUD & DEVOPS",
        items: ["AWS", "Docker", "Nginx", "CI/CD"],
      },
      {
        label: "PRACTICES",
        items: ["Clean Code", "Scrum", "Git"],
      },
      {
        label: "LANGUAGES",
        items: ["English — intermediate", "Spanish — intermediate"],
      },
    ],
  },
} as const;

interface SkillsProps {
  lang?: "pt" | "en";
}

export function Skills({ lang = "pt" }: SkillsProps) {
  const t = TEXT[lang];

  return (
    <section id="competencias" className={styles.section}>
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

        <dl className={styles.grid}>
          {t.categories.map((category, index) => (
            <Reveal key={category.label} delay={index * 60}>
              <div className={styles.category}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryNumber}>0{index + 1}</span>

                  <dt className={styles.categoryTitle}>{category.label}</dt>

                  <span className={styles.itemCount}>
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                </div>

                <dd className={styles.pills}>
                  {category.items.map((item) => (
                    <span className={styles.pill} key={item}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className={styles.footer}>
          <span className={styles.footerLine} />
          <span>
            {lang === "pt"
              ? "TECNOLOGIAS E PRÁTICAS"
              : "TECHNOLOGIES & PRACTICES"}
          </span>
          <span className={styles.footerLine} />
        </div>
      </div>
    </section>
  );
}
