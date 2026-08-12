// components/analytics/TrackedProjectLink.tsx
//
// Wrapper fino em volta de <a>, pra não espalhar `track(...)` manual
// em cada botão de cada card de projeto. Uso:
//
//   <TrackedProjectLink
//     href={project.githubUrl}
//     kind="github"
//     project={{ project_id: project.id, project_name: project.name }}
//   >
//     <GitHubIcon />
//   </TrackedProjectLink>

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";
import type { ProjectEventPayload } from "@/lib/analytics/events";

const EVENT_BY_KIND = {
  github: EVENT_TYPES.CLICK_GITHUB,
  demo: EVENT_TYPES.CLICK_DEMO,
  case: EVENT_TYPES.CLICK_CASE,
} as const;

interface TrackedProjectLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  kind: keyof typeof EVENT_BY_KIND;
  project: ProjectEventPayload;
  children: ReactNode;
}

export function TrackedProjectLink({
  kind,
  project,
  children,
  onClick,
  ...anchorProps
}: TrackedProjectLinkProps) {
  const { track } = useTracker();

  return (
    <a
      {...anchorProps}
      target={anchorProps.target ?? "_blank"}
      rel={anchorProps.rel ?? "noopener noreferrer"}
      onClick={(event) => {
        track(EVENT_BY_KIND[kind], project);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
