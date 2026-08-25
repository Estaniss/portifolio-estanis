// app/api/ia-match/analyze/route.ts
//
// Endpoint PÚBLICO (qualquer visitante do portfólio pode chamar) que
// compara uma descrição de vaga contra o perfil real do Thomas via
// Gemini.
//
// ATUALIZAÇÃO 3: rate limit por IP. Cada chamada custa uma requisição
// real à API do Gemini — sem limite, um bot (ou alguém testando em
// loop) esgota a cota gratuita rapidinho. Limite: 5 análises a cada 10
// minutos por IP.
//
// Mesma ressalva do endpoint de contato: rate limit em memória não
// sobrevive a cold start em serverless (cada instância nova zera o
// contador). É uma primeira barreira, não uma solução definitiva — se
// virar alvo de abuso de verdade, evolui pra Upstash Redis.

import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { gemini, GEMINI_MODEL } from '@/lib/ai/gemini-client';
import { THOMAS_PROFILE } from '@/lib/ia-match/profile';

const MIN_LENGTH = 40;
const MAX_LENGTH = 4000;
const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1500;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const RATE_LIMIT_MAX_REQUESTS = 5;

// Map em memória: ip -> lista de timestamps das últimas chamadas aceitas.
const requestsByIp = new Map<string, number[]>();

function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = (requestsByIp.get(ip) ?? []).filter(
    (t) => t > windowStart
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestInWindow = timestamps[0];
    const retryAfterSeconds = Math.ceil(
      (oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000
    );
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  requestsByIp.set(ip, timestamps);
  return { allowed: true };
}

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
      description: '0 a 100, quão compatível o perfil é com a vaga',
    },
    summary: {
      type: Type.STRING,
      description: '2-3 frases em português explicando a nota',
    },
    seniority_estimate: {
      type: Type.STRING,
      description: 'Senioridade que a vaga pede (ex: júnior, pleno, sênior)',
    },
    predominant_stack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Tecnologias da vaga que também estão no perfil',
    },
    hard_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Hard skills da vaga que o perfil atende',
    },
    soft_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Soft skills mencionadas na vaga (inferidas do texto)',
    },
    gaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Requisitos da vaga que o perfil não cobre claramente',
    },
  },
  required: [
    'compatibility_score',
    'summary',
    'seniority_estimate',
    'predominant_stack',
    'hard_skills',
    'soft_skills',
    'gaps',
  ],
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNetworkError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const cause =
    err instanceof Error
      ? (err.cause as { code?: string } | undefined)
      : undefined;
  return (
    message.includes('fetch failed') ||
    cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
    cause?.code === 'ECONNRESET' ||
    cause?.code === 'ETIMEDOUT'
  );
}

function isOverloadedError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  const message = err instanceof Error ? err.message : String(err);
  return (
    status === 503 ||
    status === 429 ||
    message.includes('UNAVAILABLE') ||
    message.includes('high demand')
  );
}

function isRetryableError(err: unknown): boolean {
  return isNetworkError(err) || isOverloadedError(err);
}

async function generateWithRetry(prompt: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });
    } catch (err) {
      lastError = err;

      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        const delay = BASE_RETRY_DELAY_MS * (attempt + 1);
        const reason = isOverloadedError(err)
          ? 'modelo sobrecarregado'
          : 'falha de rede';
        console.warn(
          `[ia-match/analyze] tentativa ${attempt + 1} falhou (${reason}), tentando de novo em ${delay}ms...`
        );
        await sleep(delay);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Muitas análises em pouco tempo. Tenta de novo em ${Math.ceil(
            (rateLimit.retryAfterSeconds ?? 60) / 60
          )} minuto(s).`,
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as AnalyzeBody;
    const jobDescription = (body.job_description ?? '').trim();

    if (jobDescription.length < MIN_LENGTH) {
      return NextResponse.json(
        {
          error: `Cole uma descrição de vaga com pelo menos ${MIN_LENGTH} caracteres.`,
        },
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

    const response = await generateWithRetry(prompt);

    const text = response.text;
    if (!text) throw new Error('Resposta da IA sem conteúdo de texto');

    const result = JSON.parse(text) as IaMatchResult;

    return NextResponse.json(result);
  } catch (err) {
    console.error('[ia-match/analyze] falha na análise:', err);

    let message =
      'Não foi possível analisar agora. Tenta de novo em instantes.';
    if (isOverloadedError(err)) {
      message =
        'O modelo de IA está sobrecarregado agora (alta demanda no plano gratuito). Tenta de novo em um minuto.';
    } else if (isNetworkError(err)) {
      message = 'Conexão instável agora — tenta de novo em alguns segundos.';
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
