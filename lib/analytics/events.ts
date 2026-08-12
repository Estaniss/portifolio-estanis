// lib/analytics/events.ts
//
// ATUALIZAÇÃO FASE 4: adiciona IaMatchEventPayload (usado só no evento leve
// que alimenta o funil — os dados completos da análise vão pra tabela
// dedicada ia_match_runs, não pra `events`. Ver use-ia-match.ts).

export const EVENT_TYPES = {
  PAGEVIEW: "pageview",
  SESSION_END: "session_end",

  // Fase 2 (projetos)
  PROJECT_VIEW: "project_view",
  PROJECT_TIME_SPENT: "project_time_spent",
  CLICK_GITHUB: "click_github",
  CLICK_DEMO: "click_demo",
  CLICK_CASE: "click_case",

  // Fase 3 (funil / downloads / contato)
  SECTION_VIEW: "section_view",
  DOWNLOAD_CV: "download_cv",
  CONTACT_CLICK: "contact_click",
  CONTACT_SUBMIT: "contact_submit",

  // Fase 4 (IA Match)
  IA_MATCH_RUN: "ia_match_run",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface TrackedEvent {
  eventType: EventType;
  payload?:
    | Record<string, unknown>
    | ProjectEventPayload
    | ProjectTimeSpentPayload
    | SectionViewPayload
    | DownloadPayload
    | ContactClickPayload
    | IaMatchEventPayload;
  pagePath: string;
  occurredAt: string; // ISO string, gerado no client
}

export interface SessionContext {
  visitorId: string;
  referrer: string | null;
  language: string;
  deviceType: "desktop" | "mobile" | "tablet";
}

// Payloads da Fase 2
export interface ProjectEventPayload {
  project_id: string;
  project_name: string;
  technologies?: string[];
}

export interface ProjectTimeSpentPayload extends ProjectEventPayload {
  duration_seconds: number;
}

// Payloads da Fase 3
// Ajuste (portfólio single-page): "Home" some do funil — numa página só,
// ela é idêntica a "Visitante". "Projetos" vira um evento de scroll até a
// seção, via IntersectionObserver, em vez de pageview por rota.
export interface SectionViewPayload {
  section: string;
}

export type DocumentType = "cv_ats" | "cv_visual" | "cover_letter";
export type DocumentLanguage = "pt" | "en" | "es";

export interface DownloadPayload {
  document_type: DocumentType;
  language: DocumentLanguage;
}

export type ContactChannel = "whatsapp" | "linkedin" | "github" | "email";

export interface ContactClickPayload {
  channel: ContactChannel;
}

// Payload da Fase 4 — versão "leve" só pra contar no funil.
// Os dados completos (empresa, stack, skills...) vão pra ia_match_runs.
export interface IaMatchEventPayload {
  compatibility_score: number;
}
