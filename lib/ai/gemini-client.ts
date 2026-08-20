// lib/ai/gemini-client.ts
//
// Client único do Gemini, compartilhado entre a geração de relatórios
// (Fase 5) e a análise do IA Match — evita instanciar o SDK duas vezes
// com a mesma API key.

import "server-only";
import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// "gemini-flash-latest" é um alias oficial que a Google troca automaticamente
// pra versão Flash mais recente — evita hardcodear uma versão específica que
// vai ficar desatualizada. Se um dia der 404, confira o nome atual em
// ai.google.dev/gemini-api/docs/models e ajusta a env var, sem precisar
// mexer em código.
export const GEMINI_MODEL = process.env.AI_REPORT_MODEL || "gemini-flash-latest";
