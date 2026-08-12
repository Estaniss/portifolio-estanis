// lib/analytics/tracker.tsx
//
// ATUALIZAÇÃO FASE 4: substitui a versão da Fase 1/2. Única mudança é
// expor `sessionContext` no retorno de useTracker() — o hook de IA Match
// (use-ia-match.ts) precisa do visitorId pra gravar a análise. Todo o
// resto (provider, pageview automático, fila de eventos) é idêntico.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { enqueue, initQueue, flush } from "./queue";
import {
  EVENT_TYPES,
  type EventType,
  type SessionContext,
  type ProjectEventPayload,
  type ProjectTimeSpentPayload,
  type SectionViewPayload,
  type DownloadPayload,
  type ContactClickPayload,
  type IaMatchEventPayload,
} from "./events";

const VISITOR_COOKIE = "pf_visitor_id";
const COOKIE_MAX_AGE_DAYS = 400;

type TrackPayload =
  | Record<string, unknown>
  | ProjectEventPayload
  | ProjectTimeSpentPayload
  | SectionViewPayload
  | DownloadPayload
  | ContactClickPayload
  | IaMatchEventPayload;

interface TrackerContextValue {
  track: (eventType: EventType, payload?: TrackPayload) => void;
  sessionContext: SessionContext | null;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

function getOrCreateVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE);
  if (existing) return existing;

  const id = crypto.randomUUID();
  writeCookie(VISITOR_COOKIE, id, COOKIE_MAX_AGE_DAYS);
  return id;
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function detectDeviceType(): SessionContext["deviceType"] {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialized = useRef(false);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(
    null
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const context: SessionContext = {
      visitorId: getOrCreateVisitorId(),
      referrer: document.referrer || null,
      language: navigator.language,
      deviceType: detectDeviceType(),
    };

    initQueue(context);
    setSessionContext(context);
  }, []);

  useEffect(() => {
    enqueue({
      eventType: EVENT_TYPES.PAGEVIEW,
      pagePath: pathname,
      occurredAt: new Date().toISOString(),
    });
  }, [pathname]);

  useEffect(() => {
    return () => flush();
  }, []);

  const track: TrackerContextValue["track"] = (eventType, payload) => {
    enqueue({
      eventType,
      payload,
      pagePath: window.location.pathname,
      occurredAt: new Date().toISOString(),
    });
  };

  return (
    <TrackerContext.Provider value={{ track, sessionContext }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error("useTracker precisa estar dentro de <AnalyticsProvider>");
  }
  return ctx;
}
