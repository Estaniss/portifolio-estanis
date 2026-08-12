// lib/analytics/use-project-view.ts
//
// Uso: dentro do componente/página de um projeto (card em destaque,
// modal de detalhes, ou página própria do projeto), chamar:
//
//   useProjectView({ id: "financ-ia", name: "Financ.IA", technologies: ["React", "Vite", "Gemini API"] })
//
// Isso dispara PROJECT_VIEW uma vez (visualização) e PROJECT_TIME_SPENT
// quando o usuário sai do projeto (troca de rota, fecha a aba, ou o
// componente desmonta) — os dois em eventos separados, porque "quantas
// vezes foi visto" e "quanto tempo ficou" são métricas independentes
// e uma não deveria depender da outra ter sido calculada corretamente.

"use client";

import { useEffect, useRef } from "react";
import { useTracker } from "./tracker";
import { EVENT_TYPES } from "./events";
import type { ProjectEventPayload } from "./events";

export function useProjectView(project: ProjectEventPayload) {
  const { track } = useTracker();
  const startedAtRef = useRef<number | null>(null);
  const sentDurationRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
    sentDurationRef.current = false;

    track(EVENT_TYPES.PROJECT_VIEW, project);

    const sendDuration = () => {
      if (sentDurationRef.current || !startedAtRef.current) return;
      sentDurationRef.current = true;

      const durationSeconds = Math.round(
        (Date.now() - startedAtRef.current) / 1000
      );

      // Ignora visualizações relâmpago (< 1s) — normalmente é scroll
      // passando por cima do card, não interesse real no projeto.
      if (durationSeconds < 1) return;

      track(EVENT_TYPES.PROJECT_TIME_SPENT, {
        ...project,
        duration_seconds: durationSeconds,
      });
    };

    // Cobre fechar a aba / trocar de app enquanto o componente segue montado.
    window.addEventListener("pagehide", sendDuration);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendDuration();
    });

    return () => {
      // Cobre navegação client-side (o componente desmonta antes do pagehide).
      sendDuration();
      window.removeEventListener("pagehide", sendDuration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.project_id]);
}
