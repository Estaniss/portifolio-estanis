// components/site/Header.tsx

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
  },
} as const;

export function Header({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];
  const otherLangHref = lang === "pt" ? "/en" : "/";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <span className={styles.dateline}>
          <strong>THOMAS ESTANISLAU</strong> · FULLSTACK · SÃO PAULO, BR ·{" "}
          {t.status}
          <span className="blink">_</span>
        </span>
        <nav className={styles.nav}>
          {t.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <Link href={otherLangHref} className={styles.langSwitch}>
            {lang === "pt" ? "EN" : "PT"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
