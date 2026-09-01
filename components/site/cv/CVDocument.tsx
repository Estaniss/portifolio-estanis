'use client';

import styles from './CVDocument.module.css';

const TEXT = {
  pt: {
    role: 'Desenvolvedor Fullstack — React, React Native, TypeScript, Node.js',
    contact:
      'São Paulo, SP · estanislau124@hotmail.com · (16) 99713-7932 · linkedin.com/in/thomas-estanislau-45ab05124 · github.com/estaniss',
    printLabel: 'Exportar PDF',
    summaryEyebrow: 'Perfil',
    summary:
      'Desenvolvedor fullstack com experiência em React, React Native, TypeScript e Node.js. Atuação de ponta a ponta — interfaces web e mobile, publicação de apps em loja, integração de APIs, bancos de dados relacionais e infraestrutura AWS.',
    experienceEyebrow: 'Experiência',
    roles: [
      {
        period: 'SET 2024 — PRESENTE',
        role: 'Analista Desenvolvedor',
        company: 'Mitra',
        description:
          'Front-end com React, Next.js, TypeScript e MUI; integrações complexas de API. APIs em PHP Laravel com PostgreSQL; autenticação gov.br, JWT e criptografia AES-GCM. Scrum: refinamentos, planning, retrospectivas.',
      },
      {
        period: 'JUL 2022 — AGO 2024',
        role: 'Front-end Developer',
        company: 'BeOnUp',
        description:
          'Web responsivo com ReactJS, TypeScript, Styled Components e ANTD. Mobile com React Native, incluindo publicação e manutenção de apps na App Store e Google Play. Deploy em AWS (Docker, PM2, Nginx).',
      },
      {
        period: 'JUL 2021 — JUL 2022',
        role: 'Desenvolvedor Front-end',
        company: 'BeOnUp',
        description:
          'Desenvolvimento front-end e colaboração em projetos web com ReactJS e TypeScript.',
      },
      {
        period: 'DEZ 2019 — SET 2020',
        role: 'Sales Development Representative',
        company: 'Baitz Solutions',
        description:
          'Prospecção, qualificação de leads e levantamento de requisitos de negócio.',
      },
    ],
    skillsEyebrow: 'Competências',
    skillGroups: [
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
        ],
      },
      { label: 'MOBILE', items: ['App Store', 'Google Play', 'React Native'] },
      { label: 'BACKEND', items: ['Node.js', 'PHP Laravel', 'REST', 'JWT'] },
      { label: 'DADOS', items: ['PostgreSQL', 'MySQL', 'Oracle'] },
      { label: 'CLOUD & DEVOPS', items: ['AWS', 'Docker', 'Nginx', 'CI/CD'] },
      { label: 'PRÁTICAS', items: ['Clean Code', 'Scrum', 'Git'] },
    ],
    eduEyebrow: 'Formação',
    education: [
      { title: 'Pós-graduação — Dev. Mobile', org: 'IFSP · 2023–2025' },
      { title: 'Tecnólogo em ADS', org: 'UNIARA · 2021–2023' },
      { title: 'Bacharelado em Administração', org: 'UNESP · 2015–2019' },
    ],
    certEyebrow: 'Certificações',
    certifications: [
      { title: 'AWS Certified Cloud Practitioner' },
      { title: 'Santander 2026 — AI React Front-end', org: 'Bootcamp DIO' },
    ],
    langEyebrow: 'Línguas',
    languages: ['Inglês — Intermediário', 'Espanhol — Intermediário'],
  },
  en: {
    role: 'Fullstack Developer — React, React Native, TypeScript, Node.js',
    contact:
      'São Paulo, Brazil · estanislau124@hotmail.com · (16) 99713-7932 · linkedin.com/in/thomas-estanislau-45ab05124 · github.com/estaniss',
    printLabel: 'Export PDF',
    summaryEyebrow: 'Profile',
    summary:
      'Fullstack developer with experience in React, React Native, TypeScript and Node.js. End-to-end work — web and mobile interfaces, app store publishing, API integration, relational databases and AWS infrastructure.',
    experienceEyebrow: 'Experience',
    roles: [
      {
        period: 'SEP 2024 — PRESENT',
        role: 'Software Developer',
        company: 'Mitra',
        description:
          'Front-end with React, Next.js, TypeScript and MUI; complex API integrations. APIs in PHP Laravel with PostgreSQL; gov.br authentication, JWT and AES-GCM encryption. Scrum: refinements, planning, retrospectives.',
      },
      {
        period: 'JUL 2022 — AUG 2024',
        role: 'Front-end Developer',
        company: 'BeOnUp',
        description:
          'Responsive web with ReactJS, TypeScript, Styled Components and ANTD. Mobile with React Native, including publishing and maintaining apps on the App Store and Google Play. AWS deployment (Docker, PM2, Nginx).',
      },
      {
        period: 'JUL 2021 — JUL 2022',
        role: 'Front-end Developer',
        company: 'BeOnUp',
        description:
          'Front-end development and collaboration on web projects with ReactJS and TypeScript.',
      },
      {
        period: 'DEC 2019 — SEP 2020',
        role: 'Sales Development Representative',
        company: 'Baitz Solutions',
        description:
          'Lead prospecting, qualification, and business requirements gathering.',
      },
    ],
    skillsEyebrow: 'Skills',
    skillGroups: [
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
        ],
      },
      { label: 'MOBILE', items: ['App Store', 'Google Play', 'React Native'] },
      { label: 'BACKEND', items: ['Node.js', 'PHP Laravel', 'REST', 'JWT'] },
      { label: 'DATA', items: ['PostgreSQL', 'MySQL', 'Oracle'] },
      { label: 'CLOUD & DEVOPS', items: ['AWS', 'Docker', 'Nginx', 'CI/CD'] },
      { label: 'PRACTICES', items: ['Clean Code', 'Scrum', 'Git'] },
    ],
    eduEyebrow: 'Education',
    education: [
      { title: 'Postgrad — Mobile Dev', org: 'IFSP · 2023–2025' },
      {
        title: 'Associate Degree in Systems Analysis',
        org: 'UNIARA · 2021–2023',
      },
      {
        title: "Bachelor's in Business Administration",
        org: 'UNESP · 2015–2019',
      },
    ],
    certEyebrow: 'Certifications',
    certifications: [
      { title: 'AWS Certified Cloud Practitioner' },
      { title: 'Santander 2026 — AI React Front-end', org: 'DIO Bootcamp' },
    ],
    langEyebrow: 'Languages',
    languages: ['English — Intermediate', 'Spanish — Intermediate'],
  },
} as const;

interface CVDocumentProps {
  lang?: 'pt' | 'en';
  fontClassNames: string;
}

export function CVDocument({ lang = 'pt', fontClassNames }: CVDocumentProps) {
  const t = TEXT[lang];

  return (
    <div className={fontClassNames}>
      <div className={`${styles.printBar} ${styles.noPrint}`}>
        <button className={styles.printButton} onClick={() => window.print()}>
          {t.printLabel}
        </button>
      </div>

      <div className={styles.page}>
        <h1 className={styles.name}>Thomas Estanislau</h1>
        <p className={styles.role}>{t.role}</p>
        <p className={styles.contact}>{t.contact}</p>

        <hr className={styles.rule} />

        <section className={styles.section}>
          <p className={styles.eyebrow}>{t.summaryEyebrow}</p>
          <p className={styles.summary}>{t.summary}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>{t.experienceEyebrow}</p>
          <div className={styles.timeline}>
            {t.roles.map((role) => (
              <div className={styles.item} key={role.company + role.period}>
                <div className={styles.period}>{role.period}</div>
                <div className={styles.roleTitle}>
                  {role.role}{' '}
                  <span className={styles.company}>· {role.company}</span>
                </div>
                <p className={styles.desc}>{role.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>{t.skillsEyebrow}</p>
          <div className={styles.skillsGrid}>
            {t.skillGroups.map((group) => (
              <div className={styles.skillGroup} key={group.label}>
                <div className={styles.skillLabel}>{group.label}</div>
                <div className={styles.pills}>
                  {group.items.map((item) => (
                    <span className={styles.pill} key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.twoCol}>
          <section className={styles.section}>
            <p className={styles.eyebrow}>{t.eduEyebrow}</p>
            {t.education.map((edu) => (
              <div className={styles.eduItem} key={edu.title}>
                <div className={styles.eduTitle}>{edu.title}</div>
                <div className={styles.eduOrg}>{edu.org}</div>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>{t.certEyebrow}</p>
            {t.certifications.map((cert) => (
              <div className={styles.eduItem} key={cert.title}>
                <div className={styles.eduTitle}>{cert.title}</div>
                {'org' in cert && (
                  <div className={styles.eduOrg}>{cert.org}</div>
                )}
              </div>
            ))}

            <p className={styles.eyebrow} style={{ marginTop: 16 }}>
              {t.langEyebrow}
            </p>
            <div className={styles.pills}>
              {t.languages.map((lang) => (
                <span className={styles.pill} key={lang}>
                  {lang}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
