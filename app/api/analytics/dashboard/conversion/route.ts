// app/api/analytics/dashboard/conversion/route.ts
//
// Junta funil, downloads e contatos numa rota só, porque as três
// seções da spec (Funil de Conversão, Downloads, Contatos) são,
// na prática, a mesma pergunta — "o que acontece no fim do funil" —
// e compartilham a mesma janela de eventos. Evita 3 round-trips
// pro Supabase pra montar uma única página de dashboard.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EVENT_TYPES } from "@/lib/analytics/events";
import type {
  DownloadPayload,
  ContactClickPayload,
} from "@/lib/analytics/events";

interface FunnelStepRow {
  step_order: number;
  step_name: string;
  event_type: string;
  match_value: string | null;
}

interface EventRow {
  session_id: string;
  event_type: string;
  event_payload: Record<string, unknown>;
  page_path: string | null;
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [stepsResult, sessionsResult, eventsResult] = await Promise.all([
    supabaseAdmin
      .from("funnel_steps")
      .select("step_order, step_name, event_type, match_value")
      .order("step_order", { ascending: true }),
    supabaseAdmin
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .gte("started_at", since),
    supabaseAdmin
      .from("events")
      .select("session_id, event_type, event_payload, page_path")
      .gte("occurred_at", since),
  ]);

  if (stepsResult.error || sessionsResult.error || eventsResult.error) {
    console.error(
      "[dashboard/conversion] erro:",
      stepsResult.error ?? sessionsResult.error ?? eventsResult.error
    );
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const steps = (stepsResult.data ?? []) as FunnelStepRow[];
  const totalSessions = sessionsResult.count ?? 0;
  const events = (eventsResult.data ?? []) as EventRow[];

  const funnel = buildFunnel(steps, events, totalSessions);
  const downloads = buildDownloadsBreakdown(events);
  const contacts = buildContactsBreakdown(events, totalSessions);

  return NextResponse.json({
    range_days: days,
    total_sessions: totalSessions,
    funnel,
    downloads,
    contacts,
  });
}

function buildFunnel(
  steps: FunnelStepRow[],
  events: EventRow[],
  totalSessions: number
) {
  const nodes = [{ step_name: "Visitante", sessions: totalSessions }];

  for (const step of steps) {
    const matchingSessions = new Set<string>();

    for (const event of events) {
      if (event.event_type !== step.event_type) continue;

      if (
        step.event_type === EVENT_TYPES.PAGEVIEW &&
        step.match_value &&
        !event.page_path?.startsWith(step.match_value)
      ) {
        continue;
      }

      if (step.event_type === EVENT_TYPES.SECTION_VIEW && step.match_value) {
        const section = (event.event_payload as { section?: string })?.section;
        if (section !== step.match_value) continue;
      }

      matchingSessions.add(event.session_id);
    }

    nodes.push({ step_name: step.step_name, sessions: matchingSessions.size });
  }

  return nodes.map((node, index) => {
    const previous = index > 0 ? nodes[index - 1].sessions : node.sessions;
    const conversionFromPrevious =
      previous > 0 ? Number((node.sessions / previous).toFixed(3)) : 0;
    const conversionFromStart =
      totalSessions > 0
        ? Number((node.sessions / totalSessions).toFixed(3))
        : 0;

    return {
      step: node.step_name,
      sessions: node.sessions,
      conversion_from_previous: index === 0 ? 1 : conversionFromPrevious,
      conversion_from_start: conversionFromStart,
    };
  });
}

function buildDownloadsBreakdown(events: EventRow[]) {
  const byType = new Map<string, number>();
  const byLanguage = new Map<string, number>();
  let total = 0;

  for (const event of events) {
    if (event.event_type !== EVENT_TYPES.DOWNLOAD_CV) continue;
    const payload = event.event_payload as unknown as DownloadPayload;
    total += 1;
    byType.set(payload.document_type, (byType.get(payload.document_type) ?? 0) + 1);
    byLanguage.set(payload.language, (byLanguage.get(payload.language) ?? 0) + 1);
  }

  return {
    total,
    by_type: Object.fromEntries(byType),
    by_language: Object.fromEntries(byLanguage),
  };
}

function buildContactsBreakdown(events: EventRow[], totalSessions: number) {
  const clicksByChannel = new Map<string, number>();
  let formSubmits = 0;

  for (const event of events) {
    if (event.event_type === EVENT_TYPES.CONTACT_CLICK) {
      const payload = event.event_payload as unknown as ContactClickPayload;
      clicksByChannel.set(
        payload.channel,
        (clicksByChannel.get(payload.channel) ?? 0) + 1
      );
    }
    if (event.event_type === EVENT_TYPES.CONTACT_SUBMIT) {
      formSubmits += 1;
    }
  }

  const channels = Array.from(clicksByChannel.entries()).map(
    ([channel, clicks]) => ({
      channel,
      clicks,
      conversion_rate:
        totalSessions > 0 ? Number((clicks / totalSessions).toFixed(3)) : 0,
    })
  );

  return {
    channels,
    form_submits: formSubmits,
    form_conversion_rate:
      totalSessions > 0
        ? Number((formSubmits / totalSessions).toFixed(3))
        : 0,
  };
}
