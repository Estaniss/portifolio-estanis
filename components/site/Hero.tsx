// components/site/Hero.tsx

import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Sou desenvolvedor de verdade, escrevo o código que sustenta
            <em> o produto inteiro</em>
          </h1>
          <p className={styles.sub}>
            Desenvolvedor fullstack com foco em React, React Native, TypeScript
            e Node.js. Gosto de interfaces que fazem sentido pra quem usa e de
            código que continua fazendo sentido seis meses depois.
          </p>
          <div className={styles.rule}>
            <div className={styles.actions}>
              <a className="text-link" href="#projetos">
                Ver projetos →
              </a>
              <a className="text-link" href="#contato">
                Entrar em contato →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
