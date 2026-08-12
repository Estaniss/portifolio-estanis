// app/api/analytics/dashboard/reports/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const periods = ["weekly", "monthly", "yearly"] as const;

  const results = await Promise.all(
    periods.map((period) =>
      supabaseAdmin
        .from("ai_reports")
        .select("period, reference_date, summary_text, content, created_at")
        .eq("period", period)
        .order("reference_date", { ascending: false })
        .limit(1)
        .maybeSingle()
    )
  );

  const reports = Object.fromEntries(
    periods.map((period, index) => [period, results[index].data ?? null])
  );

  return NextResponse.json(reports);
}
