// app/api/ia-match/analyze/route.ts
//
// Endpoint PÚBLICO (qualquer visitante do portfólio pode chamar) que
// compara uma descrição de vaga contra o perfil real do Thomas via
// Gemini. Isso tem custo por chamada — os limites abaixo (tamanho
// mínimo/máximo do texto) são a proteção básica contra abuso; se o
// tráfego crescer, vale evoluir pra rate limit por IP ou captcha.

import { NextResponse } from "next/server";
import { Type } from "@google/genai";
import { gemini, GEMINI_MODEL } from "@/lib/ai/gemini-client";
import { THOMAS_PROFILE } from "@/lib/ia-match/profile";

const MIN_LENGTH = 40;
const MAX_LENGTH = 4000;

interface AnalyzeBody {
  job_description: string;
  company_name?: string;
}

export interface IaMatchResult {
  compatibility_score: number;
  summary: string;
  seniority_estimate: string;
  predominant_stack: string[];
  hard_skills: string[];
  soft_skills: string[];
  gaps: string[];
}

const SYSTEM_INSTRUCTION = `Você avalia, de forma honesta e criteriosa, a compatibilidade entre o perfil de um candidato e uma descrição de vaga.

Não infle a nota pra agradar. Se a vaga pedir coisas que o perfil não cobre, isso deve aparecer nos "gaps" e reduzir a nota. Se o texto enviado não parecer uma descrição de vaga de verdade (ex: só um monte de palavras soltas, ou vazio de sentido), ainda assim responda no formato pedido, mas com compatibility_score 0 e summary explicando que não foi possível avaliar.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    compatibility_score: {
      type: Type.NUMBER,
      description: "0 a 100, quão compatível o perfil é com a vaga",
    },
    summary: {
      type: Type.STRING,
      description: "2-3 frases em português explicando a nota",
    },
    seniority_estimate: {
      type: Type.STRING,
      description: "Senioridade que a vaga pede (ex: júnior, pleno, sênior)",
    },
    predominant_stack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Tecnologias da vaga que também estão no perfil",
    },
    hard_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Hard skills da vaga que o perfil atende",
    },
    soft_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Soft skills mencionadas na vaga (inferidas do texto)",
    },
    gaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Requisitos da vaga que o perfil não cobre claramente",
    },
  },
  required: [
    "compatibility_score",
    "summary",
    "seniority_estimate",
    "predominant_stack",
    "hard_skills",
    "soft_skills",
    "gaps",
  ],
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeBody;
    const jobDescription = (body.job_description ?? "").trim();

    if (jobDescription.length < MIN_LENGTH) {
      return NextResponse.json(
        { error: `Cole uma descrição de vaga com pelo menos ${MIN_LENGTH} caracteres.` },
        { status: 400 }
      );
    }
    if (jobDescription.length > MAX_LENGTH) {
      return NextResponse.json(
        { error: `Descrição muito longa (máximo ${MAX_LENGTH} caracteres).` },
        { status: 400 }
      );
    }

    const prompt = `PERFIL DO CANDIDATO:\n${THOMAS_PROFILE}\n\nDESCRIÇÃO DA VAGA:\n${jobDescription}`;

    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Resposta da IA sem conteúdo de texto");

    const result = JSON.parse(text) as IaMatchResult;

    return NextResponse.json(result);
  } catch (err) {
    console.error("[ia-match/analyze] falha na análise:", err);
    return NextResponse.json(
      { error: "Não foi possível analisar agora. Tenta de novo em instantes." },
      { status: 500 }
    );
  }
}
