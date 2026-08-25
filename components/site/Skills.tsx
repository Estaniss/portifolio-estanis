// components/site/Skills.tsx
//
// Pills com a stack real, agrupada por categoria — em vez de barra de
// progresso ou estrelas (que são subjetivas e ninguém confia mesmo).

import styles from './Skills.module.css';
import { Reveal } from './Reveal';

const CATEGORIES = [
  {
    label: 'FRONTEND',
    items: [
      'React',
      'Next.js',
      'React Native',
      'TypeScript',
      'MUI',
      'Styled Components',
      'ANTD',
      'Tailwind CSS',
    ],
  },
  {
    label: 'BACKEND',
    items: ['Node.js', 'PHP Laravel', 'APIs RESTful', 'JWT', 'AES-GCM'],
  },
  {
    label: 'DADOS',
    items: [
      'PostgreSQL',
      'MySQL',
      'Oracle',
      'SQL',
      'NoSQL',
      'pgvector',
      'Redis',
    ],
  },
  {
    label: 'CLOUD & DEVOPS',
    items: ['AWS', 'Docker', 'PM2', 'Nginx', 'CI/CD'],
  },
  {
    label: 'PRÁTICAS',
    items: ['Clean Code', 'Arquitetura de Software', 'Scrum'],
  },
  {
    label: 'FERRAMENTAS',
    items: ['Git', 'Jira', 'Monday', 'Figma'],
  },
  {
    label: 'LÍNGUAS ',
    items: ['Inglês-intermediário', 'Espanhol-intermediário'],
  },
];

export function Skills() {
  return (
    <section id="competencias" className={styles.section}>
      <div className="container">
        <p className="eyebrow">Competências</p>
        <h2 className={styles.title}>Com o que trabalho</h2>

        <dl className={styles.grid}>
          {CATEGORIES.map((cat, index) => (
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
