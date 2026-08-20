// components/site/ProjectRow.tsx

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

export function ProjectRow({ project }: { project: SiteProject }) {
  useProjectView({
    project_id: project.id,
    project_name: project.name,
    technologies: project.technologies,
  });

  const linkPayload = { project_id: project.id, project_name: project.name };

  return (
    <div className={styles.row}>
      <ProjectCover id={project.id} name={project.name} />
      <div>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.description}</p>
        <div className={styles.meta}>
          <span className={styles.stack}>
            {project.technologies.join(" · ")}
          </span>
          <div className={styles.links}>
            <TrackedProjectLink kind="github" href={project.githubUrl} project={linkPayload}>
              <span className="text-link">GitHub →</span>
            </TrackedProjectLink>
            {project.demoUrl && (
              <TrackedProjectLink kind="demo" href={project.demoUrl} project={linkPayload}>
                <span className="text-link">Demo →</span>
              </TrackedProjectLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
