import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { gemini, GEMINI_MODEL } from '@/lib/ai/gemini-client';
import { THOMAS_PROFILE } from '@/lib/ia-match/profile';

const MIN_LENGTH = 40;
const MAX_LENGTH = 4000;
const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1500;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

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

type Language = 'pt' | 'en';

interface AnalyzeBody {
  job_description: string;
  company_name?: string;
  language?: Language;
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

const ERROR_MESSAGES = {
  pt: {
    tooShort: (n: number) =>
      `Cole uma descrição de vaga com pelo menos ${n} caracteres.`,
    tooLong: (n: number) => `Descrição muito longa (máximo ${n} caracteres).`,
    rateLimited: (min: number) =>
      `Muitas análises em pouco tempo. Tenta de novo em ${min} minuto(s).`,
    overloaded:
      'O modelo de IA está sobrecarregado agora (alta demanda no plano gratuito). Tenta de novo em um minuto.',
    network: 'Conexão instável agora — tenta de novo em alguns segundos.',
    generic: 'Não foi possível analisar agora. Tenta de novo em instantes.',
  },
  en: {
    tooShort: (n: number) =>
      `Paste a job description with at least ${n} characters.`,
    tooLong: (n: number) => `Description too long (max ${n} characters).`,
    rateLimited: (min: number) =>
      `Too many analyses in a short time. Try again in ${min} minute(s).`,
    overloaded:
      'The AI model is overloaded right now (high demand on the free tier). Try again in a minute.',
    network: 'Unstable connection right now — try again in a few seconds.',
    generic: "Couldn't analyze it right now. Try again in a moment.",
  },
} as const;

function systemInstructionFor(language: Language): string {
  const languageInstruction =
    language === 'en'
      ? 'Respond in English, in all text fields (summary, gaps, etc). Technology/tool names stay as-is (e.g. React, TypeScript).'
      : 'Responda em português, em todos os campos de texto (summary, gaps, etc). Nomes de tecnologias/ferramentas continuam como estão (ex: React, TypeScript).';

  return `You evaluate, honestly and critically, how compatible a candidate's profile is with a job description.

Don't inflate the score to please anyone. If the job asks for things the profile doesn't cover, that should show up in "gaps" and lower the score. If the submitted text doesn't look like a real job description (e.g. random words, no real meaning), still respond in the requested format, but with compatibility_score 0 and a summary explaining it couldn't be evaluated.

${languageInstruction}`;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    compatibility_score: { type: Type.NUMBER, description: '0 to 100' },
    summary: {
      type: Type.STRING,
      description: '2-3 sentence summary explaining the score',
    },
    seniority_estimate: {
      type: Type.STRING,
      description: 'Seniority the job asks for',
    },
    predominant_stack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Job technologies also in the profile',
    },
    hard_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Hard skills from the job the profile covers',
    },
    soft_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Soft skills mentioned in the job',
    },
    gaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Job requirements the profile doesn't clearly cover",
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

async function generateWithRetry(prompt: string, language: Language) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: systemInstructionFor(language),
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        const delay = BASE_RETRY_DELAY_MS * (attempt + 1);
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  let lang: Language = 'pt';

  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';
    const rateLimit = checkRateLimit(ip);

    const body = (await request.json()) as AnalyzeBody;
    lang = body.language === 'en' ? 'en' : 'pt';
    const messages = ERROR_MESSAGES[lang];

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: messages.rateLimited(
            Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60)
          ),
        },
        { status: 429 }
      );
    }

    const jobDescription = (body.job_description ?? '').trim();

    if (jobDescription.length < MIN_LENGTH) {
      return NextResponse.json(
        { error: messages.tooShort(MIN_LENGTH) },
        { status: 400 }
      );
    }
    if (jobDescription.length > MAX_LENGTH) {
      return NextResponse.json(
        { error: messages.tooLong(MAX_LENGTH) },
        { status: 400 }
      );
    }

    const prompt = `CANDIDATE PROFILE (in Portuguese, translate concepts as needed):\n${THOMAS_PROFILE}\n\nJOB DESCRIPTION:\n${jobDescription}`;

    const response = await generateWithRetry(prompt, lang);

    const text = response.text;
    if (!text) throw new Error('Resposta da IA sem conteúdo de texto');

    const result = JSON.parse(text) as IaMatchResult;
    return NextResponse.json(result);
  } catch (err) {
    console.error('[ia-match/analyze] falha na análise:', err);
    const messages = ERROR_MESSAGES[lang];

    let message: string = messages.generic;
    if (isOverloadedError(err)) message = messages.overloaded;
    else if (isNetworkError(err)) message = messages.network;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
