// components/projects/ProjectCard.tsx
//
// Card de projeto instrumentado — exemplo de integração das Fases 1 e 2.
// useProjectView() dispara aqui porque, nesse teste, cada card já
// representa o "detalhe" do projeto (sem modal/página separada).
// Se no seu portfólio real os cards da listagem são só uma prévia,
// mova useProjectView() pro componente do modal/página de detalhe.

"use client";

import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useProjectView } from "@/lib/analytics/use-project-view";
import { TrackedProjectLink } from "@/components/analytics/TrackedProjectLink";

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
}

export function ProjectCard({ project }: { project: Project }) {
  useProjectView({
    project_id: project.id,
    project_name: project.name,
    technologies: project.technologies,
  });

  const linkPayload = { project_id: project.id, project_name: project.name };

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {project.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.description}
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {project.technologies.map((tech) => (
              <Chip key={tech} label={tech} size="small" />
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <TrackedProjectLink kind="github" href={project.githubUrl} project={linkPayload}>
              GitHub
            </TrackedProjectLink>
            {project.demoUrl && (
              <TrackedProjectLink kind="demo" href={project.demoUrl} project={linkPayload}>
                Demo
              </TrackedProjectLink>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
