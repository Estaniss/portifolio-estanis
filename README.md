# Portfolio Analytics — Projeto completo (Fases 1-5)

Next.js criado do zero, com as 5 fases integradas, buildadas e testadas
neste ambiente. Falta só apontar pro seu Supabase e Gemini reais.

## Estrutura

```
app/
├── page.tsx                        → home de teste (projetos + IA Match + contato)
├── login/page.tsx                  → login do admin
├── admin/
│   ├── layout.tsx                  → navegação entre as páginas do painel
│   ├── page.tsx                    → visão geral (Fase 1)
│   ├── projetos/page.tsx           → projetos e tecnologias (Fase 2)
│   ├── conversoes/page.tsx         → funil, downloads, contatos (Fase 3)
│   ├── ia-match/page.tsx           → IA Match Analytics (Fase 4)
│   └── relatorios/page.tsx         → relatórios de IA (Fase 5)
└── api/
    ├── analytics/
    │   ├── events/route.ts                    → ingestão em lote
    │   ├── ia-match/route.ts                   → grava cada análise
    │   └── dashboard/*/route.ts                → uma rota de agregação por página admin
    └── cron/generate-report/route.ts           → gerado pelo Vercel Cron

lib/
├── analytics/    → tracker, fila/batch, tipos de evento, hooks de projeto/ia-match/seção
├── supabase/     → client server-side (service role)
├── auth/         → proteção das rotas /admin
└── ai/           → resumo compacto + chamada ao Gemini

components/
├── admin/        → KpiCard, gráficos (Bar/Line/Funnel), ReportCard
├── analytics/    → TrackedProjectLink, TrackedDownloadLink, TrackedContactLink, TrackedSection
├── projects/     → ProjectCard de exemplo
├── contact/      → ContactSection de exemplo (downloads + canais + form)
└── ia-match/     → IaMatchTool de exemplo (simula uma análise)

sql/
├── 001_schema_fase1.sql               → sessions, events
├── 002_schema_fase3.sql               → funnel_steps (histórico)
├── 003_schema_fase4.sql               → ia_match_runs
├── 004_schema_fase5.sql               → ai_reports
└── 005_ajuste_funil_single_page.sql   → funil de 5 passos (single-page)

vercel.json                → agenda dos 3 cron jobs de relatório
```

Pra um projeto Supabase **novo**, é mais rápido usar o `schema-completo.sql`
consolidado (já no formato final) em vez dos 5 arquivos em sequência —
pergunta se eu não te mandei ele ainda.

## Passo a passo pra testar com dados reais

### 1. Supabase
1. Cria o projeto.
2. SQL Editor → roda o schema (completo ou os 5 arquivos de `sql/` em ordem).
3. Authentication → Users → cria seu usuário admin.

### 2. Gemini (Google AI Studio)
Em aistudio.google.com → Get API key → cria uma key. Camada gratuita,
sem cartão de crédito — é o que alimenta a Fase 5.

### 3. Variáveis de ambiente
```bash
cp .env.local.example .env.local
```
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
CRON_SECRET=qualquer-string-aleatoria-longa
AI_REPORT_MODEL=gemini-flash-latest
```

### 4. Instalar e rodar
```bash
npm install
npm run dev
```

### 5. Gerar dados de teste
1. Abre `http://localhost:3000`, navega pelos projetos.
2. Clica em "Analisar compatibilidade" no card IA Match.
3. Clica num canal de contato e/ou testa o download (aponta pra PDFs
   placeholder — o clique é rastreado mesmo assim, o download em si
   vai dar 404 até você trocar pelos arquivos reais).
4. Envia o formulário de contato (simulado, mas dispara `contact_submit`).
5. Loga em `/login`, navega pelas 5 abas do `/admin`.
6. Gera um relatório na mão:
   ```bash
   curl "http://localhost:3000/api/cron/generate-report?period=weekly" -H "Authorization: Bearer SEU_CRON_SECRET"
   ```
   (cuidado com quebra de linha ao colar — usa numa linha só). Depois
   recarrega `/admin/relatorios`.

## O que foi validado neste ambiente

- ✅ `npm run build` — 18 rotas, todas classificadas corretamente.
- ✅ Todas as 5 páginas `/admin/*` redirecionam pra `/login` sem sessão.
- ✅ `POST /api/analytics/events` e `POST /api/analytics/ia-match` chegam até chamar o Supabase.
- ✅ `GET /api/cron/generate-report` sem header → 401 (`CRON_SECRET` funcionando).
- ✅ Com credenciais reais de Supabase e Gemini (testado por você, não neste
  ambiente sandbox — Gemini não está na lista de domínios liberados aqui),
  o fluxo completo gera o relatório e aparece em `/admin/relatorios`.
- 🐛→✅ **Bug corrigido**: `build-summary.ts` engolia erros do Supabase
  silenciosamente. Corrigido pra abortar a geração em vez de gerar um
  relatório com dados vazios.
- 🔁 **Troca de provedor de IA**: a integração original usava a API da
  Anthropic; trocamos pro Gemini (Google AI Studio) por causa da camada
  gratuita. O Gemini usa `responseSchema` nativo — a resposta já vem
  validada contra o formato exato que o dashboard espera, sem precisar
  de lógica pra limpar markdown ou torcer pra vir JSON válido.

## Próximos passos pra você

- Trocar os PDFs placeholder pelos seus currículos reais.
- Trocar `IaMatchTool.tsx` (simulado) pela sua ferramenta real de análise via LLM.
- Trocar `NODE_TLS_REJECT_UNAUTHORIZED=0` (usado pra contornar o proxy
  corporativo em dev) pelo fix definitivo com `NODE_EXTRA_CA_CERTS`.
