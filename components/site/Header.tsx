// components/site/Header.tsx
//
// A "dateline" (linha de status estilo manchete de jornal) é o elemento
// de assinatura do design — reaparece aqui fixo no topo com informação
// real (cargo · local · disponibilidade), não é decoração.

import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <span className={styles.dateline}>
          <strong>THOMAS ESTANISLAU</strong> · FULLSTACK · SÃO PAULO, BR ·
          DISPONÍVEL<span className="blink">_</span>
        </span>
        <nav className={styles.nav}>
          <a href="#sobre">SOBRE</a>
          <a href="#competencias">COMPETÊNCIAS</a>
          <a href="#experiencia">EXPERIÊNCIA</a>
          <a href="#projetos">PROJETOS</a>
          <a href="#ia-match">IA MATCH</a>
          <a href="#contato">CONTATO</a>
        </nav>
      </div>
    </header>
  );
}
