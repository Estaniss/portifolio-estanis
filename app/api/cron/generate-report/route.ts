// app/api/cron/generate-report/route.ts
//
// Chamada pelo Vercel Cron (ver vercel.json), uma vez por período.
// Protegida por CRON_SECRET — sem isso, qualquer um poderia bater
// nessa rota e gastar sua cota da API da Anthropic de graça.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { buildAnalyticsSummary, type Period } from "@/lib/ai/build-summary";
import { generateReport } from "@/lib/ai/generate-report";

export const maxDuration = 60; // gerar o relatório envolve 1 chamada de LLM, dá pra passar do limite padrão de 10s

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") as Period | null;

  if (!period || !["weekly", "monthly", "yearly"].includes(period)) {
    return NextResponse.json(
      { error: "period precisa ser weekly, monthly ou yearly" },
      { status: 400 }
    );
  }

  try {
    const summary = await buildAnalyticsSummary(period);
    const report = await generateReport(summary);

    const referenceDate = new Date().toISOString().slice(0, 10);

    const { error } = await supabaseAdmin.from("ai_reports").upsert(
      {
        period,
        reference_date: referenceDate,
        summary_text: report.summary_text,
        content: report,
      },
      { onConflict: "period,reference_date" }
    );

    if (error) throw error;

    return NextResponse.json({ ok: true, period, reference_date: referenceDate });
  } catch (err) {
    console.error(`[cron/generate-report] falha ao gerar relatório ${period}:`, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
