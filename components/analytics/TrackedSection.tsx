// components/analytics/TrackedSection.tsx
//
// Envolve uma seção do portfólio single-page (ex: <section id="projetos">)
// e dispara SECTION_VIEW na primeira vez que ela entra na viewport —
// substitui o "pageview de /projetos" que só faz sentido em site com
// rotas separadas.
//
// Uso:
//   <TrackedSection section="projetos" id="projetos">
//     <ProjectsGrid />
//   </TrackedSection>
//
// O id continua funcionando normalmente como âncora (<a href="#projetos">).

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";

interface TrackedSectionProps {
  section: string;
  id?: string;
  children: ReactNode;
  threshold?: number;
}

export function TrackedSection({
  section,
  id,
  children,
  threshold = 0.3,
}: TrackedSectionProps) {
  const { track } = useTracker();
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          track(EVENT_TYPES.SECTION_VIEW, { section });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  return (
    <div ref={ref} id={id}>
      {children}
    </div>
  );
}
