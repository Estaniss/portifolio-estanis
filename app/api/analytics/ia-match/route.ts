// app/api/analytics/ia-match/route.ts
//
// Diferente de app/api/analytics/events/route.ts (que recebe lotes
// pequenos, de baixo valor individual, e por isso usa sendBeacon +
// batching), aqui cada request representa UMA análise completa da
// ferramenta IA Match — vale a pena gravar imediatamente, sem fila.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { resolveSession } from "@/lib/analytics/resolve-session";
import type { SessionContext } from "@/lib/analytics/events";

interface IaMatchBody {
  session: SessionContext;
  company_name?: string | null;
  seniority?: string | null;
  compatibility_score: number;
  predominant_stack?: string[];
  hard_skills?: string[];
  soft_skills?: string[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IaMatchBody;

    if (
      !body?.session?.visitorId ||
      typeof body.compatibility_score !== "number" ||
      body.compatibility_score < 0 ||
      body.compatibility_score > 100
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const sessionId = await resolveSession(body.session, request);

    const { error } = await supabaseAdmin.from("ia_match_runs").insert({
      session_id: sessionId,
      company_name: body.company_name || null,
      seniority: body.seniority || null,
      compatibility_score: body.compatibility_score,
      predominant_stack: body.predominant_stack ?? [],
      hard_skills: body.hard_skills ?? [],
      soft_skills: body.soft_skills ?? [],
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[analytics/ia-match] falha ao gravar análise:", err);
    // Diferente da rota de events, aqui retorna 500 mesmo: se isso falhar
    // silenciosamente, você perde uma análise inteira sem saber, e é
    // dado que não dá pra reconstruir depois (ao contrário de um pageview).
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
