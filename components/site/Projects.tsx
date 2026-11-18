import styles from "./Projects.module.css";
import { TrackedSection } from "@/components/analytics/TrackedSection";
import { Reveal } from "./Reveal";
import { ProjectRow, type SiteProject } from "./ProjectRow";

interface BilingualProject extends Omit<SiteProject, "description"> {
  description_pt: string;
  description_en: string;
}

const PROJECTS: BilingualProject[] = [
  {
    id: "luma-learning",
    name: "Luma Learning",
    description_pt:
      "Landing page responsiva desenvolvida a partir do Figma para a Buzzvel. Inclui navegação adaptada para dispositivos móveis, formulário acessível e imagens otimizadas com next/image.",
    description_en:
      "Responsive landing page built from Figma designs for Buzzvel. Includes mobile navigation, an accessible contact form, and optimized images with next/image.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS v4"],
    githubUrl: "https://github.com/Estaniss/buzzvel-challenge",
    demoUrl: "https://buzzvel-challenge-7tde.vercel.app/",
  },
  {
    id: "jungle-gaming",
    name: "Jungle Gaming",
    description_pt:
      "Marketplace de NFTs com API simulada por MSW e comunicação em tempo real via Socket.IO. Inclui gerenciamento de estado, testes E2E e cenários de falha para validar os fluxos da aplicação.",
    description_en:
      "NFT marketplace with an MSW-mocked API and real-time communication through Socket.IO. Includes state management, E2E tests, and failure scenarios to validate application flows.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "Socket.IO",
      "MSW",
      "Playwright",
    ],
    githubUrl: "https://github.com/Estaniss/desafio-jungle-gaming",
    demoUrl: "https://desafio-jungle-gaming-gules.vercel.app/",
  },
  {
    id: "paulapalooza",
    name: "Paulapalooza",
    description_pt:
      "App de RSVP para festa com suporte a múltiplos convidados, painel admin com cards de estatísticas e exportação em PDF, e validação de telefone duplicado.",
    description_en:
      "Party RSVP app with support for multiple guests, an admin panel with stat cards and PDF export, and duplicate phone validation.",
    technologies: ["Next.js", "Supabase", "TypeScript"],
    githubUrl: "https://github.com/Estaniss/paulapalooza",
    demoUrl: "https://paulapalooza.vercel.app/",
  },
  {
    id: "financ-ia",
    name: "Financ.IA",
    description_pt:
      "Simulador de finanças pessoais com IA. Formulário multi-etapas, histórico local e um chat contextual pra tirar dúvidas sobre a própria simulação.",
    description_en:
      "AI-powered personal finance simulator. Multi-step form, local history, and a contextual chat to ask questions about the simulation itself.",
    technologies: ["React", "Vite", "Tailwind CSS", "Gemini API"],
    githubUrl: "https://github.com/Estaniss/financia",
    demoUrl: "https://financ-ia-simulator.vercel.app/",
  },
];

const TEXT = {
  pt: {
    eyebrow: "Projetos selecionados",
    index: "04 — TRABALHOS",
    title: "O que já construí",
    count: "PROJETOS",
    github: "GitHub",
    demo: "Ver projeto",
  },
  en: {
    eyebrow: "Selected projects",
    index: "04 — SELECTED WORK",
    title: "What I've built",
    count: "PROJECTS",
    github: "GitHub",
    demo: "View project",
  },
} as const;

export function Projects({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];

  return (
    <TrackedSection section="projetos" id="projetos">
      <section className={styles.section} aria-labelledby="projects-title">
        <div className="container">
          <div className={styles.heading}>
            <div className={styles.headingTop}>
              <p className="eyebrow">{t.eyebrow}</p>
              <span className={styles.sectionIndex}>{t.index}</span>
            </div>

            <div className={styles.headingBottom}>
              <h2 id="projects-title" className={styles.title}>
                {t.title}
                <span>.</span>
              </h2>

              <p className={styles.projectCount}>
                <strong>{String(PROJECTS.length).padStart(2, "0")}</strong>
                <span>{t.count}</span>
              </p>
            </div>
          </div>

          <div className={styles.list}>
            {PROJECTS.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <ProjectRow
                  index={index}
                  project={{
                    ...project,
                    description:
                      lang === "pt"
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
