import styles from "./Hero.module.css";

const TEXT = {
  pt: {
    name: "Thomas Estanislau",
    headline: (
      <>
        Sou desenvolvedor de verdade, escrevo o código que sustenta{" "}
        <em>o produto inteiro</em>.
      </>
    ),
    sub: "Desenvolvedor fullstack com foco em React, React Native, TypeScript e Node.js. Gosto de interfaces que fazem sentido pra quem usa e de código que continua fazendo sentido seis meses depois.",
    ctaProjects: "Ver projetos",
    ctaContact: "Entrar em contato",
    visualLabel: "CONSTRUINDO PRODUTOS DIGITAIS",
    visualStatus: "SYSTEM ONLINE",
    visualStack: ["REACT", "NEXT.JS", "TYPESCRIPT", "NODE.JS"],
    scroll: "ROLE PARA EXPLORAR",
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
    ctaProjects: "See projects",
    ctaContact: "Get in touch",
    visualLabel: "BUILDING DIGITAL PRODUCTS",
    visualStatus: "SYSTEM ONLINE",
    visualStack: ["REACT", "NEXT.JS", "TYPESCRIPT", "NODE.JS"],
    scroll: "SCROLL TO EXPLORE",
  },
} as const;

export function Hero({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.intro}>
              <span className={styles.statusDot} />
              <span className={styles.name}>{t.name}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.role}>FULLSTACK DEVELOPER</span>
            </div>

            <h1 className={styles.headline}>{t.headline}</h1>

            <p className={styles.sub}>{t.sub}</p>

            <div className={styles.actions}>
              <a className={styles.primaryAction} href="#projetos">
                {t.ctaProjects}
                <span aria-hidden="true">↗</span>
              </a>

              <a className={styles.secondaryAction} href="#contato">
                {t.ctaContact}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className={styles.stackLine}>
              {t.visualStack.map((item, index) => (
                <span key={item}>
                  {item}
                  {index < t.visualStack.length - 1 && (
                    <span className={styles.stackSeparator}>/</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.visualTop}>
              <span>{t.visualLabel}</span>
              <span className={styles.visualStatus}>
                <i />
                {t.visualStatus}
              </span>
            </div>

            <div className={styles.orbitStage}>
              <div className={styles.orbitGrid} />

              <div className={`${styles.orbit} ${styles.orbitOuter}`} />
              <div className={`${styles.orbit} ${styles.orbitMiddle}`} />
              <div className={`${styles.orbit} ${styles.orbitInner}`} />

              <div className={styles.core}>
                <span className={styles.coreMark}>T.</span>
                <span className={styles.coreCaption}>ENGINEERING</span>
              </div>

              <span className={`${styles.orbitPoint} ${styles.pointOne}`} />
              <span className={`${styles.orbitPoint} ${styles.pointTwo}`} />
              <span className={`${styles.orbitPoint} ${styles.pointThree}`} />

              <span className={`${styles.codeTag} ${styles.tagOne}`}>
                {"<"}code /{">"}
              </span>

              <span className={`${styles.codeTag} ${styles.tagTwo}`}>
                {"{"} build: true {"}"}
              </span>

              <span className={`${styles.codeTag} ${styles.tagThree}`}>
                01 — 04
              </span>
            </div>

            <div className={styles.visualBottom}>
              <span>DESIGN × ENGINEERING</span>
              <span>EST. 2021 — NOW</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <span>{t.scroll}</span>
          <a
            href="#sobre"
            aria-label={
              lang === "pt" ? "Ir para a seção sobre" : "Go to about section"
            }
          >
            <span className={styles.scrollLine} />
            <span className={styles.scrollArrow}>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
