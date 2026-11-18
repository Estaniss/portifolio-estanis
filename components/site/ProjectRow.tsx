"use client";

import styles from "./Projects.module.css";
import { useProjectView } from "@/lib/analytics/use-project-view";
import { TrackedProjectLink } from "@/components/analytics/TrackedProjectLink";
import { ProjectCover } from "./ProjectCover";

export interface SiteProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
}

interface ProjectRowProps {
  project: SiteProject;
  index: number;
  githubLabel?: string;
  demoLabel?: string;
}

export function ProjectRow({
  project,
  index,
  githubLabel = "GitHub",
  demoLabel = "Ver projeto",
}: ProjectRowProps) {
  useProjectView({
    project_id: project.id,
    project_name: project.name,
    technologies: project.technologies,
  });

  const linkPayload = {
    project_id: project.id,
    project_name: project.name,
  };

  return (
    <article
      className={`${styles.row} ${index % 2 === 1 ? styles.rowReverse : ""}`}
    >
      <div className={styles.coverWrap}>
        <ProjectCover id={project.id} name={project.name} />
      </div>

      <div className={styles.content}>
        <span className={styles.projectIndex}>
          {String(index + 1).padStart(2, "0")} / 04
        </span>

        <h3 className={styles.name}>{project.name}</h3>

        <p className={styles.desc}>{project.description}</p>

        <div className={styles.meta}>
          <div className={styles.stack} aria-label="Tecnologias utilizadas">
            {project.technologies.map((technology) => (
              <span key={technology} className={styles.technology}>
                {technology}
              </span>
            ))}
          </div>

          <div className={styles.links}>
            <TrackedProjectLink
              kind="github"
              href={project.githubUrl}
              project={linkPayload}
            >
              <span>{githubLabel} ↗</span>
            </TrackedProjectLink>

            {project.demoUrl && (
              <TrackedProjectLink
                kind="demo"
                href={project.demoUrl}
                project={linkPayload}
              >
                <span>{demoLabel} ↗</span>
              </TrackedProjectLink>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
