// lib/analytics/resolve-session.ts
//
// REFATORAÇÃO FASE 4: essa lógica vivia só dentro de
// app/api/analytics/events/route.ts (Fase 1). A rota nova de IA Match
// também precisa resolver a sessão do visitante, então extraí pra cá.
//
// app/api/analytics/events/route.ts da Fase 4 já vem atualizado
// importando daqui — se você editou aquele arquivo depois da Fase 1,
// confira o diff antes de substituir.

import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { parseUserAgent, classifyReferrer } from "./parse-request";
import type { SessionContext } from "./events";

const SESSION_IDLE_MINUTES = 30;

export async function resolveSession(
  context: SessionContext,
  request: Request
): Promise<string | null> {
  const idleThreshold = new Date(
    Date.now() - SESSION_IDLE_MINUTES * 60 * 1000
  ).toISOString();

  const { data: existing } = await supabaseAdmin
    .from("sessions")
    .select("id")
    .eq("visitor_id", context.visitorId)
    .gte("started_at", idleThreshold)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const ua = request.headers.get("user-agent");
  const { browser, os } = parseUserAgent(ua);
  const country = request.headers.get("x-vercel-ip-country");
  const city = request.headers.get("x-vercel-ip-city");

  const { data: created, error } = await supabaseAdmin
    .from("sessions")
    .insert({
      visitor_id: context.visitorId,
      referrer: context.referrer,
      referrer_source: classifyReferrer(context.referrer),
      country: country ? decodeURIComponent(country) : null,
      city: city ? decodeURIComponent(city) : null,
      language: context.language,
      device_type: context.deviceType,
      browser,
      os,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[resolve-session] falha ao criar sessão:", error);
    return null;
  }

  return created.id;
}

export async function bumpSessionActivity(
  sessionId: string,
  newPageviews: number
) {
  const { data: session } = await supabaseAdmin
    .from("sessions")
    .select("pageview_count")
    .eq("id", sessionId)
    .single();

  const totalPageviews = (session?.pageview_count ?? 0) + newPageviews;

  await supabaseAdmin
    .from("sessions")
    .update({
      pageview_count: totalPageviews,
      ended_at: new Date().toISOString(),
      is_bounce: totalPageviews <= 1,
    })
    .eq("id", sessionId);
}
