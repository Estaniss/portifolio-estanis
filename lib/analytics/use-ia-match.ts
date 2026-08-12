// lib/analytics/use-ia-match.ts
//
// Uso: dentro do componente que exibe o resultado da análise do IA Match,
// depois que a análise terminar:
//
//   const recordIaMatch = useRecordIaMatch();
//
//   recordIaMatch({
//     compatibility_score: 78,
//     company_name: "Empresa X",       // opcional
//     seniority: "pleno",
//     predominant_stack: ["React", "Node.js"],
//     hard_skills: ["TypeScript", "AWS"],
//     soft_skills: ["Comunicação"],
//   });
//
// Dispara duas coisas:
// 1. Um evento leve (IA_MATCH_RUN) na fila normal — é o que alimenta o
//    funil de conversão (Fase 3), sem precisar esperar a análise completa
//    persistir.
// 2. Um POST imediato pra /api/analytics/ia-match, que grava o registro
//    completo em ia_match_runs — é o que alimenta o dashboard da Fase 4.

"use client";

import { useTracker } from "./tracker";
import { EVENT_TYPES } from "./events";

export interface IaMatchRunInput {
  compatibility_score: number;
  company_name?: string;
  seniority?: string;
  predominant_stack?: string[];
  hard_skills?: string[];
  soft_skills?: string[];
}

export function useRecordIaMatch() {
  const { track, sessionContext } = useTracker();

  return async function recordIaMatch(input: IaMatchRunInput) {
    track(EVENT_TYPES.IA_MATCH_RUN, {
      compatibility_score: input.compatibility_score,
    });

    if (!sessionContext) return;

    try {
      await fetch("/api/analytics/ia-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: sessionContext, ...input }),
      });
    } catch {
      // Falha silenciosa de propósito: a ferramenta IA Match não pode
      // quebrar pro visitante por causa de um erro de analytics.
    }
  };
}
