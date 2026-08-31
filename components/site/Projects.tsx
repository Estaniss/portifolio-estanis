import styles from './Projects.module.css';
import { TrackedSection } from '@/components/analytics/TrackedSection';
import { Reveal } from './Reveal';
import { ProjectRow, type SiteProject } from './ProjectRow';

interface BilingualProject extends Omit<SiteProject, 'description'> {
  description_pt: string;
  description_en: string;
}

const PROJECTS: BilingualProject[] = [
  {
    id: 'paulapalooza',
    name: 'Paulapalooza',
    description_pt:
      'App de RSVP para festa com suporte a múltiplos convidados, painel admin com cards de estatísticas e exportação em PDF, e validação de telefone duplicado.',
    description_en:
      'Party RSVP app with support for multiple guests, an admin panel with stat cards and PDF export, and duplicate phone validation.',
    technologies: ['Next.js', 'Supabase', 'TypeScript'],
    githubUrl: 'https://github.com/Estaniss/paulapalooza',
    demoUrl: 'https://paulapalooza.vercel.app/',
  },
  {
    id: 'financ-ia',
    name: 'Financ.IA',
    description_pt:
      'Simulador de finanças pessoais com IA. Formulário multi-etapas, histórico local e um chat contextual pra tirar dúvidas sobre a própria simulação.',
    description_en:
      'AI-powered personal finance simulator. Multi-step form, local history, and a contextual chat to ask questions about the simulation itself.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Gemini API'],
    githubUrl: 'https://github.com/Estaniss/financia',
    demoUrl: 'https://financ-ia-simulator.vercel.app/',
  },
  /* {
    id: 'linkedai',
    name: 'LinkedAI',
    description:
      'Plataforma SaaS de busca e aplicação a vagas, com busca semântica via embeddings e fila de processamento assíncrono. Clean Architecture de ponta a ponta.',
    technologies: [
      'Next.js',
      'Prisma',
      'PostgreSQL',
      'pgvector',
      'Redis',
      'OpenAI',
    ],
    githubUrl: 'https://github.com/estaniss',
  }, */
];

const TEXT = {
  pt: {
    eyebrow: 'Projetos',
    title: 'O que já construí',
    github: 'GitHub',
    demo: 'Demo',
  },
  en: {
    eyebrow: 'Projects',
    title: "What I've built",
    github: 'GitHub',
    demo: 'Demo',
  },
} as const;

export function Projects({ lang = 'pt' }: { lang?: 'pt' | 'en' }) {
  const t = TEXT[lang];

  return (
    <TrackedSection section="projetos" id="projetos">
      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className={styles.title}>{t.title}</h2>

          <div className={styles.list}>
            {PROJECTS.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <ProjectRow
                  project={{
                    ...project,
                    description:
                      lang === 'pt'
                        ? project.description_pt
                        : project.description_en,
                  }}
                  githubLabel={t.github}
                  demoLabel={t.demo}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </TrackedSection>
  );
}
