// components/site/Hero.tsx

import styles from "./Hero.module.css";

const TEXT = {
  pt: {
    name: "Thomas Estanislau",
    headline: (
      <>
        Sou desenvolvedor de verdade — escrevo o código que sustenta{" "}
        <em>o produto inteiro</em>.
      </>
    ),
    sub: "Desenvolvedor fullstack com foco em React, React Native, TypeScript e Node.js. Gosto de interfaces que fazem sentido pra quem usa e de código que continua fazendo sentido seis meses depois.",
    ctaProjects: "Ver projetos →",
    ctaContact: "Entrar em contato →",
  },
  en: {
    name: "Thomas Estanislau",
    headline: (
      <>
        I&apos;m a real developer — I write the code that holds up{" "}
        <em>the whole product</em>.
      </>
    ),
    sub: "Fullstack developer focused on React, React Native, TypeScript and Node.js. I care about interfaces that make sense to whoever uses them, and code that still makes sense six months later.",
    ctaProjects: "See projects →",
    ctaContact: "Get in touch →",
  },
} as const;

export function Hero({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.name}>{t.name}</p>
          <h1 className={styles.headline}>{t.headline}</h1>
          <p className={styles.sub}>{t.sub}</p>
          <div className={styles.rule}>
            <div className={styles.actions}>
              <a className="text-link" href="#projetos">
                {t.ctaProjects}
              </a>
              <a className="text-link" href="#contato">
                {t.ctaContact}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
