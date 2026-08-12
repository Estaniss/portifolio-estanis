// app/page.tsx — Home de teste com projetos reais do Thomas

import { Container, Grid, Stack, Typography } from "@mui/material";
import { ProjectCard, type Project } from "@/components/projects/ProjectCard";
import { ContactSection } from "@/components/contact/ContactSection";
import { IaMatchTool } from "@/components/ia-match/IaMatchTool";
import { TrackedSection } from "@/components/analytics/TrackedSection";

const PROJECTS: Project[] = [
  {
    id: "paulapalooza",
    name: "Paulapalooza",
    description: "App de RSVP para festa, com painel admin e exportação em PDF.",
    technologies: ["Next.js", "Supabase", "TypeScript"],
    githubUrl: "https://github.com/Estaniss",
    demoUrl: "https://paulapalooza.vercel.app/",
  },
  {
    id: "financ-ia",
    name: "Financ.IA",
    description: "Simulador de finanças pessoais com IA (Gemini) e chat contextual.",
    technologies: ["React", "Vite", "Tailwind CSS", "Gemini API"],
    githubUrl: "https://github.com/Estaniss",
    demoUrl: "https://financ-ia-simulator.vercel.app/",
  },
  {
    id: "agiliza-cadastro",
    name: "Agiliza — Cadastro Mobiliário",
    description: "Sistema de cadastro tributário municipal com integração gov.br.",
    technologies: ["Next.js", "TypeScript", "MUI", "Formik", "Laravel"],
    githubUrl: "https://github.com/Estaniss",
  },
];

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Thomas Estanislau
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Projeto de teste — navegue pelos cards abaixo pra gerar eventos de
            analytics (pageview, project_view, cliques). Depois confira em{" "}
            <code>/admin</code>.
          </Typography>
        </Stack>

        <TrackedSection section="projetos" id="projetos">
          <Grid container spacing={3}>
            {PROJECTS.map((project) => (
              <Grid size={{ xs: 12, md: 4 }} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </TrackedSection>

        <IaMatchTool />
        <ContactSection />
      </Stack>
    </Container>
  );
}
