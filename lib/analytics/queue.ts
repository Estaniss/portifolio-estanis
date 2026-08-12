// lib/analytics/queue.ts
//
// Fila de eventos em memória. Junta eventos por um curto período
// e envia em lote, em vez de 1 request por clique — reduz carga
// no endpoint de ingestão e evita travar a navegação do visitante.

import type { TrackedEvent, SessionContext } from "./events";

const FLUSH_INTERVAL_MS = 8000;
const ENDPOINT = "/api/analytics/events";

let queue: TrackedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let sessionContext: SessionContext | null = null;

export function initQueue(context: SessionContext) {
  sessionContext = context;

  if (typeof window === "undefined") return;

  // Garante envio quando o usuário troca de aba ou fecha —
  // é o único momento em que sendBeacon tem entrega confiável.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

export function enqueue(event: TrackedEvent) {
  queue.push(event);

  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flush();
    }, FLUSH_INTERVAL_MS);
  }
}

export function flush() {
  if (queue.length === 0 || !sessionContext) return;

  const batch = queue;
  queue = [];

  const body = JSON.stringify({
    session: sessionContext,
    events: batch,
  });

  // sendBeacon garante que o request sai mesmo se a aba estiver fechando.
  // Fallback pra fetch keepalive em browsers sem sendBeacon (raro hoje em dia).
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon(ENDPOINT, blob);
    if (sent) return;
  }

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Falha silenciosa de propósito: analytics não pode quebrar a navegação.
  });
}
