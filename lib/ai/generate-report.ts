// lib/ai/generate-report.ts
//
// Manda o resumo compacto (não o banco bruto) pra IA e pede de volta
// um JSON estruturado. O prompt força "responda só JSON" porque o
// consumidor (dashboard) espera um formato fixo, não texto livre.

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AnalyticsSummary, Period } from "./build-summary";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Confira o model id atual em docs.claude.com antes de rodar em produção —
// nomes de modelo mudam com o tempo e isso não é algo que vale hardcodear
// sem checar.
const MODEL = process.env.AI_REPORT_MODEL || "claude-sonnet-5";

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

const SYSTEM_PROMPT = `Você é um analista de dados que ajuda um desenvolvedor a interpretar as métricas do próprio portfólio.

Você vai receber um JSON com dados agregados de analytics (visitas, projetos mais vistos, tecnologias mais visualizadas, resultados da ferramenta de compatibilidade com vagas "IA Match", downloads e contatos).

Responda APENAS com um JSON válido, sem markdown, sem texto antes ou depois, exatamente neste formato:

{
  "summary_text": "resumo executivo em 2-3 frases, em português",
  "top_recruiter_technologies": ["até 5 tecnologias que mais aparecem como interesse de quem visita/analisa vagas"],
  "most_relevant_projects": ["até 3 projetos com base em views e engajamento"],
  "growing_technologies": ["tecnologias com sinal de crescimento nesse período, se houver dado suficiente"],
  "most_requested_skills": ["hard e soft skills mais recorrentes nas análises do IA Match"],
  "portfolio_suggestions": ["até 4 sugestões concretas e acionáveis pra melhorar o portfólio"],
  "new_project_recommendations": ["até 3 ideias de projeto, se fizer sentido com os dados"],
  "market_trends": ["até 3 observações sobre o mercado com base nos dados de IA Match"],
  "avg_job_compatibility": número ou null se não houver dados de IA Match,
  "areas_to_strengthen": ["até 3 áreas que os dados sugerem precisar de mais destaque/prova"]
}

Se não houver dados suficientes pra alguma seção (ex: poucas sessões no período), retorne array vazio nela em vez de inventar. Nunca invente números que não estejam no JSON de entrada.`;

export async function generateReport(
  summary: AnalyticsSummary
): Promise<ReportContent> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(summary) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Resposta da IA sem bloco de texto");
  }

  const cleaned = textBlock.text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned) as ReportContent;
  } catch (err) {
    console.error("[generate-report] resposta não é JSON válido:", textBlock.text);
    throw err;
  }
}

export type { Period };
