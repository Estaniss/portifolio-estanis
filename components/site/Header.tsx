import Link from "next/link";
import styles from "./Header.module.css";

const TEXT = {
  pt: {
    nav: [
      { href: "#sobre", label: "SOBRE" },
      { href: "#competencias", label: "COMPETÊNCIAS" },
      { href: "#experiencia", label: "EXPERIÊNCIA" },
      { href: "#projetos", label: "PROJETOS" },
      { href: "#ia-match", label: "IA MATCH" },
      { href: "#contato", label: "CONTATO" },
    ],
    status: "DISPONÍVEL",
    location: "SÃO PAULO, BR",
    navigation: "Navegação principal",
  },
  en: {
    nav: [
      { href: "#sobre", label: "ABOUT" },
      { href: "#competencias", label: "SKILLS" },
      { href: "#experiencia", label: "EXPERIENCE" },
      { href: "#projetos", label: "PROJECTS" },
      { href: "#ia-match", label: "IA MATCH" },
      { href: "#contato", label: "CONTACT" },
    ],
    status: "AVAILABLE",
    location: "SÃO PAULO, BR",
    navigation: "Main navigation",
  },
} as const;

interface HeaderProps {
  lang?: "pt" | "en";
}

export function Header({ lang = "pt" }: HeaderProps) {
  const t = TEXT[lang];
  const otherLangHref = lang === "pt" ? "/en" : "/";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <span className={styles.brand}>
              THOMAS<span className={styles.brandAccent}>.</span>
              ESTANISLAU
            </span>

            <span className={styles.divider} aria-hidden="true" />

            <span className={styles.role}>FULLSTACK DEVELOPER</span>
          </div>

          <div className={styles.meta}>
            <span className={styles.location}>{t.location}</span>

            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              {t.status}
            </span>
          </div>
        </div>

        <div className={styles.navigationRow}>
          <nav className={styles.nav} aria-label={t.navigation}>
            {t.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            href={otherLangHref}
            className={styles.langSwitch}
            aria-label={
              lang === "pt" ? "Switch to English" : "Mudar para português"
            }
            hrefLang={lang === "pt" ? "en" : "pt-BR"}
          >
            <img
              src={lang === "pt" ? "/flags/us.svg" : "/flags/br.svg"}
              alt=""
              aria-hidden="true"
              className={styles.flag}
            />
            <span className={styles.langLabel}>
              {lang === "pt" ? "EN" : "PT"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
