import styles from './Projects.module.css';
import { TrackedSection } from '@/components/analytics/TrackedSection';
import { Reveal } from './Reveal';
import { ProjectRow, type SiteProject } from './ProjectRow';

const PROJECTS: SiteProject[] = [
  {
    id: 'paulapalooza',
    name: 'Paulapalooza',
    description:
      'App de RSVP para festa com suporte a múltiplos convidados, painel admin com cards de estatísticas e exportação em PDF, e validação de telefone duplicado.',
    technologies: ['Next.js', 'Supabase', 'TypeScript'],
    githubUrl: 'https://github.com/Estaniss/paulapalooza',
    demoUrl: 'https://paulapalooza.vercel.app/',
  },
  {
    id: 'financ-ia',
    name: 'Financ.IA',
    description:
      'Simulador de finanças pessoais com IA. Formulário multi-etapas, histórico local e um chat contextual pra tirar dúvidas sobre a própria simulação.',
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

export function Projects() {
  return (
    <TrackedSection section="projetos" id="projetos">
      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Projetos</p>
          <h2 className={styles.title}>O que já construí</h2>

          <div className={styles.list}>
            {PROJECTS.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <ProjectRow project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </TrackedSection>
  );
}
