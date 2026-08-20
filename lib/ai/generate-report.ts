// lib/ai/generate-report.ts
//
// Manda o resumo compacto (não o banco bruto) pra IA e pede de volta um
// JSON estruturado. Usa o modo de "structured output" nativo do Gemini
// (responseSchema) em vez de só pedir "responda em JSON" no prompt —
// o SDK garante que a resposta bate com o schema, então não precisamos
// de lógica de "tentar parsear e torcer" como seria com texto livre.

import "server-only";
import { Type } from "@google/genai";
import { gemini, GEMINI_MODEL } from "./gemini-client";
import type { AnalyticsSummary, Period } from "./build-summary";

export interface ReportContent {
  summary_text: string;
  top_recruiter_technologies: string[];
  most_relevant_projects: string[];
  growing_technologies: string[];
  most_requested_skills: string[];
  portfolio_suggestions: string[];
  new_project_recommendations: string[];
  market_trends: string[];
  avg_job_compatibility: number | null;
  areas_to_strengthen: string[];
}

const SYSTEM_INSTRUCTION = `Você é um analista de dados que ajuda um desenvolvedor a interpretar as métricas do próprio portfólio.

Você vai receber um JSON com dados agregados de analytics (visitas, projetos mais vistos, tecnologias mais visualizadas, resultados da ferramenta de compatibilidade com vagas "IA Match", downloads e contatos).

Gere um relatório no formato pedido. Se não houver dados suficientes pra alguma seção (ex: poucas sessões no período), retorne array vazio nela em vez de inventar. Nunca invente números que não estejam no JSON de entrada.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary_text: {
      type: Type.STRING,
      description: "Resumo executivo em 2-3 frases, em português",
    },
    top_recruiter_technologies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 5 tecnologias que mais aparecem como interesse de quem visita/analisa vagas",
    },
    most_relevant_projects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 3 projetos com base em views e engajamento",
    },
    growing_technologies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Tecnologias com sinal de crescimento nesse período, se houver dado suficiente",
    },
    most_requested_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Hard e soft skills mais recorrentes nas análises do IA Match",
    },
    portfolio_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 4 sugestões concretas e acionáveis pra melhorar o portfólio",
    },
    new_project_recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 3 ideias de projeto, se fizer sentido com os dados",
    },
    market_trends: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 3 observações sobre o mercado com base nos dados de IA Match",
    },
    avg_job_compatibility: {
      type: Type.NUMBER,
      description: "Compatibilidade média das vagas analisadas — copie de ia_match.avg_compatibility",
    },
    areas_to_strengthen: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Até 3 áreas que os dados sugerem precisar de mais destaque/prova",
    },
  },
  required: [
    "summary_text",
    "top_recruiter_technologies",
    "most_relevant_projects",
    "growing_technologies",
    "most_requested_skills",
    "portfolio_suggestions",
    "new_project_recommendations",
    "market_trends",
    "areas_to_strengthen",
  ],
};

export async function generateReport(
  summary: AnalyticsSummary
): Promise<ReportContent> {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: JSON.stringify(summary),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Resposta da IA sem conteúdo de texto");
  }

  const parsed = JSON.parse(text) as ReportContent;

  return {
    ...parsed,
    avg_job_compatibility: parsed.avg_job_compatibility ?? null,
  };
}

export type { Period };
