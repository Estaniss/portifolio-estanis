// app/api/contact/route.ts
//
// Envia o email de contato de verdade (antes só simulava). Proteções
// básicas contra spam: honeypot (campo invisível que só bot preenche)
// e rate limit simples em memória por IP.
//
// O rate limit em memória NÃO sobrevive a cold start em serverless
// (cada instância nova começa do zero) — é uma primeira barreira, não
// uma solução definitiva. Se virar alvo de spam de verdade, o próximo
// passo é Upstash Redis (tem free tier, é o padrão pra rate limit em
// Vercel) ou um captcha (Cloudflare Turnstile é gratuito e leve).

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'estanislau124@hotmail.com';
// onboarding@resend.dev funciona sem precisar verificar domínio próprio —
// troque por algo como contato@seudominio.com quando tiver um domínio
// verificado no Resend (fica com menos cara de teste).
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || 'Portfólio <onboarding@resend.dev>';

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 3000;
const RATE_LIMIT_WINDOW_MS = 30_000;

// Map em memória: ip -> timestamp do último envio aceito.
const lastSubmissionByIp = new Map<string, number>();

interface ContactBody {
  name?: string;
  email: string;
  message: string;
  // Campo honeypot: precisa ficar vazio. Usuário real nunca vê nem
  // preenche (fica fora da tela via CSS); bot que preenche tudo cai aqui.
  website?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    // Honeypot preenchido = bot. Responde sucesso falso pra não
    // ensinar o bot a se adaptar, mas não envia nada de verdade.
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const name = (body.name ?? '').trim().slice(0, 200);
    const email = (body.email ?? '').trim();
    const message = (body.message ?? '').trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }
    if (message.length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Mensagem muito curta (mínimo ${MIN_MESSAGE_LENGTH} caracteres).`,
        },
        { status: 400 }
      );
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Mensagem muito longa (máximo ${MAX_MESSAGE_LENGTH} caracteres).`,
        },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';
    const lastSubmission = lastSubmissionByIp.get(ip);
    if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { error: 'Espera alguns segundos antes de enviar de novo.' },
        { status: 429 }
      );
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: name ? `Contato do portfólio — ${name}` : 'Contato do portfólio',
      text: `De: ${name || 'não informado'} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error('[contact] falha ao enviar via Resend:', error);
      return NextResponse.json(
        { error: 'Não foi possível enviar agora. Tenta de novo em instantes.' },
        { status: 502 }
      );
    }

    lastSubmissionByIp.set(ip, Date.now());

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] erro inesperado:', err);
    return NextResponse.json(
      { error: 'Não foi possível enviar agora. Tenta de novo em instantes.' },
      { status: 500 }
    );
  }
}
