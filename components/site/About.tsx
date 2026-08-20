// components/site/About.tsx

import styles from "./About.module.css";
import { Reveal } from "./Reveal";

const FACTS = [
  { label: "LOCALIZAÇÃO", value: "São Paulo, SP — Brasil" },
  { label: "STACK PRINCIPAL", value: "React, React Native, TypeScript, Node.js" },
  { label: "TAMBÉM", value: "AWS, Docker, PostgreSQL, CI/CD" },
  { label: "FORMAÇÃO", value: "Pós-graduação em Dev. Mobile — IFSP" },
];

export function About() {
  return (
    <section id="sobre" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <Reveal>
            <p className="eyebrow">Sobre</p>
            <h2 className={styles.title}>Quem constrói</h2>
            <div className={styles.body}>
              <p>
                Atuo com desenvolvimento fullstack há alguns anos, passando
                por front-end web, mobile e back-end — sempre com o mesmo
                critério: interface que funciona bem pra quem usa, e código
                que o próximo desenvolvedor (ou eu mesmo, seis meses depois)
                consegue entender sem arqueologia.
              </p>
              <p>
                Hoje trabalho na Mitra, desenvolvendo o sistema de gestão
                tributária do município de Vinhedo — React, Next.js, TypeScript
                e MUI no front, PHP Laravel e PostgreSQL no back, com
                integrações gov.br e autenticação JWT. Antes disso, passei
                pela BeOnUp, onde também construí aplicações React Native e
                fiz deploy de infraestrutura em AWS (Docker, PM2, Nginx).
              </p>
              <p>
                Nas horas vagas, construo projetos pessoais pra continuar
                aprendendo — os três que estão abaixo saíram do zero até
                produção, incluindo a infraestrutura de analytics que
                acompanha este próprio portfólio.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className={styles.facts}>
              {FACTS.map((fact) => (
                <div className={styles.fact} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
