// app/api/analytics/events/route.ts
//
// ATUALIZAÇÃO FASE 4: substitui a versão da Fase 1. Única mudança é
// importar resolveSession/bumpSessionActivity de lib/analytics/resolve-session.ts
// em vez de ter a lógica duplicada aqui. Nada do comportamento mudou.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { resolveSession, bumpSessionActivity } from "@/lib/analytics/resolve-session";
import type { SessionContext, TrackedEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/events";

interface IngestBody {
  session: SessionContext;
  events: TrackedEvent[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IngestBody;

    if (!body?.session?.visitorId || !Array.isArray(body.events)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const sessionId = await resolveSession(body.session, request);
    if (!sessionId) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const rows = body.events.map((event) => ({
      session_id: sessionId,
      event_type: event.eventType,
      event_payload: event.payload ?? {},
      page_path: event.pagePath,
      occurred_at: event.occurredAt,
    }));

    if (rows.length > 0) {
      const { error } = await supabaseAdmin.from("events").insert(rows);
      if (error) throw error;
    }

    const pageviewCount = body.events.filter(
      (e) => e.eventType === EVENT_TYPES.PAGEVIEW
    ).length;

    if (pageviewCount > 0) {
      await bumpSessionActivity(sessionId, pageviewCount);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[analytics/events] falha na ingestão:", err);
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
